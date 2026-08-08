import axios from 'axios'
import { API_BASE_URL } from '../config'

export const AUTH_UNAUTHORIZED_EVENT = 'cw_auth_unauthorized'

export const http = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
})

export const authStorage = {
  get access() {
    return localStorage.getItem('cw_access')
  },
  set access(v: string | null) {
    if (v) localStorage.setItem('cw_access', v)
    else localStorage.removeItem('cw_access')
  },
  get refresh() {
    return localStorage.getItem('cw_refresh')
  },
  set refresh(v: string | null) {
    if (v) localStorage.setItem('cw_refresh', v)
    else localStorage.removeItem('cw_refresh')
  },
  get user() {
    const raw = localStorage.getItem('cw_user')
    if (!raw) return null
    try {
      return JSON.parse(raw) as unknown
    } catch {
      return null
    }
  },
  set user(v: unknown | null) {
    if (v) localStorage.setItem('cw_user', JSON.stringify(v))
    else localStorage.removeItem('cw_user')
  },
  clear() {
    localStorage.removeItem('cw_access')
    localStorage.removeItem('cw_refresh')
    localStorage.removeItem('cw_user')
  },
}

// Request interceptor to attach Bearer token
http.interceptors.request.use((config) => {
  const token = authStorage.access
  if (token) {
    config.headers.set('Authorization', `Bearer ${token}`)
  }
  return config
})

// Interceptor for 401 response & automatic token refresh
let isRefreshing = false
let failedQueue: Array<{
  resolve: (token: string) => void
  reject: (err: unknown) => void
}> = []

const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error)
    } else if (token) {
      prom.resolve(token)
    }
  })
  failedQueue = []
}

http.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
      const url = originalRequest.url ?? ''
      // Don't attempt token refresh if the failed request was a login/register/refresh request
      if (url.includes('/token/') || url.includes('/register/')) {
        return Promise.reject(error)
      }

      const refreshToken = authStorage.refresh
      if (!refreshToken) {
        authStorage.clear()
        window.dispatchEvent(new Event(AUTH_UNAUTHORIZED_EVENT))
        return Promise.reject(error)
      }

      if (isRefreshing) {
        return new Promise<string>((resolve, reject) => {
          failedQueue.push({ resolve, reject })
        })
          .then((token) => {
            originalRequest.headers.set('Authorization', `Bearer ${token}`)
            return http(originalRequest)
          })
          .catch((err) => Promise.reject(err))
      }

      originalRequest._retry = true
      isRefreshing = true

      try {
        const res = await axios.post<{ access: string; refresh?: string }>(
          `${API_BASE_URL}/api/token/refresh/`,
          { refresh: refreshToken }
        )
        const newAccess = res.data.access
        authStorage.access = newAccess
        if (res.data.refresh) {
          authStorage.refresh = res.data.refresh
        }

        originalRequest.headers.set('Authorization', `Bearer ${newAccess}`)
        processQueue(null, newAccess)
        return http(originalRequest)
      } catch (refreshErr) {
        processQueue(refreshErr, null)
        authStorage.clear()
        window.dispatchEvent(new Event(AUTH_UNAUTHORIZED_EVENT))
        return Promise.reject(refreshErr)
      } finally {
        isRefreshing = false
      }
    }

    return Promise.reject(error)
  }
)
