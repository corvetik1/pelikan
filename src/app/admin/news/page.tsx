"use client";

import { Box, Snackbar, Alert } from "@mui/material";
import AdminPageHeading from "@/components/admin/AdminPageHeading";
import ViewToggle from '@/components/admin/ViewToggle';
import ConfirmDialog from "@/components/admin/ConfirmDialog";

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
import type { NewsCreateInput, NewsUpdateInput } from "@/lib/validation/newsSchema";

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
        actions={<ViewToggle section="news" />}
        onCreate={handleAdd}
        createPerm="news:create"
      />

      {viewMode === 'list' ? (
        <NewsTable
          rows={data}
          loading={isLoading}
          onDelete={(id) => setDeleteId(id)}
          onUpdate={async (id, patch) => {
            try {
              const input: NewsUpdateInput = {};
              if (typeof patch.title === 'string') input.title = patch.title;
              if (typeof patch.excerpt === 'string') input.excerpt = patch.excerpt;
              if (typeof patch.content === 'string') input.content = patch.content;
              if (typeof patch.img === 'string') input.img = patch.img;
              if (typeof (patch as { categoryId?: unknown }).categoryId === 'string') input.categoryId = (patch as { categoryId?: string }).categoryId;
              if (typeof patch.date === 'string') {
                const m = patch.date.match(/^(\d{2})\.(\d{2})\.(\d{4})$/);
                input.date = m ? `${m[3]}-${m[2]}-${m[1]}` : patch.date;
              }
              await update({ id, patch: input }).unwrap();
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
            if ('id' in payload && payload.id) {
              const { id, ...rest } = payload as { id: string } & NewsUpdateInput;
              await update({ id, patch: rest }).unwrap();
              setSnack({ open:true, message:'Изменено', severity:'success' });
            } else {
              await create(payload as NewsCreateInput).unwrap();
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
