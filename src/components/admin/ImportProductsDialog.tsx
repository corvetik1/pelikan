"use client";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  List,
  ListItem,
  ListItemText,
  LinearProgress,
  Alert,
} from "@mui/material";
import React, { useState } from "react";
import { useDispatch } from 'react-redux';
import { showSnackbar } from '@/redux/snackbarSlice';
import FileUploader from "@/components/admin/FileUploader";
import type { AdminMedia } from "@/types/admin";
import { useImportProductsMutation } from "@/redux/adminApi";

interface ImportProductsDialogProps {
  open: boolean;
  onClose: () => void;
}

export default function ImportProductsDialog({ open, onClose }: ImportProductsDialogProps) {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string[]>([]);
  const [errors, setErrors] = useState<string[]>([]);
  const dispatch = useDispatch();
  const [importProducts, { isLoading }] = useImportProductsMutation();

  const handleUploaded = (files: FileList | File[] | AdminMedia[]) => {
    const first = Array.isArray(files) ? files[0] : files[0];
    if (!(first instanceof File)) return; // ignore non-File uploads
    setFile(first);
    setPreview([first.name]);
  };

  const handleImport = async () => {
    if (!file) return;
    const formData = new FormData();
    formData.append("file", file);
    try {
      const res = await importProducts(formData).unwrap();
      if (res.errors && res.errors.length) {
        setErrors(res.errors as string[]);
            const { imported } = res as { imported: number };
        dispatch(showSnackbar({ message: `Импортировано: ${imported}`, severity: 'success' }));
        onClose();
      }
    } catch (e) {
      setErrors([(e as Error).message]);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Импорт товаров из Excel</DialogTitle>
      <DialogContent dividers>
        {file ? (
          <>
            <List dense>
              {preview.map((p) => (
                <ListItem key={p}>
                  <ListItemText primary={p} />
                </ListItem>
              ))}
            </List>
            {errors.length > 0 && (
              <Alert severity="error" sx={{ mt: 2 }}>
                {errors.join(", ")}
              </Alert>
            )}
            {isLoading && <LinearProgress sx={{ mt: 2 }} />}
          </>
        ) : (
          <FileUploader multiple={false} accept=".xlsx" onUploaded={handleUploaded} />
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Отмена</Button>
        <Button disabled={!file} variant="contained" onClick={handleImport}>
          Импортировать
        </Button>
      </DialogActions>
    </Dialog>
  );
}
