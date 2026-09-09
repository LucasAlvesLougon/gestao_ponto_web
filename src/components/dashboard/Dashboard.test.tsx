import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { DailySummaryCard } from './DailySummaryCard'
import { MonthlyDashboard } from './MonthlyDashboard'
import type { DailySummary } from '../../lib/types'

const queryClient = new QueryClient()

describe('Dashboard Components', () => {
  it('renders DailySummaryCard with metrics and positive balance', () => {
    const summary: DailySummary = {
      date: '2026-09-09',
      total_worked_minutes: 510,
      total_worked_formatted: '08h 30m',
      target_minutes: 480,
      target_formatted: '08h 00m',
      balance_minutes: 30,
      balance_formatted: '+00h 30m',
      is_positive_balance: true,
      entries_count: 4,
      is_complete: true,
    }

    render(<DailySummaryCard summary={summary} isLoading={false} />)

    expect(screen.getByText('Resumo da Jornada')).toBeDefined()
    expect(screen.getByText('08h 30m')).toBeDefined()
    expect(screen.getByText('08h 00m')).toBeDefined()
    expect(screen.getByText('+00h 30m')).toBeDefined()
    expect(screen.getByText('Meta Atingida!')).toBeDefined()
  })

  it('renders MonthlyDashboard layout and headers', () => {
    render(
      <QueryClientProvider client={queryClient}>
        <MonthlyDashboard />
      </QueryClientProvider>
    )

    expect(screen.getByText('Banco de Horas Mensal')).toBeDefined()
    expect(screen.getByText('Total Trabalhado')).toBeDefined()
    expect(screen.getByText('Meta do Período')).toBeDefined()
    expect(screen.getByText('Saldo do Mês')).toBeDefined()
    expect(screen.getByText('Detalhamento por Dia')).toBeDefined()
  })
})
