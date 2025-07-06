"use client";

import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, MenuItem, Stack } from "@mui/material";
import { useState, ChangeEvent } from "react";
import type { Product } from "@/data/mock";
import { categories } from "@/data/mock";

interface AddProductDialogProps {
  open: boolean;
  onClose: () => void;
  onCreate: (data: Partial<Product>) => void;
}

export default function AddProductDialog({ open, onClose, onCreate }: AddProductDialogProps) {
  const [form, setForm] = useState({ name: "", price: "", weight: "", category: categories[0].slug });

  const handle = (field: keyof typeof form) => (e: ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [field]: e.target.value });
  };

  const isValid = form.name.trim() && Number(form.price) > 0 && form.weight.trim();

  const submit = () => {
    if (!isValid) return;
    onCreate({ name: form.name.trim(), price: Number(form.price), weight: form.weight.trim(), category: form.category, img: "" });
    // Reset form fields
    setForm({ name: "", price: "", weight: "", category: categories[0].slug });

  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Добавить товар</DialogTitle>
      <DialogContent>
        <Stack spacing={2} mt={1}>
          <TextField label="Название" value={form.name} onChange={handle("name")} fullWidth />
          <TextField type="number" label="Цена" value={form.price} onChange={handle("price")} fullWidth />
          <TextField label="Вес" value={form.weight} onChange={handle("weight")} fullWidth />
          <TextField select label="Категория" value={form.category} onChange={handle("category")} fullWidth>
            {categories.map((c) => (
              <MenuItem key={c.slug} value={c.slug}>
                {c.title}
              </MenuItem>
            ))}
          </TextField>
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
