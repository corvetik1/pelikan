"use client";

import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, MenuItem, Stack } from "@mui/material";
import { useState, ChangeEvent } from "react";
import type { Recipe } from "@/data/mock";
import { categories } from "@/data/mock";

interface AddRecipeDialogProps {
  open: boolean;
  onClose: () => void;
  onCreate: (data: Partial<Recipe>) => void;
}

export default function AddRecipeDialog({ open, onClose, onCreate }: AddRecipeDialogProps) {
  const [form, setForm] = useState({
    title: "",
    shortDescription: "",
    cookingTime: "",
    category: categories[0].slug,
  });

  const handle = (field: keyof typeof form) => (e: ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [field]: e.target.value });
  };

  const isValid =
    form.title.trim() &&
    form.shortDescription.trim() &&
    Number(form.cookingTime) > 0;

  const submit = () => {
    if (!isValid) return;
    onCreate({
      title: form.title.trim(),
      shortDescription: form.shortDescription.trim(),
      cookingTime: Number(form.cookingTime),
      category: form.category,
      img: "",
    });
    setForm({ title: "", shortDescription: "", cookingTime: "", category: categories[0].slug });
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Добавить рецепт</DialogTitle>
      <DialogContent>
        <Stack spacing={2} mt={1}>
          <TextField label="Название" value={form.title} onChange={handle("title")} fullWidth />
          <TextField label="Краткое описание" value={form.shortDescription} onChange={handle("shortDescription")} fullWidth multiline rows={3} />
          <TextField type="number" label="Время приготовления, мин" value={form.cookingTime} onChange={handle("cookingTime")} fullWidth />
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
