import { useEffect, useState } from 'react';
import {
  Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Stack, IconButton, Select, MenuItem, Box
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import PersonIcon from '@mui/icons-material/Person';

const API_URL = 'http://127.0.0.1:5000/patients';

// Simple translations for demonstration
const translations = {
  en: {
    patients: "Patients",
    addPatient: "Add Patient",
    name: "Name",
    age: "Age",
    gender: "Gender",
    address: "Address",
    actions: "Actions",
    noPatients: "No patients found.",
    addNewPatient: "Add New Patient",
    cancel: "Cancel",
    add: "Add"
  },
  hi: {
    patients: "मरीज",
    addPatient: "मरीज जोड़ें",
    name: "नाम",
    age: "आयु",
    gender: "लिंग",
    address: "पता",
    actions: "क्रियाएँ",
    noPatients: "कोई मरीज नहीं मिला।",
    addNewPatient: "नया मरीज जोड़ें",
    cancel: "रद्द करें",
    add: "जोड़ें"
  },
  kn: {
    patients: "ರೋಗಿಗಳು",
    addPatient: "ರೋಗಿ ಸೇರಿಸಿ",
    name: "ಹೆಸರು",
    age: "ವಯಸ್ಸು",
    gender: "ಲಿಂಗ",
    address: "ವಿಳಾಸ",
    actions: "ಕ್ರಿಯೆಗಳು",
    noPatients: "ಯಾವುದೇ ರೋಗಿಗಳು ಕಂಡುಬಂದಿಲ್ಲ.",
    addNewPatient: "ಹೊಸ ರೋಗಿ ಸೇರಿಸಿ",
    cancel: "ರದ್ದುಮಾಡಿ",
    add: "ಸೇರಿಸಿ"
  }
};

export default function PatientsPage() {
  const [patients, setPatients] = useState([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: '', age: '', gender: '', address: '' });
  const [language, setLanguage] = useState('en');
  const t = translations[language];

  // Fetch patients from backend
  useEffect(() => {
    fetch(API_URL)
      .then(res => res.json())
      .then(data => setPatients(data.patients || []));
  }, []);

  // Handle form input
  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  // Add patient
  const handleAdd = () => {
    fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    })
      .then(res => res.json())
      .then(data => {
        setPatients(prev => [...prev, { ...form, id: data.patient_id }]);
        setOpen(false);
        setForm({ name: '', age: '', gender: '', address: '' });
      });
  };

  // Delete patient
  const handleDelete = id => {
    fetch(`${API_URL}/${id}`, { method: 'DELETE' })
      .then(() => setPatients(prev => prev.filter(p => p.id !== id)));
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
          <PersonIcon color="primary" sx={{ fontSize: 32 }} />
          <Typography variant="h4" fontWeight={700}>{t.patients}</Typography>
        </Stack>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => setOpen(true)}>
          {t.addPatient}
        </Button>
      </Stack>
      <TableContainer>
        <Table>
          <TableHead sx={{ background: '#e3f2fd' }}>
            <TableRow>
              <TableCell>{t.name}</TableCell>
              <TableCell>{t.age}</TableCell>
              <TableCell>{t.gender}</TableCell>
              <TableCell>{t.address}</TableCell>
              <TableCell align="right">{t.actions}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {patients.map((p) => (
              <TableRow key={p.id}>
                <TableCell>{p.name}</TableCell>
                <TableCell>{p.age}</TableCell>
                <TableCell>{p.gender}</TableCell>
                <TableCell>{p.address}</TableCell>
                <TableCell align="right">
                  <IconButton color="error" onClick={() => handleDelete(p.id)}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
            {patients.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} align="center" sx={{ color: '#888' }}>
                  {t.noPatients}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Add Patient Dialog */}
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>{t.addNewPatient}</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField label={t.name} name="name" value={form.name} onChange={handleChange} fullWidth />
            <TextField label={t.age} name="age" value={form.age} onChange={handleChange} type="number" fullWidth />
            <TextField label={t.gender} name="gender" value={form.gender} onChange={handleChange} fullWidth />
            <TextField label={t.address} name="address" value={form.address} onChange={handleChange} fullWidth />
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