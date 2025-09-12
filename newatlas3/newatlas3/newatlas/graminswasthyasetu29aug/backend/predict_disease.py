import joblib
import numpy as np
import os

# Paths
DATA_DIR = os.path.join(os.path.dirname(__file__), 'data')
MODEL_PATH = os.path.join(DATA_DIR, 'diagnosis_model.pkl')
SYMPTOM_LIST_PATH = os.path.join(DATA_DIR, 'symptom_list.pkl')
SEVERITY_MAP_PATH = os.path.join(DATA_DIR, 'severity_map.pkl')

# Load model and metadata
clf = joblib.load(MODEL_PATH)
all_symptoms = joblib.load(SYMPTOM_LIST_PATH)
severity_map = joblib.load(SEVERITY_MAP_PATH)

def symptoms_to_vector(input_symptoms):
    return [severity_map.get(symptom, 0) if symptom in input_symptoms else 0 for symptom in all_symptoms]

def predict_disease(input_symptoms):
    X_new = np.array([symptoms_to_vector(input_symptoms)])
    prediction = clf.predict(X_new)
    return prediction[0]

if __name__ == "__main__":
    # Example: Replace these symptoms with user input as needed
    input_symptoms = ['headache', 'fatigue']
    result = predict_disease(input_symptoms)
    print("Predicted Disease:", result)