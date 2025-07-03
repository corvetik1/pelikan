"use client";

import { Box, Typography, Stack, Button, CircularProgress, Chip } from "@mui/material";
import type { GridRowSelectionModel } from "@mui/x-data-grid";
import { GridColDef } from "@mui/x-data-grid";
import { useState } from "react";
import AdminDataGrid from "@/components/admin/AdminDataGrid";
import {
  useGetAdminRolesQuery,
  useCreateRoleMutation,
  useUpdateRoleMutation,
  useDeleteRoleMutation,
} from "@/redux/api";
import type { AdminRole } from "@/types/admin";
import AddRoleDialog from "@/components/admin/AddRoleDialog";

const columns: GridColDef[] = [
  { field: "id", headerName: "ID", width: 110 },
  { field: "name", headerName: "Название", flex: 1, minWidth: 160, editable: true },
  { field: "description", headerName: "Описание", flex: 1, minWidth: 200, editable: true },
  {
    field: "permissions",
    headerName: "Permissions",
    flex: 1,
    minWidth: 200,
    sortable: false,
    renderCell: (params) => (
      <Stack direction="row" spacing={0.5} flexWrap="wrap">
        {(params.value as string[]).map((p: string) => (
          <Chip key={p} label={p} size="small" />
        ))}
      </Stack>
    ),
  },
];

export default function AdminRolesPage() {
  const { data = [], isLoading, isError, refetch } = useGetAdminRolesQuery();
  const [createRole] = useCreateRoleMutation();
  const [updateRole] = useUpdateRoleMutation();
  const [deleteRole] = useDeleteRoleMutation();

  const [openAdd, setOpenAdd] = useState(false);
  const [selection, setSelection] = useState<GridRowSelectionModel>([]);

  const handleAdd = async (payload: Partial<AdminRole>) => {
    await createRole(payload).unwrap();
    setOpenAdd(false);
    refetch();
  };

  const handleUpdate = async (id: string, patch: Partial<AdminRole>) => {
    await updateRole({ id, patch }).unwrap();
    refetch();
  };

  const handleDelete = async (id: string) => {
    if (confirm("Удалить роль?")) {
      await deleteRole(id).unwrap();
      await refetch();
    }
  };

  if (isLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (isError) {
    return (
      <Stack spacing={2} alignItems="center" sx={{ mt: 4 }}>
        <Typography>Ошибка загрузки ролей</Typography>
        <Button variant="contained" onClick={() => refetch()}>
          Повторить
        </Button>
      </Stack>
    );
  }

  return (
    <Box>
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h5">Роли</Typography>
        <Stack direction="row" spacing={1}>
          <Button
            variant="outlined"
            size="small"
            disabled={selection.length === 0}
            onClick={async () => {
              if (!confirm("Удалить выбранные роли?")) return;
              await Promise.all(selection.map((id) => deleteRole(String(id)).unwrap()));
              setSelection([]);
              refetch();
            }}
            data-testid="bulk-delete"
          >
            Удалить выбранные
          </Button>
          <Button variant="contained" size="small" onClick={() => setOpenAdd(true)} data-testid="add-role">
            + Добавить
          </Button>
        </Stack>
      </Stack>
      <AdminDataGrid<AdminRole>
        rows={data as AdminRole[]}
        columns={columns}
        loading={isLoading}
        onDelete={handleDelete}
        onUpdate={handleUpdate}
        checkboxSelection
        selectionModel={selection}
        onSelectionModelChange={setSelection}
      />
      <AddRoleDialog open={openAdd} onClose={() => setOpenAdd(false)} onCreate={handleAdd} />
    </Box>
  );
}
