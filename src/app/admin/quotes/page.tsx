"use client";

import { Box, Button, Stack, Typography, Snackbar, Alert } from "@mui/material";
import ViewToggle from '@/components/admin/ViewToggle';
import AdminQuoteCard from '@/components/admin/AdminQuoteCard';
import { DataGrid, GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import dayjs from "dayjs";
import { useState } from "react";
import AdminPageHeading from "@/components/admin/AdminPageHeading";

import { useUpdateQuotePricesMutation } from "@/redux/api";
import { useGetAdminQuotesQuery, useUpdateQuoteStatusMutation } from "@/redux/adminApi";
import { useViewMode } from '@/hooks/useViewMode';
import type { AdminQuote } from "@/types/admin";
import QuotesPricesDialog from "@/components/admin/QuotesPricesDialog";

export default function AdminQuotesPage() {
  const { data, isLoading, isError, refetch } = useGetAdminQuotesQuery({});
  const quotes = data?.items ?? [];
  const [viewMode] = useViewMode('quotes');
  const [updatePrices] = useUpdateQuotePricesMutation();
  const [updateStatus] = useUpdateQuoteStatusMutation();

  const [selectedQuote, setSelectedQuote] = useState<AdminQuote | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [snack, setSnack] = useState<{ open:boolean; message:string; severity:'success'|'error' }>({ open:false, message:'', severity:'success' });
  const handleSnackClose = () => setSnack((s)=>({ ...s, open:false }));

  const openDialog = (quote: AdminQuote) => {
    setSelectedQuote(quote);
    setDialogOpen(true);
  };

  const handleSavePrices = async (prices: Record<string, number>) => {
    if (!selectedQuote) return;
    try {
      await updatePrices({ id: selectedQuote.id, prices }).unwrap();
      await updateStatus({ id: selectedQuote.id, status: 'priced' }).unwrap();
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
        switch (value as AdminQuote["status"]) {
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
      valueGetter: (_value, row) => {
        const items = (row as AdminQuote).items;
        return Array.isArray(items) ? items.length : 0;
      },
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
        const quote = params.row as AdminQuote;
        
        const handleReject = async () => {
          try {
            await updateStatus({ id: quote.id, status: 'rejected' }).unwrap();
            setSnack({ open:true, message:'Заявка отклонена', severity:'success' });
          } catch {
            setSnack({ open:true, message:'Ошибка', severity:'error' });
          }
        };
        return (
          <Stack direction="row" spacing={1}>
            <Button
              variant="outlined"
              size="small"
              onClick={() => openDialog(quote)}
              disabled={quote.status !== 'pending'}
            >
              {quote.status === 'pending' ? 'Утвердить' : 'Просмотр'}
            </Button>
            {quote.status === 'pending' && (
              <Button variant="text" color="error" size="small" onClick={handleReject}>
                Отклонить
              </Button>
            )}
          </Stack>
        );
      },
    },
  ];

  return (
    <Box>
      <AdminPageHeading
        title="Заявки"
        actions={<ViewToggle section="quotes" />}
      />

      {viewMode === 'list' ? (

      <DataGrid
        rows={quotes}
        columns={columns}
        autoHeight
        density="comfortable"
        hideFooterSelectedRowCount
        loading={isLoading}
        initialState={{ pagination: { paginationModel: { pageSize: 10, page: 0 } } }}
      />

      ) : (
        <Box display="flex" flexWrap="wrap" gap={2}>
          {quotes.map((quote) => (
            <Box key={quote.id} sx={{ width: { xs: '100%', sm: 'calc(50% - 16px)', md: 'calc(33.333% - 16px)', lg: 'calc(25% - 16px)' } }}>
              <AdminQuoteCard quote={quote} onOpen={() => openDialog(quote)} />
            </Box>
          ))}
        </Box>
      )}

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
