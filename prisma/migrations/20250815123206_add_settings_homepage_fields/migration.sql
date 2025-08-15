-- CreateEnum
CREATE TYPE "SubscriptionStatus" AS ENUM ('subscribed', 'unsubscribed', 'bounced');

-- AlterTable
ALTER TABLE "Settings" ADD COLUMN     "ctaSubtitle" TEXT,
ADD COLUMN     "ctaTitle" TEXT,
ADD COLUMN     "homeNewsTitle" TEXT,
ADD COLUMN     "homeRecipesTitle" TEXT,
ADD COLUMN     "priceListUrl" TEXT;

-- CreateTable
CREATE TABLE "Subscriber" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "status" "SubscriptionStatus" NOT NULL DEFAULT 'subscribed',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "confirmedAt" TIMESTAMP(3),

    CONSTRAINT "Subscriber_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Subscriber_email_key" ON "Subscriber"("email");
