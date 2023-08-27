import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import { Amplify } from '@aws-amplify/core';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import 'dayjs/locale/ja';
import { MuiThemeProvider } from '@/styles';

const config = {
  Auth: {
    identityPoolId: import.meta.env.VITE_IDENTITY_POOL_ID,
    userPoolId: import.meta.env.VITE_USER_POOL_ID,
    userPoolWebClientId: import.meta.env.VITE_USER_POOL_WEB_CLIENT_ID,
    region: 'ap-northeast-1'
  },
  Storage: {
    AWSS3: {
      bucket: import.meta.env.VITE_S3_BUCKET,
      region: 'ap-northeast-1'
    }
  }
};

Amplify.configure(config);

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale={'ja'} dateFormats={{ monthAndYear: 'YYYY年MM月' }}>
      <MuiThemeProvider>
        <App />
      </MuiThemeProvider>
    </LocalizationProvider>
  </React.StrictMode>
);
