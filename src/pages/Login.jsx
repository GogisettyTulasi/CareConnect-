import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Alert,
  InputAdornment,
  IconButton,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import VolunteerActivismIcon from '@mui/icons-material/VolunteerActivism';
import { useAuth } from '../context/AuthContext';
import { useSnackbar } from '../context/SnackbarContext';

export default function Login() {
  const navigate = useNavigate();
  const theme = useTheme();
  const isSmall = useMediaQuery(theme.breakpoints.down('sm'));
  const { login, user, isAuthenticated } = useAuth();
  const { showSuccess, showError } = useSnackbar();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated && user) {
      const role = user.role;
      if (role === 'Admin') navigate('/admin', { replace: true });
      else if (role === 'Logistics') navigate('/logistics', { replace: true });
      else navigate('/', { replace: true });
    }
  }, [isAuthenticated, user, navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!email.trim()) {
      setError('Email is required');
      return;
    }
    if (!password) {
      setError('Password is required');
      return;
    }

    setLoading(true);
    try {
      login(email.trim(), password);
      showSuccess('Login successful');

      const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
      const role = currentUser.role;

      if (role === 'Admin') {
        navigate('/admin', { replace: true });
      } else if (role === 'Logistics') {
        navigate('/logistics', { replace: true });
      } else if (role === 'Donor') {
        navigate('/', { replace: true });
      } else if (role === 'Recipient') {
        navigate('/', { replace: true });
      } else {
        navigate('/', { replace: true });
      }
    } catch (err) {
      const msg = err?.message || 'Invalid email or password';
      setError(msg);
      showError(msg);
    } finally {
      setLoading(false);
    }
  };

  const formCard = (
    <Card elevation={2} sx={{ maxWidth: 420, width: '100%', borderRadius: 3 }}>
      <CardContent sx={{ p: { xs: 3, sm: 4 } }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
          <VolunteerActivismIcon color="primary" sx={{ fontSize: 36 }} />
          <Typography variant="h5" fontWeight={600}>
            Welcome back
          </Typography>
        </Box>

        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Sign in to CareConnect to donate or request items.
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
            {error}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit} noValidate>
          <TextField
            fullWidth
            label="Email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            margin="normal"
            required
            autoFocus
            sx={{ mb: 1.5 }}
          />

          <TextField
            fullWidth
            label="Password"
            type={showPassword ? 'text' : 'password'}
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            margin="normal"
            required
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowPassword(!showPassword)}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
            sx={{ mb: 2 }}
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            size="large"
            disabled={loading}
            sx={{ py: 1.5, mb: 2 }}
          >
            {loading ? 'Signing in…' : 'Login'}
          </Button>

          <Typography variant="body2" color="text.secondary" textAlign="center">
            Don&apos;t have an account?{' '}
            <Link
              to="/signup"
              style={{
                color: theme.palette.primary.main,
                fontWeight: 600,
              }}
            >
              Sign Up
            </Link>
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );

  const heroSide = (
    <Box
      sx={{
        background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
        borderRadius: 3,
        p: 4,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        minHeight: 320,
        color: 'white',
      }}
    >
      <VolunteerActivismIcon sx={{ fontSize: 56, mb: 2, opacity: 0.95 }} />
      <Typography variant="h5" fontWeight={600} gutterBottom>
        Share what you can. Help who you can.
      </Typography>
      <Typography variant="body2" sx={{ opacity: 0.9 }}>
        CareConnect connects donors with people in need. Donate food, clothes, and more in a few clicks.
      </Typography>
    </Box>
  );

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'background.default',
        p: 2,
      }}
    >
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: isSmall ? '1fr' : '1fr 1fr',
          gap: 4,
          alignItems: 'center',
          maxWidth: 900,
          width: '100%',
        }}
      >
        {!isSmall && heroSide}
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          {formCard}
        </Box>
        {isSmall && heroSide}
      </Box>
    </Box>
  );
}
