"use client";

import React, { useState } from "react";
import {
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  ImageList,
  ImageListItem,
  ImageListItemBar,
  IconButton,
  Pagination,
  Stack,
  Tab,
  Tabs,
  Typography,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { useListMediaQuery, useDeleteMediaMutation } from "@/redux/mediaApi";
import FileUploader from "./FileUploader";
import type { AdminMedia } from "@/types/admin";

interface MediaLibraryDialogProps {
  open: boolean;
  onClose: () => void;
  onSelect: (media: AdminMedia) => void;
}

/**
 * Диалоговая библиотека медиа: просмотр, загрузка, удаление, выбор файла.
 */
export default function MediaLibraryDialog({ open, onClose, onSelect }: MediaLibraryDialogProps) {
  const [page, setPage] = useState(1);
  const { data: media = [], refetch, isFetching } = useListMediaQuery(page);
  const [deleteMedia] = useDeleteMediaMutation();
  const [tab, setTab] = useState<'library' | 'upload'>("library");

  const totalPages = Math.max(1, Math.ceil(media.length / 20));

  const handleDelete = async (id: string) => {
    await deleteMedia(id);
    void refetch();
  };

  const handleUploaded = () => {
    setTab("library");
    void refetch();
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>Медиа-библиотека</DialogTitle>
      <Tabs value={tab} onChange={(_, val) => setTab(val)}>
        <Tab label="Библиотека" value="library" />
        <Tab label="Загрузка" value="upload" />
      </Tabs>
      <DialogContent dividers sx={{ minHeight: 400 }}>
        {tab === "upload" && <FileUploader onUploaded={handleUploaded} multiple />}
        {tab === "library" && (
          <Stack spacing={2}>
            <ImageList cols={4} gap={16}>
              {media.map((item) => (
                <ImageListItem key={item.id} sx={{ cursor: "pointer" }} onClick={() => onSelect(item)}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={item.url} alt={item.filename} loading="lazy" style={{ width: "100%", height: "auto" }} />
                  <ImageListItemBar
                    title={item.filename}
                    actionIcon={
                      <IconButton sx={{ color: "rgba(255, 255, 255, 0.8)" }} onClick={(e) => { e.stopPropagation(); void handleDelete(item.id); }}>
                        <DeleteIcon />
                      </IconButton>
                    }
                  />
                </ImageListItem>
              ))}
            </ImageList>
            {totalPages > 1 && (
              <Box sx={{ display: "flex", justifyContent: "center" }}>
                <Pagination count={totalPages} page={page} onChange={(_, p) => setPage(p)} />
              </Box>
            )}
            {media.length === 0 && !isFetching && (
              <Typography variant="body2" color="text.secondary" align="center">
                Файлы не найдены
              </Typography>
            )}
          </Stack>
        )}
      </DialogContent>
    </Dialog>
  );
}
