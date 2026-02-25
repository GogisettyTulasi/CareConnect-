import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  TextField,
  InputAdornment,
  Alert,
  CircularProgress,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { getDonations } from '../services/donationService';
import { createRequest } from '../services/requestService';
import { useSnackbar } from '../context/SnackbarContext';
import { useAuth } from '../context/AuthContext';

function friendlyError(err) {
  const msg = err?.message || '';
  if (msg.toLowerCase().includes('network')) return 'Something went wrong. Please try again.';
  return msg || 'Something went wrong. Please try again.';
}

export default function BrowseItems() {
  const { user: currentUser } = useAuth();
  const { showSuccess, showError } = useSnackbar();
  const [items, setItems] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [requestingId, setRequestingId] = useState(null);

  const filteredItems = items.filter(
    (item) =>
      (item.title || '').toLowerCase().includes(search.toLowerCase()) ||
      (item.category || '').toLowerCase().includes(search.toLowerCase()) ||
      (item.location || '').toLowerCase().includes(search.toLowerCase())
  );

  const loadItems = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await getDonations();
      setItems(Array.isArray(data) ? data : []);
    } catch (err) {
      const msg = friendlyError(err);
      setError(msg);
      showError(msg);
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadItems();
  }, []);

  const handleRequest = async (donationId) => {
    setError('');
    setRequestingId(donationId);
    try {
      await createRequest({ donationId, quantityRequested: 1, message: 'I would like to receive this item.' });
      showSuccess('Request submitted successfully');
      await loadItems();
    } catch (err) {
      const msg = friendlyError(err);
      setError(msg);
      showError(msg);
    } finally {
      setRequestingId(null);
    }
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
        Browse items
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
        Request items you need. Donors and coordinators will follow up.
      </Typography>
      <TextField
        fullWidth
        placeholder="Search by name, category, or location…"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        size="small"
        sx={{ mb: 3, maxWidth: 400 }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon color="action" />
            </InputAdornment>
          ),
        }}
        inputProps={{ 'aria-label': 'Search items' }}
      />
      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}
      <Grid container spacing={3}>
        {items.length === 0 && (
          <Grid item xs={12}>
            <Typography color="text.secondary">No donations available yet. Check back later or add your own.</Typography>
          </Grid>
        )}
        {filteredItems.length === 0 && items.length > 0 && (
          <Grid item xs={12}>
            <Typography color="text.secondary">No items match your search.</Typography>
          </Grid>
        )}
        {filteredItems.map((item) => {
          const requests = Array.isArray(item.requests) ? item.requests : [];
          const totalRequested = requests.reduce((s, r) => s + (r.quantityRequested || 0), 0);
          const quantity = item.quantity ?? 1;
          const available = Math.max(0, quantity - totalRequested);
          const requestedByCurrentUser = currentUser && requests.some((r) => r.userId === currentUser.id);
          const showRequestButton = available > 0;
          return (
            <Grid item xs={12} sm={6} md={4} key={item.id}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography variant="h6" fontWeight={600} sx={{ mb: 1 }}>
                    {item.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    {item.category}
                    {item.location ? ` · ${item.location}` : ''}
                  </Typography>
                  {item.description && (
                    <Typography variant="body2" sx={{ mt: 1 }}>
                      {item.description}
                    </Typography>
                  )}
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    Qty: {quantity}
                  </Typography>
                </CardContent>
                <CardActions sx={{ px: 2, pb: 2 }}>
                  {requestedByCurrentUser && (
                    <Typography variant="body2" color="primary.main" fontWeight={500}>
                      Requested by you
                    </Typography>
                  )}
                  {!requestedByCurrentUser && showRequestButton && (
                    <Button
                      variant="contained"
                      size="small"
                      color="primary"
                      onClick={() => handleRequest(item.id)}
                      disabled={!!requestingId}
                    >
                      {requestingId === item.id ? 'Submitting…' : 'Request'}
                    </Button>
                  )}
                  {!requestedByCurrentUser && !showRequestButton && (
                    <Typography variant="body2" color="text.secondary">
                      Currently unavailable
                    </Typography>
                  )}
                </CardActions>
              </Card>
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
}
