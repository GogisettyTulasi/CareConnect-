import React, { createContext, useContext, useState, useCallback } from 'react';
import { Snackbar, Alert } from '@mui/material';

const SnackbarContext = createContext(null);

export function SnackbarProvider({ children }) {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [severity, setSeverity] = useState('info');

  const show = useCallback((msg, sev = 'info') => {
    setMessage(msg);
    setSeverity(sev);
    setOpen(true);
  }, []);

  const showSuccess = useCallback((msg) => show(msg, 'success'), [show]);
  const showError = useCallback((msg) => show(msg, 'error'), [show]);

  const handleClose = useCallback((_, reason) => {
    if (reason === 'clickaway') return;
    setOpen(false);
  }, []);

  const value = { showSuccess, showError, show };

  return (
    <SnackbarContext.Provider value={value}>
      {children}
      <Snackbar
        open={open}
        autoHideDuration={5000}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleClose} severity={severity} variant="filled" sx={{ width: '100%' }}>
          {message}
        </Alert>
      </Snackbar>
    </SnackbarContext.Provider>
  );
}

export function useSnackbar() {
  const ctx = useContext(SnackbarContext);
  if (!ctx) throw new Error('useSnackbar must be used within SnackbarProvider');
  return ctx;
}
