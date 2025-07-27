"use client";
import { createTheme, CssBaseline, ThemeProvider } from "@mui/material";
import createCache from '@emotion/cache';
import { CacheProvider } from '@emotion/react';
import createEmotionServer from '@emotion/server/create-instance';
import { useServerInsertedHTML } from 'next/navigation';
import { useState } from 'react';
import type { ThemeOptions } from "@mui/material/styles";
import { useMemo, ReactNode } from "react";

export interface ThemeRegistryProps {
  /**
   * MUI-compatible theme tokens (palette, typography, etc.)
   */
  tokens: import("@mui/material").ThemeOptions | Record<string, unknown>;
  children: ReactNode;
}

/**
 * Runtime ThemeProvider that builds a MUI theme from JSON tokens.
 * Strictly typed (no any) – we cast to ThemeOptions expected by createTheme.
 */
export function ThemeRegistry({ tokens, children }: ThemeRegistryProps) {
  // Emotion cache with stable key to ensure style order
  const [cache] = useState(() =>
    createCache({ key: 'mui', prepend: true }),
  );

  // Extract critical CSS on server render
  const { extractCriticalToChunks, constructStyleTagsFromChunks } = createEmotionServer(cache);

  useServerInsertedHTML(() => {
    // Convert Emotion sheet to style tags (only during SSR)
    const chunks = extractCriticalToChunks(cache.sheet.toString());
    return (
      <>{constructStyleTagsFromChunks(chunks)}</>
    );
  });
  const theme = useMemo(() => createTheme(tokens as ThemeOptions), [tokens]);
  return (
    <CacheProvider value={cache}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </CacheProvider>
  );
}
