import { NextResponse } from 'next/server';

/**
 * Simple liveness probe.
 * GET /api/healthz → { status: 'ok', timestamp: ISO8601 }
 */
import { withLogger } from '@/lib/logger';

export const GET = withLogger(async (req: Request) => {
  // Touch req to avoid unused var lint
  void req.method;
  return NextResponse.json({ status: 'ok', timestamp: new Date().toISOString() });
});
