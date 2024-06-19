import { Navigate } from 'react-router-dom'
import { useAuth } from '../AuthContext'
import React from 'react'

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const auth = useAuth()

  if (!auth) return <Navigate to="/login" />

  return <>{children}</>
}

export default ProtectedRoute
