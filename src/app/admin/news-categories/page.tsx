"use client";

import { Box, Stack, Button } from "@mui/material";
import AdminPageHeading from "@/components/admin/AdminPageHeading";
import { useState } from "react";
import ConfirmDialog from "@/components/admin/ConfirmDialog";
import { useDispatch } from "react-redux";
import { showSnackbar } from "@/redux/snackbarSlice";
import AdminDataGrid from "@/components/admin/AdminDataGrid";
import type { GridColDef, GridRowSelectionModel } from "@mui/x-data-grid";
import type { NewsCategory } from "@/types/admin";
import {
  useGetAdminNewsCategoriesQuery,
  useCreateNewsCategoryMutation,
  useUpdateNewsCategoryMutation,
  useDeleteNewsCategoryMutation,
} from "@/redux/api";
import AddNewsCategoryDialog from "@/components/admin/AddNewsCategoryDialog";

const columns: GridColDef[] = [
  { field: "id", headerName: "ID", width: 120 },
  { field: "title", headerName: "Название", flex: 1, minWidth: 160, editable: true },
];

export default function AdminNewsCategoriesPage() {
  const { data = [], isLoading, refetch } = useGetAdminNewsCategoriesQuery();
  const [createCat] = useCreateNewsCategoryMutation();
  const [updateCat] = useUpdateNewsCategoryMutation();
  const [deleteCat] = useDeleteNewsCategoryMutation();
  const dispatch = useDispatch();

  const [openAdd, setOpenAdd] = useState(false);
  const [selection, setSelection] = useState<GridRowSelectionModel>([]);
  const [confirmAction, setConfirmAction] = useState<null | (() => Promise<void>)>(null);

  const handleCreate = async (payload: Pick<NewsCategory, "title">) => {
    try {
      await createCat(payload).unwrap();
      setOpenAdd(false);
      refetch();
      dispatch(showSnackbar({ message: "Категория создана", severity: "success" }));
    } catch {
      dispatch(showSnackbar({ message: "Ошибка создания", severity: "error" }));
    }
  };

  const handleUpdate = async (id: string, patch: Partial<NewsCategory>) => {
    try {
      await updateCat({ id, patch }).unwrap();
      refetch();
      dispatch(showSnackbar({ message: "Изменено", severity: "success" }));
    } catch {
      dispatch(showSnackbar({ message: "Ошибка изменения", severity: "error" }));
    }
  };

  const handleDelete = (ids: string[]) => {
    setConfirmAction(() => async () => {
      try {
        await Promise.all(ids.map((id) => deleteCat(id).unwrap()));
        refetch();
        setSelection([]);
        dispatch(showSnackbar({ message: "Удалено", severity: "success" }));
      } catch {
        dispatch(showSnackbar({ message: "Ошибка удаления", severity: "error" }));
      }
    });
  };

  return (
    <Box>
      <AdminPageHeading
        title="Категории новостей"
        actions={
          <Stack direction="row" spacing={1}>
            <Button
              variant="outlined"
              size="small"
              disabled={selection.length === 0}
              onClick={() => handleDelete(selection.map(String))}
            >
              Удалить выбранные
            </Button>
            <Button
              variant="contained"
              size="small"
              onClick={() => setOpenAdd(true)}
              data-testid="add-category-btn"
            >
              + Добавить
            </Button>
          </Stack>
        }
      />
      <AdminDataGrid<NewsCategory>
        rows={data as NewsCategory[]}
        columns={columns}
        loading={isLoading}
        onDelete={(id) => handleDelete([id])}
        onUpdate={handleUpdate}
        checkboxSelection
        selectionModel={selection}
        onSelectionModelChange={setSelection}
      />
      <AddNewsCategoryDialog open={openAdd} onClose={() => setOpenAdd(false)} onCreate={handleCreate} />
      <ConfirmDialog
        open={Boolean(confirmAction)}
        title="Удалить?"
        description="Действие необратимо."
        confirmText="Удалить"
        onConfirm={() => {
          if (confirmAction) {
            const action = confirmAction;
            setConfirmAction(null);
            action();
          }
        }}
        onClose={() => setConfirmAction(null)}
      />
    </Box>
  );
}
