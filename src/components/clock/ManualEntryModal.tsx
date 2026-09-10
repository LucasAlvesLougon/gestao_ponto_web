import React, { useState } from 'react'
import { X, Play, Coffee, ArrowLeft, LogOut, Check, Calendar, Clock, Loader2, Sparkles } from 'lucide-react'
import type { TimeEntryType } from '../../lib/types'

interface ManualEntryModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (type: TimeEntryType, customTime: string) => Promise<any>
  initialType?: TimeEntryType
  initialDate?: string // YYYY-MM-DD
  isSaving: boolean
}

// Utilitários de autoformatação e autocorreção numérica
export function formatNumericDate(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 8)
  if (digits.length <= 2) return digits
  if (digits.length <= 4) return `${digits.slice(0, 2)}/${digits.slice(2)}`
  return `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4)}`
}

export function autoCorrectDate(value: string): string {
  const digits = value.replace(/\D/g, '')
  if (digits.length < 8) return value

  let day = parseInt(digits.slice(0, 2), 10) || 1
  let month = parseInt(digits.slice(2, 4), 10) || 1
  let year = parseInt(digits.slice(4, 8), 10) || new Date().getFullYear()

  if (month > 12) month = 12
  if (month < 1) month = 1

  const maxDays = new Date(year, month, 0).getDate()
  if (day > maxDays) day = maxDays
  if (day < 1) day = 1

  return `${String(day).padStart(2, '0')}/${String(month).padStart(2, '0')}/${year}`
}

export function formatNumericTime(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 4)
  if (digits.length <= 2) return digits
  return `${digits.slice(0, 2)}:${digits.slice(2)}`
}

export function autoCorrectTime(value: string): string {
  const digits = value.replace(/\D/g, '')
  if (digits.length < 4) return value

  let hours = parseInt(digits.slice(0, 2), 10) || 0
  let minutes = parseInt(digits.slice(2, 4), 10) || 0

  if (hours > 23) hours = 23
  if (hours < 0) hours = 0
  if (minutes > 59) minutes = 59
  if (minutes < 0) minutes = 0

  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`
}

export const ManualEntryModal: React.FC<ManualEntryModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialType = 'CLOCK_IN',
  initialDate,
  isSaving,
}) => {
  if (!isOpen) return null

  // 4 layers de tipos de registro com identidade visual clara
  const layers: {
    type: TimeEntryType
    title: string
    subtitle: string
    icon: React.ComponentType<{ className?: string }>
  }[] = [
    {
      type: 'CLOCK_IN',
      title: 'Entrada',
      subtitle: 'Início do expediente',
      icon: Play,
    },
    {
      type: 'BREAK_START',
      title: 'Início Intervalo',
      subtitle: 'Almoço ou pausa',
      icon: Coffee,
    },
    {
      type: 'BREAK_END',
      title: 'Retorno Intervalo',
      subtitle: 'Retomar jornada',
      icon: ArrowLeft,
    },
    {
      type: 'CLOCK_OUT',
      title: 'Saída',
      subtitle: 'Fim do expediente',
      icon: LogOut,
    },
  ]

  const getInitialDateStr = () => {
    if (initialDate) {
      const [y, m, d] = initialDate.split('-')
      return `${d}/${m}/${y}`
    }
    const now = new Date()
    return `${String(now.getDate()).padStart(2, '0')}/${String(now.getMonth() + 1).padStart(2, '0')}/${now.getFullYear()}`
  }

  const getInitialTimeStr = () => {
    const now = new Date()
    return `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`
  }

  const [selectedType, setSelectedType] = useState<TimeEntryType>(initialType)
  const [dateInput, setDateInput] = useState(getInitialDateStr)
  const [timeInput, setTimeInput] = useState(getInitialTimeStr)
  const [error, setError] = useState<string | null>(null)
  const [successMsg, setSuccessMsg] = useState<string | null>(null)

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDateInput(formatNumericDate(e.target.value))
    setSuccessMsg(null)
  }

  const handleDateBlur = () => {
    setDateInput((prev) => autoCorrectDate(prev))
  }

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTimeInput(formatNumericTime(e.target.value))
    setSuccessMsg(null)
  }

  const handleTimeBlur = () => {
    setTimeInput((prev) => autoCorrectTime(prev))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccessMsg(null)

    const correctedDate = autoCorrectDate(dateInput)
    const correctedTime = autoCorrectTime(timeInput)

    const dateParts = correctedDate.split('/')
    const timeParts = correctedTime.split(':')

    if (dateParts.length !== 3 || dateParts[2].length !== 4) {
      setError('Por favor, informe uma data válida no formato DD/MM/AAAA.')
      return
    }

    if (timeParts.length !== 2 || timeParts[0].length !== 2 || timeParts[1].length !== 2) {
      setError('Por favor, informe um horário válido no formato HH:mm.')
      return
    }

    const [day, month, year] = dateParts
    const [hours, minutes] = timeParts

    // Validação: não permitir data ou horário posterior ao momento atual
    const dNum = parseInt(day, 10)
    const mNum = parseInt(month, 10) - 1
    const yNum = parseInt(year, 10)
    const hNum = parseInt(hours, 10)
    const minNum = parseInt(minutes, 10)

    const inputDate = new Date(yNum, mNum, dNum, hNum, minNum)
    const now = new Date()
    if (inputDate.getTime() > now.getTime() + 60000) {
      setError('Não é permitido registrar ponto para data ou horário futuro.')
      return
    }

    // Formato ISO esperado pela API: YYYY-MM-DDTHH:mm:00
    const isoDateTime = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}T${hours.padStart(2, '0')}:${minutes.padStart(2, '0')}:00`

    try {
      await onSave(selectedType, isoDateTime)

      // Regra: fechar a tela apenas na confirmação do registro de saída
      if (selectedType === 'CLOCK_OUT') {
        onClose()
      } else {
        // Mantém a tela aberta e avança o layer para a próxima etapa da jornada
        const nextSteps: Record<TimeEntryType, { next: TimeEntryType; msg: string }> = {
          CLOCK_IN: {
            next: 'BREAK_START',
            msg: 'Entrada registrada com sucesso! Prossiga informando o Início do Intervalo.',
          },
          BREAK_START: {
            next: 'BREAK_END',
            msg: 'Início de Intervalo registrado! Prossiga informando o Retorno do Intervalo.',
          },
          BREAK_END: {
            next: 'CLOCK_OUT',
            msg: 'Retorno de Intervalo registrado! Prossiga informando a Saída para finalizar.',
          },
          CLOCK_OUT: {
            next: 'CLOCK_OUT',
            msg: 'Saída registrada!',
          },
        }

        const step = nextSteps[selectedType]
        setSuccessMsg(step.msg)
        setSelectedType(step.next)
      }
    } catch (err: any) {
      const msg =
        err.response?.data?.message ||
        err.response?.data?.errors?.custom_time?.[0] ||
        err.response?.data?.errors?.registered_at?.[0] ||
        err.response?.data?.errors?.type?.[0] ||
        'Erro ao registrar marcação manual.'
      setError(msg)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0a0a0a]/40 backdrop-blur-xs p-4 animate-in fade-in duration-150">
      <div className="bg-[#ffffff] w-full max-w-lg rounded-[24px] card-shadow border border-[#e5e5e5] overflow-hidden text-[#0a0a0a]">
        {/* Top Header */}
        <div className="px-6 py-5 border-b border-[#e5e5e5] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-[10px] bg-[#f5f5f5] text-[#0a0a0a] border border-[#e5e5e5]">
              <Clock className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-semibold text-[#0a0a0a] text-sm tracking-tight">Marcação Manual de Ponto</h3>
              <p className="text-xs text-[#737373]">Escolha o tipo e informe data e hora pelo teclado</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-[18px] text-[#737373] hover:text-[#0a0a0a] hover:bg-[#f5f5f5] transition-colors cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {successMsg && (
          <div className="mx-6 mt-4 p-3 rounded-[18px] bg-[#fafafa] border border-[#e5e5e5] text-[#0a0a0a] text-xs flex items-center gap-2">
            <Check className="h-4 w-4 shrink-0 text-[#0a0a0a]" />
            <span>{successMsg}</span>
          </div>
        )}

        {error && (
          <div className="mx-6 mt-4 p-3 rounded-[18px] bg-red-50 border border-red-200 text-[#e7000b] text-xs flex items-center gap-2">
            <span>⚠️</span>
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* 4 LAYERS DE TIPOS DE REGISTRO */}
          <div>
            <label className="block text-xs font-medium uppercase tracking-[0.05em] text-[#737373] mb-3">
              1. Selecione o Tipo de Batida (4 Layers)
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {layers.map((layer) => {
                const Icon = layer.icon
                const isSelected = selectedType === layer.type

                return (
                  <button
                    key={layer.type}
                    type="button"
                    onClick={() => setSelectedType(layer.type)}
                    className={`p-3.5 rounded-[18px] border text-left transition-colors flex items-center gap-3 cursor-pointer ${
                      isSelected
                        ? 'border-[#0a0a0a] bg-[#fafafa] ring-1 ring-[#0a0a0a] text-[#0a0a0a]'
                        : 'border-[#e5e5e5] bg-[#ffffff] hover:bg-[#fafafa] text-[#0a0a0a]'
                    }`}
                  >
                    <div className={`p-2 rounded-[10px] shrink-0 ${isSelected ? 'bg-[#0a0a0a] text-[#fafafa]' : 'bg-[#f5f5f5] text-[#0a0a0a] border border-[#e5e5e5]'}`}>
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-semibold text-[#0a0a0a] flex items-center justify-between">
                        <span>{layer.title}</span>
                        {isSelected && <Check className="h-4 w-4 text-[#0a0a0a]" />}
                      </div>
                      <div className="text-[11px] text-[#737373] truncate mt-0.5">
                        {layer.subtitle}
                      </div>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>

          {/* CAMPOS SEPARADOS: DATA E HORÁRIO COM EDIÇÃO NUMÉRICA */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Campo 1: Data */}
            <div>
              <label className="block text-xs font-medium uppercase tracking-[0.05em] text-[#737373] mb-1.5 flex items-center gap-1.5">
                <Calendar className="h-4 w-4 text-[#0a0a0a]" />
                Data (DD/MM/AAAA)
              </label>
              <input
                type="text"
                inputMode="numeric"
                required
                value={dateInput}
                onChange={handleDateChange}
                onBlur={handleDateBlur}
                placeholder="DD/MM/AAAA"
                className="w-full px-3.5 py-2.5 rounded-[18px] border border-[#e5e5e5] bg-[#f5f5f5] focus:bg-[#ffffff] text-[#0a0a0a] font-mono text-sm tracking-wider focus:outline-none focus:ring-1 focus:ring-[#0a0a0a] transition-colors"
              />
              <span className="text-[10px] text-[#737373] mt-1 block">
                Insira apenas números (ex: 10092026)
              </span>
            </div>

            {/* Campo 2: Horário */}
            <div>
              <label className="block text-xs font-medium uppercase tracking-[0.05em] text-[#737373] mb-1.5 flex items-center gap-1.5">
                <Clock className="h-4 w-4 text-[#0a0a0a]" />
                Horário (HH:mm)
              </label>
              <input
                type="text"
                inputMode="numeric"
                required
                value={timeInput}
                onChange={handleTimeChange}
                onBlur={handleTimeBlur}
                placeholder="HH:mm"
                className="w-full px-3.5 py-2.5 rounded-[18px] border border-[#e5e5e5] bg-[#f5f5f5] focus:bg-[#ffffff] text-[#0a0a0a] font-mono text-sm tracking-wider focus:outline-none focus:ring-1 focus:ring-[#0a0a0a] transition-colors"
              />
              <span className="text-[10px] text-[#737373] mt-1 block">
                Insira apenas números (ex: 0830)
              </span>
            </div>
          </div>

          {/* Dica de autocorreção */}
          <div className="flex items-center gap-2 p-3 rounded-[18px] bg-[#fafafa] border border-[#e5e5e5] text-[11px] text-[#737373]">
            <Sparkles className="h-4 w-4 text-[#0a0a0a] shrink-0" />
            <span>O sistema formata e autocorrige limites de dias, meses e horários automaticamente.</span>
          </div>

          {/* Botões de Ação */}
          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-[#e5e5e5]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-[#0a0a0a] bg-[#f5f5f5] hover:bg-[#e5e5e5] rounded-[18px] transition-colors cursor-pointer"
            >
              {successMsg ? 'Fechar' : 'Cancelar'}
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="px-5 py-2.5 bg-[#0a0a0a] hover:bg-[#171717] text-[#fafafa] text-xs font-medium rounded-[18px] transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-70"
            >
              {isSaving ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Salvando...</span>
                </>
              ) : (
                <>
                  <Check className="h-4 w-4" />
                  <span>
                    {selectedType === 'CLOCK_OUT'
                      ? 'Salvar Saída e Fechar'
                      : `Salvar ${layers.find((l) => l.type === selectedType)?.title || 'Registro'} e Continuar`}
                  </span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
