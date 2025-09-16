import React, { useEffect, useState } from 'react';
import {
  Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Stack, IconButton, Select, MenuItem, Box,
  Tabs, Tab, Chip
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import VideoCallIcon from '@mui/icons-material/VideoCall';
import TeleconsultationInterface from './TeleconsultationInterface';

const API_URL = 'http://127.0.0.1:5000/teleconsultations';

// Simple translations for demonstration
const translations = {
  en: {
    teleconsultations: "Teleconsultations",
    addTeleconsultation: "Add Teleconsultation",
    patientId: "Patient ID",
    patientName: "Patient Name",
    doctorId: "Doctor",
    doctorSpecialty: "Specialty",
    scheduledTime: "Scheduled Time",
    status: "Status",
    priority: "Priority",
    notes: "Notes",
    actions: "Actions",
    startConsultation: "Start Consultation",
    viewDetails: "View Details",
    noTeleconsultations: "No teleconsultations found.",
    cancel: "Cancel",
    add: "Add",
    confirmed: "Confirmed",
    pending: "Pending",
    cancelled: "Cancelled",
    high: "High",
    normal: "Normal"
  },
  hi: {
    teleconsultations: "टेलीपरामर्श",
    addTeleconsultation: "टेलीपरामर्श जोड़ें",
    patientId: "मरीज आईडी",
    patientName: "मरीज का नाम",
    doctorId: "डॉक्टर",
    doctorSpecialty: "विशेषज्ञता",
    scheduledTime: "निर्धारित समय",
    status: "स्थिति",
    priority: "प्राथमिकता",
    notes: "नोट्स",
    actions: "क्रियाएँ",
    startConsultation: "परामर्श शुरू करें",
    viewDetails: "विवरण देखें",
    noTeleconsultations: "कोई टेलीपरामर्श नहीं मिला।",
    cancel: "रद्द करें",
    add: "जोड़ें",
    confirmed: "पुष्टिकृत",
    pending: "लंबित",
    cancelled: "रद्द",
    high: "उच्च",
    normal: "सामान्य"
  },
  kn: {
    teleconsultations: "ಟೆಲಿಕನ್ಸಲ್ಟೇಶನ್‌ಗಳು",
    addTeleconsultation: "ಟೆಲಿಕನ್ಸಲ್ಟೇಶನ್ ಸೇರಿಸಿ",
    patientId: "ರೋಗಿಯ ಐಡಿ",
    patientName: "ರೋಗಿಯ ಹೆಸರು",
    doctorId: "ಡಾಕ್ಟರ್",
    doctorSpecialty: "ವಿಶೇಷಜ್ಞತೆ",
    scheduledTime: "ನಿಗದಿತ ಸಮಯ",
    status: "ಸ್ಥಿತಿ",
    priority: "ಪ್ರಾಧಾನ್ಯತೆ",
    notes: "ಟಿಪ್ಪಣಿಗಳು",
    actions: "ಕ್ರಿಯೆಗಳು",
    startConsultation: "ಸಮಾಲೋಚನೆ ಪ್ರಾರಂಭಿಸಿ",
    viewDetails: "ವಿವರಗಳನ್ನು ನೋಡಿ",
    noTeleconsultations: "ಯಾವುದೇ ಟೆಲಿಕನ್ಸಲ್ಟೇಶನ್ ಕಂಡುಬಂದಿಲ್ಲ.",
    cancel: "ರದ್ದುಮಾಡಿ",
    add: "ಸೇರಿಸಿ",
    confirmed: "ಸ್ಥಿರಪಡಿಸಿದೆ",
    pending: "ಬಕಾಯಿದೆ",
    cancelled: "ರದ್ದುಮಾಡಲಾಗಿದೆ",
    high: "ಉನ್ನತ",
    normal: "ಸಾಮಾನ್ಯ"
  }
};

// Dummy appointments data
const dummyAppointments = [
  {
    id: 1,
    patient_id: 'P001',
    patient_name: 'Ram Kumar',
    doctor_id: 'Dr. Rajesh Kumar',
    doctor_specialty: 'General Medicine',
    scheduled_time: '2024-01-15 10:00 AM',
    status: 'Confirmed',
    notes: 'Regular checkup for diabetes',
    priority: 'Normal'
  },
  {
    id: 2,
    patient_id: 'P002',
    patient_name: 'Sita Devi',
    doctor_id: 'Dr. Priya Sharma',
    doctor_specialty: 'Pediatrics',
    scheduled_time: '2024-01-15 11:30 AM',
    status: 'Pending',
    notes: 'Child vaccination follow-up',
    priority: 'High'
  },
  {
    id: 3,
    patient_id: 'P003',
    patient_name: 'Mohan Singh',
    doctor_id: 'Dr. Amit Singh',
    doctor_specialty: 'Cardiology',
    scheduled_time: '2024-01-15 2:00 PM',
    status: 'Confirmed',
    notes: 'Heart condition monitoring',
    priority: 'High'
  },
  {
    id: 4,
    patient_id: 'P004',
    patient_name: 'Geeta Patel',
    doctor_id: 'Dr. Sunita Patel',
    doctor_specialty: 'Gynecology',
    scheduled_time: '2024-01-15 3:30 PM',
    status: 'Confirmed',
    notes: 'Prenatal checkup',
    priority: 'Normal'
  },
  {
    id: 5,
    patient_id: 'P005',
    patient_name: 'Ravi Sharma',
    doctor_id: 'Dr. Rajesh Kumar',
    doctor_specialty: 'General Medicine',
    scheduled_time: '2024-01-16 9:00 AM',
    status: 'Pending',
    notes: 'Blood pressure consultation',
    priority: 'Normal'
  },
  {
    id: 6,
    patient_id: 'P006',
    patient_name: 'Lakshmi Reddy',
    doctor_id: 'Dr. Priya Sharma',
    doctor_specialty: 'Pediatrics',
    scheduled_time: '2024-01-16 10:30 AM',
    status: 'Cancelled',
    notes: 'Child fever consultation',
    priority: 'High'
  },
  {
    id: 7,
    patient_id: 'P007',
    patient_name: 'Suresh Kumar',
    doctor_id: 'Dr. Amit Singh',
    doctor_specialty: 'Cardiology',
    scheduled_time: '2024-01-16 1:00 PM',
    status: 'Confirmed',
    notes: 'Post-surgery follow-up',
    priority: 'High'
  }
];

export default function TeleconsultationsPage() {
  const [teleconsultations, setTeleconsultations] = useState(dummyAppointments);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    patient_id: '',
    doctor_id: '',
    scheduled_time: '',
    notes: '',
    meet_link: ''
  });
  const [language, setLanguage] = useState('en');
  const [activeTab, setActiveTab] = useState(0);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const t = translations[language];
  
  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  useEffect(() => {
    // For now, we'll use dummy data instead of API calls
    // Uncomment below to fetch from API if backend is available
    /*
    fetch(API_URL)
      .then(res => res.json())
      .then(data => setTeleconsultations(data.teleconsultations || []))
      .catch(err => {
        console.log('API not available, using dummy data');
        setTeleconsultations(dummyAppointments);
      });
    */
    // Using dummy data for now
    setTeleconsultations(dummyAppointments);
  }, []);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleAdd = () => {
    fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    })
      .then(res => res.json())
      .then(data => {
        setTeleconsultations(prev => [...prev, { ...form, id: data.teleconsultation_id }]);
        setOpen(false);
        setForm({
          patient_id: '',
          doctor_id: '',
          scheduled_time: '',
          notes: '',
          meet_link: ''
        });
      });
  };

  const handleDelete = id => {
    fetch(`${API_URL}/${id}`, { method: 'DELETE' })
      .then(() => setTeleconsultations(prev => prev.filter(t => t.id !== id)));
  };

  return (
    <Paper elevation={3} sx={{ p: 4 }}>
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
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={3}>
        <Stack direction="row" alignItems="center" spacing={1}>
          <VideoCallIcon color="primary" sx={{ fontSize: 32 }} />
          <Typography variant="h4" fontWeight={700}>{t.teleconsultations}</Typography>
        </Stack>
        {activeTab === 0 && (
          <Button variant="contained" startIcon={<AddIcon />} onClick={() => setOpen(true)}>
            {t.addTeleconsultation}
          </Button>
        )}
      </Stack>
      
      {/* Tabs to switch between List and Interface */}
      <Tabs 
        value={activeTab} 
        onChange={handleTabChange} 
        sx={{ mb: 3, borderBottom: 1, borderColor: 'divider' }}
      >
        <Tab label="Appointments" />
        <Tab label="Video Consultation" />
      </Tabs>
      {activeTab === 0 ? (
        <TableContainer>
          <Table>
            <TableHead sx={{ background: '#e3f2fd' }}>
              <TableRow>
                <TableCell>{t.patientName}</TableCell>
                <TableCell>{t.doctorId}</TableCell>
                <TableCell>{t.scheduledTime}</TableCell>
                <TableCell>{t.status}</TableCell>
                <TableCell>{t.priority}</TableCell>
                <TableCell>{t.notes}</TableCell>
                <TableCell align="right">{t.actions}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {teleconsultations.map((tc) => (
                <TableRow 
                  key={tc.id}
                  sx={{
                    '&:hover': {
                      backgroundColor: '#f5f5f5',
                      cursor: 'pointer'
                    },
                    backgroundColor: selectedAppointment?.id === tc.id ? '#e3f2fd' : 'inherit'
                  }}
                  onClick={() => setSelectedAppointment(tc)}
                >
                  <TableCell>
                    <Stack>
                      <Typography fontWeight="bold">{tc.patient_name}</Typography>
                      <Typography variant="caption" color="text.secondary">{tc.patient_id}</Typography>
                    </Stack>
                  </TableCell>
                  <TableCell>
                    <Stack>
                      <Typography fontWeight="bold">{tc.doctor_id}</Typography>
                      <Typography variant="caption" color="text.secondary">{tc.doctor_specialty}</Typography>
                    </Stack>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">{tc.scheduled_time}</Typography>
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={tc.status && t[tc.status.toLowerCase()] ? t[tc.status.toLowerCase()] : (tc.status || 'Unknown')}
                      color={
                        tc.status === 'Confirmed' ? 'success' :
                        tc.status === 'Pending' ? 'warning' :
                        tc.status === 'Cancelled' ? 'error' : 'default'
                      }
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={tc.priority && t[tc.priority.toLowerCase()] ? t[tc.priority.toLowerCase()] : (tc.priority || 'Normal')}
                      color={tc.priority === 'High' ? 'error' : 'default'}
                      variant="outlined"
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" sx={{ maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {tc.notes}
                    </Typography>
                  </TableCell>
                  <TableCell align="right">
                    <Stack direction="row" spacing={1}>
                      {(tc.status === 'Confirmed' || tc.status === 'confirmed') && (
                        <Button
                          size="small"
                          variant="contained"
                          color="primary"
                          startIcon={<VideoCallIcon />}
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveTab(1); // Switch to teleconsultation interface
                          }}
                        >
                          {t.startConsultation}
                        </Button>
                      )}
                      <IconButton 
                        color="error" 
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(tc.id);
                        }}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))}
              {teleconsultations.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ color: '#888' }}>
                    {t.noTeleconsultations}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <Box sx={{ mt: -3, mx: -4 }}>
          <TeleconsultationInterface />
        </Box>
      )}

      {/* Add Teleconsultation Dialog */}
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>{t.addTeleconsultation}</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField label={t.patientId} name="patient_id" value={form.patient_id} onChange={handleChange} fullWidth />
            <TextField label={t.doctorId} name="doctor_id" value={form.doctor_id} onChange={handleChange} fullWidth />
            <TextField label={t.scheduledTime} name="scheduled_time" value={form.scheduled_time} onChange={handleChange} type="datetime-local" InputLabelProps={{ shrink: true }} fullWidth />
            <TextField label={t.notes} name="notes" value={form.notes} onChange={handleChange} fullWidth multiline minRows={2} />
            <TextField label={t.meetLink} name="meet_link" value={form.meet_link} onChange={handleChange} fullWidth placeholder={t.meetLink} />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>{t.cancel}</Button>
          <Button variant="contained" onClick={handleAdd}>{t.add}</Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
}