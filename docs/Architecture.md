# Архитектура фронтенда «Бухта пеликанов»

Документ описывает высокоуровневую структуру и основные технологии клиентской части проекта.

## Слои и ответственность

| Слой | Папка | Технологии | Ответственность |
|------|-------|------------|-----------------|
| Presentation | `src/components` | React 18, MUI 5 | UI-компоненты (Server/Client), аксессоры к состоянию, композиция UI |
| State / Data | `src/redux`, `src/data` | Redux Toolkit, RTK Query | Глобальное состояние, асинхронные запросы, кэш данных |
| Routing | `src/app` | Next.js 15 App Router | Декларативные маршруты, сегменты, metadata |
| Pages / Features | `src/app/*`, `src/components/*` | React, MUI | Фичи, страницы, бизнес-логика |
| API Mock | `tests/msw` | MSW | Изоляция от бэкенда в тестах |

## Поток данных

UI ↔ Redux hooks ↔ RTK Query baseQuery → /api/* (Next API Route) → Prisma → PostgreSQL

* Во время разработки бэкенд заменён MSW-моками (те же URL), поэтому UI не требует изменений.

## SSR / ISR / CSR

* **SSR** – динамические страницы (админка) рендерятся на сервере.
* **ISR** – публичные каталожные страницы (`/products/[id]`) регенерируются каждые *N* минут.
* **CSR** – интерактивные виджеты (B2B калькулятор) работают на клиенте.

## Тестирование

* **Jest + RTL** – unit / integration.
* **MSW** – перехват API-запросов; `resetMocks()` очищает in-memory БД между тестами.
* Все тесты выполняются командой `pnpm test` и должны быть зелёными перед push.

## Структура каталогов (сокращённо)

├── src
│   ├── app          # Next.js маршруты (App Router)
│   ├── components   # Переиспользуемые UI-компоненты
│   ├── redux        # Стори, слайсы, RTK Query API
│   ├── data         # Mock-данные до подключения реальной БД
│   └── types        # Общие интерфейсы TypeScript
├── tests            # Тесты + MSW-хендлеры
└── docs             # Документация (этот файл, ADR-ы и т. д.)

## Linting & Type-safety

* ESLint + `@typescript-eslint` строго запрещают `any / unknown / @ts-ignore`.
* CI запускает `pnpm lint`, `pnpm test`, `pnpm build`.

## TODO (серверная часть)

* Внедрить Prisma schema, заполнить миграции, подключить реальные API Routes.
* Перевести MSW-моки на реальные эндпоинты без изменений UI.
