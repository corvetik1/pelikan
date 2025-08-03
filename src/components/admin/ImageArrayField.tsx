"use client";

import React from "react";
import { Stack, IconButton, Box } from "@mui/material";
import AddPhotoIcon from "@mui/icons-material/AddPhotoAlternate";
import PhotoLibraryIcon from "@mui/icons-material/PhotoLibrary";
import DeleteIcon from "@mui/icons-material/Delete";
import MediaLibraryDialog from "./MediaLibraryDialog";
import FileUploader from "./FileUploader";
import type { AdminMedia } from "@/types/admin";

interface ImageArrayFieldProps {
  value: string[];
  onChange: (urls: string[]) => void;
  max?: number;
}

/**
 * Поле для управления массивом URL-изображений с поддержкой загрузки и выбора из библиотеки.
 */
export default function ImageArrayField({ value, onChange, max = 10 }: ImageArrayFieldProps) {
  const [libraryOpen, setLibraryOpen] = React.useState(false);
  const [uploadOpen, setUploadOpen] = React.useState(false);

  const addUrl = (url: string) => {
    if (value.length >= max) return;
    onChange([...value, url]);
  };

  const removeIdx = (idx: number) => () => {
    const copy = [...value];
    copy.splice(idx, 1);
    onChange(copy);
  };

  return (
    <Stack spacing={1}>
      <Stack direction="row" spacing={1} flexWrap="wrap">
        {value.map((url, idx) => (
          <Box key={`${url}-${idx}`} sx={{ position: "relative" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={url} alt="img" width={80} height={80} style={{ objectFit: "cover", borderRadius: 4 }} />
            <IconButton size="small" sx={{ position: "absolute", top: 0, right: 0 }} onClick={removeIdx(idx)}>
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Box>
        ))}
        {value.length < max && (
          <>
            <IconButton color="primary" onClick={() => setUploadOpen(true)} aria-label="Загрузить изображение">
              <AddPhotoIcon />
            </IconButton>
            <IconButton color="info" onClick={() => setLibraryOpen(true)} aria-label="Выбрать из библиотеки">
              <PhotoLibraryIcon />
            </IconButton>
          </>
        )}
      </Stack>

      {/* Upload dialog */}
      {uploadOpen && (
        <FileUploader
          multiple={false}
          onUploaded={(files) => {
            if (!files.length) return;
            const item = files[0] as File | AdminMedia;
            const url = (item as AdminMedia).url ?? (item as File).name;
            addUrl(url);
            setUploadOpen(false);
          }}
        />
      )}

      {/* Library dialog */}
      {libraryOpen && (
        <MediaLibraryDialog
          open={libraryOpen}
          onClose={() => setLibraryOpen(false)}
          onSelect={(media) => {
            addUrl(media.url);
            setLibraryOpen(false);
          }}
        />
      )}
    </Stack>
  );
}
