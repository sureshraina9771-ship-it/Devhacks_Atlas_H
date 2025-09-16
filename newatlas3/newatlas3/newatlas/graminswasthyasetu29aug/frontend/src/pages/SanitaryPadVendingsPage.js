import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Paper, Button, Stack, Grid, Card, CardContent, Avatar,
  Dialog, DialogTitle, DialogContent, DialogActions, Chip, Divider,
  FormControl, InputLabel, Select, MenuItem, TextField, Alert, AlertTitle,
  Stepper, Step, StepLabel, StepContent, LinearProgress, IconButton
} from '@mui/material';
import {
  FavoriteRounded as HeartIcon,
  LocalHospital as MedicalIcon,
  Payment as PaymentIcon,
  CheckCircle as CheckIcon,
  Info as InfoIcon,
  Close as CloseIcon,
  Add as AddIcon,
  Remove as RemoveIcon,
  ShoppingCart as CartIcon,
  CreditCard as CardIcon,
  AccountBalanceWallet as WalletIcon,
  QrCode as QrIcon,
  Translate as TranslateIcon,
  School as EducationIcon,
  Security as PrivacyIcon,
  LocalShipping as DeliveryIcon
} from '@mui/icons-material';

// Multi-language support
const translations = {
  en: {
    title: "Sanitary Pad Vending Machine",
    subtitle: "Safe, Private & Accessible Hygiene Products",
    selectProduct: "Select Your Product",
    addToCart: "Add to Cart",
    cart: "Your Cart",
    checkout: "Proceed to Payment",
    payment: "Payment Options",
    success: "Order Successful!",
    regular: "Regular Flow",
    heavy: "Heavy Flow",
    overnight: "Overnight Protection",
    organic: "Organic Cotton",
    wings: "With Wings",
    noWings: "Without Wings",
    pieces: "pieces",
    price: "Price",
    total: "Total",
    payNow: "Pay Now",
    cash: "Cash Payment",
    card: "Card Payment", 
    upi: "UPI/Digital Wallet",
    education: "Health Education",
    privacy: "100% Private & Safe",
    howToUse: "How to Use",
    healthTips: "Health Tips",
    collectProduct: "Please collect your product from slot",
    thankYou: "Thank you for using our service!",
    quantity: "Quantity",
    remove: "Remove",
    continue: "Continue",
    back: "Back",
    selectLanguage: "Select Language",
    step1: "Select Products",
    step2: "Review Cart",
    step3: "Payment",
    step4: "Collect"
  },
  hi: {
    title: "सैनिटरी पैड वेंडिंग मशीन",
    subtitle: "सुरक्षित, निजी और सुलभ स्वच्छता उत्पाद",
    selectProduct: "अपना उत्पाद चुनें",
    addToCart: "कार्ट में जोड़ें",
    cart: "आपका कार्ट",
    checkout: "भुगतान के लिए आगे बढ़ें",
    payment: "भुगतान विकल्प",
    success: "ऑर्डर सफल!",
    regular: "सामान्य फ्लो",
    heavy: "हैवी फ्लो",
    overnight: "रातभर की सुरक्षा",
    organic: "ऑर्गैनिक कॉटन",
    wings: "विंग्स के साथ",
    noWings: "विंग्स के बिना",
    pieces: "पीस",
    price: "कीमत",
    total: "कुल",
    payNow: "अब भुगतान करें",
    cash: "नकद भुगतान",
    card: "कार्ड भुगतान",
    upi: "UPI/डिजिटल वॉलेट",
    education: "स्वास्थ्य शिक्षा",
    privacy: "100% निजी और सुरक्षित",
    howToUse: "उपयोग करने का तरीका",
    healthTips: "स्वास्थ्य सुझाव",
    collectProduct: "कृपया स्लॉट से अपना उत्पाद लें",
    thankYou: "हमारी सेवा का उपयोग करने के लिए धन्यवाद!",
    quantity: "मात्रा",
    remove: "हटाएं",
    continue: "जारी रखें",
    back: "वापस",
    selectLanguage: "भाषा चुनें",
    step1: "उत्पाद चुनें",
    step2: "कार्ट देखें",
    step3: "भुगतान",
    step4: "संग्रह"
  },
  kn: {
    title: "ಸ್ಯಾನಿಟರಿ ಪ್ಯಾಡ್ ವೆಂಡಿಂಗ್ ಮೆಶಿನ್",
    subtitle: "ಸುರಕ್ಷಿತ, ಖಾಸಗಿ ಮತ್ತು ಪ್ರವೇಶಿಸಬಹುದಾದ ನೈರ್ಮಲ್ಯ ಉತ್ಪನ್ನಗಳು",
    selectProduct: "ನಿಮ್ಮ ಉತ್ಪನ್ನವನ್ನು ಆಯ್ಕೆ ಮಾಡಿ",
    addToCart: "ಕಾರ್ಟ್‌ಗೆ ಸೇರಿಸಿ",
    cart: "ನಿಮ್ಮ ಕಾರ್ಟ್",
    checkout: "ಪಾವತಿಗೆ ಮುಂದುವರಿಯಿರಿ",
    payment: "ಪಾವತಿ ಆಯ್ಕೆಗಳು",
    success: "ಆರ್ಡರ್ ಯಶಸ್ವಿ!",
    regular: "ನಿಯಮಿತ ಫ್ಲೋ",
    heavy: "ಹೆವಿ ಫ್ಲೋ",
    overnight: "ರಾತ್ರಿಯ ರಕ್ಷಣೆ",
    organic: "ಆರ್ಗಾನಿಕ್ ಹತ್ತಿ",
    wings: "ಡೆಕ್ಕೆಗಳೊಂದಿಗೆ",
    noWings: "ಡೆಕ್ಕೆಗಳಿಲ್ಲದೆ",
    pieces: "ತುಂಡುಗಳು",
    price: "ಬೆಲೆ",
    total: "ಒಟ್ಟು",
    payNow: "ಈಗ ಪಾವತಿ ಮಾಡಿ",
    cash: "ನಗದು ಪಾವತಿ",
    card: "ಕಾರ್ಡ್ ಪಾವತಿ",
    upi: "UPI/ಡಿಜಿಟಲ್ ವ್ಯಾಲೆಟ್",
    education: "ಆರೋಗ್ಯ ಶಿಕ್ಷಣ",
    privacy: "100% ಖಾಸಗಿ ಮತ್ತು ಸುರಕ್ಷಿತ",
    howToUse: "ಹೇಗೆ ಬಳಸುವುದು",
    healthTips: "ಆರೋಗ್ಯ ಸಲಹೆಗಳು",
    collectProduct: "ದಯವಿಟ್ಟು ಸ್ಲಾಟ್‌ನಿಂದ ನಿಮ್ಮ ಉತ್ಪನ್ನವನ್ನು ಸಂಗ್ರಹಿಸಿ",
    thankYou: "ನಮ್ಮ ಸೇವೆಯನ್ನು ಬಳಸಿದ್ದಕ್ಕಾಗಿ ಧನ್ಯವಾದಗಳು!",
    quantity: "ಪ್ರಮಾಣ",
    remove: "ತೆಗೆದುಹಾಕಿ",
    continue: "ಮುಂದುವರಿಸಿ",
    back: "ಹಿಂದೆ",
    selectLanguage: "ಭಾಷೆಯನ್ನು ಆಯ್ಕೆ ಮಾಡಿ",
    step1: "ಉತ್ಪನ್ನಗಳನ್ನು ಆಯ್ಕೆ ಮಾಡಿ",
    step2: "ಕಾರ್ಟ್ ವಿಮರ್ಶೆ",
    step3: "ಪಾವತಿ",
    step4: "ಸಂಗ್ರಹಿಸಿ"
  }
};

// Product data
const products = [
  {
    id: 1,
    name: "Regular Flow Pads",
    nameHi: "नियमित फ्लो पैड",
    nameKn: "ನಿಯಮಿತ ಫ್ಲೋ ಪ್ಯಾಡ್",
    description: "Perfect for light to medium flow days",
    descriptionHi: "हल्के से मध्यम फ्लो के दिनों के लिए एकदम सही",
    descriptionKn: "ಹಗುರದಿಂದ ಮಧ್ಯಮ ಫ್ಲೋ ದಿನಗಳಿಗೆ ಪರಿಪೂರ್ಣ",
    price: 30,
    pieces: 8,
    image: "https://images.unsplash.com/photo-1584362917165-526f65c96edf?w=300&h=200&fit=crop",
    features: ["Soft Cotton Top", "6 Hours Protection", "With Wings"]
  },
  {
    id: 2,
    name: "Heavy Flow Pads",
    nameHi: "हैवी फ्लो पैड",
    nameKn: "ಹೆವಿ ಫ್ಲೋ ಪ್ಯಾಡ್",
    description: "Extra protection for heavy flow days",
    descriptionHi: "भारी फ्लो के दिनों के लिए अतिरिक्त सुरक्षा",
    descriptionKn: "ಭಾರೀ ಫ್ಲೋ ದಿನಗಳಿಗೆ ಹೆಚ್ಚುವರಿ ರಕ್ಷಣೆ",
    price: 40,
    pieces: 6,
    image: "https://images.unsplash.com/photo-1584362917165-526f65c96edf?w=300&h=200&fit=crop",
    features: ["Super Absorbent", "8 Hours Protection", "Extra Long"]
  },
  {
    id: 3,
    name: "Overnight Pads",
    nameHi: "रातभर के पैड",
    nameKn: "ರಾತ್ರಿಯ ಪ್ಯಾಡ್‌ಗಳು",
    description: "All-night comfort and protection",
    descriptionHi: "रातभर का आराम और सुरक्षा",
    descriptionKn: "ರಾತ್ರಿಯಿಂದ ಆರಾಮ ಮತ್ತು ರಕ್ಷಣೆ",
    price: 50,
    pieces: 5,
    image: "https://images.unsplash.com/photo-1584362917165-526f65c96edf?w=300&h=200&fit=crop",
    features: ["12 Hours Protection", "Extra Wide", "Anti-Leak"]
  },
  {
    id: 4,
    name: "Organic Cotton Pads",
    nameHi: "ऑर्गैनिक कॉटन पैड",
    nameKn: "ಆರ್ಗಾನಿಕ್ ಹತ್ತಿ ಪ್ಯಾಡ್‌ಗಳು",
    description: "100% organic cotton, gentle on skin",
    descriptionHi: "100% ऑर्गैनिक कॉटन, त्वचा के लिए कोमल",
    descriptionKn: "100% ಆರ್ಗಾನಿಕ್ ಹತ್ತಿ, ಚರ್ಮಕ್ಕೆ ಸೌಮ್ಯ",
    price: 60,
    pieces: 8,
    image: "https://images.unsplash.com/photo-1584362917165-526f65c96edf?w=300&h=200&fit=crop",
    features: ["Chemical Free", "Biodegradable", "Hypoallergenic"]
  },
  {
    id: 5,
    name: "Maternity Pads",
    nameHi: "मैटर्निटी पैड",
    nameKn: "ಮಾತೃತ್ವ ಪ್ಯಾಡ್‌ಗಳು",
    description: "Extra-large pads for postpartum care",
    descriptionHi: "प्रसव के बाद की देखभाल के लिए अतिरिक्त बड़े पैड",
    descriptionKn: "ಪ್ರಸವದ ನಂತರದ ಆರೈಕೆಗಾಗಿ ಹೆಚ್ಚುವರಿ ದೊಡ್ಡ ಪ್ಯಾಡ್‌ಗಳು",
    price: 70,
    pieces: 10,
    image: "https://images.unsplash.com/photo-1584362917165-526f65c96edf?w=300&h=200&fit=crop",
    features: ["Extra Large", "High Absorbency", "Post-Birth Care"]
  },
  {
    id: 6,
    name: "Eco-Friendly Pack",
    nameHi: "इको-फ्रेंडली पैक",
    nameKn: "ಪರಿಸರ ಸ್ನೇಹಿ ಪ್ಯಾಕ್",
    description: "Sustainable menstrual care solution",
    descriptionHi: "टिकाऊ मासिक धर्म देखभाल समाधान",
    descriptionKn: "ಸಮರ್ಥನೀಯ ಋತುಚಕ್ರ ಆರೈಕೆ ಪರಿಹಾರ",
    price: 80,
    pieces: 10,
    image: "https://images.unsplash.com/photo-1584362917165-526f65c96edf?w=300&h=200&fit=crop",
    features: ["Bamboo Fiber", "Compostable", "Zero Plastic"]
  }
];

export default function SanitaryPadVendingsPage() {
  const [language, setLanguage] = useState('en');
  const [activeStep, setActiveStep] = useState(0);
  const [cart, setCart] = useState([]);
  const [selectedPayment, setSelectedPayment] = useState('');
  const [educationDialog, setEducationDialog] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [processing, setProcessing] = useState(false);

  const t = translations[language];

  const addToCart = (product, quantity = 1) => {
    const existingItem = cart.find(item => item.id === product.id);
    if (existingItem) {
      setCart(cart.map(item => 
        item.id === product.id 
          ? { ...item, quantity: item.quantity + quantity }
          : item
      ));
    } else {
      setCart([...cart, { ...product, quantity }]);
    }
  };

  const removeFromCart = (productId) => {
    setCart(cart.filter(item => item.id !== productId));
  };

  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity === 0) {
      removeFromCart(productId);
    } else {
      setCart(cart.map(item => 
        item.id === productId 
          ? { ...item, quantity: newQuantity }
          : item
      ));
    }
  };

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const handlePayment = () => {
    setProcessing(true);
    setTimeout(() => {
      setProcessing(false);
      setOrderComplete(true);
      setActiveStep(3);
    }, 3000);
  };

  const resetOrder = () => {
    setActiveStep(0);
    setCart([]);
    setSelectedPayment('');
    setOrderComplete(false);
  };

  const ProductCard = ({ product }) => {
    const productName = language === 'hi' ? product.nameHi : language === 'kn' ? product.nameKn : product.name;
    const productDesc = language === 'hi' ? product.descriptionHi : language === 'kn' ? product.descriptionKn : product.description;
    
    return (
      <Card 
        elevation={2} 
        sx={{ 
          height: '100%',
          transition: 'all 0.3s ease',
          '&:hover': {
            elevation: 8,
            transform: 'translateY(-4px)'
          },
          background: 'linear-gradient(145deg, #fce4ec, #f8bbd9)'
        }}
      >
        <CardContent sx={{ p: 3 }}>
          <Stack spacing={2} alignItems="center">
            <Avatar
              src={product.image}
              sx={{ width: 80, height: 80, border: '3px solid #e91e63' }}
            >
              <HeartIcon sx={{ fontSize: 40, color: '#e91e63' }} />
            </Avatar>
            
            <Box textAlign="center">
              <Typography variant="h6" fontWeight="bold" color="primary" mb={1}>
                {productName}
              </Typography>
              <Typography variant="body2" color="text.secondary" mb={2}>
                {productDesc}
              </Typography>
              
              <Stack direction="row" spacing={1} justifyContent="center" mb={2}>
                {product.features.map((feature, index) => (
                  <Chip 
                    key={index} 
                    label={feature} 
                    size="small" 
                    color="secondary"
                    sx={{ fontSize: '0.7rem' }}
                  />
                ))}
              </Stack>
              
              <Stack direction="row" alignItems="center" justifyContent="space-between" mb={2}>
                <Typography variant="h5" fontWeight="bold" color="primary">
                  ₹{product.price}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {product.pieces} {t.pieces}
                </Typography>
              </Stack>
            </Box>
            
            <Button
              variant="contained"
              fullWidth
              startIcon={<AddIcon />}
              onClick={() => addToCart(product)}
              sx={{
                background: 'linear-gradient(45deg, #e91e63, #ad1457)',
                '&:hover': {
                  background: 'linear-gradient(45deg, #ad1457, #880e4f)'
                }
              }}
            >
              {t.addToCart}
            </Button>
          </Stack>
        </CardContent>
      </Card>
    );
  };

  const CartItem = ({ item }) => {
    const itemName = language === 'hi' ? item.nameHi : language === 'kn' ? item.nameKn : item.name;
    
    return (
      <Paper elevation={1} sx={{ p: 2, mb: 2 }}>
        <Stack direction="row" alignItems="center" spacing={2}>
          <Avatar src={item.image} sx={{ width: 50, height: 50 }} />
          
          <Box flex={1}>
            <Typography variant="subtitle1" fontWeight="bold">
              {itemName}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              ₹{item.price} × {item.quantity} = ₹{item.price * item.quantity}
            </Typography>
          </Box>
          
          <Stack direction="row" alignItems="center" spacing={1}>
            <IconButton 
              size="small" 
              onClick={() => updateQuantity(item.id, item.quantity - 1)}
              sx={{ bgcolor: '#ffebee' }}
            >
              <RemoveIcon fontSize="small" />
            </IconButton>
            
            <Typography variant="h6" sx={{ minWidth: 40, textAlign: 'center' }}>
              {item.quantity}
            </Typography>
            
            <IconButton 
              size="small" 
              onClick={() => updateQuantity(item.id, item.quantity + 1)}
              sx={{ bgcolor: '#e8f5e8' }}
            >
              <AddIcon fontSize="small" />
            </IconButton>
            
            <IconButton 
              size="small" 
              onClick={() => removeFromCart(item.id)}
              sx={{ bgcolor: '#ffebee', ml: 1 }}
            >
              <CloseIcon fontSize="small" color="error" />
            </IconButton>
          </Stack>
        </Stack>
      </Paper>
    );
  };

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#fce4ec', p: 3 }}>
      {/* Header */}
      <Paper elevation={3} sx={{ p: 3, mb: 3, borderRadius: 3, background: 'linear-gradient(135deg, #e91e63, #f06292)' }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={2}>
          <Stack direction="row" alignItems="center" spacing={2}>
            <Avatar sx={{ width: 60, height: 60, bgcolor: 'white' }}>
              <HeartIcon sx={{ fontSize: 32, color: '#e91e63' }} />
            </Avatar>
            <Box>
              <Typography variant="h4" fontWeight="bold" color="white">
                {t.title}
              </Typography>
              <Typography variant="subtitle1" color="rgba(255,255,255,0.9)">
                {t.subtitle}
              </Typography>
            </Box>
          </Stack>
          
          <Stack direction="row" spacing={2}>
            {/* Language Selector */}
            <FormControl size="small" sx={{ minWidth: 120 }}>
              <InputLabel sx={{ color: 'white' }}>{t.selectLanguage}</InputLabel>
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
                <MenuItem value="kn">ಕನ್ನಡ</MenuItem>
              </Select>
            </FormControl>
            
            {/* Education Button */}
            <Button
              variant="outlined"
              startIcon={<EducationIcon />}
              onClick={() => setEducationDialog(true)}
              sx={{ 
                color: 'white', 
                borderColor: 'white',
                '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' }
              }}
            >
              {t.education}
            </Button>
          </Stack>
        </Stack>
        
        {/* Privacy Assurance */}
        <Alert 
          severity="info" 
          icon={<PrivacyIcon />}
          sx={{ bgcolor: 'rgba(255,255,255,0.1)', color: 'white' }}
        >
          <AlertTitle sx={{ color: 'white', fontWeight: 'bold' }}>
            {t.privacy}
          </AlertTitle>
          Completely confidential purchase. No personal data stored.
        </Alert>
      </Paper>

      {/* Step Progress */}
      <Paper elevation={2} sx={{ p: 2, mb: 3, borderRadius: 2 }}>
        <Stepper activeStep={activeStep} alternativeLabel>
          <Step>
            <StepLabel>{t.step1}</StepLabel>
          </Step>
          <Step>
            <StepLabel>{t.step2}</StepLabel>
          </Step>
          <Step>
            <StepLabel>{t.step3}</StepLabel>
          </Step>
          <Step>
            <StepLabel>{t.step4}</StepLabel>
          </Step>
        </Stepper>
      </Paper>

      {/* Main Content */}
      {activeStep === 0 && (
        <>
          {/* Products Grid */}
          <Typography variant="h5" fontWeight="bold" color="primary" mb={3}>
            {t.selectProduct}
          </Typography>
          
          <Grid container spacing={3}>
            {products.map((product) => (
              <Grid item xs={12} sm={6} md={4} key={product.id}>
                <ProductCard product={product} />
              </Grid>
            ))}
          </Grid>
          
          {/* Cart Summary */}
          {cart.length > 0 && (
            <Paper elevation={2} sx={{ p: 3, mt: 3, borderRadius: 3, bgcolor: '#fff3e0' }}>
              <Stack direction="row" alignItems="center" justifyContent="space-between">
                <Stack direction="row" alignItems="center" spacing={2}>
                  <CartIcon color="primary" sx={{ fontSize: 32 }} />
                  <Typography variant="h6" fontWeight="bold">
                    {t.cart} ({cart.length} items)
                  </Typography>
                </Stack>
                
                <Stack alignItems="end" spacing={1}>
                  <Typography variant="h5" fontWeight="bold" color="primary">
                    {t.total}: ₹{getTotalPrice()}
                  </Typography>
                  <Button
                    variant="contained"
                    size="large"
                    onClick={() => setActiveStep(1)}
                    sx={{
                      background: 'linear-gradient(45deg, #ff9800, #f57c00)',
                      '&:hover': {
                        background: 'linear-gradient(45deg, #f57c00, #ef6c00)'
                      }
                    }}
                  >
                    {t.checkout}
                  </Button>
                </Stack>
              </Stack>
            </Paper>
          )}
        </>
      )}

      {/* Cart Review Step */}
      {activeStep === 1 && (
        <Box>
          <Typography variant="h5" fontWeight="bold" color="primary" mb={3}>
            {t.cart}
          </Typography>
          
          {cart.map((item) => (
            <CartItem key={item.id} item={item} />
          ))}
          
          <Paper elevation={2} sx={{ p: 3, mt: 3, bgcolor: '#e8f5e8' }}>
            <Stack direction="row" alignItems="center" justifyContent="space-between">
              <Typography variant="h5" fontWeight="bold">
                {t.total}: ₹{getTotalPrice()}
              </Typography>
              
              <Stack direction="row" spacing={2}>
                <Button
                  variant="outlined"
                  onClick={() => setActiveStep(0)}
                >
                  {t.back}
                </Button>
                <Button
                  variant="contained"
                  onClick={() => setActiveStep(2)}
                  size="large"
                >
                  {t.continue}
                </Button>
              </Stack>
            </Stack>
          </Paper>
        </Box>
      )}

      {/* Payment Step */}
      {activeStep === 2 && (
        <Box>
          <Typography variant="h5" fontWeight="bold" color="primary" mb={3}>
            {t.payment}
          </Typography>
          
          <Grid container spacing={3}>
            {/* Payment Options */}
            <Grid item xs={12} md={8}>
              <Stack spacing={2}>
                {/* Cash Payment */}
                <Paper 
                  elevation={selectedPayment === 'cash' ? 4 : 1}
                  sx={{ 
                    p: 3, 
                    cursor: 'pointer',
                    border: selectedPayment === 'cash' ? '2px solid #4caf50' : '1px solid #e0e0e0',
                    transition: 'all 0.3s ease'
                  }}
                  onClick={() => setSelectedPayment('cash')}
                >
                  <Stack direction="row" alignItems="center" spacing={2}>
                    <WalletIcon sx={{ fontSize: 32, color: '#4caf50' }} />
                    <Box>
                      <Typography variant="h6" fontWeight="bold">
                        {t.cash}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Insert exact change in the machine
                      </Typography>
                    </Box>
                  </Stack>
                </Paper>
                
                {/* Card Payment */}
                <Paper 
                  elevation={selectedPayment === 'card' ? 4 : 1}
                  sx={{ 
                    p: 3, 
                    cursor: 'pointer',
                    border: selectedPayment === 'card' ? '2px solid #2196f3' : '1px solid #e0e0e0',
                    transition: 'all 0.3s ease'
                  }}
                  onClick={() => setSelectedPayment('card')}
                >
                  <Stack direction="row" alignItems="center" spacing={2}>
                    <CardIcon sx={{ fontSize: 32, color: '#2196f3' }} />
                    <Box>
                      <Typography variant="h6" fontWeight="bold">
                        {t.card}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Debit/Credit Card, Contactless payment
                      </Typography>
                    </Box>
                  </Stack>
                </Paper>
                
                {/* UPI Payment */}
                <Paper 
                  elevation={selectedPayment === 'upi' ? 4 : 1}
                  sx={{ 
                    p: 3, 
                    cursor: 'pointer',
                    border: selectedPayment === 'upi' ? '2px solid #ff9800' : '1px solid #e0e0e0',
                    transition: 'all 0.3s ease'
                  }}
                  onClick={() => setSelectedPayment('upi')}
                >
                  <Stack direction="row" alignItems="center" spacing={2}>
                    <QrIcon sx={{ fontSize: 32, color: '#ff9800' }} />
                    <Box>
                      <Typography variant="h6" fontWeight="bold">
                        {t.upi}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        PhonePe, GPay, Paytm, BHIM UPI
                      </Typography>
                    </Box>
                  </Stack>
                </Paper>
              </Stack>
            </Grid>
            
            {/* Payment Summary */}
            <Grid item xs={12} md={4}>
              <Paper elevation={2} sx={{ p: 3, bgcolor: '#f3e5f5' }}>
                <Typography variant="h6" fontWeight="bold" mb={2}>
                  Order Summary
                </Typography>
                
                {cart.map((item) => {
                  const itemName = language === 'hi' ? item.nameHi : language === 'kn' ? item.nameKn : item.name;
                  return (
                    <Stack key={item.id} direction="row" justifyContent="space-between" mb={1}>
                      <Typography variant="body2">
                        {itemName} × {item.quantity}
                      </Typography>
                      <Typography variant="body2" fontWeight="bold">
                        ₹{item.price * item.quantity}
                      </Typography>
                    </Stack>
                  );
                })}
                
                <Divider sx={{ my: 2 }} />
                
                <Stack direction="row" justifyContent="space-between" mb={3}>
                  <Typography variant="h6" fontWeight="bold">
                    {t.total}
                  </Typography>
                  <Typography variant="h6" fontWeight="bold" color="primary">
                    ₹{getTotalPrice()}
                  </Typography>
                </Stack>
                
                <Stack spacing={2}>
                  <Button
                    variant="outlined"
                    onClick={() => setActiveStep(1)}
                  >
                    {t.back}
                  </Button>
                  
                  <Button
                    variant="contained"
                    size="large"
                    disabled={!selectedPayment || processing}
                    onClick={handlePayment}
                    sx={{
                      background: 'linear-gradient(45deg, #4caf50, #45a049)',
                      '&:hover': {
                        background: 'linear-gradient(45deg, #45a049, #3d8b40)'
                      }
                    }}
                  >
                    {processing ? (
                      <>
                        <LinearProgress sx={{ width: 100, mr: 1 }} />
                        Processing...
                      </>
                    ) : (
                      t.payNow
                    )}
                  </Button>
                </Stack>
              </Paper>
            </Grid>
          </Grid>
        </Box>
      )}

      {/* Order Complete Step */}
      {activeStep === 3 && orderComplete && (
        <Box textAlign="center">
          <Stack spacing={4} alignItems="center">
            <CheckIcon sx={{ fontSize: 100, color: '#4caf50' }} />
            
            <Typography variant="h3" fontWeight="bold" color="primary">
              {t.success}
            </Typography>
            
            <Paper elevation={3} sx={{ p: 4, maxWidth: 500, bgcolor: '#e8f5e8' }}>
              <Typography variant="h6" fontWeight="bold" mb={2}>
                {t.collectProduct}
              </Typography>
              
              <Stack spacing={2}>
                <Box sx={{ 
                  bgcolor: '#4caf50', 
                  color: 'white', 
                  p: 2, 
                  borderRadius: 2,
                  fontSize: '1.5rem',
                  fontWeight: 'bold'
                }}>
                  SLOT A3
                </Box>
                
                <Typography variant="body1">
                  {t.thankYou}
                </Typography>
                
                <Button
                  variant="contained"
                  onClick={resetOrder}
                  sx={{ mt: 3 }}
                >
                  New Order
                </Button>
              </Stack>
            </Paper>
          </Stack>
        </Box>
      )}

      {/* Education Dialog */}
      <Dialog 
        open={educationDialog} 
        onClose={() => setEducationDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Stack direction="row" alignItems="center" spacing={2}>
            <EducationIcon color="primary" sx={{ fontSize: 32 }} />
            <Typography variant="h5" fontWeight="bold">
              {t.education}
            </Typography>
          </Stack>
        </DialogTitle>
        
        <DialogContent>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Paper elevation={1} sx={{ p: 3, bgcolor: '#fff3e0' }}>
                <Typography variant="h6" fontWeight="bold" mb={2} color="primary">
                  {t.howToUse}
                </Typography>
                <Stack spacing={2}>
                  <Typography variant="body2">
                    1. Change pad every 4-6 hours
                  </Typography>
                  <Typography variant="body2">
                    2. Always wash hands before and after
                  </Typography>
                  <Typography variant="body2">
                    3. Remove from back to front
                  </Typography>
                  <Typography variant="body2">
                    4. Wrap used pad properly before disposal
                  </Typography>
                </Stack>
              </Paper>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Paper elevation={1} sx={{ p: 3, bgcolor: '#e8f5e8' }}>
                <Typography variant="h6" fontWeight="bold" mb={2} color="primary">
                  {t.healthTips}
                </Typography>
                <Stack spacing={2}>
                  <Typography variant="body2">
                    • Stay hydrated during periods
                  </Typography>
                  <Typography variant="body2">
                    • Maintain good hygiene
                  </Typography>
                  <Typography variant="body2">
                    • Light exercise can help with cramps
                  </Typography>
                  <Typography variant="body2">
                    • Consult doctor for irregular periods
                  </Typography>
                </Stack>
              </Paper>
            </Grid>
          </Grid>
        </DialogContent>
        
        <DialogActions>
          <Button onClick={() => setEducationDialog(false)}>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
