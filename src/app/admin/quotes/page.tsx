"use client";

import { Box, Button, Stack, Typography, Snackbar, Alert } from "@mui/material";
import { DataGrid, GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import dayjs from "dayjs";
import { useState } from "react";

import { useGetAdminQuotesQuery, useUpdateQuotePricesMutation } from "@/redux/api";
import type { Quote } from "@/types/quote";
import QuotesPricesDialog from "@/components/admin/QuotesPricesDialog";

export default function AdminQuotesPage() {
  const { data: quotes = [], isLoading, isError, refetch } = useGetAdminQuotesQuery();
  const [updatePrices] = useUpdateQuotePricesMutation();

  const [selectedQuote, setSelectedQuote] = useState<Quote | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [snack, setSnack] = useState<{ open:boolean; message:string; severity:'success'|'error' }>({ open:false, message:'', severity:'success' });
  const handleSnackClose = () => setSnack((s)=>({ ...s, open:false }));

  const openDialog = (quote: Quote) => {
    setSelectedQuote(quote);
    setDialogOpen(true);
  };

  const handleSavePrices = async (prices: Record<string, number>) => {
    if (!selectedQuote) return;
    try {
      await updatePrices({ id: selectedQuote.id, prices }).unwrap();
      setSnack({ open:true, message:'Цены утверждены', severity:'success' });
    } catch {
      setSnack({ open:true, message:'Ошибка сохранения', severity:'error' });
    } finally {
      setDialogOpen(false);
      setSelectedQuote(null);
      refetch();
    }
  };

  if (isError) {
    return (
      <Stack spacing={2} alignItems="center" mt={4}>
        <Typography>Ошибка загрузки заявок</Typography>
        <Button variant="contained" onClick={() => refetch()}>
          Повторить
        </Button>
      </Stack>
    );
  }

  const columns: GridColDef[] = [
    { field: "id", headerName: "ID", width: 130 },
    { field: "userEmail", headerName: "Email", width: 200 },
    {
      field: "status",
      headerName: "Статус",
      width: 110,
      valueFormatter: ({ value }) => {
        switch (value as Quote["status"]) {
          case "pending":
            return "Ожидает";
          case "priced":
            return "Готово";
          case "rejected":
            return "Отклонено";
          default:
            return String(value);
        }
      },
    },
    {
      field: "itemsCount",
      headerName: "Позиций",
      width: 110,
      valueGetter: (_value, row) => (row as Quote).items.length,
    },
    {
      field: "createdAt",
      headerName: "Создано",
      width: 160,
      valueFormatter: ({ value }) => dayjs(value as string).format("DD.MM.YYYY HH:mm"),
    },
    {
      field: "actions",
      headerName: "",
      width: 160,
      sortable: false,
      renderCell: (params: GridRenderCellParams) => {
        const quote = params.row as Quote;
        return (
          <Button
            variant="outlined"
            size="small"
            onClick={() => openDialog(quote)}
            disabled={quote.status === "priced"}
          >
            {quote.status === "priced" ? "Просмотр" : "Утвердить цены"}
          </Button>
        );
      },
    },
  ];

  return (
    <Box>
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h5">Заявки</Typography>
      </Stack>

      <DataGrid
        rows={quotes}
        columns={columns}
        autoHeight
        density="comfortable"
        hideFooterSelectedRowCount
        loading={isLoading}
        initialState={{ pagination: { paginationModel: { pageSize: 10, page: 0 } } }}
      />

      <QuotesPricesDialog
        open={dialogOpen}
        quote={selectedQuote}
        onClose={() => setDialogOpen(false)}
        onSave={handleSavePrices}
      />
      <Snackbar open={snack.open} autoHideDuration={4000} onClose={handleSnackClose} anchorOrigin={{ vertical:'bottom', horizontal:'right' }}>
        <Alert severity={snack.severity} onClose={handleSnackClose} sx={{ width:'100%' }}>
          {snack.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
