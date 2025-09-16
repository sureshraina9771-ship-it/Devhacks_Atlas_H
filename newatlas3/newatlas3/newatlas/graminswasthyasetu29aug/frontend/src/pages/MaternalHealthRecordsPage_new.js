import React, { useState } from 'react';
import {
  Box, Typography, Paper, Button, Stack, Grid, Card, CardContent, Avatar,
  Dialog, DialogTitle, DialogContent, DialogActions, Chip, Divider,
  FormControl, InputLabel, Select, MenuItem, Accordion, AccordionSummary, AccordionDetails,
  List, ListItem, ListItemIcon, ListItemText, Alert, AlertTitle, Stepper, Step, StepLabel,
  Timeline, TimelineItem, TimelineContent, TimelineSeparator, TimelineDot, TimelineConnector,
  Fab, Badge, IconButton, Link, Tab, Tabs
} from '@mui/material';
import {
  PregnantWoman as PregnantIcon,
  ChildFriendly as BabyIcon,
  LocalHospital as HospitalIcon,
  Favorite as HeartIcon,
  HealthAndSafety as HealthIcon,
  Restaurant as FoodIcon,
  FitnessCenter as ExerciseIcon,
  Vaccines as VaccineIcon,
  Schedule as ScheduleIcon,
  Phone as PhoneIcon,
  Warning as WarningIcon,
  CheckCircle as CheckIcon,
  Info as InfoIcon,
  ExpandMore as ExpandMoreIcon,
  School as EducationIcon,
  MonitorHeart as MonitorIcon,
  Support as SupportIcon,
  Translate as TranslateIcon,
  CallMade as ExternalIcon,
  Water as WaterIcon,
  MedicalServices as MedicalIcon,
  Psychology as MentalHealthIcon,
  Home as HomeIcon
} from '@mui/icons-material';

// Enhanced translations with new UI elements
const translations = {
  en: {
    title: "Maternal Health Guide",
    subtitle: "Based on WHO Guidelines",
    intro: "Comprehensive guidance for mothers and families during pregnancy and after childbirth, based on World Health Organization recommendations.",
    duringPregnancy: "During Pregnancy",
    afterDelivery: "After Delivery",
    moreInfo: "For more information, visit the",
    whoPage: "WHO Maternal Health page",
    close: "Close",
    pregnancyTips: [
      "Attend at least 8 antenatal care visits for timely detection and management of risks.",
      "Eat a balanced, nutritious diet and maintain adequate hydration.",
      "Take iron and folic acid supplements as recommended.",
      "Receive all recommended vaccinations (such as tetanus).",
      "Practice good hygiene and handwashing.",
      "Engage in regular, moderate physical activity as advised by your healthcare provider.",
      "Avoid tobacco, alcohol, and exposure to harmful substances.",
      "Monitor for warning signs: severe headache, blurred vision, swelling, bleeding, fever, or pain—seek medical help immediately if any occur.",
      "Prepare a birth plan and arrange for skilled care at birth.",
      "Ensure emotional support from family and community."
    ],
    deliveryTips: [
      "Attend all postnatal checkups for both mother and baby.",
      "Practice exclusive breastfeeding for the first 6 months.",
      "Ensure the mother has adequate nutrition and rest.",
      "Keep the baby warm and maintain hygiene for both mother and baby.",
      "Monitor for signs of infection or complications in mother and baby; seek medical help if needed.",
      "Ensure timely immunizations for the baby.",
      "Support the mother emotionally and physically; involve family members in care.",
      "Maintain a clean environment to prevent infections.",
      "Encourage open communication about any health concerns."
    ]
  },
  hi: {
    title: "मातृ स्वास्थ्य गाइड",
    subtitle: "WHO दिशानिर्देश आधारित",
    intro: "विश्व स्वास्थ्य संगठन की सिफारिशों के आधार पर गर्भावस्था और प्रसव के बाद माताओं और परिवारों के लिए व्यापक मार्गदर्शन।",
    duringPregnancy: "गर्भावस्था के दौरान",
    afterDelivery: "प्रसव के बाद",
    moreInfo: "अधिक जानकारी के लिए देखें",
    whoPage: "WHO मातृ स्वास्थ्य पृष्ठ",
    close: "बंद करें",
    pregnancyTips: [
      "जोखिमों की समय पर पहचान और प्रबंधन के लिए कम से कम 8 प्रसवपूर्व देखभाल विजिट करें।",
      "संतुलित, पौष्टिक आहार लें और पर्याप्त पानी पिएं।",
      "आयरन और फोलिक एसिड की गोलियां लें जैसा सलाह दी गई हो।",
      "सभी अनुशंसित टीकाकरण (जैसे टेटनस) प्राप्त करें।",
      "अच्छी स्वच्छता और हाथ धोने का अभ्यास करें।",
      "अपने स्वास्थ्य सेवा प्रदाता की सलाह के अनुसार नियमित, मध्यम शारीरिक गतिविधि करें।",
      "तंबाकू, शराब और हानिकारक पदार्थों से बचें।",
      "चेतावनी संकेतों की निगरानी करें: तेज सिरदर्द, धुंधली दृष्टि, सूजन, रक्तस्राव, बुखार या दर्द—यदि कोई हो तो तुरंत चिकित्सा सहायता लें।",
      "जन्म योजना बनाएं और जन्म के समय कुशल देखभाल की व्यवस्था करें।",
      "परिवार और समुदाय से भावनात्मक समर्थन सुनिश्चित करें।"
    ],
    deliveryTips: [
      "माँ और बच्चे दोनों के लिए सभी प्रसवोत्तर जांच करवाएं।",
      "पहले 6 महीनों के लिए केवल स्तनपान कराएं।",
      "माँ को पर्याप्त पोषण और आराम सुनिश्चित करें।",
      "बच्चे को गर्म रखें और माँ-बच्चे दोनों के लिए स्वच्छता बनाए रखें।",
      "माँ और बच्चे में संक्रमण या जटिलताओं के संकेतों की निगरानी करें; आवश्यकता होने पर चिकित्सा सहायता लें।",
      "बच्चे के लिए समय पर टीकाकरण सुनिश्चित करें।",
      "माँ को भावनात्मक और शारीरिक रूप से समर्थन दें; देखभाल में परिवार के सदस्यों को शामिल करें।",
      "संक्रमण से बचाव के लिए स्वच्छ वातावरण बनाए रखें।",
      "किसी भी स्वास्थ्य चिंता के बारे में खुलकर बात करें।"
    ]
  },
  kn: {
    title: "ತಾಯಿಯ ಆರೋಗ್ಯ ಮಾರ್ಗದರ್ಶಿ",
    subtitle: "WHO ಮಾರ್ಗಸೂಚಿಗಳ ಆಧಾರಿತ",
    intro: "ವಿಶ್ವ ಆರೋಗ್ಯ ಸಂಸ್ಥೆಯ ಶಿಫಾರಸುಗಳ ಆಧಾರದ ಮೇಲೆ ಗರ್ಭಧಾರಣೆ ಮತ್ತು ಹೆರಿಗೆ ನಂತರ ತಾಯಂದಿರು ಮತ್ತು ಕುಟುಂಬಗಳಿಗೆ ಸಮಗ್ರ ಮಾರ್ಗದರ್ಶನ.",
    duringPregnancy: "ಗರ್ಭಧಾರಣೆಯ ಸಮಯದಲ್ಲಿ",
    afterDelivery: "ಹೆರಿಗೆಯ ನಂತರ",
    moreInfo: "ಹೆಚ್ಚಿನ ಮಾಹಿತಿಗಾಗಿ ಭೇಟಿ ನೀಡಿ",
    whoPage: "WHO ತಾಯಿ ಆರೋಗ್ಯ ಪುಟ",
    close: "ಮುಚ್ಚಿ",
    pregnancyTips: [
      "ಅಪಾಯಗಳ ಸಮಯಕ್ಕೆ ಸರಿಯಾದ ಪತ್ತೆ ಮತ್ತು ನಿರ್ವಹಣೆಗೆ ಕನಿಷ್ಠ 8 ಗರ್ಭಪೂರ್ವ ಆರೈಕೆ ಭೇಟಿಗಳನ್ನು ಮಾಡಿ.",
      "ಸಮತೋಲನದ, ಪೌಷ್ಟಿಕ ಆಹಾರ ಸೇವಿಸಿ ಮತ್ತು ಸಾಕಷ್ಟು ನೀರು ಕುಡಿಯಿರಿ.",
      "ಐರನ್ ಮತ್ತು ಫೋಲಿಕ್ ಆಸಿಡ್ ಪೂರಕಗಳನ್ನು ಸಲಹೆಯಂತೆ ತೆಗೆದುಕೊಳ್ಳಿ.",
      "ಎಲ್ಲಾ ಶಿಫಾರಸು ಮಾಡಿದ ಲಸಿಕೆಗಳನ್ನು (ಉದಾ: ಟೆಟನಸ್) ಪಡೆಯಿರಿ.",
      "ಚೆನ್ನಾಗಿ ಸ್ವಚ್ಛತೆ ಮತ್ತು ಕೈ ತೊಳೆಯುವ ಅಭ್ಯಾಸ ಮಾಡಿ.",
      "ನಿಮ್ಮ ಆರೋಗ್ಯ ಸೇವಾ ಪೂರೈಕೆದಾರರ ಸಲಹೆಯಂತೆ ನಿಯಮಿತ, ಮಧ್ಯಮ ಶಾರೀರಿಕ ಚಟುವಟಿಕೆ ಮಾಡಿ.",
      "ಧೂಮಪಾನ, ಮದ್ಯಪಾನ ಮತ್ತು ಹಾನಿಕಾರಕ ಪದಾರ್ಥಗಳಿಂದ ದೂರಿರಿ.",
      "ಎಚ್ಚರಿಕೆ ಸೂಚನೆಗಳನ್ನು ಗಮನಿಸಿ: ತೀವ್ರ ತಲೆನೋವು, ಮಸುಕು ದೃಷ್ಟಿ, ಊತ, ರಕ್ತಸ್ರಾವ, ಜ್ವರ ಅಥವಾ ನೋವು—ಯಾವುದೇ ಉಂಟಾದರೆ ತಕ್ಷಣ ವೈದ್ಯಕೀಯ ಸಹಾಯ ಪಡೆಯಿರಿ.",
      "ಹೆರಿಗೆ ಯೋಜನೆ ಮಾಡಿ ಮತ್ತು ಹೆರಿಗೆ ಸಮಯದಲ್ಲಿ ನಿಪುಣ ಆರೈಕೆ ವ್ಯವಸ್ಥೆ ಮಾಡಿ.",
      "ಕುಟುಂಬ ಮತ್ತು ಸಮುದಾಯದಿಂದ ಭಾವನಾತ್ಮಕ ಬೆಂಬಲವನ್ನು ಖಚಿತಪಡಿಸಿ."
    ],
    deliveryTips: [
      "ತಾಯಿ ಮತ್ತು ಶಿಶು ಇಬ್ಬರಿಗೂ ಎಲ್ಲಾ ಹೆರಿಗೆ ನಂತರದ ತಪಾಸಣೆಗಳನ್ನು ಮಾಡಿ.",
      "ಮೊದಲ 6 ತಿಂಗಳುಗಳ ಕಾಲ ಮಾತ್ರ ತಾಯಿ ಹಾಲು ನೀಡಿರಿ.",
      "ತಾಯಿಗೆ ಸಾಕಷ್ಟು ಪೌಷ್ಟಿಕ ಆಹಾರ ಮತ್ತು ವಿಶ್ರಾಂತಿ ಖಚಿತಪಡಿಸಿ.",
      "ಶಿಶುವನ್ನು ಬಿಸಿ ಇಟ್ಟುಕೊಳ್ಳಿ ಮತ್ತು ತಾಯಿ-ಶಿಶು ಇಬ್ಬರಿಗೂ ಸ್ವಚ್ಛತೆ ಕಾಯ್ದುಕೊಳ್ಳಿ.",
      "ತಾಯಿ ಮತ್ತು ಶಿಶುವಿನಲ್ಲಿ ಸೋಂಕು ಅಥವಾ ಸಂಕೀರ್ಣತೆಗಳ ಸೂಚನೆಗಳನ್ನು ಗಮನಿಸಿ; ಅಗತ್ಯವಿದ್ದರೆ ವೈದ್ಯಕೀಯ ಸಹಾಯ ಪಡೆಯಿರಿ.",
      "ಶಿಶುವಿಗೆ ಸಮಯಕ್ಕೆ ಸರಿಯಾದ ಲಸಿಕೆಗಳನ್ನು ಖಚಿತಪಡಿಸಿ.",
      "ತಾಯಿಗೆ ಭಾವನಾತ್ಮಕ ಮತ್ತು ಶಾರೀರಿಕ ಬೆಂಬಲ ನೀಡಿ; ಆರೈಕೆಯಲ್ಲಿ ಕುಟುಂಬದ ಸದಸ್ಯರನ್ನು ಒಳಗೊಳ್ಳಿಸಿ.",
      "ಸೋಂಕು ತಡೆಯಲು ಸ್ವಚ್ಛ ವಾತಾವರಣವನ್ನು ಕಾಯ್ದುಕೊಳ್ಳಿ.",
      "ಯಾವುದೇ ಆರೋಗ್ಯ ಚಿಂತನೆಗಳ ಬಗ್ಗೆ ತೆರೆಯಾಗಿ ಸಂವಹನ ಮಾಡಿ."
    ]
  }
};

export default function MaternalHealthRecordsPage() {
  const [language, setLanguage] = useState('en');
  const [activeTab, setActiveTab] = useState(0);
  const [detailDialog, setDetailDialog] = useState(false);
  const [selectedTip, setSelectedTip] = useState(null);
  
  const t = translations[language];

  const pregnancyCategories = [
    {
      icon: <ScheduleIcon />,
      title: "Regular Check-ups",
      titleHi: "नियमित जांच",
      titleKn: "ನಿಯಮಿತ ಪರೀಕ್ಷೆಗಳು",
      tips: [t.pregnancyTips[0], t.pregnancyTips[8]],
      color: "#1976d2"
    },
    {
      icon: <FoodIcon />,
      title: "Nutrition & Supplements",
      titleHi: "पोषण और सप्लीमेंट्स", 
      titleKn: "ಪೋಷಣೆ ಮತ್ತು ಪೂರಕಗಳು",
      tips: [t.pregnancyTips[1], t.pregnancyTips[2]],
      color: "#388e3c"
    },
    {
      icon: <VaccineIcon />,
      title: "Health & Safety",
      titleHi: "स्वास्थ्य और सुरक्षा",
      titleKn: "ಆರೋಗ್ಯ ಮತ್ತು ಸುರಕ್ಷತೆ",
      tips: [t.pregnancyTips[3], t.pregnancyTips[4], t.pregnancyTips[6]],
      color: "#f57c00"
    },
    {
      icon: <ExerciseIcon />,
      title: "Physical Activity",
      titleHi: "शारीरिक गतिविधि",
      titleKn: "ಶಾರೀರಿಕ ಚಟುವಟಿಕೆ",
      tips: [t.pregnancyTips[5]],
      color: "#7b1fa2"
    },
    {
      icon: <WarningIcon />,
      title: "Warning Signs",
      titleHi: "चेतावनी के संकेत",
      titleKn: "ಎಚ್ಚರಿಕೆ ಸಂಕೇತಗಳು",
      tips: [t.pregnancyTips[7]],
      color: "#d32f2f"
    },
    {
      icon: <SupportIcon />,
      title: "Support & Planning",
      titleHi: "सहारा और योजना",
      titleKn: "ಬೆಂಬಲ ಮತ್ತು ಯೋಜನೆ",
      tips: [t.pregnancyTips[9]],
      color: "#0288d1"
    }
  ];

  const postpartumCategories = [
    {
      icon: <ScheduleIcon />,
      title: "Medical Care",
      titleHi: "चिकित्सा देखभाल",
      titleKn: "ವೈದ್ಯಕೀಯ ಆರೈಕೆ",
      tips: [t.deliveryTips[0], t.deliveryTips[4], t.deliveryTips[5]],
      color: "#1976d2"
    },
    {
      icon: <BabyIcon />,
      title: "Baby Care",
      titleHi: "बच्चे की देखभाल",
      titleKn: "ಮಗುವಿನ ಆರೈಕೆ",
      tips: [t.deliveryTips[1], t.deliveryTips[3]],
      color: "#388e3c"
    },
    {
      icon: <HeartIcon />,
      title: "Mother's Health",
      titleHi: "माँ का स्वास्थ्य",
      titleKn: "ತಾಯಿಯ ಆರೋಗ್ಯ",
      tips: [t.deliveryTips[2]],
      color: "#e91e63"
    },
    {
      icon: <SupportIcon />,
      title: "Support & Environment",
      titleHi: "सहारा और वातावरण",
      titleKn: "ಬೆಂಬಲ ಮತ್ತು ವಾತಾವರಣ",
      tips: [t.deliveryTips[6], t.deliveryTips[7], t.deliveryTips[8]],
      color: "#00796b"
    }
  ];

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleTipClick = (tip, category) => {
    setSelectedTip({ tip, category });
    setDetailDialog(true);
  };

  const CategoryCard = ({ category, tips }) => {
    const categoryTitle = language === 'hi' ? category.titleHi : language === 'kn' ? category.titleKn : category.title;
    
    return (
      <Card
        elevation={3}
        sx={{
          height: '100%',
          cursor: 'pointer',
          transition: 'all 0.3s ease',
          '&:hover': {
            elevation: 8,
            transform: 'translateY(-4px)'
          },
          background: `linear-gradient(135deg, ${category.color}15, ${category.color}05)`
        }}
      >
        <CardContent sx={{ p: 3 }}>
          <Stack spacing={2} alignItems="center">
            <Avatar
              sx={{
                width: 60,
                height: 60,
                bgcolor: category.color,
                mb: 1
              }}
            >
              {category.icon}
            </Avatar>
            
            <Typography variant="h6" fontWeight="bold" textAlign="center" color={category.color}>
              {categoryTitle}
            </Typography>
            
            <Stack spacing={1} width="100%">
              {tips.map((tip, index) => (
                <Button
                  key={index}
                  variant="outlined"
                  size="small"
                  onClick={() => handleTipClick(tip, category)}
                  sx={{
                    textAlign: 'left',
                    justifyContent: 'flex-start',
                    textTransform: 'none',
                    borderColor: category.color,
                    color: category.color,
                    '&:hover': {
                      bgcolor: `${category.color}10`,
                      borderColor: category.color
                    }
                  }}
                >
                  <Typography variant="caption" sx={{ textOverflow: 'ellipsis', overflow: 'hidden' }}>
                    {tip.substring(0, 50)}...
                  </Typography>
                </Button>
              ))}
            </Stack>
          </Stack>
        </CardContent>
      </Card>
    );
  };

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#fce4ec', p: 3 }}>
      {/* Header */}
      <Paper elevation={3} sx={{ 
        p: 3, 
        mb: 3, 
        borderRadius: 3, 
        background: 'linear-gradient(135deg, #e91e63, #f06292)'
      }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={2}>
          <Stack direction="row" alignItems="center" spacing={2}>
            <Avatar sx={{ width: 60, height: 60, bgcolor: 'white' }}>
              <PregnantIcon sx={{ fontSize: 32, color: '#e91e63' }} />
            </Avatar>
            <Box>
              <Typography variant="h4" fontWeight="bold" color="white">
                {t.title}
              </Typography>
              <Typography variant="subtitle1" color="rgba(255,255,255,0.9)">
                {t.subtitle}
              </Typography>
            </Box>
          </Stack>
          
          {/* Language Selector */}
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <Select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              sx={{ 
                color: 'white',
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'rgba(255,255,255,0.5)'
                }
              }}
            >
              <MenuItem value="en">English</MenuItem>
              <MenuItem value="hi">हिन्दी</MenuItem>
              <MenuItem value="kn">ಕನ್ನಡ</MenuItem>
            </Select>
          </FormControl>
        </Stack>
        
        {/* WHO Credit */}
        <Alert 
          severity="info" 
          icon={<InfoIcon />}
          sx={{ bgcolor: 'rgba(255,255,255,0.1)', color: 'white' }}
        >
          <AlertTitle sx={{ color: 'white', fontWeight: 'bold' }}>
            World Health Organization (WHO) Recommended
          </AlertTitle>
          {t.intro}
        </Alert>
      </Paper>

      {/* Tab Navigation */}
      <Paper elevation={2} sx={{ mb: 3, borderRadius: 2 }}>
        <Tabs 
          value={activeTab} 
          onChange={handleTabChange} 
          centered
          sx={{
            '& .MuiTab-root': {
              minHeight: 70,
              fontSize: '1rem',
              fontWeight: 'bold'
            }
          }}
        >
          <Tab 
            icon={<PregnantIcon />} 
            label={t.duringPregnancy} 
            iconPosition="start"
          />
          <Tab 
            icon={<BabyIcon />} 
            label={t.afterDelivery} 
            iconPosition="start"
          />
        </Tabs>
      </Paper>

      {/* Content */}
      {activeTab === 0 && (
        <>
          <Typography variant="h5" fontWeight="bold" color="primary" mb={3}>
            {t.duringPregnancy}
          </Typography>
          
          <Grid container spacing={3}>
            {pregnancyCategories.map((category, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <CategoryCard category={category} tips={category.tips} />
              </Grid>
            ))}
          </Grid>
        </>
      )}

      {activeTab === 1 && (
        <>
          <Typography variant="h5" fontWeight="bold" color="primary" mb={3}>
            {t.afterDelivery}
          </Typography>
          
          <Grid container spacing={3}>
            {postpartumCategories.map((category, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <CategoryCard category={category} tips={category.tips} />
              </Grid>
            ))}
          </Grid>
        </>
      )}

      {/* WHO Reference */}
      <Paper elevation={2} sx={{ p: 3, mt: 4, borderRadius: 3, bgcolor: '#fff3e0' }}>
        <Stack direction="row" alignItems="center" spacing={2} mb={2}>
          <Avatar sx={{ bgcolor: '#1976d2' }}>
            <ExternalIcon />
          </Avatar>
          <Typography variant="h6" fontWeight="bold" color="primary">
            For More Information
          </Typography>
        </Stack>
        
        <Typography variant="body1" mb={2}>
          {t.moreInfo}
        </Typography>
        
        <Button
          variant="contained"
          startIcon={<ExternalIcon />}
          href="https://www.who.int/health-topics/maternal-health"
          target="_blank"
          rel="noopener"
          sx={{
            background: 'linear-gradient(45deg, #1976d2, #1565c0)',
            '&:hover': {
              background: 'linear-gradient(45deg, #1565c0, #0d47a1)'
            }
          }}
        >
          {t.whoPage}
        </Button>
      </Paper>

      {/* Detail Dialog */}
      <Dialog 
        open={detailDialog} 
        onClose={() => setDetailDialog(false)}
        maxWidth="md"
        fullWidth
      >
        {selectedTip && (
          <>
            <DialogTitle>
              <Stack direction="row" alignItems="center" spacing={2}>
                <Avatar sx={{ bgcolor: selectedTip.category.color }}>
                  {selectedTip.category.icon}
                </Avatar>
                <Typography variant="h6" fontWeight="bold">
                  {language === 'hi' ? selectedTip.category.titleHi :
                   language === 'kn' ? selectedTip.category.titleKn :
                   selectedTip.category.title}
                </Typography>
              </Stack>
            </DialogTitle>
            <DialogContent>
              <Typography variant="body1" sx={{ fontSize: '1.1rem', lineHeight: 1.7 }}>
                {selectedTip.tip}
              </Typography>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setDetailDialog(false)}>
                {t.close}
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Box>
  );
}
