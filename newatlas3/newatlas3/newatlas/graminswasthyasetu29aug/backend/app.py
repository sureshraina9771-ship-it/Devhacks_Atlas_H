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
