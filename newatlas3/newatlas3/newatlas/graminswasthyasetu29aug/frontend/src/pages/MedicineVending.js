import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  InputAdornment,
  Grid,
  Card,
  CardContent,
  Chip,
  Button,
  Stack,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider,
  Badge,
  IconButton
} from '@mui/material';
import {
  Search as SearchIcon,
  MedicalServices as MedicalServicesIcon,
  ShoppingCart as ShoppingCartIcon,
  Payment as PaymentIcon,
  CreditCard as CreditCardIcon,
  AccountBalanceWallet as WalletIcon,
  Stars as CreditsIcon,
  Add as AddIcon,
  Remove as RemoveIcon
} from '@mui/icons-material';

// Translations
const translations = {
  en: {
    medicineVending: 'Medicine Vending',
    searchMedicines: 'Search medicines...',
    available: 'Available',
    outOfStock: 'Out of Stock',
    payment: 'Payment',
    buyMedicine: 'Buy Medicine',
    addToCart: 'Add to Cart',
    cart: 'Cart',
    total: 'Total',
    upi: 'UPI',
    card: 'Card',
    wallet: 'Wallet',
    credits: 'Credits',
    checkout: 'Checkout',
    quantity: 'Quantity',
    price: 'Price',
    rupees: '₹'
  },
  hi: {
    medicineVending: 'दवा वेंडिंग',
    searchMedicines: 'दवाइयाँ खोजें...',
    available: 'उपलब्ध',
    outOfStock: 'स्टॉक समाप्त',
    payment: 'भुगतान',
    buyMedicine: 'दवा खरीदें',
    addToCart: 'कार्ट में जोड़ें',
    cart: 'कार्ट',
    total: 'कुल',
    upi: 'UPI',
    card: 'कार्ड',
    wallet: 'वॉलेट',
    credits: 'क्रेडिट्स',
    checkout: 'चेकआउट',
    quantity: 'मात्रा',
    price: 'मूल्य',
    rupees: '₹'
  },
  kn: {
    medicineVending: 'ಔಷಧಿ ವೆಂಡಿಂಗ್',
    searchMedicines: 'ಔಷಧಿಗಳನ್ನು ಹುಡುಕಿ...',
    available: 'ಲಭ್ಯ',
    outOfStock: 'ಸ್ಟಾಕ್ ಮುಗಿದಿದೆ',
    payment: 'ಪಾವತಿ',
    buyMedicine: 'ಔಷಧಿ ಖರೀದಿಸಿ',
    addToCart: 'ಕಾರ್ಟ್‌ಗೆ ಸೇರಿಸಿ',
    cart: 'ಕಾರ್ಟ್',
    total: 'ಒಟ್ಟು',
    upi: 'UPI',
    card: 'ಕಾರ್ಡ್',
    wallet: 'ವಾಲೆಟ್',
    credits: 'ಕ್ರೆಡಿಟ್ಸ್',
    checkout: 'ಚೆಕ್‌ಔಟ್',
    quantity: 'ಪ್ರಮಾಣ',
    price: 'ಬೆಲೆ',
    rupees: '₹'
  }
};

// Medicine data with 30 medicines (10 out of stock)
const medicinesData = [
  { id: 1, name: 'Paracetamol', hindiName: 'पेरासिटामोल', kannadaName: 'ಪ್ಯಾರಸಿಟಮಾಲ್', price: 25, available: true, category: 'Pain Relief' },
  { id: 2, name: 'Amoxicillin', hindiName: 'अमोक्सिसिलिन', kannadaName: 'ಅಮಾಕ್ಸಿಸಿಲಿನ್', price: 85, available: true, category: 'Antibiotic' },
  { id: 3, name: 'Metformin', hindiName: 'मेटफॉर्मिन', kannadaName: 'ಮೆಟ್‌ಫಾರ್ಮಿನ್', price: 45, available: true, category: 'Diabetes' },
  { id: 4, name: 'Aspirin', hindiName: 'एस्पिरिन', kannadaName: 'ಆಸ್ಪಿರಿನ್', price: 30, available: false, category: 'Pain Relief' },
  { id: 5, name: 'Ibuprofen', hindiName: 'इबुप्रोफेन', kannadaName: 'ಇಬುಪ್ರೋಫೆನ್', price: 55, available: true, category: 'Pain Relief' },
  { id: 6, name: 'Ciprofloxacin', hindiName: 'सिप्रोफ्लोक्सासिन', kannadaName: 'ಸಿಪ್ರೋಫ್ಲಾಕ್ಸಸಿನ್', price: 120, available: false, category: 'Antibiotic' },
  { id: 7, name: 'Omeprazole', hindiName: 'ओमेप्राज़ोल', kannadaName: 'ಒಮೆಪ್ರಜೋಲ್', price: 75, available: true, category: 'Gastric' },
  { id: 8, name: 'Losartan', hindiName: 'लोसार्टन', kannadaName: 'ಲೋಸಾರ್ಟನ್', price: 90, available: true, category: 'Blood Pressure' },
  { id: 9, name: 'Atorvastatin', hindiName: 'एटोर्वास्टेटिन', kannadaName: 'ಅಟೋರ್ವಾಸ್ಟಾಟಿನ್', price: 110, available: false, category: 'Cholesterol' },
  { id: 10, name: 'Cetirizine', hindiName: 'सेटिरिज़ाइन', kannadaName: 'ಸೆಟಿರಿಜೈನ್', price: 35, available: true, category: 'Allergy' },
  { id: 11, name: 'Doxycycline', hindiName: 'डॉक्सीसाइक्लिन', kannadaName: 'ಡಾಕ್ಸಿಸೈಕ್ಲಿನ್', price: 95, available: true, category: 'Antibiotic' },
  { id: 12, name: 'Pantoprazole', hindiName: 'पैंटोप्राजोल', kannadaName: 'ಪ್ಯಾಂಟೋಪ್ರಜೋಲ್', price: 65, available: false, category: 'Gastric' },
  { id: 13, name: 'Amlodipine', hindiName: 'अम्लोडिपाइन', kannadaName: 'ಅಮ್ಲೋಡಿಪಿನ್', price: 40, available: true, category: 'Blood Pressure' },
  { id: 14, name: 'Insulin', hindiName: 'इंसुलिन', kannadaName: 'ಇನ್ಸುಲಿನ್', price: 250, available: false, category: 'Diabetes' },
  { id: 15, name: 'Ranitidine', hindiName: 'रैनिटिडाइन', kannadaName: 'ರಾನಿಟಿಡೈನ್', price: 50, available: true, category: 'Gastric' },
  { id: 16, name: 'Warfarin', hindiName: 'वारफरिन', kannadaName: 'ವಾರ್ಫರಿನ್', price: 80, available: false, category: 'Blood Thinner' },
  { id: 17, name: 'Prednisolone', hindiName: 'प्रेडनिसोलोन', kannadaName: 'ಪ್ರೆಡ್ನಿಸೋಲೋನ್', price: 60, available: true, category: 'Steroid' },
  { id: 18, name: 'Salbutamol', hindiName: 'साल्ब्यूटामोल', kannadaName: 'ಸಾಲ್ಬುಟಮಾಲ್', price: 70, available: true, category: 'Respiratory' },
  { id: 19, name: 'Diclofenac', hindiName: 'डिक्लोफेनाक', kannadaName: 'ಡಿಕ್ಲೋಫೆನಾಕ್', price: 45, available: false, category: 'Pain Relief' },
  { id: 20, name: 'Fluconazole', hindiName: 'फ्लुकोनाज़ोल', kannadaName: 'ಫ್ಲುಕೊನಜೋಲ್', price: 85, available: true, category: 'Antifungal' },
  { id: 21, name: 'Montelukast', hindiName: 'मॉन्टेल्युकास्ट', kannadaName: 'ಮಾಂಟೆಲುಕಾಸ್ಟ್', price: 125, available: true, category: 'Respiratory' },
  { id: 22, name: 'Levothyroxine', hindiName: 'लेवोथायरोक्साइन', kannadaName: 'ಲೆವೋಥೈರಾಕ್ಸಿನ್', price: 55, available: false, category: 'Thyroid' },
  { id: 23, name: 'Clopidogrel', hindiName: 'क्लोपिडोग्रेल', kannadaName: 'ಕ್ಲೋಪಿಡೋಗ್ರೆಲ್', price: 150, available: true, category: 'Blood Thinner' },
  { id: 24, name: 'Azithromycin', hindiName: 'अज़ाइथ्रोमाइसिन', kannadaName: 'ಅಜಿಥ್ರೋಮೈಸಿನ್', price: 105, available: true, category: 'Antibiotic' },
  { id: 25, name: 'Furosemide', hindiName: 'फ्यूरोसेमाइड', kannadaName: 'ಫ್ಯೂರೋಸೆಮೈಡ್', price: 35, available: false, category: 'Diuretic' },
  { id: 26, name: 'Gabapentin', hindiName: 'गैबापेंटिन', kannadaName: 'ಗ್ಯಾಬಪೆಂಟಿನ್', price: 95, available: true, category: 'Neurological' },
  { id: 27, name: 'Hydrochlorothiazide', hindiName: 'हाइड्रोक्लोरोथायज़ाइड', kannadaName: 'ಹೈಡ್ರೋಕ್ಲೋರೋಥೈಜೈಡ್', price: 40, available: true, category: 'Blood Pressure' },
  { id: 28, name: 'Tramadol', hindiName: 'ट्रामाडोल', kannadaName: 'ಟ್ರಾಮಾಡೋಲ್', price: 75, available: false, category: 'Pain Relief' },
  { id: 29, name: 'Sertraline', hindiName: 'सर्ट्रालाइन', kannadaName: 'ಸೆರ್ಟ್ರಾಲಿನ್', price: 120, available: true, category: 'Antidepressant' },
  { id: 30, name: 'Clonazepam', hindiName: 'क्लोनाज़ेपाम', kannadaName: 'ಕ್ಲೋನಾಜೆಪಾಮ್', price: 65, available: true, category: 'Anxiety' }
];

const MedicineVending = () => {
  const [language, setLanguage] = useState('hi');
  const [searchQuery, setSearchQuery] = useState('');
  const [cart, setCart] = useState([]);
  const [selectedPayment, setSelectedPayment] = useState('upi');
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [filteredMedicines, setFilteredMedicines] = useState(medicinesData);

  const t = translations[language];

  useEffect(() => {
    const filtered = medicinesData.filter(medicine => {
      const searchLower = searchQuery.toLowerCase();
      return (
        medicine.name.toLowerCase().includes(searchLower) ||
        medicine.hindiName.includes(searchQuery) ||
        medicine.kannadaName.includes(searchQuery) ||
        medicine.category.toLowerCase().includes(searchLower)
      );
    });
    setFilteredMedicines(filtered);
  }, [searchQuery]);

  const addToCart = (medicine) => {
    if (!medicine.available) return;
    
    const existingItem = cart.find(item => item.id === medicine.id);
    if (existingItem) {
      setCart(cart.map(item =>
        item.id === medicine.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setCart([...cart, { ...medicine, quantity: 1 }]);
    }
  };

  const updateQuantity = (id, change) => {
    setCart(cart.map(item => {
      if (item.id === id) {
        const newQuantity = item.quantity + change;
        return newQuantity <= 0 ? null : { ...item, quantity: newQuantity };
      }
      return item;
    }).filter(Boolean));
  };

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getMedicineName = (medicine) => {
    switch (language) {
      case 'hi': return medicine.hindiName;
      case 'kn': return medicine.kannadaName;
      default: return medicine.name;
    }
  };

  const handleCheckout = () => {
    setCheckoutOpen(false);
    setCart([]);
    // Here you would integrate with actual payment processing
    alert(`Payment of ₹${getTotalPrice()} processed via ${selectedPayment.toUpperCase()}`);
  };

  return (
    <Box sx={{ 
      minHeight: '100vh', 
      backgroundColor: '#f5f5f5', 
      p: 2 
    }}>
      {/* Header */}
      <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={2}>
          <Stack direction="row" alignItems="center" spacing={2}>
            <MedicalServicesIcon sx={{ fontSize: 40, color: '#2e7d32' }} />
            <Typography variant="h4" fontWeight="bold" color="primary">
              {t.medicineVending} • Medicine Vending
            </Typography>
          </Stack>
          <Stack direction="row" alignItems="center" spacing={2}>
            <Select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              size="small"
              sx={{ minWidth: 120 }}
            >
              <MenuItem value="en">English</MenuItem>
              <MenuItem value="hi">हिन्दी</MenuItem>
              <MenuItem value="kn">ಕನ್ನಡ</MenuItem>
            </Select>
            <Badge badgeContent={cart.length} color="error">
              <IconButton 
                color="primary" 
                onClick={() => setCheckoutOpen(true)}
                disabled={cart.length === 0}
              >
                <ShoppingCartIcon />
              </IconButton>
            </Badge>
          </Stack>
        </Stack>

        {/* Search Bar */}
        <TextField
          fullWidth
          placeholder={t.searchMedicines}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon color="action" />
              </InputAdornment>
            ),
          }}
          sx={{ mb: 2 }}
        />
      </Paper>

      {/* Medicine Grid */}
      <Grid container spacing={3}>
        {filteredMedicines.map((medicine) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={medicine.id}>
            <Card 
              elevation={3}
              sx={{ 
                height: '100%',
                border: medicine.available ? '2px solid #e0e0e0' : '2px solid #ffcdd2',
                opacity: medicine.available ? 1 : 0.7,
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: medicine.available ? 'translateY(-4px)' : 'none',
                  boxShadow: medicine.available ? 6 : 3
                }
              }}
            >
              <CardContent sx={{ p: 3, textAlign: 'center' }}>
                {/* Medicine Icon */}
                <MedicalServicesIcon 
                  sx={{ 
                    fontSize: 48, 
                    color: medicine.available ? '#2e7d32' : '#9e9e9e',
                    mb: 2 
                  }} 
                />
                
                {/* Medicine Names */}
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  {getMedicineName(medicine)}
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  {medicine.name}
                </Typography>

                {/* Availability Status */}
                <Chip
                  label={medicine.available ? t.available : t.outOfStock}
                  color={medicine.available ? "success" : "error"}
                  size="small"
                  sx={{ mb: 2, fontWeight: 'bold' }}
                />

                {/* Price */}
                <Typography variant="h5" fontWeight="bold" color="primary" mb={2}>
                  {t.rupees}{medicine.price}
                </Typography>

                {/* Add to Cart Button */}
                <Button
                  variant={medicine.available ? "contained" : "outlined"}
                  color={medicine.available ? "success" : "inherit"}
                  fullWidth
                  disabled={!medicine.available}
                  onClick={() => addToCart(medicine)}
                  startIcon={<ShoppingCartIcon />}
                  sx={{ 
                    py: 1,
                    fontWeight: 'bold',
                    borderRadius: 2
                  }}
                >
                  {medicine.available ? t.addToCart : t.outOfStock}
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Checkout Dialog */}
      <Dialog 
        open={checkoutOpen} 
        onClose={() => setCheckoutOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <Stack direction="row" alignItems="center" spacing={2}>
            <ShoppingCartIcon color="primary" />
            <Typography variant="h5" fontWeight="bold">
              {t.cart}
            </Typography>
          </Stack>
        </DialogTitle>
        
        <DialogContent>
          {/* Cart Items */}
          <Stack spacing={2} mb={3}>
            {cart.map((item) => (
              <Paper key={item.id} elevation={1} sx={{ p: 2 }}>
                <Stack direction="row" alignItems="center" justifyContent="space-between">
                  <Box>
                    <Typography variant="subtitle1" fontWeight="bold">
                      {getMedicineName(item)}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {t.price}: {t.rupees}{item.price} x {item.quantity}
                    </Typography>
                  </Box>
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <IconButton 
                      size="small" 
                      onClick={() => updateQuantity(item.id, -1)}
                    >
                      <RemoveIcon />
                    </IconButton>
                    <Typography variant="body1" fontWeight="bold">
                      {item.quantity}
                    </Typography>
                    <IconButton 
                      size="small" 
                      onClick={() => updateQuantity(item.id, 1)}
                    >
                      <AddIcon />
                    </IconButton>
                  </Stack>
                </Stack>
              </Paper>
            ))}
          </Stack>

          <Divider sx={{ mb: 3 }} />

          {/* Total */}
          <Typography variant="h5" fontWeight="bold" textAlign="center" mb={3}>
            {t.total}: {t.rupees}{getTotalPrice()}
          </Typography>

          {/* Payment Options */}
          <Typography variant="h6" fontWeight="bold" mb={2}>
            {t.payment} • Payment
          </Typography>
          <Grid container spacing={2} mb={3}>
            <Grid item xs={6}>
              <Button
                variant={selectedPayment === 'upi' ? 'contained' : 'outlined'}
                fullWidth
                onClick={() => setSelectedPayment('upi')}
                startIcon={<PaymentIcon />}
                sx={{ py: 1.5, backgroundColor: selectedPayment === 'upi' ? '#1565c0' : 'transparent' }}
              >
                📱 {t.upi}
              </Button>
            </Grid>
            <Grid item xs={6}>
              <Button
                variant={selectedPayment === 'card' ? 'contained' : 'outlined'}
                fullWidth
                onClick={() => setSelectedPayment('card')}
                startIcon={<CreditCardIcon />}
                sx={{ py: 1.5, backgroundColor: selectedPayment === 'card' ? '#ff9800' : 'transparent' }}
              >
                💳 {t.card}
              </Button>
            </Grid>
            <Grid item xs={6}>
              <Button
                variant={selectedPayment === 'wallet' ? 'contained' : 'outlined'}
                fullWidth
                onClick={() => setSelectedPayment('wallet')}
                startIcon={<WalletIcon />}
                sx={{ py: 1.5, backgroundColor: selectedPayment === 'wallet' ? '#2e7d32' : 'transparent' }}
              >
                💰 {t.wallet}
              </Button>
            </Grid>
            <Grid item xs={6}>
              <Button
                variant={selectedPayment === 'credits' ? 'contained' : 'outlined'}
                fullWidth
                onClick={() => setSelectedPayment('credits')}
                startIcon={<CreditsIcon />}
                sx={{ py: 1.5, backgroundColor: selectedPayment === 'credits' ? '#2e7d32' : 'transparent' }}
              >
                ⭐ {t.credits}
              </Button>
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions sx={{ p: 3 }}>
          <Button 
            onClick={() => setCheckoutOpen(false)} 
            color="inherit"
            size="large"
          >
            Cancel
          </Button>
          <Button 
            variant="contained" 
            onClick={handleCheckout}
            size="large"
            sx={{ 
              px: 4,
              py: 1,
              fontSize: '1.1rem',
              fontWeight: 'bold',
              background: 'linear-gradient(45deg, #2196f3, #21cbf3)'
            }}
          >
            🛒 {t.buyMedicine} • Buy Medicine
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default MedicineVending;
