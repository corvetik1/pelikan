import { emptySplitApi } from './api';
import type { AdminMedia } from '@/types/admin';

export type MediaList = {
  items: AdminMedia[];
  total: number;
  page: number;
  pageSize: number;
};

export const mediaApi = emptySplitApi.injectEndpoints({
  endpoints: (builder) => ({
    listMedia: builder.query<MediaList, number | void>({
      query: (page = 1) => `/api/admin/upload?page=${page}`,
      transformResponse: (resp, _meta, arg) => {
        const currentPage = typeof arg === 'number' ? arg : 1;
        if (Array.isArray(resp)) {
          // Обратная совместимость со старым ответом: массив записей без мета
          const pageSize = 20;
          return {
            items: resp as AdminMedia[],
            total: (resp as AdminMedia[]).length,
            page: currentPage,
            pageSize,
          } satisfies MediaList;
        }
        const r = resp as { items: AdminMedia[]; total: number; page: number; pageSize: number };
        return { items: r.items, total: r.total, page: r.page, pageSize: r.pageSize } satisfies MediaList;
      },
      providesTags: (result) =>
        result ? [...result.items.map(({ id }) => ({ type: 'Media' as const, id })), { type: 'Media', id: 'LIST' }] : [{ type: 'Media', id: 'LIST' }],
    }),
    uploadMedia: builder.mutation<AdminMedia[], FormData>({
      query: (formData) => ({
        url: '/api/admin/upload',
        method: 'POST',
        body: formData,
      }),
      invalidatesTags: [
        { type: 'Media', id: 'LIST' },
        { type: 'AdminProduct', id: 'LIST' },
        { type: 'AdminRecipe', id: 'LIST' },
        { type: 'AdminNews', id: 'LIST' },
      ],
    }),
    deleteMedia: builder.mutation<AdminMedia, string>({
      query: (id) => ({
        url: `/api/admin/upload/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: [
        { type: 'Media', id: 'LIST' },
        { type: 'AdminProduct', id: 'LIST' },
        { type: 'AdminRecipe', id: 'LIST' },
        { type: 'AdminNews', id: 'LIST' },
      ],
    }),
  }),
});

export const { useListMediaQuery, useUploadMediaMutation, useDeleteMediaMutation } = mediaApi;
