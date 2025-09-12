# DSU DevHacks2.0
# Gramin Swasthya Setu

**Gramin Swasthya Setu** is a comprehensive, multilingual health management platform designed for rural communities. It provides AI-powered disease prediction, health credits, teleconsultations, medicine management, maternal health tracking, and more, all accessible in English, Hindi, and Kannada.

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Setup & Installation](#setup--installation)
  - [Backend (Flask)](#backend-flask)
  - [Frontend (React)](#frontend-react)
  - [Ollama (LLM Chatbot)](#ollama-llm-chatbot)
- [Usage](#usage)
- [Multilingual Support](#multilingual-support)
- [Health Credits & Offers](#health-credits--offers)
- [Voice Recognition](#voice-recognition)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)

---

## Features

- **AI Disease Prediction:** Enter symptoms and get probable diseases with medical precautions in your chosen language.
- **Brain Tumor Prediction:** Upload MRI scans for brain tumor detection using deep learning.
- **Health Credits:** Earn and redeem credits for health services, medicines, and special offers.
- **Teleconsultations:** Book and manage online doctor appointments.
- **Medicine Management:** Track medicines, expiry, and quantity.
- **Maternal Health:** Record and monitor maternal health data.
- **Epidemic Alerts:** Stay updated on local health alerts.
- **Sanitary Pad Vending:** (Coming soon) Track and manage sanitary pad distribution.
- **Voice Recognition:** Speak symptoms or queries directly to the system.
- **Multilingual UI:** Switch between English, Hindi, and Kannada instantly.
- **AI Chatbot:** Ask health-related questions to an LLM-powered chatbot (Ollama/Mistral).

---

## Tech Stack

- **Frontend:** React, Material-UI (MUI)
- **Backend:** Python Flask
- **AI/ML:** Custom disease prediction models, Brain Tumor CNN, Ollama (Mistral) for chatbot
- **Database:** (You can use SQLite, PostgreSQL, or any preferred DB)
- **Voice Recognition:** Web Speech API (browser-based)
- **Deployment:** Localhost, Vercel/Netlify (frontend), Render/Railway (backend), or any cloud VM

---

## Project Structure

```
├── backend/
│   ├── app.py                  # Flask API main file (chatbot, health credits, etc.)
│   ├── api.py                  # Brain Tumor Prediction API (run for MRI scan prediction)
│   ├── disease_precautions.py  # Disease precautions & translations
│   ├── ensemble_api.py         # Disease Prediction Ensemble API (run for symptom-based prediction)
│   └── ...                     # Other backend files/models
├── frontend/
│   ├── src/
│   │   ├── App.js
│   │   ├── pages/
│   │   │   ├── PatientsPage.js
│   │   │   ├── DoctorsPage.js
│   │   │   ├── MedicinesPage.js
│   │   │   ├── TeleconsultationsPage.js
│   │   │   ├── HealthCreditsPage.js
│   │   │   ├── ProfilePage.js
│   │   │   └── ...
│   │   ├── Chatbot.js
│   │   └── ...
│   └── ...
└── README.md
```

---

## Setup & Installation

### Backend (Flask)

1. **Install dependencies:**
   ```bash
   cd backend
   pip install -r requirements.txt
   ```

2. **Run the APIs:**

   - **For Brain Tumor Prediction (MRI Scan):**
     ```bash
     python api.py
     ```
     This will start the brain tumor prediction API (usually on port 5001 or as configured).

   - **For Disease Prediction (Symptom-based):**
     ```bash
     python ensemble_api.py
     ```
     This will start the advanced disease prediction API on port **5003**.

   - **For General Backend (Chatbot, Health Credits, etc.):**
     ```bash
     python app.py
     ```
     This will start the main backend API (usually on port 5000).

3. **(Optional) Configure database:**  
   Update `app.py` or your config files to connect to your preferred database.

---

### Frontend (React)

1. **Install dependencies:**
   ```bash
   cd frontend
   npm install
   ```

2. **Start the React app:**
   ```bash
   npm start
   ```
   The frontend will run on `http://localhost:3000`.

3. **API URL:**  
   Make sure `API_URL` in your React code matches your backend address.

---

### Ollama (LLM Chatbot)

1. **Install Ollama:**  
   Download and install from [https://ollama.com/download](https://ollama.com/download)

2. **Start Ollama server:**
   ```bash
   ollama serve
   ```

3. **Pull the Mistral model:**
   ```bash
   ollama pull mistral
   ```

4. **Ollama API:**  
   The backend will connect to Ollama at `http://localhost:11434`.

---

## Usage

- Open [http://localhost:3000](http://localhost:3000) in your browser.
- Register or log in as a user.
- Navigate through the dashboard to access features:
  - **Disease Prediction:** Enter or speak symptoms, get predictions and precautions (make sure `ensemble_api.py` is running).
  - **Brain Tumor Prediction:** Upload MRI scans for analysis (make sure `api.py` is running).
  - **Health Credits:** View your credits and unlock offers.
  - **Teleconsultations:** Book online doctor appointments.
  - **Medicines:** Add, view, and update your medicine stock and quantity.
  - **Profile:** View your credit score, reports, and redeem offers.
  - **Chatbot:** Ask health questions in your language using text or voice.

---

## Multilingual Support

- Switch between English, Hindi, and Kannada using the language selector on every main page.
- Disease names, precautions, and UI labels update instantly based on your choice.
- Voice recognition and text-to-speech also adapt to the selected language (where supported).

---

## Health Credits & Offers

- Earn credits by participating in health activities, regular checkups, or redeeming vouchers.
- Unlock offers such as:
  - Free/discounted medicines
  - Priority doctor consultations
  - Maternal health kits
  - Diagnostic test discounts
  - Workshop passes
- Offers are displayed with images and unlock dynamically based on your credit score.

---

## Voice Recognition

- Click the mic icon to speak symptoms or queries.
- Works best in Chrome and Edge browsers.
- Text-to-speech is available for bot responses and precautions.

---

## License

This project is for educational and non-commercial use only.  
See [LICENSE](LICENSE) for details.

---

## Acknowledgements

- [Ollama](https://ollama.com/) for LLM integration
- [Material-UI](https://mui.com/) for UI components
- [React](https://react.dev/) and [Flask](https://flask.palletsprojects.com/) for the core stack

---

**For any questions or support, please contact the project maintainer.**
