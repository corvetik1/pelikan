'use client';

import { Box, Chip, Stack } from '@mui/material';
import EditableField from '@/components/admin/EditableField';
import EditableParagraph from '@/components/admin/EditableParagraph';
import EditableImage from '@/components/admin/EditableImage';
import { useUpdateNewsFieldMutation } from '@/redux/adminApi';
import type { NewsArticle } from '@/data/mock';
import dayjs from 'dayjs';
import 'dayjs/locale/ru';

dayjs.locale('ru');

interface NewsDetailProps {
  article: NewsArticle;
}

export default function NewsDetail({ article }: NewsDetailProps) {
  const { title, img, date, category, content, id } = article;
  const [updateNewsField] = useUpdateNewsFieldMutation();
  return (
    <Box sx={{ py: 4 }}>
      <Stack spacing={2}>
        <Stack direction="row" gap={1} flexWrap="wrap" alignItems="center">
          <EditableField
            value={title}
            onSave={(newTitle) => {
              updateNewsField({ id, patch: { title: newTitle } });
            }}
            typographyProps={{ component: 'h1', variant: 'h4', sx: { flexGrow: 1 } }}
          />
          <Chip label={dayjs(date).format('D MMMM YYYY')} size="small" />
          {category && <Chip label={category} size="small" />}
        </Stack>

        <EditableImage
          src={img}
          alt={title}
          width={800}
          height={450}
          style={{ width: '100%', height: 'auto', borderRadius: 8 }}
          onSave={(newSrc) => updateNewsField({ id, patch: { img: newSrc } })}
        />

        {content.map((p, idx) => (
           <EditableParagraph
             key={idx}
             value={p}
             onSave={(newP) => {
               const updated = [...content];
               updated[idx] = newP;
               updateNewsField({ id, patch: { content: updated } });
             }}
             typographyProps={{ variant: 'body1', paragraph: true }}
           />
         ))}
      </Stack>
    </Box>
  );
}
