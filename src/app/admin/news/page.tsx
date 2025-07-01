"use client";

import { Box, Button, Stack, Typography } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { useState } from "react";
import AdminDataGrid from "@/components/admin/AdminDataGrid";
import NewsDialog from "@/components/admin/NewsDialog";
import {
  useGetAdminNewsQuery,
  useCreateNewsMutation,
  useUpdateNewsMutation,
  useDeleteNewsMutation,
} from "@/redux/api";
import type { GridColDef } from "@mui/x-data-grid";
import { AdminNews } from "@/types/admin";

export default function AdminNewsPage() {
  const { data = [], isLoading } = useGetAdminNewsQuery();
  const [create] = useCreateNewsMutation();
  const [update] = useUpdateNewsMutation();
  const [remove] = useDeleteNewsMutation();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editItem, setEditItem] = useState<AdminNews | null>(null);

  const columns: GridColDef[] = [
    { field: "title", headerName: "Заголовок", flex: 1, editable: true },
    { field: "excerpt", headerName: "Анонс", flex: 2, editable: true },
    { field: "date", headerName: "Дата", width: 150, editable: true },
    { field: "category", headerName: "Категория", width: 150, editable: true },
  ];

  const handleAdd = () => {
    setEditItem(null);
    setDialogOpen(true);
  };

  return (
    <Box>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
        <Typography variant="h5">Новости</Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={handleAdd} data-testid="add-news-btn">
          Добавить
        </Button>
      </Stack>

      <AdminDataGrid<AdminNews>
        rows={data}
        columns={columns}
        loading={isLoading}
        onDelete={(id) => remove(id)}
        onUpdate={(id, patch) => update({ id, patch })}
      />

      <NewsDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        initial={editItem}
        onSave={(payload) => {
          if (payload.id) {
            update({ id: payload.id, patch: payload });
          } else {
            create(payload as Omit<AdminNews, "id">);
          }
        }}
      />
    </Box>
  );
}
