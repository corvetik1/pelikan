"use client";

import { Box, TextField, Typography, MenuItem, Select, InputLabel, FormControl, Button, Stack, IconButton, useTheme, useMediaQuery } from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "@/redux/store";
import { setProduct, setQuantity, setPrices, addItem, removeItem, updateItemQuantity, setQuoteId, setQuoteStatus } from "@/redux/b2bCalculatorSlice";
import { useGetAllProductsQuery } from '@/redux/api';
import { calcTotal } from "@/utils/b2b";
import { useGetB2BPricesQuery } from "@/redux/api";
import B2BItemsTable from "./B2BItemsTable";
import { generateCsv } from '@/utils/csv';
import { useCreateQuoteMutation, useGetQuoteQuery } from '@/redux/api';
import Snackbar from "@mui/material/Snackbar";
import AddItemDialog from "./AddItemDialog";
import { useEffect, useState, useMemo } from "react";
import AddIcon from "@mui/icons-material/Add";
import Skeleton from "@mui/material/Skeleton";

export default function B2BCalculator() {
  const dispatch = useDispatch();
  const theme = useTheme();
  const isXs = useMediaQuery(theme.breakpoints.down('sm'));
  // fetch all products for selects / names map
  const { data: productsData = [], isLoading: isProductsLoading } = useGetAllProductsQuery();

  // local UI state and mutations
  const [dialogOpen, setDialogOpen] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [createQuote, { isLoading: isCreateLoading }] = useCreateQuoteMutation();

  const { productId, quantity, prices, items, quoteId, quoteStatus } = useSelector((s: RootState) => s.b2bCalculator);


  // prepare items list for calculation
  const currentItems = items.length ? items : productId && quantity > 0 ? [{ id: productId, quantity }] : [];
  const { net, vat, gross } = calcTotal(currentItems, prices);

  const quantityError = quantity < 0;

  const productNames = useMemo(() => Object.fromEntries(productsData.map((p) => [p.id, p.name])), [productsData]);

  // fetch B2B prices
  const { data: pricesData = [], isLoading: isPricesLoading } = useGetB2BPricesQuery();

  useEffect(() => {
    if (pricesData.length) {
      const map = Object.fromEntries(pricesData.map((p) => [p.id, p.price]));
      dispatch(setPrices(map));
    }
  }, [dispatch, pricesData]);

  // polling quote status
  const { data: quoteData } = useGetQuoteQuery(quoteId ?? '', {
    skip: !quoteId,
    pollingInterval: quoteStatus === 'pending' ? 10000 : 0,
  });

  useEffect(() => {
    if (quoteData && quoteData.status !== quoteStatus) {
      dispatch(setQuoteStatus(quoteData.status));
      if (quoteData.status === 'priced' && quoteData.prices) {
        dispatch(setPrices(quoteData.prices));
        setSnackbarOpen(true);
      }
    }
  }, [quoteData, quoteStatus, dispatch]);

  const showPrices = quoteStatus === 'priced' || !quoteId;

  if ((isPricesLoading || isProductsLoading) && (!Object.keys(prices).length || !productsData.length)) {
    return (
      <Box sx={{ maxWidth: 800, mx: "auto", py: 4 }}>
        <Skeleton variant="rectangular" height={400} />
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
            {productsData.map((p) => (
              <MenuItem key={p.id} value={p.id} data-testid={`option-${p.id}`}>
                {p.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <TextField
          label="Ваш email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <TextField
          label="Количество"
          type="number"
          inputProps={{ min: 0 }}
          value={quantity}
          error={quantityError}
          helperText={quantityError ? "Введите число больше 0" : undefined}
          onChange={(e) => dispatch(setQuantity(Number(e.target.value)))}
          data-testid="quantity-input"
        />

        {isXs ? (
          <IconButton color="primary" onClick={() => setDialogOpen(true)} data-testid="open-add-item-xs" aria-label="Добавить позицию">
            <AddIcon />
          </IconButton>
        ) : (
          <Button variant="outlined" onClick={() => setDialogOpen(true)} data-testid="open-add-item">
            Добавить позицию
          </Button>
        )}

        {/* Items table */}
        <B2BItemsTable
          items={items}
          prices={prices}
          names={productNames}
          showPrices={showPrices}
          onRemove={(id) => dispatch(removeItem(id))}
          onQuantityChange={(id, quantity) => dispatch(updateItemQuantity({ id, quantity }))}
        />

        {/* Totals and actions */}
        {showPrices && (
          <Stack direction={isXs ? 'column' : 'row'} justifyContent="space-between" alignItems={isXs ? 'stretch' : 'center'} spacing={2}>
            <Stack spacing={0.5}>
              <Typography>Стоимость без НДС: {net.toLocaleString()} ₽</Typography>
              <Typography>НДС (20 %): {vat.toLocaleString()} ₽</Typography>
              <Typography variant="h6" data-testid="gross-price">Итого c НДС: {gross.toLocaleString()} ₽</Typography>
            </Stack>

            <Stack direction="row" spacing={2}
              sx={{ mt: isXs ? 2 : 0 }}>

              <Button variant="outlined" disabled={gross <= 0} onClick={() => {
                const csvItems = currentItems;
                if (!csvItems.length) return;
                const csv = generateCsv(csvItems, prices, productNames);
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
                disabled={isCreateLoading || currentItems.length === 0 || !email || !!quoteId}
                onClick={async () => {
                  const quoteItems = currentItems;
                  try {
                    const res = await createQuote({ items: quoteItems, userEmail: email }).unwrap();
                    dispatch(setQuoteId(res.id));
                    dispatch(setQuoteStatus('pending'));
                    setSnackbarOpen(true);
                  } catch (err) {
                    console.error(err);
                  }
                }}
                data-testid="request-quote"
              >
                {isCreateLoading ? "Отправка..." : quoteId ? "Ожидание расчёта" : "Запросить КП"}
              </Button>
            </Stack>
          </Stack>
        )}
        <AddItemDialog
          open={dialogOpen}
          onClose={() => setDialogOpen(false)}
          onAdd={(payload) => dispatch(addItem(payload))}
          products={productsData}
        />
        <Snackbar
          open={snackbarOpen}
          autoHideDuration={4000}
          onClose={() => setSnackbarOpen(false)}
          message={quoteStatus === 'priced' ? 'Коммерческое предложение готово' : 'Запрос отправлен'}
        />
      </Stack>
    </Box>
  );
}
