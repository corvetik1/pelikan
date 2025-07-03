"use client";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Chip,
  Stack,
} from "@mui/material";
import { useState, ChangeEvent, KeyboardEvent } from "react";
import type { AdminRole } from "@/types/admin";

interface AddRoleDialogProps {
  open: boolean;
  onClose: () => void;
  onCreate: (data: Partial<AdminRole>) => void;
}

export default function AddRoleDialog({ open, onClose, onCreate }: AddRoleDialogProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [permissionInput, setPermissionInput] = useState("");
  const [permissions, setPermissions] = useState<string[]>([]);

  const addPermission = () => {
    const trimmed = permissionInput.trim();
    if (trimmed && !permissions.includes(trimmed)) {
      setPermissions([...permissions, trimmed]);
    }
    setPermissionInput("");
  };

  const handlePermissionKey = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addPermission();
    }
  };

  const removePermission = (p: string) => setPermissions(permissions.filter((v) => v !== p));

  const submit = () => {
    if (!name.trim()) return;
    onCreate({ name: name.trim(), description: description.trim(), permissions });
    setName("");
    setDescription("");
    setPermissions([]);
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Добавить роль</DialogTitle>
      <DialogContent>
        <Stack spacing={2} mt={1}>
          <TextField label="Название" value={name} onChange={(e) => setName(e.target.value)} fullWidth required />
          <TextField
            label="Описание"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            fullWidth
            multiline
            minRows={2}
          />
          <TextField
            label="Добавить permission"
            value={permissionInput}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setPermissionInput(e.target.value)}
            onKeyDown={handlePermissionKey}
            onBlur={addPermission}
            fullWidth
            helperText="Нажмите Enter для добавления"
          />
          <Stack direction="row" spacing={1} flexWrap="wrap">
            {permissions.map((p) => (
              <Chip key={p} label={p} onDelete={() => removePermission(p)} color="primary" />
            ))}
          </Stack>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Отмена</Button>
        <Button variant="contained" onClick={submit} disabled={!name.trim()}>
          Создать
        </Button>
      </DialogActions>
    </Dialog>
  );
}
