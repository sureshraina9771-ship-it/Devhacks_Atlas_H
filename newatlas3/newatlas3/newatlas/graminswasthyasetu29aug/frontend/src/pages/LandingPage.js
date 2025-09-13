import { Box, Typography, Button, Paper } from '@mui/material';

export default function LandingPage({ onStart }) {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        width: '100vw',
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      {/* Video Background */}
      <video
        autoPlay
        loop
        muted
        style={{
          position: 'absolute',
          width: '100vw',
          height: '100vh',
          objectFit: 'cover',
          left: 0,
          top: 0,
          zIndex: 0
        }}
      >
        <source src="https://www.w3schools.com/howto/rain.mp4" type="video/mp4" />
        {/* Replace with your own healthcare video URL if desired */}
      </video>
      {/* Overlay for darkening video */}
      <Box
        sx={{
          position: 'absolute',
          width: '100vw',
          height: '100vh',
          left: 0,
          top: 0,
          
          zIndex: 1
        }}
      />
      {/* Fade-in Card */}
      <Paper
        elevation={8}
        sx={{
          px: 8,
          py: 6,
          borderRadius: 6,
          textAlign: 'center',
          background: 'rgba(255,255,255,0.95)',
          zIndex: 2,
          minWidth: 340,
          maxWidth: 500,
          animation: 'fadeIn 1.5s'
        }}
      >
        <img
          src="https://cdn-icons-png.flaticon.com/512/3774/3774299.png"
          alt="Logo"
          style={{
            width: 80,
            height: 80,
            marginBottom: 16,
            borderRadius: '50%',
            boxShadow: '0 4px 24px #1976d299'
          }}
        />
        <Typography
          variant="h2"
          sx={{
            fontWeight: 900,
            mb: 2,
            letterSpacing: 2,
            color: '#1976d2',
            textShadow: '2px 2px 8px #43a04788, 0 0 2px #fff',
            fontFamily: '"Segoe UI", "Roboto", "Arial", sans-serif',
            textTransform: 'uppercase'
          }}
        >
          Gramin Swasthya Setu
        </Typography>
        <Typography variant="h5" sx={{ color: '#43a047', mb: 4, fontWeight: 700 }}>
          Empowering Rural Healthcare with Technology
        </Typography>
        <Button
          variant="contained"
          size="large"
          sx={{
            fontWeight: 700,
            fontSize: 22,
            px: 4,
            py: 1,
            borderRadius: 3,
            background: 'linear-gradient(90deg, #1976d2 60%, #43a047 100%)',
            boxShadow: '0 4px 16px #1976d299',
            color: '#fff',
            '&:hover': {
              background: 'linear-gradient(90deg, #43a047 60%, #1976d2 100%)'
            }
          }}
          onClick={onStart}
        >
          Get Started
        </Button>
      </Paper>
      {/* Fade-in animation keyframes */}
      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(40px);}
            to { opacity: 1; transform: translateY(0);}
          }
        `}
      </style>
    </Box>
  );
}