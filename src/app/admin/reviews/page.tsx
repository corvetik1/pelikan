"use client";

import { useState, useMemo, useCallback } from 'react';
import AdminPageHeading from "@/components/admin/AdminPageHeading";
import ViewToggle from '@/components/admin/ViewToggle';
import { useViewMode } from '@/hooks/useViewMode';
import {
  Box,
  Typography,
  Stack,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  IconButton,
  Chip,
  CircularProgress,
  TextField,
  Autocomplete,

} from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import AdminReviewCard from '@/components/admin/AdminReviewCard';
import type { ChipProps } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import { useDispatch } from 'react-redux';
import { showSnackbar } from '@/redux/snackbarSlice';

import {
  useGetAdminReviewsQuery,
  useUpdateReviewStatusMutation,
  useGetAdminProductsQuery,
} from '@/redux/adminApi';
import type { AdminReview } from '@/types/admin';

const PAGE_SIZE = 20;

  

export default function AdminReviewsPage() {
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('pending');
  const [page, setPage] = useState(1);
  const [productFilter, setProductFilter] = useState<string | null>(null);
  const [productQuery, setProductQuery] = useState('');
  const dispatch = useDispatch();
  const [viewMode] = useViewMode('reviews');

  const { data, isLoading, isError, refetch } = useGetAdminReviewsQuery({
    status: statusFilter === 'all' ? undefined : statusFilter,
    productId: productFilter ?? undefined,
    page,
  });

  const rows = data?.items ?? [];
  const total = data?.total ?? 0;
  const [updateStatus] = useUpdateReviewStatusMutation();

  const { data: productsData } = useGetAdminProductsQuery(productQuery.length >= 2 ? { q: productQuery } : { q: undefined });
  const productOptions = productsData ?? [];

  const handleStatusChange = useCallback(async (id: string, newStatus: 'approved' | 'rejected') => {
    try {
      await updateStatus({ id, status: newStatus }).unwrap();
      dispatch(showSnackbar({ message: 'Статус обновлён', severity: 'success' }));
      refetch();
    } catch {
      dispatch(showSnackbar({ message: 'Ошибка обновления', severity: 'error' }));
    }
  }, [updateStatus, dispatch, refetch]);

  const columns: GridColDef[] = useMemo(() => [
    { field: 'productName', headerName: 'Товар', flex: 1, minWidth: 200 },
    {
      field: 'rating',
      headerName: '⭐',
      width: 80,
      valueFormatter: (value: number) => `${value} / 5`,
    },
    { field: 'author', headerName: 'Автор', width: 180 },
    { field: 'body', headerName: 'Текст', flex: 2, minWidth: 300 },
    {
      field: 'status',
      headerName: 'Статус',
      width: 130,
      renderCell: (params) => {
        const v: AdminReview['status'] = params.value;
        const color: ChipProps['color'] = v === 'approved' ? 'success' : v === 'rejected' ? 'error' : 'default';
        const label = v === 'approved' ? 'Одобрен' : v === 'rejected' ? 'Отклонён' : 'Ожидает';
        return <Chip label={label} color={color} size="small" />;
      },
    },
    {
      field: 'createdAt',
      headerName: 'Дата',
      width: 140,
      valueFormatter: (value: string) => new Date(value).toLocaleDateString('ru-RU'),
    },
    {
      field: 'actions',
      headerName: '',
      width: 120,
      sortable: false,
      filterable: false,
      renderCell: (params) => {
        const { id, row } = params;
        const review = row as AdminReview;
        if (review.status !== 'pending') return null;
        return (
          <Stack direction="row" spacing={1}>
            <IconButton color="success" size="small" onClick={() => handleStatusChange(id as string, 'approved')}>
              <CheckCircleIcon fontSize="small" />
            </IconButton>
            <IconButton color="error" size="small" onClick={() => handleStatusChange(id as string, 'rejected')}>
              <CancelIcon fontSize="small" />
            </IconButton>
          </Stack>
        );
      },
    },
  ], [handleStatusChange]);

  return (
    <Box>
      <AdminPageHeading
        title="Отзывы"
        actions={
          <Stack direction="row" spacing={2} alignItems="center">
            <Autocomplete
              size="small"
              sx={{ minWidth: 220 }}
              options={productOptions}
              getOptionLabel={(o) => o.name}
              onInputChange={(_, val) => setProductQuery(val)}
              onChange={(_, val) => {
                setProductFilter(val ? val.id : null);
                setPage(1);
              }}
              renderInput={(params) => (
                <TextField {...params} label="Товар" placeholder="Поиск..." />
              )}
            />
            <FormControl size="small" sx={{ minWidth: 160 }}>
              <InputLabel id="status-label">Статус</InputLabel>
              <Select
                labelId="status-label"
                label="Статус"
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value as typeof statusFilter);
                  setPage(1);
                }}
              >
                <MenuItem value="all">Все</MenuItem>
                <MenuItem value="pending">Ожидает</MenuItem>
                <MenuItem value="approved">Одобрено</MenuItem>
                <MenuItem value="rejected">Отклонено</MenuItem>
              </Select>
            </FormControl>
            <ViewToggle section="reviews" />
          </Stack>
        }
      />

      {isError ? (
        <Typography color="error">Ошибка загрузки</Typography>
      ) : (
        viewMode === 'list' ? (
          <DataGrid
            rows={rows}
            columns={columns}
            autoHeight
            paginationMode="server"
            rowCount={total}
            pageSizeOptions={[PAGE_SIZE]}
            paginationModel={{ page: page - 1, pageSize: PAGE_SIZE }}
            onPaginationModelChange={(model) => setPage(model.page + 1)}
            loading={isLoading}
            density="comfortable"
            getRowId={(row) => row.id}
            disableRowSelectionOnClick
            slots={{
              loadingOverlay: () => (
                <Stack alignItems="center" sx={{ py: 4 }}>
                  <CircularProgress />
                </Stack>
              ),
            }}
          />
        ) : (
          <Box display="flex" flexWrap="wrap" gap={2}>
            {rows.map((review) => (
              <Box key={review.id} sx={{ width: { xs: '100%', sm: 'calc(50% - 16px)', md: 'calc(33.333% - 16px)', lg: 'calc(25% - 16px)' } }}>
                <AdminReviewCard
                  review={review}
                  onApprove={() => handleStatusChange(review.id, 'approved')}
                  onReject={() => handleStatusChange(review.id, 'rejected')}
                />
              </Box>
            ))}
          </Box>
        )
      )}
    </Box>
  );
}
