"use client";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Box,
  Button,
  Stack,
} from "@mui/material";
import Image from "next/image";
import { useIsAdmin } from "@/context/AuthContext";
import type { Product } from '@/types/product';

interface ProductQuickViewProps {
  product: Product;
  open: boolean;
  onClose: () => void;
}

export default function ProductQuickView({ product, open, onClose }: ProductQuickViewProps) {
  const isAdmin = useIsAdmin();
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{product.name}</DialogTitle>
      <DialogContent>
        <Stack spacing={2}>
          <Box position="relative" width="100%" height={300}>
            <Image
              src={product.img}
              alt={product.name}
              fill
              sizes="(max-width: 600px) 100vw, 600px"
              style={{ objectFit: "cover", borderRadius: 8 }}
            />
          </Box>
          <Typography variant="body1">{product.description}</Typography>
          <Typography variant="subtitle2" color="text.secondary">
            Вес: {product.weight}
          </Typography>
          {isAdmin && (
            <Typography variant="h6" fontWeight={600}>
              {product.price.toLocaleString("ru-RU", {
                style: "currency",
                currency: "RUB",
              })}
            </Typography>
          )}
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button variant="contained" color="primary" onClick={onClose}>
          Запросить предложение
        </Button>
      </DialogActions>
    </Dialog>
  );
}
