import React, { useState } from 'react'
import { X, Loader2, AlertCircle, Calendar, Clock } from 'lucide-react'
import type { TimeEntry } from '../../lib/types'
import {
  formatNumericDate,
  autoCorrectDate,
  formatNumericTime,
  autoCorrectTime,
} from './ManualEntryModal'

interface EditEntryModalProps {
  entry: TimeEntry | null
  onClose: () => void
  onSave: (id: number, time: string, reason?: string) => Promise<any>
  isSaving: boolean
}

interface EditEntryFormProps {
  entry: TimeEntry
  onClose: () => void
  onSave: (id: number, time: string, reason?: string) => Promise<any>
  isSaving: boolean
}

const EditEntryForm: React.FC<EditEntryFormProps> = ({
  entry,
  onClose,
  onSave,
  isSaving,
}) => {
  const pad = (n: number) => String(n).padStart(2, '0')
  const entryDate = entry.registered_at ? new Date(entry.registered_at) : new Date()

  const [dateInput, setDateInput] = useState(() => {
    return `${pad(entryDate.getDate())}/${pad(entryDate.getMonth() + 1)}/${entryDate.getFullYear()}`
  })
  const [timeInput, setTimeInput] = useState(() => {
    return `${pad(entryDate.getHours())}:${pad(entryDate.getMinutes())}`
  })
  const [error, setError] = useState<string | null>(null)

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDateInput(formatNumericDate(e.target.value))
  }

  const handleDateBlur = () => {
    setDateInput(autoCorrectDate(dateInput))
  }

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTimeInput(formatNumericTime(e.target.value))
  }

  const handleTimeBlur = () => {
    setTimeInput(autoCorrectTime(timeInput))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const correctedDate = autoCorrectDate(dateInput)
    const correctedTime = autoCorrectTime(timeInput)

    const dateParts = correctedDate.split('/')
    if (dateParts.length !== 3 || dateParts[2].length !== 4) {
      setError('Informe a data no formato DD/MM/AAAA.')
      return
    }

    const timeParts = correctedTime.split(':')
    if (timeParts.length !== 2 || timeParts[0].length !== 2 || timeParts[1].length !== 2) {
      setError('Informe o horário no formato HH:mm.')
      return
    }

    const [d, m, y] = dateParts
    const [hh, mm] = timeParts

    // Validação: não permitir data ou horário posterior ao momento atual
    const dNum = parseInt(d, 10)
    const mNum = parseInt(m, 10) - 1
    const yNum = parseInt(y, 10)
    const hNum = parseInt(hh, 10)
    const minNum = parseInt(mm, 10)

    const inputDate = new Date(yNum, mNum, dNum, hNum, minNum)
    const now = new Date()
    if (inputDate.getTime() > now.getTime() + 60000) {
      setError('Não é permitido ajustar registro para data ou horário futuro.')
      return
    }

    setError(null)
    const isoDateTime = `${y}-${m}-${d}T${hh}:${mm}:00`

    try {
      await onSave(entry.id, isoDateTime)
      onClose()
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Erro ao atualizar registro de ponto.'
      setError(msg)
    }
  }

  const typeLabels: Record<string, string> = {
    CLOCK_IN: 'Entrada',
    BREAK_START: 'Início de Intervalo',
    BREAK_END: 'Retorno de Intervalo',
    CLOCK_OUT: 'Saída',
  }

  return (
    <form onSubmit={handleSubmit} className="p-6 space-y-4">
      {error && (
        <div className="p-3 rounded-[18px] bg-red-50 border border-red-200 text-[#e7000b] text-xs flex items-center gap-2">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <div>
        <label className="block text-xs font-medium uppercase tracking-[0.05em] text-[#737373] mb-1.5">
          Tipo de Registro
        </label>
        <div className="px-3.5 py-2 bg-[#f5f5f5] border border-[#e5e5e5] rounded-[18px] text-xs font-medium text-[#171717]">
          {typeLabels[entry.type] || entry.type}
        </div>
      </div>

      {/* Data e Horário separados com teclado numérico */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium uppercase tracking-[0.05em] text-[#737373] mb-1.5 flex items-center gap-1.5">
            <Calendar className="h-3.5 w-3.5 text-[#0a0a0a]" />
            <span>Data</span>
          </label>
          <input
            type="text"
            inputMode="numeric"
            value={dateInput}
            onChange={handleDateChange}
            onBlur={handleDateBlur}
            placeholder="DD/MM/AAAA"
            maxLength={10}
            required
            className="w-full px-3.5 py-2 rounded-[18px] border border-[#e5e5e5] bg-[#f5f5f5] focus:bg-[#ffffff] text-[#0a0a0a] font-mono text-sm tracking-wider focus:outline-none focus:ring-1 focus:ring-[#0a0a0a] transition-colors"
          />
          <span className="text-[10px] text-[#737373] mt-1 block">Apenas números</span>
        </div>

        <div>
          <label className="block text-xs font-medium uppercase tracking-[0.05em] text-[#737373] mb-1.5 flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5 text-[#0a0a0a]" />
            <span>Horário</span>
          </label>
          <input
            type="text"
            inputMode="numeric"
            value={timeInput}
            onChange={handleTimeChange}
            onBlur={handleTimeBlur}
            placeholder="HH:mm"
            maxLength={5}
            required
            className="w-full px-3.5 py-2 rounded-[18px] border border-[#e5e5e5] bg-[#f5f5f5] focus:bg-[#ffffff] text-[#0a0a0a] font-mono text-sm tracking-wider focus:outline-none focus:ring-1 focus:ring-[#0a0a0a] transition-colors"
          />
          <span className="text-[10px] text-[#737373] mt-1 block">Ex: 0830 ➔ 08:30</span>
        </div>
      </div>

      <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#e5e5e5]">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 text-xs font-medium text-[#0a0a0a] bg-[#f5f5f5] hover:bg-[#e5e5e5] rounded-[18px] transition-colors cursor-pointer"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={isSaving}
          className="px-5 py-2 bg-[#0a0a0a] hover:bg-[#171717] text-[#fafafa] text-xs font-medium rounded-[18px] transition-colors flex items-center gap-1.5 disabled:opacity-70 cursor-pointer"
        >
          {isSaving ? (
            <>
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
              <span>Salvando...</span>
            </>
          ) : (
            <span>Salvar Alteração</span>
          )}
        </button>
      </div>
    </form>
  )
}

export const EditEntryModal: React.FC<EditEntryModalProps> = ({
  entry,
  onClose,
  onSave,
  isSaving,
}) => {
  if (!entry) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0a0a0a]/40 backdrop-blur-xs p-4 animate-in fade-in duration-150">
      <div className="bg-[#ffffff] w-full max-w-md rounded-[24px] card-shadow border border-[#e5e5e5] overflow-hidden">
        <div className="px-6 py-4 border-b border-[#e5e5e5] flex items-center justify-between">
          <h3 className="font-semibold text-[#0a0a0a] text-sm tracking-tight">Ajustar Registro de Ponto</h3>
          <button
            onClick={onClose}
            className="text-[#737373] hover:text-[#0a0a0a] p-1.5 rounded-[18px] hover:bg-[#f5f5f5] transition-colors cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <EditEntryForm
          key={entry.id}
          entry={entry}
          onClose={onClose}
          onSave={onSave}
          isSaving={isSaving}
        />
      </div>
    </div>
  )
}
