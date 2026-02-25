import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Chip,
  Card,
  CardContent,
  CircularProgress,
  Alert,
} from '@mui/material';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import { getAcceptedRequests } from '../services/requestService';
import { useSnackbar } from '../context/SnackbarContext';

function friendlyMessage(err) {
  const msg = err?.message || '';
  if (msg.toLowerCase().includes('network')) return 'Something went wrong. Please try again.';
  return msg || 'Something went wrong. Please try again.';
}

const PICKUP_STATUS_COLOR = {
  PENDING: 'warning',
  SCHEDULED: 'info',
  PICKED_UP: 'success',
};

export default function Coordinator() {
  const { showError } = useSnackbar();
  const [accepted, setAccepted] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadAccepted = () => {
    setLoading(true);
    setError('');
    getAcceptedRequests()
      .then((data) => setAccepted(Array.isArray(data) ? data : []))
      .catch((err) => {
        const msg = friendlyMessage(err);
        setError(msg);
        showError(msg);
        setAccepted([]);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadAccepted();
  }, []);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight={300}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" fontWeight={600} gutterBottom>
        Coordinator panel
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        Manage accepted donations and pickup status.
      </Typography>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}
      <Card>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
            <LocalShippingIcon color="primary" />
            <Typography variant="h6" fontWeight={600}>
              Accepted donations (pickup list)
            </Typography>
          </Box>
          {accepted.length === 0 ? (
            <Typography color="text.secondary">No accepted requests at the moment.</Typography>
          ) : (
            <List disablePadding>
              {accepted.map((req) => (
                <ListItem key={req.id} divider sx={{ flexWrap: 'wrap' }}>
                  <ListItemText
                    primary={req.donation?.title ?? 'Donation'}
                    secondary={`Category: ${req.donation?.category ?? '-'} • Request ID: ${req.id}`}
                  />
                  <ListItemSecondaryAction sx={{ position: 'relative', transform: 'none' }}>
                    <Chip
                      label={req.pickupStatus || 'PENDING'}
                      size="small"
                      color={PICKUP_STATUS_COLOR[req.pickupStatus] || 'default'}
                      sx={{ textTransform: 'capitalize' }}
                    />
                  </ListItemSecondaryAction>
                </ListItem>
              ))}
            </List>
          )}
        </CardContent>
      </Card>
    </Box>
  );
}
