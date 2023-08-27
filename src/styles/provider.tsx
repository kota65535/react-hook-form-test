import React, { ReactNode } from 'react';
import { CssBaseline, ThemeProvider } from '@mui/material';
import { theme } from '@/styles/theme';

type Props = {
  children: ReactNode;
};

export const MuiThemeProvider = ({ children }: Props) => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
};
