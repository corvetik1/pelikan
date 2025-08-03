"use client";

import { Box, Avatar } from "@mui/material";
import AdminPageHeading from "@/components/admin/AdminPageHeading";
import { useState } from "react";
import { useDispatch } from "react-redux";
import AdminDataGrid from "@/components/admin/AdminDataGrid";
import ConfirmDialog from "@/components/admin/ConfirmDialog";
import AddThemeDialog from "@/components/admin/AddThemeDialog";
import {
  useGetAdminThemesQuery,
  useCreateThemeMutation,
  useUpdateThemeMutation,
  useDeleteThemeMutation,
  useGetSettingsQuery,
} from "@/redux/api";
import type { GridColDef, GridRowSelectionModel } from "@mui/x-data-grid";
import type { AdminTheme } from "@/types/admin";
import { showSnackbar } from "@/redux/snackbarSlice";

const columns: GridColDef[] = [
  { field: "slug", headerName: "Slug", width: 180 },
  {
    field: "preview",
    headerName: "Превью",
    width: 100,
    sortable: false,
    filterable: false,
    renderCell: (params) =>
      params.value ? <Avatar src={params.value as string} variant="rounded" /> : null,
  },
  { field: "name", headerName: "Название", flex: 1, minWidth: 200, editable: true },
  { field: "createdAt", headerName: "Создана", width: 160 },
];

export default function AdminThemesPage() {
  const { data = [], isLoading, refetch } = useGetAdminThemesQuery();
  const { data: settings } = useGetSettingsQuery();
  const activeSlug = settings?.activeThemeSlug;
  const [createTheme] = useCreateThemeMutation();
  const [updateTheme] = useUpdateThemeMutation();
  const [deleteTheme] = useDeleteThemeMutation();
  const dispatch = useDispatch();

  const [openAdd, setOpenAdd] = useState(false);
  const [selection, setSelection] = useState<GridRowSelectionModel>([]);
  const [confirmAction, setConfirmAction] = useState<null | (() => Promise<void>)>(null);

  /* ----------------- CRUD handlers ----------------- */
  const handleCreate = async (payload: Parameters<typeof createTheme>[0]) => {
    try {
      await createTheme(payload).unwrap();
      setOpenAdd(false);
      refetch();
      dispatch(showSnackbar({ message: "Тема добавлена", severity: "success" }));
    } catch {
      dispatch(showSnackbar({ message: "Ошибка создания", severity: "error" }));
    }
  };

  const handleUpdate = async (slug: string, patch: Partial<AdminTheme>) => {
    try {
      await updateTheme({ slug, patch }).unwrap();
      refetch();
      dispatch(showSnackbar({ message: "Изменено", severity: "success" }));
    } catch {
      dispatch(showSnackbar({ message: "Ошибка изменения", severity: "error" }));
    }
  };

  const handleDelete = (slugs: string[]) => {
    setConfirmAction(() => async () => {
      try {
        await Promise.all(slugs.map((s) => deleteTheme(s).unwrap()));
        refetch();
        setSelection([]);
        dispatch(showSnackbar({ message: "Удалено", severity: "success" }));
      } catch {
        dispatch(showSnackbar({ message: "Ошибка удаления", severity: "error" }));
      }
    });
  };

  /* ----------------- render ----------------- */
  return (
    <Box>
      <AdminPageHeading
        title="Темы"
        onCreate={() => setOpenAdd(true)}
        createPerm="themes:create"
        onBulkDelete={() => handleDelete(selection.map(String))}
        bulkDeletePerm="themes:delete"
        bulkDeleteDisabled={selection.length === 0 || selection.includes(activeSlug ?? '')}
        bulkDeleteLabel={selection.includes(activeSlug ?? '') ? 'Нельзя удалить активную тему' : 'Удалить выбранные'}
      />

      <AdminDataGrid<AdminTheme>
        rows={data as AdminTheme[]}
        columns={columns}
        loading={isLoading}
        onDelete={(slug) => {
          if (slug === activeSlug) {
            dispatch(showSnackbar({ message: 'Нельзя удалить активную тему', severity: 'warning' }));
            return;
          }
          handleDelete([slug]);
        }}
        onUpdate={handleUpdate}
        checkboxSelection
        selectionModel={selection}
        onSelectionModelChange={setSelection}
      />

      <AddThemeDialog open={openAdd} onClose={() => setOpenAdd(false)} onCreate={handleCreate} />
      <ConfirmDialog
        open={Boolean(confirmAction)}
        title="Удалить тему?"
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
