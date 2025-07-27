import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

export async function GET() {
  // TODO: Replace mock with real database queries once Prisma models are ready
  const data = {
    counts: {
      products: 125,
      news: 36,
      recipes: 58,
      reviewsPending: 7,
    },
    revenueSeries: Array.from({ length: 30 }).map((_, idx) => {
      const date = new Date();
      date.setDate(date.getDate() - (29 - idx));
      return { date: date.toISOString().slice(0, 10), value: Math.round(Math.random() * 1000 + 500) };
    }),
    topProducts: [
      { name: 'Филе лосося', sales: 321 },
      { name: 'Тунец стейк', sales: 287 },
      { name: 'Палтус', sales: 243 },
      { name: 'Форель', sales: 189 },
      { name: 'Скумбрия', sales: 156 },
    ],
    recentOrders: [],
    recentReviews: [],
  };

  return NextResponse.json(data);
}
