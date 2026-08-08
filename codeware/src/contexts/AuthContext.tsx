import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type PropsWithChildren,
} from 'react'
import type { AuthSession, User } from '../types'
import { authStorage, AUTH_UNAUTHORIZED_EVENT } from '../services/http'
import * as authApi from '../services/auth'

type AuthCtx = {
  user: User | null
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<void>
  register: (payload: {
    name: string
    email: string
    password: string
    confirmPassword: string
  }) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthCtx | null>(null)

function loadUserFromStorage(): User | null {
  if (!authStorage.access) return null
  const raw = authStorage.user
  if (!raw || typeof raw !== 'object') return null
  const u = raw as Partial<User>
  if (typeof u.id !== 'number') return null
  if (typeof u.email !== 'string') return null
  if (typeof u.first_name !== 'string') return null
  if (typeof u.last_name !== 'string') return null
  return u as User
}

export function AuthProvider({ children }: PropsWithChildren) {
  const [user, setUser] = useState<User | null>(() => loadUserFromStorage())

  useEffect(() => {
    function handleUnauthorized() {
      setUser(null)
    }
    window.addEventListener(AUTH_UNAUTHORIZED_EVENT, handleUnauthorized)
    return () => {
      window.removeEventListener(AUTH_UNAUTHORIZED_EVENT, handleUnauthorized)
    }
  }, [])

  const setSession = useCallback((s: AuthSession) => {
    authStorage.access = s.access
    authStorage.refresh = s.refresh
    authStorage.user = s.user
    setUser(s.user)
  }, [])

  const login = useCallback(
    async (email: string, password: string) => {
      const session = await authApi.login(email, password)
      setSession(session)
    },
    [setSession],
  )

  const register = useCallback(
    async (payload: { name: string; email: string; password: string; confirmPassword: string }) => {
      const session = await authApi.register(payload)
      setSession(session)
    },
    [setSession],
  )

  const logout = useCallback(() => {
    authApi.logout()
    setUser(null)
  }, [])

  const value = useMemo<AuthCtx>(
    () => ({
      user,
      isAuthenticated: Boolean(user && authStorage.access),
      login,
      register,
      logout,
    }),
    [user, login, register, logout],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
