import { useEffect, useState } from 'react'
import { api } from '../lib/api'
import type { AuthResponse, User } from '../lib/types'

export function useAuth() {
  const [user, setUser] = useState<User | null>(() => {
    const stored = localStorage.getItem('gestao_ponto_user')
    return stored ? JSON.parse(stored) : null
  })
  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem('gestao_ponto_token')
  })
  // Se já temos token e usuário no cache, NÃO bloqueia a tela! O carregamento é instantâneo (0ms).
  const [isLoading, setIsLoading] = useState<boolean>(() => {
    const tok = localStorage.getItem('gestao_ponto_token')
    const usr = localStorage.getItem('gestao_ponto_user')
    return Boolean(tok && !usr)
  })
  const [error, setError] = useState<string | null>(null)

  // Validação silenciosa de sessão em background no mount inicial (Stale-While-Revalidate)
  useEffect(() => {
    const initialToken = localStorage.getItem('gestao_ponto_token')
    if (initialToken) {
      api.get<{ user: User }>('/auth/me')
        .then((res) => {
          setUser(res.data.user)
          localStorage.setItem('gestao_ponto_user', JSON.stringify(res.data.user))
        })
        .catch(() => {
          logout()
        })
        .finally(() => {
          setIsLoading(false)
        })
    } else {
      setIsLoading(false)
    }
  }, []) // Apenas no primeiro mount da aplicação!

  const saveAuthSession = (authData: AuthResponse) => {
    setUser(authData.user)
    setToken(authData.token)
    localStorage.setItem('gestao_ponto_token', authData.token)
    localStorage.setItem('gestao_ponto_user', JSON.stringify(authData.user))
    setError(null)
  }

  const login = async (email: string, password: string) => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await api.post<AuthResponse>('/auth/login', { email, password })
      saveAuthSession(response.data)
      return response.data.user
    } catch (err: any) {
      const msg = err.response?.data?.message || err.response?.data?.errors?.email?.[0] || 'Erro ao realizar login.'
      setError(msg)
      throw new Error(msg)
    } finally {
      setIsLoading(false)
    }
  }

  const register = async (name: string, email: string, password: string, timezone = 'America/Sao_Paulo') => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await api.post<AuthResponse>('/auth/register', {
        name,
        email,
        password,
        timezone,
      })
      saveAuthSession(response.data)
      return response.data.user
    } catch (err: any) {
      const msg = err.response?.data?.message || err.response?.data?.errors?.email?.[0] || 'Erro ao realizar cadastro.'
      setError(msg)
      throw new Error(msg)
    } finally {
      setIsLoading(false)
    }
  }

  const logout = async () => {
    try {
      if (token) {
        await api.post('/auth/logout')
      }
    } catch {
      // Ignora erro de rede ao sair
    } finally {
      setUser(null)
      setToken(null)
      localStorage.removeItem('gestao_ponto_token')
      localStorage.removeItem('gestao_ponto_user')
    }
  }

  const updateProfile = async (data: Partial<Pick<User, 'name' | 'timezone'>>) => {
    const response = await api.put<{ user: User }>('/auth/me', data)
    setUser(response.data.user)
    localStorage.setItem('gestao_ponto_user', JSON.stringify(response.data.user))
    return response.data.user
  }

  return {
    user,
    token,
    isAuthenticated: Boolean(token && user),
    isLoading,
    error,
    login,
    register,
    logout,
    updateProfile,
    clearError: () => setError(null),
  }
}
