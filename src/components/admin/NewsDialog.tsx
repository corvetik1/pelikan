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
import { useEffect, useState } from "react";
import { AdminNews } from "@/types/admin";

export interface NewsDialogProps {
  open: boolean;
  onClose: () => void;
  /** if provided – edit mode */
  initial?: AdminNews | null;
  /** when user confirms, returns data (without id for create) */
  onSave: (data: Omit<AdminNews, "id"> & { id?: string }) => void;
}

export default function NewsDialog({ open, onClose, initial, onSave }: NewsDialogProps) {
  const [title, setTitle] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [date, setDate] = useState("");
  const [category, setCategory] = useState("general");

  useEffect(() => {
    if (initial) {
      setTitle(initial.title);
      setExcerpt(initial.excerpt);
      setDate(initial.date.slice(0, 10));
      setCategory(initial.category);
    } else {
      setTitle("");
      setExcerpt("");
      setDate(new Date().toISOString().slice(0, 10));
      setCategory("general");
    }
  }, [initial]);

  const handleSave = () => {
    if (!title.trim()) return; // basic validation
    onSave({ title, excerpt, date, category, id: initial?.id });
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{initial ? "Редактировать новость" : "Добавить новость"}</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ mt: 1 }}>
          <TextField
            label="Заголовок"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            fullWidth
          />
          <TextField
            label="Анонс"
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
            fullWidth
            multiline
            rows={3}
          />
          <TextField
            label="Дата"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            InputLabelProps={{ shrink: true }}
            required
          />
          <TextField
            label="Категория"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            fullWidth
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Отмена</Button>
        <Button variant="contained" onClick={handleSave} disabled={!title.trim()}>
          Сохранить
        </Button>
      </DialogActions>
    </Dialog>
  );
}
