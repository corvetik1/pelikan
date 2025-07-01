"use client";

import { Box, Button, Stack, Typography } from "@mui/material";

import AddIcon from "@mui/icons-material/Add";
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
  const [create] = useCreateStoreMutation();
  const [update] = useUpdateStoreMutation();
  const [remove] = useDeleteStoreMutation();

  const [dialogOpen, setDialogOpen] = useState(false);

  const columns: GridColDef[] = [
    { field: "name", headerName: "Название", flex: 1, editable: true },
    { field: "region", headerName: "Регион", width: 150, editable: true },
    { field: "address", headerName: "Адрес", flex: 2, editable: true },
    { field: "isActive", headerName: "Активен", type: "boolean", width: 110, editable: true },
  ];

  const handleDelete = (id: string) => {
    if (confirm("Удалить магазин?")) remove(id);
  };

  return (
    <Box>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
        <Typography variant="h5">Магазины</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setDialogOpen(true)}
          data-testid="add-store-btn"
        >
          Добавить
        </Button>
      </Stack>

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
        onSave={(payload) => {
          if (payload.id) {
            update({ id: payload.id, patch: payload });
          } else {
            create(payload as Omit<AdminStore, "id">);
          }
        }}
      />
    </Box>
  );
}
