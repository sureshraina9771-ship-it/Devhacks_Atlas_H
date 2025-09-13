import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import { ClipLoader } from 'react-spinners';
import './DiseasePredictor.css';

// Enhanced Disease Predictor with Ensemble API Integration
function DiseasePredictor() {
  // State management
  const [symptoms, setSymptoms] = useState([]);
  const [selectedSymptoms, setSelectedSymptoms] = useState([]);
  const [predictionResult, setPredictionResult] = useState(null);
  const [apiStatus, setApiStatus] = useState({ loaded: false, features: 0, diseases: 0 });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPrecautions, setShowPrecautions] = useState(false);
  const [ensembleWeights, setEnsembleWeights] = useState({});

  // Ensemble API Configuration
  const ENSEMBLE_API_URL = 'http://localhost:5003';

  // Check API health and load symptoms on component mount
  useEffect(() => {
    checkApiHealth();
    loadSymptoms();
  }, []);

  const checkApiHealth = async () => {
    try {
      const response = await fetch(`${ENSEMBLE_API_URL}/api/status`);
      const data = await response.json();
      setApiStatus({
        loaded: data.model_loaded,
        features: data.features_count,
        diseases: data.diseases_count
      });
      setEnsembleWeights(data.ensemble_weights || {});
    } catch (err) {
      setError('Unable to connect to Disease Predictor API. Please ensure it is running on port 5003.');
    }
  };

  const loadSymptoms = async () => {
    try {
      const response = await fetch(`${ENSEMBLE_API_URL}/api/symptoms`);
      const data = await response.json();
      setSymptoms(data.symptoms || []);
    } catch (err) {
      setError('Unable to fetch symptoms. Please check API connection.');
    }
  };

  const handlePredict = async (includePrecautions = false) => {
    setError('');
    setPredictionResult(null);
    
    if (selectedSymptoms.length === 0) {
      setError('Please select at least one symptom to continue.');
      return;
    }

    setLoading(true);
    
    try {
      const symptomList = selectedSymptoms.map(option => option.value);
      const endpoint = includePrecautions ? '/api/predict-with-precautions' : '/api/predict';
      
      const response = await fetch(`${ENSEMBLE_API_URL}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ symptoms: symptomList })
      });
      
      const data = await response.json();
      
      if (data.error) {
        setError(data.error);
      } else {
        setPredictionResult(data);
        setShowPrecautions(includePrecautions);
      }
    } catch (err) {
      setError('Failed to get prediction. Please check your connection and try again.');
    }
    
    setLoading(false);
  };

  const clearAll = () => {
    setSelectedSymptoms([]);
    setPredictionResult(null);
    setError('');
    setShowPrecautions(false);
  };

  const getConfidenceColor = (confidence) => {
    if (confidence >= 0.7) return '#4caf50'; // Green
    if (confidence >= 0.4) return '#ff9800'; // Orange
    return '#f44336'; // Red
  };

  const getConfidenceLabel = (confidence) => {
    if (confidence >= 0.7) return 'High Confidence';
    if (confidence >= 0.4) return 'Moderate Confidence';
    return 'Low Confidence';
  };

  // Prepare options for react-select
  const symptomOptions = symptoms.map(symptom => ({
    value: symptom,
    label: symptom.charAt(0).toUpperCase() + symptom.slice(1)
  }));

  return (
    <div className="disease-predictor-app">
      {/* Header Section */}
      <div className="predictor-header">
        <div className="header-content">
          <div className="header-icon">
            🧠
          </div>
          <div>
            <h1>AI Disease Predictor</h1>
            <p>Advanced Ensemble Model for Accurate Disease Prediction</p>
          </div>
        </div>
        
        {/* API Status Badge */}
        <div className={`api-status ${apiStatus.loaded ? 'online' : 'offline'}`}>
          {apiStatus.loaded ? (
            <>
              <span className="status-dot"></span>
              Model Online ({apiStatus.features} symptoms, {apiStatus.diseases} diseases)
            </>
          ) : (
            <>
              <span className="status-dot offline"></span>
              Model Offline
            </>
          )}
        </div>
      </div>

      {/* Model Information Card */}
      {Object.keys(ensembleWeights).length > 0 && (
        <div className="model-info-card">
          <h3>🤖 AI Ensemble Model</h3>
          <div className="ensemble-weights">
            {Object.entries(ensembleWeights).map(([model, weight]) => (
              <div key={model} className="weight-item">
                <span className="model-name">{model.replace('_', ' ').toUpperCase()}</span>
                <div className="weight-bar">
                  <div 
                    className="weight-fill" 
                    style={{ width: `${(weight * 100).toFixed(0)}%` }}
                  ></div>
                </div>
                <span className="weight-value">{(weight * 100).toFixed(0)}%</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Symptoms Selection Section */}
      <div className="symptoms-section">
        <h2>🩺 Symptom Selection</h2>
        <p>Select the symptoms you are experiencing:</p>
        
        <div className="select-container">
          <Select
            isMulti
            options={symptomOptions}
            value={selectedSymptoms}
            onChange={setSelectedSymptoms}
            placeholder="🔍 Type or select symptoms..."
            className="symptom-select"
            classNamePrefix="select"
            isSearchable
            isClearable
          />
        </div>

        {/* Selected Symptoms Display */}
        {selectedSymptoms.length > 0 && (
          <div className="selected-symptoms">
            <h4>Selected Symptoms ({selectedSymptoms.length}):</h4>
            <div className="symptom-chips">
              {selectedSymptoms.map(option => (
                <div key={option.value} className="symptom-chip">
                  <span>{option.label}</span>
                  <button
                    className="remove-chip"
                    onClick={() => 
                      setSelectedSymptoms(selectedSymptoms.filter(s => s.value !== option.value))
                    }
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="action-buttons">
          <button
            className="predict-btn primary"
            onClick={() => handlePredict(false)}
            disabled={loading || selectedSymptoms.length === 0}
          >
            {loading ? 'Analyzing...' : '🔬 Predict Disease'}
          </button>
          
          <button
            className="predict-btn secondary"
            onClick={() => handlePredict(true)}
            disabled={loading || selectedSymptoms.length === 0}
          >
            {loading ? 'Analyzing...' : '💊 Get Medical Advice'}
          </button>
          
          <button
            className="clear-btn"
            onClick={clearAll}
            disabled={loading}
          >
            🗑️ Clear All
          </button>
        </div>
      </div>

      {/* Loading Indicator */}
      {loading && (
        <div className="loading-container">
          <ClipLoader color="#1976d2" loading={loading} size={50} />
          <div className="loading-text">
            <p>🧠 AI is analyzing your symptoms...</p>
            <p className="loading-subtext">Using advanced ensemble models for accurate prediction</p>
          </div>
        </div>
      )}

      {/* Prediction Results */}
      {predictionResult && !loading && (
        <div className="results-section">
          <div className="main-prediction">
            <h2>🎯 Prediction Results</h2>
            
            {/* Primary Prediction */}
            <div className="primary-result">
              <div className="disease-name">
                {predictionResult.predicted_disease}
              </div>
              <div className="confidence-container">
                <div 
                  className="confidence-meter"
                  style={{ 
                    backgroundColor: getConfidenceColor(predictionResult.confidence),
                    width: `${(predictionResult.confidence * 100).toFixed(1)}%`
                  }}
                >
                  <span className="confidence-text">
                    {getConfidenceLabel(predictionResult.confidence)} ({(predictionResult.confidence * 100).toFixed(1)}%)
                  </span>
                </div>
              </div>
            </div>

            {/* Top Predictions */}
            {predictionResult.top_predictions && (
              <div className="top-predictions">
                <h3>📊 Top {Math.min(5, predictionResult.top_predictions.length)} Predictions</h3>
                <div className="predictions-list">
                  {predictionResult.top_predictions.slice(0, 5).map((pred, index) => (
                    <div key={pred.disease} className={`prediction-item ${index === 0 ? 'primary' : ''}`}>
                      <div className="prediction-header">
                        <span className="rank">#{index + 1}</span>
                        <span className="disease">{pred.disease}</span>
                        <span className="percentage">{pred.percentage}</span>
                      </div>
                      <div className="probability-bar">
                        <div 
                          className="probability-fill"
                          style={{ width: `${(pred.probability * 100).toFixed(1)}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Medical Precautions */}
          {showPrecautions && predictionResult.medical_precautions && (
            <div className="medical-advice">
              <h3>⚕️ Medical Recommendations</h3>
              {predictionResult.medical_precautions.map((advice, index) => (
                <div key={index} className="advice-card">
                  <div className="advice-header">
                    <h4>{advice.disease} ({advice.percentage})</h4>
                  </div>
                  
                  <div className="precautions">
                    <h5>🛡️ Precautions:</h5>
                    <ul>
                      {advice.precautions.map((precaution, idx) => (
                        <li key={idx}>{precaution}</li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="doctor-advice">
                    <h5>🏥 When to See a Doctor:</h5>
                    <p>{advice.when_to_see_doctor}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Analysis Details */}
          <div className="analysis-details">
            <h3>🔍 Analysis Details</h3>
            <div className="detail-grid">
              <div className="detail-item">
                <span className="label">Symptoms Analyzed:</span>
                <span className="value">{predictionResult.input_symptoms?.length || 0}</span>
              </div>
              <div className="detail-item">
                <span className="label">Features Matched:</span>
                <span className="value">{predictionResult.matched_features?.length || 0}</span>
              </div>
              <div className="detail-item">
                <span className="label">Analysis Time:</span>
                <span className="value">{new Date(predictionResult.timestamp).toLocaleTimeString()}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Error Display */}
      {error && (
        <div className="error-container">
          <div className="error-content">
            <span className="error-icon">⚠️</span>
            <div className="error-text">
              <strong>Error:</strong> {error}
            </div>
          </div>
        </div>
      )}

      {/* Medical Disclaimer */}
      <div className="disclaimer">
        <p>
          <strong>⚠️ Medical Disclaimer:</strong> This tool is for educational purposes only. 
          Always consult with qualified healthcare professionals for proper medical diagnosis and treatment.
        </p>
      </div>
    </div>
  );
}

export default DiseasePredictor;
