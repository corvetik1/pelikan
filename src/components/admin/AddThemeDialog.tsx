"use client";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Stack,
  Alert,
} from "@mui/material";
import { useState } from "react";
import { Box, Typography } from "@mui/material";
import { themeCreateSchema, type ThemeCreateInput } from "@/lib/validation/themeSchema";
import { z } from "zod";
import { useDropzone } from "react-dropzone";
import JSZip from "jszip";

interface AddThemeDialogProps {
  open: boolean;
  onClose: () => void;
  /** Called when user submits and data is valid */
  onCreate: (data: ThemeCreateInput) => void;
}

export default function AddThemeDialog({ open, onClose, onCreate }: AddThemeDialogProps) {
  const [name, setName] = useState("");
  const [tokensText, setTokensText] = useState("{\n  \"palette\": { \"mode\": \"light\" }\n}");
  const [preview, setPreview] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);

  // Drag-and-drop загрузка файлов .json или .zip
  const handleDrop = async (acceptedFiles: File[]) => {
    if (!acceptedFiles.length) return;
    const file = acceptedFiles[0];
    try {
      if (file.type === "application/zip" || file.name.endsWith(".zip")) {
        const zip = await JSZip.loadAsync(file);
        const jsonEntry = Object.values(zip.files).find((f) => f.name.endsWith(".json") && !f.dir);
        if (!jsonEntry) throw new Error("В .zip не найден JSON файл");
        const jsonText = await jsonEntry.async("string");
        setTokensText(jsonText);
        setFileName(file.name);
      } else {
        const text = await file.text();
        setTokensText(text);
        setFileName(file.name);
      }
    } catch (e) {
      setError((e as Error).message);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      "application/json": [".json"],
      "application/zip": [".zip"],
    },
    multiple: false,
    maxFiles: 1,
    onDrop: handleDrop,
  });

  const submit = () => {
    setError(null);
    try {
      const tokens = JSON.parse(tokensText) as Record<string, unknown>;
      const parsed = themeCreateSchema.parse({ name, tokens, preview: preview || undefined });
      onCreate(parsed);
      // reset state
      setName("");
      setTokensText("{\n  \"palette\": { \"mode\": \"light\" }\n}");
      setPreview("");
    } catch (e) {
      if (e instanceof SyntaxError) {
        setError("Неверный JSON в поле tokens");
      } else if (e instanceof z.ZodError) {
        setError(e.issues[0]?.message ?? "Ошибка данных");
      } else {
        setError("Неизвестная ошибка");
      }
      return;
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>Добавить тему</DialogTitle>
      <DialogContent>
        <Stack spacing={2} mt={1}>
          {error && <Alert severity="error">{error}</Alert>}

            {/* Dropzone */}
            <Box
              {...getRootProps()}
              sx={{
                p: 3,
                border: '2px dashed',
                borderColor: isDragActive ? 'primary.main' : 'divider',
                borderRadius: 1,
                textAlign: 'center',
                bgcolor: isDragActive ? 'action.hover' : 'background.paper',
                cursor: 'pointer',
              }}
            >
              <input {...getInputProps()} />
              <Typography variant="body2" color="text.secondary">
                {isDragActive ? 'Отпустите файл для загрузки' : 'Перетащите .json или .zip файл сюда, или нажмите для выбора'}
              </Typography>
            {fileName && (
                <Typography variant="caption" sx={{ mt: 1 }}>
                  Выбран файл: {fileName}
                </Typography>
              )}
            </Box>
          <TextField label="Название" value={name} onChange={(e) => setName(e.target.value)} fullWidth required />
          <TextField
            label="URL превью (опционально)"
            value={preview}
            onChange={(e) => setPreview(e.target.value)}
            fullWidth
          />
          {preview && (
            <Box sx={{ width: 120, height: 80, borderRadius: 1, overflow: 'hidden' }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={preview} alt="preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </Box>
          )}
          <TextField
            label="JSON tokens"
            value={tokensText}
            onChange={(e) => setTokensText(e.target.value)}
            fullWidth
            multiline
            minRows={6}
            helperText="MUI theme tokens в формате JSON"
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Отмена</Button>
        <Button variant="contained" onClick={submit} disabled={!name.trim() || !tokensText.trim()}>
          Создать
        </Button>
      </DialogActions>
    </Dialog>
  );
}
