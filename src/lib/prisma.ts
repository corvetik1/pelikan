import { PrismaClient } from '@prisma/client';

// Global singleton to avoid exhausting database connections in development with hot reloads
const globalForPrisma = global as unknown as {
  prisma?: PrismaClient;
};

export const prisma: PrismaClient =
  globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

export default prisma;
