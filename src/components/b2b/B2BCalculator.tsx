"use client";

import { Box, TextField, Typography, MenuItem, Select, InputLabel, FormControl, Button, Stack, CircularProgress } from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "@/redux/store";
import { setProduct, setQuantity, setPrices, addItem } from "@/redux/b2bCalculatorSlice";
import { products } from "@/data/mock";
import { useGetB2BPricesQuery } from "@/redux/api";
import B2BItemsTable from "./B2BItemsTable";
import { generateCsv } from "@/utils/csv";
import { useRequestQuoteMutation } from "@/redux/api";
import Snackbar from "@mui/material/Snackbar";
import AddItemDialog from "./AddItemDialog";
import { useEffect, useState } from "react";

export default function B2BCalculator() {
  const dispatch = useDispatch();
  // local UI state and mutations
  const [dialogOpen, setDialogOpen] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [requestQuote, { isLoading: isQuoteLoading }] = useRequestQuoteMutation();
  const { productId, quantity, prices, items } = useSelector((s: RootState) => s.b2bCalculator);


  // derived calculated values
  const selectedProduct = products.find((p) => p.id === productId);
  const unitPrice = prices[selectedProduct?.id ?? ""] ?? selectedProduct?.price ?? 0;
  const itemsTotal = items.reduce((sum, it) => {
    const price = prices[it.id] ?? products.find((p) => p.id === it.id)?.price ?? 0;
    return sum + price * it.quantity;
  }, 0);

  // fetch B2B prices
  const { data: pricesData = [], isLoading: isPricesLoading } = useGetB2BPricesQuery();

  useEffect(() => {
    if (pricesData.length) {
      const map = Object.fromEntries(pricesData.map((p) => [p.id, p.price]));
      dispatch(setPrices(map));
    }
  }, [dispatch, pricesData]);

  if (isPricesLoading && !Object.keys(prices).length) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box maxWidth={800} mx="auto" py={4}>
      <Typography variant="h5" gutterBottom>
        B2B-калькулятор
      </Typography>

      <Stack spacing={3}>
        <FormControl fullWidth>
          <InputLabel id="product-select-label">Товар</InputLabel>
          <Select
            labelId="product-select-label"
            value={productId}
            label="Товар"
            onChange={(e) => dispatch(setProduct(e.target.value))}
            data-testid="product-select"
          >
            {products.map((p) => (
              <MenuItem key={p.id} value={p.id} data-testid={`option-${p.id}`}>
                {p.name} — {p.price.toLocaleString()} ₽ / уп.
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <TextField
          label="Количество"
          type="number"
          inputProps={{ min: 0 }}
          value={quantity}
          onChange={(e) => dispatch(setQuantity(Number(e.target.value)))}
          data-testid="quantity-input"
        />

        <Button variant="outlined" onClick={() => setDialogOpen(true)} data-testid="open-add-item">
          Добавить позицию
        </Button>

        <B2BItemsTable />

        <Typography variant="h6" data-testid="total-price">
          Итог: {(itemsTotal + unitPrice * quantity).toLocaleString()} ₽
        </Typography>

        <Stack direction="row" spacing={2}>
          <Button variant="outlined" disabled={itemsTotal + unitPrice * quantity <= 0} onClick={() => {
            const csvItems = items.length ? items : productId && quantity > 0 ? [{ id: productId, quantity }] : [];
            if (!csvItems.length) return;
            const csv = generateCsv(csvItems, prices);
            const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
            const url = URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", "b2b-calculator.csv");
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
          }} data-testid="export-csv">
            Export CSV
          </Button>
          <Button
            variant="contained"
            disabled={isQuoteLoading || (items.length === 0 && !(productId && quantity > 0))}
            onClick={async () => {
              const quoteItems = items.length ? items : [{ id: productId, quantity }];
              try {
                const res = await requestQuote({ items: quoteItems }).unwrap();
                window.open(res.url, "_blank");
                setSnackbarOpen(true);
              } catch (err) {
                console.error(err);
              }
            }}
            data-testid="request-quote"
          >
            {isQuoteLoading ? "Отправка..." : "Запросить КП"}
          </Button>
        </Stack>
        <AddItemDialog
          open={dialogOpen}
          onClose={() => setDialogOpen(false)}
          onAdd={(payload) => dispatch(addItem(payload))}
        />
        <Snackbar
          open={snackbarOpen}
          autoHideDuration={4000}
          onClose={() => setSnackbarOpen(false)}
          message="Коммерческое предложение готово"
        />
      </Stack>
    </Box>
  );
}
