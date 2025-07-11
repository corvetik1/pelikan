import { emptySplitApi } from './api';
import type { NewsArticle } from '@/data/mock';
import type { AdminProduct, AdminRecipe, AdminUser } from '@/types/admin';

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
    getAdminProducts: builder.query<AdminProduct[], void>({
      query: () => '/api/admin/products',
      providesTags: (result) =>
        result
          ? [...result.map(({ id }) => ({ type: 'AdminProduct' as const, id })), { type: 'AdminProduct', id: 'LIST' }]
          : [{ type: 'AdminProduct', id: 'LIST' }],
    }),
    createProduct: builder.mutation<AdminProduct, Partial<AdminProduct>>({
      query: (body) => ({
        url: '/api/admin/products',
        method: 'POST',
        body,
      }),
      invalidatesTags: [{ type: 'AdminProduct', id: 'LIST' }],
    }),
    updateAdminProduct: builder.mutation<AdminProduct, { id: string; patch: Partial<AdminProduct> }>({
      query: ({ id, patch }) => ({
        url: `/api/admin/products/${id}`,
        method: 'PATCH',
        body: patch,
      }),
      invalidatesTags: (res, err, { id }) => [{ type: 'AdminProduct', id }],
    }),
    deleteProduct: builder.mutation<AdminProduct, string>({
      query: (id) => ({
        url: `/api/admin/products/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'AdminProduct', id: 'LIST' }],
    }),
    // ---------------- recipes ----------------
    getAdminRecipes: builder.query<AdminRecipe[], void>({
      query: () => '/api/admin/recipes',
      providesTags: (result) =>
        result
          ? [...result.map(({ id }) => ({ type: 'AdminRecipe' as const, id })), { type: 'AdminRecipe', id: 'LIST' }]
          : [{ type: 'AdminRecipe', id: 'LIST' }],
    }),
    createRecipe: builder.mutation<AdminRecipe, Partial<AdminRecipe>>({
      query: (body) => ({
        url: '/api/admin/recipes',
        method: 'POST',
        body,
      }),
      invalidatesTags: [{ type: 'AdminRecipe', id: 'LIST' }],
    }),
    updateAdminRecipe: builder.mutation<AdminRecipe, { id: string; patch: Partial<AdminRecipe> }>({
      query: ({ id, patch }) => ({
        url: `/api/admin/recipes/${id}`,
        method: 'PATCH',
        body: patch,
      }),
      invalidatesTags: (res, err, { id }) => [{ type: 'AdminRecipe', id }],
    }),
    deleteRecipe: builder.mutation<AdminRecipe, string>({
      query: (id) => ({
        url: `/api/admin/recipes/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'AdminRecipe', id: 'LIST' }],
    }),

    // ---------------- users ----------------
    getAdminUsers: builder.query<AdminUser[], void>({
      query: () => '/api/admin/users',
      providesTags: (result) =>
        result
          ? [...result.map(({ id }) => ({ type: 'AdminUser' as const, id })), { type: 'AdminUser', id: 'LIST' }]
          : [{ type: 'AdminUser', id: 'LIST' }],
    }),
    createUser: builder.mutation<AdminUser, Partial<AdminUser>>({
      query: (body) => ({
        url: '/api/admin/users',
        method: 'POST',
        body,
      }),
      invalidatesTags: [{ type: 'AdminUser', id: 'LIST' }],
    }),
    updateAdminUser: builder.mutation<AdminUser, { id: string; patch: Partial<AdminUser> }>({
      query: ({ id, patch }) => ({
        url: `/api/admin/users/${id}`,
        method: 'PATCH',
        body: patch,
      }),
      invalidatesTags: (res, err, { id }) => [{ type: 'AdminUser', id }],
    }),
    deleteUser: builder.mutation<AdminUser, string>({
      query: (id) => ({
        url: `/api/admin/users/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'AdminUser', id: 'LIST' }],
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
  useGetAdminRecipesQuery,
  useCreateRecipeMutation,
  useUpdateAdminRecipeMutation,
  useDeleteRecipeMutation,
  useGetAdminUsersQuery,
  useCreateUserMutation,
  useUpdateAdminUserMutation,
  useDeleteUserMutation,
} = adminApi;
