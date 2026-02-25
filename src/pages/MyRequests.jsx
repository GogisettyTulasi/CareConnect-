import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Chip,
  Alert,
  CircularProgress,
  Card,
  CardContent,
  Button,
} from '@mui/material';
import { getMyRequests, updateRequest } from '../services/requestService';
import { useSnackbar } from '../context/SnackbarContext';
import CancelIcon from '@mui/icons-material/Cancel';

function friendlyMessage(err) {
  const msg = err?.message || '';
  if (msg.toLowerCase().includes('network')) return 'Something went wrong. Please try again.';
  return msg || 'Something went wrong. Please try again.';
}

const STATUS_COLOR = {
  PENDING: 'warning',
  Requested: 'warning',
  ACCEPTED: 'success',
  Approved: 'success',
  REJECTED: 'error',
  'Cancelled by Recipient': 'default',
};

export default function MyRequests() {
  const { showError, showSuccess } = useSnackbar();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [cancellingId, setCancellingId] = useState(null);

  const loadRequests = () => {
    setLoading(true);
    setError('');
    getMyRequests()
      .then((data) => setRequests(Array.isArray(data) ? data : []))
      .catch((err) => {
        const msg = friendlyMessage(err);
        setError(msg);
        showError(msg);
        setRequests([]);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadRequests();
  }, [showError]);

  const handleCancelRequest = async (req) => {
    setCancellingId(req.id);
    try {
      await updateRequest(req.id, { status: 'Cancelled by Recipient' });
      showSuccess('Request cancelled');
      loadRequests();
    } catch (err) {
      showError(friendlyMessage(err));
    } finally {
      setCancellingId(null);
    }
  };

  const canCancel = (req) => {
    const s = req.status || '';
    return ['PENDING', 'Requested', 'ACCEPTED', 'Approved'].includes(s) && req.status !== 'Cancelled by Recipient';
  };

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
        My Requests
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        Track your requests for donated items.
      </Typography>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}
      <Card>
        <CardContent>
          {requests.length === 0 ? (
            <Typography color="text.secondary">
              You have no requests yet. Browse items to request something.
            </Typography>
          ) : (
            <List disablePadding>
              {requests.map((req) => (
                <ListItem
                  key={req.id}
                  divider
                  sx={{ flexWrap: 'wrap', alignItems: 'flex-start' }}
                >
                  <ListItemText
                    primary={req.donation?.title ?? 'Donation'}
                    secondary={
                      <>
                        <Typography component="span" variant="body2" color="text.secondary">
                          {req.donation?.category ?? '-'} • {req.message || 'No message'}
                        </Typography>
                      </>
                    }
                  />
                  <ListItemSecondaryAction sx={{ position: 'relative', transform: 'none', mt: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Chip
                      label={req.status || 'PENDING'}
                      size="small"
                      color={STATUS_COLOR[req.status] || 'default'}
                      sx={{ textTransform: 'capitalize' }}
                    />
                    {canCancel(req) && (
                      <Button
                        size="small"
                        color="error"
                        variant="outlined"
                        startIcon={<CancelIcon />}
                        onClick={() => handleCancelRequest(req)}
                        disabled={!!cancellingId}
                      >
                        Cancel Request
                      </Button>
                    )}
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
