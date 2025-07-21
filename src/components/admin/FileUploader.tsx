"use client";

import { Box, CircularProgress, Typography } from "@mui/material";
import UploadIcon from "@mui/icons-material/CloudUpload";
import React, { useRef, useState } from "react";
import { useUploadMediaMutation } from "@/redux/mediaApi";
import type { AdminMedia } from "@/types/admin";

interface FileUploaderProps {
  /** Callback после успешной загрузки файла(ов) */
  onUploaded?: (files: AdminMedia[]) => void;
  /** Разрешить множественную загрузку */
  multiple?: boolean;
  /** Ограничение типов. По умолчанию images */
  accept?: string;
}

/**
 * Универсальный компонент drag-and-drop / file-picker для загрузки медиа файлов.
 * Использует API `/api/admin/upload` (RTK Query `uploadMedia`).
 */
export default function FileUploader({ onUploaded, multiple = false, accept = "image/*" }: FileUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploadMedia, { isLoading }] = useUploadMediaMutation();
  const [error, setError] = useState<string | null>(null);

  const handleFiles = async (fileList: FileList | null) => {
    if (!fileList || fileList.length === 0) return;
    setError(null);
    try {
      const formData = new FormData();
      Array.from(fileList).forEach((file) => formData.append("file", file));
      const uploaded = await uploadMedia(formData).unwrap();
      onUploaded?.(uploaded);
    } catch (e) {
      setError((e as Error).message ?? "Upload error");
    }
  };

  const onDrop = (evt: React.DragEvent<HTMLDivElement>) => {
    evt.preventDefault();
    void handleFiles(evt.dataTransfer.files);
  };

  return (
    <Box
      sx={{
        p: 2,
        border: "2px dashed",
        borderColor: "divider",
        borderRadius: 1,
        textAlign: "center",
        bgcolor: "background.paper",
        cursor: "pointer",
        position: "relative",
      }}
      onClick={() => inputRef.current?.click()}
      onDragOver={(e) => {
        e.preventDefault();
      }}
      onDrop={onDrop}
    >
      {isLoading && (
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            backdropFilter: "blur(2px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <CircularProgress size={48} />
        </Box>
      )}
      <UploadIcon fontSize="large" color="action" />
      <Typography variant="body2" sx={{ mt: 1 }}>
        Перетащите файл сюда или нажмите, чтобы выбрать
      </Typography>
      {error && (
        <Typography color="error" variant="caption" sx={{ mt: 1, display: "block" }}>
          {error}
        </Typography>
      )}
      <input
        ref={inputRef}
        type="file"
        hidden
        multiple={multiple}
        accept={accept}
        onChange={(e) => {
          const files = e.target.files;
          void handleFiles(files);
          // reset value to allow uploading same file twice
          if (inputRef.current) inputRef.current.value = "";
        }}
      />
    </Box>
  );
}
