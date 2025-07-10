"use client";

import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Stack, TextField } from "@mui/material";
import { useState, useEffect } from "react";
import type { Quote } from "@/types/quote";

export interface QuotesPricesDialogProps {
  open: boolean;
  quote: Quote | null;
  onClose: () => void;
  onSave: (prices: Record<string, number>) => void;
}

export default function QuotesPricesDialog({ open, quote, onClose, onSave }: QuotesPricesDialogProps) {
  const [localPrices, setLocalPrices] = useState<Record<string, string>>({});

  useEffect(() => {
    if (quote?.prices) {
      const map: Record<string, string> = {};
      Object.entries(quote.prices).forEach(([k, v]) => {
        map[k] = String(v);
      });
      setLocalPrices(map);
    } else {
      setLocalPrices({});
    }
  }, [quote]);

  // sync when quote changes
  const items = quote?.items ?? [];

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Установить цены</DialogTitle>
      <DialogContent>
        <Stack spacing={2} mt={1}>
          {items.map((it) => (
            <TextField
              key={it.productId}
              label={`SKU ${it.productId}`}
              type="number"
              InputProps={{ inputProps: { min: 0 } }}
              value={localPrices[it.productId] ?? ''}
              onChange={(e) =>
                setLocalPrices((prev) => ({ ...prev, [it.productId]: e.target.value }))
              }
            />
          ))}
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Отмена</Button>
        <Button
          variant="contained"
          onClick={() => {
            const parsed: Record<string, number> = {};
            Object.entries(localPrices).forEach(([k, v]) => {
              const num = Number(v);
              if (!Number.isNaN(num)) parsed[k] = num;
            });
            onSave(parsed);
          }}
          disabled={items.some((it) => !(localPrices[it.productId] ?? '').length)}
        >
          Сохранить
        </Button>
      </DialogActions>
      </Dialog>
   );
}
