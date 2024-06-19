import ReactDOM from 'react-dom/client'
import { ThemeProvider } from '@mui/material'
import theme from './theme.tsx'
import App from './App.tsx'
import AuthProvider from './ContextProvider.tsx'
import { BrowserRouter } from 'react-router-dom'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <ThemeProvider theme={theme}>
    <BrowserRouter>
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </ThemeProvider>
)
