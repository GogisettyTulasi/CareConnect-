import React from 'react';
import { Box, Container, Typography, Link } from '@mui/material';
import VolunteerActivismIcon from '@mui/icons-material/VolunteerActivism';

export default function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        py: 4,
        px: 2,
        mt: 'auto',
        backgroundColor: 'secondary.dark',
        borderTop: '1px solid',
        borderColor: 'divider',
      }}
    >
      <Container maxWidth="lg">
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 2,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <VolunteerActivismIcon color="primary" />
            <Typography variant="subtitle1" fontWeight={600} color="text.primary">
              CareConnect
            </Typography>
          </Box>
          <Typography variant="body2" color="text.secondary">
            Donate food, clothes & more. Connect with those in need.
          </Typography>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Link href="#" color="text.secondary" underline="hover" variant="body2">
              Privacy
            </Link>
            <Link href="#" color="text.secondary" underline="hover" variant="body2">
              Terms
            </Link>
            <Link href="#" color="text.secondary" underline="hover" variant="body2">
              Contact
            </Link>
          </Box>
        </Box>
        <Typography variant="caption" color="text.secondary" display="block" textAlign="center" sx={{ mt: 2 }}>
          © {new Date().getFullYear()} CareConnect. All rights reserved.
        </Typography>
      </Container>
    </Box>
  );
}
