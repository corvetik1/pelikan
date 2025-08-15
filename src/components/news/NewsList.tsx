'use client';

import { Box } from '@mui/material';
import NewsCard from './NewsCard';
import type { AdminNews } from '@/types/admin';

interface NewsListProps {
  articles: AdminNews[];
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
      {articles.map((a: AdminNews, idx: number) => (
        <NewsCard key={a.id} article={a} priority={idx === 0} />
      ))}
    </Box>
  );
}
