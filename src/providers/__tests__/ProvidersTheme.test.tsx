import { render, screen } from '@testing-library/react';
import Providers from '@/providers/Providers';
import { useTheme } from '@mui/material/styles';
import React from 'react';

function ModeText() {
  const theme = useTheme();
  return <span data-testid="mode">{theme.palette.mode}</span>;
}

describe('Providers + ThemeRegistry', () => {
  it('passes initialTokens to MUI ThemeProvider', () => {
    const tokens = { palette: { mode: 'dark' } } as const;
    render(
      <Providers initialTokens={tokens}>
        <ModeText />
      </Providers>,
    );
    expect(screen.getByTestId('mode').textContent).toBe('dark');
  });
});
