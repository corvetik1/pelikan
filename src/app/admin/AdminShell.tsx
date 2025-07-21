"use client";

import { ReactNode, useState, useEffect } from "react";
import { useIsAdmin } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Drawer,
  List,
  ListItemButton,
  ListItemText,
  CssBaseline,
  Box,
  ThemeProvider,
  createTheme,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import NextLink from "next/link";

const drawerWidth = 240;

export default function AdminShell({ children }: { children: ReactNode }) {
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

  const theme = createTheme({ palette: { mode: "dark" } });

  const toggle = () => setOpen((prev) => !prev);

  const navItems: { label: string; href: string }[] = [
    { label: "Товары", href: "/admin/products" },
    { label: "Новости", href: "/admin/news" },
    { label: "Рецепты", href: "/admin/recipes" },
    { label: "Магазины", href: "/admin/stores" },
    { label: "Отзывы", href: "/admin/reviews" },
    { label: "Заявки", href: "/admin/quotes" },
  ];

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ display: "flex" }}>
        <AppBar position="fixed" sx={{ zIndex: theme.zIndex.drawer + 1 }}>
          <Toolbar>
            <IconButton color="inherit" edge="start" onClick={toggle} sx={{ mr: 2 }}>
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
              <ListItemButton key={item.href} component={NextLink} href={item.href} onClick={() => setOpen(false)}>
                <ListItemText primary={item.label} />
              </ListItemButton>
            ))}
          </List>
        </Drawer>

        <Box component="main" sx={{ flexGrow: 1, p: 3, mt: 8 }}>
          {children}
        </Box>
      </Box>
    </ThemeProvider>
  );
}
