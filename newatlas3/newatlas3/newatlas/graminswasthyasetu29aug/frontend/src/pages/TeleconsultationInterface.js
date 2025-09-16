import React, { useState, useEffect } from 'react';
import './TeleconsultationInterface.css';
import {
  Box,
  Paper,
  Typography,
  Button,
  Card,
  CardContent,
  Avatar,
  Stack,
  Chip,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  IconButton,
  Grid,
  Divider
} from '@mui/material';
import {
  VideoCall as VideoCallIcon,
  Mic as MicIcon,
  MicOff as MicOffIcon,
  Videocam as VideocamIcon,
  VideocamOff as VideocamOffIcon,
  CallEnd as CallEndIcon,
  Chat as ChatIcon,
  Person as PersonIcon,
  LocalHospital as LocalHospitalIcon,
  ReportProblem as EmergencyIcon
} from '@mui/icons-material';

// Translations for the interface
const translations = {
  en: {
    teleconsultation: 'Teleconsultation',
    startDoctorConsultation: 'Start Doctor Consultation',
    startCall: 'Start Call',
    callShuru: 'कॉल शुरू करें',
    goodConnection: 'Good',
    emergency: 'Emergency',
    patientInfo: 'Patient Info',
    name: 'Name',
    age: 'Age',
    village: 'Village',
    language: 'Language',
    hindi: 'Hindi',
    english: 'English',
    kannada: 'Kannada',
    availableDoctors: 'Available Doctors',
    selectDoctor: 'Select Doctor',
    pricePerHour: 'Price per hour',
    consultation: 'Consultation',
    bookConsultation: 'Book Consultation'
  },
  hi: {
    teleconsultation: 'टेलीकंसल्टेशन',
    startDoctorConsultation: 'डॉक्टर परामर्श शुरू करें',
    startCall: 'कॉल शुरू करें',
    callShuru: 'कॉल शुरू करें',
    goodConnection: 'अच्छा',
    emergency: 'आपातकाल',
    patientInfo: 'मरीज की जानकारी',
    name: 'नाम',
    age: 'उम्र',
    village: 'गाँव',
    language: 'भाषा',
    hindi: 'हिंदी',
    english: 'अंग्रेजी',
    kannada: 'कन्नड़',
    availableDoctors: 'उपलब्ध डॉक्टर',
    selectDoctor: 'डॉक्टर चुनें',
    pricePerHour: 'प्रति घंटा दर',
    consultation: 'परामर्श',
    bookConsultation: 'परामर्श बुक करें'
  },
  kn: {
    teleconsultation: 'ಟೆಲಿಕನ್ಸಲ್ಟೇಶನ್',
    startDoctorConsultation: 'ವೈದ್ಯ ಸಮಾಲೋಚನೆ ಪ್ರಾರಂಭಿಸಿ',
    startCall: 'ಕರೆ ಪ್ರಾರಂಭಿಸಿ',
    callShuru: 'ಕರೆ ಪ್ರಾರಂಭಿಸಿ',
    goodConnection: 'ಉತ್ತಮ',
    emergency: 'ತುರ್ತು',
    patientInfo: 'ರೋಗಿ ಮಾಹಿತಿ',
    name: 'ಹೆಸರು',
    age: 'ವಯಸ್ಸು',
    village: 'ಹಳ್ಳಿ',
    language: 'ಭಾಷೆ',
    hindi: 'ಹಿಂದಿ',
    english: 'ಇಂಗ್ಲಿಷ್',
    kannada: 'ಕನ್ನಡ',
    availableDoctors: 'ಲಭ್ಯವಿರುವ ವೈದ್ಯರು',
    selectDoctor: 'ವೈದ್ಯರನ್ನು ಆಯ್ಕೆ ಮಾಡಿ',
    pricePerHour: 'ಪ್ರತಿ ಗಂಟೆಗೆ ಬೆಲೆ',
    consultation: 'ಸಮಾಲೋಚನೆ',
    bookConsultation: 'ಸಮಾಲೋಚನೆ ಬುಕ್ ಮಾಡಿ'
  }
};

// Sample Indian doctors data
const indianDoctors = [
  {
    id: 1,
    name: 'Dr. Rajesh Kumar',
    specialty: 'General Medicine',
    pricePerHour: '₹500',
    photo: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=150&h=150&fit=crop&crop=face'
  },
  {
    id: 2,
    name: 'Dr. Priya Sharma',
    specialty: 'Pediatrics',
    pricePerHour: '₹600',
    photo: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&h=150&fit=crop&crop=face'
  },
  {
    id: 3,
    name: 'Dr. Amit Singh',
    specialty: 'Cardiology',
    pricePerHour: '₹800',
    photo: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=150&h=150&fit=crop&crop=face'
  },
  {
    id: 4,
    name: 'Dr. Sunita Patel',
    specialty: 'Gynecology',
    pricePerHour: '₹700',
    photo: 'https://images.unsplash.com/photo-1594824475497-d0656fabb7dd?w=150&h=150&fit=crop&crop=face'
  }
];

// Sample patient data
const samplePatient = {
  name: 'Ram Kumar',
  age: '45 वर्ष',
  village: 'रामपुर',
  abhaId: '****-****-1234'
};

const TeleconsultationInterface = () => {
  const [language, setLanguage] = useState('hi');
  const [isCallActive, setIsCallActive] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState('good');
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  
  const t = translations[language];

  const handleStartCall = () => {
    setIsCallActive(true);
  };

  const handleEndCall = () => {
    setIsCallActive(false);
    setIsMuted(false);
    setIsVideoOff(false);
  };

  const handleLanguageChange = (event) => {
    setLanguage(event.target.value);
  };

  return (
    <Box 
      className="teleconsultation-interface"
      sx={{ 
        minHeight: '100vh', 
        backgroundColor: '#f5f5f5', 
        p: 2
      }}
    >
      <Grid container spacing={3}>
        {/* Header */}
        <Grid item xs={12}>
          <Paper elevation={2} sx={{ p: 2, mb: 2 }}>
            <Stack direction="row" alignItems="center" spacing={2}>
              <VideoCallIcon sx={{ fontSize: 32, color: '#1976d2' }} />
              <Typography variant="h5" fontWeight="bold">
                {t.teleconsultation}
              </Typography>
            </Stack>
          </Paper>
        </Grid>

        {/* Main Video Call Area */}
        <Grid item xs={12} md={8}>
          <Paper 
            className="video-container"
            elevation={4} 
            sx={{ 
              height: 400, 
              backgroundColor: '#2c3e50', 
              borderRadius: 3,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            {!isCallActive ? (
              <Stack alignItems="center" spacing={3}>
                <VideoCallIcon sx={{ fontSize: 80, color: '#7f8c8d' }} />
                <Typography variant="h6" color="white">
                  {t.startDoctorConsultation}
                </Typography>
                <Button
                  variant="contained"
                  size="large"
                  startIcon={<VideoCallIcon />}
                  onClick={handleStartCall}
                  sx={{
                    backgroundColor: '#3498db',
                    fontSize: '1.1rem',
                    px: 4,
                    py: 1.5,
                    '&:hover': {
                      backgroundColor: '#2980b9'
                    }
                  }}
                >
                  📞 {t.callShuru} • {t.startCall}
                </Button>
              </Stack>
            ) : (
              <Box sx={{ 
                width: '100%', 
                height: '100%', 
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Typography variant="h4" color="white" fontWeight="bold">
                  📹 Live Consultation
                </Typography>
              </Box>
            )}

            {/* Connection Status */}
            <Box 
              className="connection-indicator"
              sx={{ 
                position: 'absolute', 
                top: 16, 
                left: 16,
                display: 'flex',
                alignItems: 'center',
                gap: 1
              }}
            >
              <Box sx={{
                width: 12,
                height: 12,
                borderRadius: '50%',
                backgroundColor: connectionStatus === 'good' ? '#27ae60' : '#e74c3c'
              }} />
              <Typography variant="body2" color="white" fontWeight="bold">
                📶 {connectionStatus === 'good' ? t.goodConnection : 'Poor'}
              </Typography>
            </Box>

            {/* Emergency Button */}
            <Box sx={{ position: 'absolute', top: 16, right: 16 }}>
              <Chip
                className="emergency-button"
                icon={<EmergencyIcon />}
                label={`🚨 ${t.emergency}`}
                color="error"
                sx={{ fontWeight: 'bold' }}
              />
            </Box>

            {/* Video Controls */}
            {isCallActive && (
              <Box 
                className="video-controls"
                sx={{ 
                  position: 'absolute', 
                  bottom: 20, 
                  left: '50%', 
                  transform: 'translateX(-50%)',
                  display: 'flex',
                  gap: 2
                }}
              >
                <IconButton
                  onClick={() => setIsMuted(!isMuted)}
                  sx={{ 
                    backgroundColor: isMuted ? '#e74c3c' : 'rgba(255,255,255,0.2)', 
                    color: 'white',
                    '&:hover': {
                      backgroundColor: isMuted ? '#c0392b' : 'rgba(255,255,255,0.3)'
                    }
                  }}
                >
                  {isMuted ? <MicOffIcon /> : <MicIcon />}
                </IconButton>
                
                <IconButton
                  onClick={() => setIsVideoOff(!isVideoOff)}
                  sx={{ 
                    backgroundColor: isVideoOff ? '#e74c3c' : 'rgba(255,255,255,0.2)', 
                    color: 'white',
                    '&:hover': {
                      backgroundColor: isVideoOff ? '#c0392b' : 'rgba(255,255,255,0.3)'
                    }
                  }}
                >
                  {isVideoOff ? <VideocamOffIcon /> : <VideocamIcon />}
                </IconButton>

                <IconButton
                  onClick={handleEndCall}
                  sx={{ 
                    backgroundColor: '#e74c3c', 
                    color: 'white',
                    '&:hover': {
                      backgroundColor: '#c0392b'
                    }
                  }}
                >
                  <CallEndIcon />
                </IconButton>
              </Box>
            )}
          </Paper>
        </Grid>

        {/* Right Sidebar */}
        <Grid item xs={12} md={4}>
          <Stack spacing={3}>
            {/* Available Doctors */}
            <Card className="teleconsultation-card" elevation={3}>
              <CardContent>
                <Stack direction="row" alignItems="center" spacing={1} mb={2}>
                  <LocalHospitalIcon color="primary" />
                  <Typography variant="h6" fontWeight="bold">
                    {t.availableDoctors}
                  </Typography>
                </Stack>
                
                <Stack spacing={2}>
                  {indianDoctors.map((doctor) => (
                    <Paper 
                      key={doctor.id}
                      elevation={selectedDoctor?.id === doctor.id ? 3 : 1}
                      sx={{ 
                        p: 2, 
                        cursor: 'pointer',
                        border: selectedDoctor?.id === doctor.id ? '2px solid #3498db' : '1px solid #e0e0e0',
                        transition: 'all 0.2s ease',
                        '&:hover': {
                          elevation: 2,
                          backgroundColor: '#f8f9fa'
                        }
                      }}
                      onClick={() => setSelectedDoctor(doctor)}
                    >
                      <Stack direction="row" spacing={2} alignItems="center">
                        <Avatar 
                          src={doctor.photo}
                          sx={{ width: 50, height: 50 }}
                        >
                          <PersonIcon />
                        </Avatar>
                        <Box flex={1}>
                          <Typography variant="subtitle2" fontWeight="bold">
                            {doctor.name}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {doctor.specialty}
                          </Typography>
                          <Typography variant="body2" color="primary" fontWeight="bold">
                            {doctor.pricePerHour}/{t.pricePerHour}
                          </Typography>
                        </Box>
                        {selectedDoctor?.id === doctor.id && (
                          <Chip 
                            label="Selected" 
                            color="primary" 
                            size="small" 
                          />
                        )}
                      </Stack>
                    </Paper>
                  ))}
                </Stack>

                {selectedDoctor && (
                  <Button 
                    variant="contained" 
                    fullWidth 
                    sx={{ mt: 2, backgroundColor: '#27ae60' }}
                    startIcon={<VideoCallIcon />}
                  >
                    👨‍⚕️ {t.bookConsultation}
                  </Button>
                )}
              </CardContent>
            </Card>

            {/* Patient Information */}
            <Card className="teleconsultation-card" elevation={3}>
              <CardContent>
                <Stack direction="row" alignItems="center" spacing={1} mb={2}>
                  <PersonIcon color="primary" />
                  <Typography variant="h6" fontWeight="bold">
                    {t.patientInfo}
                  </Typography>
                </Stack>
                
                <Stack spacing={2}>
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      {t.name} • Name:
                    </Typography>
                    <Typography variant="body1" fontWeight="bold">
                      {samplePatient.name}
                    </Typography>
                  </Box>

                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      {t.age} • Age:
                    </Typography>
                    <Typography variant="body1" fontWeight="bold">
                      {samplePatient.age}
                    </Typography>
                  </Box>

                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      {t.village} • Village:
                    </Typography>
                    <Typography variant="body1" fontWeight="bold">
                      {samplePatient.village}
                    </Typography>
                  </Box>

                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      ABHA ID:
                    </Typography>
                    <Typography variant="body1" fontWeight="bold" color="primary">
                      {samplePatient.abhaId}
                    </Typography>
                  </Box>
                </Stack>
              </CardContent>
            </Card>

            {/* Language Selection */}
            <Card className="teleconsultation-card" elevation={3}>
              <CardContent>
                <Typography variant="h6" fontWeight="bold" mb={2}>
                  {t.language} • Language
                </Typography>
                
                <Stack spacing={1}>
                  <Button
                    variant={language === 'hi' ? 'contained' : 'outlined'}
                    fullWidth
                    onClick={() => setLanguage('hi')}
                    sx={{ justifyContent: 'flex-start' }}
                  >
                    हिंदी
                  </Button>
                  
                  <Button
                    variant={language === 'en' ? 'contained' : 'outlined'}
                    fullWidth
                    onClick={() => setLanguage('en')}
                    sx={{ 
                      justifyContent: 'flex-start',
                      backgroundColor: language === 'en' ? '#27ae60' : 'transparent',
                      '&:hover': {
                        backgroundColor: language === 'en' ? '#229954' : 'rgba(39, 174, 96, 0.1)'
                      }
                    }}
                  >
                    English
                  </Button>

                  <Button
                    variant={language === 'kn' ? 'contained' : 'outlined'}
                    fullWidth
                    onClick={() => setLanguage('kn')}
                    sx={{ justifyContent: 'flex-start' }}
                  >
                    ಕನ್ನಡ
                  </Button>
                </Stack>
              </CardContent>
            </Card>
          </Stack>
        </Grid>
      </Grid>
    </Box>
  );
};

export default TeleconsultationInterface;
