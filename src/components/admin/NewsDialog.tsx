"use client";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Stack,
  IconButton,
  Tooltip,
  Box,
} from "@mui/material";
import ImageIcon from "@mui/icons-material/Image";
import { useEffect, useState, Suspense } from "react";
import { Tabs, Tab } from "@mui/material";
import ReactMarkdown from 'react-markdown';
import Image from 'next/image';
import remarkGfm from "remark-gfm";
import rehypeSanitize from "rehype-sanitize";
import dynamic from "next/dynamic";
import { AdminNews, NewsCategory } from "@/types/admin";
import { Autocomplete } from "@mui/material";
import { useGetAdminNewsCategoriesQuery } from "@/redux/api";
import MediaLibraryDialog from "@/components/admin/MediaLibraryDialog";

export interface NewsDialogProps {
  open: boolean;
  onClose: () => void;
  /** if provided – edit mode */
  initial?: AdminNews | null;
  /** when user confirms, returns data (without id for create) */
  onSave: (data: Omit<AdminNews, "id"> & { id?: string }) => void;
}

export default function NewsDialog({ open, onClose, initial, onSave }: NewsDialogProps) {
  const [title, setTitle] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("# Заголовок\n\nОписание...");
  const [mediaOpen, setMediaOpen] = useState(false);

  // Lazy load MD editor (SSR-off)
  const MDEditor = dynamic(() => import("@uiw/react-md-editor"), { ssr: false });
  const [date, setDate] = useState("");
  const { data: categories = [] } = useGetAdminNewsCategoriesQuery();
  const [tab, setTab] = useState<0 | 1>(0); // 0 = editor, 1 = preview
  const [categoryId, setCategoryId] = useState<string | null>(null);

  useEffect(() => {
    if (initial) {
      setTitle(initial.title);
      setExcerpt(initial.excerpt);
      setDate(initial.date.slice(0, 10));
      setContent(initial.content ?? "");
      setCategoryId(initial.categoryId ?? null);
    } else {
      setTitle("");
      setExcerpt("");
      setDate(new Date().toISOString().slice(0, 10));
      setCategoryId(null);
      setContent("# Заголовок\n\nОписание...");
    }
  }, [initial]);

  const handleSave = () => {
    if (!title.trim()) return; // basic validation
    onSave({ title, excerpt, content, date, categoryId: categoryId ?? undefined, id: initial?.id });
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{initial ? "Редактировать новость" : "Добавить новость"}</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ mt: 1 }}>
          <TextField
            label="Заголовок"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            fullWidth
          />
          <TextField
            label="Анонс"
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
            fullWidth
            multiline
            rows={3}
          />
          <TextField
            label="Дата"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            InputLabelProps={{ shrink: true }}
            required
          />
          <Autocomplete
            options={categories}
            getOptionLabel={(o: NewsCategory) => o.title}
            value={categories.find((c) => c.id === categoryId) ?? null}
            onChange={(_e, val) => setCategoryId(val ? val.id : null)}
            renderInput={(params) => <TextField {...params} label="Категория" fullWidth />}
          />
                  {/* Markdown editor */}
          <Stack direction="row" alignItems="center" justifyContent="space-between">
            <span>Контент</span>
            <Tooltip title="Вставить изображение">
              <IconButton size="small" onClick={() => setMediaOpen(true)}>
                <ImageIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Stack>
          {/* Tabs for editor / preview */}
          <Tabs value={tab} onChange={(_, v) => setTab(v as 0 | 1)} sx={{ mb: 1 }}>
            <Tab label="Редактор" />
            <Tab label="Превью" />
          </Tabs>
          {tab === 0 ? (
            <Suspense fallback={<div>Loading editor...</div>}>
              <MDEditor value={content} onChange={(val?: string) => setContent(val ?? "")} height={300} />
            </Suspense>
          ) : (
            <Box sx={{ height: 300, overflow: 'auto', p: 1, border: '1px solid #e0e0e0', borderRadius: 1 }}>
              <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeSanitize]} components={{
                img: (props: React.ImgHTMLAttributes<HTMLImageElement>) => (
                  <Image
                    src={typeof props.src === 'string' ? props.src : ''}
                    alt={props.alt ?? ''}
                    width={800}
                    height={600}
                    style={{ maxWidth: '100%', height: 'auto' }}
                    loading="lazy"
                  />
                ),
              }}>
                {content}
              </ReactMarkdown>
            </Box>
          )}
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Отмена</Button>
        <Button variant="contained" onClick={handleSave} disabled={!title.trim()}>
          Сохранить
        </Button>
      </DialogActions>
          <MediaLibraryDialog
        open={mediaOpen}
        onClose={() => setMediaOpen(false)}
        onSelect={(media) => {
          // insert markdown image
          setContent((prev) => `${prev}\n\n![${media.filename}](${media.url})`);
          setMediaOpen(false);
        }}
      />
    </Dialog>
  );
}
