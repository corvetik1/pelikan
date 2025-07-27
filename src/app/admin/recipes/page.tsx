"use client";

import { Box, Typography, Button, Stack } from "@mui/material";
import AdminPageHeading from "@/components/admin/AdminPageHeading";
import ViewToggle from '@/components/admin/ViewToggle';
import { useDispatch } from 'react-redux';
import { showSnackbar } from '@/redux/snackbarSlice';
import ConfirmDialog from "@/components/admin/ConfirmDialog";
import { useState } from "react";
import { GridColDef } from "@mui/x-data-grid";
import AdminDataGrid from "@/components/admin/AdminDataGrid";
import AdminRecipeCard from '@/components/admin/AdminRecipeCard';
import { useViewMode } from '@/hooks/useViewMode';

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

  const [viewMode] = useViewMode('recipes');
  const { data = [], isLoading, isError, refetch } = useGetAdminRecipesQuery(undefined, { skip: typeof window === 'undefined' });
  const dispatch = useDispatch();
  const [createRecipe] = useCreateRecipeMutation();
  const [updateRecipe] = useUpdateAdminRecipeMutation();
  const [deleteRecipe] = useDeleteRecipeMutation();
  const [openAdd, setOpenAdd] = useState(false);
  const openAddDialog = () => {
    setOpenAdd(true);
  };
  
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
      <AdminPageHeading
        title="Рецепты"
        actions={
          <Stack direction="row" spacing={1} alignItems="center">
            <ViewToggle section="recipes" />
            <Button variant="contained" size="small" onClick={openAddDialog}>
              + Добавить
            </Button>
          </Stack>
        }
      />
      {viewMode === 'list' ? (
        <AdminDataGrid
          rows={data as AdminRecipe[]}
          columns={baseColumns}
          loading={isLoading}
          onDelete={handleDelete}
          onUpdate={handleUpdate}
        />
      ) : (
        <Box display="flex" flexWrap="wrap" gap={2}>
          {(data as AdminRecipe[]).map((item) => (
            <Box key={item.id} sx={{ width: { xs: '100%', sm: 'calc(50% - 16px)', md: 'calc(33.333% - 16px)' } }}>
              <AdminRecipeCard item={item} onClick={() => {/* open edit dialog later */}} />
            </Box>
          ))}
        </Box>
      )}
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
