'use client';

import {
  Card,
  CardActionArea,
  CardContent,
  Typography,
  Chip,
  Box,
} from '@mui/material';
import Image from 'next/image';
import Link from 'next/link';
import type { NewsArticle } from '@/data/mock';
import dayjs from 'dayjs';
import 'dayjs/locale/ru';

dayjs.locale('ru');

interface NewsCardProps {
  article: NewsArticle;
}

/**
 * Карточка новости для ленты.
 */
export default function NewsCard({ article }: NewsCardProps) {
  const { slug, title, img, excerpt, date, category } = article;
  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardActionArea component={Link} href={`/news/${slug}`} sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        <Box sx={{ position: 'relative', width: '100%', height: 180 }}>
            <Image src={img} alt={title} fill sizes="(max-width:600px) 100vw, 320px" style={{ objectFit: 'cover' }} />
          </Box>
        <CardContent sx={{ flexGrow: 1 }}>
          <Box sx={{ display: 'flex', gap: 1, mb: 1, flexWrap: 'wrap' }}>
            <Chip label={dayjs(date).format('D MMMM YYYY')} size="small" />
            {category && <Chip label={category} size="small" />}
          </Box>
          <Typography component="h3" variant="subtitle1" gutterBottom>
            {title}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {excerpt}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}
