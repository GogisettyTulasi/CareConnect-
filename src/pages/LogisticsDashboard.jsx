import React from "react";
import { useAuth } from "../context/AuthContext";
import { useDonations } from "../context/DonationContext";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Chip,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";

const STATUS_COLORS = {
  Assigned: "warning",
  "Accepted by Logistics": "info",
  "Rejected by Logistics": "error",
  Delivered: "success",
};

export default function LogisticsDashboard() {
  const { user } = useAuth();
  const { donations, updateStatus } = useDonations();

  const myAssigned = donations.filter(
    (d) =>
      (d.assignedTo === user?.name || d.assignedToId === user?.id) &&
      !["Rejected by Logistics", "Delivered"].includes(d.status)
  );

  const delivered = donations.filter(
    (d) =>
      (d.assignedTo === user?.name || d.assignedToId === user?.id) &&
      d.status === "Delivered"
  );

  const handleAccept = (donation) => {
    updateStatus(donation.id, "Accepted by Logistics", {
      acceptedByLogistics: user.name,
      acceptedAt: new Date().toISOString(),
    });
  };

  const handleReject = (donation) => {
    updateStatus(donation.id, "Rejected by Logistics", {
      rejectedByLogistics: user.name,
    });
  };

  const handleDelivered = (donation) => {
    updateStatus(donation.id, "Delivered", {
      deliveredAt: new Date().toISOString(),
    });
  };

  return (
    <Box>
      <Typography variant="h4" fontWeight={600} gutterBottom>
        Logistics Dashboard
      </Typography>

      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        Manage deliveries assigned to you.
      </Typography>

      <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
        Assigned for Delivery
      </Typography>

      {myAssigned.length === 0 ? (
        <Typography color="text.secondary">
          No deliveries assigned.
        </Typography>
      ) : (
        <Grid container spacing={3}>
          {myAssigned.map((d) => (
            <Grid item xs={12} sm={6} md={4} key={d.id}>
              <Card sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography variant="h6" fontWeight={600} sx={{ mb: 1 }}>
                    {d.title}
                  </Typography>

                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    {d.category} • From: {d.donor || "Unknown"}
                  </Typography>

                  {d.description && (
                    <Typography variant="body2" sx={{ mt: 1 }}>
                      {d.description}
                    </Typography>
                  )}

                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    Quantity: {d.quantity}
                  </Typography>

                  <Box sx={{ mt: 2 }}>
                    <Chip
                      label={d.status}
                      color={STATUS_COLORS[d.status] || "default"}
                      size="small"
                      sx={{ mb: 2 }}
                    />
                  </Box>

                  {d.status === "Assigned" && (
                    <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                      <Button
                        variant="contained"
                        color="success"
                        size="small"
                        startIcon={<CheckCircleIcon />}
                        onClick={() => handleAccept(d)}
                      >
                        Accept Delivery
                      </Button>

                      <Button
                        variant="outlined"
                        color="error"
                        size="small"
                        startIcon={<CancelIcon />}
                        onClick={() => handleReject(d)}
                      >
                        Reject Delivery
                      </Button>
                    </Box>
                  )}

                  {d.status === "Accepted by Logistics" && (
                    <Button
                      variant="contained"
                      color="primary"
                      size="small"
                      startIcon={<LocalShippingIcon />}
                      onClick={() => handleDelivered(d)}
                    >
                      Mark as Delivered
                    </Button>
                  )}

                  {d.acceptedAt && (
                    <Typography variant="caption" sx={{ display: "block", mt: 1 }}>
                      Accepted: {new Date(d.acceptedAt).toLocaleString()}
                    </Typography>
                  )}

                  {d.deliveredAt && (
                    <Typography variant="caption" sx={{ display: "block", mt: 1 }}>
                      Delivered: {new Date(d.deliveredAt).toLocaleString()}
                    </Typography>
                  )}
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {delivered.length > 0 && (
        <>
          <Typography variant="h6" fontWeight={600} sx={{ mt: 4, mb: 2 }}>
            Completed
          </Typography>

          <Grid container spacing={3}>
            {delivered.map((d) => (
              <Grid item xs={12} sm={6} md={4} key={d.id}>
                <Card sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
                  <CardContent>
                    <Typography variant="h6" fontWeight={600} sx={{ mb: 1 }}>
                      {d.title}
                    </Typography>
                    <Chip label="Delivered" color="success" size="small" />
                    {d.deliveredAt && (
                      <Typography variant="caption" sx={{ display: "block", mt: 1 }}>
                        Delivered: {new Date(d.deliveredAt).toLocaleString()}
                      </Typography>
                    )}
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </>
      )}
    </Box>
  );
}