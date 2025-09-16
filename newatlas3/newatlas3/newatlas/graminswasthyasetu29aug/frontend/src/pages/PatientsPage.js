import React, { useEffect, useState } from 'react';
import {
  Typography, Paper, Button, Stack, Box, Grid, Card, CardContent, Avatar, Chip,
  TextField, InputAdornment, Select, MenuItem, FormControl, InputLabel,
  Dialog, DialogTitle, DialogContent, DialogActions, Divider, Badge,
  List, ListItem, ListItemText, ListItemIcon, Accordion, AccordionSummary, AccordionDetails,
  Timeline, TimelineItem, TimelineContent, TimelineSeparator, TimelineDot, TimelineConnector
} from '@mui/material';
import {
  Search as SearchIcon,
  Person as PersonIcon,
  ContactPage as ContactCardIcon,
  MedicalServices as MedicalServicesIcon,
  History as HistoryIcon,
  Favorite as FavoriteIcon,
  LocalHospital as LocalHospitalIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
  CalendarToday as CalendarIcon,
  FilterList as FilterIcon,
  ExpandMore as ExpandMoreIcon,
  Opacity as BloodTypeIcon,
  Height as HeightIcon,
  Monitor as MonitorIcon,
  Medication as MedicationIcon
} from '@mui/icons-material';

// Enhanced translations for patient management
const translations = {
  en: {
    patients: "Patient Management",
    searchPatients: "Search by name, ABHA ID, or phone...",
    abhaId: "ABHA ID",
    accessData: "Access Patient Data",
    viewProfile: "View Profile",
    searchAbhaId: "Search by ABHA ID or village...",
    privacySystem: "Patient Data Access - Privacy Protected System",
    privacyNote1: "• All patient records are privacy protected and can only be accessed using valid ABHA ID",
    privacyNote2: "• Click on any ABHA ID card below to access patient data",
    availableIds: "available ABHA IDs",
    clickToAccess: "Click to access patient data",
    noAbhaFound: "No ABHA IDs found",
    adjustSearch: "Try adjusting your search term",
    personalInfo: "Personal Information",
    medicalHistory: "Medical History",
    vitals: "Vital Signs",
    appointments: "Appointments",
    prescriptions: "Prescriptions",
    name: "Name",
    age: "Age",
    gender: "Gender",
    phone: "Phone",
    address: "Address",
    bloodGroup: "Blood Group",
    emergencyContact: "Emergency Contact",
    lastVisit: "Last Visit",
    condition: "Condition",
    male: "Male",
    female: "Female",
    active: "Active",
    recovered: "Recovered",
    underTreatment: "Under Treatment",
    filterBy: "Filter by Status",
    allPatients: "All Patients",
    enterAbhaId: "Enter ABHA ID to access patient data",
    invalidAbhaId: "Invalid ABHA ID or patient not found",
    patientFound: "Patient Found! Access granted.",
    height: "Height",
    weight: "Weight",
    bmi: "BMI",
    temperature: "Temperature",
    heartRate: "Heart Rate",
    bloodPressure: "Blood Pressure",
    close: "Close"
  },
  hi: {
    patients: "रोगी प्रबंधन",
    searchPatients: "नाम, आभा आईडी या फोन से खोजें...",
    abhaId: "आभा आईडी",
    accessData: "रोगी डेटा एक्सेस करें",
    viewProfile: "प्रोफाइल देखें",
    searchAbhaId: "आभा आईडी या गांव से खोजें...",
    privacySystem: "रोगी डेटा एक्सेस - गोपनीयता संरक्षित प्रणाली",
    privacyNote1: "• सभी रोगी रिकॉर्ड गोपनीयता संरक्षित हैं और केवल वैध आभा आईडी का उपयोग करके एक्सेस किए जा सकते हैं",
    privacyNote2: "• रोगी डेटा एक्सेस करने के लिए नीचे किसी भी आभा आईडी कार्ड पर क्लिक करें",
    availableIds: "उपलब्ध आभा आईडी",
    clickToAccess: "रोगी डेटा एक्सेस करने के लिए क्लिक करें",
    noAbhaFound: "कोई आभा आईडी नहीं मिली",
    adjustSearch: "अपने खोज शब्द को समायोजित करने का प्रयास करें",
    personalInfo: "व्यक्तिगत जानकारी",
    medicalHistory: "चिकित्सा इतिहास",
    vitals: "महत्वपूर्ण संकेत",
    appointments: "अपॉइंटमेंट्स",
    prescriptions: "नुस्खे",
    name: "नाम",
    age: "आयु",
    gender: "लिंग",
    phone: "फोन",
    address: "पता",
    bloodGroup: "रक्त समूह",
    emergencyContact: "आपातकालीन संपर्क",
    lastVisit: "अंतिम मुलाकात",
    condition: "स्थिति",
    male: "पुरुष",
    female: "महिला",
    active: "सक्रिय",
    recovered: "ठीक हो गया",
    underTreatment: "इलाज के तहत",
    filterBy: "स्थिति के अनुसार फ़िल्टर करें",
    allPatients: "सभी मरीज",
    enterAbhaId: "रोगी डेटा एक्सेस करने के लिए आभा आईडी दर्ज करें",
    invalidAbhaId: "अमान्य आभा आईडी या मरीज नहीं मिला",
    patientFound: "मरीज मिल गया! एक्सेस दी गई।",
    height: "लंबाई",
    weight: "वजन",
    bmi: "बीएमआई",
    temperature: "तापमान",
    heartRate: "हृदय गति",
    bloodPressure: "रक्तचाप",
    close: "बंद करें"
  },
  kn: {
    patients: "ರೋಗಿ ನಿರ್ವಹಣೆ",
    searchPatients: "ಹೆಸರು, ಆಭಾ ಐಡಿ ಅಥವಾ ಫೋನ್‌ನಿಂದ ಹುಡುಕಿ...",
    abhaId: "ಆಭಾ ಐಡಿ",
    accessData: "ರೋಗಿ ಡೇಟಾವನ್ನು ಪ್ರವೇಶಿಸಿ",
    viewProfile: "ಪ್ರೆಫೈಲ್ ವೀಕ್ಷಿಸಿ",
    searchAbhaId: "ಆಭಾ ಐಡಿ ಅಥವಾ ಗ್ರಾಮದಿಂದ ಹುಡುಕಿ...",
    privacySystem: "ರೋಗಿ ಡೇಟಾ ಪ್ರವೇಶ - ಗೌಪ್ಯತಾ ಸಂರಕ್ಷಿತ ವ್ಯವಸ್ಥೆ",
    privacyNote1: "• ಎಲ್ಲಾ ರೋಗಿ ರೆಕಾರ್ಡ್‌ಗಳು ಗೌಪ್ಯತಾ ಸಂರಕ್ಷಿತವಾಗಿವೆ ಮತ್ತು ಕೇವಲ ವೈಧ ಆಭಾ ಐಡಿ ಬೃಸುವು ಮಾಡುವುದು ಪ್ರವೇಶಿಸಬಹುದು",
    privacyNote2: "• ರೋಗಿ ಡೇಟಾವನ್ನು ಪ್ರವೇಶಿಸಲು ಕೆಳಗಿನ ಯಾವುದೇ ಆಭಾ ಐಡಿ ಕಾರ್ಡ್‌ನಲ್ಲಿ ಕ್ಲಿಕ್ ಮಾಡಿ",
    availableIds: "ಲಭ್ಯವಿರುವ ಆಭಾ ಐಡಿಗಳು",
    clickToAccess: "ರೋಗಿ ಡೇಟಾವನ್ನು ಪ್ರವೇಶಿಸಲು ಕ್ಲಿಕ್ ಮಾಡಿ",
    noAbhaFound: "ಯಾವುದೇ ಆಭಾ ಐಡಿಗಳು ಸಿಗಲಿಲ್ಲ",
    adjustSearch: "ನಿಮ್ಮ ಹುಡುಕಾಟ ಪದವನ್ನು ಸಮಾಯೋಜಿಸಲು ಪ್ರಯತ್ನಿಸಿ",
    personalInfo: "ವೈಯಕ್ತಿಕ ಮಾಹಿತಿ",
    medicalHistory: "ವೈದ್ಯಕೀಯ ಇತಿಹಾಸ",
    vitals: "ಮುಖ್ಯ ಚಿಹ್ನೆಗಳು",
    appointments: "ಅಪಾಯಿಂಟ್‌ಮೆಂಟ್‌ಗಳು",
    prescriptions: "ಔಷಧಿ ಪ್ರಿಸ್ಕ್ರಿಪ್ಷನ್‌ಗಳು",
    name: "ಹೆಸರು",
    age: "ವಯಸ್ಸು",
    gender: "ಲಿಂಗ",
    phone: "ಫೋನ್",
    address: "ವಿಳಾಸ",
    bloodGroup: "ರಕ್ತ ಗುಂಪು",
    emergencyContact: "ತುರ್ತು ಸಂಪರ್ಕ",
    lastVisit: "ಕೊನೆಯ ಭೇಟಿ",
    condition: "ಸ್ಥಿತಿ",
    male: "ಪುರುಷ",
    female: "ಮಹಿಳೆ",
    active: "ಸಕ್ರಿಯ",
    recovered: "ಚೇತರಿಸಿಕೊಂಡಿದೆ",
    underTreatment: "ಚಿಕಿತ್ಸೆಯಲ್ಲಿ",
    filterBy: "ಸ್ಥಿತಿಯ ಆಧಾರದ ಮೇಲೆ ಫಿಲ್ಟರ್ ಮಾಡಿ",
    allPatients: "ಎಲ್ಲಾ ರೋಗಿಗಳು",
    enterAbhaId: "ರೋಗಿ ಡೇಟಾವನ್ನು ಪ್ರವೇಶಿಸಲು ಆಭಾ ಐಡಿ ನಮೂದಿಸಿ",
    invalidAbhaId: "ಅಮಾನ್ಯ ಆಭಾ ಐಡಿ ಅಥವಾ ರೋಗಿ ಸಿಗಲಿಲ್ಲ",
    patientFound: "ರೋಗಿ ಸಿಕ್ಕಿದೆ! ಪ್ರವೇಶ ನೀಡಲಾಗಿದೆ.",
    height: "ಎತ್ತರ",
    weight: "ತೂಕ",
    bmi: "ಬಿಎಮ್‌ಐ",
    temperature: "ಉಷ್ಣಾಂಶ",
    heartRate: "ಹೃದಯ ಬಡಿತ",
    bloodPressure: "ರಕ್ತದೊತ್ತಡ",
    close: "ಮುಚ್ಚಿ"
  }
};

// Comprehensive list of 30 patients with ABHA IDs (Privacy Protected - Access only via ABHA ID)
const patientsData = [
  {
    id: 1,
    name: "रामू पटेल",
    age: 45,
    gender: "Male",
    phone: "+91-9876543210",
    address: "Village Khargone, Madhya Pradesh",
    abhaId: "23-1001-2001-3001",
    bloodGroup: "B+",
    emergencyContact: "+91-9876543211",
    lastVisit: "2024-01-10",
    condition: "Active",
    vitals: { height: "165 cm", weight: "65 kg", bmi: "23.9", temperature: "98.6°F", heartRate: "72 bpm", bloodPressure: "120/80" },
    medicalHistory: ["Diabetes Type 2 (2020)", "Hypertension (2021)"],
    avatar: "https://images.unsplash.com/photo-1582233479366-6d38bc390a08?w=150&h=150&fit=crop&crop=face"
  },
  {
    id: 2,
    name: "सुनीता देवी",
    age: 38,
    gender: "Female",
    phone: "+91-9876543220",
    address: "Village Bareilly, Uttar Pradesh",
    abhaId: "23-1001-2001-3002",
    bloodGroup: "A+",
    emergencyContact: "+91-9876543221",
    lastVisit: "2024-01-12",
    condition: "Recovered",
    vitals: { height: "155 cm", weight: "50 kg", bmi: "20.8", temperature: "98.4°F", heartRate: "76 bpm", bloodPressure: "110/70" },
    medicalHistory: ["Anemia (2022)", "Childbirth complications (2021)"],
    avatar: "https://images.unsplash.com/photo-1594736797933-d0c6d08fc4f2?w=150&h=150&fit=crop&crop=face"
  },
  {
    id: 3,
    name: "अमित कुमार",
    age: 28,
    gender: "Male",
    phone: "+91-9876543230",
    address: "Village Sonipat, Haryana",
    abhaId: "23-1001-2001-3003",
    bloodGroup: "O+",
    emergencyContact: "+91-9876543231",
    lastVisit: "2024-01-08",
    condition: "Under Treatment",
    vitals: { height: "170 cm", weight: "68 kg", bmi: "23.5", temperature: "99.2°F", heartRate: "68 bpm", bloodPressure: "125/85" },
    medicalHistory: ["Kidney Stones (2023)", "Back Pain (2022)"],
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face"
  },
  {
    id: 4,
    name: "मीरा देवी",
    age: 42,
    gender: "Female",
    phone: "+91-9876543240",
    address: "Village Sitapur, Uttar Pradesh",
    abhaId: "23-1001-2001-3004",
    bloodGroup: "AB+",
    emergencyContact: "+91-9876543241",
    lastVisit: "2024-01-15",
    condition: "Active",
    vitals: { height: "152 cm", weight: "48 kg", bmi: "20.8", temperature: "98.6°F", heartRate: "74 bpm", bloodPressure: "115/75" },
    medicalHistory: ["Iron deficiency (2022)", "Maternal health (2020)"],
    avatar: "https://images.unsplash.com/photo-1551836022-deb4988cc6c0?w=150&h=150&fit=crop&crop=face"
  },
  {
    id: 5,
    name: "विक्रम यादव",
    age: 52,
    gender: "Male",
    phone: "+91-9876543250",
    address: "Village Etawah, Uttar Pradesh",
    abhaId: "23-1001-2001-3005",
    bloodGroup: "B-",
    emergencyContact: "+91-9876543251",
    lastVisit: "2024-01-05",
    condition: "Under Treatment",
    vitals: { height: "168 cm", weight: "72 kg", bmi: "25.5", temperature: "98.8°F", heartRate: "70 bpm", bloodPressure: "130/90" },
    medicalHistory: ["Diabetes (2019)", "Joint pain (2021)"],
    avatar: "https://images.unsplash.com/photo-1566492031773-4f4e44671d66?w=150&h=150&fit=crop&crop=face"
  },
  {
    id: 6,
    name: "कविता शर्मा",
    age: 29,
    gender: "Female",
    phone: "+91-9876543260",
    address: "Village Gonda, Uttar Pradesh",
    abhaId: "23-1001-2001-3006",
    bloodGroup: "A-",
    emergencyContact: "+91-9876543261",
    lastVisit: "2024-01-14",
    condition: "Active",
    vitals: { height: "150 cm", weight: "45 kg", bmi: "20.0", temperature: "98.4°F", heartRate: "78 bpm", bloodPressure: "108/68" },
    medicalHistory: ["Post-natal care (2023)", "Nutritional guidance (2022)"],
    avatar: "https://images.unsplash.com/photo-1594736797933-d0c6d08fc4f2?w=150&h=150&fit=crop&crop=face"
  },
  {
    id: 7,
    name: "अर्जुन सिंह",
    age: 35,
    gender: "Male",
    phone: "+91-9876543270",
    address: "Village Jaunpur, Uttar Pradesh",
    abhaId: "23-1001-2001-3007",
    bloodGroup: "O-",
    emergencyContact: "+91-9876543271",
    lastVisit: "2024-01-11",
    condition: "Recovered",
    vitals: { height: "172 cm", weight: "66 kg", bmi: "22.3", temperature: "98.6°F", heartRate: "71 bpm", bloodPressure: "118/78" },
    medicalHistory: ["Respiratory infection (2023)", "Seasonal allergies (2022)"],
    avatar: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&h=150&fit=crop&crop=face"
  },
  {
    id: 8,
    name: "सुमित्रा राय",
    age: 47,
    gender: "Female",
    phone: "+91-9876543280",
    address: "Village Azamgarh, Uttar Pradesh",
    abhaId: "23-1001-2001-3008",
    bloodGroup: "B+",
    emergencyContact: "+91-9876543281",
    lastVisit: "2024-01-09",
    condition: "Active",
    vitals: { height: "148 cm", weight: "52 kg", bmi: "23.7", temperature: "98.5°F", heartRate: "75 bpm", bloodPressure: "112/72" },
    medicalHistory: ["Blood pressure monitoring (2021)", "Eye check-up (2023)"],
    avatar: "https://images.unsplash.com/photo-1582233479366-6d38bc390a08?w=150&h=150&fit=crop&crop=face"
  },
  {
    id: 9,
    name: "रवि प्रसाद",
    age: 38,
    gender: "Male",
    phone: "+91-9876543290",
    address: "Village Faizabad, Uttar Pradesh",
    abhaId: "23-1001-2001-3009",
    bloodGroup: "AB-",
    emergencyContact: "+91-9876543291",
    lastVisit: "2024-01-07",
    condition: "Under Treatment",
    vitals: { height: "165 cm", weight: "62 kg", bmi: "22.8", temperature: "99.0°F", heartRate: "69 bpm", bloodPressure: "128/88" },
    medicalHistory: ["Stomach ulcer (2022)", "Dietary management (2023)"],
    avatar: "https://images.unsplash.com/photo-1507591064344-4c6ce005b128?w=150&h=150&fit=crop&crop=face"
  },
  {
    id: 10,
    name: "गीता चौधरी",
    age: 33,
    gender: "Female",
    phone: "+91-9876543300",
    address: "Village Sultanpur, Uttar Pradesh",
    abhaId: "23-1001-2001-3010",
    bloodGroup: "A+",
    emergencyContact: "+91-9876543301",
    lastVisit: "2024-01-13",
    condition: "Active",
    vitals: { height: "154 cm", weight: "49 kg", bmi: "20.6", temperature: "98.4°F", heartRate: "77 bpm", bloodPressure: "110/70" },
    medicalHistory: ["Anemia treatment (2022)", "Vaccination (2023)"],
    avatar: "https://images.unsplash.com/photo-1551836022-deb4988cc6c0?w=150&h=150&fit=crop&crop=face"
  },
  {
    id: 11,
    name: "सुरेश गुप्ता",
    age: 48,
    gender: "Male",
    phone: "+91-9876543310",
    address: "Village Pratapgarh, Uttar Pradesh",
    abhaId: "23-1001-2001-3011",
    bloodGroup: "O+",
    emergencyContact: "+91-9876543311",
    lastVisit: "2024-01-06",
    condition: "Recovered",
    vitals: { height: "167 cm", weight: "70 kg", bmi: "25.1", temperature: "98.6°F", heartRate: "73 bpm", bloodPressure: "122/82" },
    medicalHistory: ["Back pain treatment (2021)", "Physiotherapy (2022)"],
    avatar: "https://images.unsplash.com/photo-1566492031773-4f4e44671d66?w=150&h=150&fit=crop&crop=face"
  },
  {
    id: 12,
    name: "अनीता मिश्रा",
    age: 41,
    gender: "Female",
    phone: "+91-9876543320",
    address: "Village Raebareli, Uttar Pradesh",
    abhaId: "23-1001-2001-3012",
    bloodGroup: "B-",
    emergencyContact: "+91-9876543321",
    lastVisit: "2024-01-04",
    condition: "Under Treatment",
    vitals: { height: "151 cm", weight: "55 kg", bmi: "24.1", temperature: "98.8°F", heartRate: "74 bpm", bloodPressure: "118/76" },
    medicalHistory: ["Thyroid management (2020)", "Regular monitoring (2023)"],
    avatar: "https://images.unsplash.com/photo-1594736797933-d0c6d08fc4f2?w=150&h=150&fit=crop&crop=face"
  },
  {
    id: 13,
    name: "मनोज तिवारी",
    age: 36,
    gender: "Male",
    phone: "+91-9876543330",
    address: "Village Hardoi, Uttar Pradesh",
    abhaId: "23-1001-2001-3013",
    bloodGroup: "A+",
    emergencyContact: "+91-9876543331",
    lastVisit: "2024-01-03",
    condition: "Active",
    vitals: { height: "170 cm", weight: "65 kg", bmi: "22.5", temperature: "98.7°F", heartRate: "72 bpm", bloodPressure: "116/74" },
    medicalHistory: ["General health check (2023)", "Dental care (2022)"],
    avatar: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&h=150&fit=crop&crop=face"
  },
  {
    id: 14,
    name: "सुषमा वर्मा",
    age: 44,
    gender: "Female",
    phone: "+91-9876543340",
    address: "Village Unnao, Uttar Pradesh",
    abhaId: "23-1001-2001-3014",
    bloodGroup: "O-",
    emergencyContact: "+91-9876543341",
    lastVisit: "2024-01-02",
    condition: "Under Treatment",
    vitals: { height: "149 cm", weight: "51 kg", bmi: "23.0", temperature: "98.9°F", heartRate: "75 bpm", bloodPressure: "125/80" },
    medicalHistory: ["Women's health care (2022)", "Preventive screening (2023)"],
    avatar: "https://images.unsplash.com/photo-1551836022-deb4988cc6c0?w=150&h=150&fit=crop&crop=face"
  },
  {
    id: 15,
    name: "अनिल कुमार",
    age: 51,
    gender: "Male",
    phone: "+91-9876543350",
    address: "Village Lakhimpur, Uttar Pradesh",
    abhaId: "23-1001-2001-3015",
    bloodGroup: "B+",
    emergencyContact: "+91-9876543351",
    lastVisit: "2024-01-01",
    condition: "Recovered",
    vitals: { height: "166 cm", weight: "74 kg", bmi: "26.9", temperature: "98.6°F", heartRate: "70 bpm", bloodPressure: "130/85" },
    medicalHistory: ["Heart check-up (2021)", "Lifestyle counseling (2022)"],
    avatar: "https://images.unsplash.com/photo-1507591064344-4c6ce005b128?w=150&h=150&fit=crop&crop=face"
  },
  {
    id: 16,
    name: "पूजा शुक्ला",
    age: 27,
    gender: "Female",
    phone: "+91-9876543360",
    address: "Village Bahraich, Uttar Pradesh",
    abhaId: "23-1001-2001-3016",
    bloodGroup: "AB+",
    emergencyContact: "+91-9876543361",
    lastVisit: "2023-12-31",
    condition: "Active",
    vitals: { height: "156 cm", weight: "47 kg", bmi: "19.3", temperature: "98.5°F", heartRate: "78 bpm", bloodPressure: "112/70" },
    medicalHistory: ["Prenatal care (2023)", "Child health (2022)"],
    avatar: "https://images.unsplash.com/photo-1594736797933-d0c6d08fc4f2?w=150&h=150&fit=crop&crop=face"
  },
  {
    id: 17,
    name: "रोहित जायसवाल",
    age: 39,
    gender: "Male",
    phone: "+91-9876543370",
    address: "Village Shravasti, Uttar Pradesh",
    abhaId: "23-1001-2001-3017",
    bloodGroup: "A-",
    emergencyContact: "+91-9876543371",
    lastVisit: "2023-12-30",
    condition: "Active",
    vitals: { height: "171 cm", weight: "67 kg", bmi: "22.9", temperature: "98.6°F", heartRate: "71 bpm", bloodPressure: "118/76" },
    medicalHistory: ["Vision correction (2022)", "Regular check-up (2023)"],
    avatar: "https://images.unsplash.com/photo-1566492031773-4f4e44671d66?w=150&h=150&fit=crop&crop=face"
  },
  {
    id: 18,
    name: "माधुरी पाण्डेय",
    age: 31,
    gender: "Female",
    phone: "+91-9876543380",
    address: "Village Balrampur, Uttar Pradesh",
    abhaId: "23-1001-2001-3018",
    bloodGroup: "B-",
    emergencyContact: "+91-9876543381",
    lastVisit: "2023-12-29",
    condition: "Under Treatment",
    vitals: { height: "153 cm", weight: "50 kg", bmi: "21.4", temperature: "98.8°F", heartRate: "76 bpm", bloodPressure: "120/78" },
    medicalHistory: ["Hormonal treatment (2021)", "Follow-up care (2023)"],
    avatar: "https://images.unsplash.com/photo-1551836022-deb4988cc6c0?w=150&h=150&fit=crop&crop=face"
  },
  {
    id: 19,
    name: "किरण चौहान",
    age: 46,
    gender: "Male",
    phone: "+91-9876543390",
    address: "Village Siddharthnagar, Uttar Pradesh",
    abhaId: "23-1001-2001-3019",
    bloodGroup: "O+",
    emergencyContact: "+91-9876543391",
    lastVisit: "2023-12-28",
    condition: "Recovered",
    vitals: { height: "169 cm", weight: "71 kg", bmi: "24.9", temperature: "98.7°F", heartRate: "69 bpm", bloodPressure: "128/82" },
    medicalHistory: ["Injury treatment (2022)", "Recovery program (2023)"],
    avatar: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&h=150&fit=crop&crop=face"
  },
  {
    id: 20,
    name: "नीलम त्रिपाठी",
    age: 37,
    gender: "Female",
    phone: "+91-9876543400",
    address: "Village Maharajganj, Uttar Pradesh",
    abhaId: "23-1001-2001-3020",
    bloodGroup: "AB-",
    emergencyContact: "+91-9876543401",
    lastVisit: "2023-12-27",
    condition: "Active",
    vitals: { height: "152 cm", weight: "48 kg", bmi: "20.8", temperature: "98.5°F", heartRate: "77 bpm", bloodPressure: "114/72" },
    medicalHistory: ["Family planning (2021)", "Health education (2023)"],
    avatar: "https://images.unsplash.com/photo-1594736797933-d0c6d08fc4f2?w=150&h=150&fit=crop&crop=face"
  },
  {
    id: 21,
    name: "सन्तोष सिंह",
    age: 49,
    gender: "Male",
    phone: "+91-9876543410",
    address: "Village Kushinagar, Uttar Pradesh",
    abhaId: "23-1001-2001-3021",
    bloodGroup: "A+",
    emergencyContact: "+91-9876543411",
    lastVisit: "2023-12-26",
    condition: "Under Treatment",
    vitals: { height: "164 cm", weight: "69 kg", bmi: "25.6", temperature: "99.0°F", heartRate: "68 bpm", bloodPressure: "135/88" },
    medicalHistory: ["Joint problems (2022)", "Physical therapy (2023)"],
    avatar: "https://images.unsplash.com/photo-1507591064344-4c6ce005b128?w=150&h=150&fit=crop&crop=face"
  },
  {
    id: 22,
    name: "कविता राजपूत",
    age: 34,
    gender: "Female",
    phone: "+91-9876543420",
    address: "Village Deoria, Uttar Pradesh",
    abhaId: "23-1001-2001-3022",
    bloodGroup: "O-",
    emergencyContact: "+91-9876543421",
    lastVisit: "2023-12-25",
    condition: "Active",
    vitals: { height: "150 cm", weight: "46 kg", bmi: "20.4", temperature: "98.4°F", heartRate: "79 bpm", bloodPressure: "108/66" },
    medicalHistory: ["Stress management (2021)", "Mental health support (2022)"],
    avatar: "https://images.unsplash.com/photo-1551836022-deb4988cc6c0?w=150&h=150&fit=crop&crop=face"
  },
  {
    id: 23,
    name: "दिनेश यादव",
    age: 54,
    gender: "Male",
    phone: "+91-9876543430",
    address: "Village Gorakhpur, Uttar Pradesh",
    abhaId: "23-1001-2001-3023",
    bloodGroup: "B+",
    emergencyContact: "+91-9876543431",
    lastVisit: "2023-12-24",
    condition: "Recovered",
    vitals: { height: "163 cm", weight: "68 kg", bmi: "25.6", temperature: "98.6°F", heartRate: "70 bpm", bloodPressure: "125/80" },
    medicalHistory: ["Eye surgery (2021)", "Post-operative care (2022)"],
    avatar: "https://images.unsplash.com/photo-1566492031773-4f4e44671d66?w=150&h=150&fit=crop&crop=face"
  },
  {
    id: 24,
    name: "लता मौर्य",
    age: 42,
    gender: "Female",
    phone: "+91-9876543440",
    address: "Village Basti, Uttar Pradesh",
    abhaId: "23-1001-2001-3024",
    bloodGroup: "AB+",
    emergencyContact: "+91-9876543441",
    lastVisit: "2023-12-23",
    condition: "Active",
    vitals: { height: "148 cm", weight: "53 kg", bmi: "24.2", temperature: "98.5°F", heartRate: "74 bpm", bloodPressure: "116/74" },
    medicalHistory: ["Cancer screening (2022)", "Preventive care (2023)"],
    avatar: "https://images.unsplash.com/photo-1594736797933-d0c6d08fc4f2?w=150&h=150&fit=crop&crop=face"
  },
  {
    id: 25,
    name: "अशोक मिश्र",
    age: 33,
    gender: "Male",
    phone: "+91-9876543450",
    address: "Village Sant Kabir Nagar, Uttar Pradesh",
    abhaId: "23-1001-2001-3025",
    bloodGroup: "A+",
    emergencyContact: "+91-9876543451",
    lastVisit: "2023-12-21",
    condition: "Active",
    vitals: { height: "171 cm", weight: "64 kg", bmi: "21.9", temperature: "98.7°F", heartRate: "70 bpm", bloodPressure: "122/80" },
    medicalHistory: ["Sports injury (2022)", "Rehabilitation (2023)"],
    avatar: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&h=150&fit=crop&crop=face"
  },
  {
    id: 26,
    name: "पल्लवी गुप्ता",
    age: 25,
    gender: "Female",
    phone: "+91-9876543460",
    address: "Village Ambedkar Nagar, Uttar Pradesh",
    abhaId: "23-1001-2001-3026",
    bloodGroup: "O-",
    emergencyContact: "+91-9876543461",
    lastVisit: "2023-12-20",
    condition: "Recovered",
    vitals: { height: "152 cm", weight: "44 kg", bmi: "19.0", temperature: "98.4°F", heartRate: "80 bpm", bloodPressure: "106/66" },
    medicalHistory: ["Nutritional counseling (2023)", "Health education (2022)"],
    avatar: "https://images.unsplash.com/photo-1551836022-deb4988cc6c0?w=150&h=150&fit=crop&crop=face"
  },
  {
    id: 27,
    name: "हरीश चन्द्र",
    age: 68,
    gender: "Male",
    phone: "+91-9876543470",
    address: "Village Mau, Uttar Pradesh",
    abhaId: "23-1001-2001-3027",
    bloodGroup: "B-",
    emergencyContact: "+91-9876543471",
    lastVisit: "2023-12-19",
    condition: "Under Treatment",
    vitals: { height: "160 cm", weight: "58 kg", bmi: "22.7", temperature: "98.9°F", heartRate: "68 bpm", bloodPressure: "140/85" },
    medicalHistory: ["Geriatric care (2021)", "Age-related issues (2022)"],
    avatar: "https://images.unsplash.com/photo-1507591064344-4c6ce005b128?w=150&h=150&fit=crop&crop=face"
  },
  {
    id: 28,
    name: "श्वेता त्यागी",
    age: 35,
    gender: "Female",
    phone: "+91-9876543480",
    address: "Village Ghazipur, Uttar Pradesh",
    abhaId: "23-1001-2001-3028",
    bloodGroup: "A-",
    emergencyContact: "+91-9876543481",
    lastVisit: "2023-12-18",
    condition: "Active",
    vitals: { height: "154 cm", weight: "51 kg", bmi: "21.5", temperature: "98.5°F", heartRate: "76 bpm", bloodPressure: "114/74" },
    medicalHistory: ["Child health care (2023)", "Family planning (2022)"],
    avatar: "https://images.unsplash.com/photo-1594736797933-d0c6d08fc4f2?w=150&h=150&fit=crop&crop=face"
  },
  {
    id: 29,
    name: "गणेश भारद्वाज",
    age: 58,
    gender: "Male",
    phone: "+91-9876543490",
    address: "Village Chandauli, Uttar Pradesh",
    abhaId: "23-1001-2001-3029",
    bloodGroup: "AB-",
    emergencyContact: "+91-9876543491",
    lastVisit: "2023-12-17",
    condition: "Under Treatment",
    vitals: { height: "167 cm", weight: "73 kg", bmi: "26.2", temperature: "99.2°F", heartRate: "66 bpm", bloodPressure: "145/95" },
    medicalHistory: ["Heart treatment (2022)", "Ongoing care (2023)"],
    avatar: "https://images.unsplash.com/photo-1566492031773-4f4e44671d66?w=150&h=150&fit=crop&crop=face"
  },
  {
    id: 30,
    name: "रेखा अग्रवाल",
    age: 43,
    gender: "Female",
    phone: "+91-9876543500",
    address: "Village Varanasi, Uttar Pradesh",
    abhaId: "23-1001-2001-3030",
    bloodGroup: "O+",
    emergencyContact: "+91-9876543501",
    lastVisit: "2023-12-16",
    condition: "Active",
    vitals: { height: "151 cm", weight: "54 kg", bmi: "23.7", temperature: "98.6°F", heartRate: "73 bpm", bloodPressure: "118/76" },
    medicalHistory: ["Traditional treatment (2021)", "Holistic care (2023)"],
    avatar: "https://images.unsplash.com/photo-1551836022-deb4988cc6c0?w=150&h=150&fit=crop&crop=face"
  }
];

// Get unique conditions for filter
const getUniqueConditions = () => {
  const conditions = patientsData.map(patient => patient.condition);
  return [...new Set(conditions)].sort();
};

export default function PatientsPage() {
  const [language, setLanguage] = useState('en');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCondition, setSelectedCondition] = useState('');
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [profileDialog, setProfileDialog] = useState(false);
  const [abhaDialog, setAbhaDialog] = useState(false);
  const [abhaId, setAbhaId] = useState('');
  const [abhaMessage, setAbhaMessage] = useState('');
  const [abhaError, setAbhaError] = useState(false);
  
  const t = translations[language];
  const conditions = getUniqueConditions();

  // Get all ABHA IDs for reference (no personal data exposed)
  const abhaIdList = patientsData.map(patient => ({
    id: patient.id,
    abhaId: patient.abhaId,
    village: patient.address.split(',')[0]
  }));

  // Filter ABHA IDs based on search term only
  const filteredAbhaIds = abhaIdList.filter(item => {
    const matchesSearch = searchTerm === '' || 
                         item.abhaId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.village.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const handleViewProfile = (patient) => {
    setSelectedPatient(patient);
    setProfileDialog(true);
  };

  const handleAbhaAccess = () => {
    if (!abhaId.trim()) {
      setAbhaMessage(t.enterAbhaId);
      setAbhaError(true);
      return;
    }

    const foundPatient = patientsData.find(p => p.abhaId === abhaId.trim());
    if (foundPatient) {
      setAbhaMessage(t.patientFound);
      setAbhaError(false);
      setTimeout(() => {
        setAbhaDialog(false);
        setSelectedPatient(foundPatient);
        setProfileDialog(true);
        setAbhaId('');
        setAbhaMessage('');
      }, 1500);
    } else {
      setAbhaMessage(t.invalidAbhaId);
      setAbhaError(true);
    }
  };

  const AbhaIdCard = ({ item }) => (
    <Card 
      elevation={1} 
      sx={{ 
        height: '100%',
        backgroundColor: '#f8f9fa',
        border: '1px solid #e9ecef',
        transition: 'all 0.2s ease',
        '&:hover': {
          backgroundColor: '#e9ecef',
          transform: 'scale(1.02)'
        },
        cursor: 'pointer'
      }}
      onClick={() => {
        setAbhaId(item.abhaId);
        setAbhaDialog(true);
      }}
    >
      <CardContent sx={{ p: 2, textAlign: 'center' }}>
        <Stack spacing={1} alignItems="center">
          <ContactCardIcon sx={{ fontSize: 32, color: 'primary.main' }} />
          <Typography variant="h6" fontWeight="bold" color="primary">
            {item.abhaId}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {item.village}
          </Typography>
          <Typography variant="caption" color="primary" fontWeight={600}>
            {t.clickToAccess}
          </Typography>
        </Stack>
      </CardContent>
    </Card>
  );

  const PatientProfileDialog = () => (
    <Dialog
      open={profileDialog}
      onClose={() => setProfileDialog(false)}
      maxWidth="md"
      fullWidth
    >
      {selectedPatient && (
        <>
          <DialogTitle>
            <Stack direction="row" alignItems="center" spacing={2}>
              <Avatar src={selectedPatient.avatar} sx={{ width: 60, height: 60 }} />
              <Box>
                <Typography variant="h5">{selectedPatient.name}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {t.abhaId}: {selectedPatient.abhaId}
                </Typography>
              </Box>
            </Stack>
          </DialogTitle>
          <DialogContent>
            <Grid container spacing={3}>
              {/* Personal Information */}
              <Grid item xs={12} md={6}>
                <Accordion defaultExpanded>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <PersonIcon color="primary" /> {t.personalInfo}
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Stack spacing={2}>
                      <Box>
                        <Typography variant="caption" color="text.secondary">{t.name}</Typography>
                        <Typography variant="body1" fontWeight={600}>{selectedPatient.name}</Typography>
                      </Box>
                      <Stack direction="row" spacing={2}>
                        <Box flex={1}>
                          <Typography variant="caption" color="text.secondary">{t.age}</Typography>
                          <Typography variant="body1" fontWeight={600}>{selectedPatient.age}</Typography>
                        </Box>
                        <Box flex={1}>
                          <Typography variant="caption" color="text.secondary">{t.gender}</Typography>
                          <Typography variant="body1" fontWeight={600}>{selectedPatient.gender === 'Male' ? t.male : t.female}</Typography>
                        </Box>
                      </Stack>
                      <Box>
                        <Typography variant="caption" color="text.secondary">{t.phone}</Typography>
                        <Typography variant="body1" fontWeight={600}>{selectedPatient.phone}</Typography>
                      </Box>
                      <Box>
                        <Typography variant="caption" color="text.secondary">{t.address}</Typography>
                        <Typography variant="body1" fontWeight={600}>{selectedPatient.address}</Typography>
                      </Box>
                      <Stack direction="row" spacing={2}>
                        <Box flex={1}>
                          <Typography variant="caption" color="text.secondary">{t.bloodGroup}</Typography>
                          <Typography variant="body1" fontWeight={600} color="error.main">{selectedPatient.bloodGroup}</Typography>
                        </Box>
                        <Box flex={1}>
                          <Typography variant="caption" color="text.secondary">{t.emergencyContact}</Typography>
                          <Typography variant="body1" fontWeight={600}>{selectedPatient.emergencyContact}</Typography>
                        </Box>
                      </Stack>
                    </Stack>
                  </AccordionDetails>
                </Accordion>
              </Grid>

              {/* Vital Signs */}
              <Grid item xs={12} md={6}>
                <Accordion defaultExpanded>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <MonitorIcon color="primary" /> {t.vitals}
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Grid container spacing={2}>
                      <Grid item xs={6}>
                        <Typography variant="caption" color="text.secondary">{t.height}</Typography>
                        <Typography variant="body1" fontWeight={600}>{selectedPatient.vitals.height}</Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="caption" color="text.secondary">{t.weight}</Typography>
                        <Typography variant="body1" fontWeight={600}>{selectedPatient.vitals.weight}</Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="caption" color="text.secondary">{t.bmi}</Typography>
                        <Typography variant="body1" fontWeight={600}>{selectedPatient.vitals.bmi}</Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="caption" color="text.secondary">{t.temperature}</Typography>
                        <Typography variant="body1" fontWeight={600}>{selectedPatient.vitals.temperature}</Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="caption" color="text.secondary">{t.heartRate}</Typography>
                        <Typography variant="body1" fontWeight={600}>{selectedPatient.vitals.heartRate}</Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="caption" color="text.secondary">{t.bloodPressure}</Typography>
                        <Typography variant="body1" fontWeight={600}>{selectedPatient.vitals.bloodPressure}</Typography>
                      </Grid>
                    </Grid>
                  </AccordionDetails>
                </Accordion>
              </Grid>

              {/* Medical History */}
              <Grid item xs={12}>
                <Accordion>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <HistoryIcon color="primary" /> {t.medicalHistory}
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <List>
                      {selectedPatient.medicalHistory.map((item, index) => (
                        <ListItem key={index}>
                          <ListItemIcon>
                            <MedicationIcon color="action" />
                          </ListItemIcon>
                          <ListItemText primary={item} />
                        </ListItem>
                      ))}
                    </List>
                  </AccordionDetails>
                </Accordion>
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions sx={{ p: 3 }}>
            <Button onClick={() => setProfileDialog(false)} variant="outlined">
              {t.close}
            </Button>
          </DialogActions>
        </>
      )}
    </Dialog>
  );

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#f8f9fa', p: 3 }}>
      {/* Header */}
      <Paper elevation={2} sx={{ p: 3, mb: 3, borderRadius: 3 }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={3}>
          <Stack direction="row" alignItems="center" spacing={2}>
            <LocalHospitalIcon sx={{ fontSize: 40, color: '#1976d2' }} />
            <Typography variant="h4" fontWeight="bold" color="primary">
              {t.patients}
            </Typography>
          </Stack>
          
          <Stack direction="row" spacing={2}>
            {/* ABHA Access Button */}
            <Button
              variant="contained"
              color="secondary"
              startIcon={<ContactCardIcon />}
              onClick={() => setAbhaDialog(true)}
            >
              {t.accessData}
            </Button>
            
            {/* Language Selector */}
            <FormControl size="small" sx={{ minWidth: 120 }}>
              <Select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
              >
                <MenuItem value="en">English</MenuItem>
                <MenuItem value="hi">हिन्दी</MenuItem>
                <MenuItem value="kn">ಕನ್ನಡ</MenuItem>
              </Select>
            </FormControl>
          </Stack>
        </Stack>

        {/* Search ABHA IDs */}
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              placeholder={t.searchAbhaId}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon color="action" />
                  </InputAdornment>
                ),
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 3
                }
              }}
            />
          </Grid>
        </Grid>
      </Paper>

      {/* ABHA ID Instructions */}
      <Paper elevation={1} sx={{ p: 3, mb: 3, borderRadius: 2, backgroundColor: '#f8f9fa' }}>
        <Stack direction="row" spacing={2} alignItems="center" mb={2}>
          <ContactCardIcon sx={{ fontSize: 24, color: 'primary.main' }} />
          <Typography variant="h6" fontWeight="bold" color="primary">
            {t.privacySystem}
          </Typography>
        </Stack>
        <Typography variant="body2" color="text.secondary" mb={1}>
          {t.privacyNote1}
        </Typography>
        <Typography variant="body2" color="text.secondary" mb={1}>
          {t.privacyNote2}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          • Showing {filteredAbhaIds.length} {t.availableIds} {searchTerm && `matching "${searchTerm}"`}
        </Typography>
      </Paper>

      {/* ABHA IDs Grid */}
      <Grid container spacing={2}>
        {filteredAbhaIds.map((item) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={item.id}>
            <AbhaIdCard item={item} />
          </Grid>
        ))}
      </Grid>

      {filteredAbhaIds.length === 0 && (
        <Paper elevation={1} sx={{ p: 4, textAlign: 'center', mt: 3, borderRadius: 3 }}>
          <ContactCardIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h6" color="text.secondary" mb={1}>
            {t.noAbhaFound}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {t.adjustSearch}
          </Typography>
        </Paper>
      )}

      {/* ABHA ID Access Dialog */}
      <Dialog
        open={abhaDialog}
        onClose={() => {
          setAbhaDialog(false);
          setAbhaId('');
          setAbhaMessage('');
          setAbhaError(false);
        }}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <Stack direction="row" alignItems="center" spacing={2}>
            <ContactCardIcon color="primary" sx={{ fontSize: 32 }} />
            <Typography variant="h6">{t.accessData}</Typography>
          </Stack>
        </DialogTitle>
        <DialogContent>
          <Stack spacing={3} sx={{ mt: 2 }}>
            <Typography variant="body2" color="text.secondary">
              {t.enterAbhaId}
            </Typography>
            
            <TextField
              fullWidth
              label={t.abhaId}
              value={abhaId}
              onChange={(e) => setAbhaId(e.target.value)}
              placeholder="XX-XXXX-XXXX-XXXX"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <ContactCardIcon color="action" />
                  </InputAdornment>
                ),
              }}
              error={abhaError}
            />
            
            {abhaMessage && (
              <Typography 
                variant="body2" 
                color={abhaError ? 'error.main' : 'success.main'}
                sx={{ textAlign: 'center', fontWeight: 600 }}
              >
                {abhaMessage}
              </Typography>
            )}
          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: 3, gap: 2 }}>
          <Button 
            onClick={() => {
              setAbhaDialog(false);
              setAbhaId('');
              setAbhaMessage('');
              setAbhaError(false);
            }}
          >
            {t.close}
          </Button>
          <Button 
            variant="contained" 
            onClick={handleAbhaAccess}
            disabled={!abhaId.trim()}
          >
            {t.accessData}
          </Button>
        </DialogActions>
      </Dialog>

      {/* ABHA ID Reference List */}
      <Paper elevation={2} sx={{ p: 3, mt: 4, borderRadius: 3, backgroundColor: '#fff3e0' }}>
        <Typography variant="h6" fontWeight="bold" color="primary" mb={2} textAlign="center">
          📄 Complete ABHA ID Reference List - All 30 Patient IDs
        </Typography>
        <Typography variant="body2" color="text.secondary" mb={3} textAlign="center">
          Use any of these ABHA IDs to access patient records. Click on individual cards above or manually enter any ID below:
        </Typography>
        
        <Grid container spacing={1}>
          {patientsData.map((patient, index) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={patient.id}>
              <Paper 
                elevation={1} 
                sx={{ 
                  p: 1.5, 
                  backgroundColor: '#f8f9fa',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    backgroundColor: '#e9ecef',
                    transform: 'scale(1.02)'
                  }
                }}
                onClick={() => {
                  setAbhaId(patient.abhaId);
                  setAbhaDialog(true);
                }}
              >
                <Stack spacing={0.5} alignItems="center">
                  <Typography variant="body2" fontWeight="bold" color="primary">
                    {patient.abhaId}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {patient.address.split(',')[0]}
                  </Typography>
                </Stack>
              </Paper>
            </Grid>
          ))}
        </Grid>
        
        <Typography variant="caption" color="text.secondary" textAlign="center" mt={2} display="block">
          🔒 Privacy Note: Only enter ABHA ID if you are the patient or authorized healthcare provider
        </Typography>
      </Paper>

      {/* Patient Profile Dialog */}
      <PatientProfileDialog />
    </Box>
  );
}
