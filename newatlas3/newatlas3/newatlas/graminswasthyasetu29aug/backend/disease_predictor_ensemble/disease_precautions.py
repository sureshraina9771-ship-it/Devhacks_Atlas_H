"""
Disease Precautions Database
===========================

Comprehensive database of medical precautions and advice for various diseases.
This module provides general precautionary measures for different medical conditions.
"""

import json
from typing import Dict, List, Optional

class DiseasePrecautions:
    """Database of disease precautions and medical advice"""
    
    def __init__(self):
        """Initialize the precautions database"""
        self.precautions_db = self._load_precautions_database()
    
    def _load_precautions_database(self) -> Dict:
        """Load the comprehensive precautions database"""
        
        # Comprehensive precautions database
        precautions_db = {
            # Common Infectious Diseases
            "common_cold": {
                "name": "Common Cold",
                "precautions": [
                    "Get plenty of rest and sleep",
                    "Stay hydrated by drinking lots of fluids",
                    "Use a humidifier or breathe steam",
                    "Gargle with salt water for sore throat",
                    "Avoid close contact with others to prevent spread"
                ],
                "when_to_see_doctor": "If symptoms persist over 10 days or worsen significantly"
            },
            
            "influenza": {
                "name": "Influenza (Flu)",
                "precautions": [
                    "Rest in bed and avoid strenuous activities",
                    "Drink plenty of fluids to prevent dehydration",
                    "Take over-the-counter pain relievers if needed",
                    "Stay home to avoid spreading the virus",
                    "Cover coughs and sneezes"
                ],
                "when_to_see_doctor": "If you have difficulty breathing, persistent fever over 101°F, or severe symptoms"
            },
            
            "pneumonia": {
                "name": "Pneumonia",
                "precautions": [
                    "Seek immediate medical attention",
                    "Take prescribed antibiotics as directed",
                    "Get plenty of rest",
                    "Stay hydrated with warm fluids",
                    "Use a humidifier to ease breathing"
                ],
                "when_to_see_doctor": "Immediately - pneumonia requires medical treatment"
            },
            
            # Gastrointestinal Conditions
            "gastroenteritis": {
                "name": "Gastroenteritis",
                "precautions": [
                    "Stay hydrated with oral rehydration solutions",
                    "Eat bland foods like rice, bananas, toast",
                    "Avoid dairy products and fatty foods",
                    "Rest and avoid strenuous activities",
                    "Practice good hygiene to prevent spread"
                ],
                "when_to_see_doctor": "If severe dehydration, blood in stool, or high fever occurs"
            },
            
            "food_poisoning": {
                "name": "Food Poisoning",
                "precautions": [
                    "Stay hydrated with clear fluids",
                    "Rest and avoid solid foods initially",
                    "Gradually reintroduce bland foods",
                    "Avoid anti-diarrheal medications",
                    "Monitor for signs of severe dehydration"
                ],
                "when_to_see_doctor": "If severe symptoms, high fever, or signs of severe dehydration"
            },
            
            # Cardiovascular Conditions
            "hypertension": {
                "name": "High Blood Pressure",
                "precautions": [
                    "Follow prescribed medication regimen",
                    "Maintain a low-sodium diet",
                    "Exercise regularly as approved by doctor",
                    "Monitor blood pressure regularly",
                    "Manage stress through relaxation techniques"
                ],
                "when_to_see_doctor": "For regular monitoring and if blood pressure remains consistently high"
            },
            
            "heart_attack": {
                "name": "Heart Attack",
                "precautions": [
                    "Call emergency services immediately (911)",
                    "Chew aspirin if not allergic and instructed",
                    "Rest and avoid physical exertion",
                    "Loosen tight clothing",
                    "Stay calm and wait for emergency help"
                ],
                "when_to_see_doctor": "IMMEDIATELY - this is a medical emergency"
            },
            
            # Neurological Conditions
            "migraine": {
                "name": "Migraine",
                "precautions": [
                    "Rest in a dark, quiet room",
                    "Apply cold or warm compress to head",
                    "Stay hydrated",
                    "Take prescribed migraine medications",
                    "Identify and avoid trigger factors"
                ],
                "when_to_see_doctor": "If migraines are frequent, severe, or accompanied by neurological symptoms"
            },
            
            "stroke": {
                "name": "Stroke",
                "precautions": [
                    "Call emergency services immediately (911)",
                    "Note the time symptoms started",
                    "Keep the person calm and lying down",
                    "Do not give food or water",
                    "Monitor breathing and consciousness"
                ],
                "when_to_see_doctor": "IMMEDIATELY - this is a medical emergency"
            },
            
            # Respiratory Conditions
            "asthma": {
                "name": "Asthma",
                "precautions": [
                    "Use prescribed inhaler as directed",
                    "Avoid known triggers",
                    "Stay in air-conditioned environments during poor air quality",
                    "Take medications as prescribed",
                    "Have an asthma action plan"
                ],
                "when_to_see_doctor": "If breathing difficulties persist or worsen despite medication"
            },
            
            "bronchitis": {
                "name": "Bronchitis",
                "precautions": [
                    "Get plenty of rest",
                    "Stay hydrated with warm fluids",
                    "Use a humidifier",
                    "Avoid smoke and irritants",
                    "Take prescribed medications"
                ],
                "when_to_see_doctor": "If symptoms persist over 3 weeks or include blood in cough"
            },
            
            # Skin Conditions
            "eczema": {
                "name": "Eczema",
                "precautions": [
                    "Keep skin moisturized with fragrance-free lotions",
                    "Avoid known allergens and irritants",
                    "Use mild, fragrance-free soaps",
                    "Wear soft, breathable fabrics",
                    "Apply prescribed topical treatments"
                ],
                "when_to_see_doctor": "If skin becomes infected or doesn't respond to treatment"
            },
            
            # Endocrine Conditions
            "diabetes": {
                "name": "Diabetes",
                "precautions": [
                    "Monitor blood sugar levels regularly",
                    "Follow prescribed medication regimen",
                    "Maintain a balanced diet",
                    "Exercise regularly as recommended",
                    "Take care of feet and check for injuries"
                ],
                "when_to_see_doctor": "For regular monitoring and if blood sugar levels are consistently abnormal"
            },
            
            # Musculoskeletal Conditions
            "arthritis": {
                "name": "Arthritis",
                "precautions": [
                    "Stay active with gentle exercises",
                    "Apply heat or cold therapy as helpful",
                    "Maintain a healthy weight",
                    "Take prescribed anti-inflammatory medications",
                    "Use assistive devices if needed"
                ],
                "when_to_see_doctor": "If joint pain is severe or significantly impacts daily activities"
            },
            
            # Mental Health Conditions
            "depression": {
                "name": "Depression",
                "precautions": [
                    "Seek professional mental health support",
                    "Maintain social connections",
                    "Exercise regularly",
                    "Follow prescribed medication regimen",
                    "Practice stress management techniques"
                ],
                "when_to_see_doctor": "If experiencing persistent sadness, thoughts of self-harm, or significant impairment"
            },
            
            "anxiety": {
                "name": "Anxiety",
                "precautions": [
                    "Practice deep breathing and relaxation techniques",
                    "Limit caffeine and alcohol",
                    "Exercise regularly",
                    "Maintain a regular sleep schedule",
                    "Consider therapy or counseling"
                ],
                "when_to_see_doctor": "If anxiety significantly interferes with daily life or includes panic attacks"
            }
        }
        
        return precautions_db
    
    def get_precautions(self, disease_name: str) -> Optional[Dict]:
        """
        Get precautions for a specific disease
        
        Args:
            disease_name: Name of the disease (will be normalized)
            
        Returns:
            Dictionary with precautions or None if not found
        """
        # Normalize disease name
        normalized_name = self._normalize_disease_name(disease_name)
        
        # Try exact match first
        if normalized_name in self.precautions_db:
            return self.precautions_db[normalized_name]
        
        # Try partial matching
        for key, value in self.precautions_db.items():
            if any(keyword in normalized_name for keyword in key.split('_')):
                return value
            if any(keyword in value['name'].lower() for keyword in normalized_name.split('_')):
                return value
        
        # Return generic advice if no specific match
        return self._get_generic_precautions(disease_name)
    
    def _normalize_disease_name(self, disease_name: str) -> str:
        """Normalize disease name for matching"""
        return disease_name.lower().replace(' ', '_').replace('-', '_').replace('(', '').replace(')', '')
    
    def _get_generic_precautions(self, disease_name: str) -> Dict:
        """Get generic precautions for unknown diseases"""
        return {
            "name": disease_name.replace('_', ' ').title(),
            "precautions": [
                "Consult with a healthcare professional for proper diagnosis",
                "Rest and avoid strenuous activities",
                "Stay hydrated with plenty of fluids",
                "Monitor symptoms and note any changes",
                "Follow prescribed treatments if any"
            ],
            "when_to_see_doctor": "As soon as possible for proper diagnosis and treatment"
        }
    
    def get_multiple_precautions(self, disease_names: List[str]) -> List[Dict]:
        """
        Get precautions for multiple diseases
        
        Args:
            disease_names: List of disease names
            
        Returns:
            List of precaution dictionaries
        """
        return [self.get_precautions(disease) for disease in disease_names]
    
    def search_precautions(self, keyword: str) -> List[Dict]:
        """
        Search for diseases containing a keyword
        
        Args:
            keyword: Keyword to search for
            
        Returns:
            List of matching precaution dictionaries
        """
        keyword = keyword.lower()
        matches = []
        
        for key, value in self.precautions_db.items():
            if keyword in key or keyword in value['name'].lower():
                matches.append(value)
        
        return matches

# Global instance
disease_precautions = DiseasePrecautions()

def get_disease_precautions(disease_name: str) -> Dict:
    """Convenience function to get precautions for a disease"""
    return disease_precautions.get_precautions(disease_name)

def get_multiple_disease_precautions(disease_names: List[str]) -> List[Dict]:
    """Convenience function to get precautions for multiple diseases"""
    return disease_precautions.get_multiple_precautions(disease_names)

if __name__ == "__main__":
    # Test the precautions database
    test_diseases = ["common_cold", "diabetes", "hypertension", "unknown_disease"]
    
    for disease in test_diseases:
        precautions = get_disease_precautions(disease)
        print(f"\n{precautions['name']}:")
        print("Precautions:")
        for i, precaution in enumerate(precautions['precautions'], 1):
            print(f"  {i}. {precaution}")
        print(f"When to see doctor: {precautions['when_to_see_doctor']}")
