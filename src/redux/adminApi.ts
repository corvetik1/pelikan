import { emptySplitApi } from './api';
import type { NewsArticle, Product, Recipe } from '@/data/mock';
import type { AdminUser } from '@/types/admin';

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
    // ---------------- recipes ----------------
    getAdminRecipes: builder.query<Recipe[], void>({
      query: () => '/api/admin/recipes',
    }),
    createRecipe: builder.mutation<Recipe, Partial<Recipe>>({
      query: (body) => ({
        url: '/api/admin/recipes',
        method: 'POST',
        body,
      }),
    }),
    updateAdminRecipe: builder.mutation<Recipe, { id: string; patch: Partial<Recipe> }>({
      query: ({ id, patch }) => ({
        url: `/api/admin/recipes/${id}`,
        method: 'PATCH',
        body: patch,
      }),
    }),
    deleteRecipe: builder.mutation<Recipe, string>({
      query: (id) => ({
        url: `/api/admin/recipes/${id}`,
        method: 'DELETE',
      }),
    }),

    // ---------------- users ----------------
    getAdminUsers: builder.query<AdminUser[], void>({
      query: () => '/api/admin/users',
    }),
    createUser: builder.mutation<AdminUser, Partial<AdminUser>>({
      query: (body) => ({
        url: '/api/admin/users',
        method: 'POST',
        body,
      }),
    }),
    updateAdminUser: builder.mutation<AdminUser, { id: string; patch: Partial<AdminUser> }>({
      query: ({ id, patch }) => ({
        url: `/api/admin/users/${id}`,
        method: 'PATCH',
        body: patch,
      }),
    }),
    deleteUser: builder.mutation<AdminUser, string>({
      query: (id) => ({
        url: `/api/admin/users/${id}`,
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
  useGetAdminRecipesQuery,
  useCreateRecipeMutation,
  useUpdateAdminRecipeMutation,
  useDeleteRecipeMutation,
} = adminApi;
