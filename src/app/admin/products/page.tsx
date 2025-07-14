"use client";

import { Box, Typography, Button, Stack } from "@mui/material";
import ConfirmDialog from "@/components/admin/ConfirmDialog";
import { useState } from "react";
import { useDispatch } from 'react-redux';
import { showSnackbar } from '@/redux/snackbarSlice';
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
  const dispatch = useDispatch();
  const [createProduct] = useCreateProductMutation();
  const [updateProduct] = useUpdateAdminProductMutation();
  const [deleteProduct] = useDeleteProductMutation();
  const [openAdd, setOpenAdd] = useState(false);
  
  const [deleteId, setDeleteId] = useState<string | null>(null);
  

  const handleAdd = async (payload: Partial<AdminProduct>) => {
    try {
      await resolveMutation(createProduct(payload));
      setOpenAdd(false);
      refetch();
      dispatch(showSnackbar({ message: 'Товар создан', severity: 'success' }));
    } catch {
      dispatch(showSnackbar({ message: 'Ошибка создания', severity: 'error' }));
    }
  };

  const handleUpdate = async (id: string, patch: Partial<AdminProduct>) => {
    try {
      await resolveMutation(updateProduct({ id, patch }));
      refetch();
      dispatch(showSnackbar({ message: 'Изменено', severity: 'success' }));
    } catch {
      dispatch(showSnackbar({ message: 'Ошибка изменения', severity: 'error' }));
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
      dispatch(showSnackbar({ message: 'Удалено', severity: 'success' }));
    } catch {
      dispatch(showSnackbar({ message: 'Ошибка удаления', severity: 'error' }));
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
      
        
          
        
      
    </Box>
  );
}
