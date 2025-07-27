"use client";

import {
  Box,
  Typography,
  Stack,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { useState, useEffect } from "react";
import {
  useGetSettingsQuery,
  useGetAdminThemesQuery,
  useUpdateSettingsMutation,
} from "@/redux/api";
import { useDispatch } from "react-redux";
import { showSnackbar } from "@/redux/snackbarSlice";

export default function AdminSettingsPage() {
  const { data: settings, isLoading: loadingSettings } = useGetSettingsQuery();
  const { data: themes = [], isLoading: loadingThemes } = useGetAdminThemesQuery();
  const [updateSettings, { isLoading: saving }] = useUpdateSettingsMutation();
  const dispatch = useDispatch();

  const [selected, setSelected] = useState<string | "">(settings?.activeThemeSlug ?? "");

  // Синхронизируем локальный state после успешной загрузки настроек
  useEffect(() => {
    if (settings) {
      setSelected(settings.activeThemeSlug ?? "");
    }
  }, [settings]);

  const handleSave = async () => {
    try {
      await updateSettings({ activeThemeSlug: selected }).unwrap();
      dispatch(showSnackbar({ message: "Настройки сохранены", severity: "success" }));
    } catch {
      dispatch(showSnackbar({ message: "Ошибка сохранения", severity: "error" }));
    }
  };



  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Настройки
      </Typography>

      <Stack spacing={2} maxWidth={400}>
        <FormControl fullWidth size="small" disabled={loadingSettings || loadingThemes}>
          <InputLabel id="theme-select-label">Активная тема</InputLabel>
          <Select
            labelId="theme-select-label"
            value={selected}
            label="Активная тема"
            onChange={(e) => setSelected(e.target.value)}
          >
            {themes.map((t) => (
              <MenuItem key={t.slug} value={t.slug}>
                {t.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Button variant="contained" onClick={handleSave} disabled={saving || selected === settings?.activeThemeSlug}>
          Сохранить
        </Button>
      </Stack>
    </Box>
  );
}
