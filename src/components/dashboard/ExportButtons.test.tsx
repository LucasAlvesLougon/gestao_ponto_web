import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { ExportButtons } from './ExportButtons'
import { api } from '../../lib/api'

vi.mock('../../lib/api', () => ({
  api: {
    get: vi.fn().mockResolvedValue({ data: 'mock,csv,data' }),
  },
}))

describe('ExportButtons Component', () => {
  it('renders export buttons and triggers CSV download on click', async () => {
    render(<ExportButtons month="2026-09" />)

    const csvButton = screen.getByRole('button', { name: /Exportar CSV/i })
    const pdfButton = screen.getByRole('button', { name: /Imprimir \/ PDF/i })

    expect(csvButton).toBeDefined()
    expect(pdfButton).toBeDefined()

    // Mock URL.createObjectURL and revokeObjectURL
    window.URL.createObjectURL = vi.fn().mockReturnValue('blob:http://localhost/mock')
    window.URL.revokeObjectURL = vi.fn()

    fireEvent.click(csvButton)

    expect(api.get).toHaveBeenCalledWith('/reports/csv?month=2026-09', {
      responseType: 'blob',
    })
  })
})
