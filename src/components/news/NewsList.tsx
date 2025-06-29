'use client';

import { Box } from '@mui/material';
import NewsCard from './NewsCard';
import type { NewsArticle } from '@/data/mock';

interface NewsListProps {
  articles: NewsArticle[];
}

export default function NewsList({ articles }: NewsListProps) {
  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: {
          xs: 'repeat(1, 1fr)',
          sm: 'repeat(2, 1fr)',
          md: 'repeat(3, 1fr)',
        },
        gap: 2,
      }}
    >
      {articles.map((a) => (
        <NewsCard key={a.id} article={a} />
      ))}
    </Box>
  );
}
