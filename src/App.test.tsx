import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import App from './App'

const queryClient = new QueryClient()

describe('App Component', () => {
  it('renders login view by default when not authenticated', () => {
    render(
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    )
    expect(screen.getByText('Gestão de Ponto')).toBeDefined()
    expect(screen.getByRole('button', { name: /Entrar no Sistema/i })).toBeDefined()
  })
})
