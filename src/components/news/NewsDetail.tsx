'use client';

import { Box } from '@mui/material';
import NewsContent from './NewsContent';
import type { NewsArticle } from '@/data/mock';
import dayjs from 'dayjs';
import 'dayjs/locale/ru';

dayjs.locale('ru');

type Content = string | string[];
interface NewsDetailProps {
  article: Omit<NewsArticle, 'content'> & { content: Content };
}

export default function NewsDetail({ article }: NewsDetailProps) {
  const { title, date, category, content } = article as { title: string; date: string; category?: string; content: Content };
  return (
    <Box sx={{ py: 4 }}>
      <h1>{title}</h1>
      <p style={{ color: '#666', marginTop: 4 }}>{dayjs(date).format('D MMMM YYYY')} {category && `· ${category}`}</p>

      <NewsContent markdown={Array.isArray(content) ? content.join('\n\n') : content} />
    </Box>
  );
}
