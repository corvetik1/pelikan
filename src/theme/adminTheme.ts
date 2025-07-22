import { createTheme } from '@mui/material/styles';
// Extend MUI theme types with DataGrid keys
import '@mui/x-data-grid/themeAugmentation';

/**
 * Light theme for the admin panel.
 * Palette and component overrides adhere to company branding and modern UX.
 */
const adminTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2', // corporate blue
    },
    secondary: {
      main: '#d81b60', // accent pink
    },
    background: {
      default: '#f7f9fc',
      paper: '#ffffff',
    },
  },
  shape: {
    borderRadius: 8,
  },
  typography: {
    fontSize: 14,
  },
  components: {
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
