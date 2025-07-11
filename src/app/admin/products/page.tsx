"use client";

import { Box, Snackbar, Alert, Typography, Button, Stack } from "@mui/material";
import ConfirmDialog from "@/components/admin/ConfirmDialog";
import { useState } from "react";
import { GridColDef } from "@mui/x-data-grid";
import AdminDataGrid from "@/components/admin/AdminDataGrid";

import { useGetAdminProductsQuery, useCreateProductMutation, useUpdateAdminProductMutation, useDeleteProductMutation } from "@/redux/adminApi";

import AddProductDialog from "@/components/admin/AddProductDialog";
import type { AdminProduct } from "@/types/admin";

const baseColumns: GridColDef[] = [
  { field: "id", headerName: "ID", width: 110 },
  { field: "name", headerName: "Название", flex: 1, minWidth: 200, editable: true },
  {
    field: "price",
    headerName: "Цена, ₽",
    width: 130,
    editable: true,
    valueFormatter: (value: number) =>
      (value as number).toLocaleString("ru-RU", {
        style: "currency",
        currency: "RUB",
        maximumFractionDigits: 0,
      }),
  },
  { field: "weight", headerName: "Вес", width: 120, editable: true },
  { field: "category", headerName: "Категория", width: 150, editable: true },
];

type MutationResult = Promise<unknown> & { unwrap?: () => Promise<unknown> };

async function resolveMutation(res: MutationResult | undefined): Promise<void> {
  if (!res) {
    return;
  }
  if (typeof res.unwrap === "function") {
    await res.unwrap();
  } else {
    await res;
  }
}

export default function AdminProductsPage() {
  const { data = [], isLoading, isError, refetch } = useGetAdminProductsQuery();
  const [createProduct] = useCreateProductMutation();
  const [updateProduct] = useUpdateAdminProductMutation();
  const [deleteProduct] = useDeleteProductMutation();
  const [openAdd, setOpenAdd] = useState(false);
  const [snack, setSnack] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({ open: false, message: '', severity: 'success' });
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const handleSnackClose = () => setSnack((s) => ({ ...s, open: false }));

  const handleAdd = async (payload: Partial<AdminProduct>) => {
    try {
      await resolveMutation(createProduct(payload));
      setOpenAdd(false);
      refetch();
      setSnack({ open: true, message: 'Товар создан', severity: 'success' });
    } catch {
      setSnack({ open: true, message: 'Ошибка создания', severity: 'error' });
    }
  };

  const handleUpdate = async (id: string, patch: Partial<AdminProduct>) => {
    try {
      await resolveMutation(updateProduct({ id, patch }));
      refetch();
      setSnack({ open: true, message: 'Изменено', severity: 'success' });
    } catch {
      setSnack({ open: true, message: 'Ошибка изменения', severity: 'error' });
    }
  };

  const handleDelete = async (id: string) => {
    setDeleteId(id);
  };

  const confirmDelete = async () => {
    if (!deleteId) return;
    try {
      await resolveMutation(deleteProduct(deleteId));
      refetch();
      setSnack({ open: true, message: 'Удалено', severity: 'success' });
    } catch {
      setSnack({ open: true, message: 'Ошибка удаления', severity: 'error' });
    } finally {
      setDeleteId(null);
    }
  };

  const columns: GridColDef[] = baseColumns;

  
  if (isError || !data) {
    return (
      <Stack spacing={2} alignItems="center" sx={{ mt: 4 }}>
        <Typography>Ошибка загрузки товаров</Typography>
        <Button variant="contained" onClick={() => refetch()}>Повторить</Button>
      </Stack>
    );
  }

  return (
    <Box>
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h5">Товары</Typography>
        <Button variant="contained" size="small" onClick={() => setOpenAdd(true)}>
            + Добавить
          </Button>
      </Stack>
      <AdminDataGrid
        rows={data as AdminProduct[]}
        columns={columns}
        loading={isLoading}
        onDelete={handleDelete}
        onUpdate={handleUpdate}
      />
      <AddProductDialog open={openAdd} onClose={() => setOpenAdd(false)} onCreate={handleAdd} />
      <ConfirmDialog
        open={Boolean(deleteId)}
        title="Удалить товар?"
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
