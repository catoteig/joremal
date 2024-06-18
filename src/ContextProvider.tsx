import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { createUserWithEmailAndPassword, getAuth, signInWithEmailAndPassword, User } from 'firebase/auth'
import { AuthContext, IAuth, LoginFormValues, UserFormValues } from './AuthContext.ts'

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  // const [isAuthLoading, setIsAuthLoading] = useState<boolean>(true)
  const navigate = useNavigate()

  const auth = getAuth()

  const LogIn = async (creds: LoginFormValues) => {
    setIsLoading(true)
    await signInWithEmailAndPassword(auth, creds.email, creds.password)
      .then((userCredential) => {
        const { user } = userCredential
        if (user) setCurrentUser(user)
        console.log('Logged in as user:', user)
        navigate('/')
        setIsLoading(false)
      })
      .catch((error) => {
        const errorCode = error.code
        const errorMessage = error.message
        console.log(errorCode, errorMessage)
      })
  }

  const SignUp = (creds: UserFormValues) => {
    setIsLoading(true)

    createUserWithEmailAndPassword(auth, creds.email, creds.password)
      .then((userCredential) => {
        // Signed in
        const { user } = userCredential
        console.log('Signed up user:', user)
        navigate('/login')
        setIsLoading(false)
      })
      .catch((error) => {
        const errorCode = error.code
        const errorMessage = error.message
        console.log(errorCode, errorMessage)
      })
  }

  const LogOut = async () => {
    setIsLoading(true)
    try {
      await auth.signOut()
      setCurrentUser(null)
      navigate('/login')
      console.log('Logged out')
    } catch (error) {
      console.log(error)
    }
    setIsLoading(false)
  }

  const authValues: IAuth = {
    user: currentUser,
    loading: isLoading,
    LogIn: LogIn,
    SignUp: SignUp,
    SignOut: LogOut,
  }

  return <AuthContext.Provider value={authValues}>{children}</AuthContext.Provider>
}

export default AuthProvider
