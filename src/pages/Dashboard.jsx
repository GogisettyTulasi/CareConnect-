import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Button, Card, CardContent, Grid } from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import StorefrontIcon from '@mui/icons-material/Storefront';
import RequestPageIcon from '@mui/icons-material/RequestPage';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import { useAuth } from '../context/AuthContext';

const ROLE_LABELS = {
  User: 'User',
  Admin: 'Administrator',
  Logistics: 'Logistics Coordinator',
};

export default function Dashboard() {
  const navigate = useNavigate();
  const { user, isAdmin, isLogistics } = useAuth();

  const name = user?.name || user?.email?.split('@')[0] || 'User';
  const roleLabel = ROLE_LABELS[user?.role] || 'User';

  const quickActions = [
    { label: 'Donate Items', path: '/donate', icon: <AddCircleOutlineIcon />, primary: true },
    { label: 'Browse Items', path: '/browse', icon: <StorefrontIcon /> },
    { label: 'My Requests', path: '/my-requests', icon: <RequestPageIcon /> },
    { label: 'My Donations', path: '/my-donations', icon: <LocalShippingIcon /> },
  ];

  return (
    <Box>
      <Typography variant="h4" fontWeight={600} gutterBottom>
        Hello, {name}
      </Typography>

      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        You are logged in as <strong>{roleLabel}</strong>.
      </Typography>

      <Grid container spacing={3}>

        {/* NORMAL USER */}
        {user?.role === 'User' &&
          quickActions.map(({ label, path, icon, primary }) => (
            <Grid item xs={12} sm={6} md={3} key={path}>
              <Card
                sx={{
                  height: '100%',
                  cursor: 'pointer',
                  transition: 'box-shadow 0.2s, transform 0.2s',
                  '&:hover': { boxShadow: 4, transform: 'translateY(-2px)' },
                }}
                onClick={() => navigate(path)}
              >
                <CardContent sx={{ textAlign: 'center', py: 3 }}>
                  <Box sx={{ color: primary ? 'primary.main' : 'text.secondary', mb: 1 }}>
                    {React.cloneElement(icon, { sx: { fontSize: 48 } })}
                  </Box>
                  <Typography variant="h6" fontWeight={600} gutterBottom>
                    {label}
                  </Typography>
                  <Button variant={primary ? 'contained' : 'outlined'} size="small">
                    Go
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}

        {/* ADMIN */}
        {isAdmin && (
          <Grid item xs={12} sm={6} md={4}>
            <Card
              sx={{
                cursor: 'pointer',
                '&:hover': { boxShadow: 4, transform: 'translateY(-2px)' },
              }}
              onClick={() => navigate('/admin')}
            >
              <CardContent sx={{ textAlign: 'center', py: 3 }}>
                <AdminPanelSettingsIcon sx={{ fontSize: 48, color: 'primary.main' }} />
                <Typography variant="h6" fontWeight={600}>
                  Admin Dashboard
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        )}

        {/* LOGISTICS */}
        {isLogistics && (
          <Grid item xs={12} sm={6} md={4}>
            <Card
              sx={{
                cursor: 'pointer',
                '&:hover': { boxShadow: 4, transform: 'translateY(-2px)' },
              }}
              onClick={() => navigate('/logistics')}
            >
              <CardContent sx={{ textAlign: 'center', py: 3 }}>
                <LocalShippingIcon sx={{ fontSize: 48, color: 'primary.main' }} />
                <Typography variant="h6" fontWeight={600}>
                  Logistics Dashboard
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        )}

      </Grid>
    </Box>
  );
}