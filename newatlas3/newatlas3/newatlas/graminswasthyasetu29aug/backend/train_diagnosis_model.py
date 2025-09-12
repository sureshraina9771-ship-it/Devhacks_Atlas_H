import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
import joblib
import os

# Paths
DATA_DIR = os.path.join(os.path.dirname(__file__), 'data')
DATASET_PATH = os.path.join(DATA_DIR, 'dataset.csv')
SEVERITY_PATH = os.path.join(DATA_DIR, 'Symptom-severity.csv')

# 1. Load data
df = pd.read_csv(DATASET_PATH)
df_severity = pd.read_csv(SEVERITY_PATH)

# 2. Preprocess data
df = df.fillna('None')
symptom_cols = [col for col in df.columns if col.startswith('Symptom')]
all_symptoms = set()
for col in symptom_cols:
    all_symptoms.update(df[col].unique())
all_symptoms.discard('None')
all_symptoms = sorted(list(all_symptoms))

# Map symptom to severity
severity_map = dict(zip(df_severity['Symptom'], df_severity['weight']))

# 3. Feature engineering
def row_to_vector(row):
    vector = []
    for symptom in all_symptoms:
        if symptom in row.values:
            vector.append(severity_map.get(symptom, 0))
        else:
            vector.append(0)
    return vector

X = np.array([row_to_vector(row[symptom_cols]) for _, row in df.iterrows()])
y = df['Disease']

# 4. Train/test split
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# 5. Train model
clf = RandomForestClassifier(n_estimators=100, random_state=42)
clf.fit(X_train, y_train)
accuracy = clf.score(X_test, y_test)
print(f"Model trained. Test accuracy: {accuracy:.2f}")

# 6. Save model and metadata
joblib.dump(clf, os.path.join(DATA_DIR, 'diagnosis_model.pkl'))
joblib.dump(all_symptoms, os.path.join(DATA_DIR, 'symptom_list.pkl'))
joblib.dump(severity_map, os.path.join(DATA_DIR, 'severity_map.pkl'))

print("Model and metadata saved in backend/data/")