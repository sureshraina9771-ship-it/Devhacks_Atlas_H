import React, { useState } from 'react';
import { Typography, Paper, Stack, Box, Card, CardContent, Avatar, Select, MenuItem } from '@mui/material';

// Localized offer labels
const offerLabels = {
  en: [
    'Free/Discounted Medicines at Health Center',
    'Priority Doctor Consultation',
    'Free Health Checkup Camp Pass',
    'Maternal Health Kit',
    'Discount on MRI/Diagnostic Tests',
    'Entry to Health Awareness Workshop',
    'Subsidized Ambulance/Transport',
    'Bonus Credits for Regular Checkups',
  ],
  hi: [
    'हेल्थ सेंटर पर मुफ्त/छूट वाली दवाइयाँ',
    'प्राथमिकता डॉक्टर परामर्श',
    'मुफ्त स्वास्थ्य जांच शिविर पास',
    'मातृ स्वास्थ्य किट',
    'MRI/डायग्नोस्टिक टेस्ट पर छूट',
    'हेल्थ अवेयरनेस वर्कशॉप में प्रवेश',
    'सब्सिडाइज्ड एम्बुलेंस/ट्रांसपोर्ट',
    'नियमित जांच के लिए बोनस क्रेडिट्स',
  ],
  kn: [
    'ಆರೋಗ್ಯ ಕೇಂದ್ರದಲ್ಲಿ ಉಚಿತ/ರಿಯಾಯಿತಿಯ ಔಷಧಿಗಳು',
    'ಪ್ರಾಥಮಿಕ ವೈದ್ಯರ ಸಲಹೆ',
    'ಉಚಿತ ಆರೋಗ್ಯ ತಪಾಸಣಾ ಶಿಬಿರ ಪಾಸ್',
    'ಮಾತೃತ್ವ ಆರೋಗ್ಯ ಕಿಟ್',
    'MRI/ನಿರ್ಣಾಯಕ ಪರೀಕ್ಷೆಗಳಲ್ಲಿ ರಿಯಾಯಿತಿ',
    'ಆರೋಗ್ಯ ಜಾಗೃತಿ ಕಾರ್ಯಾಗಾರ ಪ್ರವೇಶ',
    'ಸಬ್ಸಿಡೈಸ್ ಮಾಡಿದ ಆಂಬ್ಯುಲೆನ್ಸ್/ಪ್ರವಾಹ',
    'ನಿಯಮಿತ ತಪಾಸಣೆಗೆ ಬೋನಸ್ ಕ್ರೆಡಿಟ್ಸ್',
  ]
};

export default function HealthCreditsPage() {
  // Demo: Assume user has 185 credits
  const userCredits = 185;
  const offers = [
    {
      points: 50,
      label: 'Free/Discounted Medicines at Health Center',
      img: 'https://static.vecteezy.com/system/resources/previews/017/757/522/original/pharmacy-store-offer-medicine-discount-sale-price-vector.jpg'
    },
    {
      points: 100,
      label: 'Priority Doctor Consultation',
      img: 'https://as1.ftcdn.net/v2/jpg/01/33/15/28/1000_F_133152807_eyXEwa9ZWtimcrIZdGaU1WpV7sdeAZFf.jpg'
    },
    {
      points: 150,
      label: 'Free Health Checkup Camp Pass',
      img: 'https://plenarywellness.com/wp-content/uploads/2023/07/Health-Check-Ups.jpg'
    },
    {
      points: 200,
      label: 'Maternal Health Kit',
      img: 'https://miro.medium.com/v2/resize:fit:572/1*iemaMwcAz6dUuiqPCzPwXg.png'
    },
    {
      points: 250,
      label: 'Discount on MRI/Diagnostic Tests',
      img: 'https://static.vecteezy.com/system/resources/previews/017/757/522/original/pharmacy-store-offer-medicine-discount-sale-price-vector.jpg'
    },
    {
      points: 300,
      label: 'Entry to Health Awareness Workshop',
      img: 'https://tse4.mm.bing.net/th/id/OIP.qOumEva2GdEmnS_GeeXqNAHaFd?rs=1&pid=ImgDetMain&o=7&rm=3'
    },
    {
      points: 400,
      label: 'Subsidized Ambulance/Transport',
      img: 'https://cdn5.vectorstock.com/i/1000x1000/25/79/subsidy-icon-black-sign-with-editable-vector-35222579.jpg'
    },
    {
      points: 500,
      label: 'Bonus Credits for Regular Checkups',
      img: 'https://tse2.mm.bing.net/th/id/OIP.JI1y977ChxEQmfsfsFWsnwHaHa?rs=1&pid=ImgDetMain&o=7&rm=3'
    },
  ];
  const [language, setLanguage] = useState('en');

  return (
    <Paper elevation={4} sx={{ p: { xs: 2, md: 5 }, maxWidth: 900, mx: 'auto', mt: 5, borderRadius: 5, background: 'linear-gradient(135deg, #e0f7fa 0%, #fffde7 100%)' }}>
      {/* Language Selector */}
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'flex-end' }}>
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
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4" fontWeight={800} color="#1976d2">
          Health Credit Rewards
        </Typography>
        <Box>
          <Typography variant="h6" color="#43a047" fontWeight={700}>
            Your Credits: {userCredits}
          </Typography>
        </Box>
      </Box>
      <Stack direction={{ xs: 'column', md: 'row' }} spacing={4} flexWrap="wrap" useFlexGap>
        {offers.map((offer, idx) => (
          <Card key={idx} sx={{ minWidth: 220, maxWidth: 260, flex: 1, background: userCredits >= offer.points ? '#e3fcec' : '#f5f5f5', border: userCredits >= offer.points ? '3px solid #43a047' : '2px dashed #ccc', borderRadius: 4, boxShadow: userCredits >= offer.points ? 6 : 2, transition: '0.3s', position: 'relative' }}>
            <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', p: 3 }}>
              <Avatar src={offer.img} alt={offer.label} sx={{ width: 64, height: 64, mb: 2, bgcolor: '#fff' }} />
              <Typography variant="h6" fontWeight={700} align="center" color={userCredits >= offer.points ? '#388e3c' : '#888'}>
                {offerLabels[language][idx]}
              </Typography>
              <Typography variant="body2" align="center" sx={{ mt: 1, color: userCredits >= offer.points ? '#43a047' : '#aaa', fontWeight: 600 }}>
                {userCredits >= offer.points ? (language === 'hi' ? 'अनलॉक्ड!' : language === 'kn' ? 'ಅನ್‌ಲಾಕ್‌ಡ್!' : 'Unlocked!') : (language === 'hi' ? `अनलॉक ${offer.points} क्रेडिट्स पर` : language === 'kn' ? `${offer.points} ಕ್ರೆಡಿಟ್ಸ್‌ನಲ್ಲಿ ಅನ್ಲಾಕ್ ಆಗುತ್ತದೆ` : `Unlocks at ${offer.points} credits`)}
              </Typography>
            </CardContent>
            {userCredits >= offer.points && (
              <Box sx={{ position: 'absolute', top: 12, right: 12, bgcolor: '#43a047', color: '#fff', px: 2, py: 0.5, borderRadius: 2, fontWeight: 700, fontSize: 13, boxShadow: 2 }}>
                {language === 'hi' ? 'अनलॉक्ड' : language === 'kn' ? 'ಅನ್‌ಲಾಕ್‌ಡ್' : 'Unlocked'}
              </Box>
            )}
          </Card>
        ))}
      </Stack>
    </Paper>
  );
}