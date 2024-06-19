import './index.css'
import { Route, Routes } from 'react-router-dom'
import Home from './Home.tsx'
import SignUp from './SignUp.tsx'
import SignIn from './SignIn.tsx'
import ProtectedRoute from './components/protectedRoute.tsx' // Ensure this points to the correct file
import { getDb } from './services/db.tsx'

getDb()

export const App = () => {
  return (
    <Routes>
      <Route
        index
        path="/"
        element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        }
      />
      <Route path="login" element={<SignIn />} />
      <Route path="signup" element={<SignUp />} />
    </Routes>
  )
}

export default App
