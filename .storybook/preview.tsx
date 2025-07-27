import type { Preview } from '@storybook/nextjs';
import { ThemeProvider, CssBaseline, createTheme } from '@mui/material';

// Minimal MUI theme for Storybook; replace with project theme if needed.
const theme = createTheme();

const preview: Preview = {
  decorators: [
    (Story) => (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Story />
      </ThemeProvider>
    ),
  ],
};

export default preview;
