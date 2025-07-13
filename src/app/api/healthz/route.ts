import { NextResponse } from 'next/server';

/**
 * Simple liveness probe.
 * GET /api/healthz → { status: 'ok', timestamp: ISO8601 }
 */
export async function GET() {
  return NextResponse.json({ status: 'ok', timestamp: new Date().toISOString() });
}
