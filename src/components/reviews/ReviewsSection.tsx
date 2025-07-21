"use client";

import { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  TextField,
  Stack,
  Rating,
  CircularProgress,
  Pagination,
  Alert,
  Select,
  MenuItem,
  FormControl,
} from '@mui/material';
import { useGetProductReviewsQuery, useCreateReviewMutation } from '@/redux/api';
import type { Review } from '@/types/review';

interface ReviewsSectionProps {
  productId: string;
}

export default function ReviewsSection({ productId }: ReviewsSectionProps) {
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState<'new' | 'old' | 'rating'>('new');
  const { data, isLoading, isError } = useGetProductReviewsQuery({ productId, page, sort });
  const reviews = data?.items ?? [];
  const total = data?.total ?? 0;
  const [createReview, { isLoading: isSubmitting }] = useCreateReviewMutation();

  const [rating, setRating] = useState<number | null>(5);
  const [body, setBody] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async () => {
    if (!rating || body.trim().length < 3) return;
    await createReview({ productId, rating: rating as 1 | 2 | 3 | 4 | 5, body }).unwrap();
    setBody('');
    setRating(5);
    setSubmitted(true);
  };

  return (
    <Box sx={{ mt: 4 }}>
      <Typography component="h2" variant="h6" gutterBottom>
        Отзывы
      </Typography>

      {/* Filters */}
        <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
          <FormControl size="small">
            <Select
              value={sort}
              onChange={(e) => {
                setSort(e.target.value as typeof sort);
                setPage(1);
              }}
            >
              <MenuItem value="new">Новые</MenuItem>
              <MenuItem value="old">Старые</MenuItem>
              <MenuItem value="rating">По рейтингу</MenuItem>
            </Select>
          </FormControl>
        </Stack>

        {/* Reviews list */}
      {isLoading ? (
        <CircularProgress />
      ) : isError ? (
        <Alert severity="error">Не удалось загрузить отзывы</Alert>
      ) : reviews && reviews.length > 0 ? (
        <Stack spacing={2}>
          {reviews.map((r: Review) => (
            <Box key={r.id} sx={{ border: 1, borderColor: 'divider', p: 2, borderRadius: 2 }}>
              <Stack direction="row" alignItems="center" spacing={1}>
                <Rating value={r.rating} readOnly size="small" />
                <Typography variant="caption" color="text.secondary">
                  {new Date(r.createdAt).toLocaleDateString('ru-RU')}
                </Typography>
              </Stack>
              <Typography variant="body2" sx={{ mt: 0.5 }}>
                {r.body}
              </Typography>
            </Box>
          ))}
          {total > 10 && (
            <Pagination
              count={Math.ceil(total / 10)}
              page={page}
              onChange={(_, p) => setPage(p)}
              sx={{ alignSelf: 'center' }}
            />
          )}
        </Stack>
      ) : (
        <Typography variant="body2" color="text.secondary">
          Отзывов пока нет
        </Typography>
      )}

      {/* Add review form */}
      <Box sx={{ mt: 3 }}>
        {submitted && (
          <Alert severity="success" sx={{ mb: 2 }}>
            Спасибо! Отзыв появится после проверки модератором.
          </Alert>
        )}
        <Typography variant="subtitle1" gutterBottom>
          Оставить отзыв
        </Typography>
        <Stack spacing={2} maxWidth={400}>
          <Rating
            value={rating}
            onChange={(_, v) => setRating(v)}
            size="large"
            aria-label="Рейтинг"
          />
          <TextField
            multiline
            minRows={3}
            label="Ваш отзыв"
            value={body}
            onChange={(e) => setBody(e.target.value)}
            required
          />
          <Button
            variant="contained"
            disabled={isSubmitting || !rating || body.trim().length < 3}
            onClick={handleSubmit}
          >
            Отправить
          </Button>
        </Stack>
      </Box>
    </Box>
  );
}
