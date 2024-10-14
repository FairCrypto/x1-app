import type { ThemeOptions } from '@mui/material';

export const defaultTheme: ThemeOptions = {
  palette: {
    mode: 'dark',
    text: {
      primary: '#fff',
      secondary: '#ccc'
    }
  },
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 900,
      lg: 1200,
      xl: 1300
    }
  },
  typography: {
    fontFamily: ['Noto Sans', 'Arial', 'sans-serif'].join(','),
    fontWeightRegular: 500,
    fontSize: 16
  }
};

export const overrides = (mode: string) =>
  mode === 'light'
    ? {
        palette: {
          text: {
            primary: '#000',
            secondary: '#333'
          }
        },
        components: {
          MuiPaper: {
            styleOverrides: {
              root: {
                // backgroundColor: "#ededed"
              }
            }
          },
          MuiAppBar: {
            styleOverrides: {
              colorPrimary: {
                backgroundColor: '#ededed'
              }
            }
          },
          MuiCard: {
            styleOverrides: {
              boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)'
            }
          }
        },
        MuiDataGrid: {
          styleOverrides: {
            root: {
              border: 'none',
              fontFamily: ['Courier']
            }
          }
        }
      }
    : {
        components: {
          MuiDataGrid: {
            styleOverrides: {
              root: {
                border: 'none'
              }
            }
          }
        }
      };

export const theme = defaultTheme;
