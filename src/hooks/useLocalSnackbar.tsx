"use client";

import { useState, SyntheticEvent } from "react";
import { Snackbar, Alert } from "@mui/material";

export default function useLocalSnackbar() {
  const [state, setState] = useState<{
    open: boolean;
    message: string;
    severity: "success" | "error";
  }>({ open: false, message: "", severity: "success" });

  const showSuccess = (message: string) => setState({ open: true, message, severity: "success" });
  const showError = (message: string) => setState({ open: true, message, severity: "error" });

  const handleClose = (_event?: SyntheticEvent | Event, reason?: string) => {
    if (reason === "clickaway") return;
    setState((prev) => ({ ...prev, open: false }));
  };

  const snackbar = (
    <Snackbar
      open={state.open}
      autoHideDuration={3000}
      onClose={handleClose}
      anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
    >
      <Alert onClose={handleClose} severity={state.severity} sx={{ width: "100%" }}>
        {state.message}
      </Alert>
    </Snackbar>
  );

  return { showSuccess, showError, snackbar } as const;
}
