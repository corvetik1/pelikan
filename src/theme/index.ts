import { createTheme } from "@mui/material/styles";

// Цветовая палитра и типографика согласно ТЗ «Современный морской минимализм»
const theme = createTheme({
  palette: {
    primary: {
      main: "#1B5E89", // Deep Ocean Blue
      contrastText: "#FFFFFF",
    },
    secondary: {
      main: "#2E9BA8", // Fresh Turquoise
      contrastText: "#FFFFFF",
    },
    error: {
      main: "#FF6B6B", // Coral Red
    },
    background: {
      default: "#F8FAFB", // Light Blue Gray
      paper: "#FFFFFF",
    },
    text: {
      primary: "#2D3748", // Charcoal
      secondary: "#718096", // Medium Gray
    },
  },
  typography: {
    fontFamily: ["Open Sans", "Inter", "sans-serif"].join(","),
    h1: {
      fontFamily: "Open Sans",
      fontWeight: 700,
      fontSize: "3rem", // 48px
      lineHeight: 1.166, // 56px
    },
    h2: {
      fontFamily: "Open Sans",
      fontWeight: 600,
      fontSize: "2.25rem", // 36px
      lineHeight: 1.222, // 44px
    },
    h3: {
      fontFamily: "Open Sans",
      fontWeight: 600,
      fontSize: "1.75rem", // 28px
      lineHeight: 1.285, // 36px
    },
    h4: {
      fontFamily: "Open Sans",
      fontWeight: 600,
      fontSize: "1.5rem", // 24px
      lineHeight: 1.333, // 32px
    },
    h5: {
      fontFamily: "Open Sans",
      fontWeight: 600,
      fontSize: "1.25rem", // 20px
      lineHeight: 1.4, // 28px
    },
    h6: {
      fontFamily: "Open Sans",
      fontWeight: 600,
      fontSize: "1.125rem", // 18px
      lineHeight: 1.444, // 26px
    },
    body1: {
      fontFamily: "Inter",
      fontWeight: 400,
      fontSize: "1rem", // 16px
      lineHeight: 1.5, // 24px
    },
    body2: {
      fontFamily: "Inter",
      fontWeight: 400,
      fontSize: "0.875rem", // 14px
      lineHeight: 1.428, // 20px
    },
  },
  components: {
    MuiButton: {
      defaultProps: {
        disableRipple: true,
      },
      styleOverrides: {
        root: {
          textTransform: "none",
          borderRadius: 8,
        },
      },
    },
  },
});

export default theme;
