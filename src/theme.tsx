import { createTheme, ThemeOptions } from '@mui/material/styles'
import { Theme } from '@emotion/react'

export const themeOpts: ThemeOptions = {
  palette: {
    primary: {
      light: '#f4ecd6',
      main: '#55868C',
      dark: '#023C40',
      contrastText: '#78FFD6',
    },
    secondary: {
      light: '#edf4ed',
      main: '#f44336',
      dark: '#698F3F',
      contrastText: '#000',
    },
    warning: {
      main: '#ef767a',
    },
    success:{
      main: '#698F3F',
    }
  },
  components: {
    MuiMenu: {
      styleOverrides: {
        list: {
          '&[role="menu"]': {
            backgroundColor: '#e3eae2',
          },
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        colorPrimary: {
          bgcolor: 'warning.main',
          marginTop: '1rem',
          color: 'white',
          '&:hover': { bgcolor: 'primary.main' },
        },
      },
    },
  },
  spacing: 8,
  typography: { button: { textTransform: 'none' } },
}

const theme: Theme = () => createTheme(themeOpts)

export default theme
