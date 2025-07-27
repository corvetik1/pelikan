import { PaletteOptions } from "@mui/material/styles";

/*
 * Centralised color tokens for the admin panel.
 * Extend or override to align with corporate branding.
 */
export const adminPalette: PaletteOptions = {
  mode: "light",
  primary: {
    main: "#1976d2",
    light: "#2196f3",
    dark: "#115293",
    contrastText: "#ffffff",
  },
  secondary: {
    main: "#d81b60",
    light: "#ff5c8d",
    dark: "#a00037",
    contrastText: "#ffffff",
  },
  success: {
    main: "#2e7d32",
    light: "#60ad5e",
    dark: "#005005",
    contrastText: "#ffffff",
  },
  error: {
    main: "#d32f2f",
    light: "#ff6659",
    dark: "#9a0007",
    contrastText: "#ffffff",
  },
  warning: {
    main: "#ed6c02",
    light: "#ff9800",
    dark: "#b53d00",
    contrastText: "#ffffff",
  },
  info: {
    main: "#0288d1",
    light: "#03a9f4",
    dark: "#01579b",
    contrastText: "#ffffff",
  },
  background: {
    default: "#f7f9fc",
    paper: "#ffffff",
  },
};
