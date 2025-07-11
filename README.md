# Pelican Bay Corporate Site – Frontend

Моно-репозиторий (frontend) корпоративного сайта «Бухта пеликанов».

* **Framework**: Next.js 15 (App Router, TypeScript)
* **State / Data**: Redux Toolkit + RTK Query
* **UI-kit**: MUI v5
* **Testing**: Jest 29 + React-Testing-Library + MSW
* **Package manager**: pnpm
* **Node LTS**: ≥ 18

> Бэкенд: CRUD для **roles**, **users**, **products**, **news** и **stores** уже работают на реальной базе (Next.js API Routes + Prisma + PostgreSQL). Для остальных сущностей (recipes) пока остаются MSW-моки.

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

### Useful scripts

| Script | Purpose |
|--------|---------|
| `pnpm migrate` | Выполнить миграции (CI/CD) |
| `pnpm seed` | Заполнить демо-данные |
| `pnpm db:setup` | migrate + seed (локально) |

---

## CI/CD

Frontend собирается и тестируется в GitHub Actions (`.github/workflows/ci.yml`): lint → test → build. При успешной сборке выполняется деплой на Vercel Preview.

## Переменные окружения

Создайте `.env` на основе `.env.example`.

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/pelicanbay"
PORT=3000
NEXT_PUBLIC_API_BASE=""
```
