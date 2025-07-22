"use client";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Stack,
} from "@mui/material";
import { useState } from "react";
import type { NewsCategory } from "@/types/admin";

interface AddNewsCategoryDialogProps {
  open: boolean;
  onClose: () => void;
  onCreate: (data: Pick<NewsCategory, "title">) => void;
}

export default function AddNewsCategoryDialog({ open, onClose, onCreate }: AddNewsCategoryDialogProps) {
  const [title, setTitle] = useState("");

  const submit = () => {
    if (!title.trim()) return;
    onCreate({ title: title.trim() });
    setTitle("");
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Добавить категорию</DialogTitle>
      <DialogContent>
        <Stack spacing={2} mt={1}>
          <TextField
            label="Название"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            fullWidth
            required
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Отмена</Button>
        <Button variant="contained" onClick={submit} disabled={!title.trim()}>
          Создать
        </Button>
      </DialogActions>
    </Dialog>
  );
}
