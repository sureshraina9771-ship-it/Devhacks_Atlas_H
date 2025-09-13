import { useState } from 'react';
import { Avatar, Button, TextField, Paper, Box, Typography } from '@mui/material';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';

export default function SignInPage({ onSignIn }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = e => {
    e.preventDefault();
    // Call your backend login API here, then call onSignIn() on success
    onSignIn && onSignIn(username);
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        width: '100vw',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #c843f5ff 0%, #065494ff 100%)'
      }}
    >
      <Paper elevation={6} sx={{ p: 6, borderRadius: 6, minWidth: 400, maxWidth: 500, width: '100%' }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Avatar sx={{ m: 1, bgcolor: 'primary.main', width: 70, height: 70 }}>
            <LocalHospitalIcon fontSize="large" />
          </Avatar>
          <Typography component="h1" variant="h4" sx={{ fontWeight: 700, color: 'primary.main', mb: 1 }}>
            Gramin Swasthya Setu
          </Typography>
          <Typography variant="subtitle1" sx={{ mb: 3, color: '#555' }}>
            Sign in to your account
          </Typography>
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1, width: '100%' }}>
            <TextField
              margin="normal"
              required
              fullWidth
              label="Username"
              autoFocus
              value={username}
              onChange={e => setUsername(e.target.value)}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              label="Password"
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              sx={{ mt: 3, mb: 2, fontWeight: 700, fontSize: 24 }}
            >
              Sign In
            </Button>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
}