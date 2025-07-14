// Helper to emit events from API Routes without importing socket.io everywhere
// It relies on the Socket.IO server instance created in `pages/api/socket.ts`
// The instance is stored on the global object to be accessible application-wide.

import type { Server as IOServer } from 'socket.io';
import type { TagDescription } from '@reduxjs/toolkit/query';
import type { emptySplitApi } from '@/redux/api';

export type InvalidatePayload = {
  tags: Array<TagDescription<typeof emptySplitApi>>;
  message?: string;
};

export function emitInvalidate(payload: InvalidatePayload): void {
  const io: IOServer | undefined = (global as unknown as { io?: IOServer }).io;
  if (!io) return;
  io.emit('invalidate', payload);
}
