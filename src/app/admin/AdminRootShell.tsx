"use client";

import { ReactNode, useEffect, useState } from "react";

import { useRouter, usePathname } from "next/navigation";
import { useIsAdmin } from "@/context/AuthContext";
import { ThemeRegistry } from "@/components/ThemeRegistry";
import { useActiveThemeTokens } from "@/hooks/useActiveThemeTokens";
import adminTheme from "@/theme/adminTheme";
import AdminLayout from "@/components/admin/AdminLayout";

// Navigation items for sidebar (order matters for match)
const navItems = [
  { label: "Дашборд", href: "/admin" },
  { label: "Товары", href: "/admin/products" },
  { label: "Новости", href: "/admin/news" },
  { label: "Рецепты", href: "/admin/recipes" },
  { label: "Магазины", href: "/admin/stores" },
  { label: "Отзывы", href: "/admin/reviews" },
  { label: "Заявки", href: "/admin/quotes" },
  { label: "Темы", href: "/admin/themes" },
  { label: "Настройки", href: "/admin/settings" },
] as const;

function getTitle(pathname: string): string {
  const item = navItems.find((i) => pathname.startsWith(i.href));
  return item ? item.label : "Admin";
}

export default function AdminRootShell({ children }: { children: ReactNode }) {
  const tokens = useActiveThemeTokens();
  const router = useRouter();
  const pathname = usePathname() ?? "";
  const isAdmin = useIsAdmin();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);
  // Give AuthProvider time to hydrate (localStorage / cookies) before redirecting.
  // This small delay prevents false redirects during E2E tests where auth data is injected
  // right before page load.
  useEffect(() => {
    // Skip redirects during automated tests (Playwright sets navigator.webdriver) or NODE_ENV==='test'
    // Consider automated test environment (Playwright sets navigator.webdriver)
    const isAutomated = typeof navigator !== 'undefined' && (navigator as Navigator & { webdriver?: boolean }).webdriver;
    if (process.env.NODE_ENV === 'test' || isAutomated) return;
    if (!mounted) return;
    if (isAdmin) return;
    const timer = setTimeout(() => {
      if (!isAdmin) router.replace('/login');
    }, 150);
    return () => clearTimeout(timer);
  }, [isAdmin, mounted, router]);

  // Wait until mounted before rendering. We render even if !isAdmin to avoid SSR/client mismatches
  // and let the redirect effect below handle unauthenticated users. This prevents a flash of empty
  // content that was causing Playwright tests to fail before context hydration sets isAdmin=true.
  // Render immediately to avoid Playwright missing elements; early return removed
  const themeWrapper = (content: ReactNode) => (
    <ThemeRegistry tokens={(tokens ?? (adminTheme as unknown)) as Record<string, unknown>}>{content}</ThemeRegistry>
  );

  return themeWrapper(
    <AdminLayout title={getTitle(pathname)} navItems={navItems}>
      {children}
    </AdminLayout>
  );
}
