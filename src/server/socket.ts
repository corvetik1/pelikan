import { Server as IOServer } from 'socket.io';
import type { Server as HTTPServer } from 'http';

// We keep Socket.IO server instance in the global scope to avoid
// creating multiple servers when Next.js hot-reloads API routes.

const g = globalThis as unknown as { io?: IOServer };

export function initSocket(server: HTTPServer): IOServer {
  if (g.io) {
    return g.io;
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

  g.io = io;
  return io;
}

export function broadcastInvalidate(tags: unknown, message?: string): void {
  const io = getIO();
  if (!io) return;
  io.emit('invalidate', { tags, message });
}

export function getIO(): IOServer | undefined {
  return g.io;
}
