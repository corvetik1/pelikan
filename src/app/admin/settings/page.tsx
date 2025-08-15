"use client";

import {
  Box,
  Typography,
  Stack,
  Button,
  FormControl,
  InputLabel,
  Select,
  TextField,
  Paper,
  Divider,
  IconButton,
  MenuItem,
} from "@mui/material";
import React, { useState, useEffect } from "react";
import {
  useGetSettingsQuery,
  useGetAdminThemesQuery,
  useUpdateSettingsMutation,
} from "@/redux/api";
import { useDispatch } from "react-redux";
import { showSnackbar } from "@/redux/snackbarSlice";
import BrandLogo from "@/components/BrandLogo";
import MediaLibraryDialog from "@/components/admin/MediaLibraryDialog";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import type { ContactItem, ContactType, SocialLink } from "@/types/settings";

export default function AdminSettingsPage(): React.JSX.Element {
  const { data: settings, isLoading: loadingSettings } = useGetSettingsQuery();
  const { data: themes = [], isLoading: loadingThemes } = useGetAdminThemesQuery();
  const [updateSettings, { isLoading: saving }] = useUpdateSettingsMutation();
  const dispatch = useDispatch();

  const [selected, setSelected] = useState<string | "">(settings?.activeThemeSlug ?? "");
  const [logoUrl, setLogoUrl] = useState<string | null>(settings?.logoUrl ?? null);
  const [heroSpeedMs, setHeroSpeedMs] = useState<number>(settings?.heroSpeedMs ?? 5000);
  const [socials, setSocials] = useState<SocialLink[]>(settings?.socials ?? []);
  const [contacts, setContacts] = useState<ContactItem[]>(settings?.contacts ?? []);
  const [mediaOpen, setMediaOpen] = useState<boolean>(false);

  // New fields (client-only for now)
  type NewFields = {
    priceListUrl: string;
    ctaTitle: string;
    ctaSubtitle: string;
    homeNewsTitle: string;
    homeRecipesTitle: string;
  };
  type FormErrors = Partial<Record<keyof NewFields, string>>;

  const [newFields, setNewFields] = useState<NewFields>({
    priceListUrl: "",
    ctaTitle: "",
    ctaSubtitle: "",
    homeNewsTitle: "",
    homeRecipesTitle: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});

  // Синхронизируем локальный state после успешной загрузки настроек
  useEffect(() => {
    if (settings) {
      setSelected(settings.activeThemeSlug ?? "");
      setLogoUrl(settings.logoUrl ?? null);
      setHeroSpeedMs(typeof settings.heroSpeedMs === "number" ? settings.heroSpeedMs : 5000);
      setSocials(Array.isArray(settings.socials) ? settings.socials : []);
      setContacts(Array.isArray(settings.contacts) ? settings.contacts : []);
      setNewFields({
        priceListUrl: settings.priceListUrl ?? "",
        ctaTitle: settings.ctaTitle ?? "",
        ctaSubtitle: settings.ctaSubtitle ?? "",
        homeNewsTitle: settings.homeNewsTitle ?? "",
        homeRecipesTitle: settings.homeRecipesTitle ?? "",
      });
    }
  }, [settings]);

  const handleSave = async () => {
    try {
      const normalize = (v: string): string | null => {
        const t = v.trim();
        return t.length === 0 ? null : t;
      };
      await updateSettings({
        activeThemeSlug: selected,
        logoUrl,
        heroSpeedMs,
        socials,
        contacts,
        priceListUrl: normalize(newFields.priceListUrl),
        ctaTitle: normalize(newFields.ctaTitle),
        ctaSubtitle: normalize(newFields.ctaSubtitle),
        homeNewsTitle: normalize(newFields.homeNewsTitle),
        homeRecipesTitle: normalize(newFields.homeRecipesTitle),
      }).unwrap();
      dispatch(showSnackbar({ message: "Настройки сохранены", severity: "success" }));
    } catch {
      dispatch(showSnackbar({ message: "Ошибка сохранения", severity: "error" }));
    }
  };

  const validateNewFields = (nf: NewFields): FormErrors => {
    const e: FormErrors = {};
    const trim = (s: string): string => s.trim();
    const len = (s: string): number => trim(s).length;
    if (len(nf.priceListUrl) > 0) {
      try {
        // Throws on invalid URL
        // eslint-disable-next-line no-new
        new URL(nf.priceListUrl);
      } catch {
        e.priceListUrl = "Некорректный URL";
      }
    }
    if (len(nf.ctaTitle) > 120) e.ctaTitle = "Макс. 120 символов";
    if (len(nf.ctaSubtitle) > 240) e.ctaSubtitle = "Макс. 240 символов";
    if (len(nf.homeNewsTitle) > 120) e.homeNewsTitle = "Макс. 120 символов";
    if (len(nf.homeRecipesTitle) > 120) e.homeRecipesTitle = "Макс. 120 символов";
    return e;
  };



  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Настройки
      </Typography>

      <Stack spacing={3} maxWidth={900}>
        <FormControl fullWidth size="small" disabled={loadingSettings || loadingThemes}>
          <InputLabel id="theme-select-label">Активная тема</InputLabel>
          {/* Используем native Select, чтобы Playwright корректно взаимодействовал через getByLabel / toHaveValue */}
          <Select
            native
            labelId="theme-select-label"
            id="theme-select"
            value={selected}
            label="Активная тема"
            onChange={(e) => setSelected((e.target as HTMLSelectElement).value)}
          >
            {themes.map((t) => (
              <option key={t.slug} value={t.slug}>
                {t.name}
              </option>
            ))}
          </Select>
        </FormControl>

        <Paper variant="outlined" sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom>
            Логотип
          </Typography>
          <Stack direction="row" spacing={2} alignItems="center">
            <BrandLogo size={48} src={logoUrl ?? null} />
            <Button variant="outlined" onClick={() => setMediaOpen(true)}>Выбрать логотип</Button>
            {logoUrl && (
              <Button variant="text" color="secondary" onClick={() => setLogoUrl(null)}>Сбросить</Button>
            )}
          </Stack>
        </Paper>

        <Paper variant="outlined" sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom>
            Hero-слайдер
          </Typography>
          <Stack direction={{ xs: "column", sm: "row" }} spacing={2} alignItems={{ xs: "stretch", sm: "center" }}>
            <TextField
              type="number"
              label="Скорость (мс)"
              size="small"
              value={heroSpeedMs}
              inputProps={{ min: 1000, max: 60000, step: 500 }}
              onChange={(e) => {
                const v = Number(e.target.value);
                setHeroSpeedMs(Number.isFinite(v) ? Math.max(1000, Math.min(60000, v)) : 5000);
              }}
              helperText="Интервал переключения слайдов (1000–60000)"
            />
          </Stack>
        </Paper>

        <Paper variant="outlined" sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom>
            Социальные сети
          </Typography>
          <Stack spacing={1}>
            {socials.map((s, idx) => (
              <Stack key={s.id} direction={{ xs: "column", sm: "row" }} spacing={1} alignItems={{ xs: "stretch", sm: "center" }}>
                <TextField
                  size="small"
                  label="Название"
                  value={s.name}
                  onChange={(e) => {
                    const name = e.target.value;
                    setSocials((prev) => prev.map((it, i) => (i === idx ? { ...it, name } : it)));
                  }}
                />
                <TextField
                  size="small"
                  label="URL"
                  value={s.url}
                  onChange={(e) => {
                    const url = e.target.value;
                    setSocials((prev) => prev.map((it, i) => (i === idx ? { ...it, url } : it)));
                  }}
                />
                <TextField
                  size="small"
                  label="Иконка (опц.)"
                  value={s.icon ?? ""}
                  onChange={(e) => {
                    const icon = e.target.value;
                    setSocials((prev) => prev.map((it, i) => (i === idx ? { ...it, icon: icon || undefined } : it)));
                  }}
                />
                <IconButton aria-label="Удалить" onClick={() => setSocials((prev) => prev.filter((_, i) => i !== idx))}>
                  <DeleteIcon />
                </IconButton>
              </Stack>
            ))}
            <Button
              startIcon={<AddIcon />}
              onClick={() =>
                setSocials((prev) => [
                  ...prev,
                  { id: (globalThis.crypto?.randomUUID ? globalThis.crypto.randomUUID() : `${Date.now()}_${Math.random()}`), name: "", url: "" },
                ])
              }
            >
              Добавить ссылку
            </Button>
          </Stack>
        </Paper>

        <Paper variant="outlined" sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom>
            Контакты
          </Typography>
          <Stack spacing={1}>
            {contacts.map((c, idx) => (
              <Stack key={c.id} direction={{ xs: "column", sm: "row" }} spacing={1} alignItems={{ xs: "stretch", sm: "center" }}>
                <FormControl size="small" sx={{ minWidth: 140 }}>
                  <InputLabel id={`contact-type-${idx}`}>Тип</InputLabel>
                  <Select
                    labelId={`contact-type-${idx}`}
                    id={`contact-type-select-${idx}`}
                    value={c.type}
                    label="Тип"
                    onChange={(e) =>
                      setContacts((prev) => prev.map((it, i) => (i === idx ? { ...it, type: e.target.value as ContactType } : it)))
                    }
                  >
                    <MenuItem value="phone">Телефон</MenuItem>
                    <MenuItem value="email">Email</MenuItem>
                    <MenuItem value="address">Адрес</MenuItem>
                    <MenuItem value="link">Ссылка</MenuItem>
                  </Select>
                </FormControl>
                <TextField
                  size="small"
                  label="Метка (опц.)"
                  value={c.label ?? ""}
                  onChange={(e) => {
                    const label = e.target.value;
                    setContacts((prev) => prev.map((it, i) => (i === idx ? { ...it, label: label || undefined } : it)));
                  }}
                />
                <TextField
                  size="small"
                  label="Значение"
                  value={c.value}
                  onChange={(e) => {
                    const value = e.target.value;
                    setContacts((prev) => prev.map((it, i) => (i === idx ? { ...it, value } : it)));
                  }}
                />
                <IconButton aria-label="Удалить" onClick={() => setContacts((prev) => prev.filter((_, i) => i !== idx))}>
                  <DeleteIcon />
                </IconButton>
              </Stack>
            ))}
            <Button
              startIcon={<AddIcon />}
              onClick={() =>
                setContacts((prev) => [
                  ...prev,
                  { id: (globalThis.crypto?.randomUUID ? globalThis.crypto.randomUUID() : `${Date.now()}_${Math.random()}`), type: "phone", value: "" },
                ])
              }
            >
              Добавить контакт
            </Button>
          </Stack>
        </Paper>

        <Paper variant="outlined" sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom>
            Домашняя страница и CTA
          </Typography>
          <Stack spacing={2}>
            <TextField
              size="small"
              label="URL прайс-листа"
              value={newFields.priceListUrl}
              error={Boolean(errors.priceListUrl)}
              helperText={errors.priceListUrl || "Этот URL будет применён после обновления сервера"}
              onChange={(e) => {
                const nf = { ...newFields, priceListUrl: e.target.value };
                setNewFields(nf);
                setErrors(validateNewFields(nf));
              }}
            />
            <TextField
              size="small"
              label="CTA заголовок"
              value={newFields.ctaTitle}
              error={Boolean(errors.ctaTitle)}
              helperText={errors.ctaTitle || "До 120 символов"}
              onChange={(e) => {
                const nf = { ...newFields, ctaTitle: e.target.value };
                setNewFields(nf);
                setErrors(validateNewFields(nf));
              }}
            />
            <TextField
              size="small"
              label="CTA подзаголовок"
              value={newFields.ctaSubtitle}
              error={Boolean(errors.ctaSubtitle)}
              helperText={errors.ctaSubtitle || "До 240 символов"}
              multiline
              minRows={2}
              onChange={(e) => {
                const nf = { ...newFields, ctaSubtitle: e.target.value };
                setNewFields(nf);
                setErrors(validateNewFields(nf));
              }}
            />
            <TextField
              size="small"
              label="Заголовок новостей на главной"
              value={newFields.homeNewsTitle}
              error={Boolean(errors.homeNewsTitle)}
              helperText={errors.homeNewsTitle || "До 120 символов"}
              onChange={(e) => {
                const nf = { ...newFields, homeNewsTitle: e.target.value };
                setNewFields(nf);
                setErrors(validateNewFields(nf));
              }}
            />
            <TextField
              size="small"
              label="Заголовок рецептов на главной"
              value={newFields.homeRecipesTitle}
              error={Boolean(errors.homeRecipesTitle)}
              helperText={errors.homeRecipesTitle || "До 120 символов"}
              onChange={(e) => {
                const nf = { ...newFields, homeRecipesTitle: e.target.value };
                setNewFields(nf);
                setErrors(validateNewFields(nf));
              }}
            />
            <Typography variant="caption" color="text.secondary">
              Примечание: эти поля станут редактируемыми на сервере после обновления API и БД.
            </Typography>
          </Stack>
        </Paper>

        <Divider />

        <Button
          variant="contained"
          onClick={handleSave}
          disabled={
            saving ||
            (selected === settings?.activeThemeSlug &&
              logoUrl === (settings?.logoUrl ?? null) &&
              heroSpeedMs === (settings?.heroSpeedMs ?? 5000) &&
              JSON.stringify(socials) === JSON.stringify(settings?.socials ?? []) &&
              JSON.stringify(contacts) === JSON.stringify(settings?.contacts ?? []) &&
              // Compare new fields against server values (empty string considered equal to null)
              ((newFields.priceListUrl.trim() === '' ? null : newFields.priceListUrl.trim()) === (settings?.priceListUrl ?? null)) &&
              ((newFields.ctaTitle.trim() === '' ? null : newFields.ctaTitle.trim()) === (settings?.ctaTitle ?? null)) &&
              ((newFields.ctaSubtitle.trim() === '' ? null : newFields.ctaSubtitle.trim()) === (settings?.ctaSubtitle ?? null)) &&
              ((newFields.homeNewsTitle.trim() === '' ? null : newFields.homeNewsTitle.trim()) === (settings?.homeNewsTitle ?? null)) &&
              ((newFields.homeRecipesTitle.trim() === '' ? null : newFields.homeRecipesTitle.trim()) === (settings?.homeRecipesTitle ?? null)))
          }
        >
          Сохранить
        </Button>
      </Stack>

      <MediaLibraryDialog
        open={mediaOpen}
        onClose={() => setMediaOpen(false)}
        onSelect={(m) => {
          setLogoUrl(m.url);
          setMediaOpen(false);
        }}
      />
    </Box>
  );
}
