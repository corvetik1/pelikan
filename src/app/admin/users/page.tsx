"use client";

import { Box, CircularProgress, Typography, Button, Stack, Checkbox } from "@mui/material";
import { useState } from "react";
import { GridColDef, GridRenderEditCellParams } from "@mui/x-data-grid";
import AdminDataGrid from "@/components/admin/AdminDataGrid";

import {
  useGetAdminUsersQuery,
  useCreateUserMutation,
  useUpdateAdminUserMutation,
  useDeleteUserMutation,
} from "@/redux/adminApi";

import AddUserDialog from "@/components/admin/AddUserDialog";
import type { AdminUser } from "@/types/admin";

const roleOptions = [
  { value: "admin", label: "admin" },
  { value: "editor", label: "editor" },
  { value: "viewer", label: "viewer" },
];

const baseColumns: GridColDef[] = [
  { field: "id", headerName: "ID", width: 110 },
  { field: "email", headerName: "Email", flex: 1, minWidth: 200 },
  {
    field: "role",
    headerName: "Роль",
    width: 140,
    editable: true,
    type: "singleSelect",
    valueOptions: roleOptions,
  },
  {
    field: "isActive",
    headerName: "Активен",
    width: 120,
    editable: true,
    renderCell: (params) => <Checkbox checked={Boolean(params.value)} disabled />, // display only
    renderEditCell: (params: GridRenderEditCellParams<boolean>) => (
      <Checkbox
        autoFocus
        checked={Boolean(params.value)}
        onChange={(e) => params.api.setEditCellValue({ id: params.id, field: params.field, value: e.target.checked })}
      />
    ),
  },
  { field: "createdAt", headerName: "Создан", width: 180, valueFormatter: (v) => new Date(v as string).toLocaleString() },
];

type MutationResult = Promise<unknown> & { unwrap?: () => Promise<unknown> };

async function resolveMutation(res: MutationResult | undefined): Promise<void> {
  if (!res) return;
  if (typeof res.unwrap === "function") {
    await res.unwrap();
  } else {
    await res;
  }
}

export default function AdminUsersPage() {
  const { data = [], isLoading, isError, refetch } = useGetAdminUsersQuery();
  const [createUser] = useCreateUserMutation();
  const [updateUser] = useUpdateAdminUserMutation();
  const [deleteUser] = useDeleteUserMutation();
  const [openAdd, setOpenAdd] = useState(false);

  const handleAdd = async (payload: Partial<AdminUser>) => {
    await resolveMutation(createUser(payload));
    setOpenAdd(false);
    refetch();
  };

  const handleUpdate = async (id: string, patch: Partial<AdminUser>) => {
    await resolveMutation(updateUser({ id, patch }));
    refetch();
  };

  const handleDelete = async (id: string) => {
    if (confirm("Удалить пользователя?")) {
      await resolveMutation(deleteUser(id));
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
        <Typography>Ошибка загрузки пользователей</Typography>
        <Button variant="contained" onClick={() => refetch()}>
          Повторить
        </Button>
      </Stack>
    );
  }

  return (
    <Box>
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h5">Пользователи</Typography>
        <Button variant="contained" size="small" onClick={() => setOpenAdd(true)}>
          + Добавить
        </Button>
      </Stack>
      <AdminDataGrid
        rows={data as AdminUser[]}
        columns={baseColumns}
        loading={isLoading}
        onDelete={handleDelete}
        onUpdate={handleUpdate}
      />
      <AddUserDialog open={openAdd} onClose={() => setOpenAdd(false)} onCreate={handleAdd} />
    </Box>
  );
}
