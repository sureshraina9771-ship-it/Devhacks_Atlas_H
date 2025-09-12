from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from flask_socketio import SocketIO, emit
from datetime import datetime, date
import joblib
import numpy as np
import os
import requests
import google.generativeai as genai

import json

app = Flask(__name__)
CORS(app)
socketio = SocketIO(app, cors_allowed_origins="*")
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///cloud_hospital.db'
db = SQLAlchemy(app)

# AI Model paths
DATA_DIR = os.path.join(os.path.dirname(__file__), 'data')
MODEL_PATH = os.path.join(DATA_DIR, 'diagnosis_model.pkl')
SYMPTOM_LIST_PATH = os.path.join(DATA_DIR, 'symptom_list.pkl')
SEVERITY_MAP_PATH = os.path.join(DATA_DIR, 'severity_map.pkl')

# Load model and metadata once at startup
try:
    clf = joblib.load(MODEL_PATH)
    all_symptoms = joblib.load(SYMPTOM_LIST_PATH)
    severity_map = joblib.load(SEVERITY_MAP_PATH)
except Exception as e:
    clf = None
    all_symptoms = []
    severity_map = {}
    print("AI model not loaded:", e)

# Load health risk model and encoders
try:
    clf_health_risk = joblib.load(os.path.join(DATA_DIR, 'health_risk_model.pkl'))
    le_consciousness = joblib.load(os.path.join(DATA_DIR, 'consciousness_encoder.pkl'))
    le_risk = joblib.load(os.path.join(DATA_DIR, 'risk_encoder.pkl'))
except Exception as e:
    clf_health_risk = None
    le_consciousness = None
    le_risk = None
    print("Health risk model not loaded:", e)

# Helper to parse date/datetime strings
def parse_datetime(dt_str):
    if not dt_str:
        return None
    try:
        return datetime.fromisoformat(dt_str)
    except Exception:
        try:
            return datetime.strptime(dt_str, "%Y-%m-%d")
        except Exception:
            return None

def parse_date(dt_str):
    if not dt_str:
        return None
    try:
        return date.fromisoformat(dt_str)
    except Exception:
        try:
            return datetime.strptime(dt_str, "%Y-%m-%d").date()
        except Exception:
            return None

def symptoms_to_vector(input_symptoms):
    return [severity_map.get(symptom, 0) if symptom in input_symptoms else 0 for symptom in all_symptoms]


# User model
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    password = db.Column(db.String(120), nullable=False)
    role = db.Column(db.String(20), nullable=False)  # patient, doctor, admin

# Patient model
class Patient(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    name = db.Column(db.String(120))
    age = db.Column(db.Integer)
    gender = db.Column(db.String(10))
    address = db.Column(db.String(255))

# Doctor model
class Doctor(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    name = db.Column(db.String(120))
    specialization = db.Column(db.String(120))
    contact = db.Column(db.String(120))

# DiagnosticRecord model
class DiagnosticRecord(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    patient_id = db.Column(db.Integer, db.ForeignKey('patient.id'))
    symptoms = db.Column(db.String(255))
    diagnosis = db.Column(db.String(255))
    ai_result = db.Column(db.String(255))
    created_at = db.Column(db.DateTime)

# Teleconsultation model
class Teleconsultation(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    patient_id = db.Column(db.Integer, db.ForeignKey('patient.id'))
    doctor_id = db.Column(db.Integer, db.ForeignKey('doctor.id'))
    scheduled_time = db.Column(db.DateTime)
    notes = db.Column(db.Text)

# Medicine model
class Medicine(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120))
    batch_number = db.Column(db.String(50))
    expiry_date = db.Column(db.Date)
    is_fraudulent = db.Column(db.Boolean, default=False)

# MedicineDispense model
class MedicineDispense(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    patient_id = db.Column(db.Integer, db.ForeignKey('patient.id'))
    medicine_id = db.Column(db.Integer, db.ForeignKey('medicine.id'))
    quantity = db.Column(db.Integer)
    dispensed_at = db.Column(db.DateTime)

# HealthCredit model
class HealthCredit(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    patient_id = db.Column(db.Integer, db.ForeignKey('patient.id'))
    credits = db.Column(db.Integer)
    last_updated = db.Column(db.DateTime)

# MaternalHealthRecord model
class MaternalHealthRecord(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    patient_id = db.Column(db.Integer, db.ForeignKey('patient.id'))
    details = db.Column(db.Text)
    created_at = db.Column(db.DateTime)

# MedicineSwap model
class MedicineSwap(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    patient_id = db.Column(db.Integer, db.ForeignKey('patient.id'))
    old_medicine_id = db.Column(db.Integer, db.ForeignKey('medicine.id'))
    new_medicine_id = db.Column(db.Integer, db.ForeignKey('medicine.id'))
    status = db.Column(db.String(50))
    swapped_at = db.Column(db.DateTime)

# EpidemicAlert model
class EpidemicAlert(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    location = db.Column(db.String(120))
    disease = db.Column(db.String(120))
    risk_level = db.Column(db.String(50))
    alert_time = db.Column(db.DateTime)

# SanitaryPadVending model
class SanitaryPadVending(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    patient_id = db.Column(db.Integer, db.ForeignKey('patient.id'))
    quantity = db.Column(db.Integer)
    dispensed_at = db.Column(db.DateTime)

# Create tables
with app.app_context():
    db.create_all()

@app.route('/health')
def health():
    return {'status': 'API is working!'}

@app.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')
    role = data.get('role', 'patient')  # default to patient
    if User.query.filter_by(username=username).first():
        return jsonify({'message': 'Username already exists!'}), 400
    new_user = User(username=username, password=password, role=role)
    db.session.add(new_user)
    db.session.commit()
    # Automatically create Patient or Doctor record
    if role == 'patient':
        new_patient = Patient(user_id=new_user.id, name=username)
        db.session.add(new_patient)
        db.session.commit()
    elif role == 'doctor':
        new_doctor = Doctor(user_id=new_user.id, name=username)
        db.session.add(new_doctor)
        db.session.commit()
    return jsonify({'message': 'User registered!', 'username': username, 'role': role})

@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')
    user = User.query.filter_by(username=username, password=password).first()
    if user:
        return jsonify({'message': 'Login successful!', 'username': username, 'role': user.role})
    else:
        return jsonify({'message': 'Invalid credentials!'}), 401

@app.route('/diagnose', methods=['POST'])
def diagnose():
    data = request.get_json()
    symptoms = data.get('symptoms')
    username = data.get('username')
    diagnosis = "Possible diagnosis for symptoms: " + symptoms
    # Save to database
    user = User.query.filter_by(username=username).first()
    if not user:
        return jsonify({'message': 'User not found!'}), 404
    patient = Patient.query.filter_by(user_id=user.id).first()
    if not patient:
        return jsonify({'message': 'Patient record not found!'}), 404
    new_diag = DiagnosticRecord(patient_id=patient.id, symptoms=symptoms, diagnosis=diagnosis)
    db.session.add(new_diag)
    db.session.commit()
    return jsonify({'diagnosis': diagnosis})

@app.route('/diagnostic-history', methods=['POST'])
def diagnostic_history():
    data = request.get_json()
    username = data.get('username')
    user = User.query.filter_by(username=username).first()
    if not user:
        return jsonify({'message': 'User not found!'}), 404
    patient = Patient.query.filter_by(user_id=user.id).first()
    if not patient:
        return jsonify({'message': 'Patient record not found!'}), 404
    history = DiagnosticRecord.query.filter_by(patient_id=patient.id).all()
    result = [
        {
            'symptoms': diag.symptoms,
            'diagnosis': diag.diagnosis,
            'ai_result': diag.ai_result,
            'created_at': diag.created_at
        } for diag in history
    ]
    return jsonify({'history': result})

# Create a new patient (admin/doctor use)
@app.route('/patients', methods=['POST'])
def create_patient():
    data = request.get_json()
    user_id = data.get('user_id')
    name = data.get('name')
    age = data.get('age')
    gender = data.get('gender')
    address = data.get('address')
    patient = Patient(user_id=user_id, name=name, age=age, gender=gender, address=address)
    db.session.add(patient)
    db.session.commit()
    return jsonify({'message': 'Patient created!', 'patient_id': patient.id})

# Get all patients
@app.route('/patients', methods=['GET'])
def get_patients():
    patients = Patient.query.all()
    result = []
    for p in patients:
        result.append({
            'id': p.id,
            'user_id': p.user_id,
            'name': p.name,
            'age': p.age,
            'gender': p.gender,
            'address': p.address
        })
    return jsonify({'patients': result})

# Get a single patient by ID
@app.route('/patients/<int:patient_id>', methods=['GET'])
def get_patient(patient_id):
    p = Patient.query.get(patient_id)
    if not p:
        return jsonify({'message': 'Patient not found!'}), 404
    return jsonify({
        'id': p.id,
        'user_id': p.user_id,
        'name': p.name,
        'age': p.age,
        'gender': p.gender,
        'address': p.address
    })

# Update a patient
@app.route('/patients/<int:patient_id>', methods=['PUT'])
def update_patient(patient_id):
    p = Patient.query.get(patient_id)
    if not p:
        return jsonify({'message': 'Patient not found!'}), 404
    data = request.get_json()
    p.name = data.get('name', p.name)
    p.age = data.get('age', p.age)
    p.gender = data.get('gender', p.gender)
    p.address = data.get('address', p.address)
    db.session.commit()
    return jsonify({'message': 'Patient updated!'})

# Delete a patient
@app.route('/patients/<int:patient_id>', methods=['DELETE'])
def delete_patient(patient_id):
    p = Patient.query.get(patient_id)
    if not p:
        return jsonify({'message': 'Patient not found!'}), 404
    db.session.delete(p)
    db.session.commit()
    return jsonify({'message': 'Patient deleted!'})

# Create a new doctor (admin use)
@app.route('/doctors', methods=['POST'])
def create_doctor():
    data = request.get_json()
    user_id = data.get('user_id')
    name = data.get('name')
    specialization = data.get('specialization')
    contact = data.get('contact')
    doctor = Doctor(user_id=user_id, name=name, specialization=specialization, contact=contact)
    db.session.add(doctor)
    db.session.commit()
    return jsonify({'message': 'Doctor created!', 'doctor_id': doctor.id})

# Get all doctors
@app.route('/doctors', methods=['GET'])
def get_doctors():
    doctors = Doctor.query.all()
    result = []
    for d in doctors:
        result.append({
            'id': d.id,
            'user_id': d.user_id,
            'name': d.name,
            'specialization': d.specialization,
            'contact': d.contact
        })
    return jsonify({'doctors': result})

# Get a single doctor by ID
@app.route('/doctors/<int:doctor_id>', methods=['GET'])
def get_doctor(doctor_id):
    d = Doctor.query.get(doctor_id)
    if not d:
        return jsonify({'message': 'Doctor not found!'}), 404
    return jsonify({
        'id': d.id,
        'user_id': d.user_id,
        'name': d.name,
        'specialization': d.specialization,
        'contact': d.contact
    })
# Update a doctor
@app.route('/doctors/<int:doctor_id>', methods=['PUT'])
def update_doctor(doctor_id):
    d = Doctor.query.get(doctor_id)
    if not d:
        return jsonify({'message': 'Doctor not found!'}), 404
    data = request.get_json()
    d.name = data.get('name', d.name)
    d.specialization = data.get('specialization', d.specialization)
    d.contact = data.get('contact', d.contact)
    db.session.commit()
    return jsonify({'message': 'Doctor updated!'})

# Delete a doctor
@app.route('/doctors/<int:doctor_id>', methods=['DELETE'])
def delete_doctor(doctor_id):
    d = Doctor.query.get(doctor_id)
    if not d:
        return jsonify({'message': 'Doctor not found!'}), 404
    db.session.delete(d)
    db.session.commit()
    return jsonify({'message': 'Doctor deleted!'})

# Create a new diagnostic record
@app.route('/diagnostics', methods=['POST'])
def create_diagnostic():
    data = request.get_json()
    patient_id = data.get('patient_id')
    symptoms = data.get('symptoms')
    diagnosis = data.get('diagnosis')
    ai_result = data.get('ai_result')
    created_at = parse_datetime(data.get('created_at'))
    record = DiagnosticRecord(
        patient_id=patient_id,
        symptoms=symptoms,
        diagnosis=diagnosis,
        ai_result=ai_result,
        created_at=created_at
    )
    db.session.add(record)
    db.session.commit()
    return jsonify({'message': 'Diagnostic record created!', 'diagnostic_id': record.id})

# Get all diagnostic records
@app.route('/diagnostics', methods=['GET'])
def get_diagnostics():
    diagnostics = DiagnosticRecord.query.all()
    result = []
    for d in diagnostics:
        result.append({
            'id': d.id,
            'patient_id': d.patient_id,
            'symptoms': d.symptoms,
            'diagnosis': d.diagnosis,
            'ai_result': d.ai_result,
            'created_at': d.created_at
        })
    return jsonify({'diagnostics': result})

# Get a single diagnostic record by ID
@app.route('/diagnostics/<int:diagnostic_id>', methods=['GET'])
def get_diagnostic(diagnostic_id):
    d = DiagnosticRecord.query.get(diagnostic_id)
    if not d:
        return jsonify({'message': 'Diagnostic record not found!'}), 404
    return jsonify({
        'id': d.id,
        'patient_id': d.patient_id,
        'symptoms': d.symptoms,
        'diagnosis': d.diagnosis,
        'ai_result': d.ai_result,
        'created_at': d.created_at
    })

# Update a diagnostic record
@app.route('/diagnostics/<int:diagnostic_id>', methods=['PUT'])
def update_diagnostic(diagnostic_id):
    d = DiagnosticRecord.query.get(diagnostic_id)
    if not d:
        return jsonify({'message': 'Diagnostic record not found!'}), 404
    data = request.get_json()
    d.symptoms = data.get('symptoms', d.symptoms)
    d.diagnosis = data.get('diagnosis', d.diagnosis)
    d.ai_result = data.get('ai_result', d.ai_result)
    db.session.commit()
    return jsonify({'message': 'Diagnostic record updated!'})

# Delete a diagnostic record
@app.route('/diagnostics/<int:diagnostic_id>', methods=['DELETE'])
def delete_diagnostic(diagnostic_id):
    d = DiagnosticRecord.query.get(diagnostic_id)
    if not d:
        return jsonify({'message': 'Diagnostic record not found!'}), 404
    db.session.delete(d)
    db.session.commit()
    return jsonify({'message': 'Diagnostic record deleted!'})

# Create a new teleconsultation
@app.route('/teleconsultations', methods=['POST'])
def create_teleconsultation():
    data = request.get_json()
    patient_id = data.get('patient_id')
    doctor_id = data.get('doctor_id')
    scheduled_time = parse_datetime(data.get('scheduled_time'))
    notes = data.get('notes')
    tele = Teleconsultation(
        patient_id=patient_id,
        doctor_id=doctor_id,
        scheduled_time=scheduled_time,
        notes=notes
    )
    db.session.add(tele)
    db.session.commit()
    return jsonify({'message': 'Teleconsultation created!', 'teleconsultation_id': tele.id})

# Get all teleconsultations
@app.route('/teleconsultations', methods=['GET'])
def get_teleconsultations():
    teleconsultations = Teleconsultation.query.all()
    result = []
    for t in teleconsultations:
        result.append({
            'id': t.id,
            'patient_id': t.patient_id,
            'doctor_id': t.doctor_id,
            'scheduled_time': t.scheduled_time,
            'notes': t.notes
        })
    return jsonify({'teleconsultations': result})

# Get a single teleconsultation by ID
@app.route('/teleconsultations/<int:tele_id>', methods=['GET'])
def get_teleconsultation(tele_id):
    t = Teleconsultation.query.get(tele_id)
    if not t:
        return jsonify({'message': 'Teleconsultation not found!'}), 404
    return jsonify({
        'id': t.id,
        'patient_id': t.patient_id,
        'doctor_id': t.doctor_id,
        'scheduled_time': t.scheduled_time,
        'notes': t.notes
    })
# Update a patient
@app.route('/patients/<int:patient_id>', methods=['PUT'])
def update_patient(patient_id):
    p = Patient.query.get(patient_id)
    if not p:
        return jsonify({'message': 'Patient not found!'}), 404
    data = request.get_json()
    p.name = data.get('name', p.name)
    p.age = data.get('age', p.age)
    p.gender = data.get('gender', p.gender)
    p.address = data.get('address', p.address)
    db.session.commit()
    return jsonify({'message': 'Patient updated!'})

# Delete a patient
@app.route('/patients/<int:patient_id>', methods=['DELETE'])
def delete_patient(patient_id):
    p = Patient.query.get(patient_id)
    if not p:
        return jsonify({'message': 'Patient not found!'}), 404
    db.session.delete(p)
    db.session.commit()
    return jsonify({'message': 'Patient deleted!'})

# Create a new doctor (admin use)
@app.route('/doctors', methods=['POST'])
def create_doctor():
    data = request.get_json()
    user_id = data.get('user_id')
    name = data.get('name')
    specialization = data.get('specialization')
    contact = data.get('contact')
    doctor = Doctor(user_id=user_id, name=name, specialization=specialization, contact=contact)
    db.session.add(doctor)
    db.session.commit()
    return jsonify({'message': 'Doctor created!', 'doctor_id': doctor.id})

# Get all doctors
@app.route('/doctors', methods=['GET'])
def get_doctors():
    doctors = Doctor.query.all()
    result = []
    for d in doctors:
        result.append({
            'id': d.id,
            'user_id': d.user_id,
            'name': d.name,
            'specialization': d.specialization,
            'contact': d.contact
        })
    return jsonify({'doctors': result})

# Get a single doctor by ID
@app.route('/doctors/<int:doctor_id>', methods=['GET'])
def get_doctor(doctor_id):
    d = Doctor.query.get(doctor_id)
    if not d:
        return jsonify({'message': 'Doctor not found!'}), 404
    return jsonify({
        'id': d.id,
        'user_id': d.user_id,
        'name': d.name,
        'specialization': d.specialization,
        'contact': d.contact
    })

# Update a doctor
@app.route('/doctors/<int:doctor_id>', methods=['PUT'])
def update_doctor(doctor_id):
    d = Doctor.query.get(doctor_id)
    if not d:
        return jsonify({'message': 'Doctor not found!'}), 404
    data = request.get_json()
    d.name = data.get('name', d.name)
    d.specialization = data.get('specialization', d.specialization)
    d.contact = data.get('contact', d.contact)
    db.session.commit()
    return jsonify({'message': 'Doctor updated!'})

# Delete a doctor
@app.route('/doctors/<int:doctor_id>', methods=['DELETE'])
def delete_doctor(doctor_id):
    d = Doctor.query.get(doctor_id)
    if not d:
        return jsonify({'message': 'Doctor not found!'}), 404
    db.session.delete(d)
    db.session.commit()
    return jsonify({'message': 'Doctor deleted!'})

# Create a new diagnostic record
@app.route('/diagnostics', methods=['POST'])
def create_diagnostic():
    data = request.get_json()
    patient_id = data.get('patient_id')
    symptoms = data.get('symptoms')
    diagnosis = data.get('diagnosis')
    ai_result = data.get('ai_result')
    created_at = parse_datetime(data.get('created_at'))
    record = DiagnosticRecord(
        patient_id=patient_id,
        symptoms=symptoms,
        diagnosis=diagnosis,
        ai_result=ai_result,
        created_at=created_at
    )
    db.session.add(record)
    db.session.commit()
    return jsonify({'message': 'Diagnostic record created!', 'diagnostic_id': record.id})

# Get all diagnostic records
@app.route('/diagnostics', methods=['GET'])
def get_diagnostics():
    diagnostics = DiagnosticRecord.query.all()
    result = []
    for d in diagnostics:
        result.append({
            'id': d.id,
            'patient_id': d.patient_id,
            'symptoms': d.symptoms,
            'diagnosis': d.diagnosis,
            'ai_result': d.ai_result,
            'created_at': d.created_at
        })
    return jsonify({'diagnostics': result})

# Get a single diagnostic record by ID
@app.route('/diagnostics/<int:diagnostic_id>', methods=['GET'])
def get_diagnostic(diagnostic_id):
    d = DiagnosticRecord.query.get(diagnostic_id)
    if not d:
        return jsonify({'message': 'Diagnostic record not found!'}), 404
    return jsonify({
        'id': d.id,
        'patient_id': d.patient_id,
        'symptoms': d.symptoms,
        'diagnosis': d.diagnosis,
        'ai_result': d.ai_result,
        'created_at': d.created_at
    })

# Update a diagnostic record
@app.route('/diagnostics/<int:diagnostic_id>', methods=['PUT'])
def update_diagnostic(diagnostic_id):
    d = DiagnosticRecord.query.get(diagnostic_id)
    if not d:
        return jsonify({'message': 'Diagnostic record not found!'}), 404
    data = request.get_json()
    d.symptoms = data.get('symptoms', d.symptoms)
    d.diagnosis = data.get('diagnosis', d.diagnosis)
    d.ai_result = data.get('ai_result', d.ai_result)
    db.session.commit()
    return jsonify({'message': 'Diagnostic record updated!'})

# Delete a diagnostic record
@app.route('/diagnostics/<int:diagnostic_id>', methods=['DELETE'])
def delete_diagnostic(diagnostic_id):
    d = DiagnosticRecord.query.get(diagnostic_id)
    if not d:
        return jsonify({'message': 'Diagnostic record not found!'}), 404
    db.session.delete(d)
    db.session.commit()
    return jsonify({'message': 'Diagnostic record deleted!'})

# Create a new teleconsultation
@app.route('/teleconsultations', methods=['POST'])
def create_teleconsultation():
    data = request.get_json()
    patient_id = data.get('patient_id')
    doctor_id = data.get('doctor_id')
    scheduled_time = parse_datetime(data.get('scheduled_time'))
    notes = data.get('notes')
    tele = Teleconsultation(
        patient_id=patient_id,
        doctor_id=doctor_id,
        scheduled_time=scheduled_time,
        notes=notes
    )
    db.session.add(tele)
    db.session.commit()
    return jsonify({'message': 'Teleconsultation created!', 'teleconsultation_id': tele.id})

# Get all teleconsultations
@app.route('/teleconsultations', methods=['GET'])
def get_teleconsultations():
    teleconsultations = Teleconsultation.query.all()
    result = []
    for t in teleconsultations:
        result.append({
            'id': t.id,
            'patient_id': t.patient_id,
            'doctor_id': t.doctor_id,
            'scheduled_time': t.scheduled_time,
            'notes': t.notes
        })
    return jsonify({'teleconsultations': result})

# Get a single teleconsultation by ID
@app.route('/teleconsultations/<int:tele_id>', methods=['GET'])
def get_teleconsultation(tele_id):
    t = Teleconsultation.query.get(tele_id)
    if not t:
        return jsonify({'message': 'Teleconsultation not found!'}), 404
    return jsonify({
        'id': t.id,
        'patient_id': t.patient_id,
        'doctor_id': t.doctor_id,
        'scheduled_time': t.scheduled_time,
        'notes': t.notes
    })

# Update a teleconsultation
@app.route('/teleconsultations/<int:tele_id>', methods=['PUT'])
def update_teleconsultation(tele_id):
    t = Teleconsultation.query.get(tele_id)
    if not t:
        return jsonify({'message': 'Teleconsultation not found!'}), 404
    data = request.get_json()
    t.scheduled_time = data.get('scheduled_time', t.scheduled_time)
    t.notes = data.get('notes', t.notes)
    db.session.commit()
    return jsonify({'message': 'Teleconsultation updated!'})

# Delete a teleconsultation
@app.route('/teleconsultations/<int:tele_id>', methods=['DELETE'])
def delete_teleconsultation(tele_id):
    t = Teleconsultation.query.get(tele_id)
    if not t:
        return jsonify({'message': 'Teleconsultation not found!'}), 404
    db.session.delete(t)
    db.session.commit()
    return jsonify({'message': 'Teleconsultation deleted!'})

# Create a new medicine
@app.route('/medicines', methods=['POST'])
def create_medicine():
    data = request.get_json()
    name = data.get('name')
    batch_number = data.get('batch_number')
    expiry_date = parse_date(data.get('expiry_date'))
    is_fraudulent = data.get('is_fraudulent', False)
    medicine = Medicine(
        name=name,
        batch_number=batch_number,
        expiry_date=expiry_date,
        is_fraudulent=is_fraudulent
    )
    db.session.add(medicine)
    db.session.commit()
    return jsonify({'message': 'Medicine created!', 'medicine_id': medicine.id})

# Get all medicines
@app.route('/medicines', methods=['GET'])
def get_medicines():
    medicines = Medicine.query.all()
    result = []
    for m in medicines:
        result.append({
            'id': m.id,
            'name': m.name,
            'batch_number': m.batch_number,
            'expiry_date': m.expiry_date,
            'is_fraudulent': m.is_fraudulent
        })
    return jsonify({'medicines': result})

# Get a single medicine by ID
@app.route('/medicines/<int:medicine_id>', methods=['GET'])
def get_medicine(medicine_id):
    m = Medicine.query.get(medicine_id)
    if not m:
        return jsonify({'message': 'Medicine not found!'}), 404
    return jsonify({
        'id': m.id,
        'name': m.name,
        'batch_number': m.batch_number,
        'expiry_date': m.expiry_date,
        'is_fraudulent': m.is_fraudulent
    })

# Update a medicine
@app.route('/medicines/<int:medicine_id>', methods=['PUT'])
def update_medicine(medicine_id):
    m = Medicine.query.get(medicine_id)
    if not m:
        return jsonify({'message': 'Medicine not found!'}), 404
    data = request.get_json()
    m.name = data.get('name', m.name)
    m.batch_number = data.get('batch_number', m.batch_number)
    m.expiry_date = data.get('expiry_date', m.expiry_date)
    m.is_fraudulent = data.get('is_fraudulent', m.is_fraudulent)
    db.session.commit()
    return jsonify({'message': 'Medicine updated!'})

# Delete a medicine
@app.route('/medicines/<int:medicine_id>', methods=['DELETE'])
def delete_medicine(medicine_id):
    m = Medicine.query.get(medicine_id)
    if not m:
        return jsonify({'message': 'Medicine not found!'}), 404
    db.session.delete(m)
    db.session.commit()
    return jsonify({'message': 'Medicine deleted!'})

# Create a new medicine dispense record
@app.route('/medicine-dispenses', methods=['POST'])
def create_medicine_dispense():
    data = request.get_json()
    patient_id = data.get('patient_id')
    medicine_id = data.get('medicine_id')
    quantity = data.get('quantity')
    dispensed_at = parse_datetime(data.get('dispensed_at'))
    dispense = MedicineDispense(
        patient_id=patient_id,
        medicine_id=medicine_id,
        quantity=quantity,
        dispensed_at=dispensed_at
    )
    db.session.add(dispense)
    db.session.commit()
    return jsonify({'message': 'Medicine dispensed!', 'dispense_id': dispense.id})

# Get all medicine dispense records
@app.route('/medicine-dispenses', methods=['GET'])
def get_medicine_dispenses():
    dispenses = MedicineDispense.query.all()
    result = []
    for d in dispenses:
        result.append({
            'id': d.id,
            'patient_id': d.patient_id,
            'medicine_id': d.medicine_id,
            'quantity': d.quantity,
            'dispensed_at': d.dispensed_at
        })
    return jsonify({'medicine_dispenses': result})

# Get a single medicine dispense record by ID
@app.route('/medicine-dispenses/<int:dispense_id>', methods=['GET'])
def get_medicine_dispense(dispense_id):
    d = MedicineDispense.query.get(dispense_id)
    if not d:
        return jsonify({'message': 'Medicine dispense record not found!'}), 404
    return jsonify({
        'id': d.id,
        'patient_id': d.patient_id,
        'medicine_id': d.medicine_id,
        'quantity': d.quantity,
        'dispensed_at': d.dispensed_at
    })

# Update a medicine dispense record
@app.route('/medicine-dispenses/<int:dispense_id>', methods=['PUT'])
def update_medicine_dispense(dispense_id):
    d = MedicineDispense.query.get(dispense_id)
    if not d:
        return jsonify({'message': 'Medicine dispense record not found!'}), 404
    data = request.get_json()
    d.quantity = data.get('quantity', d.quantity)
    d.dispensed_at = data.get('dispensed_at', d.dispensed_at)
    db.session.commit()
    return jsonify({'message': 'Medicine dispense record updated!'})

# Delete a medicine dispense record
@app.route('/medicine-dispenses/<int:dispense_id>', methods=['DELETE'])
def delete_medicine_dispense(dispense_id):
    d = MedicineDispense.query.get(dispense_id)
    if not d:
        return jsonify({'message': 'Medicine dispense record not found!'}), 404
    db.session.delete(d)
    db.session.commit()
    return jsonify({'message': 'Medicine dispense record deleted!'})

# Create a new health credit record
@app.route('/health-credits', methods=['POST'])
def create_health_credit():
    data = request.get_json()
    patient_id = data.get('patient_id')
    credits = data.get('credits')
    last_updated = parse_datetime(data.get('last_updated'))
    credit = HealthCredit(
        patient_id=patient_id,
        credits=credits,
        last_updated=last_updated
    )
    db.session.add(credit)
    db.session.commit()
    return jsonify({'message': 'Health credit record created!', 'health_credit_id': credit.id})

# Get all health credit records
@app.route('/health-credits', methods=['GET'])
def get_health_credits():
    credits = HealthCredit.query.all()
    result = []
    for c in credits:
        result.append({
            'id': c.id,
            'patient_id': c.patient_id,
            'credits': c.credits,
            'last_updated': c.last_updated
        })
    return jsonify({'health_credits': result})

# Get a single health credit record by ID
@app.route('/health-credits/<int:credit_id>', methods=['GET'])
def get_health_credit(credit_id):
    c = HealthCredit.query.get(credit_id)
    if not c:
        return jsonify({'message': 'Health credit record not found!'}), 404
    return jsonify({
        'id': c.id,
        'patient_id': c.patient_id,
        'credits': c.credits,
        'last_updated': c.last_updated
    })

# Update a health credit record
@app.route('/health-credits/<int:credit_id>', methods=['PUT'])
def update_health_credit(credit_id):
    c = HealthCredit.query.get(credit_id)
    if not c:
        return jsonify({'message': 'Health credit record not found!'}), 404
    data = request.get_json()
    c.credits = data.get('credits', c.credits)
    c.last_updated = data.get('last_updated', c.last_updated)
    db.session.commit()
    return jsonify({'message': 'Health credit record updated!'})

# Delete a health credit record
@app.route('/health-credits/<int:credit_id>', methods=['DELETE'])
def delete_health_credit(credit_id):
    c = HealthCredit.query.get(credit_id)
    if not c:
        return jsonify({'message': 'Health credit record not found!'}), 404
    db.session.delete(c)
    db.session.commit()
    return jsonify({'message': 'Health credit record deleted!'})

# Create a new maternal health record
@app.route('/maternal-health-records', methods=['POST'])
def create_maternal_health_record():
    data = request.get_json()
    patient_id = data.get('patient_id')
    details = data.get('details')
    created_at = parse_datetime(data.get('created_at'))
    record = MaternalHealthRecord(
        patient_id=patient_id,
        details=details,
        created_at=created_at
    )
    db.session.add(record)
    db.session.commit()
    return jsonify({'message': 'Maternal health record created!', 'maternal_health_record_id': record.id})

# Get all maternal health records
@app.route('/maternal-health-records', methods=['GET'])
def get_maternal_health_records():
    records = MaternalHealthRecord.query.all()
    result = []
    for r in records:
        result.append({
            'id': r.id,
            'patient_id': r.patient_id,
            'details': r.details,
            'created_at': r.created_at
        })
    return jsonify({'maternal_health_records': result})

# Get a single maternal health record by ID
@app.route('/maternal-health-records/<int:record_id>', methods=['GET'])
def get_maternal_health_record(record_id):
    r = MaternalHealthRecord.query.get(record_id)
    if not r:
        return jsonify({'message': 'Maternal health record not found!'}), 404
    return jsonify({
        'id': r.id,
        'patient_id': r.patient_id,
        'details': r.details,
        'created_at': r.created_at
    })

# Update a maternal health record
@app.route('/maternal-health-records/<int:record_id>', methods=['PUT'])
def update_maternal_health_record(record_id):
    r = MaternalHealthRecord.query.get(record_id)
    if not r:
        return jsonify({'message': 'Maternal health record not found!'}), 404
    data = request.get_json()
    r.details = data.get('details', r.details)
    r.created_at = data.get('created_at', r.created_at)
    db.session.commit()
    return jsonify({'message': 'Maternal health record updated!'})

# Delete a maternal health record
@app.route('/maternal-health-records/<int:record_id>', methods=['DELETE'])
def delete_maternal_health_record(record_id):
    r = MaternalHealthRecord.query.get(record_id)
    if not r:
        return jsonify({'message': 'Maternal health record not found!'}), 404
    db.session.delete(r)
    db.session.commit()
    return jsonify({'message': 'Maternal health record deleted!'})

# Create a new medicine swap record
@app.route('/medicine-swaps', methods=['POST'])
def create_medicine_swap():
    data = request.get_json()
    patient_id = data.get('patient_id')
    old_medicine_id = data.get('old_medicine_id')
    new_medicine_id = data.get('new_medicine_id')
    status = data.get('status')
    swapped_at = parse_datetime(data.get('swapped_at'))
    swap = MedicineSwap(
        patient_id=patient_id,
        old_medicine_id=old_medicine_id,
        new_medicine_id=new_medicine_id,
        status=status,
        swapped_at=swapped_at
    )
    db.session.add(swap)
    db.session.commit()
    return jsonify({'message': 'Medicine swap record created!', 'medicine_swap_id': swap.id})

# Get all medicine swap records
@app.route('/medicine-swaps', methods=['GET'])
def get_medicine_swaps():
    swaps = MedicineSwap.query.all()
    result = []
    for s in swaps:
        result.append({
            'id': s.id,
            'patient_id': s.patient_id,
            'old_medicine_id': s.old_medicine_id,
            'new_medicine_id': s.new_medicine_id,
            'status': s.status,
            'swapped_at': s.swapped_at
        })
    return jsonify({'medicine_swaps': result})

# Get a single medicine swap record by ID
@app.route('/medicine-swaps/<int:swap_id>', methods=['GET'])
def get_medicine_swap(swap_id):
    s = MedicineSwap.query.get(swap_id)
    if not s:
        return jsonify({'message': 'Medicine swap record not found!'}), 404
    return jsonify({
        'id': s.id,
        'patient_id': s.patient_id,
        'old_medicine_id': s.old_medicine_id,
        'new_medicine_id': s.new_medicine_id,
        'status': s.status,
        'swapped_at': s.swapped_at
    })

# Update a medicine swap record
@app.route('/medicine-swaps/<int:swap_id>', methods=['PUT'])
def update_medicine_swap(swap_id):
    s = MedicineSwap.query.get(swap_id)
    if not s:
        return jsonify({'message': 'Medicine swap record not found!'}), 404
    data = request.get_json()
    s.status = data.get('status', s.status)
    s.swapped_at = data.get('swapped_at', s.swapped_at)
    db.session.commit()
    return jsonify({'message': 'Medicine swap record updated!'})

# Delete a medicine swap record
@app.route('/medicine-swaps/<int:swap_id>', methods=['DELETE'])
def delete_medicine_swap(swap_id):
    s = MedicineSwap.query.get(swap_id)
    if not s:
        return jsonify({'message': 'Medicine swap record not found!'}), 404
    db.session.delete(s)
    db.session.commit()
    return jsonify({'message': 'Medicine swap record deleted!'})

# Create a new epidemic alert
@app.route('/epidemic-alerts', methods=['POST'])
def create_epidemic_alert():
    data = request.get_json()
    location = data.get('location')
    disease = data.get('disease')
    risk_level = data.get('risk_level')
    alert_time = parse_datetime(data.get('alert_time'))
    alert = EpidemicAlert(
        location=location,
        disease=disease,
        risk_level=risk_level,
        alert_time=alert_time
    )
    db.session.add(alert)
    db.session.commit()
    return jsonify({'message': 'Epidemic alert created!', 'epidemic_alert_id': alert.id})

# Get all epidemic alerts
@app.route('/epidemic-alerts', methods=['GET'])
def get_epidemic_alerts():
    alerts = EpidemicAlert.query.all()
    result = []
    for a in alerts:
        result.append({
            'id': a.id,
            'location': a.location,
            'disease': a.disease,
            'risk_level': a.risk_level,
            'alert_time': a.alert_time
        })
    return jsonify({'epidemic_alerts': result})

# Get a single epidemic alert by ID
@app.route('/epidemic-alerts/<int:alert_id>', methods=['GET'])
def get_epidemic_alert(alert_id):
    a = EpidemicAlert.query.get(alert_id)
    if not a:
        return jsonify({'message': 'Epidemic alert not found!'}), 404
    return jsonify({
        'id': a.id,
        'location': a.location,
        'disease': a.disease,
        'risk_level': a.risk_level,
        'alert_time': a.alert_time
    })

# Update an epidemic alert
@app.route('/epidemic-alerts/<int:alert_id>', methods=['PUT'])
def update_epidemic_alert(alert_id):
    a = EpidemicAlert.query.get(alert_id)
    if not a:
        return jsonify({'message': 'Epidemic alert not found!'}), 404
    data = request.get_json()
    a.location = data.get('location', a.location)
    a.disease = data.get('disease', a.disease)
    a.risk_level = data.get('risk_level', a.risk_level)
    a.alert_time = data.get('alert_time', a.alert_time)
    db.session.commit()
    return jsonify({'message': 'Epidemic alert updated!'})

# Delete an epidemic alert
@app.route('/epidemic-alerts/<int:alert_id>', methods=['DELETE'])
def delete_epidemic_alert(alert_id):
    a = EpidemicAlert.query.get(alert_id)
    if not a:
        return jsonify({'message': 'Epidemic alert not found!'}), 404
    db.session.delete(a)
    db.session.commit()
    return jsonify({'message': 'Epidemic alert deleted!'})

# Create a new sanitary pad vending record
@app.route('/sanitary-pad-vendings', methods=['POST'])
def create_sanitary_pad_vending():
    data = request.get_json()
    patient_id = data.get('patient_id')
    quantity = data.get('quantity')
    dispensed_at = parse_datetime(data.get('dispensed_at'))
    vending = SanitaryPadVending(
        patient_id=patient_id,
        quantity=quantity,
        dispensed_at=dispensed_at
    )
    db.session.add(vending)
    db.session.commit()
    return jsonify({'message': 'Sanitary pad vending record created!', 'sanitary_pad_vending_id': vending.id})

# Get all sanitary pad vending records
@app.route('/sanitary-pad-vendings', methods=['GET'])
def get_sanitary_pad_vendings():
    vendings = SanitaryPadVending.query.all()
    result = []
    for v in vendings:
        result.append({
            'id': v.id,
            'patient_id': v.patient_id,
            'quantity': v.quantity,
            'dispensed_at': v.dispensed_at
        })
    return jsonify({'sanitary_pad_vendings': result})

# Get a single sanitary pad vending record by ID
@app.route('/sanitary-pad-vendings/<int:vending_id>', methods=['GET'])
def get_sanitary_pad_vending(vending_id):
    v = SanitaryPadVending.query.get(vending_id)
    if not v:
        return jsonify({'message': 'Sanitary pad vending record not found!'}), 404
    return jsonify({
        'id': v.id,
        'patient_id': v.patient_id,
        'quantity': v.quantity,
        'dispensed_at': v.dispensed_at
    })

# Update a sanitary pad vending record
@app.route('/sanitary-pad-vendings/<int:vending_id>', methods=['PUT'])
def update_sanitary_pad_vending(vending_id):
    v = SanitaryPadVending.query.get(vending_id)
    if not v:
        return jsonify({'message': 'Sanitary pad vending record not found!'}), 404
    data = request.get_json()
    v.quantity = data.get('quantity', v.quantity)
    v.dispensed_at = data.get('dispensed_at', v.dispensed_at)
    db.session.commit()
    return jsonify({'message': 'Sanitary pad vending record updated!'})

# Delete a sanitary pad vending record
@app.route('/sanitary-pad-vendings/<int:vending_id>', methods=['DELETE'])
def delete_sanitary_pad_vending(vending_id):
    v = SanitaryPadVending.query.get(vending_id)
    if not v:
        return jsonify({'message': 'Sanitary pad vending record not found!'}), 404
    db.session.delete(v)
    db.session.commit()
    return jsonify({'message': 'Sanitary pad vending record deleted!'})

@app.route('/predict-disease', methods=['POST'])
def predict_disease():
    if clf is None:
        return jsonify({'error': 'AI model not loaded'}), 500
    data = request.get_json()
    input_symptoms = data.get('symptoms', [])
    if not isinstance(input_symptoms, list):
        return jsonify({'error': 'symptoms must be a list'}), 400
    X_new = np.array([symptoms_to_vector(input_symptoms)])
    prediction = clf.predict(X_new)
    probabilities = clf.predict_proba(X_new)[0]
    classes = clf.classes_
    # Pair each disease with its probability
    prob_dict = {disease: float(prob) for disease, prob in zip(classes, probabilities)}
    # Sort by probability descending
    sorted_probs = sorted(prob_dict.items(), key=lambda x: x[1], reverse=True)
    return jsonify({
        'predicted_disease': prediction[0],
        'probabilities': sorted_probs
    })

@app.route('/symptoms', methods=['GET'])
def get_symptoms():
    return jsonify({'symptoms': all_symptoms})

@app.route('/predict-health-risk', methods=['POST'])
def predict_health_risk():
    if clf_health_risk is None or le_consciousness is None or le_risk is None:
        return jsonify({'error': 'Health risk model not loaded'}), 500
    data = request.get_json()
    try:
        features = [
            float(data['Respiratory_Rate']),
            float(data['Oxygen_Saturation']),
            float(data['O2_Scale']),
            float(data['Systolic_BP']),
            float(data['Heart_Rate']),
            float(data['Temperature']),
            le_consciousness.transform([data['Consciousness']])[0],
            int(data['On_Oxygen'])
        ]
        pred = clf_health_risk.predict([features])
        risk = le_risk.inverse_transform(pred)[0]
        return jsonify({'risk': risk})
    except Exception as e:
        return jsonify({'error': f'Prediction failed: {str(e)}'}), 400

@app.route('/chatbot', methods=['POST'])
def chatbot():
    data = request.get_json()
    user_message = data.get('message', '')
    user_language = data.get('language', 'en-US')

    # Map language codes to language names for the prompt
    lang_map = {
        'en-US': 'English',
        'hi-IN': 'Hindi',
        'kn-IN': 'Kannada',
        'bho': 'Bhojpuri',
        'har': 'Haryanvi'
    }
    language_name = lang_map.get(user_language, 'English')

    if not user_message.strip():
        return jsonify({'error': 'Message cannot be empty'}), 400

    url = "http://localhost:11434/api/generate"
    system_prompt = (
        f"You are Garvis, a helpful, friendly, and intelligent assistant. "
        f"Always reply in {language_name}. "
        "If the user greets you, greet them back. "
        "If the user asks a question, answer it as best as you can."
    )
    payload = {
        "model": "mistral",
        "prompt": f"{system_prompt}\nUser: {user_message}\nGarvis:",
        "options": {"num_predict": 256}
    }
    try:
        response = requests.post(url, json=payload, stream=True)
        answer = ""
        for chunk in response.iter_lines():
            if chunk:
                result = json.loads(chunk.decode())
                answer += result.get('response', '')
        return jsonify({'response': answer})
    except Exception as e:
        return jsonify({'response': f"Sorry, I couldn't process your request. {str(e)}"})

# Signaling events for WebRTC
@socketio.on('signal')
def handle_signal(data):
    emit('signal', data, broadcast=True)

if __name__ == '__main__':
    socketio.run(app, debug=True)
