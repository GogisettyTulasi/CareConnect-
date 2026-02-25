import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Container, Box } from '@mui/material';

import ProtectedRoute from './components/ProtectedRoute';
import NavBar from './components/NavBar';
import Footer from './components/Footer';

import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';   // ✅ MUST IMPORT

import DonateItem from './pages/DonateItem';
import BrowseItems from './pages/BrowseItems';
import MyRequests from './pages/MyRequests';
import MyDonations from './pages/MyDonations';
import AdminDashboard from './pages/AdminDashboard';
import LogisticsDashboard from './pages/LogisticsDashboard';

function AuthenticatedLayout({ children }) {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <NavBar />
      <Box component="main" sx={{ flexGrow: 1, py: 3 }}>
        <Container maxWidth="lg">
          {children}
        </Container>
      </Box>
      <Footer />
    </Box>
  );
}

export default function App() {
  return (
    <Routes>

      {/* PUBLIC ROUTES */}
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      {/* DASHBOARD */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <AuthenticatedLayout>
              <Dashboard />
            </AuthenticatedLayout>
          </ProtectedRoute>
        }
      />

      {/* OTHER ROUTES */}
      <Route
        path="/donate"
        element={
          <ProtectedRoute>
            <AuthenticatedLayout>
              <DonateItem />
            </AuthenticatedLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/browse"
        element={
          <ProtectedRoute>
            <AuthenticatedLayout>
              <BrowseItems />
            </AuthenticatedLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/my-donations"
        element={
          <ProtectedRoute>
            <AuthenticatedLayout>
              <MyDonations />
            </AuthenticatedLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/my-requests"
        element={
          <ProtectedRoute>
            <AuthenticatedLayout>
              <MyRequests />
            </AuthenticatedLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin"
        element={
          <ProtectedRoute roleRequired="Admin">
            <AuthenticatedLayout>
              <AdminDashboard />
            </AuthenticatedLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/logistics"
        element={
          <ProtectedRoute roleRequired="Logistics">
            <AuthenticatedLayout>
              <LogisticsDashboard />
            </AuthenticatedLayout>
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}