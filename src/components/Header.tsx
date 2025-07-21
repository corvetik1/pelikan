'use client';

import React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';

import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { useIsAdmin, useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Link from 'next/link';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

const navItems: { label: string; href: string }[] = [
  { label: 'О компании', href: '/about' },
  { label: 'Продукция', href: '/products' },
  { label: 'B2B', href: '/b2b' },
  { label: 'Рецепты', href: '/recipes' },
  { label: 'Новости', href: '/news' },
  { label: 'Где купить', href: '/locations' },
  { label: 'Контакты', href: '/contacts' },
];

export default function Header() {
  const isAdmin = useIsAdmin();
  const { logout } = useAuth();
  const router = useRouter();

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const openMenu = Boolean(anchorEl);
  const handleOpen = (e: React.MouseEvent<HTMLElement>) => setAnchorEl(e.currentTarget);
  const handleClose = () => setAnchorEl(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [open, setOpen] = React.useState(false);

  const toggleDrawer = (state: boolean) => () => setOpen(state);

  const drawer = (
    <Box onClick={toggleDrawer(false)} sx={{ textAlign: 'center' }}>
      <Typography variant="h6" sx={{ my: 2 }}>
        Бухта пеликанов
      </Typography>
      <List>
        {navItems.map((item) => (
          <ListItem key={item.href} disablePadding>
            <ListItemButton component={Link} href={item.href} sx={{ textAlign: 'left' }}>
              <ListItemText primary={item.label} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar component="nav" position="sticky" color="inherit" elevation={0}>
        <Toolbar>
          {isMobile && (
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={toggleDrawer(true)}
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
          )}
          <Typography variant="h6" component={Link} href="/" sx={{ flexGrow: 1, textDecoration: 'none', color: 'inherit' }}>
            Бухта пеликанов
          </Typography>
          {!isMobile && (
            <Box sx={{ display: 'flex', gap: 3 }}>
              {navItems.map((item) => (
                <Typography
                  key={item.href}
                  component={Link}
                  href={item.href}
                  variant="body1"
                  sx={{ textDecoration: 'none', color: 'text.primary', '&:hover': { color: 'primary.main' } }}
                >
                  {item.label}
                </Typography>
              ))}
            </Box>
          )}
        {isAdmin && (
            <IconButton color="inherit" onClick={handleOpen} size="large" sx={{ ml: 1 }} aria-label="Администратор">
              <AccountCircleIcon />
            </IconButton>
          )}
        </Toolbar>
        {isAdmin && (
          <Menu anchorEl={anchorEl} open={openMenu} onClose={handleClose} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
            <MenuItem
              onClick={() => {
                handleClose();
                router.push('/admin');
              }}
            >
              Панель администратора
            </MenuItem>
            <MenuItem
              onClick={() => {
                handleClose();
                logout();
                router.push('/');
              }}
            >
              Выйти из профиля
            </MenuItem>
          </Menu>
        )}
      </AppBar>
      <Drawer anchor="left" open={open} onClose={toggleDrawer(false)}>
        {drawer}
      </Drawer>
    </Box>
  );
}
