"use client";

import { Box, Typography, Stack, Button, Snackbar, Alert, Chip } from "@mui/material";
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

export default function AdminRolesPage() {
  const { data = [], isLoading, isError, refetch } = useGetAdminRolesQuery();
  const [createRole] = useCreateRoleMutation();
  const [updateRole] = useUpdateRoleMutation();
  const [deleteRole] = useDeleteRoleMutation();

  const [openAdd, setOpenAdd] = useState(false);
  const [selection, setSelection] = useState<GridRowSelectionModel>([]);
  const [snack, setSnack] = useState<{ open:boolean; message:string; severity:'success'|'error' }>({ open:false, message:'', severity:'success' });
  const handleSnackClose = () => setSnack((s)=>({ ...s, open:false }));
  const [confirmAction, setConfirmAction] = useState<null | (() => Promise<void>)>(null);


  const handleAdd = async (payload: Partial<AdminRole>) => {
    try {
      await createRole(payload).unwrap();
      setOpenAdd(false);
      refetch();
      setSnack({ open:true, message:'Роль создана', severity:'success' });
    } catch {
      setSnack({ open:true, message:'Ошибка создания', severity:'error' });
    }
  };

  const handleUpdate = async (id: string, patch: Partial<AdminRole>) => {
    try {
      await updateRole({ id, patch }).unwrap();
      refetch();
      setSnack({ open:true, message:'Изменено', severity:'success' });
    } catch {
      setSnack({ open:true, message:'Ошибка изменения', severity:'error' });
    }
  };

  const handleDelete = (id: string) => {
    setConfirmAction(() => async () => {
      try {
        await deleteRole(id).unwrap();
        await refetch();
        setSnack({ open:true, message:'Удалено', severity:'success' });
      } catch {
        setSnack({ open:true, message:'Ошибка удаления', severity:'error' });
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
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h5">Роли</Typography>
        <Stack direction="row" spacing={1}>
          <Button
            variant="outlined"
            size="small"
            disabled={selection.length === 0}
            onClick={async () => {
              setConfirmAction(() => async () => {
                 try {
                   await Promise.all(selection.map((id) => deleteRole(String(id)).unwrap()));
                   setSelection([]);
                   await refetch();
                   setSnack({ open:true, message:'Удалено', severity:'success' });
                 } catch {
                   setSnack({ open:true, message:'Ошибка удаления', severity:'error' });
                 }
               });
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
       <Snackbar open={snack.open} autoHideDuration={4000} onClose={handleSnackClose} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
         <Alert severity={snack.severity} onClose={handleSnackClose} sx={{ width: '100%' }}>
           {snack.message}
         </Alert>
       </Snackbar>
    </Box>
  );
}
