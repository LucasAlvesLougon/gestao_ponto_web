import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { ClockActionCard } from './ClockActionCard'
import { DailyEntriesList } from './DailyEntriesList'
import type { TimeEntry } from '../../lib/types'

describe('Clock Components', () => {
  it('renders ClockActionCard and triggers onRecord on click', () => {
    const handleRecord = vi.fn().mockResolvedValue({})

    render(
      <ClockActionCard
        nextExpectedType="CLOCK_IN"
        onRecord={handleRecord}
        isRecording={false}
        timezone="America/Sao_Paulo"
      />
    )

    expect(screen.getByText('Registrar Entrada')).toBeDefined()
    expect(screen.getByText('Status: Fora de Expediente')).toBeDefined()

    fireEvent.click(screen.getByRole('button', { name: /Registrar Entrada/i }))
    expect(handleRecord).toHaveBeenCalledWith('CLOCK_IN')
  })

  it('renders DailyEntriesList with entries and edited badge', () => {
    const entries: TimeEntry[] = [
      {
        id: 1,
        user_id: 1,
        type: 'CLOCK_IN',
        registered_at: '2026-09-09T11:00:00.000Z',
        is_edited: true,
        edit_reason: 'Esqueci de bater ponto',
      },
    ]

    render(
      <DailyEntriesList
        entries={entries}
        isLoading={false}
        onUpdate={vi.fn()}
        onDelete={vi.fn()}
        isUpdating={false}
        isDeleting={false}
      />
    )

    expect(screen.getByText('Histórico de Hoje')).toBeDefined()
    expect(screen.getByText('Entrada')).toBeDefined()
    expect(screen.getByText('Ajustado')).toBeDefined()
    expect(screen.getByText(/Motivo: Esqueci de bater ponto/i)).toBeDefined()
  })

  it('renders empty state when no entries', () => {
    render(
      <DailyEntriesList
        entries={[]}
        isLoading={false}
        onUpdate={vi.fn()}
        onDelete={vi.fn()}
        isUpdating={false}
        isDeleting={false}
      />
    )

    expect(screen.getByText('Nenhum ponto registrado hoje')).toBeDefined()
  })
})
