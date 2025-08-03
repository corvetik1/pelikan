import { emptySplitApi } from './api';
import type { AdminMedia } from '@/types/admin';

export const mediaApi = emptySplitApi.injectEndpoints({
  endpoints: (builder) => ({
    listMedia: builder.query<AdminMedia[], number | void>({
      query: (page = 1) => `/api/admin/upload?page=${page}`,
      providesTags: (result) =>
        result ? [...result.map(({ id }) => ({ type: 'Media' as const, id })), { type: 'Media', id: 'LIST' }] : [{ type: 'Media', id: 'LIST' }],
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
