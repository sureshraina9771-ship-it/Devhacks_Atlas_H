import React, { useEffect, useState } from 'react';
import {
  Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Stack, IconButton, Select, MenuItem, Box
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import VideoCallIcon from '@mui/icons-material/VideoCall';

const API_URL = 'http://127.0.0.1:5000/teleconsultations';

// Simple translations for demonstration
const translations = {
  en: {
    teleconsultations: "Teleconsultations",
    addTeleconsultation: "Add Teleconsultation",
    patientId: "Patient ID",
    doctorId: "Doctor ID",
    scheduledTime: "Scheduled Time",
    notes: "Notes",
    meetLink: "Google Meet Link",
    videoCall: "Video Call",
    noLink: "No link",
    actions: "Actions",
    noTeleconsultations: "No teleconsultations found.",
    cancel: "Cancel",
    add: "Add"
  },
  hi: {
    teleconsultations: "टेलीपरामर्श",
    addTeleconsultation: "टेलीपरामर्श जोड़ें",
    patientId: "मरीज आईडी",
    doctorId: "डॉक्टर आईडी",
    scheduledTime: "निर्धारित समय",
    notes: "नोट्स",
    meetLink: "गूगल मीट लिंक",
    videoCall: "वीडियो कॉल",
    noLink: "कोई लिंक नहीं",
    actions: "क्रियाएँ",
    noTeleconsultations: "कोई टेलीपरामर्श नहीं मिला।",
    cancel: "रद्द करें",
    add: "जोड़ें"
  },
  kn: {
    teleconsultations: "ಟೆಲಿಕನ್ಸಲ್ಟೇಶನ್‌ಗಳು",
    addTeleconsultation: "ಟೆಲಿಕನ್ಸಲ್ಟೇಶನ್ ಸೇರಿಸಿ",
    patientId: "ರೋಗಿಯ ಐಡಿ",
    doctorId: "ಡಾಕ್ಟರ್ ಐಡಿ",
    scheduledTime: "ನಿಗದಿತ ಸಮಯ",
    notes: "ಟಿಪ್ಪಣಿಗಳು",
    meetLink: "ಗೂಗಲ್ ಮೀಟ್ ಲಿಂಕ್",
    videoCall: "ವೀಡಿಯೋ ಕರೆ",
    noLink: "ಲಿಂಕ್ ಇಲ್ಲ",
    actions: "ಕ್ರಿಯೆಗಳು",
    noTeleconsultations: "ಯಾವುದೇ ಟೆಲಿಕನ್ಸಲ್ಟೇಶನ್ ಕಂಡುಬಂದಿಲ್ಲ.",
    cancel: "ರದ್ದುಮಾಡಿ",
    add: "ಸೇರಿಸಿ"
  }
};

export default function TeleconsultationsPage() {
  const [teleconsultations, setTeleconsultations] = useState([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    patient_id: '',
    doctor_id: '',
    scheduled_time: '',
    notes: '',
    meet_link: ''
  });
  const [language, setLanguage] = useState('en');
  const t = translations[language];

  useEffect(() => {
    fetch(API_URL)
      .then(res => res.json())
      .then(data => setTeleconsultations(data.teleconsultations || []));
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
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => setOpen(true)}>
          {t.addTeleconsultation}
        </Button>
      </Stack>
      <TableContainer>
        <Table>
          <TableHead sx={{ background: '#e3f2fd' }}>
            <TableRow>
              <TableCell>{t.patientId}</TableCell>
              <TableCell>{t.doctorId}</TableCell>
              <TableCell>{t.scheduledTime}</TableCell>
              <TableCell>{t.notes}</TableCell>
              <TableCell>{t.videoCall}</TableCell>
              <TableCell align="right">{t.actions}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {teleconsultations.map((tc) => (
              <TableRow key={tc.id}>
                <TableCell>{tc.patient_id}</TableCell>
                <TableCell>{tc.doctor_id}</TableCell>
                <TableCell>{tc.scheduled_time}</TableCell>
                <TableCell>{tc.notes}</TableCell>
                <TableCell>
                  {tc.meet_link ? (
                    <Button
                      variant="contained"
                      color="success"
                      href={tc.meet_link}
                      target="_blank"
                      startIcon={<VideoCallIcon />}
                      sx={{ minWidth: 120 }}
                    >
                      {t.videoCall}
                    </Button>
                  ) : (
                    <Typography color="text.secondary" fontSize={13}>{t.noLink}</Typography>
                  )}
                </TableCell>
                <TableCell align="right">
                  <IconButton color="error" onClick={() => handleDelete(tc.id)}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
            {teleconsultations.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} align="center" sx={{ color: '#888' }}>
                  {t.noTeleconsultations}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

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