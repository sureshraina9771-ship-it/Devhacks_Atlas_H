import React, { useState, useRef } from 'react';
import { Box, Button, Card, CardContent, Typography, CircularProgress, Grid, Divider, Alert, LinearProgress, Paper, Tooltip, IconButton, Accordion, AccordionSummary, AccordionDetails, Select, MenuItem, Stack, Avatar, Chip, Badge, Zoom, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import WarningIcon from '@mui/icons-material/Warning';
import TimelineIcon from '@mui/icons-material/Timeline';
import AssessmentIcon from '@mui/icons-material/Assessment';
import MonitorHeartIcon from '@mui/icons-material/MonitorHeart';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import ImageIcon from '@mui/icons-material/Image';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import DeleteIcon from '@mui/icons-material/Delete';
import AnalyticsIcon from '@mui/icons-material/Analytics';
import MedicalServicesIcon from '@mui/icons-material/MedicalServices';
import CloseIcon from '@mui/icons-material/Close';
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import { styled, keyframes } from '@mui/material/styles';

// Simple translations for demonstration
const translations = {
  en: {
    pageTitle: "Brain Tumor MRI Scan Prediction",
    upload: "Upload MRI Scan",
    uploadDescription: "Drag and drop your MRI scan image here, or click to browse",
    supportedFormats: "Supported: JPG, PNG, DICOM",
    fileSelected: "File Selected",
    removeFile: "Remove File",
    analyze: "Analyze Scan",
    analyzing: "Analyzing...",
    clickToEnlarge: "Click to enlarge image",
    closeImage: "Close",
    selectedImage: "Selected Image",
    analysisCompleted: "Analysis completed. Please review the comprehensive results below.",
    primaryResults: "Primary Analysis Results",
    primaryPrediction: "Primary Prediction",
    secondaryConsideration: "Secondary Consideration",
    riskAssessment: "Risk Assessment",
    stage: "Stage",
    riskLevel: "Risk Level",
    interventionUrgency: "Intervention Urgency",
    probabilityDistribution: "Probability Distribution",
    descriptionOverview: "Description & Overview",
    commonSymptoms: "Common Symptoms",
    treatmentApproach: "Treatment Approach",
    clinicalInfo: "Clinical Information",
    monitoringRecommendations: "Monitoring Recommendations",
    timelineExpectations: "Timeline Expectations:",
    recommendedMonitoring: "Recommended Monitoring:",
    highConfidence: "High Confidence",
    moderateConfidence: "Moderate Confidence",
    lowConfidence: "Low Confidence",
    pleaseSelect: "Please select an MRI scan image",
    error: "Failed to get prediction",
    noTumor: "No evidence of tumor presence in the brain scan.",
    // Tumor types
    tumorTypes: {
      Glioma: {
        description: "A type of tumor that occurs in the brain and spinal cord, originating from glial cells.",
        symptoms: ['Headaches, particularly in the morning', 'Seizures', 'Progressive neurological deficits', 'Changes in mental status'],
        treatment: 'Treatment options include surgery, radiation therapy, and chemotherapy.'
      },
      Meningioma: {
        description: 'Tumors that develop in the meninges, the protective layers covering the brain and spinal cord. Usually benign.',
        symptoms: ['Headaches', 'Vision problems', 'Hearing loss', 'Memory issues'],
        treatment: 'Treatment often involves surgery, and in some cases, radiation therapy.'
      },
      Pituitary: {
        description: 'Tumors that form in the pituitary gland at the base of the brain. Can affect hormone production.',
        symptoms: ['Hormonal imbalances', 'Vision problems', 'Fatigue', 'Unexplained weight changes'],
        treatment: 'Treatment includes medication to manage hormone levels, surgery, or radiation therapy.'
      },
      'No Tumour': {
        description: 'No evidence of tumor presence in the brain scan.',
        symptoms: [],
        treatment: 'Regular monitoring and health check-ups recommended.'
      }
    }
  },
  hi: {
    pageTitle: "ब्रेन ट्यूमर एमआरआई स्कैन पूर्वानुमान",
    upload: "एमआरआई स्कैन अपलोड करें",
    uploadDescription: "अपनी एमआरआई स्कैन छवि यहां खींचें और छोड़ें, या ब्राउज़ करने के लिए क्लिक करें",
    supportedFormats: "समर्थित: JPG, PNG, DICOM",
    fileSelected: "फ़ाइल चयनित",
    removeFile: "फ़ाइल हटाएं",
    analyze: "स्कैन का विश्लेषण करें",
    analyzing: "विश्लेषण कर रहा है...",
    clickToEnlarge: "छवि को बड़ा करने के लिए क्लिक करें",
    closeImage: "बंद करें",
    selectedImage: "चयनित छवि",
    analysisCompleted: "विश्लेषण पूरा हुआ। कृपया नीचे दिए गए विस्तृत परिणाम देखें।",
    primaryResults: "प्राथमिक विश्लेषण परिणाम",
    primaryPrediction: "प्राथमिक पूर्वानुमान",
    secondaryConsideration: "द्वितीयक विचार",
    riskAssessment: "जोखिम मूल्यांकन",
    stage: "चरण",
    riskLevel: "जोखिम स्तर",
    interventionUrgency: "हस्तक्षेप की तात्कालिकता",
    probabilityDistribution: "संभाव्यता वितरण",
    descriptionOverview: "विवरण और अवलोकन",
    commonSymptoms: "सामान्य लक्षण",
    treatmentApproach: "उपचार विधि",
    clinicalInfo: "नैदानिक जानकारी",
    monitoringRecommendations: "निगरानी सिफारिशें",
    timelineExpectations: "समयरेखा अपेक्षाएँ:",
    recommendedMonitoring: "अनुशंसित निगरानी:",
    highConfidence: "उच्च विश्वास",
    moderateConfidence: "मध्यम विश्वास",
    lowConfidence: "कम विश्वास",
    pleaseSelect: "कृपया एक एमआरआई स्कैन छवि चुनें",
    error: "पूर्वानुमान प्राप्त करने में विफल",
    noTumor: "मस्तिष्क स्कैन में ट्यूमर का कोई प्रमाण नहीं।",
    tumorTypes: {
      Glioma: {
        description: "मस्तिष्क और रीढ़ की हड्डी में ग्लियल कोशिकाओं से उत्पन्न होने वाला ट्यूमर।",
        symptoms: ['सुबह के समय सिरदर्द', 'दौरे', 'प्रगतिशील तंत्रिका घाटा', 'मानसिक स्थिति में परिवर्तन'],
        treatment: 'उपचार में सर्जरी, विकिरण चिकित्सा और कीमोथेरेपी शामिल हैं।'
      },
      Meningioma: {
        description: 'मस्तिष्क और रीढ़ की हड्डी को ढकने वाली सुरक्षात्मक परतों में विकसित होने वाले ट्यूमर। आमतौर पर सौम्य।',
        symptoms: ['सिरदर्द', 'दृष्टि समस्याएँ', 'सुनने में कमी', 'मेमोरी समस्याएँ'],
        treatment: 'उपचार में आमतौर पर सर्जरी और कुछ मामलों में विकिरण चिकित्सा शामिल है।'
      },
      Pituitary: {
        description: 'मस्तिष्क के आधार पर पिट्यूटरी ग्रंथि में बनने वाले ट्यूमर। हार्मोन उत्पादन को प्रभावित कर सकते हैं।',
        symptoms: ['हार्मोन असंतुलन', 'दृष्टि समस्याएँ', 'थकान', 'असमझी वजन परिवर्तन'],
        treatment: 'उपचार में हार्मोन स्तर को नियंत्रित करने के लिए दवाएं, सर्जरी या विकिरण चिकित्सा शामिल हैं।'
      },
      'No Tumour': {
        description: 'मस्तिष्क स्कैन में ट्यूमर का कोई प्रमाण नहीं।',
        symptoms: [],
        treatment: 'नियमित निगरानी और स्वास्थ्य जांच की सिफारिश की जाती है।'
      }
    }
  },
  kn: {
    pageTitle: "ಮೆದುಳಿನ ಟ್ಯೂಮರ್ ಎಂಆರ್‌ಐ ಸ್ಕ್ಯಾನ್ ಮುನ್ಸೂಚನೆ",
    upload: "ಎಂಆರ್‌ಇ ಸ್ಕ್ಯಾನ್ ಅಪ್‌ಲೊಡ್ ಮಾಡಿ",
    uploadDescription: "ನಿಮ್ಮ ಎಂಆರ್‌ಇ ಸ್ಕ್ಯಾನ್ ಚಿತ್ರವನ್ನು ಇಲ್ಲಿ ಎಳೆಯೆ ಎಳೆಯಿರಿ, ಅಥವಾ ಬ್ರಾವ್ಸ್ ಮಾಡಲು ಕ್ಲಿಕ್ ಮಾಡಿ",
    supportedFormats: "ಸಮರ್ಥನೆ: JPG, PNG, DICOM",
    fileSelected: "ಭಾಇಲ್ ಆಯ್ಕೆ ಮಾಡಲಾಗಿದೆ",
    removeFile: "ಭಾಇಲ್ ತೆಗೆಯೆ",
    analyze: "ಸ್ಕ್ಯಾನ್ ವಿಶ್ಲೇಷಿಸಿ",
    analyzing: "ವಿಶ್ಲೇಷಿಸುತ್ತಿದೆ...",
    clickToEnlarge: "ಚಿತ್ರವನ್ನು ವಿಸ್ತರಿಸಲು ಕ್ಲಿಕ್ ಮಾಡಿ",
    closeImage: "ಮುಚ್ಚಿ",
    selectedImage: "ಆಯ್ದ ಚಿತ್ರ",
    analysisCompleted: "ವಿಶ್ಲೇಷಣೆ ಪೂರ್ಣಗೊಂಡಿದೆ. ದಯವಿಟ್ಟು ಕೆಳಗಿನ ಸಮಗ್ರ ಫಲಿತಾಂಶಗಳನ್ನು ಪರಿಶೀಲಿಸಿ.",
    primaryResults: "ಪ್ರಾಥಮಿಕ ವಿಶ್ಲೇಷಣಾ ಫಲಿತಾಂಶಗಳು",
    primaryPrediction: "ಪ್ರಾಥಮಿಕ ಮುನ್ಸೂಚನೆ",
    secondaryConsideration: "ದ್ವಿತೀಯ ಪರಿಗಣನೆ",
    riskAssessment: "ಜೊತೆಗೆ ಮಟ್ಟ",
    stage: "ಹಂತ",
    riskLevel: "ಜೊತೆಗೆ ಮಟ್ಟ",
    interventionUrgency: "ಹಸ್ತಕ್ಷೇಪ ತುರ್ತು",
    probabilityDistribution: "ಸಾಧ್ಯತೆ ವಿತರಣಾ",
    descriptionOverview: "ವಿವರಣೆ ಮತ್ತು ಅವಲೋಕನ",
    commonSymptoms: "ಸಾಮಾನ್ಯ ಲಕ್ಷಣಗಳು",
    treatmentApproach: "ಚಿಕಿತ್ಸಾ ವಿಧಾನ",
    clinicalInfo: "ವೈದ್ಯಕೀಯ ಮಾಹಿತಿ",
    monitoringRecommendations: "ನಿಗಾವಣಾ ಶಿಫಾರಸುಗಳು",
    timelineExpectations: "ಸಮಯರೇಖೆ ನಿರೀಕ್ಷೆಗಳು:",
    recommendedMonitoring: "ಶಿಫಾರಸು ಮಾಡಿದ ನಿಗಾವಣೆ:",
    highConfidence: "ಹೆಚ್ಚು ವಿಶ್ವಾಸ",
    moderateConfidence: "ಮಧ್ಯಮ ವಿಶ್ವಾಸ",
    lowConfidence: "ಕಡಿಮೆ ವಿಶ್ವಾಸ",
    pleaseSelect: "ದಯವಿಟ್ಟು ಎಂಆರ್‌ಐ ಸ್ಕ್ಯಾನ್ ಚಿತ್ರವನ್ನು ಆಯ್ಕೆ ಮಾಡಿ",
    error: "ಮುನ್ಸೂಚನೆ ಪಡೆಯಲು ವಿಫಲವಾಗಿದೆ",
    noTumor: "ಮೆದುಳಿನ ಸ್ಕ್ಯಾನ್‌ನಲ್ಲಿ ಟ್ಯೂಮರ್‌ನ ಯಾವುದೇ ಸಾಕ್ಷ್ಯವಿಲ್ಲ.",
    tumorTypes: {
      Glioma: {
        description: "ಮೆದುಳಿನಲ್ಲಿ ಮತ್ತು ನಡುಗಾಲಿನಲ್ಲಿ ಗ್ಲಿಯಲ್ ಕೋಶಗಳಿಂದ ಉಂಟಾಗುವ ಟ್ಯೂಮರ್.",
        symptoms: ['ಬೆಳಿಗ್ಗೆ ತಲೆನೋವು', 'ಅನಿಯಮಿತ ಆಕಸ್ಮಿಕಗಳು', 'ಪ್ರಗತಿಶೀಲ ನ್ಯೂರೋಲಾಜಿಕಲ್ ಕೊರತೆಗಳು', 'ಮಾನಸಿಕ ಸ್ಥಿತಿಯಲ್ಲಿ ಬದಲಾವಣೆ'],
        treatment: 'ಚಿಕಿತ್ಸಾ ಆಯ್ಕೆಗಳು: ಶಸ್ತ್ರಚಿಕಿತ್ಸೆ, ಕಿರಣ ಚಿಕಿತ್ಸೆ, ಮತ್ತು ರಾಸಾಯನಿಕ ಚಿಕಿತ್ಸೆ.'
      },
      Meningioma: {
        description: 'ಮೆದುಳನ್ನು ಮತ್ತು ನಡುಗಾಲನ್ನು ಆವರಿಸುವ ರಕ್ಷಕ ಪದರಗಳಲ್ಲಿ ಬೆಳೆಯುವ ಟ್ಯೂಮರ್. ಸಾಮಾನ್ಯವಾಗಿ ಸೌಮ್ಯ.',
        symptoms: ['ತಲೆನೋವು', 'ದೃಷ್ಟಿ ಸಮಸ್ಯೆಗಳು', 'ಕೆಳಗಿನ ಶಬ್ದ ಕೇಳುವ ಸಮಸ್ಯೆ', 'ಮೆಮೊರಿ ಸಮಸ್ಯೆಗಳು'],
        treatment: 'ಚಿಕಿತ್ಸೆ ಸಾಮಾನ್ಯವಾಗಿ ಶಸ್ತ್ರಚಿಕಿತ್ಸೆ, ಕೆಲವು ಸಂದರ್ಭಗಳಲ್ಲಿ ಕಿರಣ ಚಿಕಿತ್ಸೆ.'
      },
      Pituitary: {
        description: 'ಮೆದುಳಿನ ಆಧಾರದ ಮೇಲೆ ಪಿಟ್ಯೂಟರಿ ಗ್ರಂಥಿಯಲ್ಲಿ ಬೆಳೆಯುವ ಟ್ಯೂಮರ್. ಹಾರ್ಮೋನ್ ಉತ್ಪಾದನೆಯನ್ನು ಪ್ರಭಾವಿಸುತ್ತದೆ.',
        symptoms: ['ಹಾರ್ಮೋನ್ ಅಸಮತೋಲನ', 'ದೃಷ್ಟಿ ಸಮಸ್ಯೆಗಳು', 'ದಣಿವು', 'ಅಸ್ಪಷ್ಟ ತೂಕ ಬದಲಾವಣೆ'],
        treatment: 'ಚಿಕಿತ್ಸೆ: ಹಾರ್ಮೋನ್ ಮಟ್ಟವನ್ನು ನಿರ್ವಹಿಸಲು ಔಷಧಿ, ಶಸ್ತ್ರಚಿಕಿತ್ಸೆ, ಅಥವಾ ಕಿರಣ ಚಿಕಿತ್ಸೆ.'
      },
      'No Tumour': {
        description: 'ಮೆದುಳಿನ ಸ್ಕ್ಯಾನ್‌ನಲ್ಲಿ ಟ್ಯೂಮರ್‌ನ ಯಾವುದೇ ಸಾಕ್ಷ್ಯವಿಲ್ಲ.',
        symptoms: [],
        treatment: 'ನಿಯಮಿತ ನಿಗಾವಣೆ ಮತ್ತು ಆರೋಗ್ಯ ತಪಾಸಣೆ ಶಿಫಾರಸು ಮಾಡಲಾಗಿದೆ.'
      }
    }
  }
};

// Animation keyframes
const pulse = keyframes`
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
  100% {
    transform: scale(1);
  }
`;

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const VisuallyHiddenInput = styled('input')`
  clip: rect(0 0 0 0);
  clip-path: inset(50%);
  height: 1px;
  overflow: hidden;
  position: absolute;
  bottom: 0;
  left: 0;
  white-space: nowrap;
  width: 1px;
`;

const UploadDropZone = styled(Box)(({ theme, isDragActive, hasFile }) => ({
  border: `2px dashed ${isDragActive ? theme.palette.primary.main : hasFile ? theme.palette.success.main : theme.palette.grey[400]}`,
  borderRadius: theme.spacing(2),
  padding: theme.spacing(6, 4),
  textAlign: 'center',
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  backgroundColor: isDragActive 
    ? `${theme.palette.primary.light}15` 
    : hasFile 
    ? `${theme.palette.success.light}15` 
    : theme.palette.grey[50],
  '&:hover': {
    borderColor: theme.palette.primary.main,
    backgroundColor: `${theme.palette.primary.light}20`,
    transform: 'translateY(-2px)',
    boxShadow: theme.shadows[4]
  },
  ...(isDragActive && {
    animation: `${pulse} 1s infinite`
  })
}));

const FilePreviewCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  borderRadius: theme.spacing(2),
  background: `linear-gradient(135deg, ${theme.palette.success.light}20, ${theme.palette.success.light}10)`,
  border: `1px solid ${theme.palette.success.light}`,
  animation: `${fadeIn} 0.5s ease`,
  position: 'relative',
  overflow: 'hidden'
}));

const AnalyzeButton = styled(Button)(({ theme }) => ({
  background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
  borderRadius: theme.spacing(3),
  padding: theme.spacing(1.5, 4),
  fontSize: '1.1rem',
  fontWeight: 'bold',
  textTransform: 'none',
  boxShadow: theme.shadows[4],
  '&:hover': {
    background: `linear-gradient(45deg, ${theme.palette.primary.dark}, ${theme.palette.secondary.dark})`,
    transform: 'translateY(-2px)',
    boxShadow: theme.shadows[8]
  },
  '&:disabled': {
    background: theme.palette.grey[300],
    color: theme.palette.grey[500]
  }
}));

const ConfidenceIndicator = ({ confidence, t }) => {
  let color = confidence > 0.7 ? '#2e7d32' : confidence > 0.4 ? '#ed6c02' : '#1976d2';
  let label = confidence > 0.7 ? t.highConfidence : confidence > 0.4 ? t.moderateConfidence : t.lowConfidence;
  
  return (
    <Tooltip title={label}>
      <Box
        sx={{
          display: 'inline-flex',
          alignItems: 'center',
          bgcolor: `${color}20`,
          color: color,
          px: 2,
          py: 1,
          borderRadius: 2,
          fontSize: '1.1rem',
          fontWeight: 'bold',
          ml: 1,
          border: `2px solid ${color}`,
          boxShadow: 1
        }}
      >
        {(confidence * 100).toFixed(1)}%
      </Box>
    </Tooltip>
  );
};

const ResultCard = ({ title, value, confidence, color = 'primary', icon: Icon, t }) => (
  <Paper elevation={3} sx={{ mb: 2, borderRadius: 2, overflow: 'hidden' }}>
    <Box sx={{ p: 2, bgcolor: `${color}.main`, color: 'white' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        {Icon && <Icon />}
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          {title}
        </Typography>
        {confidence && <ConfidenceIndicator confidence={confidence} t={t} />}
      </Box>
    </Box>
    <CardContent>
      <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
        {value}
      </Typography>
    </CardContent>
  </Paper>
);

const DetailAccordion = ({ title, icon: Icon, children }) => (
  <Accordion sx={{ mb: 2 }}>
    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        {Icon && <Icon color="primary" />}
        <Typography variant="subtitle1">{title}</Typography>
      </Box>
    </AccordionSummary>
    <AccordionDetails>
      {children}
    </AccordionDetails>
  </Accordion>
);

const TumorDescription = ({ tumorType, t }) => {
  const info = t.tumorTypes[tumorType] || t.tumorTypes['No Tumour'];

  return (
    <Box sx={{ mt: 3 }}>
      <Typography variant="h6" gutterBottom color="primary" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <LocalHospitalIcon />
        {t.clinicalInfo}: {tumorType}
      </Typography>
      
      <DetailAccordion
        title={t.descriptionOverview}
        icon={InfoIcon}
      >
        <Typography variant="body1" paragraph>
          {info.description}
        </Typography>
      </DetailAccordion>

      {info.symptoms.length > 0 && (
        <DetailAccordion
          title={t.commonSymptoms}
          icon={WarningIcon}
        >
          <Box component="ul" sx={{ pl: 2 }}>
            {info.symptoms.map((symptom, index) => (
              <Box component="li" key={index} sx={{ mb: 1 }}>
                <Typography variant="body2">{symptom}</Typography>
              </Box>
            ))}
          </Box>
        </DetailAccordion>
      )}

      <DetailAccordion
        title={t.treatmentApproach}
        icon={LocalHospitalIcon}
      >
        <Typography variant="body2">
          {info.treatment}
        </Typography>
      </DetailAccordion>
    </Box>
  );
};

const MRIScanPrediction = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [language, setLanguage] = useState('en');
  const [isDragActive, setIsDragActive] = useState(false);
  const [imageDialogOpen, setImageDialogOpen] = useState(false);
  const fileInputRef = useRef(null);
  const t = translations[language];

  const processFile = (file) => {
    if (file && file.type.startsWith('image/')) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setResult(null);
      setError(null);
    } else {
      setError('Please select a valid image file (JPG, PNG, DICOM)');
    }
  };

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      processFile(file);
    }
  };

  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
    
    const files = e.dataTransfer.files;
    if (files && files[0]) {
      processFile(files[0]);
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setResult(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleUploadClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleImageClick = () => {
    setImageDialogOpen(true);
  };

  const handleCloseImageDialog = () => {
    setImageDialogOpen(false);
  };

  const handleSubmit = async () => {
    if (!selectedFile) {
      setError(t.pleaseSelect);
      return;
    }

    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append('image', selectedFile);

    try {
      const response = await fetch('http://localhost:5002/predict', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(t.error);
      }

      const data = await response.json();
      setResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', p: 3 }}>
      {/* Language Selector */}
      <Box sx={{ mb: 2, display: 'flex', justifyContent: 'flex-end' }}>
        <Select
          value={language}
          onChange={e => setLanguage(e.target.value)}
          size="small"
          sx={{ minWidth: 120 }}
        >
          <MenuItem value="en">English</MenuItem>
          <MenuItem value="hi">हिन्दी</MenuItem>
          <MenuItem value="kn">ಕನ್ನಡ</MenuItem>
        </Select>
      </Box>

      <Typography variant="h4" gutterBottom>
        {t.pageTitle}
      </Typography>

      {/* Enhanced Upload Section */}
      <Paper elevation={3} sx={{ p: 3, mb: 4, borderRadius: 3, background: 'linear-gradient(135deg, #f8f9fa, #e9ecef)' }}>
        <Typography variant="h5" fontWeight="bold" color="primary" sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
          <MedicalServicesIcon sx={{ fontSize: 32 }} />
          {t.upload}
        </Typography>

        {!selectedFile ? (
          <UploadDropZone
            isDragActive={isDragActive}
            hasFile={!!selectedFile}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onClick={handleUploadClick}
            sx={{ mb: 3 }}
          >
            <Stack alignItems="center" spacing={2}>
              <Avatar sx={{ 
                bgcolor: isDragActive ? 'primary.main' : 'grey.400',
                width: 64,
                height: 64,
                transition: 'all 0.3s ease'
              }}>
                <CloudUploadIcon sx={{ fontSize: 32 }} />
              </Avatar>
              
              <Box textAlign="center">
                <Typography variant="h6" fontWeight="bold" color="primary" gutterBottom>
                  {t.upload}
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mb: 1 }}>
                  {t.uploadDescription}
                </Typography>
                <Chip 
                  label={t.supportedFormats}
                  size="small"
                  variant="outlined"
                  color="primary"
                />
              </Box>
            </Stack>
            
            <VisuallyHiddenInput
              ref={fileInputRef}
              type="file"
              accept="image/*,.dcm"
              onChange={handleFileSelect}
            />
          </UploadDropZone>
        ) : (
          <Box sx={{ mb: 3 }}>
            {/* File Info Header */}
            <FilePreviewCard elevation={2} sx={{ mb: 2 }}>
              <Stack direction="row" alignItems="center" spacing={2}>
                <Avatar sx={{ bgcolor: 'success.main', width: 50, height: 50 }}>
                  <CheckCircleIcon />
                </Avatar>
                
                <Box flex={1}>
                  <Typography variant="subtitle1" fontWeight="bold" color="success.main">
                    {t.fileSelected}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {selectedFile?.name}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {(selectedFile?.size / (1024 * 1024)).toFixed(2)} MB
                  </Typography>
                </Box>
                
                <Tooltip title={t.removeFile}>
                  <IconButton 
                    onClick={handleRemoveFile}
                    sx={{ 
                      color: 'grey.500',
                      '&:hover': { 
                        color: 'error.main',
                        backgroundColor: 'error.light' 
                      }
                    }}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Tooltip>
              </Stack>
            </FilePreviewCard>
            
            {/* Large MRI Preview Image */}
            {previewUrl && (
              <Paper 
                elevation={6}
                sx={{ 
                  p: 3,
                  borderRadius: 3,
                  background: 'linear-gradient(135deg, #ffffff, #f8f9fa)',
                  textAlign: 'center'
                }}
              >
                <Stack spacing={2} alignItems="center">
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <ImageIcon color="primary" />
                    <Typography variant="h6" fontWeight="bold" color="primary">
                      {t.selectedImage}
                    </Typography>
                  </Stack>
                  
                  <Tooltip title={t.clickToEnlarge} arrow>
                    <Box
                      onClick={handleImageClick}
                      sx={{
                        p: 2,
                        borderRadius: 2,
                        background: '#ffffff',
                        border: '3px solid #e3f2fd',
                        boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
                        display: 'inline-block',
                        maxWidth: '100%',
                        cursor: 'zoom-in',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          transform: 'scale(1.02)',
                          boxShadow: '0 12px 32px rgba(0,0,0,0.2)',
                          border: '3px solid #1976d2'
                        }
                      }}
                    >
                      <img
                        src={previewUrl}
                        alt="MRI Scan Preview"
                        style={{
                          maxWidth: '100%',
                          width: 'auto',
                          height: 'auto',
                          maxHeight: 500,
                          minHeight: 200,
                          borderRadius: 8,
                          display: 'block'
                        }}
                      />
                    </Box>
                  </Tooltip>
                  
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <ZoomInIcon color="primary" fontSize="small" />
                    <Typography variant="body2" color="primary" fontWeight="medium">
                      {t.clickToEnlarge}
                    </Typography>
                  </Stack>
                  
                  <Typography variant="body2" color="text.secondary">
                    📏 Click "Analyze Scan" below to process this MRI image
                  </Typography>
                </Stack>
              </Paper>
            )}
          </Box>
        )}

        {/* Enhanced Analyze Button */}
        <Box textAlign="center">
          <AnalyzeButton
            onClick={handleSubmit}
            disabled={!selectedFile || loading}
            startIcon={
              loading ? (
                <CircularProgress size={20} color="inherit" />
              ) : (
                <AnalyticsIcon />
              )
            }
            size="large"
          >
            {loading ? t.analyzing : t.analyze}
          </AnalyzeButton>
          
          {selectedFile && !loading && (
            <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
              AI-powered brain tumor detection using advanced deep learning algorithms
            </Typography>
          )}
        </Box>
      </Paper>

      {error && (
        <Typography color="error" sx={{ my: 2 }}>
          {error}
        </Typography>
      )}


      {result && (
        <Box sx={{ my: 3, mx: 2 }}>
          <Alert severity="info" sx={{ mb: 3 }}>
            {t.analysisCompleted}
          </Alert>

          <Grid container spacing={3}>
            <Grid item xs={12} md={8}>
              <Typography variant="h5" gutterBottom color="primary">
                {t.primaryResults}
              </Typography>

              {result.prediction && (
                <ResultCard
                  title={t.primaryPrediction}
                  value={result.prediction.class}
                  confidence={result.prediction.confidence}
                  color="primary"
                  icon={AssessmentIcon}
                  t={t}
                />
              )}

              {result.secondary_prediction && (
                <ResultCard
                  title={t.secondaryConsideration}
                  value={result.secondary_prediction.class}
                  confidence={result.secondary_prediction.confidence}
                  color="secondary"
                  icon={TimelineIcon}
                  t={t}
                />
              )}

              {result.risk_assessment && (
                <>
                  <ResultCard
                    title={t.riskAssessment}
                    value={`${t.stage}: ${result.risk_assessment.stage}\n${t.riskLevel}: ${result.risk_assessment.risk_level}`}
                    color={result.risk_assessment.risk_level === 'High' ? 'error' : 'warning'}
                    icon={MonitorHeartIcon}
                    t={t}
                  />
                  <ResultCard
                    title={t.interventionUrgency}
                    value={result.risk_assessment.intervention_urgency}
                    color={result.risk_assessment.intervention_urgency === 'High' ? 'error' : 'warning'}
                    t={t}
                  />
                </>
              )}

              <Paper elevation={3} sx={{ mt: 3, borderRadius: 2, overflow: 'hidden' }}>
                <Box sx={{ p: 2, bgcolor: 'primary.main', color: 'white' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <AssessmentIcon />
                    <Typography variant="h6">{t.probabilityDistribution}</Typography>
                  </Box>
                </Box>
                <CardContent>
                  {Object.entries(result.prediction.probabilities).map(([type, prob]) => (
                    <Box key={type} sx={{ mb: 2 }}>
                      <Typography variant="body2" color="text.secondary">
                        {type}
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Box sx={{ width: '100%', mr: 1 }}>
                          <LinearProgress
                            variant="determinate"
                            value={prob * 100}
                            sx={{
                              height: 10,
                              borderRadius: 5,
                              backgroundColor: 'rgba(0, 0, 0, 0.1)',
                              '& .MuiLinearProgress-bar': {
                                borderRadius: 5,
                                backgroundColor: prob > 0.7 ? '#2e7d32' : prob > 0.4 ? '#ed6c02' : '#1976d2'
                              }
                            }}
                          />
                        </Box>
                        <Box sx={{ minWidth: 60 }}>
                          <Typography variant="body2" color="text.secondary">
                            {(prob * 100).toFixed(2)}%
                          </Typography>
                        </Box>
                      </Box>
                    </Box>
                  ))}
                </CardContent>
              </Paper>
            </Grid>

            <Grid item xs={12} md={4}>
              {result.prediction && (
                <TumorDescription tumorType={result.prediction.class} t={t} />
              )}

              {result.risk_assessment && result.prediction.class !== 'No Tumour' && (
                <Paper sx={{ mt: 3 }}>
                  <CardContent>
                    <Typography variant="h6" gutterBottom color="primary">
                      {t.monitoringRecommendations}
                    </Typography>
                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                      {t.timelineExpectations}
                    </Typography>
                    <Box sx={{ mb: 2 }}>
                      {result.temporal_predictions?.timeline && Object.entries(result.temporal_predictions.timeline).map(([period, prediction]) => (
                        <Typography key={period} variant="body2" sx={{ mb: 1 }}>
                          • <strong>{period}</strong>: {prediction}
                        </Typography>
                      ))}
                    </Box>
                    <Divider sx={{ my: 2 }} />
                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                      {t.recommendedMonitoring}
                    </Typography>
                    <Box>
                      {result.temporal_predictions?.monitoring && result.temporal_predictions.monitoring.map((item, index) => (
                        <Typography key={index} variant="body2" sx={{ mb: 1 }}>
                          • {item}
                        </Typography>
                      ))}
                    </Box>
                  </CardContent>
                </Paper>
              )}
            </Grid>
          </Grid>
        </Box>
      )}

      {/* Image Zoom Dialog */}
      <Dialog
        open={imageDialogOpen}
        onClose={handleCloseImageDialog}
        maxWidth="lg"
        fullWidth
        PaperProps={{
          sx: {
            bgcolor: 'transparent',
            boxShadow: 'none',
            overflow: 'hidden'
          }
        }}
      >
        <DialogTitle sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          bgcolor: 'rgba(0,0,0,0.8)',
          color: 'white'
        }}>
          <Stack direction="row" alignItems="center" spacing={1}>
            <ZoomInIcon />
            <Typography variant="h6">
              {t.selectedImage} - {selectedFile?.name}
            </Typography>
          </Stack>
          <IconButton 
            onClick={handleCloseImageDialog}
            sx={{ color: 'white' }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent 
          sx={{ 
            bgcolor: 'rgba(0,0,0,0.9)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            p: 2,
            minHeight: '60vh'
          }}
        >
          {previewUrl && (
            <img
              src={previewUrl}
              alt="MRI Scan Full View"
              style={{
                maxWidth: '100%',
                maxHeight: '80vh',
                width: 'auto',
                height: 'auto',
                borderRadius: 8,
                boxShadow: '0 8px 32px rgba(255,255,255,0.1)'
              }}
            />
          )}
        </DialogContent>
        <DialogActions sx={{ 
          bgcolor: 'rgba(0,0,0,0.8)',
          justifyContent: 'center'
        }}>
          <Button 
            onClick={handleCloseImageDialog}
            variant="contained"
            startIcon={<CloseIcon />}
          >
            {t.closeImage}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default MRIScanPrediction;
