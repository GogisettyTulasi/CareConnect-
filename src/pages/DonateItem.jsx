



import React, { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  MenuItem,
  Paper,
} from "@mui/material";
import { useDonations } from "../context/DonationContext";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function DonateItem() {
  const { addDonation } = useDonations();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    category: "",
    description: "",
    quantity: "",
    street: "",
    building: "",
    city: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    addDonation({
      ...form,
      donor: user?.name,
      donorId: user?.id,
      location: `${form.building}, ${form.street}, ${form.city}`,
      status: "Pending",
    });

    navigate("/my-donations");
  };

  return (
    <Box>
      <Typography variant="h4" fontWeight={600} gutterBottom>
        Donate Item
      </Typography>

      <Paper sx={{ p: 3, mt: 2 }}>
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Item Title"
            name="title"
            value={form.title}
            onChange={handleChange}
            margin="normal"
            required
          />

          <TextField
            fullWidth
            select
            label="Category"
            name="category"
            value={form.category}
            onChange={handleChange}
            margin="normal"
            required
          >
            <MenuItem value="Food">Food</MenuItem>
            <MenuItem value="Clothes">Clothes</MenuItem>
            <MenuItem value="Books">Books</MenuItem>
            <MenuItem value="Other">Other</MenuItem>
          </TextField>

          <TextField
            fullWidth
            label="Description"
            name="description"
            value={form.description}
            onChange={handleChange}
            margin="normal"
            multiline
            rows={3}
          />

          <TextField
            fullWidth
            type="number"
            label="Quantity"
            name="quantity"
            value={form.quantity}
            onChange={handleChange}
            margin="normal"
            required
          />

          <Typography variant="h6" sx={{ mt: 3 }}>
            Pickup Location
          </Typography>

          <TextField
            fullWidth
            label="Building / House No"
            name="building"
            value={form.building}
            onChange={handleChange}
            margin="normal"
            required
          />

          <TextField
            fullWidth
            label="Street"
            name="street"
            value={form.street}
            onChange={handleChange}
            margin="normal"
            required
          />

          <TextField
            fullWidth
            label="City"
            name="city"
            value={form.city}
            onChange={handleChange}
            margin="normal"
            required
          />

          <Button
            type="submit"
            variant="contained"
            fullWidth
            sx={{ mt: 3 }}
          >
            Submit Donation
          </Button>
        </form>
      </Paper>
    </Box>
  );
}