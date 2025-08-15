'use client';

import { Provider as ReduxProvider } from 'react-redux';
import { store } from '@/redux/store';
import { ThemeRegistry } from '@/components/ThemeRegistry';
import { useActiveThemeTokens } from '@/hooks/useActiveThemeTokens';
import baseTheme from '@/theme';
import useSocket from '@/hooks/useSocket';
import { emptySplitApi } from '@/redux/api';
import { adminApi } from '@/redux/adminApi';
import { showSnackbar } from '@/redux/snackbarSlice';
import GlobalSnackbar from '@/components/GlobalSnackbar';
import dynamic from 'next/dynamic';
import type { InvalidatePayload } from '@/types/realtime';
import type { ThemeOptions, Theme } from '@mui/material/styles';

const AxeAccessibility = dynamic(() => import('@/components/dev/AxeAccessibility'), { ssr: false });
import { AuthProvider, useAuth } from '@/context/AuthContext';
import { setUser } from '@/redux/authSlice';
import React from 'react';

function ProvidersInner({ children, initialTokens }: { children: React.ReactNode; initialTokens?: ThemeOptions | Theme }) {
  const { user } = useAuth();
  React.useEffect(() => {
    // Sync AuthContext user -> Redux store
    store.dispatch(setUser(user));
  }, [user]);

  const tokens = useActiveThemeTokens();
  const themeTokens: ThemeOptions | Theme = tokens ?? initialTokens ?? baseTheme;
  const socket = useSocket();
  const lastSnackbarRef = React.useRef<number>(0);

  React.useEffect(() => {
    if (!socket) return;
    const handleInvalidate = (payload: InvalidatePayload) => {
      // Invalidate both default slice and admin slice to keep data fresh across tabs/tests
      store.dispatch(emptySplitApi.util.invalidateTags(payload.tags));
      store.dispatch(adminApi.util.invalidateTags(payload.tags));
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
    <ThemeRegistry tokens={themeTokens}>
      {children}
      {process.env.NODE_ENV === 'development' && <AxeAccessibility />}
      <GlobalSnackbar />
    </ThemeRegistry>
  );
}

export default function Providers({ children, initialTokens }: { children: React.ReactNode; initialTokens?: ThemeOptions | Theme }) {
  return (
    <ReduxProvider store={store}>
      <AuthProvider>
        <ProvidersInner initialTokens={initialTokens}>{children}</ProvidersInner>
      </AuthProvider>
    </ReduxProvider>
  );
}
