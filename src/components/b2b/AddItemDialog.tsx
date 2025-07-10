"use client";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Stack,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
} from "@mui/material";
import { useState } from "react";
import type { Product } from '@/types/product';

export interface AddItemDialogProps {
  open: boolean;
  onClose: () => void;
  onAdd: (payload: { id: string; quantity: number }) => void;
  products: Product[];
}

export default function AddItemDialog({ open, onClose, onAdd, products }: AddItemDialogProps) {
  const [productId, setProductId] = useState<string>("");
  const [quantity, setQuantity] = useState<number>(1);

  const handleAdd = () => {
    if (!productId || quantity <= 0) return;
    onAdd({ id: productId, quantity });
    setProductId("");
    setQuantity(1);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Добавить позицию</DialogTitle>
      <DialogContent>
        <Stack spacing={3} mt={1}>
          <FormControl fullWidth>
            <InputLabel id="product-label">Товар</InputLabel>
            <Select
              labelId="product-label"
              value={productId}
              label="Товар"
              onChange={(e) => setProductId(e.target.value as string)}
              data-testid="add-item-product-select"
            >
              {products.map((p) => (
                <MenuItem key={p.id} value={p.id} data-testid={`add-item-option-${p.id}`}>
                  {p.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            label="Количество"
            type="number"
            inputProps={{ min: 1 }}
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
            data-testid="add-item-qty-input"
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Отмена</Button>
        <Button
          variant="contained"
          disabled={!productId || quantity <= 0}
          onClick={() => {
            handleAdd();
            onClose();
          }}
          data-testid="add-item-confirm"
        >
          Добавить
        </Button>
      </DialogActions>
    </Dialog>
  );
}
