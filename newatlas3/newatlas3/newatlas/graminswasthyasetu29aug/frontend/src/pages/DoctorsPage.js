import React, { useEffect, useState } from 'react';
import {
  Typography, Paper, Button, Stack, Box, Grid, Card, CardContent, Avatar, Chip,
  TextField, InputAdornment, Select, MenuItem, FormControl, InputLabel,
  Dialog, DialogTitle, DialogContent, DialogActions, Divider, Rating
} from '@mui/material';
import {
  Search as SearchIcon,
  LocalHospital as LocalHospitalIcon,
  VideoCall as VideoCallIcon,
  Schedule as ScheduleIcon,
  Star as StarIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
  FilterList as FilterIcon
} from '@mui/icons-material';

// Enhanced translations
const translations = {
  en: {
    doctors: "Find Doctors",
    searchDoctors: "Search doctors, specialties...",
    filterBy: "Filter by Specialty",
    allSpecialties: "All Specialties",
    available: "Available",
    notAvailable: "Not Available",
    experience: "Experience",
    years: "years",
    rating: "Rating",
    consultationFee: "Consultation Fee",
    bookAppointment: "Book Appointment",
    videoConsult: "Video Consult",
    viewProfile: "View Profile",
    nextAvailable: "Next Available",
    today: "Today",
    tomorrow: "Tomorrow",
    perHour: "per hour"
  },
  hi: {
    doctors: "डॉक्टर खोजें",
    searchDoctors: "डॉक्टर, विशेषज्ञता खोजें...",
    filterBy: "विशेषज्ञता के अनुसार फिल्टर करें",
    allSpecialties: "सभी विशेषज्ञताएं",
    available: "उपलब्ध",
    notAvailable: "उपलब्ध नहीं",
    experience: "अनुभव",
    years: "वर्ष",
    rating: "रेटिंग",
    consultationFee: "परामर्श शुल्क",
    bookAppointment: "अपॉइंटमेंट बुक करें",
    videoConsult: "वीडियो परामर्श",
    viewProfile: "प्रोफाइल देखें",
    nextAvailable: "अगली उपलब्धता",
    today: "आज",
    tomorrow: "कल",
    perHour: "प्रति घंटा"
  },
  kn: {
    doctors: "ವೈದ್ಯರನ್ನು ಹುಡುಕಿ",
    searchDoctors: "ವೈದ್ಯರು, ವಿಶೇಷತೆಗಳನ್ನು ಹುಡುಕಿ...",
    filterBy: "ವಿಶೇಷತೆಯ ಆಧಾರದ ಮೇಲೆ ಫಿಲ್ಟರ್ ಮಾಡಿ",
    allSpecialties: "ಎಲ್ಲಾ ವಿಶೇಷತೆಗಳು",
    available: "ಲಭ್ಯವಿದೆ",
    notAvailable: "ಲಭ್ಯವಿಲ್ಲ",
    experience: "ಅನುಭವ",
    years: "ವರ್ಷಗಳು",
    rating: "ರೇಟಿಂಗ್",
    consultationFee: "ಸಮಾಲೋಚನಾ ಶುಲ್ಕ",
    bookAppointment: "ಅಪಾಯಿಂಟ್‌ಮೆಂಟ್ ಬುಕ್ ಮಾಡಿ",
    videoConsult: "ವೀಡಿಯೋ ಸಮಾಲೋಚನೆ",
    viewProfile: "ಪ್ರೊಫೈಲ್ ವೀಕ್ಷಿಸಿ",
    nextAvailable: "ಮುಂದಿನ ಲಭ್ಯತೆ",
    today: "ಇಂದು",
    tomorrow: "ನಾಳೆ",
    perHour: "ಪ್ರತಿ ಗಂಟೆಗೆ"
  }
};

// Comprehensive list of 30 Indian doctors
const doctorsData = [
  {
    id: 1,
    name: 'Dr. Rajesh Kumar',
    specialty: 'Cardiology',
    experience: 15,
    rating: 4.8,
    fee: 800,
    available: true,
    nextSlot: 'Today, 2:00 PM',
    location: 'Delhi',
    photo: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=150&h=150&fit=crop&crop=face',
    qualifications: 'MBBS, MD, DM Cardiology'
  },
  {
    id: 2,
    name: 'Dr. Priya Sharma',
    specialty: 'Pediatrics',
    experience: 12,
    rating: 4.9,
    fee: 600,
    available: true,
    nextSlot: 'Today, 3:30 PM',
    location: 'Mumbai',
    photo: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&h=150&fit=crop&crop=face',
    qualifications: 'MBBS, MD Pediatrics'
  },
  {
    id: 3,
    name: 'Dr. Amit Singh',
    specialty: 'Orthopedics',
    experience: 18,
    rating: 4.7,
    fee: 900,
    available: false,
    nextSlot: 'Tomorrow, 10:00 AM',
    location: 'Bangalore',
    photo: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=150&h=150&fit=crop&crop=face',
    qualifications: 'MBBS, MS Orthopedics'
  },
  {
    id: 4,
    name: 'Dr. Sunita Patel',
    specialty: 'Gynecology',
    experience: 14,
    rating: 4.6,
    fee: 700,
    available: true,
    nextSlot: 'Today, 4:00 PM',
    location: 'Chennai',
    photo: 'https://images.unsplash.com/photo-1594824475497-d0656fabb7dd?w=150&h=150&fit=crop&crop=face',
    qualifications: 'MBBS, MD Gynecology'
  },
  {
    id: 5,
    name: 'Dr. Vikram Mehta',
    specialty: 'Neurology',
    experience: 20,
    rating: 4.9,
    fee: 1200,
    available: true,
    nextSlot: 'Today, 5:00 PM',
    location: 'Pune',
    photo: 'https://images.unsplash.com/photo-1607990281513-2c110a25bd8c?w=150&h=150&fit=crop&crop=face',
    qualifications: 'MBBS, MD, DM Neurology'
  },
  {
    id: 6,
    name: 'Dr. Kavya Reddy',
    specialty: 'Dermatology',
    experience: 10,
    rating: 4.5,
    fee: 550,
    available: false,
    nextSlot: 'Tomorrow, 11:00 AM',
    location: 'Hyderabad',
    photo: 'https://images.unsplash.com/photo-1584467735871-8e16a9c4621c?w=150&h=150&fit=crop&crop=face',
    qualifications: 'MBBS, MD Dermatology'
  },
  {
    id: 7,
    name: 'Dr. Arjun Gupta',
    specialty: 'General Medicine',
    experience: 8,
    rating: 4.4,
    fee: 400,
    available: true,
    nextSlot: 'Today, 6:00 PM',
    location: 'Kolkata',
    photo: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=150&h=150&fit=crop&crop=face',
    qualifications: 'MBBS, MD General Medicine'
  },
  {
    id: 8,
    name: 'Dr. Meera Joshi',
    specialty: 'Ophthalmology',
    experience: 16,
    rating: 4.8,
    fee: 750,
    available: true,
    nextSlot: 'Today, 7:00 PM',
    location: 'Ahmedabad',
    photo: 'https://images.unsplash.com/photo-1651008376811-b90baee60c1f?w=150&h=150&fit=crop&crop=face',
    qualifications: 'MBBS, MS Ophthalmology'
  },
  {
    id: 9,
    name: 'Dr. Ravi Agarwal',
    specialty: 'Gastroenterology',
    experience: 13,
    rating: 4.6,
    fee: 850,
    available: false,
    nextSlot: 'Tomorrow, 2:00 PM',
    location: 'Jaipur',
    photo: 'https://images.unsplash.com/photo-1634926878768-2a5b3c42f139?w=150&h=150&fit=crop&crop=face',
    qualifications: 'MBBS, MD, DM Gastroenterology'
  },
  {
    id: 10,
    name: 'Dr. Deepika Nair',
    specialty: 'Psychiatry',
    experience: 11,
    rating: 4.7,
    fee: 650,
    available: true,
    nextSlot: 'Today, 8:00 PM',
    location: 'Kochi',
    photo: 'https://images.unsplash.com/photo-1609814761634-898de3862133?w=150&h=150&fit=crop&crop=face',
    qualifications: 'MBBS, MD Psychiatry'
  },
  {
    id: 11,
    name: 'Dr. Suresh Yadav',
    specialty: 'Urology',
    experience: 17,
    rating: 4.5,
    fee: 800,
    available: false,
    nextSlot: 'Tomorrow, 9:00 AM',
    location: 'Lucknow',
    photo: 'https://images.unsplash.com/photo-1624727828489-a1e03b79bba8?w=150&h=150&fit=crop&crop=face',
    qualifications: 'MBBS, MS Urology'
  },
  {
    id: 12,
    name: 'Dr. Anita Das',
    specialty: 'Endocrinology',
    experience: 9,
    rating: 4.6,
    fee: 700,
    available: true,
    nextSlot: 'Today, 9:00 PM',
    location: 'Bhubaneswar',
    photo: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=150&h=150&fit=crop&crop=face',
    qualifications: 'MBBS, MD, DM Endocrinology'
  },
  {
    id: 13,
    name: 'Dr. Kiran Kumar',
    specialty: 'Pulmonology',
    experience: 14,
    rating: 4.7,
    fee: 750,
    available: true,
    nextSlot: 'Tomorrow, 10:00 AM',
    location: 'Visakhapatnam',
    photo: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=150&h=150&fit=crop&crop=face',
    qualifications: 'MBBS, MD Pulmonology'
  },
  {
    id: 14,
    name: 'Dr. Pooja Verma',
    specialty: 'Rheumatology',
    experience: 12,
    rating: 4.4,
    fee: 600,
    available: false,
    nextSlot: 'Tomorrow, 3:00 PM',
    location: 'Indore',
    photo: 'https://images.unsplash.com/photo-1580281658223-2b9e3b2b0f4b?w=150&h=150&fit=crop&crop=face',
    qualifications: 'MBBS, MD, DM Rheumatology'
  },
  {
    id: 15,
    name: 'Dr. Rohit Sharma',
    specialty: 'Oncology',
    experience: 19,
    rating: 4.9,
    fee: 1500,
    available: true,
    nextSlot: 'Tomorrow, 11:00 AM',
    location: 'Delhi',
    photo: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&h=150&fit=crop&crop=face',
    qualifications: 'MBBS, MD, DM Oncology'
  },
  {
    id: 16,
    name: 'Dr. Sneha Patil',
    specialty: 'Nephrology',
    experience: 13,
    rating: 4.6,
    fee: 800,
    available: false,
    nextSlot: 'Tomorrow, 4:00 PM',
    location: 'Mumbai',
    photo: 'https://images.unsplash.com/photo-1594736797933-d0871ba4a803?w=150&h=150&fit=crop&crop=face',
    qualifications: 'MBBS, MD, DM Nephrology'
  },
  {
    id: 17,
    name: 'Dr. Manoj Tiwari',
    specialty: 'Plastic Surgery',
    experience: 16,
    rating: 4.8,
    fee: 1200,
    available: true,
    nextSlot: 'Tomorrow, 12:00 PM',
    location: 'Bangalore',
    photo: 'https://images.unsplash.com/photo-1559233458-b137f40bbf6f?w=150&h=150&fit=crop&crop=face',
    qualifications: 'MBBS, MS, MCh Plastic Surgery'
  },
  {
    id: 18,
    name: 'Dr. Lakshmi Iyer',
    specialty: 'Hematology',
    experience: 11,
    rating: 4.5,
    fee: 700,
    available: true,
    nextSlot: 'Tomorrow, 1:00 PM',
    location: 'Chennai',
    photo: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=150&h=150&fit=crop&crop=faces&crop=entropy&cs=faces&fit=crop&h=150&w=150&auto=format&q=80',
    qualifications: 'MBBS, MD, DM Hematology'
  },
  {
    id: 19,
    name: 'Dr. Anil Khanna',
    specialty: 'ENT',
    experience: 15,
    rating: 4.7,
    fee: 550,
    available: false,
    nextSlot: 'Tomorrow, 5:00 PM',
    location: 'Chandigarh',
    photo: 'https://images.unsplash.com/photo-1643297654614-95d3ce4ae6e4?w=150&h=150&fit=crop&crop=face',
    qualifications: 'MBBS, MS ENT'
  },
  {
    id: 20,
    name: 'Dr. Radhika Rao',
    specialty: 'Anesthesiology',
    experience: 10,
    rating: 4.4,
    fee: 500,
    available: true,
    nextSlot: 'Tomorrow, 2:00 PM',
    location: 'Mangalore',
    photo: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=150&h=150&fit=crop&crop=faces&crop=entropy&cs=faces&fit=crop&h=150&w=150&auto=format&q=80',
    qualifications: 'MBBS, MD Anesthesiology'
  },
  {
    id: 21,
    name: 'Dr. Ashok Mishra',
    specialty: 'Radiology',
    experience: 18,
    rating: 4.6,
    fee: 600,
    available: false,
    nextSlot: 'Tomorrow, 6:00 PM',
    location: 'Patna',
    photo: 'https://images.unsplash.com/photo-1622902044190-bcfe44b44b49?w=150&h=150&fit=crop&crop=face',
    qualifications: 'MBBS, MD Radiology'
  },
  {
    id: 22,
    name: 'Dr. Nidhi Agrawal',
    specialty: 'Pathology',
    experience: 12,
    rating: 4.5,
    fee: 450,
    available: true,
    nextSlot: 'Tomorrow, 3:00 PM',
    location: 'Nagpur',
    photo: 'https://images.unsplash.com/photo-1594736797933-d0871ba4a803?w=150&h=150&fit=crop&crop=faces&crop=entropy&cs=faces&fit=crop&h=150&w=150&auto=format&q=80',
    qualifications: 'MBBS, MD Pathology'
  },
  {
    id: 23,
    name: 'Dr. Sanjay Kulkarni',
    specialty: 'Emergency Medicine',
    experience: 8,
    rating: 4.3,
    fee: 400,
    available: true,
    nextSlot: 'Today, 10:00 PM',
    location: 'Pune',
    photo: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=150&h=150&fit=crop&crop=faces&crop=entropy&cs=faces&fit=crop&h=150&w=150&auto=format&q=70',
    qualifications: 'MBBS, MD Emergency Medicine'
  },
  {
    id: 24,
    name: 'Dr. Vaishali Singh',
    specialty: 'Infectious Diseases',
    experience: 14,
    rating: 4.7,
    fee: 750,
    available: false,
    nextSlot: 'Tomorrow, 7:00 PM',
    location: 'Gurgaon',
    photo: 'https://images.unsplash.com/photo-1618498082410-b4aa22193b38?w=150&h=150&fit=crop&crop=face',
    qualifications: 'MBBS, MD, DM Infectious Diseases'
  },
  {
    id: 25,
    name: 'Dr. Ramesh Chandra',
    specialty: 'Sports Medicine',
    experience: 11,
    rating: 4.4,
    fee: 650,
    available: true,
    nextSlot: 'Tomorrow, 8:00 AM',
    location: 'Dehradun',
    photo: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=150&h=150&fit=crop&crop=faces&crop=entropy&cs=faces&fit=crop&h=150&w=150&auto=format&q=60',
    qualifications: 'MBBS, DNB Sports Medicine'
  },
  {
    id: 26,
    name: 'Dr. Pallavi Jain',
    specialty: 'Nutrition',
    experience: 7,
    rating: 4.2,
    fee: 350,
    available: true,
    nextSlot: 'Today, 11:00 PM',
    location: 'Surat',
    photo: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=150&h=150&fit=crop&crop=face',
    qualifications: 'MSc Nutrition, PhD'
  },
  {
    id: 27,
    name: 'Dr. Harish Bhatia',
    specialty: 'Geriatrics',
    experience: 22,
    rating: 4.8,
    fee: 800,
    available: false,
    nextSlot: 'Tomorrow, 9:00 AM',
    location: 'Shimla',
    photo: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=150&h=150&fit=crop&crop=faces&crop=entropy&cs=faces&fit=crop&h=150&w=150&auto=format&q=90',
    qualifications: 'MBBS, MD Geriatrics'
  },
  {
    id: 28,
    name: 'Dr. Shweta Kapoor',
    specialty: 'Pediatric Surgery',
    experience: 13,
    rating: 4.9,
    fee: 1000,
    available: true,
    nextSlot: 'Tomorrow, 10:00 AM',
    location: 'Delhi',
    photo: 'https://images.unsplash.com/photo-1582053433976-25c00369fc93?w=150&h=150&fit=crop&crop=face',
    qualifications: 'MBBS, MS, MCh Pediatric Surgery'
  },
  {
    id: 29,
    name: 'Dr. Ganesh Pillai',
    specialty: 'Cardiac Surgery',
    experience: 25,
    rating: 4.9,
    fee: 2000,
    available: false,
    nextSlot: 'Tomorrow, 11:00 AM',
    location: 'Mumbai',
    photo: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=150&h=150&fit=crop&crop=faces&crop=entropy&cs=faces&fit=crop&h=150&w=150&auto=format&q=50',
    qualifications: 'MBBS, MS, MCh Cardiac Surgery'
  },
  {
    id: 30,
    name: 'Dr. Rekha Malhotra',
    specialty: 'Ayurveda',
    experience: 16,
    rating: 4.6,
    fee: 500,
    available: true,
    nextSlot: 'Tomorrow, 12:00 PM',
    location: 'Rishikesh',
    photo: 'https://images.unsplash.com/photo-1594824475497-d0656fabb7dd?w=150&h=150&fit=crop&crop=faces&crop=entropy&cs=faces&fit=crop&h=150&w=150&auto=format&q=95',
    qualifications: 'BAMS, MD Ayurveda'
  }
];

// Get unique specialties for filter
const getUniqueSpecialties = () => {
  const specialties = doctorsData.map(doctor => doctor.specialty);
  return [...new Set(specialties)].sort();
};

export default function DoctorsPage() {
  const [language, setLanguage] = useState('en');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('');
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [appointmentDialog, setAppointmentDialog] = useState(false);
  
  const t = translations[language];
  const specialties = getUniqueSpecialties();

  // Filter doctors based on search term and specialty
  const filteredDoctors = doctorsData.filter(doctor => {
    const matchesSearch = doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doctor.specialty.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doctor.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSpecialty = selectedSpecialty === '' || doctor.specialty === selectedSpecialty;
    return matchesSearch && matchesSpecialty;
  });

  const handleBookAppointment = (doctor) => {
    setSelectedDoctor(doctor);
    setAppointmentDialog(true);
  };

  const DoctorCard = ({ doctor }) => (
    <Card 
      elevation={2} 
      sx={{ 
        height: '100%',
        transition: 'all 0.3s ease',
        '&:hover': {
          elevation: 8,
          transform: 'translateY(-4px)'
        },
        opacity: doctor.available ? 1 : 0.7,
        border: doctor.available ? '2px solid transparent' : '2px solid #e0e0e0'
      }}
    >
      <CardContent sx={{ p: 3 }}>
        {/* Doctor Header */}
        <Stack direction="row" spacing={2} mb={2}>
          <Avatar
            src={doctor.photo}
            sx={{ width: 80, height: 80 }}
          >
            <LocalHospitalIcon sx={{ fontSize: 40 }} />
          </Avatar>
          <Box flex={1}>
            <Typography variant="h6" fontWeight="bold" mb={0.5}>
              {doctor.name}
            </Typography>
            <Typography variant="body2" color="primary" fontWeight={600} mb={0.5}>
              {doctor.specialty}
            </Typography>
            <Stack direction="row" alignItems="center" spacing={1} mb={1}>
              <Rating value={doctor.rating} precision={0.1} size="small" readOnly />
              <Typography variant="caption" color="text.secondary">
                {doctor.rating} • {doctor.experience} {t.years} {t.experience}
              </Typography>
            </Stack>
            <Stack direction="row" alignItems="center" spacing={1}>
              <LocationIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
              <Typography variant="caption" color="text.secondary">
                {doctor.location}
              </Typography>
            </Stack>
          </Box>
          <Box textAlign="right">
            <Chip
              label={doctor.available ? t.available : t.notAvailable}
              color={doctor.available ? 'success' : 'error'}
              size="small"
              sx={{ mb: 1 }}
            />
          </Box>
        </Stack>

        <Divider sx={{ my: 2 }} />

        {/* Doctor Details */}
        <Stack spacing={2}>
          <Box>
            <Typography variant="caption" color="text.secondary" display="block">
              {t.consultationFee}
            </Typography>
            <Typography variant="h6" color="primary" fontWeight="bold">
              ₹{doctor.fee} {t.perHour}
            </Typography>
          </Box>
          
          <Box>
            <Typography variant="caption" color="text.secondary" display="block">
              {t.nextAvailable}
            </Typography>
            <Typography variant="body2" fontWeight={600}>
              {doctor.nextSlot}
            </Typography>
          </Box>

          <Box>
            <Typography variant="caption" color="text.secondary" display="block" mb={1}>
              Qualifications
            </Typography>
            <Typography variant="body2" sx={{ fontSize: '0.8rem' }}>
              {doctor.qualifications}
            </Typography>
          </Box>
        </Stack>

        <Divider sx={{ my: 2 }} />

        {/* Action Buttons */}
        <Stack spacing={1}>
          <Button
            variant="contained"
            fullWidth
            startIcon={<ScheduleIcon />}
            onClick={() => handleBookAppointment(doctor)}
            disabled={!doctor.available}
            sx={{
              backgroundColor: doctor.available ? '#1976d2' : '#e0e0e0',
              '&:hover': {
                backgroundColor: doctor.available ? '#1565c0' : '#e0e0e0'
              }
            }}
          >
            {t.bookAppointment}
          </Button>
          <Button
            variant="outlined"
            fullWidth
            startIcon={<VideoCallIcon />}
            disabled={!doctor.available}
            sx={{ borderColor: doctor.available ? '#4caf50' : '#e0e0e0' }}
          >
            {t.videoConsult}
          </Button>
        </Stack>
      </CardContent>
    </Card>
  );

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#f8f9fa', p: 3 }}>
      {/* Header */}
      <Paper elevation={2} sx={{ p: 3, mb: 3, borderRadius: 3 }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={3}>
          <Stack direction="row" alignItems="center" spacing={2}>
            <LocalHospitalIcon sx={{ fontSize: 40, color: '#1976d2' }} />
            <Typography variant="h4" fontWeight="bold" color="primary">
              {t.doctors}
            </Typography>
          </Stack>
          
          {/* Language Selector */}
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <Select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
            >
              <MenuItem value="en">English</MenuItem>
              <MenuItem value="hi">हिन्दी</MenuItem>
              <MenuItem value="kn">ಕನ್ನಡ</MenuItem>
            </Select>
          </FormControl>
        </Stack>

        {/* Search and Filter */}
        <Grid container spacing={2}>
          <Grid item xs={12} md={8}>
            <TextField
              fullWidth
              placeholder={t.searchDoctors}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon color="action" />
                  </InputAdornment>
                ),
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 3
                }
              }}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <FormControl fullWidth>
              <InputLabel>{t.filterBy}</InputLabel>
              <Select
                value={selectedSpecialty}
                label={t.filterBy}
                onChange={(e) => setSelectedSpecialty(e.target.value)}
                startAdornment={<FilterIcon sx={{ mr: 1, color: 'action.active' }} />}
                sx={{ borderRadius: 3 }}
              >
                <MenuItem value="">{t.allSpecialties}</MenuItem>
                {specialties.map((specialty) => (
                  <MenuItem key={specialty} value={specialty}>
                    {specialty}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Paper>

      {/* Results Summary */}
      <Paper elevation={1} sx={{ p: 2, mb: 3, borderRadius: 2 }}>
        <Typography variant="body1" color="text.secondary">
          Showing {filteredDoctors.length} doctors
          {selectedSpecialty && ` for ${selectedSpecialty}`}
          {searchTerm && ` matching "${searchTerm}"`}
        </Typography>
      </Paper>

      {/* Doctors Grid */}
      <Grid container spacing={3}>
        {filteredDoctors.map((doctor) => (
          <Grid item xs={12} sm={6} lg={4} key={doctor.id}>
            <DoctorCard doctor={doctor} />
          </Grid>
        ))}
      </Grid>

      {filteredDoctors.length === 0 && (
        <Paper elevation={1} sx={{ p: 4, textAlign: 'center', mt: 3, borderRadius: 3 }}>
          <LocalHospitalIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h6" color="text.secondary" mb={1}>
            No doctors found
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Try adjusting your search criteria or filters
          </Typography>
        </Paper>
      )}

      {/* Appointment Booking Dialog */}
      <Dialog
        open={appointmentDialog}
        onClose={() => setAppointmentDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        {selectedDoctor && (
          <>
            <DialogTitle>
              <Stack direction="row" alignItems="center" spacing={2}>
                <Avatar src={selectedDoctor.photo} sx={{ width: 50, height: 50 }} />
                <Box>
                  <Typography variant="h6">{selectedDoctor.name}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {selectedDoctor.specialty}
                  </Typography>
                </Box>
              </Stack>
            </DialogTitle>
            <DialogContent>
              <Stack spacing={3} sx={{ mt: 2 }}>
                <Box>
                  <Typography variant="subtitle2" mb={1}>
                    {t.consultationFee}
                  </Typography>
                  <Typography variant="h5" color="primary" fontWeight="bold">
                    ₹{selectedDoctor.fee} {t.perHour}
                  </Typography>
                </Box>
                
                <Box>
                  <Typography variant="subtitle2" mb={1}>
                    {t.nextAvailable}
                  </Typography>
                  <Typography variant="body1" fontWeight={600}>
                    {selectedDoctor.nextSlot}
                  </Typography>
                </Box>

                <TextField
                  fullWidth
                  label="Reason for Visit"
                  multiline
                  rows={3}
                  placeholder="Describe your symptoms or reason for consultation..."
                />
              </Stack>
            </DialogContent>
            <DialogActions sx={{ p: 3, gap: 2 }}>
              <Button onClick={() => setAppointmentDialog(false)}>
                Cancel
              </Button>
              <Button 
                variant="contained" 
                startIcon={<ScheduleIcon />}
                sx={{ px: 3 }}
              >
                Confirm Booking
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Box>
  );
}
