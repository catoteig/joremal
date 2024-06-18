import { createContext } from 'react'

import { User, getAuth } from 'firebase/auth'

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
  LogIn: (creds: LoginFormValues) => Promise<void>
  SignUp: (creds: UserFormValues) => void
  SignOut: () => Promise<void>
}

export const AuthContext = createContext<IAuth | null>(null)
