import React, { useEffect, useState } from 'react';
import { Alert, Paper, Typography, Box, List, ListItem, ListItemText, Card, CardMedia, CardContent, Divider, Select, MenuItem } from '@mui/material';
import axios from 'axios';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend, Label
} from 'recharts';

const API_URL = 'http://127.0.0.1:5000';

// Add translations for headings and labels
const translations = {
  en: {
    pageTitle: "Epidemic Awareness & Previous Alerts",
    info: "This page lists all previous epidemic alerts in your area. Please read about past epidemics and follow the precautionary tips to keep yourself and your family safe.",
    generalTips: "General Precautionary Tips:",
    previousAlerts: "Previous Epidemic Alerts",
    searchPlaceholder: "Search epidemics...",
    loading: "Loading...",
    noAlerts: "No previous epidemic alerts found.",
    alertsByDisease: "Alerts by Disease",
    riskLevelDist: "Risk Level Distribution",
    majorEpidemics: "Major Epidemics in World History (with WHO Resources)",
    safetyMeasures: "Safety Measures:",
    vaccine: "Vaccine:",
    learnMore: "Learn more on WHO site",
    dataRef: "Data Reference: WHO Disease Outbreak News",
    hygiene: "Maintain personal hygiene and wash hands regularly.",
    advisories: "Follow government advisories and health department instructions.",
    masks: "Use masks and sanitizers during outbreaks.",
    avoidCrowds: "Avoid crowded places if an epidemic is ongoing.",
    safeWater: "Ensure safe drinking water and food.",
    emergencyContacts: "Keep emergency contact numbers handy.",
    diseaseName: "Disease Name",
    numberOfAlerts: "Number of Alerts",
    barChartLegend: "Alerts by Disease",
    pieChartLegend: "Risk Level Distribution",
    date: "Date",
    precaution: "Precaution",
    followGeneralTips: "Follow general tips above.",
    epidemics: {
      covid: {
        name: "COVID-19",
        years: "2019–present",
        description: "A global pandemic caused by the novel coronavirus SARS-CoV-2.",
        safety: [
          "Wear masks in crowded places.",
          "Wash hands frequently.",
          "Maintain social distancing.",
          "Get vaccinated and take booster doses."
        ],
        vaccine: "Multiple vaccines available (Covishield, Covaxin, Pfizer, Moderna, etc.)"
      },
      ebola: {
        name: "Ebola",
        years: "2014–2016 (West Africa), 2018–2020 (DRC)",
        description: "A severe, often fatal illness in humans caused by the Ebola virus.",
        safety: [
          "Avoid contact with blood and body fluids.",
          "Practice safe burial of the dead.",
          "Use protective equipment if caring for patients."
        ],
        vaccine: "Ervebo (rVSV-ZEBOV) vaccine approved."
      },
      cholera: {
        name: "Cholera",
        years: "1817–present (multiple pandemics)",
        description: "An acute diarrhoeal infection caused by ingestion of contaminated water or food.",
        safety: [
          "Drink safe, clean water.",
          "Wash hands with soap.",
          "Eat well-cooked food."
        ],
        vaccine: "Oral cholera vaccines (Dukoral, Shanchol, Euvichol)."
      },
      smallpox: {
        name: "Smallpox",
        years: "Historic, eradicated in 1980",
        description: "A contagious and deadly disease, eradicated by vaccination.",
        safety: [
          "Vaccination was the main preventive measure.",
          "Isolation of patients."
        ],
        vaccine: "Smallpox vaccine (no longer in routine use)."
      },
      spanishflu: {
        name: "Spanish Flu",
        years: "1918–1919",
        description: "An unusually deadly influenza pandemic, infecting about one-third of the world’s population.",
        safety: [
          "Wear masks.",
          "Avoid crowds.",
          "Practice good hygiene."
        ],
        vaccine: "No vaccine was available at the time."
      },
      plague: {
        name: "Plague (Black Death)",
        years: "1347–1351 (historic), still occurs in some regions",
        description: "A devastating global epidemic of bubonic plague.",
        safety: [
          "Control of rodents and fleas.",
          "Prompt treatment with antibiotics.",
          "Avoid contact with infected animals."
        ],
        vaccine: "No widely used vaccine; antibiotics are effective."
      }
    }
  },
  hi: {
    pageTitle: "महामारी जागरूकता और पिछले अलर्ट",
    info: "यह पृष्ठ आपके क्षेत्र में सभी पिछले महामारी अलर्ट सूचीबद्ध करता है। कृपया पिछले महामारियों के बारे में पढ़ें और सुरक्षा टिप्स का पालन करें।",
    generalTips: "सामान्य सुरक्षा टिप्स:",
    previousAlerts: "पिछले महामारी अलर्ट",
    searchPlaceholder: "महामारी खोजें...",
    loading: "लोड हो रहा है...",
    noAlerts: "कोई पिछले महामारी अलर्ट नहीं मिला।",
    alertsByDisease: "रोग के अनुसार अलर्ट",
    riskLevelDist: "जोखिम स्तर वितरण",
    majorEpidemics: "विश्व इतिहास में प्रमुख महामारियाँ (WHO संसाधनों के साथ)",
    safetyMeasures: "सुरक्षा उपाय:",
    vaccine: "टीका:",
    learnMore: "WHO साइट पर और जानें",
    dataRef: "डेटा संदर्भ: WHO रोग प्रकोप समाचार",
    hygiene: "व्यक्तिगत स्वच्छता बनाए रखें और नियमित रूप से हाथ धोएं।",
    advisories: "सरकारी सलाह और स्वास्थ्य विभाग के निर्देशों का पालन करें।",
    masks: "महामारी के दौरान मास्क और सैनिटाइज़र का उपयोग करें।",
    avoidCrowds: "यदि महामारी चल रही है तो भीड़-भाड़ वाली जगहों से बचें।",
    safeWater: "सुरक्षित पीने का पानी और भोजन सुनिश्चित करें।",
    emergencyContacts: "आपातकालीन संपर्क नंबर रखें।",
    diseaseName: "रोग का नाम",
    numberOfAlerts: "अलर्ट की संख्या",
    barChartLegend: "रोग के अनुसार अलर्ट",
    pieChartLegend: "जोखिम स्तर वितरण",
    date: "तारीख",
    precaution: "सावधानी",
    followGeneralTips: "ऊपर दिए गए सामान्य टिप्स का पालन करें।",
    epidemics: {
      covid: {
        name: "कोविड-19",
        years: "2019–वर्तमान",
        description: "नवीन कोरोनावायरस SARS-CoV-2 के कारण वैश्विक महामारी।",
        safety: [
          "भीड़-भाड़ वाली जगहों पर मास्क पहनें।",
          "बार-बार हाथ धोएं।",
          "सामाजिक दूरी बनाए रखें।",
          "टीका लगवाएं और बूस्टर डोज लें।"
        ],
        vaccine: "कई टीके उपलब्ध (Covishield, Covaxin, Pfizer, Moderna, आदि)"
      },
      ebola: {
        name: "इबोला",
        years: "2014–2016 (पश्चिम अफ्रीका), 2018–2020 (DRC)",
        description: "इबोला वायरस के कारण मनुष्यों में गंभीर, अक्सर घातक बीमारी।",
        safety: [
          "रक्त और शरीर के तरल पदार्थों के संपर्क से बचें।",
          "मृतकों का सुरक्षित दफन करें।",
          "मरीजों की देखभाल करते समय सुरक्षात्मक उपकरण पहनें।"
        ],
        vaccine: "Ervebo (rVSV-ZEBOV) टीका अनुमोदित।"
      },
      cholera: {
        name: "हैजा",
        years: "1817–वर्तमान (कई महामारियाँ)",
        description: "दूषित पानी या भोजन के सेवन से होने वाला तीव्र दस्त रोग।",
        safety: [
          "सुरक्षित, स्वच्छ पानी पिएं।",
          "साबुन से हाथ धोएं।",
          "अच्छी तरह पका हुआ भोजन खाएं।"
        ],
        vaccine: "मौखिक हैजा टीके (Dukoral, Shanchol, Euvichol)।"
      },
      smallpox: {
        name: "चेचक",
        years: "ऐतिहासिक, 1980 में समाप्त",
        description: "एक संक्रामक और घातक बीमारी, टीकाकरण से समाप्त।",
        safety: [
          "टीकाकरण मुख्य रोकथाम उपाय था।",
          "मरीजों को अलग रखें।"
        ],
        vaccine: "चेचक का टीका (अब नियमित उपयोग में नहीं)।"
      },
      spanishflu: {
        name: "स्पैनिश फ्लू",
        years: "1918–1919",
        description: "एक असामान्य रूप से घातक इन्फ्लुएंजा महामारी, जिसने दुनिया की एक तिहाई आबादी को संक्रमित किया।",
        safety: [
          "मास्क पहनें।",
          "भीड़ से बचें।",
          "अच्छी स्वच्छता का पालन करें।"
        ],
        vaccine: "उस समय कोई टीका उपलब्ध नहीं था।"
      },
      plague: {
        name: "प्लेग (ब्लैक डेथ)",
        years: "1347–1351 (ऐतिहासिक), कुछ क्षेत्रों में अभी भी होता है",
        description: "बुबोनिक प्लेग की विनाशकारी वैश्विक महामारी।",
        safety: [
          "चूहों और पिस्सुओं का नियंत्रण करें।",
          "एंटीबायोटिक्स से तुरंत इलाज करें।",
          "संक्रमित जानवरों के संपर्क से बचें।"
        ],
        vaccine: "कोई व्यापक रूप से उपयोग किया जाने वाला टीका नहीं; एंटीबायोटिक्स प्रभावी हैं।"
      }
    }
  },
  kn: {
    pageTitle: "ಸಾಂಕ್ರಾಮಿಕ ಜಾಗೃತಿ ಮತ್ತು ಹಿಂದಿನ ಎಚ್ಚರಿಕೆಗಳು",
    info: "ಈ ಪುಟವು ನಿಮ್ಮ ಪ್ರದೇಶದಲ್ಲಿನ ಎಲ್ಲಾ ಹಿಂದಿನ ಸಾಂಕ್ರಾಮಿಕ ಎಚ್ಚರಿಕೆಗಳನ್ನು ಪಟ್ಟಿ ಮಾಡುತ್ತದೆ. ದಯವಿಟ್ಟು ಹಿಂದಿನ ಸಾಂಕ್ರಾಮಿಕಗಳ ಬಗ್ಗೆ ಓದಿ ಮತ್ತು ಸುರಕ್ಷತಾ ಸಲಹೆಗಳನ್ನು ಅನುಸರಿಸಿ.",
    generalTips: "ಸಾಮಾನ್ಯ ಸುರಕ್ಷತಾ ಸಲಹೆಗಳು:",
    previousAlerts: "ಹಿಂದಿನ ಸಾಂಕ್ರಾಮಿಕ ಎಚ್ಚರಿಕೆಗಳು",
    searchPlaceholder: "ಸಾಂಕ್ರಾಮಿಕಗಳನ್ನು ಹುಡುಕಿ...",
    loading: "ಲೋಡ್ ಆಗುತ್ತಿದೆ...",
    noAlerts: "ಯಾವುದೇ ಹಿಂದಿನ ಸಾಂಕ್ರಾಮಿಕ ಎಚ್ಚರಿಕೆಗಳು ಕಂಡುಬಂದಿಲ್ಲ.",
    alertsByDisease: "ರೋಗದ ಪ್ರಕಾರ ಎಚ್ಚರಿಕೆಗಳು",
    riskLevelDist: "ಜೊತೆಗೆ ಮಟ್ಟ ವಿತರಣಾ",
    majorEpidemics: "ವಿಶ್ವ ಇತಿಹಾಸದಲ್ಲಿನ ಪ್ರಮುಖ ಸಾಂಕ್ರಾಮಿಕಗಳು (WHO ಸಂಪನ್ಮೂಲಗಳೊಂದಿಗೆ)",
    safetyMeasures: "ಸುರಕ್ಷತಾ ಕ್ರಮಗಳು:",
    vaccine: "ವ್ಯಾಕ್ಸಿನ್:",
    learnMore: "WHO ತಾಣದಲ್ಲಿ ಇನ್ನಷ್ಟು ತಿಳಿಯಿರಿ",
    dataRef: "ಡೇಟಾ ಉಲ್ಲೇಖ: WHO ರೋಗ ಪ್ರಬಲ ಸುದ್ದಿ",
    hygiene: "ವೈಯಕ್ತಿಕ ಸ್ವಚ್ಛತೆ ಕಾಯ್ದುಕೊಳ್ಳಿ ಮತ್ತು ನಿಯಮಿತವಾಗಿ ಕೈಗಳನ್ನು ತೊಳೆಯಿರಿ.",
    advisories: "ಸರ್ಕಾರಿ ಸಲಹೆಗಳು ಮತ್ತು ಆರೋಗ್ಯ ಇಲಾಖೆಯ ಸೂಚನೆಗಳನ್ನು ಅನುಸರಿಸಿ.",
    masks: "ಸಾಂಕ್ರಾಮಿಕ ಸಮಯದಲ್ಲಿ ಮಾಸ್ಕ್ ಮತ್ತು ಸ್ಯಾನಿಟೈಜರ್ ಬಳಸಿ.",
    avoidCrowds: "ಸಾಂಕ್ರಾಮಿಕ ನಡೆಯುತ್ತಿರುವಾಗ ಜನಸಮೂಹದಿಂದ ದೂರಿರಿ.",
    safeWater: "ಸುರಕ್ಷಿತ ಕುಡಿಯುವ ನೀರು ಮತ್ತು ಆಹಾರವನ್ನು ಖಚಿತಪಡಿಸಿ.",
    emergencyContacts: "ತುರ್ತು ಸಂಪರ್ಕ ಸಂಖ್ಯೆಗಳು ಹತ್ತಿರದಲ್ಲಿರಲಿ.",
    diseaseName: "ರೋಗದ ಹೆಸರು",
    numberOfAlerts: "ಎಚ್ಚರಿಕೆಗಳ ಸಂಖ್ಯೆ",
    barChartLegend: "ರೋಗದ ಪ್ರಕಾರ ಎಚ್ಚರಿಕೆಗಳು",
    pieChartLegend: "ಜೊತೆಗೆ ಮಟ್ಟ ವಿತರಣಾ",
    date: "ದಿನಾಂಕ",
    precaution: "ಎಚ್ಚರಿಕೆ",
    followGeneralTips: "ಮೇಲಿನ ಸಾಮಾನ್ಯ ಸಲಹೆಗಳನ್ನು ಅನುಸರಿಸಿ.",
    epidemics: {
      covid: {
        name: "ಕೋವಿಡ್-19",
        years: "2019–ಪ್ರಸ್ತುತ",
        description: "ನವ ಕೊರೊನಾವೈರಸ್ SARS-CoV-2 ಕಾರಣವಾದ ಜಾಗತಿಕ ಸಾಂಕ್ರಾಮಿಕ.",
        safety: [
          "ಜನಸಮೂಹದಲ್ಲಿ ಮಾಸ್ಕ್ ಧರಿಸಿ.",
          "ಹೆಚ್ಚು ಬಾರಿ ಕೈ ತೊಳೆಯಿರಿ.",
          "ಸಾಮಾಜಿಕ ಅಂತರ ಕಾಯ್ದುಕೊಳ್ಳಿ.",
          "ವ್ಯಾಕ್ಸಿನ್ ಹಾಕಿಸಿ ಮತ್ತು ಬೂಸ್ಟರ್ ಡೋಸ್ ತೆಗೆದುಕೊಳ್ಳಿ."
        ],
        vaccine: "ಬಹು ವ್ಯಾಕ್ಸಿನ್‌ಗಳು ಲಭ್ಯವಿವೆ (Covishield, Covaxin, Pfizer, Moderna, ಇತ್ಯಾದಿ)"
      },
      ebola: {
        name: "ಇಬೋಲಾ",
        years: "2014–2016 (ಪಶ್ಚಿಮ ಆಫ್ರಿಕಾ), 2018–2020 (DRC)",
        description: "ಇಬೋಲಾ ವೈರಸ್ ಕಾರಣವಾದ ಮಾನವರಲ್ಲಿ ತೀವ್ರ, ಬಹುಪಾಲು ಮಾರಕ ರೋಗ.",
        safety: [
          "ರಕ್ತ ಮತ್ತು ದೇಹದ ದ್ರವಗಳ ಸಂಪರ್ಕದಿಂದ ದೂರಿರಿ.",
          "ಮೃತರನ್ನು ಸುರಕ್ಷಿತವಾಗಿ ಹೂಳಿರಿ.",
          "ರೋಗಿಗಳ ಆರೈಕೆ ಮಾಡುವಾಗ ರಕ್ಷಕ ಉಪಕರಣಗಳನ್ನು ಬಳಸಿ."
        ],
        vaccine: "Ervebo (rVSV-ZEBOV) ವ್ಯಾಕ್ಸಿನ್ ಅನುಮೋದಿಸಲಾಗಿದೆ."
      },
      cholera: {
        name: "ಕಾಲೆರಾ",
        years: "1817–ಪ್ರಸ್ತುತ (ಬಹು ಸಾಂಕ್ರಾಮಿಕಗಳು)",
        description: "ದುಷಿತ ನೀರು ಅಥವಾ ಆಹಾರ ಸೇವನೆಯಿಂದ ಉಂಟಾಗುವ ತೀವ್ರ ಅತಿಸಾರ ರೋಗ.",
        safety: [
          "ಸುರಕ್ಷಿತ, ಸ್ವಚ್ಛ ನೀರು ಕುಡಿಯಿರಿ.",
          "ಸಾಬೂನು ಬಳಸಿ ಕೈ ತೊಳೆಯಿರಿ.",
          "ಚೆನ್ನಾಗಿ ಬೇಯಿಸಿದ ಆಹಾರ ಸೇವಿಸಿ."
        ],
        vaccine: "ಮೌಖಿಕ ಕಾಲೆರಾ ವ್ಯಾಕ್ಸಿನ್‌ಗಳು (Dukoral, Shanchol, Euvichol)."
      },
      smallpox: {
        name: "ಸ್ಮಾಲ್‌ಪಾಕ್ಸ್",
        years: "ಐತಿಹಾಸಿಕ, 1980ರಲ್ಲಿ ನಿರ್ಮೂಲನೆ",
        description: "ಸಂಕ್ರಾಮಕ ಮತ್ತು ಮಾರಕ ರೋಗ, ಲಸಿಕೆಯಿಂದ ನಿರ್ಮೂಲನೆ.",
        safety: [
          "ಲಸಿಕೆ ಮುಖ್ಯ ತಡೆಯುವ ಕ್ರಮವಾಗಿತ್ತು.",
          "ರೋಗಿಗಳನ್ನು ಪ್ರತ್ಯೇಕಿಸಿ."
        ],
        vaccine: "ಸ್ಮಾಲ್‌ಪಾಕ್ಸ್ ಲಸಿಕೆ (ಈಗ ನಿಯಮಿತ ಬಳಕೆಯಲ್ಲಿ ಇಲ್ಲ)."
      },
      spanishflu: {
        name: "ಸ್ಪ್ಯಾನಿಷ್ ಫ್ಲೂ",
        years: "1918–1919",
        description: "ಅಸಾಮಾನ್ಯವಾಗಿ ಮಾರಕವಾದ ಇನ್‌ಫ್ಲೂಯೆಂಜಾ ಸಾಂಕ್ರಾಮಿಕ, ವಿಶ್ವದ ಒಂದು-ಮೂರು ಭಾಗ ಜನರನ್ನು ಸೋಂಕು ಮಾಡಿದವು.",
        safety: [
          "ಮಾಸ್ಕ್ ಧರಿಸಿ.",
          "ಜನಸಮೂಹದಿಂದ ದೂರಿರಿ.",
          "ಚೆನ್ನಾಗಿ ಸ್ವಚ್ಛತೆ ಕಾಯ್ದುಕೊಳ್ಳಿ."
        ],
        vaccine: "ಆ ಸಮಯದಲ್ಲಿ ಯಾವುದೇ ಲಸಿಕೆ ಲಭ್ಯವಿರಲಿಲ್ಲ."
      },
      plague: {
        name: "ಪ್ಲೇಗ್ (ಬ್ಲಾಕ್ ಡೆತ್)",
        years: "1347–1351 (ಐತಿಹಾಸಿಕ), ಕೆಲವು ಪ್ರದೇಶಗಳಲ್ಲಿ ಇನ್ನೂ ಉಂಟಾಗುತ್ತದೆ",
        description: "ಬ್ಯೂಬೋನಿಕ್ ಪ್ಲೇಗ್‌ನ ಭಯಾನಕ ಜಾಗತಿಕ ಸಾಂಕ್ರಾಮಿಕ.",
        safety: [
          "ಇಲಿ ಮತ್ತು ಹಲ್ಲುಗಳ ನಿಯಂತ್ರಣ.",
          "ಆಂಟಿಬಯೋಟಿಕ್‌ಗಳಿಂದ ತಕ್ಷಣ ಚಿಕಿತ್ಸೆ.",
          "ಸಂಕ್ರಾಮಿತ ಪ್ರಾಣಿಗಳ ಸಂಪರ್ಕದಿಂದ ದೂರಿರಿ."
        ],
        vaccine: "ವ್ಯಾಪಕವಾಗಿ ಬಳಸಲಾಗುವ ಲಸಿಕೆ ಇಲ್ಲ; ಆಂಟಿಬಯೋಟಿಕ್‌ಗಳು ಪರಿಣಾಮಕಾರಿ."
      }
    }
  }
};

function EpidemicAlertsPage() {
  const [epidemics, setEpidemics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [language, setLanguage] = useState('en');
  const t = translations[language];

  useEffect(() => {
    // Fetch all previous epidemic alerts
    axios.get(`${API_URL}/epidemic-alerts`)
      .then(res => {
        setEpidemics(res.data.epidemic_alerts || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  // Static list of major world epidemics with WHO links
  const worldEpidemics = [
    {
      name: "COVID-19",
      years: "2019–present",
      description: "A global pandemic caused by the novel coronavirus SARS-CoV-2.",
      img: "https://www.upb.pitt.edu/sites/default/files/images-inline/2020-02/coronavirus.jpg", // Example image
      safety: [
        "Wear masks in crowded places.",
        "Wash hands frequently.",
        "Maintain social distancing.",
        "Get vaccinated and take booster doses."
      ],
      vaccine: "Multiple vaccines available (Covishield, Covaxin, Pfizer, Moderna, etc.)",
      who: "https://www.who.int/emergencies/diseases/novel-coronavirus-2019"
    },
    {
      name: "Ebola",
      years: "2014–2016 (West Africa), 2018–2020 (DRC)",
      description: "A severe, often fatal illness in humans caused by the Ebola virus.",
      img: "https://media.sketchfab.com/models/548891b3a8a844e1b800d41cff5efc0b/thumbnails/a66dd893f0e94e5ba78c949d7026edd6/5a01b34325a14df59d9e59a55a1bfac8.jpeg",
      safety: [
        "Avoid contact with blood and body fluids.",
        "Practice safe burial of the dead.",
        "Use protective equipment if caring for patients."
      ],
      vaccine: "Ervebo (rVSV-ZEBOV) vaccine approved.",
      who: "https://www.who.int/health-topics/ebola"
    },
    {
      name: "Cholera",
      years: "1817–present (multiple pandemics)",
      description: "An acute diarrhoeal infection caused by ingestion of contaminated water or food.",
      img: "https://www.gideononline.com/wp-content/uploads/vibrio-cholerae-1536x1024.jpg",
      safety: [
        "Drink safe, clean water.",
        "Wash hands with soap.",
        "Eat well-cooked food."
      ],
      vaccine: "Oral cholera vaccines (Dukoral, Shanchol, Euvichol).",
      who: "https://www.who.int/health-topics/cholera"
    },
    {
      name: "Smallpox",
      years: "Historic, eradicated in 1980",
      description: "A contagious and deadly disease, eradicated by vaccination.",
      img: "https://static01.nyt.com/images/2018/07/14/science/14POX/merlin_141230838_9bfb2792-6e57-485f-bd46-58b63feba743-superJumbo.jpg?quality=90&auto=webp",
      safety: [
        "Vaccination was the main preventive measure.",
        "Isolation of patients."
      ],
      vaccine: "Smallpox vaccine (no longer in routine use).",
      who: "https://www.who.int/health-topics/smallpox"
    },
    {
      name: "Spanish Flu",
      years: "1918–1919",
      description: "An unusually deadly influenza pandemic, infecting about one-third of the world’s population.",
      img: "https://images.fineartamerica.com/images-medium-large/h1n1-1918-influenza-virus-tem-cdc.jpg",
      safety: [
        "Wear masks.",
        "Avoid crowds.",
        "Practice good hygiene."
      ],
      vaccine: "No vaccine was available at the time.",
      who: "https://www.who.int/news-room/spotlight/influenza-a-global-threat"
    },
    {
      name: "Plague (Black Death)",
      years: "1347–1351 (historic), still occurs in some regions",
      description: "A devastating global epidemic of bubonic plague.",
      img: "https://tse1.mm.bing.net/th/id/OIP.R2GIql7a2g5VpgZqtVWxUgHaHa?rs=1&pid=ImgDetMain&o=7&rm=3",
      safety: [
        "Control of rodents and fleas.",
        "Prompt treatment with antibiotics.",
        "Avoid contact with infected animals."
      ],
      vaccine: "No widely used vaccine; antibiotics are effective.",
      who: "https://www.who.int/health-topics/plague"
    },
  ];

  const filteredEpidemics = worldEpidemics.filter(epi =>
    epi.name.toLowerCase().includes(search.toLowerCase())
  );

  // Filter out unwanted alerts (e.g., 0 risk or specific diseases/locations)
  const filteredAlerts = epidemics.filter(
    epi =>
      !(
        (epi.disease.toLowerCase() === 'plaque' && epi.location.toLowerCase() === 'goa') ||
        (epi.disease.toLowerCase() === 'hackathon' && epi.location.toLowerCase() === 'bangalore')
      ) &&
      epi.risk_level !== '0' && epi.risk_level !== 0
  );

  // Example: Replace epidemics with real data for the graphs
  const realEpidemics = [
    { disease: "COVID-19", count: 120, risk_level: "High" },
    { disease: "Ebola", count: 15, risk_level: "High" },
    { disease: "Cholera", count: 40, risk_level: "Moderate" },
    { disease: "Smallpox", count: 10, risk_level: "Eradicated" },
    { disease: "Spanish Flu", count: 25, risk_level: "Historic" },
    // Add more as needed
  ];

  // For bar chart
  const barData = realEpidemics.map(epi => ({
    name: epi.disease,
    count: epi.count
  }));

  // For pie chart
  const pieData = [
    { name: "High", value: 135 },
    { name: "Moderate", value: 40 },
    { name: "Eradicated", value: 10 },
    { name: "Historic", value: 25 }
  ];

  const COLORS = [ '#00C49F', '#FFBB28', '#FF8042', '#b71c1c',];

  return (
    <Box
      sx={{
        minHeight: '100vh',
        width: '100vw',
        position: 'relative',
        backgroundImage: 'url("https://www.liblogo.com/img-logo/wh34ld5c-who-logo-logo.png")',
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
        backgroundColor: '#f5f7fa',
      }}
    >
      {/* Language Selector */}
      <Box sx={{ position: 'absolute', top: 20, right: 40, zIndex: 2 }}>
        <Select
          value={language}
          onChange={e => setLanguage(e.target.value)}
          size="small"
          sx={{ minWidth: 120, bgcolor: '#fff' }}
        >
          <MenuItem value="en">English</MenuItem>
          <MenuItem value="hi">हिन्दी</MenuItem>
          <MenuItem value="kn">ಕನ್ನಡ</MenuItem>
        </Select>
      </Box>
      {/* Optional: overlay for readability */}
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          bgcolor: 'rgba(255,255,255,0.4)', // 40% opacity white
          zIndex: 0,
        }}
      />
      <Box
        sx={{
          maxWidth: 900,
          margin: '32px auto',
          p: 3,
          position: 'relative',
          zIndex: 1,
        }}
      >
        <Typography variant="h4" sx={{ mb: 2, color: '#b71c1c', fontWeight: 700 }}>
          {t.pageTitle}
        </Typography>
        <Alert severity="info" sx={{ mb: 3, fontSize: 18 }}>
          {t.info}
        </Alert>
        <Paper sx={{ p: 2, mb: 3, background: '#fffde7' }}>
          <Typography variant="h6" sx={{ color: '#e65100', mb: 1 }}>
            {t.generalTips}
          </Typography>
          <ul style={{ fontSize: 16, marginLeft: 20 }}>
            <li>{t.hygiene}</li>
            <li>{t.advisories}</li>
            <li>{t.masks}</li>
            <li>{t.avoidCrowds}</li>
            <li>{t.safeWater}</li>
            <li>{t.emergencyContacts}</li>
          </ul>
        </Paper>
        <Typography variant="h5" sx={{ mb: 2, color: '#1976d2', fontWeight: 600 }}>
          {t.previousAlerts}
        </Typography>
        <input
          type="text"
          placeholder={t.searchPlaceholder}
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ marginBottom: 16, padding: 8, width: '100%', fontSize: 16, borderRadius: 8, border: '1px solid #bdbdbd' }}
        />
        {loading ? (
          <Typography>{t.loading}</Typography>
        ) : epidemics.length === 0 ? (
          <Typography>{t.noAlerts}</Typography>
        ) : (
          <List>
            {filteredAlerts.map((epi, idx) => (
              <ListItem key={idx} sx={{ mb: 2, background: '#e3f2fd', borderRadius: 2 }}>
                <ListItemText
                  primary={
                    <span>
                      <b>{epi.disease}</b> in <b>{epi.location}</b> ({epi.risk_level} risk)
                    </span>
                  }
                  secondary={
                    <span>
                      <b>{t.date}:</b> {epi.alert_time}<br />
                      <b>{t.precaution}:</b> {epi.precaution || t.followGeneralTips}
                    </span>
                  }
                />
              </ListItem>
            ))}
          </List>
        )}
        <Paper sx={{ p: 2, mb: 3, background: '#f3e5f5' }}>
          <Typography variant="h6" sx={{ color: '#6a1b9a', mb: 2 }}>
            {t.alertsByDisease}
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 4, justifyContent: 'center' }}>
            <Box sx={{ width: 350, height: 270 }}>
              <Typography variant="subtitle1" align="center">{t.alertsByDisease}</Typography>
              <ResponsiveContainer width="100%" height="80%">
                <BarChart
                  data={barData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 40 }}
                  onClick={data => {
                    if (data && data.activeLabel) {
                      alert(`You clicked on ${data.activeLabel}. For more info, visit the WHO website.`);
                    }
                  }}
                >
                  <XAxis dataKey="name">
                    <Label value={t.diseaseName} offset={-10} position="insideBottom" />
                  </XAxis>
                  <YAxis allowDecimals={false}>
                    <Label value={t.numberOfAlerts} angle={-90} position="insideLeft" style={{ textAnchor: 'middle' }} />
                  </YAxis>
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="count" fill="#1976d2" />
                </BarChart>
              </ResponsiveContainer>
              <Typography variant="caption" display="block" align="center" sx={{ mt: 1 }}>
                <a href="https://www.who.int/emergencies/disease-outbreak-news" target="_blank" rel="noopener noreferrer">
                  {t.dataRef}
                </a>
              </Typography>
            </Box>
            <Box sx={{ width: 350, height: 270 }}>
              <Typography variant="subtitle1" align="center">{t.riskLevelDist}</Typography>
              <ResponsiveContainer width="100%" height="80%">
                <PieChart>
                  <Pie
                    data={pieData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={70}
                    fill="#8884d8"
                    label
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Legend />
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <Typography variant="caption" display="block" align="center" sx={{ mt: 1 }}>
                <a href="https://www.who.int/emergencies/disease-outbreak-news" target="_blank" rel="noopener noreferrer">
                  {t.dataRef}
                </a>
              </Typography>
            </Box>
          </Box>
        </Paper>
        <Paper sx={{ p: 2, mb: 3, background: '#e3f2fd' }}>
          <Typography variant="h6" sx={{ color: '#1976d2', mb: 2 }}>
            {t.majorEpidemics}
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
            {filteredEpidemics.map((epi, idx) => (
              <Card key={idx} sx={{ width: 270, mb: 2, background: '#fff' }}>
                <CardMedia
                  component="img"
                  height="140"
                  image={epi.img}
                  alt={epi.name}
                />
                <CardContent>
                  <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                    {epi.name} <span style={{ color: '#616161', fontWeight: 400 }}>({epi.years})</span>
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 1 }}>{epi.description}</Typography>
                  <Divider sx={{ my: 1 }} />
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>{t.safetyMeasures}</Typography>
                  <ul style={{ margin: 0, paddingLeft: 18 }}>
                    {epi.safety.map((tip, i) => (
                      <li key={i} style={{ fontSize: 13 }}>{tip}</li>
                    ))}
                  </ul>
                  <Typography variant="body2" sx={{ fontWeight: 600, mt: 1 }}>{t.vaccine}</Typography>
                  <Typography variant="body2" sx={{ mb: 1 }}>{epi.vaccine}</Typography>
                  <a href={epi.who} target="_blank" rel="noopener noreferrer" style={{ fontSize: 13, color: '#1976d2' }}>
                    {t.learnMore}
                  </a>
                </CardContent>
              </Card>
            ))}
          </Box>
        </Paper>
      </Box>
    </Box>
  );
}

export default EpidemicAlertsPage;