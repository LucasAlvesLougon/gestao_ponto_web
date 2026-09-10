import { useEffect, useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { api } from '../lib/api'
import type { AuthResponse, User } from '../lib/types'

export function useAuth() {
  const queryClient = useQueryClient()

  const [user, setUser] = useState<User | null>(() => {
    const stored = localStorage.getItem('gestao_ponto_user')
    return stored ? JSON.parse(stored) : null
  })
  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem('gestao_ponto_token')
  })
  // isCheckingSession é true APENAS quando há um token salvo mas ainda não temos os dados do usuário em cache
  const [isCheckingSession, setIsCheckingSession] = useState<boolean>(() => {
    const tok = localStorage.getItem('gestao_ponto_token')
    const usr = localStorage.getItem('gestao_ponto_user')
    return Boolean(tok && !usr)
  })
  // isSubmitting indica submissão de formulário de login ou registro
  const [isSubmitting, setIsSubmitting] = useState(false)
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
          setIsCheckingSession(false)
        })
    } else {
      setIsCheckingSession(false)
    }
  }, [])

  const saveAuthSession = (authData: AuthResponse) => {
    setUser(authData.user)
    setToken(authData.token)
    localStorage.setItem('gestao_ponto_token', authData.token)
    localStorage.setItem('gestao_ponto_user', JSON.stringify(authData.user))
    setError(null)
  }

  const login = async (email: string, password: string) => {
    setIsSubmitting(true)
    setError(null)
    try {
      const response = await api.post<AuthResponse>('/auth/login', { email, password })

      // Pré-aquece o cache do TanStack Query imediatamente com os dados retornados no login
      if (response.data.initial_data) {
        const init = response.data.initial_data
        queryClient.setQueryData(['time-entries', init.date], {
          date: init.date,
          timezone: init.timezone,
          next_expected_type: init.next_expected_type,
          entries: init.entries,
        })
        queryClient.setQueryData(['summary', 'daily', init.date], {
          summary: init.summary,
        })
      }

      saveAuthSession(response.data)
      return response.data.user
    } catch (err: any) {
      const msg = err.response?.data?.message || err.response?.data?.errors?.email?.[0] || 'Erro ao realizar login.'
      setError(msg)
      throw new Error(msg)
    } finally {
      setIsSubmitting(false)
    }
  }

  const register = async (name: string, email: string, password: string, timezone = 'America/Sao_Paulo') => {
    setIsSubmitting(true)
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
      setIsSubmitting(false)
    }
  }

  // Logout otimista instantâneo (0ms de latência percebida)
  const logout = () => {
    const currentToken = token || localStorage.getItem('gestao_ponto_token')
    setUser(null)
    setToken(null)
    localStorage.removeItem('gestao_ponto_token')
    localStorage.removeItem('gestao_ponto_user')
    queryClient.clear()

    // Requisição assíncrona não-bloqueante para revogar o token no backend
    if (currentToken) {
      api.post('/auth/logout').catch(() => {
        // Silenciosamente ignora qualquer falha de rede ao deslogar
      })
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
    isLoading: isCheckingSession,
    isCheckingSession,
    isSubmitting,
    error,
    login,
    register,
    logout,
    updateProfile,
    clearError: () => setError(null),
  }
}
