"use client";

import React from "react";
import { Box, Button, Container, Paper, Stack, Typography } from "@mui/material";
import Grid from "@mui/material/Grid";
import EditableField from "@/components/admin/EditableField";
import EditableParagraph from "@/components/admin/EditableParagraph";
import MediaLibraryDialog from "@/components/admin/MediaLibraryDialog";
import { useDispatch } from "react-redux";
import { showSnackbar } from "@/redux/snackbarSlice";
import { useGetHeroSlidesQuery } from "@/redux/api";
import { useCreateHeroSlideMutation, useDeleteHeroSlideMutation, useUpdateHeroFieldMutation } from "@/redux/adminApi";
import type { HeroSlide } from "@/types/hero";

export default function AdminHeroPage(): React.JSX.Element {
  const dispatch = useDispatch();
  const { data: slidesData, isLoading, refetch } = useGetHeroSlidesQuery();
  const [updateHeroField, { isLoading: saving }] = useUpdateHeroFieldMutation();
  const [createHeroSlide, { isLoading: creating }] = useCreateHeroSlideMutation();
  const [deleteHeroSlide, { isLoading: deleting }] = useDeleteHeroSlideMutation();

  const [slides, setSlides] = React.useState<HeroSlide[]>([]);
  const seededRef = React.useRef<boolean>(false);
  type MediaCtx = { mode: "edit"; id: string } | { mode: "create" } | null;
  const [mediaCtx, setMediaCtx] = React.useState<MediaCtx>(null);

  React.useEffect(() => {
    if (seededRef.current) return;
    if (Array.isArray(slidesData)) {
      setSlides(slidesData);
      seededRef.current = true;
    }
  }, [slidesData]);

  const handleUpdate = async (id: string, patch: Partial<Pick<HeroSlide, "title" | "subtitle" | "img">>): Promise<void> => {
    try {
      setSlides((prev) => prev.map((s) => (s.id === id ? { ...s, ...patch } : s)));
      await updateHeroField({ id, patch }).unwrap();
      dispatch(showSnackbar({ message: "Слайд обновлён", severity: "success" }));
    } catch {
      dispatch(showSnackbar({ message: "Ошибка обновления слайда", severity: "error" }));
    }
  };

  const handleCreate = async (imgUrl: string): Promise<void> => {
    try {
      // Создаём слайд с дефолтными заголовками — их можно отредактировать ниже
      const created = await createHeroSlide({ title: "Новый слайд", subtitle: "", img: imgUrl }).unwrap();
      setSlides((prev) => (prev.length < 3 ? [...prev, created] : prev));
      dispatch(showSnackbar({ message: "Слайд создан", severity: "success" }));
    } catch {
      dispatch(showSnackbar({ message: "Не удалось создать слайд", severity: "error" }));
    } finally {
      void refetch();
    }
  };

  const handleDelete = async (id: string): Promise<void> => {
    const ok = typeof window !== "undefined" ? window.confirm("Удалить слайд?") : true;
    if (!ok) return;
    try {
      setSlides((prev) => prev.filter((s) => s.id !== id));
      await deleteHeroSlide(id).unwrap();
      dispatch(showSnackbar({ message: "Слайд удалён", severity: "success" }));
    } catch {
      dispatch(showSnackbar({ message: "Не удалось удалить слайд", severity: "error" }));
      void refetch();
    }
  };

  const maxSlides: number = 3;
  const canAdd: boolean = slides.length < maxSlides;

  return (
    <Container sx={{ py: 3 }} maxWidth="lg">
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
        <Typography variant="h5">Hero-слайды</Typography>
        <Button
          variant="contained"
          disabled={!canAdd || creating}
          title={!canAdd ? "Достигнут лимит 3 слайда" : undefined}
          onClick={() => setMediaCtx({ mode: "create" })}
        >
          Добавить слайд
        </Button>
      </Stack>

      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Максимум {maxSlides} слайда. Сейчас: {slides.length}.
      </Typography>

      {isLoading ? (
        <Typography>Загрузка…</Typography>
      ) : slides.length === 0 ? (
        <Typography>Слайды не найдены.</Typography>
      ) : (
        <Grid container spacing={2}>
          {slides.map((slide) => (
            <Grid key={slide.id} size={{ xs: 12, md: 6 }}>
              <Paper variant="outlined" sx={{ p: 2 }}>
                <Box
                  sx={{
                    height: 220,
                    borderRadius: 1,
                    backgroundImage: `url(${slide.img})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    position: "relative",
                    mb: 2,
                  }}
                />

                <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
                  <Button
                    variant="outlined"
                    onClick={() => setMediaCtx({ mode: "edit", id: slide.id })}
                    disabled={saving}
                  >
                    Изменить изображение
                  </Button>
                  <Button
                    color="error"
                    variant="outlined"
                    onClick={() => void handleDelete(slide.id)}
                    disabled={deleting}
                  >
                    Удалить
                  </Button>
                </Stack>

                <EditableField
                  value={slide.title}
                  typographyProps={{ variant: "h6", sx: { mb: 1 } }}
                  onSave={async (v: string) => handleUpdate(slide.id, { title: v })}
                />

                <EditableParagraph
                  value={slide.subtitle}
                  typographyProps={{ variant: "body1", sx: { mb: 1 } }}
                  onSave={async (v: string) => handleUpdate(slide.id, { subtitle: v })}
                />
              </Paper>
            </Grid>
          ))}
        </Grid>
      )}

      <MediaLibraryDialog
        open={mediaCtx !== null}
        onClose={() => setMediaCtx(null)}
        onSelect={(m) => {
          const ctx = mediaCtx;
          setMediaCtx(null);
          if (!ctx) return;
          if (ctx.mode === "edit") {
            void handleUpdate(ctx.id, { img: m.url });
          } else if (ctx.mode === "create") {
            void handleCreate(m.url);
          }
        }}
      />
    </Container>
  );
}
