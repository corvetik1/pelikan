"use client";

import { Box, Button, Stack, Snackbar, Alert } from "@mui/material";
import AdminPageHeading from "@/components/admin/AdminPageHeading";
import ViewToggle from '@/components/admin/ViewToggle';
import ConfirmDialog from "@/components/admin/ConfirmDialog";
import AddIcon from "@mui/icons-material/Add";
import { useState } from "react";
import NewsTable from "@/components/admin/NewsTable";
import AdminNewsCard from '@/components/admin/AdminNewsCard';
import { useViewMode } from '@/hooks/useViewMode';
import NewsDialog from "@/components/admin/NewsDialog";
import {
  useGetAdminNewsQuery,
  useCreateNewsMutation,
  useUpdateNewsMutation,
  useDeleteNewsMutation,
} from "@/redux/api";
import { AdminNews } from "@/types/admin";

export default function AdminNewsPage() {
  const [viewMode] = useViewMode('news');
  const { data = [], isLoading } = useGetAdminNewsQuery(undefined, { skip: typeof window === 'undefined' });
  const [create] = useCreateNewsMutation();
  const [update] = useUpdateNewsMutation();
  const [remove] = useDeleteNewsMutation();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editItem, setEditItem] = useState<AdminNews | null>(null);
  const [snack, setSnack] = useState<{ open:boolean; message:string; severity:'success'|'error' }>({ open:false, message:'', severity:'success' });
  const handleSnackClose = () => setSnack((s)=>({ ...s, open:false }));
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const handleAdd = () => {
    setEditItem(null);
    setDialogOpen(true);
  };

  return (
    <Box>
      <AdminPageHeading
        title="Новости"
        actions={
          <Stack direction="row" spacing={1} alignItems="center">
            <ViewToggle section="news" />
            <Button variant="contained" startIcon={<AddIcon />} onClick={handleAdd} data-testid="add-news-btn">
              Добавить
            </Button>
          </Stack>
        }
      />

      {viewMode === 'list' ? (
        <NewsTable
          rows={data}
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
      ) : (
        <Box display="flex" flexWrap="wrap" gap={2}>
          {data.map((item: AdminNews) => (
            <Box
              key={item.id}
              sx={{ width: { xs: '100%', sm: 'calc(50% - 16px)', md: 'calc(33.333% - 16px)' } }}
            >
              <AdminNewsCard item={item} onClick={() => { setEditItem(item); setDialogOpen(true); }} />
            </Box>
          ))}
        </Box>
      )}

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
