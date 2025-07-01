"use client";

import React, { useState } from "react";
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
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(src);

  if (!isAdmin) {
    return <Image src={src} alt={alt} width={width} height={height} style={style} />;
  }

  if (!editing) {
    return (
      <Box sx={{ position: "relative", width: "100%", maxWidth: width }}>
        <Image src={src} alt={alt} width={width} height={height} style={style} />
        <IconButton
          size="small"
          sx={{ position: "absolute", top: 8, right: 8, bgcolor: "background.paper", "&:hover": { bgcolor: "background.paper" } }}
          aria-label="Редактировать изображение"
          onClick={() => setEditing(true)}
        >
          <EditIcon fontSize="small" />
        </IconButton>
      </Box>
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
        onClick={() => {
          setEditing(false);
          if (onSave) onSave(draft);
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
          setDraft(src);
        }}
      >
        <CloseIcon fontSize="small" />
      </IconButton>
    </Stack>
  );
}
