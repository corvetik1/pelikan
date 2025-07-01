"use client";

import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, MenuItem, FormControlLabel, Checkbox, Stack } from "@mui/material";
import { useState, ChangeEvent } from "react";
import type { AdminUser, UserRole } from "@/types/admin";

interface AddUserDialogProps {
  open: boolean;
  onClose: () => void;
  onCreate: (data: Partial<AdminUser>) => void;
}

const roles: UserRole[] = ["admin", "editor", "viewer"];

export default function AddUserDialog({ open, onClose, onCreate }: AddUserDialogProps) {
  const [form, setForm] = useState({ email: "", role: roles[1], isActive: true });

  const handle = (field: keyof typeof form) => (e: ChangeEvent<HTMLInputElement>) => {
    const value = field === "isActive" ? e.target.checked : e.target.value;
    setForm({ ...form, [field]: value as never });
  };

  const emailValid = /^\S+@\S+\.\S+$/.test(form.email);
  const isValid = emailValid;

  const submit = () => {
    if (!isValid) return;
    onCreate({ email: form.email.trim(), role: form.role, isActive: form.isActive });
    setForm({ email: "", role: roles[1], isActive: true });
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Добавить пользователя</DialogTitle>
      <DialogContent>
        <Stack spacing={2} mt={1}>
          <TextField label="Email" value={form.email} onChange={handle("email")} fullWidth error={!!form.email && !emailValid} helperText={form.email && !emailValid ? "Некорректный email" : undefined} />
          <TextField select label="Роль" value={form.role} onChange={handle("role")} fullWidth>
            {roles.map((r) => (
              <MenuItem key={r} value={r}>
                {r}
              </MenuItem>
            ))}
          </TextField>
          <FormControlLabel control={<Checkbox checked={form.isActive} onChange={handle("isActive")} />} label="Активен" />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Отмена</Button>
        <Button onClick={submit} variant="contained" disabled={!isValid}>
          Создать
        </Button>
      </DialogActions>
    </Dialog>
  );
}
