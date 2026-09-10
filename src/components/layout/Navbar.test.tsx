import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { Navbar } from './Navbar'
import type { User } from '../../lib/types'

describe('Navbar Component', () => {
  const user: User = {
    id: 1,
    name: 'lucas alves lougon',
    email: 'lucas@example.com',
    timezone: 'America/Sao_Paulo',
    created_at: '2026-01-01T00:00:00Z',
    updated_at: '2026-01-01T00:00:00Z',
  }

  it('renders capitalized user name and does not render timezone/region under name', () => {
    render(
      <Navbar
        user={user}
        activeTab="clock"
        onTabChange={vi.fn()}
        onOpenSettings={vi.fn()}
        onLogout={vi.fn()}
      />
    )

    // Nome deve estar formatado com primeira letra maiuscula
    expect(screen.getByText('Lucas Alves Lougon')).toBeDefined()
    expect(screen.getByText('L')).toBeDefined()

    // Regiao / timezone nao deve ser renderizada no header
    expect(screen.queryByText('America/Sao_Paulo')).toBeNull()
  })
})
