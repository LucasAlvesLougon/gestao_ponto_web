import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { LoginForm } from './LoginForm'
import { RegisterForm } from './RegisterForm'

describe('Auth Components', () => {
  it('renders LoginForm and submits credentials', async () => {
    const handleLogin = vi.fn().mockResolvedValue(undefined)
    const handleSwitch = vi.fn()

    render(
      <LoginForm
        onLogin={handleLogin}
        onSwitchToRegister={handleSwitch}
        error={null}
        isLoading={false}
      />
    )

    expect(screen.getByText('Gestão de Ponto')).toBeDefined()
    expect(screen.getByPlaceholderText('seu@email.com')).toBeDefined()

    fireEvent.change(screen.getByPlaceholderText('seu@email.com'), {
      target: { value: 'user@test.com' },
    })
    fireEvent.change(screen.getByPlaceholderText('••••••••'), {
      target: { value: 'password123' },
    })

    fireEvent.click(screen.getByRole('button', { name: /Entrar no Sistema/i }))

    expect(handleLogin).toHaveBeenCalledWith('user@test.com', 'password123')
  })

  it('renders RegisterForm and switches to login', () => {
    const handleRegister = vi.fn().mockResolvedValue(undefined)
    const handleSwitch = vi.fn()

    render(
      <RegisterForm
        onRegister={handleRegister}
        onSwitchToLogin={handleSwitch}
        error="E-mail inválido"
        isLoading={false}
      />
    )

    expect(screen.getByText('Criar Nova Conta')).toBeDefined()
    expect(screen.getByText('E-mail inválido')).toBeDefined()

    fireEvent.click(screen.getByRole('button', { name: /Fazer login/i }))
    expect(handleSwitch).toHaveBeenCalled()
  })
})
