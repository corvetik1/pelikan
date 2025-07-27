"use client";

import { Card, CardContent, Typography, Chip, Stack, IconButton } from "@mui/material";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import type { AdminReview } from "@/types/admin";

interface AdminReviewCardProps {
  review: AdminReview;
  onApprove?: () => void;
  onReject?: () => void;
}

/**
 * Карточка отзыва для режима плитки.
 */
export default function AdminReviewCard({ review, onApprove, onReject }: AdminReviewCardProps) {
  const { productName, rating, author, body, status, createdAt } = review;

  const statusChip = (
    <Chip
      label={status === 'approved' ? 'Одобрен' : status === 'rejected' ? 'Отклонён' : 'Ожидает'}
      color={status === 'approved' ? 'success' : status === 'rejected' ? 'error' : 'default'}
      size="small"
    />
  );

  return (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Stack direction="row" spacing={1} alignItems="center" mb={1}>
          <Typography variant="subtitle2" component="span">
            {productName}
          </Typography>
          <Chip label={`${rating} / 5`} size="small" />
          {statusChip}
        </Stack>
        <Typography variant="body2" gutterBottom noWrap>
          {body}
        </Typography>
        <Typography variant="caption" color="text.secondary" display="block" gutterBottom>
          {author} • {new Date(createdAt).toLocaleDateString('ru-RU')}
        </Typography>
        {status === 'pending' && (
          <Stack direction="row" spacing={1} mt={1}>
            <IconButton color="success" size="small" onClick={onApprove} aria-label="approve-review">
              <CheckCircleIcon fontSize="small" />
            </IconButton>
            <IconButton color="error" size="small" onClick={onReject} aria-label="reject-review">
              <CancelIcon fontSize="small" />
            </IconButton>
          </Stack>
        )}
      </CardContent>
    </Card>
  );
}
