import type { AuthSession, TokenResponse } from '../types'
import { http, authStorage } from './http'

export async function login(email: string, password: string): Promise<AuthSession> {
  const res = await http.post<TokenResponse>('/token/', { email, password })
  authStorage.access = res.data.access
  authStorage.refresh = res.data.refresh
  authStorage.user = {
    id: res.data.id,
    first_name: res.data.first_name,
    last_name: res.data.last_name,
    email: res.data.email,
  }
  return {
    user: {
      id: res.data.id,
      first_name: res.data.first_name,
      last_name: res.data.last_name,
      email: res.data.email,
    },
    access: res.data.access,
    refresh: res.data.refresh,
  }
}

export async function register(payload: {
  name: string
  email: string
  password: string
  confirmPassword: string
}): Promise<AuthSession> {
  const res = await http.post<TokenResponse>('/register/', {
    name: payload.name,
    email: payload.email,
    password: payload.password,
    'confirm-password': payload.confirmPassword,
  })
  authStorage.access = res.data.access
  authStorage.refresh = res.data.refresh
  authStorage.user = {
    id: res.data.id,
    first_name: res.data.first_name,
    last_name: res.data.last_name,
    email: res.data.email,
  }
  return {
    user: {
      id: res.data.id,
      first_name: res.data.first_name,
      last_name: res.data.last_name,
      email: res.data.email,
    },
    access: res.data.access,
    refresh: res.data.refresh,
  }
}

export function logout() {
  authStorage.clear()
}

