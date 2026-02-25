import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { AuthProvider } from './context/AuthContext';
import { SnackbarProvider } from './context/SnackbarContext';
import { DonationProvider } from './context/DonationContext'; // ✅ ADD THIS
import theme from './utils/theme';
import App from './App';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <DonationProvider> {/* ✅ WRAP HERE */}
          <AuthProvider>
            <SnackbarProvider>
              <App />
            </SnackbarProvider>
          </AuthProvider>
        </DonationProvider>
      </ThemeProvider>
    </BrowserRouter>
  </React.StrictMode>
);