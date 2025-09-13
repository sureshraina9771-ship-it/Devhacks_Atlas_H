import { useEffect, useState } from 'react';
import {
  Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Stack, IconButton, Select, MenuItem, Box
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import MedicalServicesIcon from '@mui/icons-material/MedicalServices';

const API_URL = 'http://127.0.0.1:5000/medicines';

// Simple translations for demonstration
const translations = {
  en: {
    medicines: "Medicines",
    addMedicine: "Add Medicine",
    name: "Name",
    batchNumber: "Batch Number",
    expiryDate: "Expiry Date",
  quantity: "Quantity",
    actions: "Actions",
    noMedicines: "No medicines found.",
    addNewMedicine: "Add New Medicine",
    cancel: "Cancel",
    add: "Add"
  },
  hi: {
    medicines: "दवाइयाँ",
    addMedicine: "दवा जोड़ें",
    name: "नाम",
    batchNumber: "बैच नंबर",
    expiryDate: "समाप्ति तिथि",
  quantity: "मात्रा",
    actions: "क्रियाएँ",
    noMedicines: "कोई दवाइयाँ नहीं मिलीं।",
    addNewMedicine: "नई दवा जोड़ें",
    cancel: "रद्द करें",
    add: "जोड़ें"
  },
  kn: {
    medicines: "ಔಷಧಿಗಳು",
    addMedicine: "ಔಷಧಿ ಸೇರಿಸಿ",
    name: "ಹೆಸರು",
    batchNumber: "ಬ್ಯಾಚ್ ಸಂಖ್ಯೆ",
    expiryDate: "ಅವಧಿ ಮುಗಿಯುವ ದಿನಾಂಕ",
  quantity: "ಪ್ರಮಾಣ",
    actions: "ಕ್ರಿಯೆಗಳು",
    noMedicines: "ಯಾವುದೇ ಔಷಧಿಗಳು ಕಂಡುಬಂದಿಲ್ಲ.",
    addNewMedicine: "ಹೊಸ ಔಷಧಿ ಸೇರಿಸಿ",
    cancel: "ರದ್ದುಮಾಡಿ",
    add: "ಸೇರಿಸಿ"
  }
};

export default function MedicinesPage() {
  const [medicines, setMedicines] = useState([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: '', batch_number: '', expiry_date: '', quantity: '' });
  const [language, setLanguage] = useState('en');
  const t = translations[language];

  useEffect(() => {
    fetch(API_URL)
      .then(res => res.json())
      .then(data => setMedicines(data.medicines || []));
  }, []);

  const handleChange = e => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === 'checkbox' ? checked : value });
  };

  const handleAdd = () => {
    fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    })
      .then(res => res.json())
      .then(data => {
        setMedicines(prev => [...prev, { ...form, id: data.medicine_id }]);
        setOpen(false);
        setForm({ name: '', batch_number: '', expiry_date: '', is_fraudulent: false });
      });
  };

  const handleDelete = id => {
    fetch(`${API_URL}/${id}`, { method: 'DELETE' })
      .then(() => setMedicines(prev => prev.filter(m => m.id !== id)));
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
          <MedicalServicesIcon color="success" sx={{ fontSize: 32 }} />
          <Typography variant="h4" fontWeight={700}>{t.medicines}</Typography>
        </Stack>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => setOpen(true)}>
          {t.addMedicine}
        </Button>
      </Stack>
      <TableContainer>
        <Table>
          <TableHead sx={{ background: '#e8f5e9' }}>
            <TableRow>
              <TableCell>{t.name}</TableCell>
              <TableCell>{t.batchNumber}</TableCell>
              <TableCell>{t.expiryDate}</TableCell>
              <TableCell>{t.quantity}</TableCell>
              <TableCell align="right">{t.actions}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {medicines.map((m) => (
              <TableRow key={m.id}>
                <TableCell>{m.name}</TableCell>
                <TableCell>{m.batch_number}</TableCell>
                <TableCell>{m.expiry_date}</TableCell>
                <TableCell>{m.quantity}</TableCell>
                <TableCell align="right">
                  <IconButton color="error" onClick={() => handleDelete(m.id)}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
            {medicines.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} align="center" sx={{ color: '#888' }}>
                  {t.noMedicines}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Add Medicine Dialog */}
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>{t.addNewMedicine}</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField label={t.name} name="name" value={form.name} onChange={handleChange} fullWidth />
            <TextField label={t.batchNumber} name="batch_number" value={form.batch_number} onChange={handleChange} fullWidth />
            <TextField label={t.expiryDate} name="expiry_date" value={form.expiry_date} onChange={handleChange} type="date" InputLabelProps={{ shrink: true }} fullWidth />
            <TextField label={t.quantity} name="quantity" value={form.quantity} onChange={handleChange} type="number" fullWidth />
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