import { useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import type { ServerToClientEvents, ClientToServerEvents, InvalidatePayload } from '@/types/realtime';
import { store } from '@/redux/store';
import { emptySplitApi } from '@/redux/api';
import { showSnackbar } from '@/redux/snackbarSlice';

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
export const useSocket = (): Socket<ServerToClientEvents, ClientToServerEvents> | null => {
  const socketRef = useRef<Socket<ServerToClientEvents, ClientToServerEvents> | null>(null);
  const testListenerRef = useRef<EventListener | null>(null);

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
      }) as Socket<ServerToClientEvents, ClientToServerEvents>;

      // Wire realtime invalidation → RTK Query + global snackbar
      const handleInvalidate = (payload: InvalidatePayload): void => {
        store.dispatch(emptySplitApi.util.invalidateTags(payload.tags));
        if (payload.message && payload.message.trim().length > 0) {
          store.dispatch(showSnackbar({ message: payload.message, severity: 'success' }));
        }
      };
      socketRef.current.on('invalidate', handleInvalidate);

      // In non-production, allow tests to simulate server invalidate via CustomEvent
      if (typeof window !== 'undefined' && process.env.NODE_ENV !== 'production') {
        const testListener: EventListener = (ev: Event): void => {
          const ce = ev as CustomEvent<InvalidatePayload>;
          if (ce.detail) handleInvalidate(ce.detail);
        };
        window.addEventListener('test-invalidate', testListener);
        testListenerRef.current = testListener;
      }

      // Expose socket globally for e2e tests (non-production only)
      if (typeof window !== 'undefined') {
        (window as typeof window & { __socket__?: Socket<ServerToClientEvents, ClientToServerEvents> }).__socket__ = socketRef.current;
      }

    }
    const current = socketRef.current;
    return () => {
      current?.off('invalidate');
      // Remove test listener if present
      if (typeof window !== 'undefined' && testListenerRef.current) {
        window.removeEventListener('test-invalidate', testListenerRef.current);
        testListenerRef.current = null;
      }
      current?.disconnect();
      socketRef.current = null;
    };
  }, []);

  return socketRef.current;
};

export default useSocket;
