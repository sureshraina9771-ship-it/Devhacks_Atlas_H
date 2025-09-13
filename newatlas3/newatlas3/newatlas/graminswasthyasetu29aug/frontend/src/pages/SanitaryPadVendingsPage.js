import { Box, Typography } from '@mui/material';

export default function SanitaryPadVendingsPage() {
  return (
    <Box sx={{ minHeight: '70vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Typography variant="h1" fontWeight={900} color="secondary" sx={{ fontSize: { xs: 40, md: 80 } }}>
        Coming Soon
      </Typography>
    </Box>
  );
}