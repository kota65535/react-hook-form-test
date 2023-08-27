import { createTheme } from '@mui/material';

declare module '@mui/material/styles' {
  interface TypographyVariants {
    hoge: React.CSSProperties;
  }

  // allow configuration using `createTheme`
  interface TypographyVariantsOptions {
    hoge?: React.CSSProperties;
  }
}

// Update the Typography's variant prop options
declare module '@mui/material/Typography' {
  interface TypographyPropsVariantOverrides {
    hoge: true;
  }
}

export const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2'
    },
    secondary: {
      main: '#ba000d'
    }
  },
  typography: {
    fontSize: 14,
    h1: {
      fontSize: 28
    },
    h2: {
      fontSize: 24
    },
    h3: {
      fontSize: 20
    }
  }
});
