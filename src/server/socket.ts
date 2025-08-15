import { Server as IOServer } from 'socket.io';
import type { Server as HTTPServer } from 'http';
import type { InvalidateTags, InvalidatePayload } from '@/types/realtime';

// We keep Socket.IO server instance in the global scope to avoid
// creating multiple servers when Next.js hot-reloads API routes.
declare global {
  var io: IOServer | undefined;
}

export function initSocket(server: HTTPServer): IOServer {
  if (globalThis.io) {
    return globalThis.io;
  }

  const io = new IOServer(server, {
    path: '/api/socket',
    addTrailingSlash: false,
    cors: {
      origin: '*', // in production better specify exact domain
      methods: ['GET', 'POST']
    }
  });

  io.on('connection', (socket) => {
    // You can add auth / rooms etc. here later
    
    console.log('[socket] client connected', socket.id);

    socket.on('disconnect', (reason) => {
      
      console.log('[socket] disconnect', socket.id, reason);
    });
  });

  globalThis.io = io;
  return io;
}

export function broadcastInvalidate(tags: InvalidateTags, message?: string): void {
  const ioInstance = getIO();
  if (!ioInstance) return;
  const payload: InvalidatePayload = { tags, message };
  ioInstance.emit('invalidate', payload);
}

export function getIO(): IOServer | undefined {
  return globalThis.io;
}
