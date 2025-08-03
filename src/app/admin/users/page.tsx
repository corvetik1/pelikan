"use client";

import { Box, Typography, Stack, Checkbox, Button } from "@mui/material";
import AdminPageHeading from "@/components/admin/AdminPageHeading";
import { useDispatch } from 'react-redux';
import { showSnackbar } from '@/redux/snackbarSlice';
import ConfirmDialog from "@/components/admin/ConfirmDialog";
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
    renderEditCell: (params: GridRenderEditCellParams<AdminUser, boolean>) => (
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
  const dispatch = useDispatch();
  const [createUser] = useCreateUserMutation();
  const [updateUser] = useUpdateAdminUserMutation();
  const [deleteUser] = useDeleteUserMutation();
  const [openAdd, setOpenAdd] = useState(false);
  
  const [deleteId, setDeleteId] = useState<string | null>(null);
  

  const handleAdd = async (payload: Partial<AdminUser>) => {
    try {
      await resolveMutation(createUser(payload));
      setOpenAdd(false);
      refetch();
      dispatch(showSnackbar({ message: 'Пользователь создан', severity: 'success' }));
    } catch {
      dispatch(showSnackbar({ message: 'Ошибка создания', severity: 'error' }));
    }
  };

  const handleUpdate = async (id: string, patch: Partial<AdminUser>) => {
    try {
      await resolveMutation(updateUser({ id, patch }));
      refetch();
      dispatch(showSnackbar({ message: 'Изменено', severity: 'success' }));
    } catch {
      dispatch(showSnackbar({ message: 'Ошибка изменения', severity: 'error' }));
    }
  };

  const handleDelete = (id: string) => {
    setDeleteId(id);
  };

  const confirmDelete = async () => {
    if (!deleteId) return;
    try {
      await resolveMutation(deleteUser(deleteId));
      refetch();
      dispatch(showSnackbar({ message: 'Удалено', severity: 'success' }));
    } catch {
      dispatch(showSnackbar({ message: 'Ошибка удаления', severity: 'error' }));
    } finally {
      setDeleteId(null);
    }
  };

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        {/* Removed CircularProgress block */}
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
      <AdminPageHeading
        title="Пользователи"
        onCreate={() => setOpenAdd(true)}
        createPerm="users:create"
      />
      <AdminDataGrid
        rows={data as AdminUser[]}
        columns={baseColumns}
        loading={isLoading}
        onDelete={handleDelete}
        onUpdate={handleUpdate}
      />
      <AddUserDialog open={openAdd} onClose={() => setOpenAdd(false)} onCreate={handleAdd} />
      <ConfirmDialog
        open={Boolean(deleteId)}
        title="Удалить пользователя?"
        description="Действие необратимо."
        confirmText="Удалить"
        onConfirm={confirmDelete}
        onClose={() => setDeleteId(null)}
      />
      
        
          
        
      
    </Box>
  );
}
