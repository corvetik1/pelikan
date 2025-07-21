import { useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';

/**
 * Provides a singleton Socket.IO client instance connected to `/api/socket`.
 * Disconnects automatically on unmount.
 */
export const useSocket = (): Socket | null => {
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    if (!socketRef.current) {
      // Ensure the Socket.IO server is initialised (important in dev to avoid first-connect 404)
      // We don't await this request – it's fire-and-forget.
      fetch('/api/socket').catch(() => {/* ignore */});

      socketRef.current = io({
        path: '/api/socket',
        transports: ['websocket'],
      });
    }
    const current = socketRef.current;
    return () => {
      current?.disconnect();
      socketRef.current = null;
    };
  }, []);

  return socketRef.current;
};

export default useSocket;
