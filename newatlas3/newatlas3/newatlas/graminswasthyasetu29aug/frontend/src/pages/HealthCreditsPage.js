import React, { useState } from 'react';
import { 
  Typography, Paper, Stack, Box, Card, CardContent, Avatar, Select, MenuItem,
  Button, Chip, LinearProgress, Grid, IconButton, Tooltip, Badge, Fade,
  Dialog, DialogTitle, DialogContent, DialogActions, Divider, Alert
} from '@mui/material';
import {
  AccountBalanceWallet as WalletIcon,
  LocalHospital as HospitalIcon,
  Star as StarIcon,
  Lock as LockIcon,
  CheckCircle as CheckIcon,
  Redeem as RedeemIcon,
  TrendingUp as TrendingUpIcon,
  CardGiftcard as GiftIcon,
  Close as CloseIcon,
  Info as InfoIcon
} from '@mui/icons-material';
import { styled, keyframes } from '@mui/material/styles';

// Animation keyframes
const glow = keyframes`
  0% {
    box-shadow: 0 0 5px rgba(67, 160, 71, 0.5);
  }
  50% {
    box-shadow: 0 0 20px rgba(67, 160, 71, 0.8), 0 0 30px rgba(67, 160, 71, 0.6);
  }
  100% {
    box-shadow: 0 0 5px rgba(67, 160, 71, 0.5);
  }
`;

const bounce = keyframes`
  0%, 20%, 50%, 80%, 100% {
    transform: translateY(0);
  }
  40% {
    transform: translateY(-10px);
  }
  60% {
    transform: translateY(-5px);
  }
`;

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

// Styled Components
const CreditCounter = styled(Box)(({ theme }) => ({
  background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
  borderRadius: theme.spacing(3),
  padding: theme.spacing(3),
  color: 'white',
  textAlign: 'center',
  boxShadow: theme.shadows[6],
  position: 'relative',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: '-100%',
    width: '100%',
    height: '100%',
    background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)',
    transition: 'left 0.5s'
  },
  '&:hover::before': {
    left: '100%'
  }
}));

const RewardCard = styled(Card)(({ theme, isUnlocked, isComingSoon }) => ({
  background: isUnlocked 
    ? `linear-gradient(135deg, ${theme.palette.success.light}15, ${theme.palette.success.main}25)` 
    : isComingSoon
    ? `linear-gradient(135deg, ${theme.palette.warning.light}15, ${theme.palette.warning.main}15)`
    : `linear-gradient(135deg, ${theme.palette.grey[200]}, ${theme.palette.grey[100]})`,
  border: isUnlocked 
    ? `3px solid ${theme.palette.success.main}` 
    : isComingSoon
    ? `2px solid ${theme.palette.warning.main}`
    : `2px dashed ${theme.palette.grey[400]}`,
  borderRadius: theme.spacing(2),
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  cursor: 'pointer',
  position: 'relative',
  overflow: 'hidden',
  animation: `${fadeIn} 0.6s ease-out`,
  '&:hover': {
    transform: 'translateY(-8px) scale(1.02)',
    boxShadow: isUnlocked 
      ? `0 10px 25px ${theme.palette.success.main}40` 
      : `0 10px 25px ${theme.palette.grey[400]}40`,
    ...(isUnlocked && {
      animation: `${glow} 2s infinite`
    })
  },
  ...(isUnlocked && {
    '&::after': {
      content: '""',
      position: 'absolute',
      top: '-50%',
      left: '-50%',
      width: '200%',
      height: '200%',
      background: `conic-gradient(transparent, ${theme.palette.success.main}20, transparent 30%)`,
      animation: `${bounce} 2s infinite`
    }
  })
}));

const ProgressBar = styled(LinearProgress)(({ theme }) => ({
  height: 8,
  borderRadius: 4,
  backgroundColor: theme.palette.grey[200],
  '& .MuiLinearProgress-bar': {
    borderRadius: 4,
    background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`
  }
}));

// Enhanced translations
const translations = {
  en: {
    pageTitle: 'Health Credit Rewards',
    subtitle: 'Earn credits through health activities and redeem amazing rewards',
    yourCredits: 'Your Credits',
    earnMore: 'Earn More',
    redeemNow: 'Redeem Now',
    unlocked: 'Unlocked',
    locked: 'Locked',
    unlocksAt: 'Unlocks at',
    credits: 'credits',
    progressToNext: 'Progress to next reward',
    howToEarn: 'How to Earn Credits',
    redeemReward: 'Redeem Reward',
    confirmRedeem: 'Confirm Redemption',
    redeemSuccess: 'Reward redeemed successfully!',
    close: 'Close',
    offers: [
      'Free/Discounted Medicines at Health Center',
      'Priority Doctor Consultation',
      'Free Health Checkup Camp Pass',
      'Maternal Health Kit',
      'Discount on MRI/Diagnostic Tests',
      'Entry to Health Awareness Workshop',
      'Subsidized Ambulance/Transport',
      'Bonus Credits for Regular Checkups',
    ],
    earnMethods: [
      'Complete health checkups: +20 credits',
      'Attend health awareness sessions: +15 credits',
      'Regular medication compliance: +10 credits',
      'Refer family/friends to health programs: +25 credits'
    ]
  },
  hi: {
    pageTitle: 'हेल्थ क्रेडिट पुरस्कार',
    subtitle: 'स्वास्थ्य गतिविधियों के माध्यम से क्रेडिट अर्जित करें और अद्भुत पुरस्कार भुनाएं',
    yourCredits: 'आपके क्रेडिट',
    earnMore: 'और अर्जित करें',
    redeemNow: 'अभी भुनाएं',
    unlocked: 'अनलॉक्ड',
    locked: 'लॉक्ड',
    unlocksAt: 'अनलॉक होगा',
    credits: 'क्रेडिट्स पर',
    progressToNext: 'अगले पुरस्कार की प्रगति',
    howToEarn: 'क्रेडिट कैसे अर्जित करें',
    redeemReward: 'पुरस्कार भुनाएं',
    confirmRedeem: 'रिडीम की पुष्टि करें',
    redeemSuccess: 'पुरस्कार सफलतापूर्वक भुनाया गया!',
    close: 'बंद करें',
    offers: [
      'हेल्थ सेंटर पर मुफ्त/छूट वाली दवाइयाँ',
      'प्राथमिकता डॉक्टर परामर्श',
      'मुफ्त स्वास्थ्य जांच शिविर पास',
      'मातृ स्वास्थ्य किट',
      'MRI/डायग्नोस्टिक टेस्ट पर छूट',
      'हेल्थ अवेयरनेस वर्कशॉप में प्रवेश',
      'सब्सिडाइज्ड एम्बुलेंस/ट्रांसपोर्ट',
      'नियमित जांच के लिए बोनस क्रेडिट्स',
    ],
    earnMethods: [
      'स्वास्थ्य जांच पूरी करें: +20 क्रेडिट',
      'स्वास्थ्य जागरूकता सत्रों में भाग लें: +15 क्रेडिट',
      'नियमित दवा अनुपालन: +10 क्रेडिट',
      'परिवार/दोस्तों को स्वास्थ्य कार्यक्रमों के लिए रेफर करें: +25 क्रेडिट'
    ]
  },
  pa: {
    pageTitle: 'ਸਿਹਤ ਕ੍ਰੈਡਿਟ ਇਨਾਮ',
    subtitle: 'ਸਿਹਤ ਗਤੀਵਿਧੀਆਂ ਰਾਹੀਂ ਕ੍ਰੈਡਿਟ ਕਮਾਓ ਅਤੇ ਸ਼ਾਨਦਾਰ ਇਨਾਮ ਭੁਨਾਓ',
    yourCredits: 'ਤੁਹਾਡੇ ਕ੍ਰੈਡਿਟ',
    earnMore: 'ਹੋਰ ਕਮਾਓ',
    redeemNow: 'ਹੁਣ ਭੁਨਾਓ',
    unlocked: 'ਅਨਲਾਕ ਕੀਤਾ',
    locked: 'ਲਾਕ ਕੀਤਾ',
    unlocksAt: 'ਅਨਲਾਕ ਹੋਵੇਗਾ',
    credits: 'ਕ੍ਰੈਡਿਟ ਤੇ',
    progressToNext: 'ਅਗਲੇ ਇਨਾਮ ਦੀ ਪ੍ਰਗਤੀ',
    howToEarn: 'ਕ੍ਰੈਡਿਟ ਕਿਵੇਂ ਕਮਾਉਣੇ',
    redeemReward: 'ਇਨਾਮ ਭੁਨਾਓ',
    confirmRedeem: 'ਭੁਨਾਉਣ ਦੀ ਤਸਦੀਕ ਕਰੋ',
    redeemSuccess: 'ਇਨਾਮ ਸਫਲਤਾ ਨਾਲ ਭੁਨਾਇਆ ਗਿਆ!',
    close: 'ਬੰਦ ਕਰੋ',
    offers: [
      'ਸਿਹਤ ਕੇਂਦਰ ਵਿਖੇ ਮੁਫਤ/ਰਿਆਇਤੀ ਦਵਾਈਆਂ',
      'ਪਹਿਲਾਂ ਡਾਕਟਰ ਸਲਾਹ',
      'ਮੁਫਤ ਸਿਹਤ ਜਾਂਚ ਕੈਂਪ ਦਾ ਟਿਕਟ',
      'ਮਾਤਰੀ ਸਿਹਤ ਕਿਟ',
      'MRI/ਨਿਦਾਨਕ ਜਾਂਚਾਂ ਵਿੱਚ ਰਿਆਇਤ',
      'ਸਿਹਤ ਜਾਗਰੂਕਤਾ ਵਰਕਸ਼ਾਪ ਵਿੱਚ ਦਾਖਲਾ',
      'ਸਬਸਿਡੀਸ਼ੁਦਾ ਅੰਬੂਲੇਂਸ/ਟ੍ਰਾਂਸਪੋਰਟ',
      'ਨਿਯਮਿਤ ਜਾਂਚ ਲਈ ਬੋਨਸ ਕ੍ਰੈਡਿਟ',
    ],
    earnMethods: [
      'ਸਿਹਤ ਜਾਂਚਾਂ ਪੂਰੀਆਂ ਕਰੋ: +20 ਕ੍ਰੈਡਿਟ',
      'ਸਿਹਤ ਜਾਗਰੂਕਤਾ ਸੈਸ਼ਨਾਂ ਵਿੱਚ ਹਿੱਸਾ ਲਓ: +15 ਕ੍ਰੈਡਿਟ',
      'ਨਿਯਮਿਤ ਦਵਾਈ ਪਾਲਨਾ: +10 ਕ੍ਰੈਡਿਟ',
      'ਪਰਿਵਾਰ/ਦੋਸਤਾਂ ਨੂੰ ਸਿਹਤ ਪ੍ਰੋਗਰਾਮਾਂ ਲਈ ਰੇਫਰ ਕਰੋ: +25 ਕ੍ਰੈਡਿਟ'
    ]
  }
};

export default function HealthCreditsPage() {
  const [language, setLanguage] = useState('en');
  const [selectedReward, setSelectedReward] = useState(null);
  const [redeemDialog, setRedeemDialog] = useState(false);
  const [earnDialog, setEarnDialog] = useState(false);
  const [successDialog, setSuccessDialog] = useState(false);
  
  const t = translations[language];
  
  // Demo: Assume user has 185 credits
  const userCredits = 185;
  const offers = [
    {
      points: 50,
      label: t.offers[0],
      img: 'https://static.vecteezy.com/system/resources/previews/017/757/522/original/pharmacy-store-offer-medicine-discount-sale-price-vector.jpg',
      icon: HospitalIcon,
      category: 'Medicine'
    },
    {
      points: 100,
      label: t.offers[1],
      img: 'https://as1.ftcdn.net/v2/jpg/01/33/15/28/1000_F_133152807_eyXEwa9ZWtimcrIZdGaU1WpV7sdeAZFf.jpg',
      icon: HospitalIcon,
      category: 'Consultation'
    },
    {
      points: 150,
      label: t.offers[2],
      img: 'https://plenarywellness.com/wp-content/uploads/2023/07/Health-Check-Ups.jpg',
      icon: CheckIcon,
      category: 'Health Checkup'
    },
    {
      points: 200,
      label: t.offers[3],
      img: 'https://miro.medium.com/v2/resize:fit:572/1*iemaMwcAz6dUuiqPCzPwXg.png',
      icon: GiftIcon,
      category: 'Health Kit'
    },
    {
      points: 250,
      label: t.offers[4],
      img: 'https://static.vecteezy.com/system/resources/previews/017/757/522/original/pharmacy-store-offer-medicine-discount-sale-price-vector.jpg',
      icon: HospitalIcon,
      category: 'Diagnostics'
    },
    {
      points: 300,
      label: t.offers[5],
      img: 'https://tse4.mm.bing.net/th/id/OIP.qOumEva2GdEmnS_GeeXqNAHaFd?rs=1&pid=ImgDetMain&o=7&rm=3',
      icon: InfoIcon,
      category: 'Workshop'
    },
    {
      points: 400,
      label: t.offers[6],
      img: 'https://cdn5.vectorstock.com/i/1000x1000/25/79/subsidy-icon-black-sign-with-editable-vector-35222579.jpg',
      icon: HospitalIcon,
      category: 'Transport'
    },
    {
      points: 500,
      label: t.offers[7],
      img: 'https://tse2.mm.bing.net/th/id/OIP.JI1y977ChxEQmfsfsFWsnwHaHa?rs=1&pid=ImgDetMain&o=7&rm=3',
      icon: StarIcon,
      category: 'Bonus'
    },
  ];

  // Calculate next reward progress
  const nextReward = offers.find(offer => offer.points > userCredits);
  const progress = nextReward ? (userCredits / nextReward.points) * 100 : 100;

  const handleRedeemClick = (offer) => {
    setSelectedReward(offer);
    setRedeemDialog(true);
  };

  const handleConfirmRedeem = () => {
    setRedeemDialog(false);
    setSuccessDialog(true);
  };

  const isUnlocked = (points) => userCredits >= points;
  const isComingSoon = (points) => userCredits >= points - 50 && userCredits < points;

  return (
    <Box sx={{ minHeight: '100vh', background: 'linear-gradient(135deg, #e3f2fd 0%, #f3e5f5 50%, #fff3e0 100%)', p: 3 }}>
      <Paper elevation={8} sx={{ 
        maxWidth: 1200, 
        mx: 'auto', 
        borderRadius: 4, 
        overflow: 'hidden',
        background: 'linear-gradient(135deg, rgba(255,255,255,0.95), rgba(255,255,255,0.85))'
      }}>
        {/* Header Section */}
        <Box sx={{ 
          background: 'linear-gradient(135deg, #1976d2, #42a5f5)', 
          color: 'white', 
          p: 4,
          position: 'relative',
          overflow: 'hidden'
        }}>
          <Box sx={{ position: 'relative', zIndex: 2 }}>
            <Stack direction="row" justifyContent="space-between" alignItems="flex-start" mb={2}>
              <Box>
                <Typography variant="h3" fontWeight="bold" gutterBottom>
                  {t.pageTitle}
                </Typography>
                <Typography variant="h6" sx={{ opacity: 0.9 }}>
                  {t.subtitle}
                </Typography>
              </Box>
              
              {/* Language Selector */}
              <Select
                value={language}
                onChange={e => setLanguage(e.target.value)}
                size="small"
                sx={{ 
                  minWidth: 120,
                  bgcolor: 'rgba(255,255,255,0.2)',
                  color: 'white',
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'rgba(255,255,255,0.3)'
                  }
                }}
              >
                <MenuItem value="en">English</MenuItem>
                <MenuItem value="hi">हिन्दी</MenuItem>
                <MenuItem value="pa">ਪੰਜਾਬੀ</MenuItem>
              </Select>
            </Stack>
            
            {/* Credit Counter and Progress */}
            <Grid container spacing={3} alignItems="center">
              <Grid item xs={12} md={6}>
                <CreditCounter>
                  <Stack direction="row" alignItems="center" justifyContent="center" spacing={2}>
                    <Badge badgeContent={userCredits} color="secondary" max={999}>
                      <WalletIcon sx={{ fontSize: 40 }} />
                    </Badge>
                    <Box>
                      <Typography variant="h4" fontWeight="bold">
                        {userCredits}
                      </Typography>
                      <Typography variant="body1" sx={{ opacity: 0.9 }}>
                        {t.yourCredits}
                      </Typography>
                    </Box>
                  </Stack>
                  
                  <Stack direction="row" spacing={2} mt={2}>
                    <Button 
                      variant="contained" 
                      color="secondary"
                      startIcon={<TrendingUpIcon />}
                      onClick={() => setEarnDialog(true)}
                      sx={{ flex: 1 }}
                    >
                      {t.earnMore}
                    </Button>
                  </Stack>
                </CreditCounter>
              </Grid>
              
              {nextReward && (
                <Grid item xs={12} md={6}>
                  <Paper elevation={3} sx={{ p: 3, bgcolor: 'rgba(255,255,255,0.95)' }}>
                    <Typography variant="h6" color="primary" gutterBottom>
                      {t.progressToNext}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" mb={1}>
                      {nextReward.label} ({nextReward.points} {t.credits})
                    </Typography>
                    <ProgressBar variant="determinate" value={progress} />
                    <Typography variant="caption" color="text.secondary" mt={1}>
                      {userCredits} / {nextReward.points} {t.credits}
                    </Typography>
                  </Paper>
                </Grid>
              )}
            </Grid>
          </Box>
          
          {/* Background decoration */}
          <Box sx={{
            position: 'absolute',
            top: -50,
            right: -50,
            width: 200,
            height: 200,
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.1)',
            zIndex: 1
          }} />
        </Box>

        {/* Rewards Grid */}
        <Box sx={{ p: 4 }}>
          <Grid container spacing={3}>
            {offers.map((offer, idx) => {
              const unlocked = isUnlocked(offer.points);
              const comingSoon = isComingSoon(offer.points);
              
              return (
                <Grid item xs={12} sm={6} md={4} lg={3} key={idx}>
                  <Fade in timeout={300 + idx * 100}>
                    <RewardCard 
                      isUnlocked={unlocked} 
                      isComingSoon={comingSoon}
                      onClick={() => unlocked && handleRedeemClick(offer)}
                    >
                      <CardContent sx={{ textAlign: 'center', p: 3, position: 'relative' }}>
                        {/* Status Badge */}
                        <Chip
                          icon={unlocked ? <CheckIcon /> : comingSoon ? <TrendingUpIcon /> : <LockIcon />}
                          label={unlocked ? t.unlocked : comingSoon ? 'Soon' : t.locked}
                          color={unlocked ? 'success' : comingSoon ? 'warning' : 'default'}
                          size="small"
                          sx={{ position: 'absolute', top: 8, right: 8 }}
                        />
                        
                        {/* Icon/Image */}
                        <Box sx={{ mb: 2, display: 'flex', justifyContent: 'center' }}>
                          <Avatar 
                            src={offer.img} 
                            sx={{ 
                              width: 80, 
                              height: 80,
                              bgcolor: unlocked ? 'success.light' : 'grey.300'
                            }}
                          >
                            <offer.icon sx={{ fontSize: 40 }} />
                          </Avatar>
                        </Box>
                        
                        {/* Title and Points */}
                        <Typography 
                          variant="h6" 
                          fontWeight="bold" 
                          gutterBottom
                          color={unlocked ? 'success.main' : comingSoon ? 'warning.main' : 'text.secondary'}
                          sx={{ minHeight: 60, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                        >
                          {offer.label}
                        </Typography>
                        
                        <Stack direction="row" alignItems="center" justifyContent="center" spacing={1} mb={2}>
                          <StarIcon color={unlocked ? 'primary' : 'disabled'} fontSize="small" />
                          <Typography variant="h6" fontWeight="bold" color={unlocked ? 'primary' : 'text.disabled'}>
                            {offer.points}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {t.credits}
                          </Typography>
                        </Stack>
                        
                        {/* Action Button */}
                        {unlocked ? (
                          <Button 
                            variant="contained" 
                            color="success"
                            startIcon={<RedeemIcon />}
                            fullWidth
                            sx={{ borderRadius: 3 }}
                          >
                            {t.redeemNow}
                          </Button>
                        ) : (
                          <Typography variant="body2" color="text.secondary">
                            {t.unlocksAt} {offer.points} {t.credits}
                          </Typography>
                        )}
                      </CardContent>
                    </RewardCard>
                  </Fade>
                </Grid>
              );
            })}
          </Grid>
        </Box>
      </Paper>

      {/* How to Earn Credits Dialog */}
      <Dialog 
        open={earnDialog} 
        onClose={() => setEarnDialog(false)}
        maxWidth="sm" 
        fullWidth
        PaperProps={{ sx: { borderRadius: 3 } }}
      >
        <DialogTitle sx={{ 
          bgcolor: 'primary.main', 
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          gap: 1
        }}>
          <TrendingUpIcon />
          {t.howToEarn}
        </DialogTitle>
        <DialogContent sx={{ p: 3 }}>
          <Stack spacing={2}>
            {t.earnMethods.map((method, index) => (
              <Alert key={index} icon={<StarIcon />} severity="info" sx={{ borderRadius: 2 }}>
                {method}
              </Alert>
            ))}
          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setEarnDialog(false)} variant="contained">
            {t.close}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Redeem Confirmation Dialog */}
      <Dialog 
        open={redeemDialog} 
        onClose={() => setRedeemDialog(false)}
        maxWidth="sm" 
        fullWidth
        PaperProps={{ sx: { borderRadius: 3 } }}
      >
        {selectedReward && (
          <>
            <DialogTitle sx={{ 
              bgcolor: 'success.main', 
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              gap: 1
            }}>
              <RedeemIcon />
              {t.confirmRedeem}
            </DialogTitle>
            <DialogContent sx={{ p: 3, textAlign: 'center' }}>
              <Avatar 
                src={selectedReward.img}
                sx={{ width: 100, height: 100, mx: 'auto', mb: 2 }}
              />
              <Typography variant="h5" gutterBottom>
                {selectedReward.label}
              </Typography>
              <Typography variant="h6" color="primary" gutterBottom>
                {selectedReward.points} {t.credits}
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Are you sure you want to redeem this reward?
              </Typography>
            </DialogContent>
            <DialogActions sx={{ p: 3, gap: 2 }}>
              <Button 
                onClick={() => setRedeemDialog(false)} 
                variant="outlined"
                startIcon={<CloseIcon />}
              >
                Cancel
              </Button>
              <Button 
                onClick={handleConfirmRedeem} 
                variant="contained" 
                color="success"
                startIcon={<CheckIcon />}
              >
                {t.redeemReward}
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>

      {/* Success Dialog */}
      <Dialog 
        open={successDialog} 
        onClose={() => setSuccessDialog(false)}
        maxWidth="xs" 
        fullWidth
        PaperProps={{ sx: { borderRadius: 3 } }}
      >
        <DialogContent sx={{ p: 4, textAlign: 'center' }}>
          <CheckIcon sx={{ fontSize: 80, color: 'success.main', mb: 2 }} />
          <Typography variant="h5" gutterBottom color="success.main">
            {t.redeemSuccess}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Your reward will be processed within 24 hours.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center', p: 3 }}>
          <Button 
            onClick={() => setSuccessDialog(false)} 
            variant="contained" 
            color="success"
          >
            {t.close}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
