'use client';

import { Box } from '@mui/material';
import NewsContent from './NewsContent';
import type { AdminNews } from '@/types/admin';
import dayjs from 'dayjs';
import 'dayjs/locale/ru';

dayjs.locale('ru');

interface NewsDetailProps {
  article: AdminNews;
}

export default function NewsDetail({ article }: NewsDetailProps): React.JSX.Element {
  const { title, date, category, content } = article;
  return (
    <Box sx={{ py: 4 }}>
      <h1>{title}</h1>
      <p style={{ color: '#666', marginTop: 4 }}>
        {dayjs(date).format('D MMMM YYYY')} {category?.title ? `· ${category.title}` : ''}
      </p>

      <NewsContent markdown={content} />
    </Box>
  );
}
