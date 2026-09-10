import React, { useState, useEffect, useRef } from 'react'
import { X, Loader2, AlertCircle, Calendar as CalendarIcon, Clock } from 'lucide-react'
import type { TimeEntry } from '../../lib/types'
import { Calendar } from '@/components/ui/calendar'
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
  const [isCalendarOpen, setIsCalendarOpen] = useState(false)
  const calendarRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!isCalendarOpen) return
    const handleClickOutside = (e: MouseEvent) => {
      if (calendarRef.current && !calendarRef.current.contains(e.target as Node)) {
        setIsCalendarOpen(false)
      }
    }
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsCalendarOpen(false)
    }
    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('keydown', handleEsc)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleEsc)
    }
  }, [isCalendarOpen])

  const parseDateFromInput = (str: string): Date | undefined => {
    const parts = str.split('/')
    if (parts.length === 3 && parts[2]?.length === 4) {
      const d = parseInt(parts[0], 10)
      const m = parseInt(parts[1], 10) - 1
      const y = parseInt(parts[2], 10)
      const parsed = new Date(y, m, d)
      if (!isNaN(parsed.getTime())) return parsed
    }
    return undefined
  }

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
        <div className="p-3 rounded-[18px] bg-[#1c1c20] border border-[#ef4444]/30 text-[#ef4444] text-xs flex items-center gap-2">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <div>
        <label className="block text-xs font-medium uppercase tracking-[0.05em] text-[#a1a1aa] mb-1.5">
          Tipo de Registro
        </label>
        <div className="px-3.5 py-2 bg-[#1c1c20] border border-[#27272a] rounded-[18px] text-xs font-medium text-[#fafafa]">
          {typeLabels[entry.type] || entry.type}
        </div>
      </div>

      {/* Data e Horário separados com teclado numérico e botão de calendário */}
      <div className="grid grid-cols-2 gap-3">
        <div className="relative" ref={calendarRef}>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs font-medium uppercase tracking-[0.05em] text-[#a1a1aa] flex items-center gap-1.5">
              <CalendarIcon className="h-3.5 w-3.5 text-[#fafafa]" />
              <span>Data</span>
            </label>
            <button
              type="button"
              onClick={() => setIsCalendarOpen((prev) => !prev)}
              title="Abrir calendário para escolher data"
              className="flex items-center gap-1 text-[10px] text-[#a1a1aa] hover:text-[#fafafa] bg-[#1c1c20] hover:bg-[#27272a] border border-[#27272a] px-1.5 py-0.5 rounded-[8px] transition-colors cursor-pointer"
            >
              <CalendarIcon className="h-3 w-3 text-[#fafafa]" />
              <span>Calendário</span>
            </button>
          </div>
          <div className="relative">
            <input
              type="text"
              inputMode="numeric"
              value={dateInput}
              onChange={handleDateChange}
              onBlur={handleDateBlur}
              placeholder="DD/MM/AAAA"
              maxLength={10}
              required
              className="w-full pl-3.5 pr-9 py-2 rounded-[18px] border border-[#27272a] bg-[#1c1c20] focus:bg-[#27272a] text-[#fafafa] font-mono text-sm tracking-wider focus:outline-none focus:border-[#fafafa] transition-colors"
            />
            <button
              type="button"
              onClick={() => setIsCalendarOpen((prev) => !prev)}
              title="Abrir calendário"
              className="absolute right-2.5 top-2 text-[#a1a1aa] hover:text-[#fafafa] p-1 rounded-[8px] transition-colors cursor-pointer"
            >
              <CalendarIcon className="h-3.5 w-3.5" />
            </button>
          </div>
          <span className="text-[10px] text-[#a1a1aa] mt-1 block">Apenas números</span>

          {/* Componente de Calendário solicitado */}
          {isCalendarOpen && (
            <div className="absolute left-0 top-full mt-2 z-50 animate-in fade-in zoom-in-95 duration-150">
              <Calendar
                mode="single"
                selected={parseDateFromInput(dateInput)}
                onSelect={(selectedDate) => {
                  if (selectedDate) {
                    const dayStr = String(selectedDate.getDate()).padStart(2, '0')
                    const monthStr = String(selectedDate.getMonth() + 1).padStart(2, '0')
                    const yearStr = selectedDate.getFullYear()
                    setDateInput(`${dayStr}/${monthStr}/${yearStr}`)
                    setIsCalendarOpen(false)
                  }
                }}
                className="rounded-lg border"
                captionLayout="dropdown"
                disabled={(d) => {
                  const today = new Date()
                  today.setHours(23, 59, 59, 999)
                  return d > today
                }}
              />
            </div>
          )}
        </div>

        <div>
          <label className="block text-xs font-medium uppercase tracking-[0.05em] text-[#a1a1aa] mb-1.5 flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5 text-[#fafafa]" />
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
            className="w-full px-3.5 py-2 rounded-[18px] border border-[#27272a] bg-[#1c1c20] focus:bg-[#27272a] text-[#fafafa] font-mono text-sm tracking-wider focus:outline-none focus:border-[#fafafa] transition-colors"
          />
          <span className="text-[10px] text-[#a1a1aa] mt-1 block">Ex: 0830 ➔ 08:30</span>
        </div>
      </div>

      <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#27272a]">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 text-xs font-medium text-[#fafafa] bg-[#1c1c20] hover:bg-[#27272a] border border-[#27272a] rounded-[18px] transition-colors cursor-pointer"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={isSaving}
          className="px-5 py-2 bg-[#fafafa] hover:bg-[#e4e4e7] text-[#09090b] text-xs font-medium rounded-[18px] transition-colors flex items-center gap-1.5 disabled:opacity-70 cursor-pointer"
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#000000]/70 backdrop-blur-xs p-4 animate-in fade-in duration-150">
      <div className="bg-[#121214] w-full max-w-md rounded-[24px] card-shadow border border-[#27272a] overflow-hidden text-[#fafafa]">
        <div className="px-6 py-4 border-b border-[#27272a] flex items-center justify-between">
          <h3 className="font-semibold text-[#fafafa] text-sm tracking-tight">Ajustar Registro de Ponto</h3>
          <button
            onClick={onClose}
            className="text-[#a1a1aa] hover:text-[#fafafa] p-1.5 rounded-[18px] hover:bg-[#1c1c20] transition-colors cursor-pointer"
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
