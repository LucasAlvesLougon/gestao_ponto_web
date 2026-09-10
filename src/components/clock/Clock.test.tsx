import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { ClockActionCard } from './ClockActionCard'
import { DailyEntriesList } from './DailyEntriesList'
import { ManualEntryModal } from './ManualEntryModal'
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

describe('ManualEntryModal Component', () => {
  it('blocks submission of future timestamp and shows error message', async () => {
    const handleSave = vi.fn().mockResolvedValue({})
    const handleClose = vi.fn()

    render(
      <ManualEntryModal
        isOpen={true}
        onClose={handleClose}
        onSave={handleSave}
        initialType="CLOCK_IN"
        initialDate="2099-12-31"
        isSaving={false}
      />
    )

    // Try submitting with future date
    fireEvent.click(screen.getByRole('button', { name: /Salvar Entrada e Continuar/i }))

    expect(await screen.findByText('Não é permitido registrar ponto para data ou horário futuro.')).toBeDefined()
    expect(handleSave).not.toHaveBeenCalled()
    expect(handleClose).not.toHaveBeenCalled()
  })

  it('keeps modal open and advances layer on CLOCK_IN, and closes on CLOCK_OUT', async () => {
    const handleSave = vi.fn().mockResolvedValue({})
    const handleClose = vi.fn()

    render(
      <ManualEntryModal
        isOpen={true}
        onClose={handleClose}
        onSave={handleSave}
        initialType="CLOCK_IN"
        initialDate="2026-01-01"
        isSaving={false}
      />
    )

    // Submit Entrada
    fireEvent.click(screen.getByRole('button', { name: /Salvar Entrada e Continuar/i }))

    expect(handleSave).toHaveBeenCalledTimes(1)
    expect(handleClose).not.toHaveBeenCalled()

    // Modal stays open and shows success banner and next step button
    expect(await screen.findByText(/Entrada registrada com sucesso! Prossiga informando o Início do Intervalo/i)).toBeDefined()
    expect(screen.getByRole('button', { name: /Salvar Início Intervalo e Continuar/i })).toBeDefined()
  })
})
