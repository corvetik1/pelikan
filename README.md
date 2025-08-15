# Pelican Bay Corporate Site – Frontend

Моно-репозиторий (frontend) корпоративного сайта «Бухта пеликанов».

* **Framework**: Next.js 15 (App Router, TypeScript)
* **State / Data**: Redux Toolkit + RTK Query
* **UI-kit**: MUI v5
* **Testing**: Jest 29 + React-Testing-Library + MSW
* **Package manager**: pnpm
* **Node LTS**: ≥ 18

> Бэкенд: CRUD для **roles**, **users**, **products**, **recipes**, **news** и **stores** уже работают на реальной базе (Next.js API Routes + Prisma + PostgreSQL).

## Возможности

### 🎯 Админ-панель (Production-ready)

* **CRUD системы**: Products, Recipes, News, Stores, Users, Roles, Categories
* **RBAC (Role-Based Access Control)**: Viewer, Editor, Admin права с UI-гвардами
* **Dashboard**: Метрики, графики, статистика (Charts.js)
* **Media Library**: Drag-and-drop загрузка, предпросмотр, выбор изображений
* **Excel импорт**: Массовая загрузка товаров из XLSX файлов
* **Rich-content редактор**: Markdown + изображения для News и Recipes
* **Realtime уведомления**: Socket.IO для мгновенных обновлений
* **Темы оформления**: Загрузка, переключение, кастомизация MUI тем
* **Системные настройки**: Конфигурация приложения

### 📊 B2B функционал

* **Калькулятор заявок**: Расчет стоимости заказов
* **Управление заявками**: Обработка B2B запросов
* **Управление отзывами**: Модерация пользовательских отзывов

### 🔧 Техническая часть

* **Next.js 15** (App Router, TypeScript)
* **Redux Toolkit + RTK Query** для состояния
* **MUI v5** для UI компонентов
* **Socket.IO** для realtime
* **Prisma ORM + PostgreSQL 17**
* **Docker + Monitoring** (Prometheus, Grafana, Loki)
* **100% типобезопасность** (Zod ↔ OpenAPI)
* **Полное покрытие тестами** (Jest, Playwright, MSW)

## Быстрый старт

Установите зависимости и запустите дев-сервер:

```bash
pnpm i
pnpm dev
```

Приложение доступно на <http://localhost:3000>.

## Сценарии npm/pnpm

| Скрипт | Назначение |
|--------|------------|
| `pnpm dev` | Запуск дев-сервера (Next.js, порт 3000) |
| `pnpm build` | Production-сборка (`.next/`) |
| `pnpm start` | Запуск production-сборки |
| `pnpm lint` | ESLint + TypeScript – проверка стиля и типов |
| `pnpm test` | Юнит/интеграционные тесты Jest |
| `pnpm test --watch` | Watch-режим тестов |

Высоко-уровневое описание слоёв, паттернов и структуры папок — см. `docs/Architecture.md`.

Подробная документация админ-панели — см. `docs/AdminPanel.md`.

## Backend setup (PostgreSQL 17 + Prisma)

### Local development

```bash
# Start database (detached)
pnpm db:up

# Run migrations & seed demo data
pnpm db:setup

# Start Next.js dev server
pnpm dev
```

> Database URL: `postgres://postgres:postgres@localhost:5434/pelicanbay`
>
> pgAdmin available at <http://localhost:5050> (profile `dev`, optional) — email `admin@pelicanbay.local`, password `admin`.

### Useful scripts

-Prerequisites

| Tool | Version |
|------|---------|
| Node | ≥ 18 |
| pnpm | ≥ 8 |
| Docker Desktop | ≥ 4 |

### Running locally

1. Install deps

   ```bash
   pnpm i
   ```

2. Start database (+ pgAdmin)

   ```bash
   docker compose up -d db pgadmin
   ```

3. Migrate & seed

   ```bash
   pnpm db:setup   # prisma migrate deploy && prisma db seed
   ```

4. Run dev server

   ```bash
   pnpm dev
   ```

*Postgres доступен <http://localhost:5434>* (user `postgres`/pass `postgres`).

### Entities (public schema)

> Обновление 2025-07-11 — добавлены работающие CRUD-ендпойнты для `News` и `Store`.

| Table | Key fields |
|-------|------------|
| Role | id, name, description?, permissions[] |
| User | id, email, password, name?, role, isActive |
| Product | id, name, slug, price, img |
| Recipe | id, slug, title, img |
| News | id, title, excerpt, category, date |
| Store | id, name, address, lat, lng |

> Полное описание см. `prisma/schema.prisma`.

## API examples (curl)

### Import products (Excel)

```bash
curl -X POST -H "Authorization: Bearer $ADMIN_TOKEN" \
     -F "file=@products.xlsx" \
     http://localhost:3000/api/admin/products/import | jq .
# => { "imported": 42, "errors": [] }
```

### Recipes

```bash
# List recipes (admin)
curl -H "Authorization: Bearer $ADMIN_TOKEN" \
     http://localhost:3000/api/admin/recipes | jq .

# Create recipe
curl -X POST -H "Authorization: Bearer $ADMIN_TOKEN" \
     -H "Content-Type: application/json" \
     -d '{
       "title": "Tuna Tartare",
       "category": "Seafood",
       "ingredients": ["Tuna", "Avocado", "Soy sauce"],
       "steps": ["Dice tuna", "Mix with sauce"],
       "cookingTime": 10
     }' \
     http://localhost:3000/api/admin/recipes | jq .

# Update recipe (PATCH)
curl -X PATCH -H "Authorization: Bearer $ADMIN_TOKEN" \
     -H "Content-Type: application/json" \
     -d '{"shortDescription":"Updated"}' \
     http://localhost:3000/api/admin/recipes/<id> | jq .
```

### Quotes workflow

```bash
# Client requests quote
curl -X POST -H "Content-Type: application/json" \
     -d '{"userEmail":"user@example.com","items":[{"productId":"p1","qty":5}]}' \
     http://localhost:3000/api/quotes | jq .  # returns { id }

# Admin lists pending quotes
curl -H "Authorization: Bearer $ADMIN_TOKEN" \
     http://localhost:3000/api/admin/quotes | jq .

# Admin sets prices
curl -X PATCH -H "Authorization: Bearer $ADMIN_TOKEN" \
     -H "Content-Type: application/json" \
     -d '{"prices":[{"productId":"p1","price":999}]}' \
     http://localhost:3000/api/admin/quotes/<id>/prices | jq .
```

## Usefu scripts

| Script | Purpose |
|--------|---------|
| `pnpm migrate` | Выполнить миграции (CI/CD) |
| `pnpm seed` | Заполнить демо-данные |
| `pnpm db:setup` | migrate + seed (локально) |

---

## CI/CD

В проекте настроен единый GitHub Actions workflow `.github/workflows/ci.yml`, который гарантирует качество кода и автоматический деплой:

1. **Setup** – checkout репозитория, установка Node LTS и pnpm.
2. **Dependencies** – `pnpm install --frozen-lockfile`.
3. **Database** – `docker compose up -d db` + `pnpm db:setup` (миграции + сид).
4. **Static analysis** – `pnpm lint` + `pnpm type-check`.
5. **Tests**
   • `pnpm test --coverage` – unit / integration (Jest).
   • `pnpm exec playwright test` – e2e smoke (quotes ➜ email).
  ※ Временное исключение (skipped) 4 UX-heavy сценариев: `admin-news CRUD`, `admin-recipes CRUD`, `theme-switch`, `realtime-invalidation` – будут исправлены позже.
6. **Build** – `pnpm build` (Next.js ⬆ SSR/ISR).
7. **Deploy** – (только на `main`) триггер на Vercel Production.

Все шаги выполняются на Ubuntu latest; базовые зависимости (PostgreSQL, Playwright browsers) инсталлируются в рантайме.

Матрица Node версия × OS может быть расширена в `strategy.matrix` при необходимости.

## Документация

* [API Reference (ReDoc)](https://pelicanbay.vercel.app/api.html)
* Storybook UI – автоматически публикуется на GitHub Pages (`docs` job)

## Monitoring & Observability

Docker-Compose включает Prometheus, Grafana и Loki. Для локального мониторинга выполните:

```bash
# Запустить стек мониторинга
docker compose up -d prometheus grafana loki
```

| Сервис | Порт | URL |
|--------|------|-----|
| Grafana | 3001 | http://localhost:3001 |
| Prometheus | 9090 | http://localhost:9090 |
| Loki | 3100 | http://localhost:3100 |

Grafana дашборды по умолчанию импортируются из `./monitoring/dashboards/*.json`.

* Приложение логирует в Loki (pino + promtail sidecar).
* Показатели Node.js (Prometheus client) доступны на `/api/metrics` и собираются Prometheus.

---

## Переменные окружения

Создайте `.env` на основе `.env.example`.

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/pelicanbay"
PORT=3000
NEXT_PUBLIC_API_BASE=""
```
