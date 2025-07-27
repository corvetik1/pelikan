import { useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';

/**
 * Extracts a session token stored in a cookie (e.g. `session=<jwt>`).
 * Returns undefined if cookie not found or running on the server.
 */
const getSessionToken = (): string | undefined => {
  if (typeof document === 'undefined') return undefined;
  const pair = document.cookie.split('; ').find((c) => c.startsWith('session='));
  return pair?.split('=')[1];
};

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
        // Retry strategy – 5 attempts, exponential back-off up to 5 s
        reconnectionAttempts: 5,
        reconnectionDelayMax: 5000,
        auth: {
          token: getSessionToken() ?? '',
        },
      });

      // Expose socket globally for e2e tests (non-production only)
      if (typeof window !== 'undefined') {
        (window as typeof window & { __socket__?: Socket }).__socket__ = socketRef.current;
      }

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
