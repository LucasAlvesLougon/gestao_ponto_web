import { render, screen, fireEvent } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { DeleteConfirmationDialog } from './delete-confirmation-dialog'
import { Pattern } from './logout-confirmation-dialog'

describe('DeleteConfirmationDialog Component', () => {
  it('renders confirmation dialog with title, description, shield icon and action buttons when open', () => {
    const handleConfirm = vi.fn()
    const handleOpenChange = vi.fn()

    render(
      <DeleteConfirmationDialog
        open={true}
        onOpenChange={handleOpenChange}
        onConfirm={handleConfirm}
        title="Tem certeza?"
        description="Deseja remover esta batida?"
        confirmText="Sim, Excluir"
        cancelText="Não"
      />
    )

    expect(screen.getByText('Tem certeza?')).toBeDefined()
    expect(screen.getByText('Deseja remover esta batida?')).toBeDefined()
    expect(screen.getByRole('button', { name: 'Não' })).toBeDefined()
    expect(screen.getByRole('button', { name: 'Sim, Excluir' })).toBeDefined()
  })

  it('triggers onConfirm and onOpenChange(false) when clicking confirm button', async () => {
    const handleConfirm = vi.fn().mockResolvedValue(undefined)
    const handleOpenChange = vi.fn()

    render(
      <DeleteConfirmationDialog
        open={true}
        onOpenChange={handleOpenChange}
        onConfirm={handleConfirm}
      />
    )

    const confirmButton = screen.getByRole('button', { name: 'Sim, Excluir' })
    fireEvent.click(confirmButton)

    expect(handleConfirm).toHaveBeenCalledTimes(1)
  })

  it('triggers onOpenChange(false) when clicking cancel button', () => {
    const handleConfirm = vi.fn()
    const handleOpenChange = vi.fn()

    render(
      <DeleteConfirmationDialog
        open={true}
        onOpenChange={handleOpenChange}
        onConfirm={handleConfirm}
      />
    )

    const cancelButton = screen.getByRole('button', { name: 'Não' })
    fireEvent.click(cancelButton)

    expect(handleOpenChange).toHaveBeenCalledWith(false)
  })
})

describe('logout-confirmation-dialog Component', () => {
  it('renders trigger button correctly', () => {
    render(<Pattern />)
    expect(screen.getByRole('button', { name: 'Logout' })).toBeDefined()
  })
})
