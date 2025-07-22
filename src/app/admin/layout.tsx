"use client";
// src/app/admin/layout.tsx
// Server-side wrapper for the Admin panel.
// Dynamically loads the client-only AdminShell with SSR disabled to avoid
// hydration mismatches caused by MUI / Emotion style injection order.

import type { ReactNode } from 'react';
import dynamic from 'next/dynamic';

// Client component that holds all interactive MUI admin UI.
const AdminShell = dynamic(() => import('./AdminShell'), { ssr: false });

export default function AdminLayout({ children }: { children: ReactNode }) {
  return <AdminShell>{children}</AdminShell>;
}
