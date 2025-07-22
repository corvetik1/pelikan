import { renderHook } from '@testing-library/react';
import { useAuth, AuthProvider } from '../AuthContext';

// Helper to render hook inside provider
import React from 'react';

const wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => React.createElement(AuthProvider, null, children);

describe('AuthContext security', () => {
  afterEach(() => {
    // cleanup simulated storage & cookies
    Object.defineProperty(window, 'localStorage', { value: window.localStorage, writable: true });
    window.localStorage.clear();
    document.cookie = '';
  });

  it('ignores admin role in localStorage when no admin cookie', () => {
    window.localStorage.setItem('app_user', JSON.stringify({ id: '1', name: 'Eve', roles: ['admin'] }));

    const { result } = renderHook(() => useAuth(), { wrapper });

    expect(result.current.isAdmin).toBe(false);
  });

  it('accepts admin when cookie present', () => {
    window.localStorage.setItem('app_user', JSON.stringify({ id: '1', name: 'Eve', roles: ['admin'] }));
    Object.defineProperty(document, 'cookie', {
      writable: true,
      value: 'session=admin',
    });

    const { result } = renderHook(() => useAuth(), { wrapper });

    expect(result.current.isAdmin).toBe(true);
  });
});
