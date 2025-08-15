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
import type { AdminNews } from '@/types/admin';
import dayjs from 'dayjs';
import 'dayjs/locale/ru';

dayjs.locale('ru');

interface NewsCardProps {
  article: AdminNews;
  priority?: boolean;
}

/**
 * Карточка новости для ленты.
 */
export default function NewsCard({ article, priority = false }: NewsCardProps): React.JSX.Element {
  const { slug, title, excerpt, date, category, img } = article;
  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardActionArea
        component={Link}
        href={`/news/${slug}`}
        aria-label={`Открыть новость: ${title}`}
        sx={{ display: 'flex', flexDirection: 'column', height: '100%', outline: 'none', '&:focus-visible': { boxShadow: (t) => `0 0 0 3px ${t.palette.primary.main}` } }}
      >
        {img && (
          <Box sx={{ position: 'relative', width: '100%', height: 180 }}>
            <Image
              src={img}
              alt={title}
              fill
              sizes="(max-width:600px) 100vw, (max-width:900px) 50vw, 33vw"
              priority={priority}
              loading={priority ? undefined : 'lazy'}
              style={{ objectFit: 'cover' }}
            />
          </Box>
        )}
        <CardContent sx={{ flexGrow: 1 }}>
          <Box sx={{ display: 'flex', gap: 1, mb: 1, flexWrap: 'wrap' }}>
            <Chip label={dayjs(date).format('D MMMM YYYY')} size="small" />
            {category?.title && <Chip label={category.title} size="small" />}
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
