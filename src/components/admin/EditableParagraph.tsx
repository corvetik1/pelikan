"use client";

import React, { useState } from "react";
import { Typography, TextField, IconButton, Stack, TypographyProps, TextFieldProps } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import { useIsAdmin } from "@/context/AuthContext";

interface EditableParagraphProps {
  value: string;
  onSave?: (newValue: string) => void;
  typographyProps?: Omit<TypographyProps<"p">, "children">;
  textFieldProps?: Omit<TextFieldProps, "value" | "onChange"> & { multilineRows?: number };
}

/**
 * Параграф с inline-редактированием для администратора. Для остальных пользователей отображается как обычный текст.
 */
export default function EditableParagraph({
  value,
  onSave,
  typographyProps,
  textFieldProps,
}: EditableParagraphProps) {
  const isAdmin = useIsAdmin();
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);

  // Если не админ и не редактируем — просто текст
  if (!isAdmin || !editing) {
    return isAdmin ? (
      <Stack direction="row" alignItems="flex-start" gap={1} sx={{ width: "100%" }}>
        <Typography {...typographyProps}>{value}</Typography>
        {isAdmin && (
          <IconButton
            size="small"
            aria-label="Редактировать параграф"
            onClick={() => {
              setDraft(value);
              setEditing(true);
            }}
          >
            <EditIcon fontSize="small" />
          </IconButton>
        )}
      </Stack>
    ) : (
      <Typography {...typographyProps}>{value}</Typography>
    );
  }

  // Режим редактирования
  return (
    <Stack direction="row" alignItems="flex-start" gap={1} sx={{ width: "100%" }}>
      <TextField
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        multiline
        minRows={textFieldProps?.multilineRows ?? 3}
        fullWidth
        size="small"
        {...textFieldProps}
      />
      <IconButton
        size="small"
        color="success"
        aria-label="Сохранить параграф"
        onClick={() => {
          setEditing(false);
          if (draft !== value && onSave) onSave(draft);
        }}
      >
        <CheckIcon fontSize="small" />
      </IconButton>
      <IconButton
        size="small"
        color="error"
        aria-label="Отменить редактирование"
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
