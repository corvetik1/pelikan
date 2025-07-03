"use client";

import React, { useState } from "react";
import useLocalSnackbar from "@/hooks/useLocalSnackbar";
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
  const [display, setDisplay] = useState(value);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);
  const { showSuccess, showError, snackbar } = useLocalSnackbar();

  // Sync external changes
  React.useEffect(() => {
    setDisplay(value);
  }, [value]);
  

  // Если не админ и не редактируем — просто текст
  if (!isAdmin || !editing) {
    return isAdmin ? (
      <>
        <Stack direction="row" alignItems="flex-start" gap={1} sx={{ width: "100%" }}>
          <Typography {...typographyProps}>{display}</Typography>
          <IconButton
            size="small"
            aria-label="Редактировать параграф"
            onClick={() => {
              setDraft(display);
              setEditing(true);
            }}
          >
            <EditIcon fontSize="small" />
          </IconButton>
        </Stack>
        {snackbar}
      </>
    ) : (
      <Typography {...typographyProps}>{value}</Typography>
    );
  }

  // Режим редактирования
  return (
    <>
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
                setTimeout(() => setDisplay(prev), 50);
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
          aria-label="Отменить редактирование"
          onClick={() => {
            setEditing(false);
            setDraft(display);
          }}
        >
          <CloseIcon fontSize="small" />
        </IconButton>
      </Stack>
      {snackbar}
    </>
  );
}
