import ReactDOM from 'react-dom/client'
import './index.css'
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from 'react-router-dom'
import Home from './Home.tsx'
import SignUp from './SignUp.tsx'
import SignIn from './SignIn.tsx'
import theme from './theme.tsx'
import { ThemeProvider } from '@mui/material'
import AuthProvider from './ContextProvider.tsx'
import { getDb } from './services/db.tsx'

getDb()

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route>
      <Route index path="/" element={<Home />} />
      <Route path="login" element={<SignIn />} />
      <Route path="signup" element={<SignUp />} />
    </Route>
  )
)

ReactDOM.createRoot(document.getElementById('root')!).render(
  <ThemeProvider theme={theme}>
    <AuthProvider>
      <RouterProvider router={router} />{' '}
    </AuthProvider>
  </ThemeProvider>
)
