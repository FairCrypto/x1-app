import type { ThemeOptions } from '@mui/material';

export const defaultTheme: ThemeOptions = {
  palette: {
    mode: 'dark'
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

export const defaultLightTheme: ThemeOptions = {
  palette: {
    mode: 'light'
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
          },
          background: {
            default: '#efefef'
          }
        },
        components: {
          MuiPaper: {
            styleOverrides: {
              root: {
                backgroundColor: '#efefef'
              }
            }
          },
          MuiAppBar: {
            styleOverrides: {
              colorPrimary: {
                backgroundColor: '#efefef'
              }
            }
          },
          MuiCard: {
            styleOverrides: {
              boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)'
            }
          },
          MuiDataGrid: {
            styleOverrides: {
              root: {
                fontFamily: ['Courier'],
                border: 'none'
              }
            }
          }
        }
      }
    : {
        palette: {
          text: {
            primary: '#fff',
            secondary: '#ccc'
          },
          primary: {
            main: '#3070F6',
            contrastText: '#fff'
          },
          background: {
            // default: '#131419'
          },
          action: {
            background: '#3070F6'
          }
        },
        components: {
          muiButton: {
            styleOverrides: {
              root: {
                // textTransform: 'none'
                '& .MuiButton-colorPrimary': {
                  color: '#fff'
                }
              }
            }
          },
          MuiPaper: {
            styleOverrides: {
              root: {
                backgroundColor: '#121212'
              }
            }
          },
          MuiAppBar: {
            styleOverrides: {
              colorPrimary: {
                backgroundColor: '#121212'
              }
            }
          },
          MuiDataGrid: {
            styleOverrides: {
              root: {
                fontFamily: ['Courier'],
                border: 'none',
                outline: 'none',
                backgroundColor: '#131419'
              },
              header: {
                border: 'none',
                outline: 'none',
                backgroundColor: '#131419'
              },
              cell: {
                border: 'none',
                outline: 'none'
              }
            }
          }
        }
      };

export const theme = defaultTheme;
