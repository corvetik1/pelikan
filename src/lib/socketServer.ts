// Helper to emit invalidate events without importing socket.io everywhere
// We reuse the singleton from `src/server/socket.ts` to avoid duplicate servers.
import { getIO } from '@/server/socket';
import type { InvalidatePayload } from '@/types/realtime';

export function emitInvalidate(payload: InvalidatePayload): void {
  const io = getIO();
  if (!io) return;
  io.emit('invalidate', payload);
}
