'use client';

import { Provider as ReduxProvider } from 'react-redux';
import { store } from '@/redux/store';
import { ThemeRegistry } from '@/components/ThemeRegistry';
import { useActiveThemeTokens } from '@/hooks/useActiveThemeTokens';
import baseTheme from '@/theme';
import useSocket from '@/hooks/useSocket';
import { emptySplitApi } from '@/redux/api';
import { showSnackbar } from '@/redux/snackbarSlice';
import GlobalSnackbar from '@/components/GlobalSnackbar';
import dynamic from 'next/dynamic';

const AxeAccessibility = dynamic(() => import('@/components/dev/AxeAccessibility'), { ssr: false });
import { AuthProvider } from '@/context/AuthContext';
import React from 'react';

function ProvidersInner({ children, initialTokens }: { children: React.ReactNode; initialTokens?: Record<string, unknown> }) {
  const tokens = useActiveThemeTokens();
  const themeTokens = tokens ?? initialTokens ?? baseTheme;
  const socket = useSocket();
  const lastSnackbarRef = React.useRef<number>(0);

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
      },
    ) => {
      store.dispatch(emptySplitApi.util.invalidateTags(payload.tags));
      if (payload.message) {
        const now = Date.now();
        if (now - lastSnackbarRef.current > 1000) {
          lastSnackbarRef.current = now;
          store.dispatch(showSnackbar({ message: payload.message, severity: 'success' }));
        }
      }
    };
    socket.on('invalidate', handleInvalidate);
    return () => {
      socket.off('invalidate', handleInvalidate);
    };
  }, [socket]);

  return (
    <AuthProvider>
      <ThemeRegistry tokens={themeTokens as Record<string, unknown>}>
        {children}
        {process.env.NODE_ENV === 'development' && <AxeAccessibility />}
        <GlobalSnackbar />
      </ThemeRegistry>
    </AuthProvider>
  );
}

export default function Providers({ children, initialTokens }: { children: React.ReactNode; initialTokens?: Record<string, unknown> }) {
  return (
    <ReduxProvider store={store}>
      <ProvidersInner initialTokens={initialTokens}>{children}</ProvidersInner>
    </ReduxProvider>
  );
}
