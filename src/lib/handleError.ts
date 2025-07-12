import { NextResponse } from 'next/server';
import { ZodError } from 'zod';

export function handleError(error: unknown) {
  if (error instanceof ZodError) {
    return NextResponse.json({ error: error.issues }, { status: 422 });
  }
  if (error instanceof Error) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ error: 'Unknown error' }, { status: 500 });
}
