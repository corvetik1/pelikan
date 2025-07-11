# Admin Panel Documentation

## Overview

The admin panel (`/admin`) is a client-side SPA built with Next.js 15 **Client Components** on top of the shared Redux store.  It provides CRUD management for corporate content: **Products, Recipes, News, Stores, Users, Roles, Quotes**.

The UI follows a strict, unified pattern to ensure consistency, accessibility and type-safety.

| Feature | Implementation |
|---------|----------------|
| **Framework** | Next.js 15 (App Router) – CSR for admin screens |
| **State** | Redux Toolkit + RTK Query, slice-local optimistic updates |
| **UI-kit** | MUI v5 DataGrid + custom dialogs |
| **Access** | Role-based (`AdminRole.permissions`) – only `admin` sees edit controls |
| **Testing** | Jest + RTL + MSW – full CRUD coverage |

---

## Common UI Patterns

### 1. DataGrid Columns

* `id` – width 110 px
* Boolean fields – width 110 px (`type:"boolean"`)
* Dates – width 140 px, formatted via `dayjs(date).format('DD.MM.YYYY')`
* Text fields – `flex:1` with sensible `minWidth` (title ≥ 160 px, email ≥ 200 px, description ≥ 300 px)
* Action column – rendered inside `AdminDataGrid` (`onDelete`, `onUpdate`, Bulk actions)

> Never hardcode widths inside pages – extend `GridColDef` objects only.

### 2. CRUD Feedback

* **ConfirmDialog** – replaces all `window.confirm`.  Usage:

  ```tsx
  <ConfirmDialog
    open={open}
    title="Удалить товар?"
    description="Действие необратимо."
    confirmText="Удалить"
    onConfirm={handleDelete}
    onClose={handleClose}
  />
  ```

* **Snackbar** – unified across admin:
  * `anchorOrigin={{ vertical:'bottom', horizontal:'right' }}`
  * `autoHideDuration={4000}` ms
  * Severity reflects action result (`success` | `error`)

* **Skeletons** – displayed on every list page while `isLoading`.

### 3. Inline Editing

DataGrid cells are editable (`editable:true`) and call `onUpdate` which wraps RTK Query `mutation.unwrap()` + error handling.

---

## API Endpoints

| Entity | Base URL | RTK Query hooks | Tags |
|--------|----------|-----------------|------|
| Product | `/api/admin/products` | `useGetAdminProductsQuery` etc. | `['Product']` |
| Recipe *mock* | `/api/admin/recipes` | `useGetAdminRecipesQuery` | `['Recipe']` |
| News *mock* | `/api/admin/news` | `useGetAdminNewsQuery` | `['News']` |
| Store *mock* | `/api/admin/stores` | `useGetAdminStoresQuery` | `['Store']` |
| Role | `/api/admin/roles` | `useGetAdminRolesQuery` | `['Role']` |
| User | `/api/admin/users` | `useGetAdminUsersQuery` | `['User']` |
| Quote | `/api/admin/quotes` | `useGetAdminQuotesQuery` | `['Quote']` |

*Real* endpoints already connect to PostgreSQL via Prisma; mock endpoints rely on MSW handlers.

### providesTags / invalidatesTags rules

1. **Query** endpoints must specify `providesTags: (r) => [...]` mapping ids.
2. **Mutation** endpoints must invalidate the corresponding tag.

This ensures automatic cache refetch and up-to-date grids.

---

## Development Guidelines

1. **Type Safety Only** – no `any`, `unknown`, `@ts-ignore`.
2. All domain types live in `@/types/admin/*` and must be reused in components & tests.
3. Use `resolveMutation` helper to unwrap conditionally for both async thunk and mutation.
4. Re-export all hooks from `@/redux/api` for simplified imports.
5. Add integration tests for every new grid page (see `admin/roles` tests for reference).

---

_Last updated: 2025-07-10*
