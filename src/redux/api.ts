import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// Пустой API для подключения RTK Query middleware. В дальнейшем здесь будут описаны endpoints.
export const emptySplitApi = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({ baseUrl: '/' }),
  endpoints: () => ({}),
});
