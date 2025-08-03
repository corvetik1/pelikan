"use client";

import { Box } from "@mui/material";
import AdminPageHeading from "@/components/admin/AdminPageHeading";
import { useDispatch } from 'react-redux';
import { showSnackbar } from '@/redux/snackbarSlice';
import ConfirmDialog from "@/components/admin/ConfirmDialog";


import { useState } from "react";
import AdminDataGrid from "@/components/admin/AdminDataGrid";
import StoreDialog from "@/components/admin/StoreDialog";
import {
  useGetAdminStoresQuery,
  useCreateStoreMutation,
  useUpdateStoreMutation,
  useDeleteStoreMutation,
} from "@/redux/api";
import type { GridColDef } from "@mui/x-data-grid";
import { AdminStore } from "@/types/admin";

export default function AdminStoresPage() {
  const { data = [], isLoading } = useGetAdminStoresQuery();
  const dispatch = useDispatch();
  const [create] = useCreateStoreMutation();
  const [update] = useUpdateStoreMutation();
  const [remove] = useDeleteStoreMutation();

  const [dialogOpen, setDialogOpen] = useState(false);
  
  
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const columns: GridColDef[] = [
    { field: "name", headerName: "Название", flex: 1, editable: true },
    { field: "region", headerName: "Регион", width: 150, editable: true },
    { field: "address", headerName: "Адрес", flex: 2, editable: true },
    { field: "isActive", headerName: "Активен", type: "boolean", width: 110, editable: true },
  ];

  const handleDelete = (id: string) => {
    setDeleteId(id);
  };

  const confirmDelete = async () => {
    if (!deleteId) return;
    try {
      await remove(deleteId).unwrap();
      dispatch(showSnackbar({ message: 'Удалено', severity: 'success' }));
    } catch {
      dispatch(showSnackbar({ message: 'Ошибка удаления', severity: 'error' }));
    } finally {
      setDeleteId(null);
    }
  };

  return (
    <Box>
      <AdminPageHeading
        title="Магазины"
        onCreate={() => setDialogOpen(true)}
        createPerm="stores:create"
      />

      <AdminDataGrid<AdminStore>
        rows={data}
        columns={columns}
        loading={isLoading}
        onDelete={handleDelete}
        onUpdate={(id, patch) => update({ id, patch })}
      />

      <StoreDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onSave={async (payload) => {
          try {
            if (payload.id) {
              await update({ id: payload.id, patch: payload }).unwrap();
              dispatch(showSnackbar({ message: 'Изменено', severity: 'success' }));
            } else {
              await create(payload as Omit<AdminStore, 'id'>).unwrap();
              dispatch(showSnackbar({ message: 'Создано', severity: 'success' }));
            }
          } catch {
            dispatch(showSnackbar({ message: 'Ошибка сохранения', severity: 'error' }));
          }
        }}
      />
      <ConfirmDialog
        open={Boolean(deleteId)}
        title="Удалить магазин?"
        description="Действие необратимо."
        confirmText="Удалить"
        onConfirm={confirmDelete}
        onClose={() => setDeleteId(null)}
      />
      
        
          
        
      
    </Box>
  );
}
