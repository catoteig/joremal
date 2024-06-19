import { createContext, useContext } from 'react'

import { User } from 'firebase/auth'

export interface LoginFormValues {
  email: string
  password: string
}

export interface UserFormValues {
  email: string
  password: string
}
export interface IAuth {
  user: User | null
  loading: boolean
  LogIn: (creds: LoginFormValues) => Promise<null | string>
  SignUp: (creds: UserFormValues) => Promise<null | string>
  SignOut: () => Promise<void>
}

export const AuthContext = createContext<IAuth>({
  user: null,
  loading: false,
  LogIn: async () => null,
  SignUp: async () => null,
  SignOut: async () => {},
})

export const useAuth = (): IAuth => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
