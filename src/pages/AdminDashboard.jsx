import React from "react";
import { useDonations } from "../context/DonationContext";
import { getUsers } from "../utils/authStorage";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip,
  Divider,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";

export default function AdminDashboard() {
  const { donations, updateStatus, assignLogistics } = useDonations();
  const users = getUsers();
  const logisticsUsers = users.filter((u) => u.role === "Logistics");

  // 📊 STATISTICS
  const stats = {
    total: donations.length,
    pending: donations.filter((d) => d.status === "Pending").length,
    approved: donations.filter((d) => d.status === "Approved").length,
    assigned: donations.filter((d) => d.status === "Assigned").length,
    accepted: donations.filter((d) => d.status === "Accepted by Logistics").length,
    delivered: donations.filter((d) => d.status === "Delivered").length,
    rejected: donations.filter((d) => d.status === "Rejected").length,
    cancelled: donations.filter((d) =>
      d.status?.includes("Cancelled")
    ).length,
  };

  const pendingDonations = donations.filter((d) => d.status === "Pending");

  return (
    <Box>
      <Typography variant="h4" fontWeight={600} gutterBottom>
        Admin Dashboard
      </Typography>

      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        Review and manage donation requests.
      </Typography>

      {/* 📊 STATS SECTION */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {Object.entries(stats).map(([key, value]) => (
          <Grid item xs={6} sm={4} md={3} key={key}>
            <Card>
              <CardContent>
                <Typography variant="body2" color="text.secondary">
                  {key.toUpperCase()}
                </Typography>
                <Typography variant="h5" fontWeight={600}>
                  {value}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Divider sx={{ mb: 4 }} />

      {/* 🔵 PENDING APPROVAL */}
      <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
        Pending Approval
      </Typography>

      {pendingDonations.length === 0 ? (
        <Typography color="text.secondary">
          No donations pending approval.
        </Typography>
      ) : (
        <Grid container spacing={3}>
          {pendingDonations.map((d) => (
            <Grid item xs={12} sm={6} md={4} key={d.id}>
              <Card>
                <CardContent>
                  <Typography variant="h6">{d.title}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {d.category} • {d.donor}
                  </Typography>

                  <Box sx={{ mt: 2, display: "flex", gap: 1 }}>
                    <Button
                      variant="contained"
                      color="success"
                      size="small"
                      startIcon={<CheckCircleIcon />}
                      onClick={() => updateStatus(d.id, "Approved")}
                    >
                      Approve
                    </Button>

                    <Button
                      variant="outlined"
                      color="error"
                      size="small"
                      startIcon={<CancelIcon />}
                      onClick={() => updateStatus(d.id, "Rejected")}
                    >
                      Reject
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* 🟢 APPROVED → ASSIGN */}
      <Typography variant="h6" fontWeight={600} sx={{ mt: 5, mb: 2 }}>
        Approved – Assign to Logistics
      </Typography>

      <Grid container spacing={3}>
        {donations
          .filter((d) => d.status === "Approved")
          .map((d) => (
            <Grid item xs={12} sm={6} md={4} key={d.id}>
              <Card>
                <CardContent>
                  <Typography variant="h6">{d.title}</Typography>
                  <Chip label="Approved" color="info" size="small" sx={{ mb: 2 }} />

                  <FormControl fullWidth size="small">
                    <InputLabel>Assign to</InputLabel>
                    <Select
                      label="Assign to"
                      onChange={(e) => {
                        const selectedId = e.target.value;
                        const selectedUser = logisticsUsers.find(
                          (u) => u.id === selectedId
                        );

                        assignLogistics(d.id, selectedUser);
                      }}
                    >
                      {logisticsUsers.map((u) => (
                        <MenuItem key={u.id} value={u.id}>
                          {u.name} ({u.email})
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </CardContent>
              </Card>
            </Grid>
          ))}
      </Grid>
    </Box>
  );
}