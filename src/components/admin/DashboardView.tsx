"use client";

import { Grid } from '@mui/material';
import { Box, Paper, Typography, List, ListItem, ListItemText, Skeleton } from '@mui/material';
import Inventory2Icon from '@mui/icons-material/Inventory2';
import ArticleIcon from '@mui/icons-material/Article';
import RestaurantMenuIcon from '@mui/icons-material/RestaurantMenu';
import RateReviewIcon from '@mui/icons-material/RateReview';
import StatsCard from './StatsCard';
import { useGetDashboardQuery } from '@/redux/dashboardApi';
import {
  AreaChart,
  XAxis,
  YAxis,
  Tooltip,
  Area,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';

import type { DashboardData } from '@/types/dashboard';

interface DashboardViewProps {
  /** optional pre-fetched data (SSR). If not provided, hook will fetch */
  data?: DashboardData;
}


export default function DashboardView({ data: ssrData }: DashboardViewProps) {
  const {
    data = ssrData,
    isLoading,
    isFetching,
  } = useGetDashboardQuery(undefined, { skip: !!ssrData });

  const loading = isLoading || isFetching || !data;
  if (loading && !data) {
    // initial skeleton
    return (
      <Grid container spacing={3}>
        {Array.from({ length: 4 }).map((_, idx) => (
          <Grid size={{ xs: 12, sm: 6, md: 3 }} key={idx}>
            <Skeleton variant="rounded" height={140} data-testid="skeleton" />
          </Grid>
        ))}
      </Grid>
    );
  }

  if (!data) return null;
  const { counts, topProducts } = data;

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatsCard icon={<Inventory2Icon />} title="Товары" value={counts.products} />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatsCard icon={<ArticleIcon />} title="Новости" value={counts.news} color="secondary" />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatsCard icon={<RestaurantMenuIcon />} title="Рецепты" value={counts.recipes} color="success" />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatsCard icon={<RateReviewIcon />} title="Отзывы (ожидают)" value={counts.reviewsPending} color="warning" />
        </Grid>

        {/* Placeholder for charts */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Выручка (30 дней)
            </Typography>
            <ResponsiveContainer width="100%" height={240}>
              <AreaChart data={data.revenueSeries} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" tickFormatter={(d) => d.slice(5)} />
                <YAxis />
                <Tooltip />
                <Area type="monotone" dataKey="value" stroke="#1976d2" fillOpacity={0.15} fill="#90caf9" />
              </AreaChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Топ-5 товаров
            </Typography>
            <List dense>
              {topProducts.map((p) => (
                <ListItem key={p.name} secondaryAction={<Typography>{p.sales}</Typography>}>
                  <ListItemText primary={p.name} />
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
