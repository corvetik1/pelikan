"use client";

import { ReactNode } from "react";
import {
  AppBar,
  CssBaseline,
  IconButton,
  Toolbar,
  Typography,
  useMediaQuery,
  Box,
  Theme,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { useTheme } from "@mui/material/styles";
import { useAdminUIStore } from "@/store/useAdminUIStore";
import AdminSidebar, { NavItem } from "./AdminSidebar";

export interface AdminLayoutProps {
  title: string;
  navItems: Readonly<NavItem[]>;
  children: ReactNode;
}

const drawerWidth = 256;

export default function AdminLayout({ title, navItems, children }: AdminLayoutProps) {
  const theme = useTheme<Theme>();
  const isMdUp = useMediaQuery(theme.breakpoints.up("md"));
  const { sidebarOpen, toggleSidebar, closeSidebar } = useAdminUIStore();

  const drawerVariant = isMdUp ? "permanent" : "temporary";

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />

      {/* App Bar */}
      <AppBar
        position="fixed"
        color="inherit"
        elevation={1}
        sx={{ zIndex: theme.zIndex.drawer + 1, height: 64, justifyContent: "center" }}
      >
        <Toolbar sx={{ minHeight: 64 }}>
          {!isMdUp && (
            <IconButton edge="start" aria-label="open drawer" onClick={toggleSidebar} sx={{ mr: 2 }}>
              <MenuIcon />
            </IconButton>
          )}
          <Typography variant="h6" component="h1" sx={{ fontWeight: 600 }}>
            {title}
          </Typography>
        </Toolbar>
      </AppBar>

      {/* Sidebar */}
      <AdminSidebar
        width={drawerWidth}
        items={navItems}
        open={isMdUp ? true : sidebarOpen}
        onClose={closeSidebar}
        variant={drawerVariant}
      />

      {/* Main content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          pt: 10,
          px: 3,
          backgroundColor: "background.default",
          minHeight: "100vh",
        }}
      >
        {children}
      </Box>
    </Box>
  );
}
