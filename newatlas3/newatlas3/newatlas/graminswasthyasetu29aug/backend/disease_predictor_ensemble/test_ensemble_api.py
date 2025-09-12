"""
Test script for the Disease Predictor Ensemble API
=================================================

Tests all endpoints of the ensemble API running on port 5003.
"""

import requests
import json
from datetime import datetime

# API base URL
BASE_URL = "http://localhost:5003"

def test_api():
    """Test all API endpoints"""
    
    print("=== Disease Predictor Ensemble API Test ===")
    print(f"Testing API at: {BASE_URL}")
    print(f"Test started at: {datetime.now()}")
    print("-" * 50)
    
    # Test 1: Root endpoint
    print("\n1. Testing root endpoint (GET /)...")
    try:
        response = requests.get(f"{BASE_URL}/", timeout=10)
        print(f"Status: {response.status_code}")
        if response.status_code == 200:
            data = response.json()
            print(f"✓ API Name: {data['name']}")
            print(f"✓ Version: {data['version']}")
            print(f"✓ Model Status: {data['model_status']}")
            print(f"✓ Ensemble Weights: {data['ensemble_weights']}")
        else:
            print(f"✗ Error: {response.text}")
    except Exception as e:
        print(f"✗ Connection failed: {e}")
        return False
    
    # Test 2: Status endpoint
    print("\n2. Testing status endpoint (GET /api/status)...")
    try:
        response = requests.get(f"{BASE_URL}/api/status", timeout=10)
        print(f"Status: {response.status_code}")
        if response.status_code == 200:
            data = response.json()
            print(f"✓ Status: {data['status']}")
            print(f"✓ Model Loaded: {data['model_loaded']}")
            print(f"✓ Features: {data['features_count']}")
            print(f"✓ Diseases: {data['diseases_count']}")
        else:
            print(f"✗ Error: {response.text}")
    except Exception as e:
        print(f"✗ Request failed: {e}")
    
    # Test 3: Health check
    print("\n3. Testing health check (GET /api/health)...")
    try:
        response = requests.get(f"{BASE_URL}/api/health", timeout=10)
        print(f"Status: {response.status_code}")
        if response.status_code == 200:
            data = response.json()
            print(f"✓ Health: {data['status']}")
            print(f"✓ Service: {data['service']}")
            print(f"✓ Port: {data['port']}")
        else:
            print(f"✗ Error: {response.text}")
    except Exception as e:
        print(f"✗ Request failed: {e}")
    
    # Test 4: Get symptoms
    print("\n4. Testing symptoms endpoint (GET /api/symptoms)...")
    try:
        response = requests.get(f"{BASE_URL}/api/symptoms", timeout=10)
        print(f"Status: {response.status_code}")
        if response.status_code == 200:
            data = response.json()
            print(f"✓ Available symptoms: {data['count']}")
            print(f"✓ Sample symptoms: {data['symptoms'][:5]}")
        else:
            print(f"✗ Error: {response.text}")
    except Exception as e:
        print(f"✗ Request failed: {e}")
    
    # Test 5: Disease prediction
    print("\n5. Testing disease prediction (POST /api/predict)...")
    test_symptoms = ["fever", "cough", "headache"]
    try:
        response = requests.post(
            f"{BASE_URL}/api/predict",
            json={"symptoms": test_symptoms},
            timeout=30
        )
        print(f"Status: {response.status_code}")
        if response.status_code == 200:
            data = response.json()
            print(f"✓ Input symptoms: {data['input_symptoms']}")
            print(f"✓ Matched features: {len(data['matched_features'])}")
            print(f"✓ Predicted disease: {data['predicted_disease']}")
            print(f"✓ Confidence: {data['confidence']:.4f}")
            print(f"✓ Top 3 predictions:")
            for i, pred in enumerate(data['top_predictions'][:3]):
                print(f"   {i+1}. {pred['disease']}: {pred['percentage']}")
            print(f"✓ Ensemble weights: {data['ensemble_weights']}")
        else:
            print(f"✗ Error: {response.text}")
    except Exception as e:
        print(f"✗ Request failed: {e}")
    
    # Test 6: Disease prediction with precautions
    print("\n6. Testing prediction with precautions (POST /api/predict-with-precautions)...")
    test_symptoms_2 = ["stomach_pain", "nausea", "vomiting"]
    try:
        response = requests.post(
            f"{BASE_URL}/api/predict-with-precautions",
            json={"symptoms": test_symptoms_2},
            timeout=30
        )
        print(f"Status: {response.status_code}")
        if response.status_code == 200:
            data = response.json()
            print(f"✓ Input symptoms: {data['input_symptoms']}")
            print(f"✓ Predicted disease: {data['predicted_disease']}")
            print(f"✓ Medical precautions for top diseases:")
            for i, precaution in enumerate(data['medical_precautions']):
                print(f"   {i+1}. {precaution['disease']}: {precaution['percentage']}")
                print(f"      Precautions: {', '.join(precaution['precautions'][:2])}")
                print(f"      When to see doctor: {precaution['when_to_see_doctor']}")
        else:
            print(f"✗ Error: {response.text}")
    except Exception as e:
        print(f"✗ Request failed: {e}")
    
    # Test 7: Error handling
    print("\n7. Testing error handling...")
    try:
        response = requests.post(
            f"{BASE_URL}/api/predict",
            json={"symptoms": []},  # Empty symptoms
            timeout=10
        )
        print(f"Status: {response.status_code}")
        if response.status_code == 400:
            print("✓ Correctly handled empty symptoms")
        else:
            print(f"✗ Unexpected response: {response.text}")
    except Exception as e:
        print(f"✗ Request failed: {e}")
    
    print("\n" + "=" * 50)
    print("API Test Completed!")
    print(f"Test finished at: {datetime.now()}")
    
    return True

if __name__ == "__main__":
    print("Starting API tests...")
    print("Make sure the ensemble API is running on port 5003!")
    print("You can start it with: python ensemble_api.py")
    print()
    
    try:
        test_api()
    except KeyboardInterrupt:
        print("\n\nTest interrupted by user.")
    except Exception as e:
        print(f"\n\nUnexpected error: {e}")
