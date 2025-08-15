/*
  Warnings:

  - A unique constraint covering the columns `[slug]` on the table `News` will be added. If there are existing duplicate values, this will fail.
  - We add `slug` as NULL first, backfill values, then enforce NOT NULL to avoid issues with existing rows.

*/
-- AlterTable
ALTER TABLE "News" ADD COLUMN "img" TEXT NULL;
ALTER TABLE "News" ADD COLUMN "slug" TEXT NULL;

-- Backfill slug from title (latinize by regex: keep a-z0-9, replace others with '-')
-- Note: for non-latin titles this may produce empty string; fallback to id below
UPDATE "News"
SET "slug" = NULLIF(regexp_replace(lower("title"), '[^a-z0-9]+', '-', 'g'), '');

-- Fallback: where slug is NULL or empty, use id temporarily to satisfy NOT NULL + UNIQUE
UPDATE "News"
SET "slug" = "id"
WHERE "slug" IS NULL OR "slug" = '';

-- AlterTable
ALTER TABLE "Settings" ADD COLUMN     "contacts" JSONB NOT NULL DEFAULT '[]',
ADD COLUMN     "heroSpeedMs" INTEGER NOT NULL DEFAULT 5000,
ADD COLUMN     "logoUrl" TEXT,
ADD COLUMN     "socials" JSONB NOT NULL DEFAULT '[]';

-- CreateIndex
CREATE UNIQUE INDEX "News_slug_key" ON "News"("slug");

-- Enforce NOT NULL after backfill
ALTER TABLE "News" ALTER COLUMN "slug" SET NOT NULL;
