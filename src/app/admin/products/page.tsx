"use client";

import { Box, CircularProgress, Typography, Button, Stack } from "@mui/material";
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

  const handleAdd = async (payload: Partial<AdminProduct>) => {
    await resolveMutation(createProduct(payload));
    setOpenAdd(false);
    refetch();
  };

  const handleUpdate = async (id: string, patch: Partial<AdminProduct>) => {
    await resolveMutation(updateProduct({ id, patch }));
    refetch();
  };

  const handleDelete = async (id: string) => {
    if (confirm("Удалить товар?")) {
      await resolveMutation(deleteProduct(id));
      refetch();
    }
  };

  const columns: GridColDef[] = baseColumns;

  if (isLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

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
    </Box>
  );
}
