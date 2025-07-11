# REST API – Pelican Bay Backend

> Версия: `v1` (Next.js API Routes + Prisma)

Базовый префикс: `/api`

## Аутентификация

— JWT-токен в `Authorization: Bearer <token>` для защищённых (админских) эндпоинтов.  
— Получение токена (WIP): `/api/auth/login`.

## Общие правила

* Все ответы — JSON `{ data, error? }`;
* Ошибки завернуты в `{ error: { code, message } }` с HTTP-кодом;
* Валидация через Zod; при ошибке — `400`.
* RBAC проверяется утилитой `requireAdmin()`.
* Пагинация (для списков >100 записей) — query-параметры `page`, `limit` (default 1/20).

---

## Сущности и эндпоинты

| Entity | Route | Methods | Auth | Tags (RTK) |
|--------|-------|---------|------|------------|
| Role | `/admin/roles` | `GET, POST` | admin | `['Role']` |
| Role (single) | `/admin/roles/[id]` | `PATCH, DELETE` | admin |  |
| User | `/admin/users` | `GET, POST` | admin | `['User']` |
| User (single) | `/admin/users/[id]` | `PATCH, DELETE` | admin | |
| Product | `/admin/products` | `GET, POST` | admin | `['Product']` |
| Product (single) | `/admin/products/[id]` | `PATCH, DELETE` | admin | |
| Recipe | `/admin/recipes` | `GET, POST` | admin | `['Recipe']` |
| Recipe (single) | `/admin/recipes/[id]` | `PATCH, DELETE` | admin | |
| News | `/admin/news` | `GET, POST` | admin | `['News']` |
| News (single) | `/admin/news/[id]` | `PATCH, DELETE` | admin | |
| Store | `/admin/stores` | `GET, POST` | admin | `['Store']` |
| Store (single) | `/admin/stores/[id]` | `PATCH, DELETE` | admin | |
| Quote | `/quotes` | `POST` | public | `['Quote']` |
| Quote | `/quotes/[id]` | `GET` | public (owner) | |
| Quote prices | `/admin/quotes/[id]/prices` | `PATCH` | admin | `['Quote']` |

---

## Примеры запросов

### Создать рецепт

`POST /api/admin/recipes`

```jsonc
{
  "title": "Салат из морской капусты",
  "slug": "seaweed-salad",
  "category": "salad",
  "cookingTime": 15,
  "shortDescription": "Полезный витаминный салат",
  "ingredients": ["Морская капуста", "Кунжутное масло"],
  "steps": ["Промыть капусту", "Заправить маслом"],
  "images": ["/images/recipes/seaweed.jpg"],
  "productIds": ["prod_123"]
}
```

Успех `201` → `{ data: Recipe }`.

### Обновить цены на заявку

`PATCH /api/admin/quotes/quote_123/prices`

```jsonc
{
  "items": [
    { "id": "item_1", "price": 12.4 },
    { "id": "item_2", "price": 5 }
  ]
}
```

Ответ `200` + email-уведомление клиенту.

---

## Prisma Schema additions

```prisma
model Recipe {
  id            String   @id @default(cuid())
  slug          String   @unique
  title         String
  category      String
  cookingTime   Int
  shortDescription String
  ingredients   String[]
  steps         String[]
  images        String[]
  productIds    String[]
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
}

model News {
  id       String   @id @default(cuid())
  slug     String   @unique
  title    String
  excerpt  String
  content  String
  category String
  date     DateTime
  img      String
}

model Store {
  id       String   @id @default(cuid())
  name     String
  region   String
  address  String
  lat      Float
  lng      Float
  isActive Boolean @default(true)
}
```

Миграция: `npx prisma migrate dev -n add_recipe_news_store`.

---

## RTK Query hooks

Файл `src/redux/api.ts`:

```ts
export const api = createApi({
  baseQuery: fetchBaseQuery({ baseUrl: '/api', fetchFn }),
  tagTypes: ['Role','User','Product','Recipe','News','Store','Quote'],
  endpoints: (builder) => ({
    getAdminRecipes: builder.query<AdminRecipe[], void>({
      query: () => 'admin/recipes',
      providesTags: ['Recipe'],
    }),
    createRecipe: builder.mutation<AdminRecipe, Partial<AdminRecipe>>({
      query: (body) => ({ url: 'admin/recipes', method: 'POST', body }),
      invalidatesTags: ['Recipe'],
    }),
    // ...и т.д. для News, Store
  }),
});
```

---

## Todo

* [ ] Реализовать API Routes для `recipes`, `news`, `stores` (по образцу `products`)

* [ ] Добавить Zod-схемы в `src/lib/validation` и централизованный `handleError`

* [ ] Написать Prisma миграцию и обновить seed

* [ ] Дописать RTK hooks и обновить админские страницы на real API

* [ ] Покрыть интеграционными тестами MSW → real API switch

_Обновлено: 2025-07-11*
