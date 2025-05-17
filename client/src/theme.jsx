import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'light', // Change to 'dark' for dark mode
    primary: {
      main: '#1976d2',       // MUI Blue
      contrastText: '#fff',  // Text color on primary buttons
    },
    secondary: {
      main: '#f50057',       // Pink
      contrastText: '#fff',  // Text color on secondary buttons
    },
    background: {
      default: '#f5f5f5',    // Page background
      paper: '#fff',         // Paper components background
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h6: {
      fontWeight: 600,
    },
    button: {
      textTransform: 'none', // Disable uppercase on buttons
    },
  },
  shape: {
    borderRadius: 8,         // Rounded corners for components
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
        },
      },
    },
  },
});

export default theme;
