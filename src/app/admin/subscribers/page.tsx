'use client';

import React, { useCallback, useMemo, useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Chip,
  Divider,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Snackbar,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
} from '@mui/material';
import { useGetAdminSubscribersQuery, useDeleteSubscriberMutation, useUpdateSubscriberMutation } from '@/redux/api';
import type { Subscriber, SubscriptionStatus } from '@/types/subscriber';
import RequirePermission from '@/components/RBAC/RequirePermission';
import { formatDate, statusChipColor } from './utils';
import { useSocket } from '@/hooks/useSocket';

 

export default function SubscribersPage(): React.JSX.Element {
  // Initialize Socket.IO client; it wires RTK Query invalidation + global snackbar on 'invalidate'
  // Hook is no-op on server and connects on client mount
  useSocket();
  const [page, setPage] = useState<number>(0); // 0-based for UI, API expects 1-based
  const [pageSize, setPageSize] = useState<number>(20);
  const [status, setStatus] = useState<SubscriptionStatus | undefined>(undefined);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [snack, setSnack] = useState<string | null>(null);

  const sort = undefined; // placeholder for future sort: "field,order"

  const { data, isFetching, refetch } = useGetAdminSubscribersQuery({
    page: page + 1,
    pageSize,
    sort: sort ?? undefined,
    status,
  });

  const [updateSubscriber, { isLoading: isUpdating }] = useUpdateSubscriberMutation();
  const [deleteSubscriber, { isLoading: isDeleting }] = useDeleteSubscriberMutation();

  const items = useMemo<Subscriber[]>(() => data?.items ?? [], [data?.items]);
  const total = data?.total ?? 0;

  const allSelectedOnPage = useMemo(() => items.length > 0 && items.every((i) => selected.has(i.id)), [items, selected]);

  const toggleAllOnPage = useCallback(() => {
    const next = new Set(selected);
    if (allSelectedOnPage) {
      items.forEach((i) => next.delete(i.id));
    } else {
      items.forEach((i) => next.add(i.id));
    }
    setSelected(next);
  }, [allSelectedOnPage, items, selected]);

  const toggleOne = useCallback((id: string) => {
    const next = new Set(selected);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelected(next);
  }, [selected]);

  const onChangePage = useCallback((
    _e: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number,
  ) => {
    setPage(newPage);
  }, []);

  const onChangeRowsPerPage = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setPageSize(parseInt(e.target.value, 10));
    setPage(0);
  }, []);

  const onStatusChange = useCallback((e: SelectChangeEvent) => {
    const val = e.target.value as SubscriptionStatus | '';
    setStatus(val === '' ? undefined : val);
    setPage(0);
  }, []);

  const unsubscribeSelected = useCallback(async () => {
    const ids = Array.from(selected);
    if (ids.length === 0) return;
    await Promise.all(
      ids.map(async (id) => {
        const curr: Subscriber | undefined = items.find((i) => i.id === id);
        if (curr && curr.status === 'subscribed') {
          await updateSubscriber({ id, status: 'unsubscribed' }).unwrap();
        }
      })
    );
    setSnack('Выбранные подписчики отписаны');
    setSelected(new Set());
    await refetch();
  }, [items, refetch, selected, updateSubscriber]);

  const deleteSelected = useCallback(async () => {
    const ids = Array.from(selected);
    if (ids.length === 0) return;
    const confirmed = window.confirm('Удалить выбранных подписчиков?');
    if (!confirmed) return;
    await Promise.all(ids.map(async (id) => deleteSubscriber(id).unwrap()));
    setSnack('Выбранные подписчики удалены');
    setSelected(new Set());
    await refetch();
  }, [deleteSubscriber, refetch, selected]);

  const exportCsv = useCallback(() => {
    const headers = ['email', 'status', 'createdAt'];
    const rows = items.map((i) => [i.email, i.status, i.createdAt]);
    const csv = [headers.join(','), ...rows.map((r) => r.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'subscribers.csv';
    a.click();
    URL.revokeObjectURL(url);
  }, [items]);

  const busy = isFetching || isUpdating || isDeleting;

  return (
    <RequirePermission permission="subscribers:read">
    <Card>
      <CardHeader title="Подписчики" subheader="Управление подпиской на новости" />
      <Divider />
      <CardContent>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="center" justifyContent="space-between" mb={2}>
          <Stack direction="row" spacing={2} alignItems="center">
            <FormControl size="small" sx={{ minWidth: 200 }} data-testid="filter-status-ctrl">
              <InputLabel id="status-label">Статус</InputLabel>
              <Select
                labelId="status-label"
                label="Статус"
                value={status ?? ''}
                onChange={onStatusChange}
                inputProps={{ 'data-testid': 'filter-status' }}
              >
                <MenuItem value="">
                  <em>Любой</em>
                </MenuItem>
                <MenuItem value="subscribed">Подписан</MenuItem>
                <MenuItem value="unsubscribed">Отписан</MenuItem>
                <MenuItem value="bounced">Недоставлено</MenuItem>
              </Select>
            </FormControl>
            <Button data-testid="refresh" variant="outlined" onClick={() => refetch()} disabled={busy}>Обновить</Button>
          </Stack>
          <Stack direction="row" spacing={1}>
            <RequirePermission permission="subscribers:update">
              <Button data-testid="bulk-unsubscribe" variant="contained" color="warning" onClick={unsubscribeSelected} disabled={busy || selected.size === 0}>
                Unsubscribe selected
              </Button>
            </RequirePermission>
            <RequirePermission permission="subscribers:delete">
              <Button data-testid="bulk-delete" variant="outlined" color="error" onClick={deleteSelected} disabled={busy || selected.size === 0}>
                Delete selected
              </Button>
            </RequirePermission>
            <RequirePermission permission="subscribers:export">
              <Button data-testid="export-csv" variant="text" onClick={exportCsv} disabled={items.length === 0}>Экспорт CSV</Button>
            </RequirePermission>
          </Stack>
        </Stack>

        <TableContainer>
          <Table size="small" aria-busy={busy} data-testid="subscribers-table">
            <TableHead>
              <TableRow>
                <TableCell padding="checkbox">
                  <input type="checkbox" aria-label="select-all" data-testid="select-all" checked={allSelectedOnPage} onChange={toggleAllOnPage} disabled={busy} />
                </TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Статус</TableCell>
                <TableCell>Дата создания</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {items.map((row) => {
                const checked = selected.has(row.id);
                return (
                  <TableRow key={row.id} hover selected={checked}>
                    <TableCell padding="checkbox">
                      <input type="checkbox" aria-label={`select-${row.id}`} data-testid={`select-${row.id}`} checked={checked} onChange={() => toggleOne(row.id)} disabled={busy} />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">{row.email}</Typography>
                    </TableCell>
                    <TableCell>
                      <Chip size="small" label={row.status} color={statusChipColor(row.status)} />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">{formatDate(row.createdAt)}</Typography>
                    </TableCell>
                  </TableRow>
                );
              })}
              {items.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4}>
                    <Box py={4} textAlign="center">
                      <Typography variant="body2" color="text.secondary">Нет данных</Typography>
                    </Box>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          component="div"
          count={total}
          page={page}
          onPageChange={onChangePage}
          rowsPerPage={pageSize}
          onRowsPerPageChange={onChangeRowsPerPage}
          rowsPerPageOptions={[10, 20, 50, 100]}
          data-testid="pagination"
        />
      </CardContent>

      <Snackbar
        open={Boolean(snack)}
        autoHideDuration={3000}
        onClose={() => setSnack(null)}
        message={snack ?? ''}
      />
    </Card>
    </RequirePermission>
  );
}
