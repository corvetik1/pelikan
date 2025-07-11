"use client";

import { Box, Button, Stack, Typography, Snackbar, Alert } from "@mui/material";
import ConfirmDialog from "@/components/admin/ConfirmDialog";

import AddIcon from "@mui/icons-material/Add";
import { useState } from "react";
import AdminDataGrid from "@/components/admin/AdminDataGrid";
import StoreDialog from "@/components/admin/StoreDialog";
import {
  useGetAdminStoresQuery,
  useCreateStoreMutation,
  useUpdateStoreMutation,
  useDeleteStoreMutation,
} from "@/redux/api";
import type { GridColDef } from "@mui/x-data-grid";
import { AdminStore } from "@/types/admin";

export default function AdminStoresPage() {
  const { data = [], isLoading } = useGetAdminStoresQuery();
  const [create] = useCreateStoreMutation();
  const [update] = useUpdateStoreMutation();
  const [remove] = useDeleteStoreMutation();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [snack, setSnack] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({ open: false, message: '', severity: 'success' });
  const handleSnackClose = () => setSnack((s) => ({ ...s, open: false }));
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const columns: GridColDef[] = [
    { field: "name", headerName: "Название", flex: 1, editable: true },
    { field: "region", headerName: "Регион", width: 150, editable: true },
    { field: "address", headerName: "Адрес", flex: 2, editable: true },
    { field: "isActive", headerName: "Активен", type: "boolean", width: 110, editable: true },
  ];

  const handleDelete = (id: string) => {
    setDeleteId(id);
  };

  const confirmDelete = async () => {
    if (!deleteId) return;
    try {
      await remove(deleteId).unwrap();
      setSnack({ open: true, message: 'Удалено', severity: 'success' });
    } catch {
      setSnack({ open: true, message: 'Ошибка удаления', severity: 'error' });
    } finally {
      setDeleteId(null);
    }
  };

  return (
    <Box>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
        <Typography variant="h5">Магазины</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setDialogOpen(true)}
          data-testid="add-store-btn"
        >
          Добавить
        </Button>
      </Stack>

      <AdminDataGrid<AdminStore>
        rows={data}
        columns={columns}
        loading={isLoading}
        onDelete={handleDelete}
        onUpdate={(id, patch) => update({ id, patch })}
      />

      <StoreDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onSave={async (payload) => {
          try {
            if (payload.id) {
              await update({ id: payload.id, patch: payload }).unwrap();
              setSnack({ open: true, message: 'Изменено', severity: 'success' });
            } else {
              await create(payload as Omit<AdminStore, 'id'>).unwrap();
              setSnack({ open: true, message: 'Создано', severity: 'success' });
            }
          } catch {
            setSnack({ open: true, message: 'Ошибка сохранения', severity: 'error' });
          }
        }}
      />
      <ConfirmDialog
        open={Boolean(deleteId)}
        title="Удалить магазин?"
        description="Действие необратимо."
        confirmText="Удалить"
        onConfirm={confirmDelete}
        onClose={() => setDeleteId(null)}
      />
      <Snackbar open={snack.open} autoHideDuration={4000} onClose={handleSnackClose} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
        <Alert severity={snack.severity} onClose={handleSnackClose} sx={{ width: '100%' }}>
          {snack.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
