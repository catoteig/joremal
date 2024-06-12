import { createTheme } from '@mui/material/styles'

const theme = () =>
  createTheme({
    palette: {
      primary: {
        light: '#0AD3FF',
        main: '#55868C',
        dark: '#023C40',
        contrastText: '#78FFD6',
      },
      secondary: {
        light: '#ff7961',
        main: '#f44336',
        dark: '#ba000d',
        contrastText: '#000',
      },
      warning: {
        main: '#ef767a',
      },
    },
    spacing: 8,
    typography: { button: { textTransform: 'none' } },
  })

export default theme
