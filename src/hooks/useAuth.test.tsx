import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { renderHook, act } from '@testing-library/react'
import { describe, expect, it, vi, beforeEach } from 'vitest'
import { useAuth } from './useAuth'
import { api } from '../lib/api'
import React from 'react'

vi.mock('../lib/api', () => ({
  api: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
  },
}))

describe('useAuth Hook', () => {
  let queryClient: QueryClient

  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )

  beforeEach(() => {
    localStorage.clear()
    vi.clearAllMocks()
    ;(api.get as any).mockResolvedValue({ data: { user: null } })
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
      },
    })
  })

  it('initializes as unauthenticated when no credentials exist in storage', () => {
    const { result } = renderHook(() => useAuth(), { wrapper })

    expect(result.current.isAuthenticated).toBe(false)
    expect(result.current.user).toBeNull()
    expect(result.current.token).toBeNull()
    expect(result.current.isLoading).toBe(false)
  })

  it('performs instant optimistic logout in 0ms without waiting for backend network call', async () => {
    localStorage.setItem('gestao_ponto_token', 'mock_token_123')
    localStorage.setItem(
      'gestao_ponto_user',
      JSON.stringify({ id: 1, name: 'Lucas', email: 'lucas@test.com', timezone: 'America/Sao_Paulo' })
    )

    // Simula atraso na resposta de logout do backend
    let resolveLogout: any
    const logoutPromise = new Promise((resolve) => {
      resolveLogout = resolve
    })
    ;(api.post as any).mockReturnValue(logoutPromise)

    const { result } = renderHook(() => useAuth(), { wrapper })

    expect(result.current.isAuthenticated).toBe(true)

    // Aciona logout
    act(() => {
      result.current.logout()
    })

    // Instantaneamente em 0ms (síncrono na UI):
    expect(result.current.isAuthenticated).toBe(false)
    expect(result.current.user).toBeNull()
    expect(result.current.token).toBeNull()
    expect(localStorage.getItem('gestao_ponto_token')).toBeNull()
    expect(localStorage.getItem('gestao_ponto_user')).toBeNull()

    // Requisição para a API foi disparada em background
    expect(api.post).toHaveBeenCalledWith('/auth/logout')

    resolveLogout({ data: { message: 'Sessão encerrada' } })
  })

  it('pre-warms TanStack Query cache with initial_data upon login', async () => {
    const mockUser = { id: 1, name: 'Lucas', email: 'lucas@test.com', timezone: 'America/Sao_Paulo' }
    const mockInitialData = {
      date: '2026-09-10',
      timezone: 'America/Sao_Paulo',
      next_expected_type: 'BREAK_START' as const,
      entries: [
        {
          id: 10,
          user_id: 1,
          type: 'CLOCK_IN' as const,
          registered_at: '2026-09-10T08:00:00',
          is_edited: false,
        },
      ],
      summary: {
        date: '2026-09-10',
        total_worked_minutes: 240,
        total_worked_formatted: '04:00',
        target_minutes: 480,
        target_formatted: '08:00',
        balance_minutes: -240,
        balance_formatted: '-04:00',
        is_positive_balance: false,
        entries_count: 1,
        is_complete: false,
      },
    }

    ;(api.post as any).mockResolvedValueOnce({
      data: {
        message: 'Login realizado com sucesso.',
        user: mockUser,
        token: 'token_abc_123',
        initial_data: mockInitialData,
      },
    })

    const { result } = renderHook(() => useAuth(), { wrapper })

    await act(async () => {
      await result.current.login('lucas@test.com', 'password123')
    })

    expect(result.current.isAuthenticated).toBe(true)
    expect(result.current.user?.name).toBe('Lucas')

    // Verifica que o cache foi pré-aquecido para time-entries e summary
    const cachedEntries: any = queryClient.getQueryData(['time-entries', '2026-09-10'])
    expect(cachedEntries).toBeDefined()
    expect(cachedEntries.next_expected_type).toBe('BREAK_START')
    expect(cachedEntries.entries.length).toBe(1)
    expect(cachedEntries.entries[0].type).toBe('CLOCK_IN')

    const cachedSummary: any = queryClient.getQueryData(['summary', 'daily', '2026-09-10'])
    expect(cachedSummary).toBeDefined()
    expect(cachedSummary.summary.total_worked_formatted).toBe('04:00')
  })

  it('processes Google credential and stores last_google_email', async () => {
    const mockUser = { id: 2, name: 'Lucas Lougon', email: 'lucas@gmail.com', timezone: 'America/Sao_Paulo' }
    ;(api.post as any).mockResolvedValueOnce({
      data: {
        message: 'Login com Google realizado com sucesso.',
        user: mockUser,
        token: 'google_token_789',
      },
    })

    const { result } = renderHook(() => useAuth(), { wrapper })

    await act(async () => {
      await result.current.processGoogleToken('mock_credential_jwt_string')
    })

    expect(api.post).toHaveBeenCalledWith('/auth/google', { idToken: 'mock_credential_jwt_string' })
    expect(result.current.isAuthenticated).toBe(true)
    expect(result.current.user?.email).toBe('lucas@gmail.com')
    expect(localStorage.getItem('last_google_email')).toBe('lucas@gmail.com')
    expect(localStorage.getItem('gestao_ponto_token')).toBe('google_token_789')
  })
})
