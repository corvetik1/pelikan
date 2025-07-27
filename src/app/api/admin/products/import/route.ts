import { NextResponse } from 'next/server';
import { withLogger } from '@/lib/logger';
import { requireAdmin } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { z } from 'zod';
import * as XLSX from 'xlsx';
import { slugify } from '@/lib/slugify';
import { getIO } from '@/server/socket';

// Expected columns in the Excel file (case-insensitive RU/EN aliases allowed)
const COLUMN_MAP: Record<string, 'name' | 'price' | 'weight' | 'category'> = {
  name: 'name',
  название: 'name',
  price: 'price',
  цена: 'price',
  weight: 'weight',
  вес: 'weight',
  category: 'category',
  категория: 'category',
};

const RowSchema = z.object({
  name: z.string().trim().min(1).max(256),
  price: z.preprocess((v) => (typeof v === 'string' ? Number(v.replace(/[, ]/g, '')) : v), z.number().positive()),
  weight: z.string().trim().min(1).max(64),
  category: z.string().trim().min(1).max(64),
});

export const POST = withLogger(async (request: Request) => {
  const auth = requireAdmin(request);
  if (auth) return auth;

  const formData = await request.formData();
  const file = formData.get('file');
  if (!file || !(file as Blob).arrayBuffer) {
    return NextResponse.json({ errors: ['Файл не найден'] }, { status: 400 });
  }

  // Read buffer
  const buffer = Buffer.from(await (file as Blob).arrayBuffer());
  // Parse workbook (first sheet)
  const workbook = XLSX.read(buffer, { type: 'buffer' });
  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];
  const rawRows: Record<string, unknown>[] = XLSX.utils.sheet_to_json(sheet, { defval: '' });

  let imported = 0;
  const errors: string[] = [];
  type UpsertArgs = Parameters<typeof prisma.product.upsert>[0];
  const upserts: UpsertArgs[] = [];

  rawRows.forEach((row, idx) => {
    // normalise keys to expected names
    const normalized: Record<'name' | 'price' | 'weight' | 'category', unknown> = {
      name: '',
      price: 0,
      weight: '',
      category: '',
    };

    for (const [key, val] of Object.entries(row)) {
      const mapped = COLUMN_MAP[key.toLowerCase()];
      if (mapped) normalized[mapped] = val;
    }

    try {
      const parsed = RowSchema.parse(normalized);
      const slug = slugify(parsed.name);
      upserts.push({
        where: { slug },
        create: { ...parsed, slug, img: '', description: '' },
        update: { ...parsed, img: '', description: '' },
      });
      imported += 1;
    } catch (e) {
      errors.push(`Строка ${idx + 2}: ${(e as Error).message}`); // +2 considering header and 0-idx
    }
  });

  // Perform transaction
  if (upserts.length) {
    await prisma.$transaction(async (tx) => {
      for (const u of upserts) {
        await tx.product.upsert(u);
      }
    });
  }

  // Notify clients
  getIO()?.emit('invalidate', {
    tags: [{ type: 'AdminProduct', id: 'LIST' }],
    message: `Импортировано товаров: ${imported}`,
  });

  return NextResponse.json({ imported, errors });
});
