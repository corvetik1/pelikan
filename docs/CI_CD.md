# CI/CD Pipeline – Pelican Bay

Этот документ описывает автоматический процесс проверки и деплоя монорепозитория (Next.js 15 + Prisma) в GitHub Actions.

## Обзор jobs

| Job | Trigger | Цель |
|-----|---------|------|
| `build` | push / PR | Линт, типизация, unit/integration и e2e-тесты, сборка приложения |
| `deploy` | после успешного `build` на `main` | Продакшен-деплой на Vercel (frontend + backend API Routes) |

## build

```yaml
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v2
        with:
          version: 8
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'pnpm'
      - run: pnpm install --frozen-lockfile
      - name: Start PostgreSQL
        run: docker compose up -d db
      - name: Prepare DB (migrate + seed)
        run: pnpm db:setup
      - run: pnpm lint
      - run: pnpm run type-check
      - run: pnpm test --coverage
      - run: pnpm exec playwright install --with-deps
      - run: pnpm exec playwright test --reporter=line
      - run: pnpm build
```

## docs (story / api)

```yaml
  docs:
    needs: build
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v2
        with:
          version: 8
      - run: pnpm install --frozen-lockfile
      - name: Build Storybook & API docs
        run: |
          pnpm docs:build   # storybook-static + typedoc
          pnpm exec redoc-cli bundle docs/openapi.json -o public/api.html
      - uses: actions/upload-pages-artifact@v3
        with:
          path: public
```

## deploy

```yaml
  deploy:
    if: github.ref == 'refs/heads/main'
    needs: build
    runs-on: ubuntu-latest
    steps:
      - uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          github-token: ${{ secrets.GITHUB_TOKEN }}
          prod: true
```

> ⚠️ Секреты (`VERCEL_TOKEN`, `VERCEL_ORG_ID`, `VERCEL_PROJECT_ID`) добавляются в **Settings → Secrets and variables → Actions**.

## Локальный прогон полного пайплайна

```bash
pnpm dlx turbo run full-check
```

Команда выполняет lint → type-check → unit/integration → e2e → build и эмулирует CI-процесс.

## Стратегия ветвления

* `main` — production-ветка, защищена, деплой после успешного CI.
* `feat/*` — feature-ветки, создают PR с предварительным Vercel Preview.
* `hotfix/*` — критические исправления, мержатся напрямую в `main` после ревью и CI.

## Loki structured logging

Приложение и Nginx-контейнеры настроены на драйвер `loki`:

```yaml
env:
  LOKI_URL: http://loki:3100/loki/api/v1/push
logging:
  driver: loki
  options:
    loki-url: ${LOKI_URL}
    loki-retries: "3"
    loki-batch-size: "400"
```

Логи доступны в Grafana Explore (label `service=pelican-app`).

## Расширение матрицы

Для проверки на нескольких версиях Node/OS добавьте:

```yaml
strategy:
  matrix:
    os: [ubuntu-latest, windows-latest]
    node: [18, 20]
```

---

Последнее обновление: 2025-07-22
