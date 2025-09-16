import React, { useEffect, useState } from 'react';
import { 
  Alert, Paper, Typography, Box, List, ListItem, ListItemText, Card, CardMedia, CardContent, 
  Divider, Select, MenuItem, Button, Stack, Grid, Avatar, Chip, IconButton, Dialog,
  DialogTitle, DialogContent, DialogActions, FormControl, InputLabel, TextField, Fab
} from '@mui/material';
import {
  Warning as WarningIcon,
  LocalHospital as HospitalIcon,
  Public as GlobalIcon,
  TrendingUp as TrendingIcon,
  Security as ShieldIcon,
  Masks as MaskIcon,
  Wash as WashIcon,
  Home as HomeIcon,
  Phone as PhoneIcon,
  Restaurant as FoodIcon,
  Search as SearchIcon,
  FilterList as FilterIcon,
  Translate as TranslateIcon,
  CallMade as ExternalIcon,
  Timeline as TimelineIcon,
  Close as CloseIcon,
  Info as InfoIcon
} from '@mui/icons-material';
import axios from 'axios';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend, Label
} from 'recharts';

const API_URL = 'http://127.0.0.1:5000';

// Enhanced translations
const translations = {
  en: {
    pageTitle: "Epidemic Alerts & Awareness",
    subtitle: "Stay Informed, Stay Safe",
    info: "Real-time epidemic monitoring and health awareness for your community. Get alerts, learn prevention, and access WHO resources.",
    generalTips: "Essential Safety Measures",
    previousAlerts: "Recent Health Alerts", 
    searchPlaceholder: "Search diseases or locations...",
    loading: "Loading health data...",
    noAlerts: "No recent alerts in your area.",
    alertsByDisease: "Disease Alert Statistics",
    riskLevelDist: "Risk Level Distribution",
    majorEpidemics: "Historical Epidemics & WHO Resources",
    safetyMeasures: "Prevention Methods",
    vaccine: "Vaccination",
    learnMore: "WHO Resources",
    dataRef: "Data Source: WHO Disease Outbreak News",
    hygiene: "Practice regular handwashing and personal hygiene",
    advisories: "Follow official health guidelines and advisories", 
    masks: "Use protective equipment during outbreaks",
    avoidCrowds: "Maintain social distancing in high-risk areas",
    safeWater: "Ensure clean water and food safety",
    emergencyContacts: "Keep emergency health contacts ready",
    diseaseName: "Disease",
    numberOfAlerts: "Alert Count",
    date: "Date",
    precaution: "Precautions",
    followGeneralTips: "Follow general safety guidelines",
    viewDetails: "View Details",
    closeDetails: "Close",
    lastUpdated: "Last Updated",
    riskLevel: "Risk Level",
    affectedAreas: "Affected Areas",
    recommendations: "Health Recommendations",
    high: "High",
    moderate: "Moderate",
    low: "Low",
    close: "Close",
    description: "Description",
    noDescription: "No description available",
    noSafetyMeasures: "No safety measures listed",
    additionalInfo: "Additional Information",
    noAdditionalInfo: "No additional information available",
    reportedAt: "Reported At"
  },
  hi: {
    pageTitle: "महामारी चेतावनी और जागरूकता",
    subtitle: "जानकार रहें, सुरक्षित रहें", 
    info: "आपके समुदाय के लिए वास्तविक समय महामारी निगरानी और स्वास्थ्य जागरूकता। अलर्ट प्राप्त करें, रोकथाम सीखें, और WHO संसाधनों तक पहुंचें।",
    generalTips: "आवश्यक सुरक्षा उपाय",
    previousAlerts: "हाल की स्वास्थ्य चेतावनी",
    searchPlaceholder: "रोग या स्थान खोजें...",
    loading: "स्वास्थ्य डेटा लोड हो रहा है...",
    noAlerts: "आपके क्षेत्र में कोई हालिया अलर्ट नहीं।",
    alertsByDisease: "रोग अलर्ट आंकड़े",
    riskLevelDist: "जोखिम स्तर वितरण", 
    majorEpidemics: "ऐतिहासिक महामारियां और WHO संसाधन",
    safetyMeasures: "रोकथाम विधियां",
    vaccine: "टीकाकरण",
    learnMore: "WHO संसाधन",
    dataRef: "डेटा स्रोत: WHO रोग प्रकोप समाचार",
    hygiene: "नियमित रूप से हाथ धोना और व्यक्तिगत स्वच्छता का अभ्यास करें",
    advisories: "आधिकारिक स्वास्थ्य दिशानिर्देशों का पालन करें",
    masks: "प्रकोप के दौरान सुरक्षात्मक उपकरण का उपयोग करें",
    avoidCrowds: "उच्च जोखिम वाले क्षेत्रों में सामाजिक दूरी बनाए रखें",
    safeWater: "स्वच्छ पानी और भोजन की सुरक्षा सुनिश्चित करें",
    emergencyContacts: "आपातकालीन स्वास्थ्य संपर्क तैयार रखें",
    diseaseName: "रोग",
    numberOfAlerts: "अलर्ट गिनती",
    date: "दिनांक",
    precaution: "सावधानियां",
    followGeneralTips: "सामान्य सुरक्षा दिशानिर्देशों का पालन करें",
    viewDetails: "विवरण देखें",
    closeDetails: "बंद करें", 
    lastUpdated: "अंतिम अपडेट",
    riskLevel: "जोखम स्तर",
    affectedAreas: "प्रभावित क्षेत्र",
    recommendations: "स्वास्थ्य सिफारिशें",
    high: "उच्च",
    moderate: "मध्यम",
    low: "कम",
    close: "बंद करें",
    description: "विवरण",
    noDescription: "कोई विवरण उपलब्ध नहीं",
    noSafetyMeasures: "कोई सुरक्षा उपाय सूचीबद्ध नहीं",
    additionalInfo: "अतिरिक्त जानकारी",
    noAdditionalInfo: "कोई अतिरिक्त जानकारी उपलब्ध नहीं",
    reportedAt: "रिपोर्ट किया गया"
  },
  pa: {
    pageTitle: "ਮਹਾਂਮਾਰੀ ਚੇਤਾਵਨੀ ਅਤੇ ਜਾਗਰੂਕਤਾ",
    subtitle: "ਜਾਣਕਾਰ ਰਹੋ, ਸੁਰੱਖਿਤ ਰਹੋ",
    info: "ਤੁਹਾਡੀ ਕਮਿਊਨਿਟੀ ਲਈ ਵਾਸਤਵਿਕ ਸਮੇਂ ਦੀ ਮਹਾਂਮਾਰੀ ਨਿਗਰਾਨੀ ਅਤੇ ਸਿਹਤ ਜਾਗਰੂਕਤਾ। ਅਲਰਟ ਪ੍ਰਾਪਤ ਕਰੋ, ਰੋਕਥਾਮ ਸਿੱਖੋ, ਅਤੇ WHO ਸਰੋਤਾਂ ਤੱਕ ਪਹੁੰਚੋ।",
    generalTips: "ਜ਼ਰੂਰੀ ਸੁਰੱਖਿਆ ਉਪਾਅ",
    previousAlerts: "ਹਾਲ ਦੀਆਂ ਸਿਹਤ ਚੇਤਾਵਨੀਆਂ",
    searchPlaceholder: "ਬੀਮਾਰੀਆਂ ਜਾਂ ਟਿਕਾਣੇ ਖੋਜੋ...",
    loading: "ਸਿਹਤ ਡੇਟਾ ਲੋਡ ਹੋ ਰਿਹਾ...",
    noAlerts: "ਤੁਹਾਡੇ ਖੇਤਰ ਵਿੱਚ ਕੋਈ ਹਾਲੀਆ ਅਲਰਟ ਨਹੀਂ।",
    alertsByDisease: "ਬੀਮਾਰੀ ਅਲਰਟ ਅੰਕੜੇ",
    riskLevelDist: "ਜੋਖਮ ਦਰਜੇ ਦੀ ਵੰਡ",
    majorEpidemics: "ਇਤਿਹਾਸਕ ਮਹਾਂਮਾਰੀਆਂ ਅਤੇ WHO ਸਰੋਤ",
    safetyMeasures: "ਰੋਕਥਾਮ ਦੇ ਤਰੀਕੇ",
    vaccine: "ਵੈਕਸੀਨ",
    learnMore: "WHO ਸਰੋਤ",
    dataRef: "ਡੇਟਾ ਸਰੋਤ: WHO ਰੋਗ ਪ੍ਰਕੋਪ ਖ਼ਬਰਾਂ",
    hygiene: "ਨਿਯਮਿਤ ਹੱਥ ਧੋਣਾ ਅਤੇ ਵਿਅਕਤੀਗਤ ਸਾਫ-ਸੁਥਰਾਈ ਦਾ ਅਭਿਆਸ ਕਰੋ",
    advisories: "ਸਰਕਾਰੀ ਸਿਹਤ ਨਿਰਦੇਸ਼ਾਂ ਦਾ ਪਾਲਣ ਕਰੋ",
    masks: "ਪ੍ਰਕੋਪਾਂ ਦੇ ਦੌਰਾਨ ਸੁਰੱਖਿਆ ਸਾਮਾਨ ਦਾ ਇਸਤੇਮਾਲ ਕਰੋ",
    avoidCrowds: "ਉੱਚ ਜੋਖਮ ਵਾਲੇ ਖੇਤਰਾਂ ਵਿੱਚ ਸਮਾਜਕ ਦੂਰੀ ਬਣਾਏ ਰੱਖੋ",
    safeWater: "ਸਾਫ ਪਾਣੀ ਅਤੇ ਖਾਦ ਸੁਰੱਖਿਆ ਨੂੰ ਯਕੀਨੀ ਬਣਾਓ",
    emergencyContacts: "ਅੱਚਾਨਕ ਸਿਹਤ ਸੰਪਰਕ ਤਿਆਰ ਰੱਖੋ",
    diseaseName: "ਬੀਮਾਰੀ",
    numberOfAlerts: "ਅਲਰਟ ਗਿਣਤੀ",
    date: "ਤਾਰੀਖ",
    precaution: "ਸਾਵਧਾਨੀਆਂ", 
    followGeneralTips: "ਆਮ ਸੁਰੱਖਿਆ ਦਿਸ਼ਾ-ਨਿਰਦੇਸ਼ਾਂ ਦਾ ਪਾਲਣ ਕਰੋ",
    viewDetails: "ਵੇਰਵੇ ਵੇਖੋ",
    closeDetails: "ਬੰਦ ਕਰੋ",
    lastUpdated: "ਆਖਰੀ ਵਾਰ ਅੱਪਡੇਟ ਕੀਤਾ",
    riskLevel: "ਜੋਖਮ ਪੱਧਰ",
    affectedAreas: "ਪ੍ਰਭਾਵਿਤ ਖੇਤਰ",
    recommendations: "ਸਿਹਤ ਸਿਫ਼ਾਰਿਸ਼ਾਂ",
    high: "ਉੱਚੀ",
    moderate: "ਮਧਿਆਮ",
    low: "ਘੱਟ",
    close: "ਬੰਦ ਕਰੋ",
    description: "ਵੇਰਵਾ",
    noDescription: "ਕੋਈ ਵੇਰਵਾ ਉਪਲਬਧ ਨਹੀਂ",
    noSafetyMeasures: "ਕੋਈ ਸੁਰੱਖਿਆ ਉਪਾਅ ਸੂਚੀਬੱਧ ਨਹੀਂ",
    additionalInfo: "ਵਾਧੂ ਜਾਣਕਾਰੀ",
    noAdditionalInfo: "ਕੋਈ ਵਾਧੂ ਜਾਣਕਾਰੀ ਉਪਲਬਧ ਨਹੀਂ",
    reportedAt: "ਰਿਪੋਰਟ ਕੀਤਾ ਗਿਆ"
  }
};

// Enhanced epidemic data with more details
const worldEpidemics = [
  {
    name: "COVID-19",
    years: "2019–present", 
    description: "A global pandemic caused by the novel coronavirus SARS-CoV-2.",
    img: "https://images.unsplash.com/photo-1584036561566-baf8f5f1b144?w=300&h=200&fit=crop",
    safety: [
      "Wear masks in crowded places",
      "Maintain 6 feet social distance", 
      "Wash hands frequently with soap",
      "Get vaccinated and boosters"
    ],
    vaccine: "Multiple vaccines available (mRNA, viral vector, protein subunit)",
    who: "https://www.who.int/emergencies/diseases/novel-coronavirus-2019",
    riskLevel: "High",
    affectedAreas: "Global - All continents"
  },
  {
    name: "Ebola",
    years: "2014–2016, 2018–2020",
    description: "A severe, often fatal illness caused by the Ebola virus.",
    img: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=300&h=200&fit=crop",
    safety: [
      "Avoid contact with blood/body fluids",
      "Use protective equipment for caregivers",
      "Practice safe burial procedures",
      "Report suspected cases immediately"
    ],
    vaccine: "Ervebo (rVSV-ZEBOV) vaccine approved",
    who: "https://www.who.int/health-topics/ebola",
    riskLevel: "Very High",
    affectedAreas: "West & Central Africa"
  },
  {
    name: "Cholera",
    years: "1817–present",
    description: "An acute diarrhoeal infection from contaminated water/food.",
    img: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=300&h=200&fit=crop",
    safety: [
      "Drink only safe, bottled/boiled water",
      "Eat hot, well-cooked food",
      "Wash hands frequently with soap",
      "Avoid raw/undercooked seafood"
    ],
    vaccine: "Oral cholera vaccines available",
    who: "https://www.who.int/health-topics/cholera",
    riskLevel: "Moderate",
    affectedAreas: "Tropical regions worldwide"
  }
];

export default function EpidemicAlertsPage() {
  const [epidemics, setEpidemics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [language, setLanguage] = useState('en');
  const [selectedEpidemic, setSelectedEpidemic] = useState(null);
  const [detailDialog, setDetailDialog] = useState(false);
  
  const t = translations[language];

  useEffect(() => {
    // Try to fetch epidemic alerts, fallback to mock data
    axios.get(`${API_URL}/epidemic-alerts`)
      .then(res => {
        setEpidemics(res.data.epidemic_alerts || []);
        setLoading(false);
      })
      .catch(() => {
        // Use mock data for demo
        const mockAlerts = [
          {
            disease: "Dengue",
            location: "Karnataka, India", 
            risk_level: "High",
            alert_time: "2024-01-15",
            precaution: "Remove standing water, use mosquito nets"
          },
          {
            disease: "Malaria", 
            location: "Odisha, India",
            risk_level: "Moderate",
            alert_time: "2024-01-10", 
            precaution: "Use bed nets, seek early treatment for fever"
          }
        ];
        setEpidemics(mockAlerts);
        setLoading(false);
      });
  }, []);

  const filteredEpidemics = worldEpidemics.filter(epi =>
    epi.name.toLowerCase().includes(search.toLowerCase()) ||
    epi.affectedAreas.toLowerCase().includes(search.toLowerCase())
  );

  const filteredAlerts = epidemics.filter(
    epi => epi.risk_level !== '0' && epi.risk_level !== 0
  );

  // Chart data
  const barData = [
    { name: "COVID-19", count: 150 },
    { name: "Dengue", count: 45 },
    { name: "Malaria", count: 32 },
    { name: "Cholera", count: 18 }
  ];

  const pieData = [
    { name: "High", value: 60, color: "#d32f2f" },
    { name: "Moderate", value: 85, color: "#f57c00" },
    { name: "Low", value: 100, color: "#388e3c" }
  ];

  const handleEpidemicClick = (epidemic) => {
    setSelectedEpidemic(epidemic);
    setDetailDialog(true);
  };

  const SafetyTipsCard = () => (
    <Paper elevation={3} sx={{ p: 3, mb: 3, borderRadius: 3, bgcolor: '#fff3e0' }}>
      <Stack direction="row" alignItems="center" spacing={2} mb={2}>
        <Avatar sx={{ bgcolor: '#f57c00' }}>
          <ShieldIcon />
        </Avatar>
        <Typography variant="h6" fontWeight="bold" color="primary">
          {t.generalTips}
        </Typography>
      </Stack>
      
      <Grid container spacing={2}>
        {[
          { icon: <WashIcon />, text: t.hygiene, color: '#2196f3' },
          { icon: <HospitalIcon />, text: t.advisories, color: '#4caf50' },
          { icon: <MaskIcon />, text: t.masks, color: '#ff9800' },
          { icon: <HomeIcon />, text: t.avoidCrowds, color: '#9c27b0' },
          { icon: <FoodIcon />, text: t.safeWater, color: '#00bcd4' },
          { icon: <PhoneIcon />, text: t.emergencyContacts, color: '#f44336' }
        ].map((tip, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Paper elevation={1} sx={{ p: 2, height: '100%' }}>
              <Stack direction="row" alignItems="center" spacing={2}>
                <Avatar sx={{ bgcolor: `${tip.color}20`, color: tip.color, width: 40, height: 40 }}>
                  {tip.icon}
                </Avatar>
                <Typography variant="body2" sx={{ flex: 1 }}>
                  {tip.text}
                </Typography>
              </Stack>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Paper>
  );

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#f5f5f5', p: 3 }}>
      {/* Header */}
      <Paper elevation={3} sx={{ 
        p: 3, 
        mb: 3, 
        borderRadius: 3, 
        background: 'linear-gradient(135deg, #d32f2f, #f44336)'
      }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={2}>
          <Stack direction="row" alignItems="center" spacing={2}>
            <Avatar sx={{ width: 60, height: 60, bgcolor: 'white' }}>
              <WarningIcon sx={{ fontSize: 32, color: '#d32f2f' }} />
            </Avatar>
            <Box>
              <Typography variant="h4" fontWeight="bold" color="white">
                {t.pageTitle}
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
              <MenuItem value="pa">ਪੰਜਾਬੀ</MenuItem>
            </Select>
          </FormControl>
        </Stack>
        
        <Alert 
          severity="info" 
          icon={<InfoIcon />}
          sx={{ bgcolor: 'rgba(255,255,255,0.1)', color: 'white' }}
        >
          <Typography variant="body1" color="white">
            {t.info}
          </Typography>
        </Alert>
      </Paper>

      {/* Search */}
      <Paper elevation={2} sx={{ p: 2, mb: 3, borderRadius: 2 }}>
        <Stack direction="row" alignItems="center" spacing={2}>
          <SearchIcon color="action" />
          <TextField
            fullWidth
            variant="outlined"
            placeholder={t.searchPlaceholder}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            size="small"
          />
        </Stack>
      </Paper>

      {/* Safety Tips */}
      <SafetyTipsCard />

      {/* Stats Charts */}
      <Grid container spacing={3} mb={3}>
        <Grid item xs={12} md={6}>
          <Paper elevation={2} sx={{ p: 3, borderRadius: 3 }}>
            <Typography variant="h6" fontWeight="bold" mb={2} color="primary">
              {t.alertsByDisease}
            </Typography>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={barData}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#1976d2" />
              </BarChart>
            </ResponsiveContainer>
            <Typography variant="caption" color="text.secondary" textAlign="center" display="block">
              {t.dataRef}
            </Typography>
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Paper elevation={2} sx={{ p: 3, borderRadius: 3 }}>
            <Typography variant="h6" fontWeight="bold" mb={2} color="primary">
              {t.riskLevelDist}
            </Typography>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={pieData}
                  dataKey="value"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
            <Typography variant="caption" color="text.secondary" textAlign="center" display="block">
              {t.dataRef}
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* Recent Alerts */}
      <Paper elevation={2} sx={{ p: 3, mb: 3, borderRadius: 3 }}>
        <Typography variant="h6" fontWeight="bold" mb={2} color="primary">
          {t.previousAlerts}
        </Typography>
        
        {loading ? (
          <Typography>{t.loading}</Typography>
        ) : filteredAlerts.length === 0 ? (
          <Alert severity="info">
            <Typography>{t.noAlerts}</Typography>
          </Alert>
        ) : (
          <Stack spacing={2}>
            {filteredAlerts.map((alert, idx) => (
              <Paper key={idx} elevation={1} sx={{ p: 2, bgcolor: '#fff3e0' }}>
                <Stack direction="row" alignItems="center" spacing={2}>
                  <Avatar sx={{ 
                    bgcolor: alert.risk_level === 'High' ? '#d32f2f' : 
                             alert.risk_level === 'Moderate' ? '#f57c00' : '#388e3c'
                  }}>
                    <WarningIcon />
                  </Avatar>
                  <Box flex={1}>
                    <Typography variant="subtitle1" fontWeight="bold">
                      {alert.disease} in {alert.location}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {t.riskLevel}: {alert.risk_level} • {t.date}: {alert.alert_time}
                    </Typography>
                    <Typography variant="body2">
                      {t.precaution}: {alert.precaution || t.followGeneralTips}
                    </Typography>
                  </Box>
                </Stack>
              </Paper>
            ))}
          </Stack>
        )}
      </Paper>

      {/* Historical Epidemics */}
      <Paper elevation={2} sx={{ p: 3, borderRadius: 3 }}>
        <Typography variant="h6" fontWeight="bold" mb={3} color="primary">
          {t.majorEpidemics}
        </Typography>
        
        <Grid container spacing={3}>
          {filteredEpidemics.map((epidemic, idx) => (
            <Grid item xs={12} sm={6} md={4} key={idx}>
              <Card 
                elevation={3}
                sx={{ 
                  height: '100%',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    elevation: 8,
                    transform: 'translateY(-4px)'
                  }
                }}
                onClick={() => handleEpidemicClick(epidemic)}
              >
                <CardMedia
                  component="img"
                  height="140"
                  image={epidemic.img}
                  alt={epidemic.name}
                />
                <CardContent>
                  <Stack spacing={2}>
                    <Box>
                      <Typography variant="h6" fontWeight="bold">
                        {epidemic.name}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {epidemic.years}
                      </Typography>
                    </Box>
                    
                    <Typography variant="body2">
                      {epidemic.description}
                    </Typography>
                    
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <Chip 
                        label={epidemic.riskLevel}
                        size="small"
                        color={
                          epidemic.riskLevel === 'Very High' ? 'error' :
                          epidemic.riskLevel === 'High' ? 'warning' : 'success'
                        }
                      />
                      <Typography variant="caption" color="text.secondary">
                        {epidemic.affectedAreas}
                      </Typography>
                    </Stack>
                    
                    <Button 
                      variant="outlined"
                      size="small"
                      startIcon={<InfoIcon />}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEpidemicClick(epidemic);
                      }}
                    >
                      {t.viewDetails}
                    </Button>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Paper>

      {/* Detail Dialog */}
      <Dialog 
        open={detailDialog} 
        onClose={() => setDetailDialog(false)}
        maxWidth="md"
        fullWidth
      >
        {selectedEpidemic && (
          <>
            <DialogTitle>
              <Stack direction="row" alignItems="center" justifyContent="space-between">
                <Stack direction="row" alignItems="center" spacing={2}>
                  <Avatar sx={{ 
                    bgcolor: selectedEpidemic.riskLevel === 'Very High' ? '#d32f2f' :
                             selectedEpidemic.riskLevel === 'High' ? '#f57c00' : '#388e3c'
                  }}>
                    <GlobalIcon />
                  </Avatar>
                  <Box>
                    <Typography variant="h5" fontWeight="bold">
                      {selectedEpidemic.name}
                    </Typography>
                    <Typography variant="subtitle2" color="text.secondary">
                      {selectedEpidemic.years}
                    </Typography>
                  </Box>
                </Stack>
                <IconButton onClick={() => setDetailDialog(false)}>
                  <CloseIcon />
                </IconButton>
              </Stack>
            </DialogTitle>
            
            <DialogContent>
              <Stack spacing={3}>
                <Typography variant="body1">
                  {selectedEpidemic.description}
                </Typography>
                
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Typography variant="subtitle2" color="text.secondary">
                      {t.riskLevel}
                    </Typography>
                    <Chip 
                      label={selectedEpidemic.riskLevel}
                      color={
                        selectedEpidemic.riskLevel === 'Very High' ? 'error' :
                        selectedEpidemic.riskLevel === 'High' ? 'warning' : 'success'
                      }
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="subtitle2" color="text.secondary">
                      {t.affectedAreas}
                    </Typography>
                    <Typography variant="body2">
                      {selectedEpidemic.affectedAreas}
                    </Typography>
                  </Grid>
                </Grid>
                
                <Divider />
                
                <Box>
                  <Typography variant="h6" fontWeight="bold" mb={2} color="primary">
                    {t.safetyMeasures}
                  </Typography>
                  <List dense>
                    {selectedEpidemic.safety.map((measure, index) => (
                      <ListItem key={index}>
                        <ListItemText 
                          primary={measure}
                          sx={{ py: 0 }}
                        />
                      </ListItem>
                    ))}
                  </List>
                </Box>
                
                <Box>
                  <Typography variant="h6" fontWeight="bold" mb={1} color="primary">
                    {t.vaccine}
                  </Typography>
                  <Typography variant="body2">
                    {selectedEpidemic.vaccine}
                  </Typography>
                </Box>
              </Stack>
            </DialogContent>
            
            <DialogActions sx={{ p: 3 }}>
              <Button 
                variant="outlined"
                onClick={() => setDetailDialog(false)}
              >
                {t.closeDetails}
              </Button>
              <Button
                variant="contained"
                startIcon={<ExternalIcon />}
                href={selectedEpidemic.who}
                target="_blank"
                rel="noopener"
              >
                {t.learnMore}
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Box>
  );
}
