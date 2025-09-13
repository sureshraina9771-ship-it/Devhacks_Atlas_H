import { useEffect, useState } from 'react';
import {
  Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Stack, IconButton, Select, MenuItem, Box
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import PersonIcon from '@mui/icons-material/Person';
import Keyboard from 'react-simple-keyboard';
import 'react-simple-keyboard/build/css/index.css';

const API_URL = 'http://127.0.0.1:5000/doctors';

// Simple translations for demonstration
const translations = {
  en: {
    doctors: "Doctors",
    addDoctor: "Add Doctor",
    name: "Name",
    specialization: "Specialization",
    contact: "Contact",
    actions: "Actions",
    noDoctors: "No doctors found.",
    addNewDoctor: "Add New Doctor",
    cancel: "Cancel",
    add: "Add"
  },
  hi: {
    doctors: "डॉक्टर",
    addDoctor: "डॉक्टर जोड़ें",
    name: "नाम",
    specialization: "विशेषज्ञता",
    contact: "संपर्क",
    actions: "क्रियाएँ",
    noDoctors: "कोई डॉक्टर नहीं मिला।",
    addNewDoctor: "नया डॉक्टर जोड़ें",
    cancel: "रद्द करें",
    add: "जोड़ें"
  },
  kn: {
    doctors: "ಡಾಕ್ಟರ್‌ಗಳು",
    addDoctor: "ಡಾಕ್ಟರ್ ಸೇರಿಸಿ",
    name: "ಹೆಸರು",
    specialization: "ವಿಶೇಷತೆ",
    contact: "ಸಂಪರ್ಕ",
    actions: "ಕ್ರಿಯೆಗಳು",
    noDoctors: "ಯಾವುದೇ ಡಾಕ್ಟರ್ ಕಂಡುಬಂದಿಲ್ಲ.",
    addNewDoctor: "ಹೊಸ ಡಾಕ್ಟರ್ ಸೇರಿಸಿ",
    cancel: "ರದ್ದುಮಾಡಿ",
    add: "ಸೇರಿಸಿ"
  }
};

export default function DoctorsPage() {
  const [doctors, setDoctors] = useState([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: '', specialization: '', contact: '' });
  const [language, setLanguage] = useState('en');
  const [keyboardInput, setKeyboardInput] = useState('');
  const t = translations[language];

  useEffect(() => {
    fetch(API_URL)
      .then(res => res.json())
      .then(data => setDoctors(data.doctors || []));
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
        setDoctors(prev => [...prev, { ...form, id: data.doctor_id }]);
        setOpen(false);
        setForm({ name: '', specialization: '', contact: '' });
      });
  };

  const handleDelete = id => {
    fetch(`${API_URL}/${id}`, { method: 'DELETE' })
      .then(() => setDoctors(prev => prev.filter(d => d.id !== id)));
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
          <PersonIcon color="secondary" sx={{ fontSize: 32 }} />
          <Typography variant="h4" fontWeight={700}>{t.doctors}</Typography>
        </Stack>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => setOpen(true)}>
          {t.addDoctor}
        </Button>
      </Stack>
      <TableContainer>
        <Table>
          <TableHead sx={{ background: '#f3e5f5' }}>
            <TableRow>
              <TableCell>{t.name}</TableCell>
              <TableCell>{t.specialization}</TableCell>
              <TableCell>{t.contact}</TableCell>
              <TableCell align="right">{t.actions}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {doctors.map((d) => (
              <TableRow key={d.id}>
                <TableCell>{d.name}</TableCell>
                <TableCell>{d.specialization}</TableCell>
                <TableCell>{d.contact}</TableCell>
                <TableCell align="right">
                  <IconButton color="error" onClick={() => handleDelete(d.id)}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
            {doctors.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} align="center" sx={{ color: '#888' }}>
                  {t.noDoctors}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Add Doctor Dialog */}
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>{t.addNewDoctor}</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField label={t.name} name="name" value={form.name} onChange={handleChange} fullWidth />
            <TextField label={t.specialization} name="specialization" value={form.specialization} onChange={handleChange} fullWidth />
            <TextField label={t.contact} name="contact" value={form.contact} onChange={handleChange} fullWidth />
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