import { useEffect, useState } from 'react';
import {
  Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Stack, IconButton, Select, MenuItem, Box
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';

const API_URL = 'http://127.0.0.1:5000/medicine-swaps';

// Simple translations for demonstration
const translations = {
  en: {
    medicineSwaps: "Medicine Swaps",
    addSwap: "Add Swap",
    patientId: "Patient ID",
    oldMedicineId: "Old Medicine ID",
    newMedicineId: "New Medicine ID",
    status: "Status",
    swappedAt: "Swapped At",
    actions: "Actions",
    noSwaps: "No swaps found.",
    addMedicineSwap: "Add Medicine Swap",
    cancel: "Cancel",
    add: "Add"
  },
  hi: {
    medicineSwaps: "दवा अदला-बदली",
    addSwap: "अदला-बदली जोड़ें",
    patientId: "मरीज आईडी",
    oldMedicineId: "पुरानी दवा आईडी",
    newMedicineId: "नई दवा आईडी",
    status: "स्थिति",
    swappedAt: "अदला-बदली समय",
    actions: "क्रियाएँ",
    noSwaps: "कोई अदला-बदली नहीं मिली।",
    addMedicineSwap: "दवा अदला-बदली जोड़ें",
    cancel: "रद्द करें",
    add: "जोड़ें"
  },
  pa: {
    medicineSwaps: "ਦਵਾਈ ਬਦਲਣਾ",
    addSwap: "ਬਦਲਣਾ ਸ਼ਾਮਲ ਕਰੋ",
    patientId: "ਮਰੀਜ਼ ਆਈਡੀ",
    oldMedicineId: "ਪੁਰਾਣੀ ਦਵਾਈ ਆਈਡੀ",
    newMedicineId: "ਨਵੀਂ ਦਵਾਈ ਆਈਡੀ",
    status: "ਸਥਿਤੀ",
    swappedAt: "ਬਦਲਣਾ ਦਾ ਸਮਾਂ",
    actions: "ਕਾਰਵਾਈਆਂ",
    noSwaps: "ਕੋਈ ਬਦਲਣਾ ਨਹੀਂ ਮਿਲੀਆਂ।",
    addMedicineSwap: "ਦਵਾਈ ਬਦਲਣਾ ਸ਼ਾਮਲ ਕਰੋ",
    cancel: "ਰਦ੍ਦ ਕਰੋ",
    add: "ਸ਼ਾਮਲ ਕਰੋ"
  }
};

export default function MedicineSwapsPage() {
  const [swaps, setSwaps] = useState([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ patient_id: '', old_medicine_id: '', new_medicine_id: '', status: '', swapped_at: '' });
  const [language, setLanguage] = useState('en');
  const t = translations[language];

  useEffect(() => {
    fetch(API_URL)
      .then(res => res.json())
      .then(data => setSwaps(data.medicine_swaps || []));
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
        setSwaps(prev => [...prev, { ...form, id: data.medicine_swap_id }]);
        setOpen(false);
        setForm({ patient_id: '', old_medicine_id: '', new_medicine_id: '', status: '', swapped_at: '' });
      });
  };

  const handleDelete = id => {
    fetch(`${API_URL}/${id}`, { method: 'DELETE' })
      .then(() => setSwaps(prev => prev.filter(s => s.id !== id)));
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
          <MenuItem value="pa">ਪੰਜਾਬੀ</MenuItem>
        </Select>
      </Box>
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={3}>
        <Stack direction="row" alignItems="center" spacing={1}>
          <SwapHorizIcon color="info" sx={{ fontSize: 32 }} />
          <Typography variant="h4" fontWeight={700}>{t.medicineSwaps}</Typography>
        </Stack>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => setOpen(true)}>
          {t.addSwap}
        </Button>
      </Stack>
      <TableContainer>
        <Table>
          <TableHead sx={{ background: '#e3f2fd' }}>
            <TableRow>
              <TableCell>{t.patientId}</TableCell>
              <TableCell>{t.oldMedicineId}</TableCell>
              <TableCell>{t.newMedicineId}</TableCell>
              <TableCell>{t.status}</TableCell>
              <TableCell>{t.swappedAt}</TableCell>
              <TableCell align="right">{t.actions}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {swaps.map((s) => (
              <TableRow key={s.id}>
                <TableCell>{s.patient_id}</TableCell>
                <TableCell>{s.old_medicine_id}</TableCell>
                <TableCell>{s.new_medicine_id}</TableCell>
                <TableCell>{s.status}</TableCell>
                <TableCell>{s.swapped_at}</TableCell>
                <TableCell align="right">
                  <IconButton color="error" onClick={() => handleDelete(s.id)}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
            {swaps.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} align="center" sx={{ color: '#888' }}>
                  {t.noSwaps}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Add Swap Dialog */}
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>{t.addMedicineSwap}</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField label={t.patientId} name="patient_id" value={form.patient_id} onChange={handleChange} fullWidth />
            <TextField label={t.oldMedicineId} name="old_medicine_id" value={form.old_medicine_id} onChange={handleChange} fullWidth />
            <TextField label={t.newMedicineId} name="new_medicine_id" value={form.new_medicine_id} onChange={handleChange} fullWidth />
            <TextField label={t.status} name="status" value={form.status} onChange={handleChange} fullWidth />
            <TextField label={t.swappedAt} name="swapped_at" value={form.swapped_at} onChange={handleChange} type="datetime-local" InputLabelProps={{ shrink: true }} fullWidth />
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