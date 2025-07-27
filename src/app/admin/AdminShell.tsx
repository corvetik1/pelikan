"use client";

import {
  CssBaseline,
  Box,
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Drawer,
  List,
  ListItemButton,
  ListItemText,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import Link from "next/link";
import { useTheme } from "@mui/material/styles";

import { ReactNode, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useIsAdmin } from "@/context/AuthContext";

import { ThemeRegistry } from "@/components/ThemeRegistry";
import { useActiveThemeTokens } from "@/hooks/useActiveThemeTokens";
import adminTheme from "@/theme/adminTheme";

const drawerWidth = 240;

export default function AdminShell({ children }: { children: ReactNode }) {
  const theme = useTheme();
  const tokens = useActiveThemeTokens();

  const [mounted, setMounted] = useState(false);

  const router = useRouter();
  const isAdmin = useIsAdmin();
  const [open, setOpen] = useState(false);

  // Delay render until after mount to avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!isAdmin) router.replace("/login");
  }, [isAdmin, router]);

  if (!mounted || !isAdmin) return null;
  const themeWrapper = (content: ReactNode) => {
    if (tokens) {
      return <ThemeRegistry tokens={tokens}>{content}</ThemeRegistry>;
    }
    return <ThemeRegistry tokens={adminTheme as unknown as Record<string, unknown>}>{content}</ThemeRegistry>; // fallback to static adminTheme tokens cast
  };

  const toggle = () => setOpen((prev) => !prev);

  const navItems: { label: string; href: string }[] = [
    { label: "Товары", href: "/admin/products" },
    { label: "Новости", href: "/admin/news" },
    { label: "Рецепты", href: "/admin/recipes" },
    { label: "Магазины", href: "/admin/stores" },
    { label: "Отзывы", href: "/admin/reviews" },
    { label: "Темы", href: "/admin/themes" },
    { label: "Настройки", href: "/admin/settings" },
    { label: "Заявки", href: "/admin/quotes" },
  ];

  return themeWrapper(
    <>
      <CssBaseline />
      <Box sx={{ display: "flex" }}>
        <AppBar position="fixed" sx={{ zIndex: theme.zIndex.drawer + 1 }}>
          <Toolbar>
            <IconButton color="inherit" edge="start" onClick={toggle} aria-label="open drawer" sx={{ mr: 2 }}>
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" noWrap component="div">
              Admin Panel
            </Typography>
          </Toolbar>
        </AppBar>

        <Drawer
          variant="persistent"
          anchor="left"
          open={open}
          sx={{
            width: drawerWidth,
            flexShrink: 0,
            [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: "border-box" },
          }}
        >
          <Toolbar />
          <List>
            {navItems.map((item) => (
              <ListItemButton
              key={item.href}
              component={Link}
              href={item.href}
              onClick={() => {
                router.push(item.href);
                setOpen(false);
              }}
            >
                <ListItemText primary={item.label} />
              </ListItemButton>
            ))}
          </List>
        </Drawer>

        <Box component="main" sx={{ flexGrow: 1, p: 3, mt: 8 }}>
          {children}
        </Box>
      </Box>
    </>
  );
}
