'use client';

import { Card, CardContent, Stack, Typography, Chip, Button, type ChipProps } from '@mui/material';
import dayjs from 'dayjs';
import type { AdminQuote } from '@/types/admin';

interface AdminQuoteCardProps {
  quote: AdminQuote;
  onOpen: () => void;
}

/**
 * Карточка заявки для режима плитки.
 */
export default function AdminQuoteCard({ quote, onOpen }: AdminQuoteCardProps) {
  const { userEmail, status, items, createdAt } = quote;

  const itemsArr = Array.isArray(items) ? (items as unknown[]) : [];

  const statusLabel =
    status === 'pending' ? 'Ожидает' : status === 'priced' ? 'Готово' : 'Отклонено';

  const statusColor: ChipProps['color'] =
    status === 'priced' ? 'success' : status === 'rejected' ? 'error' : 'default';

  return (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Stack spacing={1}>
          <Stack direction="row" spacing={1} alignItems="center">
            <Typography variant="subtitle2" component="span" noWrap>
              {userEmail}
            </Typography>
            <Chip label={statusLabel} color={statusColor} size="small" />
          </Stack>
          <Typography variant="body2">Позиций: {itemsArr.length}</Typography>
          <Typography variant="caption" color="text.secondary">
            {dayjs(createdAt).format('DD.MM.YYYY HH:mm')}
          </Typography>
          <Button variant="outlined" size="small" onClick={onOpen} disabled={status === 'priced'}>
            {status === 'priced' ? 'Просмотр' : 'Утвердить цены'}
          </Button>
        </Stack>
      </CardContent>
    </Card>
  );
}
