import type { TypographyVariantsOptions } from "@mui/material/styles";

/*
 * Centralised typography scale for the admin panel.
 * Unit: rem. Base font-size assumed 14px ( = 0.875rem ).
 */
export const adminTypography: TypographyVariantsOptions = {
  fontFamily: [
    "Inter",
    "Roboto",
    "-apple-system",
    "BlinkMacSystemFont",
    "'Segoe UI'",
    "'Helvetica Neue'",
    "Arial",
    "sans-serif",
  ].join(', '),
  fontSize: 14,
  h1: {
    fontSize: "2.25rem", // 36px
    fontWeight: 600,
  },
  h2: {
    fontSize: "1.875rem", // 30px
    fontWeight: 600,
  },
  h3: {
    fontSize: "1.5rem", // 24px
    fontWeight: 600,
  },
  h4: {
    fontSize: "1.25rem", // 20px
    fontWeight: 600,
  },
  h5: {
    fontSize: "1.125rem", // 18px
    fontWeight: 600,
  },
  h6: {
    fontSize: "1rem", // 16px
    fontWeight: 600,
  },
  button: {
    textTransform: "none",
    fontWeight: 600,
  },
};
