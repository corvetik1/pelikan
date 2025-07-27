import { createTheme } from '@mui/material/styles';
import { adminPalette } from './adminPalette';
import { adminTypography } from './typography';
// Extend MUI theme types with DataGrid keys
import '@mui/x-data-grid/themeAugmentation';

/**
 * Light theme for the admin panel.
 * Palette and component overrides adhere to company branding and modern UX.
 */
const adminTheme = createTheme({
  palette: adminPalette,

  shape: {
    borderRadius: 8,
  },
  typography: adminTypography,

  components: {
    MuiIconButton: {
      styleOverrides: {
        root: {
          '&:focus-visible': {
            outline: '2px solid #1976d2',
            outlineOffset: 2,
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          '&:focus-visible': {
            outline: '2px solid #1976d2',
            outlineOffset: 2,
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#ffffff',
          color: '#1976d2',
          boxShadow: '0 1px 4px rgba(0,0,0,0.1)',
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: '#ffffff',
          borderRight: '1px solid #e0e0e0',
        },
      },
    },
    MuiDataGrid: {
      styleOverrides: {
        root: {
          border: 'none',
          borderRadius: 8,
        },
        columnHeaders: {
          backgroundColor: '#fafafa',
          fontWeight: 600,
        },
      },
    },
  },
});

export default adminTheme;
