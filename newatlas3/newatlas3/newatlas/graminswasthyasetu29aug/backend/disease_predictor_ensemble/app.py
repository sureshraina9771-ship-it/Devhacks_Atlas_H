"""
Disease Prediction Ensemble - Flask API
=======================================

A REST API for disease prediction using machine learning ensemble.
Provides endpoints for symptom-based disease prediction with medical precautions.
"""

from flask import Flask, request, jsonify, render_template
from flask_cors import CORS
import sys
import os
import pandas as pd
import numpy as np
import pickle
from typing import List, Dict, Tuple
from datetime import datetime
import logging

# Add parent directory to path for imports
sys.path.append(os.path.join(os.path.dirname(__file__), '..'))
sys.path.append(os.path.join(os.path.dirname(__file__), '..', 'src'))

try:
    from disease_precautions import get_multiple_disease_precautions
except ImportError:
    # Fallback if precautions module not available
    def get_multiple_disease_precautions(diseases):
        return [{
            'precautions': ['Consult a healthcare professional', 'Follow prescribed treatment'],
            'when_to_see_doctor': 'If symptoms persist or worsen'
        } for _ in diseases]

# Initialize Flask app
app = Flask(__name__)
CORS(app)  # Enable Cross-Origin Resource Sharing

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class DiseasePredictor:
    """Disease prediction ensemble using the same logic as Streamlit app"""
    
    def __init__(self):
        """Initialize the predictor"""
        self.model_loaded = False
        self.predictor_components = None
        self.feature_names = []
        self.disease_classes = []
        
    def load_model(self):
        """Load the trained model components"""
        try:
            model_path = os.path.join(os.path.dirname(__file__), '..', 'trained_models', 'disease_predictor_models.pkl')
            
            if not os.path.exists(model_path):
                return False, "Model file not found. Please ensure trained models are available."
            
            with open(model_path, 'rb') as f:
                components = pickle.load(f)
            
            self.predictor_components = components
            
            # Extract feature names and disease classes
            if 'metadata' in components and 'feature_names' in components['metadata']:
                self.feature_names = components['metadata']['feature_names']
            else:
                # Generate default feature names if not available
                self.feature_names = [f"symptom_{i}" for i in range(999)]
            
            if 'metadata' in components and 'label_encoder' in components['metadata']:
                self.disease_classes = list(components['metadata']['label_encoder'].classes_)
            else:
                # Try to get from model info
                self.disease_classes = [f"disease_{i}" for i in range(100)]
            
            self.model_loaded = True
            return True, f"Model loaded successfully! {len(self.feature_names)} symptoms, {len(self.disease_classes)} diseases"
            
        except Exception as e:
            return False, f"Error loading model: {str(e)}"
    
    def get_symptom_list(self):
        """Get formatted list of available symptoms"""
        if not self.model_loaded:
            return []
        
        available_symptoms = []
        for feature in self.feature_names:
            # Remove leading underscore and convert to readable format
            clean_feature = feature
            if clean_feature.startswith('_'):
                clean_feature = clean_feature[1:]
            clean_feature = clean_feature.replace('_', ' ').title()
            available_symptoms.append(clean_feature)
        
        return sorted(available_symptoms)
    
    def predict_disease(self, selected_symptoms: List[str]) -> Dict:
        """Make disease predictions from selected symptoms - same logic as Streamlit"""
        if not self.model_loaded:
            return {"error": "Model not loaded"}
        
        try:
            # Create feature vector (2D like standalone version)
            feature_vector = np.zeros((1, len(self.feature_names)))
            
            # Match selected symptoms to features (same logic as Streamlit)
            matched_features = []
            for symptom in selected_symptoms:
                # Convert symptom to feature format
                feature_name = symptom.lower().replace(' ', '_')
                matched_this_symptom = False
                
                for i, fname in enumerate(self.feature_names):
                    # Use same matching logic as standalone: exact match or substring
                    if feature_name == fname or feature_name in fname:
                        feature_vector[0, i] = 1
                        matched_features.append(fname)
                        matched_this_symptom = True
                        logger.info(f"Matched '{symptom}' → '{fname}' (index {i})")
                        break
                
                if not matched_this_symptom:
                    logger.warning(f"Could not match symptom: '{symptom}'")
            
            logger.info(f"Total matched features: {len(matched_features)}")
            logger.info(f"Feature vector sum: {np.sum(feature_vector)}")
            
            if np.sum(feature_vector) == 0:
                return {"error": "No matching symptoms found in the database"}
            
            # Get predictions from all models
            predictions = {}
            models = self.predictor_components['models']
            scalers = self.predictor_components.get('scalers', {})
            
            # Get ensemble weights from metadata or use defaults
            ensemble_weights = self.predictor_components.get('metadata', {}).get('ensemble_weights', {
                'naive_bayes': 0.4,
                'xgboost': 0.3,
                'svm': 0.2,
                'neural_network': 0.1
            })
            
            # Make predictions with each model (same logic as Streamlit)
            for model_name, model in models.items():
                try:
                    if model_name in ['svm', 'neural_network']:
                        # Scale features for these models
                        if model_name in scalers:
                            X_scaled = scalers[model_name].transform(feature_vector)
                            pred_proba = model.predict_proba(X_scaled)
                            logger.info(f"{model_name}: Used scaler, prediction shape {pred_proba.shape}")
                        else:
                            pred_proba = model.predict_proba(feature_vector)
                            logger.info(f"{model_name}: No scaler available, shape {pred_proba.shape}")
                    else:
                        pred_proba = model.predict_proba(feature_vector)
                        logger.info(f"{model_name}: No scaling needed, prediction shape {pred_proba.shape}")
                    
                    predictions[model_name] = pred_proba
                except Exception as e:
                    logger.error(f"Error with {model_name}: {e}")
            
            if not predictions:
                return {"error": "All model predictions failed"}
            
            logger.info(f"Got predictions from {len(predictions)} models: {list(predictions.keys())}")
            
            # Ensemble prediction (same logic as Streamlit)
            ensemble_pred = np.zeros_like(predictions[list(predictions.keys())[0]])
            
            logger.info(f"Combining predictions with weights: {ensemble_weights}")
            
            for model_name, weight in ensemble_weights.items():
                if model_name in predictions:
                    ensemble_pred += weight * predictions[model_name]
                    logger.info(f"Added {model_name} with weight {weight}")
            
            # Get final probabilities
            ensemble_proba = ensemble_pred[0]
            logger.info(f"Final ensemble shape: {ensemble_proba.shape}")
            
            # Get top 10 predictions
            top_indices = np.argsort(ensemble_proba)[-10:][::-1]
            
            top_predictions = []
            for idx in top_indices:
                if idx < len(self.disease_classes):
                    disease_name = self.disease_classes[idx]
                    probability = ensemble_proba[idx]
                    
                    top_predictions.append({
                        'disease': disease_name,
                        'probability': float(probability),
                        'percentage': f"{probability*100:.2f}%"
                    })
            
            result = {
                'predicted_disease': top_predictions[0]['disease'] if top_predictions else 'Unknown',
                'confidence': top_predictions[0]['probability'] if top_predictions else 0.0,
                'top_predictions': top_predictions,
                'matched_features': matched_features,
                'input_symptoms': selected_symptoms,
                'feature_vector_sum': int(np.sum(feature_vector)),
                'ensemble_weights': ensemble_weights,
                'timestamp': datetime.now().isoformat()
            }
            
            return result
            
        except Exception as e:
            logger.error(f"Prediction failed: {str(e)}")
            return {"error": f"Prediction failed: {str(e)}"}

# Global predictor instance
predictor = DiseasePredictor()

@app.route('/')
def home():
    """API Documentation and Status"""
    return jsonify({
        'name': 'Disease Prediction API',
        'version': '1.0.0',
        'description': 'AI-powered disease prediction from symptoms using ensemble machine learning',
        'model_status': {
            'loaded': predictor.model_loaded,
            'features': len(predictor.feature_names) if predictor.model_loaded else 0,
            'diseases': len(predictor.disease_classes) if predictor.model_loaded else 0
        },
        'endpoints': {
            'GET /': 'API documentation',
            'GET /api/status': 'Model and API status',
            'GET /api/health': 'Health check',
            'GET /api/symptoms': 'List all available symptoms',
            'POST /api/predict': 'Predict diseases from symptoms',
            'POST /api/predict-with-precautions': 'Predict diseases with medical precautions'
        },
        'usage_examples': {
            'predict': {
                'method': 'POST',
                'url': '/api/predict',
                'body': {
                    'symptoms': ['fever', 'headache', 'cough']
                },
                'response': 'Returns top disease predictions with confidence scores'
            },
            'predict_with_precautions': {
                'method': 'POST', 
                'url': '/api/predict-with-precautions',
                'body': {
                    'symptoms': ['fever', 'headache', 'cough']
                },
                'response': 'Returns predictions with medical precautions for top 3 diseases'
            }
        },
        'disclaimer': 'This API is for educational purposes only. Always consult healthcare professionals for medical advice.',
        'timestamp': datetime.now().isoformat()
    })

@app.route('/api/status')
def api_status():
    """Get API and model status"""
    return jsonify({
        'status': 'online',
        'model_loaded': predictor.model_loaded,
        'features_count': len(predictor.feature_names),
        'diseases_count': len(predictor.disease_classes),
        'timestamp': datetime.now().isoformat()
    })

@app.route('/api/load-model', methods=['POST'])
def load_model():
    """Load the disease prediction model"""
    success, message = predictor.load_model()
    
    return jsonify({
        'success': success,
        'message': message,
        'features_count': len(predictor.feature_names) if success else 0,
        'diseases_count': len(predictor.disease_classes) if success else 0,
        'timestamp': datetime.now().isoformat()
    })

@app.route('/api/symptoms')
def get_symptoms():
    """Get list of all available symptoms"""
    if not predictor.model_loaded:
        return jsonify({
            'error': 'Model not loaded. Please load model first.',
            'symptoms': []
        }), 400
    
    symptoms = predictor.get_symptom_list()
    
    return jsonify({
        'symptoms': symptoms,
        'count': len(symptoms),
        'timestamp': datetime.now().isoformat()
    })

@app.route('/api/predict', methods=['POST'])
def predict_disease():
    """Predict disease from symptoms"""
    if not predictor.model_loaded:
        return jsonify({
            'error': 'Model not loaded. Please load model first.'
        }), 400
    
    data = request.get_json()
    
    if not data or 'symptoms' not in data:
        return jsonify({
            'error': 'Please provide symptoms in JSON format: {"symptoms": ["symptom1", "symptom2"]}'
        }), 400
    
    symptoms = data['symptoms']
    
    if not isinstance(symptoms, list) or len(symptoms) == 0:
        return jsonify({
            'error': 'Symptoms must be a non-empty list'
        }), 400
    
    # Make prediction
    result = predictor.predict_disease(symptoms)
    
    if 'error' in result:
        return jsonify(result), 400
    
    return jsonify(result)

@app.route('/api/predict-with-precautions', methods=['POST'])
def predict_with_precautions():
    """Predict disease and get medical precautions for top 3 diseases"""
    if not predictor.model_loaded:
        return jsonify({
            'error': 'Model not loaded. Please load model first.'
        }), 400
    
    data = request.get_json()
    
    if not data or 'symptoms' not in data:
        return jsonify({
            'error': 'Please provide symptoms in JSON format: {"symptoms": ["symptom1", "symptom2"]}'
        }), 400
    
    symptoms = data['symptoms']
    
    if not isinstance(symptoms, list) or len(symptoms) == 0:
        return jsonify({
            'error': 'Symptoms must be a non-empty list'
        }), 400
    
    # Make prediction
    result = predictor.predict_disease(symptoms)
    
    if 'error' in result:
        return jsonify(result), 400
    
    # Get precautions for top 3 diseases
    top_3_diseases = [pred['disease'] for pred in result['top_predictions'][:3]]
    precautions_list = get_multiple_disease_precautions(top_3_diseases)
    
    # Add precautions to result
    result['medical_precautions'] = []
    for i, (disease_pred, precautions) in enumerate(zip(result['top_predictions'][:3], precautions_list)):
        result['medical_precautions'].append({
            'disease': disease_pred['disease'],
            'probability': disease_pred['probability'],
            'percentage': disease_pred['percentage'],
            'precautions': precautions['precautions'],
            'when_to_see_doctor': precautions['when_to_see_doctor']
        })
    
    return jsonify(result)

@app.route('/api/health')
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'timestamp': datetime.now().isoformat()
    })

@app.errorhandler(404)
def not_found(error):
    return jsonify({'error': 'Endpoint not found'}), 404

@app.errorhandler(500)
def internal_error(error):
    return jsonify({'error': 'Internal server error'}), 500

# Load model on startup (for both development and production)
logger.info("Starting Disease Prediction API...")
success, message = predictor.load_model()
if success:
    logger.info(f"Model loaded successfully: {message}")
else:
    logger.error(f"Failed to load model: {message}")

if __name__ == '__main__':
    # Development server
    app.run(
        host='0.0.0.0',
        port=5000,
        debug=True,
        threaded=True
    )
