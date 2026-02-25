import React from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Chip,
  Button,
} from '@mui/material';
import { useDonations } from '../context/DonationContext';
import { useAuth } from '../context/AuthContext';
import CancelIcon from '@mui/icons-material/Cancel';

export default function MyDonations() {
  const { donations, updateStatus } = useDonations();
  const { user } = useAuth();

  const myDonations = donations.filter(
    (d) => d.donor === user?.name || d.donorId === user?.id
  );

  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending':
        return 'warning';
      case 'Approved':
        return 'info';
      case 'Assigned':
        return 'primary';
      case 'Accepted by Logistics':
        return 'info';
      case 'Rejected by Logistics':
        return 'error';
      case 'Delivered':
        return 'success';
      case 'Rejected':
        return 'error';
      case 'Cancelled by Donor':
        return 'default';
      default:
        return 'default';
    }
  };

  return (
    <Box>
      <Typography variant="h4" fontWeight={600} gutterBottom>
        My Donations
      </Typography>

      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        Track the status of your donated items.
      </Typography>

      {myDonations.length === 0 ? (
        <Typography color="text.secondary">
          You haven&apos;t listed any donations yet.
        </Typography>
      ) : (
        <Grid container spacing={3}>
          {myDonations.map((item) => (
            <Grid item xs={12} sm={6} md={4} key={item.id}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography variant="h6" fontWeight={600} sx={{ mb: 1 }}>
                    {item.title}
                  </Typography>

                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    {item.category}
                  </Typography>

                  {item.description && (
                    <Typography variant="body2" sx={{ mt: 1 }}>
                      {item.description}
                    </Typography>
                  )}

                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    Quantity: {item.quantity}
                  </Typography>

                  <Box
                    sx={{
                      mt: 2,
                      display: 'flex',
                      flexWrap: 'wrap',
                      gap: 1,
                      alignItems: 'center',
                    }}
                  >
                    <Chip
                      label={item.status}
                      color={getStatusColor(item.status)}
                    />

                    {item.status === 'Delivered' && (
                      <Chip
                        label="Delivered"
                        color="success"
                        variant="outlined"
                        size="small"
                      />
                    )}

                    {(item.status === 'Pending' ||
                      item.status === 'Approved') && (
                      <Button
                        size="small"
                        color="error"
                        variant="outlined"
                        startIcon={<CancelIcon />}
                        onClick={() =>
                          updateStatus(item.id, 'Cancelled by Donor')
                        }
                      >
                        Cancel
                      </Button>
                    )}
                  </Box>

                  {item.assignedTo && (
                    <Typography variant="body2" sx={{ mt: 1 }}>
                      Assigned to: {item.assignedTo}
                    </Typography>
                  )}
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
}