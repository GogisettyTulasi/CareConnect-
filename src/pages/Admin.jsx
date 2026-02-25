import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  CircularProgress,
  Alert,
} from '@mui/material';
import DonationSummaryIcon from '@mui/icons-material/Inventory';
import RequestSummaryIcon from '@mui/icons-material/Assignment';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { getDonations } from '../services/donationService';
import { getRequests } from '../services/requestService';
import { useSnackbar } from '../context/SnackbarContext';

function friendlyMessage(err) {
  const msg = err?.message || '';
  if (msg.toLowerCase().includes('network')) return 'Something went wrong. Please try again.';
  return msg || 'Something went wrong. Please try again.';
}

export default function Admin() {
  const { showError } = useSnackbar();
  const [donations, setDonations] = useState([]);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError('');
    Promise.all([
      getDonations().catch((e) => {
        if (!cancelled) showError(friendlyMessage(e));
        return [];
      }),
      getRequests().catch((e) => {
        if (!cancelled) showError(friendlyMessage(e));
        return [];
      }),
    ])
      .then(([donList, reqList]) => {
        if (!cancelled) {
          setDonations(Array.isArray(donList) ? donList : []);
          setRequests(Array.isArray(reqList) ? reqList : []);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          const msg = friendlyMessage(err);
          setError(msg);
          showError(msg);
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [showError]);

  const acceptedCount = requests.filter((r) => r.status === 'ACCEPTED').length;

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
        Admin dashboard
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        Overview of donations and requests.
      </Typography>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={4}>
          <Card>
            <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <DonationSummaryIcon color="primary" sx={{ fontSize: 40 }} />
              <Box>
                <Typography variant="h4" fontWeight={600}>
                  {donations.length}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Total donations
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card>
            <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <RequestSummaryIcon color="primary" sx={{ fontSize: 40 }} />
              <Box>
                <Typography variant="h4" fontWeight={600}>
                  {requests.length}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Total requests
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card>
            <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <CheckCircleIcon color="primary" sx={{ fontSize: 40 }} />
              <Box>
                <Typography variant="h4" fontWeight={600}>
                  {acceptedCount}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Accepted
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Typography variant="h6" fontWeight={600} gutterBottom>
            Donations
          </Typography>
          <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 2 }}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Title</TableCell>
                  <TableCell>Category</TableCell>
                  <TableCell align="right">Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {donations.slice(0, 10).map((d) => (
                  <TableRow key={d.id}>
                    <TableCell>{d.title}</TableCell>
                    <TableCell>{d.category}</TableCell>
                    <TableCell align="right">
                      <Chip
                        label={d.status || 'AVAILABLE'}
                        size="small"
                        color={STATUS_COLOR[d.status] || 'default'}
                        sx={{ textTransform: 'capitalize' }}
                      />
                    </TableCell>
                  </TableRow>
                ))}
                {donations.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={3} align="center" sx={{ py: 3 }}>
                      No donations
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
        <Grid item xs={12} md={6}>
          <Typography variant="h6" fontWeight={600} gutterBottom>
            Requests
          </Typography>
          <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 2 }}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {requests.slice(0, 10).map((r) => (
                  <TableRow key={r.id}>
                    <TableCell>{r.id}</TableCell>
                    <TableCell>
                      <Chip
                        label={r.status || 'PENDING'}
                        size="small"
                        color={STATUS_COLOR[r.status] || 'default'}
                        sx={{ textTransform: 'capitalize' }}
                      />
                    </TableCell>
                  </TableRow>
                ))}
                {requests.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={2} align="center" sx={{ py: 3 }}>
                      No requests
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
      </Grid>
    </Box>
  );
}
