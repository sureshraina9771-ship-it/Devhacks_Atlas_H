import React, { useState } from 'react';
import { Container, Typography, Box, Card, CardContent, Avatar, Divider, Button, TextField, Select, MenuItem } from '@mui/material';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import { useNavigate } from 'react-router-dom';

// Simple translations for demonstration
const translations = {
  en: {
    creditScore: "Credit Score",
    medicalReports: "Medical Reports",
    addNewReport: "Add New Report",
    reportHeading: "Report Heading",
    reportDescription: "Report Description",
    reportImageUrl: "Report Image URL",
    addReport: "Add Report",
    logout: "Logout"
  },
  hi: {
    creditScore: "क्रेडिट स्कोर",
    medicalReports: "चिकित्सा रिपोर्ट",
    addNewReport: "नई रिपोर्ट जोड़ें",
    reportHeading: "रिपोर्ट शीर्षक",
    reportDescription: "रिपोर्ट विवरण",
    reportImageUrl: "रिपोर्ट इमेज URL",
    addReport: "रिपोर्ट जोड़ें",
    logout: "लॉगआउट"
  },
  kn: {
    creditScore: "ಕ್ರೆಡಿಟ್ ಸ್ಕೋರ್",
    medicalReports: "ವೈದ್ಯಕೀಯ ವರದಿಗಳು",
    addNewReport: "ಹೊಸ ವರದಿ ಸೇರಿಸಿ",
    reportHeading: "ವರದಿ ಶೀರ್ಷಿಕೆ",
    reportDescription: "ವರದಿ ವಿವರಣೆ",
    reportImageUrl: "ವರದಿ ಚಿತ್ರ URL",
    addReport: "ವರದಿ ಸೇರಿಸಿ",
    logout: "ಲಾಗ್ ಔಟ್"
  }
};

function ProfilePage() {
  const user = {
    name: "Raj Kamal Azad",
    creditScore: 185,
    details: "Male, 18, Bihar, India",
    medicalReport: "No major issues. Last checkup: 2025-08-01",
    reportImage: "https://img.freepik.com/free-vector/medical-report-concept-illustration_114360-1516.jpg?w=700",
    avatar: "https://cdn-icons-png.flaticon.com/512/2922/2922510.png"
  };

  const [language, setLanguage] = useState('en');
  const t = translations[language];

  const [reports, setReports] = useState([
    { heading: "Main Report", description: user.medicalReport, image: user.reportImage }
  ]);
  const [newReportHeading, setNewReportHeading] = useState('');
  const [newReportDesc, setNewReportDesc] = useState('');
  const [newReportImg, setNewReportImg] = useState('');
  const navigate = useNavigate();

  const handleAddReport = () => {
    if (newReportHeading && newReportDesc && newReportImg) {
      setReports([...reports, { heading: newReportHeading, description: newReportDesc, image: newReportImg }]);
      setNewReportHeading('');
      setNewReportDesc('');
      setNewReportImg('');
    }
  };

  const handleLogout = () => {
    navigate('/');
    window.location.reload();
  };

  return (
    <Container sx={{ mt: 8, display: 'flex', justifyContent: 'center' }}>
      <Card sx={{ maxWidth: 500, width: '100%', borderRadius: 4, boxShadow: 6, background: 'rgba(255,255,255,0.95)' }}>
        <CardContent>
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
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Avatar src={user.avatar} sx={{ width: 72, height: 72, mr: 2, bgcolor: '#1976d2' }}>
              <LocalHospitalIcon sx={{ fontSize: 40 }} />
            </Avatar>
            <Box>
              <Typography variant="h4" sx={{ fontWeight: 700, color: '#1976d2' }}>
                {user.name}
              </Typography>
              <Typography variant="subtitle1" sx={{ color: '#555' }}>
                {user.details}
              </Typography>
            </Box>
          </Box>
          <Divider sx={{ my: 2 }} />
          <Box sx={{ mb: 2 }}>
            <Typography variant="h6" sx={{ color: '#43a047', fontWeight: 600 }}>
              {t.creditScore}
            </Typography>
            <Typography variant="h5" sx={{ color: '#222', fontWeight: 700 }}>
              {user.creditScore}
            </Typography>
          </Box>
          <Divider sx={{ my: 2 }} />
          <Box>
            <Typography variant="h6" sx={{ color: '#1976d2', fontWeight: 600 }}>
              {t.medicalReports}
            </Typography>
            {reports.map((report, idx) => (
              <Box key={idx} sx={{ mb: 3 }}>
                <Button
                  variant="contained"
                  sx={{
                    mb: 1,
                    background: '#1976d2',
                    color: '#fff',
                    fontWeight: 600,
                    borderRadius: 2,
                    boxShadow: 2,
                    textTransform: 'none',
                    fontSize: '1rem'
                  }}
                  disableElevation
                  fullWidth
                >
                  {report.heading}
                </Button>
                <Typography variant="body1" sx={{ mb: 1, color: '#444' }}>
                  {report.description}
                </Typography>
                <img
                  src={report.image}
                  alt={`Medical Report ${idx + 1}`}
                  style={{
                    maxWidth: 400,
                    width: '100%',
                    borderRadius: 12,
                    boxShadow: '0 4px 16px #1976d233',
                    marginBottom: 8
                  }}
                />
                <Divider sx={{ my: 2 }} />
              </Box>
            ))}
            <Box sx={{ mt: 2 }}>
              <Typography variant="subtitle1" sx={{ mb: 1, color: '#1976d2', fontWeight: 500 }}>
                {t.addNewReport}
              </Typography>
              <TextField
                label={t.reportHeading}
                variant="outlined"
                fullWidth
                value={newReportHeading}
                onChange={e => setNewReportHeading(e.target.value)}
                sx={{ mb: 2 }}
              />
              <TextField
                label={t.reportDescription}
                variant="outlined"
                fullWidth
                value={newReportDesc}
                onChange={e => setNewReportDesc(e.target.value)}
                sx={{ mb: 2 }}
              />
              <TextField
                label={t.reportImageUrl}
                variant="outlined"
                fullWidth
                value={newReportImg}
                onChange={e => setNewReportImg(e.target.value)}
                sx={{ mb: 2 }}
              />
              <Button
                variant="contained"
                color="primary"
                onClick={handleAddReport}
                disabled={!newReportHeading || !newReportDesc || !newReportImg}
              >
                {t.addReport}
              </Button>
            </Box>
          </Box>
          <Divider sx={{ my: 3 }} />
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <Button
              variant="outlined"
              color="error"
              onClick={handleLogout}
              sx={{
                fontWeight: 700,
                px: 4,
                py: 1,
                borderRadius: 3,
                textTransform: 'none'
              }}
            >
              {t.logout}
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
}

export default ProfilePage;