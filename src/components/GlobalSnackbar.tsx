'use client';

import { Snackbar, Alert } from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '@/redux/store';
import { hideSnackbar } from '@/redux/snackbarSlice';

export default function GlobalSnackbar() {
  const dispatch = useDispatch();
  const { open, message, severity } = useSelector((s: RootState) => s.snackbar);

  const handleClose = (_?: unknown, reason?: string) => {
    if (reason === 'clickaway') return;
    dispatch(hideSnackbar());
  };

  return (
    <Snackbar
      open={open}
      autoHideDuration={3000}
      onClose={handleClose}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
    >
      <Alert onClose={handleClose} severity={severity} sx={{ width: '100%' }}>
        {message}
      </Alert>
    </Snackbar>
  );
}
