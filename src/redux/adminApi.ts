import { emptySplitApi } from './api';
import type { NewsArticle, Product } from '@/data/mock';

export const adminApi = emptySplitApi.injectEndpoints({
  endpoints: (builder) => ({
    updateNewsField: builder.mutation<void, { id: string; patch: Partial<NewsArticle> }>({
      query: ({ id, patch }) => ({
        url: `/api/admin/news/${id}`,
        method: 'PATCH',
        body: patch,
      }),
      
    }),
    updateProductField: builder.mutation<void, { id: string; patch: Record<string, unknown> }>({
      query: ({ id, patch }) => ({
        url: `/api/admin/products/${id}`,
        method: 'PATCH',
        body: patch,
      }),
    }),
    updateRecipeField: builder.mutation<void, { id: string; patch: Record<string, unknown> }>({
      query: ({ id, patch }) => ({
        url: `/api/admin/recipes/${id}`,
        method: 'PATCH',
        body: patch,
      }),
    }),
    updateStoreField: builder.mutation<void, { id: string; patch: Record<string, unknown> }>({
      query: ({ id, patch }) => ({
        url: `/api/admin/stores/${id}`,
        method: 'PATCH',
        body: patch,
      }),
    }),
    getAdminProducts: builder.query<Product[], void>({
      query: () => '/api/admin/products',
    }),
    createProduct: builder.mutation<Product, Partial<Product>>({
      query: (body) => ({
        url: '/api/admin/products',
        method: 'POST',
        body,
      }),
    }),
    updateAdminProduct: builder.mutation<Product, { id: string; patch: Partial<Product> }>({
      query: ({ id, patch }) => ({
        url: `/api/admin/products/${id}`,
        method: 'PATCH',
        body: patch,
      }),
    }),
    deleteProduct: builder.mutation<Product, string>({
      query: (id) => ({
        url: `/api/admin/products/${id}`,
        method: 'DELETE',
      }),
    }),
  }),
});

export const {
  useUpdateNewsFieldMutation,
  useUpdateProductFieldMutation,
  useUpdateRecipeFieldMutation,
  useUpdateStoreFieldMutation,
  useGetAdminProductsQuery,
  useCreateProductMutation,
  useUpdateAdminProductMutation,
  useDeleteProductMutation,
} = adminApi;
