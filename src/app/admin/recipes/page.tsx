"use client";

import { Box, Typography, Button, Stack } from "@mui/material";
import { useDispatch } from 'react-redux';
import { showSnackbar } from '@/redux/snackbarSlice';
import ConfirmDialog from "@/components/admin/ConfirmDialog";
import { useState } from "react";
import { GridColDef } from "@mui/x-data-grid";
import AdminDataGrid from "@/components/admin/AdminDataGrid";

import {
  useGetAdminRecipesQuery,
  useCreateRecipeMutation,
  useUpdateAdminRecipeMutation,
  useDeleteRecipeMutation,
} from "@/redux/adminApi";

import AddRecipeDialog from "@/components/admin/AddRecipeDialog";
import type { AdminRecipe } from "@/types/admin";

const baseColumns: GridColDef[] = [
  { field: "id", headerName: "ID", width: 110 },
  { field: "title", headerName: "Название", flex: 1, minWidth: 200, editable: true },
  { field: "category", headerName: "Категория", width: 150, editable: true },
  {
    field: "cookingTime",
    headerName: "Время, мин",
    width: 130,
    editable: true,
    type: "number",
  },
  { field: "shortDescription", headerName: "Описание", flex: 2, minWidth: 300, editable: true },
];

// util for handling unwrap / promise
type MutationResult = Promise<unknown> & { unwrap?: () => Promise<unknown> };

async function resolveMutation(res: MutationResult | undefined): Promise<void> {
  if (!res) return;
  if (typeof res.unwrap === "function") {
    await res.unwrap();
  } else {
    await res;
  }
}

export default function AdminRecipesPage() {
  const { data = [], isLoading, isError, refetch } = useGetAdminRecipesQuery();
  const dispatch = useDispatch();
  const [createRecipe] = useCreateRecipeMutation();
  const [updateRecipe] = useUpdateAdminRecipeMutation();
  const [deleteRecipe] = useDeleteRecipeMutation();
  const [openAdd, setOpenAdd] = useState(false);
  
  const [deleteId, setDeleteId] = useState<string | null>(null);
  

  const handleAdd = async (payload: Partial<AdminRecipe>) => {
    try {
      await resolveMutation(createRecipe(payload));
      setOpenAdd(false);
      refetch();
      dispatch(showSnackbar({ message: 'Рецепт создан', severity: 'success' }));
    } catch {
      dispatch(showSnackbar({ message: 'Ошибка создания', severity: 'error' }));
    }
  };

  const handleUpdate = async (id: string, patch: Partial<AdminRecipe>) => {
    try {
      await resolveMutation(updateRecipe({ id, patch }));
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
      await resolveMutation(deleteRecipe(deleteId));
      refetch();
      dispatch(showSnackbar({ message: 'Удалено', severity: 'success' }));
    } catch {
      dispatch(showSnackbar({ message: 'Ошибка удаления', severity: 'error' }));
    } finally {
      setDeleteId(null);
    }
  };


  if (isError || !data) {
    return (
      <Stack spacing={2} alignItems="center" sx={{ mt: 4 }}>
        <Typography>Ошибка загрузки рецептов</Typography>
        <Button variant="contained" onClick={() => refetch()}>
          Повторить
        </Button>
      </Stack>
    );
  }

  return (
    <Box>
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h5">Рецепты</Typography>
        <Button variant="contained" size="small" onClick={() => setOpenAdd(true)}>
          + Добавить
        </Button>
      </Stack>
      <AdminDataGrid
        rows={data as AdminRecipe[]}
        columns={baseColumns}
        loading={isLoading}
        onDelete={handleDelete}
        onUpdate={handleUpdate}
      />
      <AddRecipeDialog open={openAdd} onClose={() => setOpenAdd(false)} onCreate={handleAdd} />
      <ConfirmDialog
        open={Boolean(deleteId)}
        title="Удалить рецепт?"
        description="Действие необратимо."
        confirmText="Удалить"
        onConfirm={confirmDelete}
        onClose={() => setDeleteId(null)}
      />
      
        
          
        
      
    </Box>
  );
}
