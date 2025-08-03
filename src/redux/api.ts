import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';


// Пустой API для подключения RTK Query middleware. В дальнейшем здесь будут описаны endpoints.
export const emptySplitApi = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
  baseUrl: '',
  // Convert relative URLs to absolute when running in Node/Jest (no real browser)
  fetchFn: ((input: RequestInfo | URL, init?: RequestInit) => {
    const isBrowser = typeof window !== 'undefined' && typeof window.document !== 'undefined';
    const fetchImpl = (globalThis.fetch as typeof fetch);
    if (!isBrowser && typeof input === 'string' && input.startsWith('/')) {
      return fetchImpl(`http://localhost${input}`, init);
    }
    return fetchImpl(input as RequestInfo | URL, init);
  }) as typeof fetch,
}),
  tagTypes: ['AdminNews', 'AdminStore', 'AdminRole', 'AdminUser', 'AdminProduct', 'AdminRecipe', 'AdminReview', 'AdminQuote', 'NewsCategory', 'Theme', 'Media', 'Quote', 'Review', 'Settings', 'Dashboard'] as const,
  endpoints: (builder) => ({
    getProductById: builder.query<import('@/types/product').Product | undefined, string>({
      query: (id) => `/api/products/${id}`,
    }),
    getProductsByCategory: builder.query<import('@/types/product').Product[], string>({
      query: (slug) => `/api/products?category=${slug}`,
    }),
    getAllProducts: builder.query<import('@/types/product').Product[], void>({
      query: () => '/api/products',
    }),
    getB2BPrices: builder.query<Array<{ id: string; price: number }>, void>({
      query: () => '/api/b2b/prices',
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

    // ---------------- news categories ----------------
    getAdminNewsCategories: builder.query<import('@/types/admin').NewsCategory[], void>({
      query: () => '/api/admin/news-categories',
      providesTags: (result) =>
        result
          ? [...result.map(({ id }) => ({ type: 'NewsCategory' as const, id })), { type: 'NewsCategory', id: 'LIST' }]
          : [{ type: 'NewsCategory', id: 'LIST' }],
    }),
    createNewsCategory: builder.mutation<import('@/types/admin').NewsCategory, import('@/lib/validation/newsCategorySchema').NewsCategoryCreateInput>({
      query: (body) => ({ url: '/api/admin/news-categories', method: 'POST', body }),
      invalidatesTags: [{ type: 'NewsCategory', id: 'LIST' }],
    }),
    updateNewsCategory: builder.mutation<import('@/types/admin').NewsCategory, { id: string; patch: import('@/lib/validation/newsCategorySchema').NewsCategoryUpdateInput }>({
      query: ({ id, patch }) => ({ url: `/api/admin/news-categories/${id}`, method: 'PATCH', body: patch }),
      invalidatesTags: (res, err, { id }) => [{ type: 'NewsCategory', id }, { type: 'NewsCategory', id: 'LIST' }],
    }),
    deleteNewsCategory: builder.mutation<{ ok: boolean }, string>({
      query: (id) => ({ url: `/api/admin/news-categories/${id}`, method: 'DELETE' }),
      invalidatesTags: [{ type: 'NewsCategory', id: 'LIST' }],
    }),

    // Admin Roles endpoints
    getAdminRoles: builder.query<import('@/types/admin').AdminRole[], void>({
      query: () => '/api/admin/roles',
      providesTags: (result) =>
        result
          ? [...result.map(({ id }) => ({ type: 'AdminRole' as const, id })), { type: 'AdminRole', id: 'LIST' }]
          : [{ type: 'AdminRole', id: 'LIST' }],
    }),
    createRole: builder.mutation<import('@/types/admin').AdminRole, Partial<import('@/types/admin').AdminRole>>({
      query: (body) => ({ url: '/api/admin/roles', method: 'POST', body }),
      invalidatesTags: [{ type: 'AdminRole', id: 'LIST' }],
    }),
    updateRole: builder.mutation<import('@/types/admin').AdminRole, { id: string; patch: Partial<import('@/types/admin').AdminRole> }>({
      query: ({ id, patch }) => ({ url: `/api/admin/roles/${id}`, method: 'PATCH', body: patch }),
      invalidatesTags: (res, err, { id }) => [{ type: 'AdminRole', id }],
    }),
    deleteRole: builder.mutation<{ ok: boolean }, string>({
      query: (id) => ({ url: `/api/admin/roles/${id}`, method: 'DELETE' }),
      invalidatesTags: [{ type: 'AdminRole', id: 'LIST' }],
    }),

    // Quotes endpoints
    createQuote: builder.mutation<{ id: string }, { items: Array<{ id: string; quantity: number }>; userEmail: string }>({
      query: (body) => ({ url: '/api/quotes', method: 'POST', body }),
    }),
    getQuote: builder.query<import('@/types/quote').Quote, string>({
      query: (id) => `/api/quotes/${id}`,
      providesTags: (result) => (result ? [{ type: 'Quote', id: result.id }] : []),
    }),
    updateQuotePrices: builder.mutation<import('@/types/quote').Quote, { id: string; prices: Record<string, number> }>({
      query: ({ id, prices }) => ({ url: `/api/admin/quotes/${id}/prices`, method: 'PATCH', body: { prices } }),
      invalidatesTags: (res, err, { id }) => [{ type: 'Quote', id }],
    }),

    // Admin Quotes endpoints
    getAdminProducts: builder.query<import('@/types/admin').AdminProduct[], void>({
      query: () => '/api/admin/products',
      providesTags: (result) =>
        result
          ? [...result.map(({ id }) => ({ type: 'AdminProduct' as const, id })), { type: 'AdminProduct', id: 'LIST' }]
          : [{ type: 'AdminProduct', id: 'LIST' }],
    }),
    createProduct: builder.mutation<import('@/types/admin').AdminProduct, import('@/lib/validation/productSchema').ProductCreateInput>({
      query: (body) => ({ url: '/api/admin/products', method: 'POST', body }),
      invalidatesTags: [{ type: 'AdminProduct', id: 'LIST' }],
    }),
    updateProduct: builder.mutation<import('@/types/admin').AdminProduct, { id: string; patch: Partial<import('@/lib/validation/productSchema').ProductUpdateInput> }>({
      query: ({ id, patch }) => ({ url: `/api/admin/products/${id}`, method: 'PATCH', body: patch }),
      invalidatesTags: (res, err, { id }) => [{ type: 'AdminProduct', id }],
    }),
    deleteProduct: builder.mutation<{ ok: boolean }, string>({
      query: (id) => ({ url: `/api/admin/products/${id}`, method: 'DELETE' }),
      invalidatesTags: [{ type: 'AdminProduct', id: 'LIST' }],
    }),

    // Admin Recipes endpoints
    getAdminRecipes: builder.query<import('@/types/admin').AdminRecipe[], void>({
      query: () => '/api/admin/recipes',
      providesTags: (result) =>
        result
          ? [...result.map(({ id }) => ({ type: 'AdminRecipe' as const, id })), { type: 'AdminRecipe', id: 'LIST' }]
          : [{ type: 'AdminRecipe', id: 'LIST' }],
    }),
    createRecipe: builder.mutation<import('@/types/admin').AdminRecipe, import('@/lib/validation/recipeSchema').RecipeCreateInput>({
      query: (body) => ({ url: '/api/admin/recipes', method: 'POST', body }),
      invalidatesTags: [{ type: 'AdminRecipe', id: 'LIST' }],
    }),
    updateRecipe: builder.mutation<import('@/types/admin').AdminRecipe, { id: string; patch: Partial<import('@/lib/validation/recipeSchema').RecipeUpdateInput> }>({
      query: ({ id, patch }) => ({ url: `/api/admin/recipes/${id}`, method: 'PATCH', body: patch }),
      invalidatesTags: (res, err, { id }) => [{ type: 'AdminRecipe', id }],
    }),
    deleteRecipe: builder.mutation<{ ok: boolean }, string>({
      query: (id) => ({ url: `/api/admin/recipes/${id}`, method: 'DELETE' }),
      invalidatesTags: [{ type: 'AdminRecipe', id: 'LIST' }],
    }),

    // Admin Quotes endpoints
    getAdminQuotes: builder.query<import('@/types/quote').Quote[], void>({
      query: () => '/api/admin/quotes',
      providesTags: (result) =>
        result ? [...result.map(({ id }) => ({ type: 'Quote' as const, id })), { type: 'Quote', id: 'LIST' }] : [{ type: 'Quote', id: 'LIST' }],
    }),

    // Reviews endpoints
    getProductReviews: builder.query<{ items: import('@/types/review').Review[]; total: number }, { productId: string; page?: number; sort?: 'new' | 'old' | 'rating' }>({
      query: ({ productId, page = 1, sort = 'new' }) => `/api/products/${productId}/reviews?page=${page}&sort=${sort}`,
      providesTags: (result, _err, { productId }) =>
        result && result.items
          ? [
              ...result.items.map(({ id }) => ({ type: 'Review' as const, id })),
              { type: 'Review', id: `LIST_${productId}` },
            ]
          : [{ type: 'Review', id: `LIST_${productId}` }],
    }),
    createReview: builder.mutation<import('@/types/review').Review, import('@/types/review').CreateReviewInput>({
      query: (body) => ({
        url: `/api/products/${body.productId}/reviews`,
        method: 'POST',
        body,
      }),
      invalidatesTags: (_res, _err, { productId }) => [{ type: 'Review', id: `LIST_${productId}` }],
    }),

    // ---------------- settings ----------------
    getSettings: builder.query<import('@/types/settings').Settings, void>({
      query: () => '/api/settings',
      providesTags: ['Settings'],
    }),

    updateSettings: builder.mutation<import('@/types/settings').Settings, Partial<import('@/types/settings').Settings>>({
      query: (patch) => ({
        url: '/api/settings',
        method: 'PATCH',
        body: patch,
      }),
      invalidatesTags: ['Settings', { type: 'Theme', id: 'LIST' }],
    }),

    // ---------------- themes ----------------
    getAdminThemes: builder.query<import('@/types/admin').AdminTheme[], void>({
      query: () => '/api/admin/themes',
      providesTags: (result) =>
        result
          ? [...result.map(({ slug }) => ({ type: 'Theme' as const, id: slug })), { type: 'Theme', id: 'LIST' }]
          : [{ type: 'Theme', id: 'LIST' }],
    }),
    createTheme: builder.mutation<import('@/types/admin').AdminTheme, import('@/lib/validation/themeSchema').ThemeCreateInput>({
      query: (body) => ({ url: '/api/admin/themes', method: 'POST', body }),
      invalidatesTags: [{ type: 'Theme', id: 'LIST' }],
    }),
    updateTheme: builder.mutation<import('@/types/admin').AdminTheme, { slug: string; patch: import('@/lib/validation/themeSchema').ThemeUpdateInput }>({
      query: ({ slug, patch }) => ({ url: `/api/admin/themes/${slug}`, method: 'PATCH', body: patch }),
      invalidatesTags: (res, err, { slug }) => [{ type: 'Theme', id: slug }],
    }),
    deleteTheme: builder.mutation<{ ok: boolean }, string>({
      query: (slug) => ({ url: `/api/admin/themes/${slug}`, method: 'DELETE' }),
      invalidatesTags: [{ type: 'Theme', id: 'LIST' }],
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
  useGetAllProductsQuery,
  useGetB2BPricesQuery,
  useGetAdminNewsQuery,
  useUpdateNewsMutation,
  useCreateNewsMutation,

  useGetAdminNewsCategoriesQuery,
  useCreateNewsCategoryMutation,
  useUpdateNewsCategoryMutation,
  useDeleteNewsCategoryMutation,
  useDeleteNewsMutation,
  useGetAdminStoresQuery,
  useCreateStoreMutation,
  useUpdateStoreMutation,
  useDeleteStoreMutation,
  useGetAdminRolesQuery,
  useCreateRoleMutation,
  useUpdateRoleMutation,
  useDeleteRoleMutation,
  useCreateQuoteMutation,
  useGetQuoteQuery,
  useUpdateQuotePricesMutation,
  useGetAdminQuotesQuery,
  useGetProductReviewsQuery,
  useCreateReviewMutation,

  useGetAdminThemesQuery,
  useCreateThemeMutation,
  useUpdateThemeMutation,
  useDeleteThemeMutation,
  useGetSettingsQuery,
  useUpdateSettingsMutation,
} = emptySplitApi;
