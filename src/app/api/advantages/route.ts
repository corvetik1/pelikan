import { NextResponse } from 'next/server';
import { withLogger } from '@/lib/logger';
import { handleError } from '@/lib/errorHandler';
import { getAdvantages } from '@/lib/data/advantages';
import { advantageListSchema } from '@/lib/validation/advantagesSchema';

export const GET = withLogger(async (): Promise<Response> => {
  try {
    const list = await getAdvantages();
    const data = advantageListSchema.parse(list);
    return NextResponse.json(data);
  } catch (err) {
    return handleError(err);
  }
});

export const runtime = 'nodejs';
