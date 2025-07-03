"use client";

import React, { useState } from "react";
import useLocalSnackbar from "@/hooks/useLocalSnackbar";
import { Box, IconButton, Stack, TextField } from "@mui/material";
import Image from "next/image";
import EditIcon from "@mui/icons-material/Edit";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import { useIsAdmin } from "@/context/AuthContext";

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

  return (
    <Stack direction="row" alignItems="center" gap={1} sx={{ width: "100%" }}>
      <TextField
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        size="small"
        variant="outlined"
        fullWidth
        label="URL изображения"
      />
      <IconButton
        size="small"
        color="success"
        aria-label="Сохранить изображение"
        onClick={async () => {
            if (draft === displaySrc) {
              setEditing(false);
              return;
            }
            const prev = displaySrc;
            // optimistic
            setDisplaySrc(draft);
            setEditing(false);
            if (onSave) {
              try {
                await onSave(draft);
                showSuccess("Сохранено");
              } catch {
                // rollback after short delay so optimistic value виден
                setTimeout(() => setDisplaySrc(prev), 50);
                showError("Ошибка сохранения");
              }
            }
          }}
      >
        <CheckIcon fontSize="small" />
      </IconButton>
      <IconButton
        size="small"
        color="error"
        aria-label="Отменить"
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
