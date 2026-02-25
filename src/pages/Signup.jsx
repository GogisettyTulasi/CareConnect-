import React, { useState } from 'react';
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
  MenuItem,
} from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import VolunteerActivismIcon from '@mui/icons-material/VolunteerActivism';
import { useAuth } from '../context/AuthContext';
import { useSnackbar } from '../context/SnackbarContext';

const ROLE_OPTIONS = [
  { value: 'User', label: '👤 User' },
  { value: 'Admin', label: '👨‍💼 Admin' },
  { value: 'Logistics', label: '🚚 Logistics' },
];

export default function Signup() {
  const navigate = useNavigate();
  const theme = useTheme();
  const isSmall = useMediaQuery(theme.breakpoints.down('sm'));
  const { signup } = useAuth();
  const { showSuccess, showError } = useSnackbar();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('User');
  const [phone, setPhone] = useState('');
  const [location, setLocation] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!name.trim()) return setError('Name is required');
    if (!email.trim()) return setError('Email is required');
    if (!password) return setError('Password is required');
    if (password.length < 6)
      return setError('Password must be at least 6 characters');

    setLoading(true);

    try {
      signup({
        name: name.trim(),
        email: email.trim(),
        password,
        role,
        phone: phone.trim(),
        location: location.trim(),
      });

      showSuccess('Account created successfully!');
      navigate('/login');
    } catch (err) {
      const msg = err?.message || 'Signup failed';
      setError(msg);
      showError(msg);
    } finally {
      setLoading(false);
    }
  };

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
      <Card sx={{ maxWidth: 420, width: '100%', borderRadius: 3 }}>
        <CardContent sx={{ p: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
            <VolunteerActivismIcon color="primary" sx={{ fontSize: 36 }} />
            <Typography variant="h5" fontWeight={600}>
              Create Account
            </Typography>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit} noValidate>
            <TextField
              fullWidth
              label="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              margin="normal"
              required
            />

            <TextField
              fullWidth
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              margin="normal"
              required
            />

            <TextField
              fullWidth
              label="Password"
              type={showPassword ? 'text' : 'password'}
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
            />

            <TextField
              fullWidth
              select
              label="Role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              margin="normal"
            >
              {ROLE_OPTIONS.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              fullWidth
              label="Phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              margin="normal"
            />

            <TextField
              fullWidth
              label="Location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              margin="normal"
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={loading}
              sx={{ mt: 2 }}
            >
              {loading ? 'Creating Account...' : 'Create Account'}
            </Button>

            <Typography
              variant="body2"
              color="text.secondary"
              textAlign="center"
              sx={{ mt: 2 }}
            >
              Already have an account?{' '}
              <Link
                to="/login"
                style={{ color: theme.palette.primary.main }}
              >
                Login
              </Link>
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}