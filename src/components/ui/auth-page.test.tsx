import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { AuthPage } from './auth-page'
import React from 'react'

const queryClient = new QueryClient()

describe('AuthPage Component', () => {
  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )

  it('renders auth page with branding, social buttons and email form', () => {
    render(<AuthPage />, { wrapper })

    expect(screen.getAllByText(/Gestão de Ponto/i)[0]).toBeDefined()
    expect(screen.getByText('Sign In or Join Now!')).toBeDefined()
    expect(screen.getByRole('button', { name: /Continue with Google/i })).toBeDefined()
    expect(screen.getByRole('button', { name: /Entrar no Sistema/i })).toBeDefined()
  })

  it('opens Google login modal and triggers onLoginWithGoogle on account selection', async () => {
    const handleGoogle = vi.fn().mockResolvedValue(undefined)

    render(<AuthPage onLoginWithGoogle={handleGoogle} />, { wrapper })

    const googleBtn = screen.getByRole('button', { name: /Continue with Google/i })
    fireEvent.click(googleBtn)

    // Modal opens
    expect(screen.getByText('Fazer login com o Google')).toBeDefined()
    expect(screen.getByText('Lucas Lougon')).toBeDefined()

    // Click on Lucas account
    const lucasAccountBtn = screen.getByText('Lucas Lougon').closest('button')
    expect(lucasAccountBtn).not.toBeNull()
    fireEvent.click(lucasAccountBtn!)

    expect(handleGoogle).toHaveBeenCalledWith(
      expect.objectContaining({
        email: 'lucas@gmail.com',
        name: 'Lucas Lougon',
      })
    )
  })

  it('submits email and password via onLoginWithEmail', async () => {
    const handleEmail = vi.fn().mockResolvedValue(undefined)

    render(<AuthPage onLoginWithEmail={handleEmail} />, { wrapper })

    fireEvent.change(screen.getByPlaceholderText('seu.email@exemplo.com'), {
      target: { value: 'test@example.com' },
    })
    fireEvent.change(screen.getByPlaceholderText('Sua senha'), {
      target: { value: 'mypassword123' },
    })

    fireEvent.click(screen.getByRole('button', { name: /Entrar no Sistema/i }))

    expect(handleEmail).toHaveBeenCalledWith('test@example.com', 'mypassword123')
  })
})
