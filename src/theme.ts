import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: { main: '#3f51b5' },
    secondary: { main: '#ff9800' },
    background: { default: '#f7f9fc', paper: '#ffffff' },
  },
  shape: { borderRadius: 10 },
  typography: {
    fontFamily: 'system-ui, "Segoe UI", Roboto, Arial',
    h6: { fontWeight: 600 },
    button: { textTransform: 'none', fontWeight: 600 },
  },
});

export default theme;
