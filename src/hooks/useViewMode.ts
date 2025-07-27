import { useEffect, useState } from 'react';

export type ViewMode = 'grid' | 'list';

/**
 * Persisted view mode hook. Stores value in localStorage.viewMode[section].
 * Ensures no SSR mismatch by accessing localStorage in useEffect.
 */
export function useViewMode(section: string): [ViewMode, (mode: ViewMode) => void] {
  const [mode, setMode] = useState<ViewMode>('list');

  useEffect(() => {
    if (process.env.NODE_ENV === 'test') return;
    const stored = typeof window !== 'undefined'
      ? window.localStorage.getItem(`viewMode.${section}`)
      : null;
    if (stored === 'grid' || stored === 'list') {
      setMode(stored);
    }
  }, [section]);

  const update = (m: ViewMode) => {
    setMode(m);
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(`viewMode.${section}`, m);
    }
  };

  return [mode, update];
}
