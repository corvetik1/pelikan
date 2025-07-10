import prisma from '@/lib/prisma';

// GET /api/b2b/prices – returns current B2B price list from DB
export async function GET() {
  const rows = await prisma.product.findMany({ select: { id: true, price: true } });
  return Response.json(rows, { status: 200 });
}
