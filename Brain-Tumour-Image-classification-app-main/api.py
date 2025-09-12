from flask import Flask, request, jsonify
from flask_cors import CORS
import tensorflow as tf
import numpy as np
import os
from PIL import Image
import io
from Ensemble_functions import output_label, ensemble_output, image_preprocess

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Initialize models globally
models = None

def load_all_models():
    """Load all models once when the server starts"""
    global models
    if models is None:
        try:
            weights_dir = os.path.join(os.path.dirname(__file__), 'weights')
            densenet_path = os.path.join(weights_dir, "densenet169_model.keras")
            vgg19_path = os.path.join(weights_dir, "VGG19_model .keras")  # Note the space before .keras
            xception_path = os.path.join(weights_dir, "xception_model.keras")
            effnet_path = os.path.join(weights_dir, "EfficientNetV2B2_model.keras")

            # Load models
            densenet = tf.keras.models.load_model(densenet_path)
            vgg19 = tf.keras.models.load_model(vgg19_path)
            xception = tf.keras.models.load_model(xception_path)
            effnet = tf.keras.models.load_model(effnet_path)

            models = {
                'densenet': densenet,
                'vgg19': vgg19,
                'xception': xception,
                'effnet': effnet
            }
            return True
        except Exception as e:
            print(f"Error loading models: {str(e)}")
            return False

def estimate_stage(confidence, tumor_type):
    """Estimate tumor stage based on confidence and type"""
    if tumor_type == "Glioma":
        if confidence > 0.85: return "Potentially Advanced (III-IV)", "High"
        elif confidence > 0.70: return "Potentially Intermediate (II-III)", "Moderate to High"
        else: return "Potentially Early (I-II)", "Moderate"
    elif tumor_type == "Meningioma":
        if confidence > 0.85: return "Potentially Grade II-III", "Moderate to High"
        elif confidence > 0.70: return "Potentially Grade I-II", "Moderate"
        else: return "Potentially Grade I", "Low to Moderate"
    elif tumor_type == "Pituitary":
        if confidence > 0.85: return "Potentially Macroadenoma", "Moderate to High"
        elif confidence > 0.70: return "Potentially Microadenoma", "Moderate"
        else: return "Early Stage/Small", "Low to Moderate"
    return "Indeterminate", "Unknown"

def get_temporal_predictions(tumor_type):
    """Get temporal predictions based on tumor type"""
    predictions = {
        "Glioma": {
            "timeline": {
                "3-6 months": "Potential significant growth and symptom intensification",
                "6-12 months": "Risk of increased intracranial pressure",
                "beyond_12_months": "Risk of substantial neurological impact"
            },
            "monitoring": [
                "MRI follow-up every 2-3 months initially",
                "Monthly clinical evaluations",
                "Regular neurological assessments"
            ]
        },
        "Meningioma": {
            "timeline": {
                "6-12 months": "Minimal to moderate growth expected",
                "1-2 years": "Potential for noticeable size increase",
                "2-5 years": "Variable growth patterns"
            },
            "monitoring": [
                "MRI follow-up every 6 months initially",
                "Annual clinical evaluations",
                "Symptom-based assessments"
            ]
        },
        "Pituitary": {
            "timeline": {
                "3-6 months": "Hormone level monitoring crucial",
                "6-12 months": "Potential impact on surrounding structures",
                "1-2 years": "Variable growth patterns"
            },
            "monitoring": [
                "Hormone level tests every 3 months",
                "MRI follow-up every 6 months",
                "Regular vision and endocrine assessment"
            ]
        }
    }
    return predictions.get(tumor_type, {})

@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({"status": "healthy", "models_loaded": models is not None})

@app.route('/predict', methods=['POST'])
def predict():
    """Main prediction endpoint"""
    if 'image' not in request.files:
        return jsonify({'error': 'No image provided'}), 400

    try:
        # Load image and preprocess
        image_file = request.files['image']
        image = Image.open(io.BytesIO(image_file.read()))
        image_array = np.array(image)
        preprocessed_img = image_preprocess(image_array)
        model_input = preprocessed_img.numpy()

        # Ensure models are loaded
        if models is None:
            if not load_all_models():
                return jsonify({'error': 'Failed to load models'}), 500

        # Get predictions
        output_arr, class_name_predicted = ensemble_output(
            model_input,
            models['densenet'],
            models['vgg19'],
            models['xception'],
            models['effnet']
        )

        # Calculate additional metrics
        probabilities = list(zip(['Glioma', 'Meningioma', 'No Tumour', 'Pituitary'], output_arr))
        sorted_probs = sorted(probabilities, key=lambda x: x[1], reverse=True)
        primary_prediction = sorted_probs[0]
        secondary_prediction = sorted_probs[1]

        # Calculate risk metrics
        primary_confidence = primary_prediction[1]
        stage_estimate, risk_level = estimate_stage(primary_confidence, class_name_predicted)
        progression_risk = min(0.95, primary_confidence * 1.2)
        intervention_urgency = "High" if progression_risk > 0.8 else "Moderate" if progression_risk > 0.6 else "Low"

        # Prepare response
        response = {
            'prediction': {
                'class': class_name_predicted,
                'confidence': float(primary_confidence),
                'probabilities': {
                    'Glioma': float(output_arr[0]),
                    'Meningioma': float(output_arr[1]),
                    'No Tumour': float(output_arr[2]),
                    'Pituitary': float(output_arr[3])
                }
            },
            'risk_assessment': {
                'stage': stage_estimate,
                'risk_level': risk_level,
                'progression_risk': float(progression_risk),
                'intervention_urgency': intervention_urgency
            },
            'secondary_prediction': {
                'class': secondary_prediction[0],
                'confidence': float(secondary_prediction[1])
            }
        }

        # Add temporal predictions if tumor detected
        if class_name_predicted != "No Tumour":
            response['temporal_predictions'] = get_temporal_predictions(class_name_predicted)

        return jsonify(response)

    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    # Load models on startup
    load_all_models()
    app.run(debug=False, host='0.0.0.0', port=5000)
