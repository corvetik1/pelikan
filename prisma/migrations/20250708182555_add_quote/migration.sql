-- CreateEnum
CREATE TYPE "QuoteStatus" AS ENUM ('pending', 'priced', 'rejected');

-- CreateTable
CREATE TABLE "Quote" (
    "id" TEXT NOT NULL,
    "items" JSONB NOT NULL,
    "prices" JSONB,
    "status" "QuoteStatus" NOT NULL DEFAULT 'pending',
    "userEmail" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Quote_pkey" PRIMARY KEY ("id")
);
