'use client';

import { Provider as ReduxProvider } from 'react-redux';
import { store } from '@/redux/store';
import ThemeRegistry from '@/theme/ThemeRegistry';
import { AuthProvider } from '@/context/AuthContext';
import React from 'react';

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ReduxProvider store={store}>
      <AuthProvider>
        <ThemeRegistry>{children}</ThemeRegistry>
      </AuthProvider>
    </ReduxProvider>
  );
}
