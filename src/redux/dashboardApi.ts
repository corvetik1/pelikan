import { emptySplitApi } from './api';
import type { DashboardData } from '@/types/dashboard';

export const dashboardApi = emptySplitApi.injectEndpoints({
  endpoints: (builder) => ({
    getDashboard: builder.query<DashboardData, void>({
      query: () => '/api/admin/dashboard',
      providesTags: ['Dashboard'],
    }),
  }),
  overrideExisting: false,
});

export const { useGetDashboardQuery } = dashboardApi;
