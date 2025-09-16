import React, { useState, useEffect, Fragment } from 'react';
import axios from 'axios';
import LandingPage from './pages/LandingPage';
import './App.css';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, Container, CssBaseline, Select, MenuItem, Box } from '@mui/material';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import PeopleIcon from '@mui/icons-material/People';
import MedicalServicesIcon from '@mui/icons-material/MedicalServices';
import PersonIcon from '@mui/icons-material/Person';
import SignInPage from './pages/SignInPage';
import DoctorsPage from './pages/DoctorsPage';
import MedicinesPage from './pages/MedicinesPage';
import MedicineVending from './pages/MedicineVending';
import MaternalHealthRecordsPage from './pages/MaternalHealthRecordsPage';
import EpidemicAlertsPage from './pages/EpidemicAlertsPage';
import SanitaryPadVendingsPage from './pages/SanitaryPadVendingsPage';
import TeleconsultationsPage from './pages/TeleconsultationsPage';
import PatientsPage from './pages/PatientsPage';
import HealthCreditsPage from './pages/HealthCreditsPage';
import DiseasePredictor from './components/DiseasePredictor';
import HealthRiskPredictor from './pages/HealthRiskPredictor';
import MRIScanPrediction from './pages/MRIScanPrediction';
import ProfilePage from './ProfilePage';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import BiotechIcon from '@mui/icons-material/Biotech';
import Chatbot from './Chatbot';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const API_URL = 'http://127.0.0.1:5000';
const featureList = [
  {
    label: 'MRI Scan Prediction',
    to: '/mri-scan',
    img: 'https://img.freepik.com/free-vector/mri-scan-concept-illustration_114360-7123.jpg?w=740&t=st=1709037533~exp=1709038133~hmac=7e4f12375f99c6bc7a9d7e1a8d7f7d7d'
  },
  {
    label: 'Patients',
    to: '/patients',
    img: 'https://img.freepik.com/premium-vector/doctorpatient-consulting-icon_194117-170.jpg?w=2000'
  },
  {
    label: 'Doctors',
    to: '/doctors',
    img: 'https://cdn-icons-png.flaticon.com/512/3774/3774299.png'
  },
  {
    label: 'Medicines',
    to: '/medicine-vending',
    img: 'https://www.shutterstock.com/image-vector/medicine-capsule-logo-260nw-706103674.jpg'
    },
  {
    label: 'Health Credits',
    to: '/health-credits',
    img: 'https://tse3.mm.bing.net/th/id/OIP.WUXeE_I-1110EqHWdf_4CgAAAA?rs=1&pid=ImgDetMain&o=7&rm=3'
  },
  {
    label: 'Maternal Health',
    to: '/maternal-health-records',
    img: 'https://static.vecteezy.com/system/resources/previews/047/534/651/non_2x/mom-and-baby-logo-design-mom-and-baby-logo-template-illustration-vector.jpg'
  },
  // ...existing code...
  ,{
    label: 'Epidemic Alerts',
    to: '/epidemic-alerts',
    img: 'https://thumbs.dreamstime.com/b/epidemic-alert-sign-virus-vector-illustration-43082853.jpg'
  },
  {
    label: 'Sanitary Pad Vending',
    to: '/sanitary-pad-vendings',
    img: 'https://cdn-icons-png.flaticon.com/512/4334/4334486.png'
  },
  {
    label: 'Teleconsultations',
    to: '/teleconsultations',
    img: 'https://images.drlogy.com/assets/uploads/img/general/drlogy-app/h16.png'
  },
  {
    label: 'Disease Predictor',
    to: '/disease-predictor',
    img: 'https://centerforhealthsecurity.org/sites/default/files/styles/rich_text_half_size/public/2023-01/disease-prediction-logo.jpg?itok=0XxT5YCT'
  },
  {
    label: 'Health Risk Predictor',
    to: '/health-risk',
    img: 'https://d2gg9evh47fn9z.cloudfront.net/1600px_COLOURBOX9599851.jpg'
  }
];
const carouselImages = [
  "https://static.vikaspedia.in/media/images_en/health/nrhm/national-health-programmes-1/jssk-videotest.jpg",
  "https://sarkariyojana.com/wp-content/uploads/2024/09/NPS-Vatsalya-Scheme-Registration-Online.webp",
  "https://sarkariyojana.com/wp-content/uploads/2025/07/mjpjay-maharashtra.webp",
  "https://5.imimg.com/data5/SELLER/Default/2024/7/435977740/KC/XC/KW/180131926/1000001580-500x500.jpg"
];

const translations = {
  en: {
    dashboard: "Dashboard",
    welcome: "Welcome",
    loggedIn: "You are now logged in.",
    submitSymptoms: "Submit Symptoms for Diagnosis",
    describeSymptoms: "Describe your symptoms",
    diagnose: "Diagnose",
    yourDiagnosis: "Your Diagnostic History",
    symptoms: "Symptoms",
    diagnosis: "Diagnosis",
    logout: "Logout",
    back: "Back",
    patients: "Patients",
    doctors: "Doctors",
    medicines: "Medicines",
    healthCredits: "Health Credits",
    maternalRecords: "Maternal Health",
    medicineSwaps: "Medicine Swaps",
    epidemicAlerts: "Epidemic Alerts",
    sanitaryPadVendings: "Sanitary Pad Vending",
    teleconsultations: "Teleconsultations",
    diseasePredictor: "Disease Predictor",
    healthRisk: "Health Risk Predictor"
  },
  hi: {
    dashboard: "डैशबोर्ड",
    welcome: "स्वागत है",
    loggedIn: "आप लॉग इन हो चुके हैं।",
    submitSymptoms: "लक्षण दर्ज करें",
    describeSymptoms: "अपने लक्षण लिखें",
    diagnose: "निदान करें",
    yourDiagnosis: "आपका निदान इतिहास",
    symptoms: "लक्षण",
    diagnosis: "निदान",
    logout: "लॉगआउट",
    back: "वापस",
    patients: "मरीज",
    doctors: "डॉक्टर",
    medicines: "दवाइयाँ",
    healthCredits: "हेल्थ क्रेडिट्स",
    maternalRecords: "मातृ स्वास्थ्य",
    medicineSwaps: "दवा अदला-बदली",
    epidemicAlerts: "महामारी अलर्ट",
    sanitaryPadVendings: "सेनेटरी पैड वेंडिंग",
    teleconsultations: "टेलीपरामर्श",
    diseasePredictor: "रोग पूर्वानुमान",
    healthRisk: "स्वास्थ्य जोखिम पूर्वानुमान"
  },
  pa: {
    dashboard: "ਡੈਸ਼ਬੋਰਡ",
    welcome: "ਸਵਾਗਤ",
    loggedIn: "ਤੁਸੀਂ ਲਾਗ ਇਨ ਹੋ ਗਏ ਹੋ।",
    submitSymptoms: "ਲੱਛਣ ਦਰਜ ਕਰੋ",
    describeSymptoms: "ਆਪਣੇ ਲੱਛਣ ਲਿਖੋ",
    diagnose: "ਨਿਦਾਨ ਕਰੋ",
    yourDiagnosis: "ਤੁਹਾਡਾ ਨਿਦਾਨ ਇਤਿਹਾਸ",
    symptoms: "ਲੱਛਣ",
    diagnosis: "ਨਿਦਾਨ",
    logout: "ਲਾਗ ਆਊਟ",
    back: "ਵਾਪਸ",
    patients: "ਮਰੀਜ਼",
    doctors: "ਡਾਕਟਰ",
    medicines: "ਦਵਾਈਆਂ",
    healthCredits: "ਸਿਹਤ ਕ੍ਰੈਡਿਟ",
    maternalRecords: "ਮਾਤਰੀ ਸਿਹਤ",
    medicineSwaps: "ਦਵਾਈ ਬਦਲਣਾ",
    epidemicAlerts: "ਮਹਾਂਮਾਰੀ ਚੇਤਾਵਨੀ",
    sanitaryPadVendings: "ਸੈਨਿਟਰੀ ਪੈਡ ਵੈਂਡਿੰਗ",
    teleconsultations: "ਟੈਲੀ ਸਲਾਹ",
    diseasePredictor: "ਬਿਮਾਰੀ ਪੂਰਵਾਨੁਮਾਨ",
    healthRisk: "ਸਿਹਤ ਜੋਖਮ ਪੂਰਵਾਨੁਮਾਨ"
  }
};

const homeTranslations = {
  en: {
    title: "Gramin Swasthya Setu",
    subtitle: "Empowering Rural Healthcare with Technology",
  },
  hi: {
    title: "ग्रामीण स्वास्थ्य सेतु",
    subtitle: "तकनीक के साथ ग्रामीण स्वास्थ्य को सशक्त बनाना",
  },
  pa: {
    title: "ਗਰਾਮੀਣ ਸਵਾਸਥਿਆ ਸੇਤੁ",
    subtitle: "ਤਕਨੋਲੋਜੀ ਨਾਲ ਗਰਾਮੀਣ ਸਿਹਤ ਸੇਵਾ ਨੂੰ ਸਸ਼ਕਤ ਬਣਾਉਣਾ",
  }
};

const featureTranslations = {
  en: {
    'MRI Scan Prediction': 'MRI Scan Prediction',
    'Patients': 'Patients',
    'Doctors': 'Doctors',
    'Medicines': 'Medicines',
    'Health Credits': 'Health Credits',
    'Maternal Health': 'Maternal Health',
    'Medicine Swaps': 'Medicine Swaps',
    'Epidemic Alerts': 'Epidemic Alerts',
    'Sanitary Pad Vending': 'Sanitary Pad Vending',
    'Teleconsultations': 'Teleconsultations',
    'Disease Predictor': 'Disease Predictor',
    'Health Risk Predictor': 'Health Risk Predictor'
  },
  hi: {
    'MRI Scan Prediction': 'एमआरआई स्कैन पूर्वानुमान',
    'Patients': 'मरीज',
    'Doctors': 'डॉक्टर',
    'Medicines': 'दवाइयाँ',
    'Health Credits': 'हेल्थ क्रेडिट्स',
    'Maternal Health': 'मातृ स्वास्थ्य',
    'Medicine Swaps': 'दवा अदला-बदली',
    'Epidemic Alerts': 'महामारी अलर्ट',
    'Sanitary Pad Vending': 'सेनेटरी पैड वेंडिंग',
    'Teleconsultations': 'टेलीपरामर्श',
    'Disease Predictor': 'रोग पूर्वानुमान',
    'Health Risk Predictor': 'स्वास्थ्य जोखिम पूर्वानुमान'
  },
  pa: {
    'MRI Scan Prediction': 'ਏਮਆਰਆਈ ਸਕੈਨ ਪੂਰਵਾਨੁਮਾਨ',
    'Patients': 'ਮਰੀਜ਼',
    'Doctors': 'ਡਾਕਟਰ',
    'Medicines': 'ਦਵਾਈਆਂ',
    'Health Credits': 'ਸਿਹਤ ਕ੍ਰੈਡਿਟ',
    'Maternal Health': 'ਮਾਤਰੀ ਸਿਹਤ',
    'Medicine Swaps': 'ਦਵਾਈ ਬਦਲਣਾ',
    'Epidemic Alerts': 'ਮਹਾਂਮਾਰੀ ਚੇਤਾਵਨੀ',
    'Sanitary Pad Vending': 'ਸੈਨਿਟਰੀ ਪੈਡ ਵੈਂਡਿੰਗ',
    'Teleconsultations': 'ਟੈਲੀ ਸਲਾਹ',
    'Disease Predictor': 'ਬਿਮਾਰੀ ਪੂਰਵਾਨੁਮਾਨ',
    'Health Risk Predictor': 'ਸਿਹਤ ਜੋਖਮ ਪੂਰਵਾਨੁਮਾਨ'
  }
};

function Home() {
  const [showEmergencyModal, setShowEmergencyModal] = useState(false);
  const [language, setLanguage] = useState('en');
  const t = homeTranslations[language];
  const featureT = featureTranslations[language];

  return (
    <Container
      sx={{
        mt: 8,
        textAlign: 'center',
        backgroundImage: 'url("https://tse1.mm.bing.net/th/id/OIP.hMq99KR54QyOR8a2SJrYRQHaEo?rs=1&pid=ImgDetMain&o=7&rm=3")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        borderRadius: 4,
        boxShadow: 3,
        py: 6
      }}
    >
      {/* Language Selector */}
      <Box sx={{ mb: 2, display: 'flex', justifyContent: 'flex-end' }}>
        <Select
          value={language}
          onChange={e => setLanguage(e.target.value)}
          size="small"
          sx={{ minWidth: 120, bgcolor: '#fff' }}
        >
          <MenuItem value="en">English</MenuItem>
          <MenuItem value="hi">हिन्दी</MenuItem>
          <MenuItem value="pa">ਪੰਜਾਬੀ</MenuItem>
        </Select>
      </Box>
      <LocalHospitalIcon sx={{ fontSize: 80, color: '#1976d2' }} />
      <Typography variant="h2" sx={{ mt: 2, mb: 1, fontWeight: 900, color: '#1976d2', letterSpacing: 2 }}>
        {t.title}
      </Typography>
      <Typography variant="h5" sx={{ mb: 4, color: '#333', fontWeight: 500 }}>
        {t.subtitle}
      </Typography>
      <div style={{ maxWidth: 700, margin: "0 auto", borderRadius: 16, boxShadow: '0 8px 32px #1976d233', overflow: 'hidden' }}>
        <div className="slick-slider">
          {carouselImages.map((img, idx) => (
            <div key={idx} className="slick-slide">
              <img
                src={img}
                alt={`slide-${idx}`}
                style={{ width: "100%", borderRadius: 16, maxHeight: 400, objectFit: "cover", display: 'block' }}
              />
            </div>
          ))}
        </div>
      </div>
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
          gap: '32px',
          marginTop: '40px'
        }}
      >
        {featureList.map((feature, idx) => {
          return (
            <Button
              key={feature.label}
              variant="contained"
              color="primary"
              component={Link}
              to={feature.to}
              sx={{
                width: 180,
                height: 180,
                borderRadius: 4,
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.1rem',
                fontWeight: 600,
                boxShadow: 3,
                background: 'rgba(255,255,255,0.85)',
                textTransform: 'none',
                gap: 2,
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                '&:hover': { 
                  background: '#c35d2aff',
                  transform: 'translateY(-2px)',
                  boxShadow: 6
                }
              }}
            >
              <img
                src={feature.img}
                alt={feature.label}
                style={{ 
                  width: 64, 
                  height: 64, 
                  marginBottom: 12, 
                  borderRadius: 12,
                  transition: 'transform 0.3s ease'
                }}
              />
              <span style={{ 
                color: '#222', 
                fontWeight: 600,
                textAlign: 'center',
                lineHeight: 1.2
              }}>
                {featureT[feature.label] || feature.label}
              </span>
            </Button>
          );
        })}
      </div>
      {/* Emergency Contact Logo */}
      <div
        onClick={() => setShowEmergencyModal(true)}
        style={{
          position: 'fixed',
          bottom: 32,
          right: 32,
          zIndex: 2000,
          background: '#d32d2dff',
          borderRadius: '50%',
          boxShadow: '0 4px 16px #e11d48aa',
          padding: 10,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer'
        }}
        title="Emergency Contact"
      >
        <img
          src="https://w7.pngwing.com/pngs/616/257/png-transparent-emergency-telephone-number-emergency-call-box-telephone-s-free-angle-text-telephone-call.png"
          alt="Emergency Contact"
          style={{ width: 56, height: 56 }}
        />
      </div>
      {/* Emergency Numbers Modal */}
      {showEmergencyModal && (
        <div
          style={{
            position: 'fixed',
            bottom: 100,
            right: 32,
            zIndex: 3000,
            background: '#fff',
            borderRadius: 16,
            boxShadow: '0 8px 32px #e11d48aa',
            padding: 24,
            minWidth: 260
          }}
        >
          <h3 style={{ marginTop: 0, color: '#e11d48' }}>Emergency Contacts</h3>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            <li><b>Ambulance:</b> 102</li>
            <li><b>Police:</b> 100</li>
            <li><b>Fire:</b> 101</li>
            <li><b>Women Helpline:</b> 1091</li>
            <li><b>Child Helpline:</b> 1098</li>
            <li><b>Hospital:</b> 08927839876</li>
          </ul>
          <button
            style={{
              marginTop: 16,
              background: '#e11d48',
              color: '#fff',
              border: 'none',
              borderRadius: 8,
              padding: '8px 16px',
              cursor: 'pointer'
            }}
            onClick={() => setShowEmergencyModal(false)}
          >
            Close
          </button>
        </div>
      )}
    </Container>

  );
}

function App() {
  // Auth states
const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('patient');
  const [message, setMessage] = useState('');
  const [loginUsername, setLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginMessage, setLoginMessage] = useState('');
  const [showLanding, setShowLanding] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showChatbot, setShowChatbot] = useState(false);

  

  // Diagnostic states
  const [symptoms, setSymptoms] = useState('');
  const [diagnosis, setDiagnosis] = useState('');
  const [history, setHistory] = useState([]);

  // Patient states
  const [patients, setPatients] = useState([]);
  const [newPatient, setNewPatient] = useState({ user_id: '', name: '', age: '', gender: '', address: '' });

  // Doctor states
  const [doctors, setDoctors] = useState([]);
  const [newDoctor, setNewDoctor] = useState({ user_id: '', name: '', specialization: '', contact: '' });

  // Medicine states
  const [medicines, setMedicines] = useState([]);
  const [newMedicine, setNewMedicine] = useState({ name: '', batch_number: '', expiry_date: '', is_fraudulent: false });

  // HealthCredit states
  const [healthCredits, setHealthCredits] = useState([]);
  const [newHealthCredit, setNewHealthCredit] = useState({ patient_id: '', credits: '', last_updated: '' });

  // MaternalHealthRecord states
  const [maternalRecords, setMaternalRecords] = useState([]);
  const [newMaternalRecord, setNewMaternalRecord] = useState({ patient_id: '', details: '', created_at: '' });

  // MedicineSwap states
  const [medicineSwaps, setMedicineSwaps] = useState([]);
  // const [newMedicineSwap, setNewMedicineSwap] = useState({ patient_id: '', old_medicine_id: '', new_medicine_id: '', status: '', swapped_at: '' }); // removed with MedicineSwapsPage

  // EpidemicAlert states
  const [epidemicAlerts, setEpidemicAlerts] = useState([]);
  const [newEpidemicAlert, setNewEpidemicAlert] = useState({ location: '', disease: '', risk_level: '', alert_time: '' });

  // SanitaryPadVending states
  const [sanitaryPadVendings, setSanitaryPadVendings] = useState([]);
  const [newSanitaryPadVending, setNewSanitaryPadVending] = useState({ patient_id: '', quantity: '', dispensed_at: '' });

  // Teleconsultation states
  const [teleconsultations, setTeleconsultations] = useState([]);
  const [newTeleconsultation, setNewTeleconsultation] = useState({ patient_id: '', doctor_id: '', scheduled_time: '', notes: '' });

  // UI states
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState('');
  const [tab, setTab] = useState('dashboard');
  
  useEffect(() => {
    if (isLoggedIn) {
      fetchHistory(loginUsername);
      fetchAllData();
    }
    // eslint-disable-next-line
  }, [isLoggedIn]);
  if (showLanding) {
    return <LandingPage onStart={() => setShowLanding(false)} />;
  }


  // Helper to show notification for 3 seconds
  const showNotification = (msg) => {
    setNotification(msg);
    setTimeout(() => setNotification(''), 3000);
  };

  // Auth handlers
  const handleRegister = async (e) => {
    e.preventDefault();
    if (!username || !password) {
      showNotification('Username and password are required!');
      return;
    }
    setLoading(true);
    try {
      const res = await axios.post(`${API_URL}/register`, {
        username,
        password,
        role
      });
      setMessage(res.data.message);
      showNotification(res.data.message);
    } catch (err) {
      const msg = err.response && err.response.data && err.response.data.message
        ? err.response.data.message
        : 'Server error or network issue';
      setMessage(msg);
      showNotification(msg);
    }
    setLoading(false);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!loginUsername || !loginPassword) {
      showNotification('Username and password are required!');
      return;
    }
    setLoading(true);
    try {
      const res = await axios.post(`${API_URL}/login`, {
        username: loginUsername,
        password: loginPassword
      });
      setLoginMessage(res.data.message);
      showNotification(res.data.message);
      if (res.data.message === 'Login successful!') {
        setIsLoggedIn(true);
        fetchHistory(loginUsername);
        fetchAllData();
      }
    } catch (err) {
      const msg = err.response && err.response.data && err.response.data.message
        ? err.response.data.message
        : 'Server error or network issue';
      setLoginMessage(msg);
      showNotification(msg);
    }
    setLoading(false);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setLoginUsername('');
    setLoginPassword('');
    setDiagnosis('');
    setSymptoms('');
    setHistory([]);
    setLoginMessage('');
    setTab('dashboard');
  };

  // Diagnostic handlers
  const handleDiagnose = async (e) => {
    e.preventDefault();
    if (!symptoms) {
      showNotification('Please enter your symptoms!');
      return;
    }
    setLoading(true);
    try {
      const res = await axios.post(`${API_URL}/diagnose`, {
        symptoms,
        username: loginUsername
      });
      setDiagnosis(res.data.diagnosis);
      setSymptoms('');
      showNotification(res.data.diagnosis);
      fetchHistory(loginUsername);
    } catch (err) {
      setDiagnosis('Error: Could not get diagnosis');
      showNotification('Error: Could not get diagnosis');
    }
    setLoading(false);
  };

  const fetchHistory = async (username) => {
    setLoading(true);
    try {
      const res = await axios.post(`${API_URL}/diagnostic-history`, { username });
      setHistory(res.data.history);
    } catch (err) {
      setHistory([]);
    }
    setLoading(false);
  };

  // Fetch all data for dashboard
  const fetchAllData = async () => {
    setLoading(true);
    try {
      const [
        patientsRes, doctorsRes, medicinesRes, healthCreditsRes,
        maternalRes, medicineSwapsRes, epidemicAlertsRes, sanitaryPadRes, teleconsultationsRes
      ] = await Promise.all([
        axios.get(`${API_URL}/patients`),
        axios.get(`${API_URL}/doctors`),
        axios.get(`${API_URL}/medicines`),
        axios.get(`${API_URL}/health-credits`),
        axios.get(`${API_URL}/maternal-health-records`),
        axios.get(`${API_URL}/medicine-swaps`),
        axios.get(`${API_URL}/epidemic-alerts`),
        axios.get(`${API_URL}/sanitary-pad-vendings`),
        axios.get(`${API_URL}/teleconsultations`)
      ]);
      setPatients(patientsRes.data.patients);
      setDoctors(doctorsRes.data.doctors);
      setMedicines(medicinesRes.data.medicines);
      setHealthCredits(healthCreditsRes.data.health_credits);
      setMaternalRecords(maternalRes.data.maternal_health_records);
      setMedicineSwaps(medicineSwapsRes.data.medicine_swaps);
      setEpidemicAlerts(epidemicAlertsRes.data.epidemic_alerts);
      setSanitaryPadVendings(sanitaryPadRes.data.sanitary_pad_vendings);
      setTeleconsultations(teleconsultationsRes.data.teleconsultations);
    } catch (err) {
      showNotification('Error fetching dashboard data');
    }
    setLoading(false);
  };

 

  // Generic form handlers for each model
  const handleInputChange = (setter) => (e) => {
    const { name, value, type, checked } = e.target;
    setter(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Example: Create Patient
  const handleCreatePatient = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post(`${API_URL}/patients`, newPatient);
      showNotification('Patient created!');
      setNewPatient({ user_id: '', name: '', age: '', gender: '', address: '' });
      fetchAllData();
    } catch {
      showNotification('Error creating patient');
    }
    setLoading(false);
  };

  // Example: Create Doctor
  const handleCreateDoctor = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post(`${API_URL}/doctors`, newDoctor);
      showNotification('Doctor created!');
      setNewDoctor({ user_id: '', name: '', specialization: '', contact: '' });
      fetchAllData();
    } catch {
      showNotification('Error creating doctor');
    }
    setLoading(false);
  };

  // Example: Create Medicine
  const handleCreateMedicine = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post(`${API_URL}/medicines`, newMedicine);
      showNotification('Medicine created!');
      setNewMedicine({ name: '', batch_number: '', expiry_date: '', is_fraudulent: false });
      fetchAllData();
    } catch {
      showNotification('Error creating medicine');
    }
    setLoading(false);
  };

  const handleCreateHealthCredit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post(`${API_URL}/health-credits`, newHealthCredit);
      showNotification('Health credit record created!');
      setNewHealthCredit({ patient_id: '', credits: '', last_updated: '' });
      fetchAllData();
    } catch {
      showNotification('Error creating health credit');
    }
    setLoading(false);
  };

  const handleCreateMaternalRecord = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post(`${API_URL}/maternal-health-records`, newMaternalRecord);
      showNotification('Maternal health record created!');
      setNewMaternalRecord({ patient_id: '', details: '', created_at: '' });
      fetchAllData();
    } catch {
      showNotification('Error creating maternal health record');
    }
    setLoading(false);
  };

  // const handleCreateMedicineSwap = async (e) => { /* removed with MedicineSwapsPage */ };

  const handleCreateEpidemicAlert = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post(`${API_URL}/epidemic-alerts`, newEpidemicAlert);
      showNotification('Epidemic alert created!');
      setNewEpidemicAlert({ location: '', disease: '', risk_level: '', alert_time: '' });
      fetchAllData();
    } catch {
      showNotification('Error creating epidemic alert');
    }
    setLoading(false);
  };

  const handleCreateSanitaryPadVending = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post(`${API_URL}/sanitary-pad-vendings`, newSanitaryPadVending);
      showNotification('Sanitary pad vending record created!');
      setNewSanitaryPadVending({ patient_id: '', quantity: '', dispensed_at: '' });
      fetchAllData();
    } catch {
      showNotification('Error creating sanitary pad vending record');
    }
    setLoading(false);
  };

  const handleCreateTeleconsultation = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post(`${API_URL}/teleconsultations`, newTeleconsultation);
      showNotification('Teleconsultation created!');
      setNewTeleconsultation({ patient_id: '', doctor_id: '', scheduled_time: '', notes: '' });
      fetchAllData();
    } catch {
      showNotification('Error creating teleconsultation');
    }
    setLoading(false);
  };

  // Add similar handlers for other models as needed...

  // UI rendering for each tab
  const renderDashboard = () => (
    <div className="card">
      <h2>{translations.en.dashboard}</h2>
      <p style={{marginBottom: 0}}>{translations.en.welcome}, <b>{loginUsername}</b>!</p>
      <p style={{marginTop: 0, color: '#64748b'}}>{translations.en.loggedIn}</p>
      <div>
        <h3>{translations.en.submitSymptoms}</h3>
        <form onSubmit={handleDiagnose}>
          <input
            type="text"
            placeholder={translations.en.describeSymptoms}
            value={symptoms}
            onChange={e => setSymptoms(e.target.value)}
          />
          <button type="submit">{translations.en.diagnose}</button>
        </form>
        <p style={{color: '#0ea5e9'}}>{diagnosis}</p>
      </div>
      <div>
        <h3>{translations.en.yourDiagnosis}</h3>
        <ul>
          {history.map((item, idx) => (
            <li key={idx}>
              <strong>{translations.en.symptoms}:</strong> {item.symptoms} <br />
              <strong>{translations.en.diagnosis}:</strong> {item.diagnosis}
            </li>
          ))}
        </ul>
        <button onClick={handleLogout} style={{background: '#e11d48', marginTop: 12}}>{translations.en.logout}</button>
      </div>
      <div style={{marginTop: 20}}>
        <button onClick={() => setTab('patients')}>{translations.en.patients}</button>
        <button onClick={() => setTab('doctors')}>{translations.en.doctors}</button>
        <button onClick={() => setTab('medicines')}>{translations.en.medicines}</button>
        <button onClick={() => setTab('healthCredits')}>{translations.en.healthCredits}</button>
        <button onClick={() => setTab('maternalRecords')}>{translations.en.maternalRecords}</button>
        <button onClick={() => setTab('medicineSwaps')}>{translations.en.medicineSwaps}</button>
        <button onClick={() => setTab('epidemicAlerts')}>{translations.en.epidemicAlerts}</button>
        <button onClick={() => setTab('sanitaryPadVendings')}>{translations.en.sanitaryPadVendings}</button>
        <button onClick={() => setTab('teleconsultations')}>{translations.en.teleconsultations}</button>
        <button onClick={() => setTab('diseasePredictor')}>{translations.en.diseasePredictor}</button>
        <button onClick={() => setTab('healthRisk')}>{translations.en.healthRisk}</button>
        {/* Add more buttons for other models */}
      </div>
    </div>
  );

  // Render Patients Tab
  const renderPatients = () => (
    <div className="card">
      <h2>{translations.en.patients}</h2>
      <form onSubmit={handleCreatePatient}>
        <input name="user_id" placeholder="User ID" value={newPatient.user_id} onChange={handleInputChange(setNewPatient)} />
        <input name="name" placeholder="Name" value={newPatient.name} onChange={handleInputChange(setNewPatient)} />
        <input name="age" placeholder="Age" value={newPatient.age} onChange={handleInputChange(setNewPatient)} />
        <input name="gender" placeholder="Gender" value={newPatient.gender} onChange={handleInputChange(setNewPatient)} />
        <input name="address" placeholder="Address" value={newPatient.address} onChange={handleInputChange(setNewPatient)} />
        <button type="submit">Add Patient</button>
      </form>
      <ul>
        {patients.map(p => (
          <li key={p.id}>{p.name} ({p.gender}, {p.age}) - {p.address}</li>
        ))}
      </ul>
      <button onClick={() => setTab('dashboard')}>{translations.en.back}</button>
    </div>
  );

  // Render Doctors Tab
  const renderDoctors = () => (
    <div className="card">
      <h2>{translations.en.doctors}</h2>
      <form onSubmit={handleCreateDoctor}>
        <input name="user_id" placeholder="User ID" value={newDoctor.user_id} onChange={handleInputChange(setNewDoctor)} />
        <input name="name" placeholder="Name" value={newDoctor.name} onChange={handleInputChange(setNewDoctor)} />
        <input name="specialization" placeholder="Specialization" value={newDoctor.specialization} onChange={handleInputChange(setNewDoctor)} />
        <input name="contact" placeholder="Contact" value={newDoctor.contact} onChange={handleInputChange(setNewDoctor)} />
        <button type="submit">Add Doctor</button>
      </form>
      <ul>
        {doctors.map(d => (
          <li key={d.id}>{d.name} ({d.specialization}) - {d.contact}</li>
        ))}
      </ul>
      <button onClick={() => setTab('dashboard')}>{translations.en.back}</button>
    </div>
  );

  // Render Medicines Tab
  const renderMedicines = () => (
    <div className="card">
      <h2>{translations.en.medicines}</h2>
      <form onSubmit={handleCreateMedicine}>
        <input name="name" placeholder="Name" value={newMedicine.name} onChange={handleInputChange(setNewMedicine)} />
        <input name="batch_number" placeholder="Batch Number" value={newMedicine.batch_number} onChange={handleInputChange(setNewMedicine)} />
        <input name="expiry_date" placeholder="Expiry Date (YYYY-MM-DD)" value={newMedicine.expiry_date} onChange={handleInputChange(setNewMedicine)} />
        <label>
          Fraudulent:
          <input name="is_fraudulent" type="checkbox" checked={newMedicine.is_fraudulent} onChange={handleInputChange(setNewMedicine)} />
        </label>
        <button type="submit">Add Medicine</button>
      </form>
      <ul>
        {medicines.map(m => (
          <li key={m.id}>{m.name} (Batch: {m.batch_number}, Expiry: {m.expiry_date}, Fraud: {m.is_fraudulent ? 'Yes' : 'No'})</li>
        ))}
      </ul>
      <button onClick={() => setTab('dashboard')}>{translations.en.back}</button>
    </div>
  );

  // Render Health Credits Tab
  const renderHealthCredits = () => (
    <div className="card">
      <h2>{translations.en.healthCredits}</h2>
      <form onSubmit={handleCreateHealthCredit}>
        <input name="patient_id" placeholder="Patient ID" value={newHealthCredit.patient_id} onChange={handleInputChange(setNewHealthCredit)} />
        <input name="credits" placeholder="Credits" value={newHealthCredit.credits} onChange={handleInputChange(setNewHealthCredit)} />
        <input name="last_updated" placeholder="Last Updated (YYYY-MM-DD)" value={newHealthCredit.last_updated} onChange={handleInputChange(setNewHealthCredit)} />
        <button type="submit">Add Health Credit</button>
      </form>
      <ul>
        {healthCredits.map(h => (
          <li key={h.id}>Patient: {h.patient_id}, Credits: {h.credits}, Last Updated: {h.last_updated}</li>
        ))}
      </ul>
      <button onClick={() => setTab('dashboard')}>{translations.en.back}</button>
    </div>
  );

  // Render Maternal Health Records Tab
  const renderMaternalRecords = () => (
    <div className="card">
      <h2>{translations.en.maternalRecords}</h2>
      <form onSubmit={handleCreateMaternalRecord}>
        <input name="patient_id" placeholder="Patient ID" value={newMaternalRecord.patient_id} onChange={handleInputChange(setNewMaternalRecord)} />
        <input name="details" placeholder="Details" value={newMaternalRecord.details} onChange={handleInputChange(setNewMaternalRecord)} />
        <input name="created_at" placeholder="Created At (YYYY-MM-DD)" value={newMaternalRecord.created_at} onChange={handleInputChange(setNewMaternalRecord)} />
        <button type="submit">Add Maternal Record</button>
      </form>
      <ul>
        {maternalRecords.map(m => (
          <li key={m.id}>Patient: {m.patient_id}, Details: {m.details}, Created At: {m.created_at}</li>
        ))}
      </ul>
      <button onClick={() => setTab('dashboard')}>{translations.en.back}</button>
    </div>
  );

  // Render Medicine Swaps Tab (removed)
  // const renderMedicineSwaps = () => (
  //   <div className="card">
  //     <h2>{translations.en.medicineSwaps}</h2>
  //     <form onSubmit={handleCreateMedicineSwap}>
  //       <input name="patient_id" placeholder="Patient ID" value={newMedicineSwap.patient_id} onChange={handleInputChange(setNewMedicineSwap)} />
  //       <input name="old_medicine_id" placeholder="Old Medicine ID" value={newMedicineSwap.old_medicine_id} onChange={handleInputChange(setNewMedicineSwap)} />
  //       <input name="new_medicine_id" placeholder="New Medicine ID" value={newMedicineSwap.new_medicine_id} onChange={handleInputChange(setNewMedicineSwap)} />
  //       <input name="status" placeholder="Status" value={newMedicineSwap.status} onChange={handleInputChange(setNewMedicineSwap)} />
  //       <input name="swapped_at" placeholder="Swapped At (YYYY-MM-DD)" value={newMedicineSwap.swapped_at} onChange={handleInputChange(setNewMedicineSwap)} />
  //       <button type="submit">Add Medicine Swap</button>
  //     </form>
  //     <ul>
  //       {medicineSwaps.map(s => (
  //         <li key={s.id}>Patient: {s.patient_id}, Old: {s.old_medicine_id}, New: {s.new_medicine_id}, Status: {s.status}, Swapped At: {s.swapped_at}</li>
  //       ))}
  //     </ul>
  //     <button onClick={() => setTab('dashboard')}>{translations.en.back}</button>
  //   </div>
  // );

  // Render Epidemic Alerts Tab
  const renderEpidemicAlerts = () => (
    <div className="card">
      <h2>{translations.en.epidemicAlerts}</h2>
      <form onSubmit={handleCreateEpidemicAlert}>
        <input name="location" placeholder="Location" value={newEpidemicAlert.location} onChange={handleInputChange(setNewEpidemicAlert)} />
        <input name="disease" placeholder="Disease" value={newEpidemicAlert.disease} onChange={handleInputChange(setNewEpidemicAlert)} />
        <input name="risk_level" placeholder="Risk Level" value={newEpidemicAlert.risk_level} onChange={handleInputChange(setNewEpidemicAlert)} />
        <input name="alert_time" placeholder="Alert Time (YYYY-MM-DD)" value={newEpidemicAlert.alert_time} onChange={handleInputChange(setNewEpidemicAlert)} />
        <button type="submit">Add Epidemic Alert</button>
      </form>
      <ul>
        {epidemicAlerts.map(a => (
          <li key={a.id}>Location: {a.location}, Disease: {a.disease}, Risk: {a.risk_level}, Time: {a.alert_time}</li>
        ))}
      </ul>
      <button onClick={() => setTab('dashboard')}>{translations.en.back}</button>
    </div>
  );

  // Render Sanitary Pad Vendings Tab
  const renderSanitaryPadVendings = () => (
    <div className="card">
      <h2>{translations.en.sanitaryPadVendings}</h2>
      <form onSubmit={handleCreateSanitaryPadVending}>
        <input name="patient_id" placeholder="Patient ID" value={newSanitaryPadVending.patient_id} onChange={handleInputChange(setNewSanitaryPadVending)} />
        <input name="quantity" placeholder="Quantity" value={newSanitaryPadVending.quantity} onChange={handleInputChange(setNewSanitaryPadVending)} />
        <input name="dispensed_at" placeholder="Dispensed At (YYYY-MM-DD)" value={newSanitaryPadVending.dispensed_at} onChange={handleInputChange(setNewSanitaryPadVending)} />
        <button type="submit">Add Vending Record</button>
      </form>
      <ul>
        {sanitaryPadVendings.map(v => (
          <li key={v.id}>Patient: {v.patient_id}, Quantity: {v.quantity}, Dispensed At: {v.dispensed_at}</li>
        ))}
      </ul>
      <button onClick={() => setTab('dashboard')}>{translations.en.back}</button>
    </div>
  );

  // Render Teleconsultations Tab
  const renderTeleconsultations = () => (
    <div className="card">
      <h2>{translations.en.teleconsultations}</h2>
      <form onSubmit={handleCreateTeleconsultation}>
        <input name="patient_id" placeholder="Patient ID" value={newTeleconsultation.patient_id} onChange={handleInputChange(setNewTeleconsultation)} />
        <input name="doctor_id" placeholder="Doctor ID" value={newTeleconsultation.doctor_id} onChange={handleInputChange(setNewTeleconsultation)} />
        <input name="scheduled_time" placeholder="Scheduled Time (YYYY-MM-DD)" value={newTeleconsultation.scheduled_time} onChange={handleInputChange(setNewTeleconsultation)} />
        <input name="notes" placeholder="Notes" value={newTeleconsultation.notes} onChange={handleInputChange(setNewTeleconsultation)} />
        <button type="submit">Add Teleconsultation</button>
      </form>
      <ul>
        {teleconsultations.map(t => (
          <li key={t.id}>Patient: {t.patient_id}, Doctor: {t.doctor_id}, Time: {t.scheduled_time}, Notes: {t.notes}</li>
        ))}
      </ul>
      <button onClick={() => setTab('dashboard')}>{translations.en.back}</button>
    </div>
  );

  // Render Disease Predictor Tab
  const renderDiseasePredictor = () => (
    <div className="card">
      <h2>{translations.en.diseasePredictor}</h2>
      <DiseasePredictor />
      <button onClick={() => setTab('dashboard')}>{translations.en.back}</button>
    </div>
  );

  // Render Health Risk Predictor Tab
  const renderHealthRiskPredictor = () => (
    <div className="card">
      <h2>{translations.en.healthRisk}</h2>
      <HealthRiskPredictor />
      <button onClick={() => setTab('dashboard')}>{translations.en.back}</button>
    </div>
  );
  

  // Add similar render functions for other models as needed...

   return (
    <>
      <CssBaseline />
      <Router>
        {isLoggedIn && (
<AppBar position="sticky" elevation={4} sx={{ background: 'linear-gradient(90deg, #1976d2 60%, #43a047 100%)' }}>
  <Toolbar>
    <LocalHospitalIcon sx={{ mr: 1 }} />
    <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 700, letterSpacing: 1, display: 'flex', alignItems: 'center' }}>
      Gramin Swasthya Setu
      <span style={{ marginLeft: 24 }}>
        <img
          src="https://png.pngtree.com/png-clipart/20230401/original/pngtree-smart-chatbot-cartoon-clipart-png-image_9015126.png"
          alt="ATLAS Ai"
          style={{
            width: 64, // Make icon bigger
            height: 64,
            cursor: 'pointer',
            marginRight: 8,
            boxShadow: '0 4px 16px #1976d299',
            borderRadius: '50%',
            border: '3px solid #43a047',
            background: 'white',
            transition: 'transform 0.2s',
            transform: showChatbot ? 'scale(1.1)' : 'scale(1)'
          }}
          onClick={() => setShowChatbot(!showChatbot)}
        />
      </span>
    </Typography>
    <Button
      color="inherit"
      component={Link}
      to="/profile"
      startIcon={<AccountCircleIcon sx={{ fontSize: 28 }} />}
      sx={{
        textTransform: 'none',
        fontWeight: 600,
        borderRadius: 2,
        background: 'rgba(255,255,255,0.15)',
        px: 2,
        ml: 2,
        '&:hover': { background: 'rgba(255,255,255,0.25)' }
      }}
    >
      Profile
    </Button>
  </Toolbar>
</AppBar>
        )}
        <Routes>
          {!isLoggedIn && <Route path="*" element={<SignInPage onSignIn={() => setIsLoggedIn(true)} />} />}
          {isLoggedIn && (
            <>
              <Route path="/" element={<Home />} />
              <Route path="/patients" element={<PatientsPage />} />
              <Route path="/doctors" element={<DoctorsPage />} />
              <Route path="/medicines" element={<MedicinesPage />} />
              <Route path="/medicine-vending" element={<MedicineVending />} />
              <Route path="/health-credits" element={<HealthCreditsPage />} />
              <Route path="/maternal-health-records" element={<MaternalHealthRecordsPage />} />
              {/* <Route path="/medicine-swaps" element={<MedicineSwapsPage />} /> */}
              <Route path="/epidemic-alerts" element={<EpidemicAlertsPage />} />
              <Route path="/sanitary-pad-vendings" element={<SanitaryPadVendingsPage />} />
              <Route path="/teleconsultations" element={<TeleconsultationsPage />} />
              <Route path="/disease-predictor" element={<DiseasePredictor />} />
              <Route path="/health-risk" element={<HealthRiskPredictor />} />
              <Route path="/mri-scan" element={<MRIScanPrediction />} />
              <Route path="/profile" element={<ProfilePage />} />
              {/* Add more routes as needed */}
            </>
          )}
        </Routes>
        {showChatbot && (
  <div style={{ position: 'fixed', bottom: 20, right: 20, zIndex: 1000 }}>
    <Chatbot />
  </div>
)}
      </Router>
    </>
  );
}

export default App;
