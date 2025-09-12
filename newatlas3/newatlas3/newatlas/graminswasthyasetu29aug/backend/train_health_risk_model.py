import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import LabelEncoder
import joblib

# Load data
df = pd.read_csv('data/Health_Risk_Dataset.csv')

# Encode categorical columns
le_consciousness = LabelEncoder()
df['Consciousness'] = le_consciousness.fit_transform(df['Consciousness'])

le_risk = LabelEncoder()
df['Risk_Level'] = le_risk.fit_transform(df['Risk_Level'])

# Features and target
X = df.drop(['Patient_ID', 'Risk_Level'], axis=1)
y = df['Risk_Level']

# Split data
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)


 
# Train model
clf = RandomForestClassifier()
clf.fit(X_train, y_train)

# Save model and encoders
joblib.dump(clf, 'data/health_risk_model.pkl')
joblib.dump(le_consciousness, 'data/consciousness_encoder.pkl')
joblib.dump(le_risk, 'data/risk_encoder.pkl')