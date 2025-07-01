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
import Link from "next/link";

const drawerWidth = 240;

export default function AdminLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const isAdmin = useIsAdmin();
  const [open, setOpen] = useState(false);

    useEffect(() => {
    if (!isAdmin) router.replace("/");
  }, [isAdmin, router]);

  if (!isAdmin) return null;

  const theme = createTheme({ palette: { mode: "dark" } });

  const toggle = () => setOpen((prev) => !prev);

  const navItems: { label: string; href: string }[] = [
    { label: "Товары", href: "/admin/products" },
    { label: "Новости", href: "/admin/news" },
    { label: "Рецепты", href: "/admin/recipes" },
    { label: "Магазины", href: "/admin/stores" },
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
              <Link key={item.href} href={item.href} passHref legacyBehavior>
                <ListItemButton component="a" onClick={() => setOpen(false)}>
                  <ListItemText primary={item.label} />
                </ListItemButton>
              </Link>
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
