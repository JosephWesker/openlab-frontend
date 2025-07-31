import type { UserEntity } from "@/interfaces/user"
import { createContext } from "react"

export type AuthContextType = {
  userFromApi: UserEntity | null
  setUserFromApi: (user: UserEntity | null) => void
  idToken: string | null
  isAuthenticated: boolean
  isLoading: boolean
  isAuthResolved: boolean
  error?: Error
}

export const AuthContext = createContext<AuthContextType>({
  userFromApi: null,
  idToken: null,
  isAuthenticated: false,
  isLoading: false,
  isAuthResolved: false,
  setUserFromApi: () => {},
  error: undefined,
})

