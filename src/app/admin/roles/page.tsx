"use client";

import { Box, Chip, Stack, Typography, Button } from "@mui/material";
import AdminPageHeading from "@/components/admin/AdminPageHeading";
import { useDispatch } from 'react-redux';
import { showSnackbar } from '@/redux/snackbarSlice';
import ConfirmDialog from "@/components/admin/ConfirmDialog";
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

export default function AdminRolesPage(): React.JSX.Element {
  const { data = [], isLoading, isError, refetch } = useGetAdminRolesQuery();
  const dispatch = useDispatch();
  const [createRole] = useCreateRoleMutation();
  const [updateRole] = useUpdateRoleMutation();
  const [deleteRole] = useDeleteRoleMutation();

  const [openAdd, setOpenAdd] = useState(false);
  const [selection, setSelection] = useState<GridRowSelectionModel>([]);
  
  
  const [confirmAction, setConfirmAction] = useState<null | (() => Promise<void>)>(null);


  const handleAdd = async (payload: Partial<AdminRole>) => {
    try {
      await createRole(payload).unwrap();
      setOpenAdd(false);
      refetch();
      dispatch(showSnackbar({ message: 'Роль создана', severity: 'success' }));
    } catch {
      dispatch(showSnackbar({ message: 'Ошибка создания', severity: 'error' }));
    }
  };

  const handleUpdate = async (id: string, patch: Partial<AdminRole>) => {
    try {
      await updateRole({ id, patch }).unwrap();
      refetch();
      dispatch(showSnackbar({ message: 'Изменено', severity: 'success' }));
    } catch {
      dispatch(showSnackbar({ message: 'Ошибка изменения', severity: 'error' }));
    }
  };

  const handleDelete = (id: string) => {
    setConfirmAction(() => async () => {
      try {
        await deleteRole(id).unwrap();
        await refetch();
        dispatch(showSnackbar({ message: 'Удалено', severity: 'success' }));
      } catch {
        dispatch(showSnackbar({ message: 'Ошибка удаления', severity: 'error' }));
      }
    });
  };

  const handleBulkDelete = (): void => {
    setConfirmAction(() => async () => {
      try {
        await Promise.all(selection.map((id) => deleteRole(String(id)).unwrap()));
        setSelection([]);
        await refetch();
        dispatch(showSnackbar({ message: 'Удалено', severity: 'success' }));
      } catch {
        dispatch(showSnackbar({ message: 'Ошибка удаления', severity: 'error' }));
      }
    });
  };


  if (isLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
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
      <AdminPageHeading
        title="Роли"
        onCreate={() => setOpenAdd(true)}
        createPerm="roles:create"
        createLabel="+ Добавить"
        onBulkDelete={handleBulkDelete}
        bulkDeletePerm="roles:delete"
        bulkDeleteDisabled={selection.length === 0}
        bulkDeleteLabel="Удалить выбранные"
      />
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
