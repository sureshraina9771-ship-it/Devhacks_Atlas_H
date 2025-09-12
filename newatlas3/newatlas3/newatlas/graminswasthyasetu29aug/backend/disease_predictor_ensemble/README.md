# Disease Predictor Ensemble API

Advanced AI-powered disease prediction service using an optimized ensemble model for the Gramin Swasth Setu platform.

## 🚀 Features

- **Optimized Ensemble Model**: Neural Network (55%), XGBoost (23%), SVM (12%), Naive Bayes (10%)
- **Advanced Disease Prediction**: Predicts diseases from symptoms with high accuracy
- **Medical Precautions**: Provides medical advice and precautions for predicted diseases
- **RESTful API**: Easy integration with frontend applications
- **CORS Enabled**: Cross-origin requests supported
- **Robust Error Handling**: Comprehensive error responses
- **Production Ready**: Thread-safe and scalable

## 📊 Model Performance

The ensemble model combines four advanced machine learning algorithms:
- **Neural Network (55%)**: Deep learning for complex pattern recognition
- **XGBoost (23%)**: Gradient boosting for high accuracy
- **SVM (12%)**: Support Vector Machine for classification
- **Naive Bayes (10%)**: Probabilistic classifier for baseline predictions

## 🛠 Installation

1. **Clone/Navigate to the directory**:
   ```bash
   cd backend/disease_predictor_ensemble
   ```

2. **Install dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

3. **Ensure model files are present**:
   - `disease_predictor_models.pkl` (trained ensemble model)
   - `disease_precautions.py` (optional - has fallback)

## 🚀 Usage

### Starting the API Server

**Option 1: Using the batch script (Windows)**
```bash
start_ensemble_api.bat
```

**Option 2: Direct Python execution**
```bash
python ensemble_api.py
```

**Option 3: Production deployment**
```bash
gunicorn --bind 0.0.0.0:5003 --workers 4 ensemble_api:app
```

The API will start on **Port 5003** to avoid conflicts with other services.

### Testing the API

Run the test script to verify all endpoints:
```bash
python test_ensemble_api.py
```

## 📡 API Endpoints

### 1. Root Documentation
- **GET** `/`
- Returns API documentation and status

### 2. Health Check
- **GET** `/api/health`
- Returns health status of the service

### 3. Model Status
- **GET** `/api/status`
- Returns detailed model loading status and statistics

### 4. Available Symptoms
- **GET** `/api/symptoms`
- Returns list of all available symptoms

### 5. Disease Prediction
- **POST** `/api/predict`
- **Body**: `{"symptoms": ["fever", "cough", "headache"]}`
- Returns disease predictions with confidence scores

### 6. Prediction with Medical Precautions
- **POST** `/api/predict-with-precautions`
- **Body**: `{"symptoms": ["stomach_pain", "nausea"]}`
- Returns predictions with medical advice and precautions

## 📝 API Examples

### Basic Disease Prediction
```javascript
fetch('http://localhost:5003/api/predict', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    symptoms: ["fever", "cough", "headache"]
  })
})
.then(response => response.json())
.then(data => {
  console.log('Predicted Disease:', data.predicted_disease);
  console.log('Confidence:', data.confidence);
  console.log('Top Predictions:', data.top_predictions);
});
```

### Prediction with Medical Advice
```javascript
fetch('http://localhost:5003/api/predict-with-precautions', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    symptoms: ["stomach_pain", "nausea", "vomiting"]
  })
})
.then(response => response.json())
.then(data => {
  console.log('Predicted Disease:', data.predicted_disease);
  console.log('Medical Precautions:', data.medical_precautions);
});
```

## 🔧 Configuration

### Environment Variables
- `FLASK_ENV`: Set to `production` for production deployment
- `PORT`: Override default port (5003)

### Model Configuration
The ensemble weights can be modified in the model file or through the API configuration:
```python
ensemble_weights = {
    'neural_network': 0.55,  # 55%
    'xgboost': 0.23,         # 23%
    'svm': 0.12,             # 12%
    'naive_bayes': 0.10      # 10%
}
```

## 📊 Response Format

### Prediction Response
```json
{
  "predicted_disease": "Common Cold",
  "confidence": 0.8542,
  "top_predictions": [
    {
      "disease": "Common Cold",
      "probability": 0.8542,
      "percentage": "85.42%"
    },
    {
      "disease": "Flu",
      "probability": 0.1234,
      "percentage": "12.34%"
    }
  ],
  "matched_features": ["fever", "cough", "headache"],
  "input_symptoms": ["fever", "cough", "headache"],
  "ensemble_weights": {
    "neural_network": 0.55,
    "xgboost": 0.23,
    "svm": 0.12,
    "naive_bayes": 0.10
  },
  "timestamp": "2025-01-12T10:30:45.123456"
}
```

## 🔒 Security & Disclaimers

- **Educational Purpose**: This API is for educational and research purposes only
- **Medical Disclaimer**: Always consult healthcare professionals for medical advice
- **Data Privacy**: No personal health data is stored or logged
- **CORS**: Cross-origin requests are enabled for frontend integration

## 🐛 Troubleshooting

### Common Issues

1. **Model not loading**:
   - Ensure `disease_predictor_models.pkl` exists in the directory
   - Check file permissions and disk space

2. **Import errors**:
   - Install all requirements: `pip install -r requirements.txt`
   - Check Python version compatibility (3.8+)

3. **Port conflicts**:
   - Port 5003 is already in use
   - Stop other services or change port in code

4. **Prediction errors**:
   - Check symptom names match the model's feature names
   - Verify input format is correct

### Logging
The API uses Python's logging module. Logs include:
- Model loading status
- Prediction details
- Feature matching information
- Error messages

## 🚀 Production Deployment

For production deployment, consider:

1. **Use a WSGI server**:
   ```bash
   gunicorn --bind 0.0.0.0:5003 --workers 4 ensemble_api:app
   ```

2. **Set environment variables**:
   ```bash
   export FLASK_ENV=production
   ```

3. **Use a reverse proxy** (nginx, Apache)

4. **Implement proper logging and monitoring**

5. **Secure the API** with authentication if needed

## 📞 Support

For issues or questions:
- Check the test script results
- Review the logs for error messages
- Ensure all dependencies are properly installed
- Verify the model files are present and accessible

## 🔄 Integration with Frontend

This API is designed to integrate seamlessly with the Gramin Swasth Setu frontend. The frontend can make AJAX calls to any of the endpoints to provide real-time disease predictions to users.

Example integration points:
- Symptom checker interface
- Real-time prediction as symptoms are selected
- Medical advice display
- Health recommendations

---

**Version**: 2.0.0  
**Port**: 5003  
**Status**: Production Ready  
**Last Updated**: January 2025
