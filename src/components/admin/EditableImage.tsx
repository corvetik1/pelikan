"use client";

import React, { useState } from "react";
import MediaLibraryDialog from "./MediaLibraryDialog";
import useLocalSnackbar from "@/hooks/useLocalSnackbar";
import { Box, IconButton, Stack, Dialog, DialogTitle, DialogContent, TextField } from "@mui/material";
import Image from "next/image";
import EditIcon from "@mui/icons-material/Edit";

import UploadIcon from "@mui/icons-material/CloudUpload";
import DeleteIcon from "@mui/icons-material/Delete";
import { useIsAdmin } from "@/context/AuthContext";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import FileUploader from "./FileUploader";

interface EditableImageProps {
  src: string;
  alt: string;
  width: number;
  height: number;
  onSave?: (newSrc: string) => void;
  style?: React.CSSProperties;
}

/**
 * Изображение с inline-редактированием URL. В перспективе можно расширить до загрузки файла.
 */
export default function EditableImage({ src, alt, width, height, onSave, style }: EditableImageProps) {
  const isAdmin = useIsAdmin();
  const [displaySrc, setDisplaySrc] = useState(src);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(src);
    const [libraryOpen, setLibraryOpen] = useState(false);
  const [uploadOpen, setUploadOpen] = useState(false);
  const { showSuccess, showError, snackbar } = useLocalSnackbar();

  React.useEffect(() => {
    setDisplaySrc(src);
  }, [src]);
  

  if (!isAdmin) {
    return (
    <>
      <Image src={displaySrc} alt={alt} width={width} height={height} style={style} />
      {snackbar}
    </>
  );
  }

  if (!editing) {
    return (
      <>
        <Box sx={{ position: "relative", width: "100%", maxWidth: width }}>
        <Image src={displaySrc} alt={alt} width={width} height={height} style={style} />
        <IconButton
          size="small"
          sx={{ position: "absolute", top: 8, right: 8, bgcolor: "background.paper", "&:hover": { bgcolor: "background.paper" } }}
          aria-label="Редактировать изображение"
          onClick={() => {
            setDraft(displaySrc);
            setEditing(true);
          }}
        >
          <EditIcon fontSize="small" />
        </IconButton>
      </Box>
        {snackbar}
      </>
    );
  }

  if (editing) {
    return (
      <Stack direction="row" alignItems="center" gap={1} sx={{ width: "100%" }}>
        <TextField
          label="URL изображения"
          size="small"
          fullWidth
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
        />
        <IconButton
          aria-label="Сохранить изображение"
          color="success"
          size="small"
          onClick={() => {
            const prev = displaySrc;
            setDisplaySrc(draft);
            setEditing(false);
            Promise.resolve(onSave?.(draft))
              .then(() => {
                showSuccess("Сохранено");
              })
              .catch(() => {
                // небольшая задержка, чтобы оптимистическое значение успело отрисоваться
                setTimeout(() => setDisplaySrc(prev), 100);
                showError("Ошибка сохранения");
              });
          }}
        >
          <CheckIcon fontSize="small" />
        </IconButton>
        <IconButton
          aria-label="Отменить"
          color="error"
          size="small"
          onClick={() => {
            setEditing(false);
            setDraft(displaySrc);
          }}
        >
          <CloseIcon fontSize="small" />
        </IconButton>
      </Stack>
    );
  }

  return (
    <Stack direction="row" alignItems="center" gap={1} sx={{ width: "100%" }}>
      <IconButton
        size="small"
        color="primary"
        aria-label="Загрузить файл"
        onClick={() => setUploadOpen(true)}
      >
        <UploadIcon />
      </IconButton>
      <IconButton
        size="small"
        color="info"
        aria-label="Выбрать из библиотеки"
        onClick={() => setLibraryOpen(true)}
      >
        <EditIcon />
      </IconButton>
      <IconButton
        size="small"
        color="error"
        aria-label="Удалить изображение"
        onClick={async () => {
          const prev = displaySrc;
          setDisplaySrc("https://via.placeholder.com/200x120?text=Image");
          setEditing(false);
          if (onSave) {
            try {
              await onSave("");
              showSuccess("Удалено");
            } catch {
              setDisplaySrc(prev);
              showError("Ошибка удаления");
            }
          }
        }}
      >
        <DeleteIcon />
      </IconButton>

      {/* File upload dialog */}
      {uploadOpen && (
        <Dialog open={uploadOpen} onClose={() => setUploadOpen(false)} fullWidth maxWidth="sm">
          <DialogTitle>Загрузка файла</DialogTitle>
          <DialogContent>
            <FileUploader
              multiple={false}
              onUploaded={(files) => {
                if (files.length > 0) {
                  const url = files[0].url;
                  setDisplaySrc(url);
                  setUploadOpen(false);
                  setEditing(false);
                  onSave?.(url);
                  showSuccess("Загружено");
                }
              }}
            />
          </DialogContent>
        </Dialog>
      )}

      {/* Media library dialog */}
      {libraryOpen && (
        <MediaLibraryDialog
          open={libraryOpen}
          onClose={() => setLibraryOpen(false)}
          onSelect={(media) => {
            setDisplaySrc(media.url);
            setLibraryOpen(false);
            setEditing(false);
            onSave?.(media.url);
            showSuccess("Выбрано");
          }}
        />
      )}
    </Stack>
  );
}
