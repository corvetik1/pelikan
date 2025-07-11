"use client";

import { Box, Button, Stack, Typography, Snackbar, Alert } from "@mui/material";
import ConfirmDialog from "@/components/admin/ConfirmDialog";
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
  const [snack, setSnack] = useState<{ open:boolean; message:string; severity:'success'|'error' }>({ open:false, message:'', severity:'success' });
  const handleSnackClose = () => setSnack((s)=>({ ...s, open:false }));
  const [deleteId, setDeleteId] = useState<string | null>(null);

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
        onDelete={(id) => setDeleteId(id)}
        onUpdate={async (id, patch) => {
            try {
              await update({ id, patch }).unwrap();
              setSnack({ open:true, message:'Изменено', severity:'success' });
            } catch {
              setSnack({ open:true, message:'Ошибка изменения', severity:'error' });
            }
          }}
      />

      <NewsDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        initial={editItem}
        onSave={async (payload) => {
          try {
            if (payload.id) {
              await update({ id: payload.id, patch: payload }).unwrap();
              setSnack({ open:true, message:'Изменено', severity:'success' });
            } else {
              await create(payload as Omit<AdminNews,'id'>).unwrap();
              setSnack({ open:true, message:'Создано', severity:'success' });
            }
          } catch {
            setSnack({ open:true, message:'Ошибка сохранения', severity:'error' });
          }
        }}
      />
      <ConfirmDialog
        open={Boolean(deleteId)}
        title="Удалить новость?"
        description="Действие необратимо."
        confirmText="Удалить"
        onConfirm={async () => {
          if (!deleteId) return;
          try {
            await remove(deleteId).unwrap();
            setSnack({ open:true, message:'Удалено', severity:'success' });
          } catch {
            setSnack({ open:true, message:'Ошибка удаления', severity:'error' });
          } finally {
            setDeleteId(null);
          }
        }}
        onClose={() => setDeleteId(null)}
      />
      <Snackbar open={snack.open} autoHideDuration={4000} onClose={handleSnackClose} anchorOrigin={{ vertical:'bottom', horizontal:'right' }}>
        <Alert severity={snack.severity} onClose={handleSnackClose} sx={{ width:'100%' }}>
          {snack.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
