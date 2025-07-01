"use client";

import { Box, CircularProgress, Typography, Button, Stack } from "@mui/material";
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
import type { Recipe } from "@/data/mock";

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
  const [createRecipe] = useCreateRecipeMutation();
  const [updateRecipe] = useUpdateAdminRecipeMutation();
  const [deleteRecipe] = useDeleteRecipeMutation();
  const [openAdd, setOpenAdd] = useState(false);

  const handleAdd = async (payload: Partial<Recipe>) => {
    await resolveMutation(createRecipe(payload));
    setOpenAdd(false);
    refetch();
  };

  const handleUpdate = async (id: string, patch: Partial<Recipe>) => {
    await resolveMutation(updateRecipe({ id, patch }));
    refetch();
  };

  const handleDelete = async (id: string) => {
    if (confirm("Удалить рецепт?")) {
      await resolveMutation(deleteRecipe(id));
      refetch();
    }
  };

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
        rows={data as Recipe[]}
        columns={baseColumns}
        loading={isLoading}
        onDelete={handleDelete}
        onUpdate={handleUpdate}
      />
      <AddRecipeDialog open={openAdd} onClose={() => setOpenAdd(false)} onCreate={handleAdd} />
    </Box>
  );
}
