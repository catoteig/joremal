import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  createUserWithEmailAndPassword,
  getAuth,
  signInWithEmailAndPassword,
  User,
  onAuthStateChanged,
  updatePassword,
} from 'firebase/auth'
import { AuthContext, IAuth, LoginFormValues, UserFormValues } from './AuthContext.ts'
import { errorText } from './assets/authErrorMapping.tsx'

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [isAuthLoading, setIsAuthLoading] = useState<boolean>(true)
  const navigate = useNavigate()

  const auth = getAuth()

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user)
      setIsAuthLoading(false)
    })

    return unsubscribe
  }, [auth])

  const LogIn = async (creds: LoginFormValues): Promise<null | string> => {
    setIsLoading(true)
    return signInWithEmailAndPassword(auth, creds.email, creds.password)
      .then((userCredential) => {
        const { user } = userCredential
        if (user) setCurrentUser(user)
        navigate('/')
        setIsLoading(false)
        return null
      })
      .catch((error) => {
        setIsLoading(false)
        return errorText(error.code)
      })
  }

  const SignUp = async (creds: UserFormValues): Promise<null | string> => {
    setIsLoading(true)
    return createUserWithEmailAndPassword(auth, creds.email, creds.password)
      .then(() => {
        navigate('/login')
        setIsLoading(false)
        return null
      })
      .catch((error) => {
        setIsLoading(false)
        return errorText(error.code)
      })
  }

  const SignOut = async () => {
    setIsLoading(true)
    try {
      await auth.signOut()
      setCurrentUser(null)
      navigate('/login')
    } catch (error) {
      console.error('Error signing out:', error)
    }
    setIsLoading(false)
  }

  const ChangePassword = async (newPassword: string): Promise<null | string> => {
    setIsLoading(true)
    return updatePassword(auth.currentUser!, newPassword)
      .then(() => {
        setIsLoading(false)
        return null
      })
      .catch((error) => {
        setIsLoading(false)
        return errorText(error.code)
      })
  }

  const authValues: IAuth = {
    user: currentUser,
    loading: isLoading,
    LogIn,
    SignUp,
    SignOut,
    ChangePassword,
  }

  return <AuthContext.Provider value={authValues}>{!isAuthLoading && children}</AuthContext.Provider>
}

export default AuthProvider
