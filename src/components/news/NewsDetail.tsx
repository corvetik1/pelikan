'use client';

import { Box, Typography, Chip, Stack } from '@mui/material';
import Image from 'next/image';
import type { NewsArticle } from '@/data/mock';
import dayjs from 'dayjs';
import 'dayjs/locale/ru';

dayjs.locale('ru');

interface NewsDetailProps {
  article: NewsArticle;
}

export default function NewsDetail({ article }: NewsDetailProps) {
  const { title, img, date, category, content } = article;
  return (
    <Box sx={{ py: 4 }}>
      <Stack spacing={2}>
        <Stack direction="row" gap={1} flexWrap="wrap" alignItems="center">
          <Typography component="h1" variant="h4" sx={{ flexGrow: 1 }}>
            {title}
          </Typography>
          <Chip label={dayjs(date).format('D MMMM YYYY')} size="small" />
          {category && <Chip label={category} size="small" />}
        </Stack>

        <Image
          src={img}
          alt={title}
          width={800}
          height={450}
          style={{ width: '100%', height: 'auto', borderRadius: 8 }}
        />

        {content.map((p) => (
          <Typography key={p.slice(0, 20)} variant="body1" paragraph>
            {p}
          </Typography>
        ))}
      </Stack>
    </Box>
  );
}
