import { NextResponse } from 'next/server';

// Simple health check endpoint used by Docker healthcheck.
// Returns 200 OK with minimal JSON payload.
export async function GET(): Promise<Response> {
  return NextResponse.json({ status: 'ok' }, { status: 200 });
}
