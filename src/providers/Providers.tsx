'use client';

import { Provider as ReduxProvider } from 'react-redux';
import { store } from '@/redux/store';
import ThemeRegistry from '@/theme/ThemeRegistry';
import useSocket from '@/hooks/useSocket';
import { emptySplitApi } from '@/redux/api';
import { showSnackbar } from '@/redux/snackbarSlice';
import GlobalSnackbar from '@/components/GlobalSnackbar';
import { AuthProvider } from '@/context/AuthContext';
import React from 'react';

export default function Providers({ children }: { children: React.ReactNode }) {
    const socket = useSocket();

  React.useEffect(() => {
    if (!socket) return;
    const handleInvalidate = (
      payload: {
        tags: Parameters<typeof store.dispatch>[0] extends infer D
          ? D extends ReturnType<typeof emptySplitApi.util.invalidateTags>
            ? Parameters<typeof emptySplitApi.util.invalidateTags>[0]
            : never
          : never;
        message?: string;
      }
    ) => {
      store.dispatch(emptySplitApi.util.invalidateTags(payload.tags));
      if (payload.message) {
        store.dispatch(showSnackbar({ message: payload.message, severity: 'success' }));
      }
    };
    socket.on('invalidate', handleInvalidate);
    return () => {
      socket.off('invalidate', handleInvalidate);
    };
  }, [socket]);

  return (
    <ReduxProvider store={store}>
      <AuthProvider>
        <ThemeRegistry>
          {children}
          <GlobalSnackbar />
        </ThemeRegistry>
      </AuthProvider>
    </ReduxProvider>
  );
}
