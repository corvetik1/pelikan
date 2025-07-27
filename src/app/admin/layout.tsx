"use client";
// src/app/admin/layout.tsx
// Server-side wrapper for the Admin panel.
// Dynamically loads the client-only AdminShell with SSR disabled to avoid
// hydration mismatches caused by MUI / Emotion style injection order.

import type { ReactNode } from 'react';
// Direct import of client shell for instant render (was dynamic import causing test flake)
import AdminShell from './AdminRootShell';

export default function AdminLayout({ children }: { children: ReactNode }) {
  return <AdminShell>{children}</AdminShell>;
}
