import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// Пустой API для подключения RTK Query middleware. В дальнейшем здесь будут описаны endpoints.
export const emptySplitApi = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
  baseUrl: '/',
  // use global fetch if available (tests/SSR)
  fetchFn: typeof fetch !== 'undefined' ? (fetch as typeof globalThis.fetch) : undefined,
}),
  tagTypes: ['AdminNews', 'AdminStore'] as const,
  endpoints: (builder) => ({
    getProductById: builder.query<import('@/data/mock').Product | undefined, string>({
      query: (id) => `/api/products/${id}`,
    }),
    getProductsByCategory: builder.query<import('@/data/mock').Product[], string>({
      query: (slug) => `/api/products?category=${slug}`,
    }),
    getB2BPrices: builder.query<Array<{ id: string; price: number }>, void>({
      query: () => '/api/b2b/prices',
    }),
    requestQuote: builder.mutation<{ url: string }, { items: Array<{ id: string; quantity: number }> }>({
      query: (body) => ({
        url: '/api/b2b/quote',
        method: 'POST',
        body,
      }),
    }),

    // Admin News endpoints
    getAdminNews: builder.query<import('@/types/admin').AdminNews[], void>({
      query: () => '/api/admin/news',
      providesTags: (result) =>
        result
          ? [...result.map(({ id }) => ({ type: 'AdminNews' as const, id })), { type: 'AdminNews', id: 'LIST' }]
          : [{ type: 'AdminNews', id: 'LIST' }],
    }),
    createNews: builder.mutation<import('@/types/admin').AdminNews, Partial<import('@/types/admin').AdminNews>>({
      query: (body) => ({ url: '/api/admin/news', method: 'POST', body }),
      invalidatesTags: [{ type: 'AdminNews', id: 'LIST' }],
    }),
    updateNews: builder.mutation<import('@/types/admin').AdminNews, { id: string; patch: Partial<import('@/types/admin').AdminNews> }>({
      query: ({ id, patch }) => ({ url: `/api/admin/news/${id}`, method: 'PATCH', body: patch }),
      invalidatesTags: (res, err, { id }) => [{ type: 'AdminNews', id }],
    }),
    deleteNews: builder.mutation<{ ok: boolean }, string>({
      query: (id) => ({ url: `/api/admin/news/${id}`, method: 'DELETE' }),
      invalidatesTags: [{ type: 'AdminNews', id: 'LIST' }],
    }),

    // Admin Stores endpoints
    getAdminStores: builder.query<import('@/types/admin').AdminStore[], void>({
      query: () => '/api/admin/stores',
      providesTags: (result) =>
        result
          ? [...result.map(({ id }) => ({ type: 'AdminStore' as const, id })), { type: 'AdminStore', id: 'LIST' }]
          : [{ type: 'AdminStore', id: 'LIST' }],
    }),
    createStore: builder.mutation<import('@/types/admin').AdminStore, Partial<import('@/types/admin').AdminStore>>({
      query: (body) => ({ url: '/api/admin/stores', method: 'POST', body }),
      invalidatesTags: [{ type: 'AdminStore', id: 'LIST' }],
    }),
    updateStore: builder.mutation<import('@/types/admin').AdminStore, { id: string; patch: Partial<import('@/types/admin').AdminStore> }>({
      query: ({ id, patch }) => ({ url: `/api/admin/stores/${id}`, method: 'PATCH', body: patch }),
      invalidatesTags: (res, err, { id }) => [{ type: 'AdminStore', id }],
    }),
    deleteStore: builder.mutation<{ ok: boolean }, string>({
      query: (id) => ({ url: `/api/admin/stores/${id}`, method: 'DELETE' }),
      invalidatesTags: [{ type: 'AdminStore', id: 'LIST' }],
    }),
  }),
});

export const {
  useGetProductsByCategoryQuery,
  useGetB2BPricesQuery,
  useRequestQuoteMutation,
  useGetAdminNewsQuery,
  useCreateNewsMutation,
  useUpdateNewsMutation,
  useDeleteNewsMutation,
  useGetAdminStoresQuery,
  useCreateStoreMutation,
  useUpdateStoreMutation,
  useDeleteStoreMutation,
} = emptySplitApi;
