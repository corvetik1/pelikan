"use client";

import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, MenuItem, Stack } from "@mui/material";
import EditableImage from "./EditableImage";
import ImageArrayField from "./ImageArrayField";
import { useState, ChangeEvent } from "react";
import type { AdminProduct } from "@/types/admin";
import { categories } from "@/data/mock";

interface AddProductDialogProps {
  open: boolean;
  onClose: () => void;
  onCreate: (data: Partial<AdminProduct>) => void;
}

export default function AddProductDialog({ open, onClose, onCreate }: AddProductDialogProps) {
  type FormState = { name: string; price: string; weight: string; category: string; img: string; images: string[] };
  const [form, setForm] = useState<FormState>({ name: "", price: "", weight: "", category: categories[0].slug, img: "", images: [] });

  const handle = (field: keyof FormState) => (e: ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [field]: e.target.value });
  };

  const isValid = form.name.trim() !== '' && Number(form.price) > 0 && form.weight.trim() !== '';

  const submit = () => {
    if (!isValid) return;
    onCreate({ name: form.name.trim(), price: Number(form.price), weight: form.weight.trim(), category: form.category, img: form.img, images: form.images });
    // Reset form fields
    setForm({ name: "", price: "", weight: "", category: categories[0].slug, img: "", images: [] });

  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Добавить товар</DialogTitle>
      <DialogContent>
        <Stack spacing={2} mt={1}>
          <TextField label="Название" value={form.name} onChange={handle("name")} fullWidth />
          <TextField type="number" label="Цена" value={form.price} onChange={handle("price")} fullWidth />
          <TextField label="Вес" value={form.weight} onChange={handle("weight")} fullWidth />
          <EditableImage
            src={form.img || "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='120'%3E%3Crect width='200' height='120' fill='%23ddd'/%3E%3Ctext x='50%25' y='50%25' text-anchor='middle' dy='.3em' fill='%23999'%3EImage%3C/text%3E%3C/svg%3E"}
            alt="Product image"
            width={200}
            height={120}
            onSave={(newUrl) => {
              setForm({ ...form, img: newUrl });
            }}
            style={{ maxWidth: 200, borderRadius: 4 }}
          />
          <TextField select label="Категория" value={form.category} onChange={handle("category")} fullWidth>
            {categories.map((c) => (
              <MenuItem key={c.slug} value={c.slug}>
                {c.title}
              </MenuItem>
            ))}
          </TextField>

            {/* Дополнительные изображения */}
            <ImageArrayField value={form.images} onChange={(arr) => setForm({ ...form, images: arr })} />
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
