"use client";

import { Drawer, Toolbar, List, ListItemButton, ListItemText } from "@mui/material";
import BrandLogo from "@/components/BrandLogo";
import NextLink from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { ReactNode } from "react";

export interface NavItem {
  label: string;
  href: string;
}

interface AdminSidebarProps {
  /** Drawer width in px */
  width?: number;
  /** Items to render in sidebar */
  items: Readonly<NavItem[]>;
  /** Whether drawer is open (for temporary variant) */
  open?: boolean;
  onClose?: () => void;
  /** Drawer variant: permanent | persistent | temporary */
  variant?: "permanent" | "persistent" | "temporary";
}

export default function AdminSidebar({ width = 240, items, open = true, onClose, variant = "permanent" }: AdminSidebarProps): ReactNode {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <Drawer
      variant={variant}
      anchor="left"
      open={open}
      onClose={onClose}
      sx={{
        width,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: { width, boxSizing: "border-box" },
      }}
    >
      <Toolbar>
        <BrandLogo disableLink sx={{ mx: 'auto' }} />
      </Toolbar>
      <List>
        {items.map((item) => (
          <ListItemButton
            key={item.href}
            component={NextLink}
            href={item.href}
            selected={pathname?.startsWith(item.href)}
            onClick={() => {
              router.push(item.href);
              if (onClose) onClose();
            }}
          >
            <ListItemText primary={item.label} />
          </ListItemButton>
        ))}
      </List>
    </Drawer>
  );
}
