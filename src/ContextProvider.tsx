import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  createUserWithEmailAndPassword,
  getAuth,
  signInWithEmailAndPassword,
  User,
  onAuthStateChanged,
} from 'firebase/auth'
import { AuthContext, IAuth, LoginFormValues, UserFormValues } from './AuthContext.ts'

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

  const LogIn = async (creds: LoginFormValues) => {
    setIsLoading(true)
    await signInWithEmailAndPassword(auth, creds.email, creds.password)
      .then((userCredential) => {
        const { user } = userCredential
        if (user) setCurrentUser(user)
        navigate('/')
        setIsLoading(false)
      })
      .catch((error) => {
        const errorCode = error.code
        const errorMessage = error.message
        throw new Error(`${errorCode} ${errorMessage}`)
      })
  }

  const SignUp = (creds: UserFormValues) => {
    setIsLoading(true)
    createUserWithEmailAndPassword(auth, creds.email, creds.password)
      .then((userCredential) => {
        const { user } = userCredential
        console.log('Signed up user:', user)
        navigate('/login')
        setIsLoading(false)
      })
      .catch((error) => {
        const errorCode = error.code
        const errorMessage = error.message
        throw new Error(`${errorCode} - ${errorMessage}`)
      })
  }

  const SignOut = async () => {
    setIsLoading(true)
    try {
      await auth.signOut()
      setCurrentUser(null)
      navigate('/login')
    } catch (error) {
      throw new Error(error)
    }
    setIsLoading(false)
  }

  const authValues: IAuth = {
    user: currentUser,
    loading: isLoading,
    LogIn,
    SignUp,
    SignOut,
  }

  return <AuthContext.Provider value={authValues}>{!isAuthLoading && children}</AuthContext.Provider>
}

export default AuthProvider
