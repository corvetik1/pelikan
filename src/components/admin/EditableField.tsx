"use client";

import { Typography, IconButton, TextField, Stack } from "@mui/material";
import useLocalSnackbar from "@/hooks/useLocalSnackbar";
import EditIcon from "@mui/icons-material/Edit";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import React, { useState } from "react";
import { useIsAdmin } from "@/context/AuthContext";
import type { TypographyProps } from "@mui/material";

interface EditableFieldProps {
  value: string;
  onSave?: (newValue: string) => void;
  typographyProps?: TypographyProps;
}

/**
 * Универсальный inline-редактор текста. Для обычного пользователя отображает
 * read-only `Typography`. Для администратора — возможность редактирования.
 */
export default function EditableField({ value, onSave, typographyProps }: EditableFieldProps) {
  const isAdmin = useIsAdmin();
  const [display, setDisplay] = useState(value);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);
  const { showSuccess, showError, snackbar } = useLocalSnackbar();

  // keep local state in sync with external changes (e.g., refetch)
  React.useEffect(() => {
    setDisplay(value);
  }, [value]);
  

  if (!isAdmin) {
    return (
      <>
        <Typography {...typographyProps}>{display}</Typography>
        {snackbar}
      </>
    );
  }

  if (!editing) {
    return (
      <>
        <Stack direction="row" alignItems="center" gap={1} sx={{ cursor: "pointer" }} onClick={() => setEditing(true)}>
          <Typography {...typographyProps}>{display}</Typography>
          <IconButton size="small" aria-label="Редактировать" sx={{ p: 0.5 }}>
            <EditIcon fontSize="small" />
          </IconButton>
        </Stack>
        {snackbar}
      </>
    );
  }

  return (
    <Stack direction="row" alignItems="center" gap={1}>
      <TextField
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        size="small"
        variant="outlined"
        multiline
        sx={{ flexGrow: 1 }}
      />
      <IconButton
        size="small"
        color="success"
        aria-label="Сохранить"
        onClick={async () => {
          if (draft === display) {
            setEditing(false);
            return;
          }
          const prev = display;
          setDisplay(draft);
          setEditing(false);
          if (onSave) {
            try {
              await onSave(draft);
              showSuccess("Сохранено");
            } catch {
               // дать пользователю увидеть оптимистическое значение перед откатом
               setTimeout(() => setDisplay(prev), 200);
               showError("Ошибка сохранения");
            }
          } else {
            setDisplay(draft);
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
          setDraft(value);
        }}
      >
        <CloseIcon fontSize="small" />
      </IconButton>
    </Stack>
  );
}
