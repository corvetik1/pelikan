"use client";

import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, MenuItem, Stack } from "@mui/material";
import EditableImage from "./EditableImage";
import ImageArrayField from "./ImageArrayField";
import { useState, ChangeEvent } from "react";
import type { AdminRecipe } from "@/types/admin";
import { categories } from "@/data/mock";

interface AddRecipeDialogProps {
  open: boolean;
  onClose: () => void;
  onCreate: (data: Partial<AdminRecipe>) => void;
}

export default function AddRecipeDialog({ open, onClose, onCreate }: AddRecipeDialogProps) {
  type FormState = {
    title: string;
    shortDescription: string;
    cookingTime: string;
    category: string;
    img: string;
    images: string[];
  };

  const [form, setForm] = useState<FormState>({
    title: "",
    shortDescription: "",
    cookingTime: "",
    category: categories[0].slug,
    img: "",
    images: [],
  });

  const handle = (field: keyof typeof form) => (e: ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [field]: e.target.value });
  };

  const isValid =
    form.title.trim() &&
    form.shortDescription.trim() &&
    Number(form.cookingTime) > 0 && form.img.trim() !== "";

  const submit = () => {
    if (!isValid) return;
    onCreate({
      title: form.title.trim(),
      shortDescription: form.shortDescription.trim(),
      cookingTime: Number(form.cookingTime),
      category: form.category,
      img: form.img,
      images: form.images,
    });
    setForm({ title: "", shortDescription: "", cookingTime: "", category: categories[0].slug, img: "", images: [] });
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Добавить рецепт</DialogTitle>
      <DialogContent>
        <Stack spacing={2} mt={1}>
          <TextField label="Название" value={form.title} onChange={handle("title")} fullWidth />
          <TextField label="Краткое описание" value={form.shortDescription} onChange={handle("shortDescription")} fullWidth multiline rows={3} />
          <TextField type="number" label="Время приготовления, мин" value={form.cookingTime} onChange={handle("cookingTime")} fullWidth />
          <EditableImage
            src={form.img || "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='120'%3E%3Crect width='200' height='120' fill='%23ddd'/%3E%3Ctext x='50%25' y='50%25' text-anchor='middle' dy='.3em' fill='%23999'%3EImage%3C/text%3E%3C/svg%3E"}
            alt="Recipe image"
            width={200}
            height={120}
            onSave={(newUrl) => setForm({ ...form, img: newUrl })}
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
