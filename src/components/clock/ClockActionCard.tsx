import React, { useEffect, useState } from 'react'
import { Clock, Play, Coffee, ArrowLeft, LogOut, Loader2, Calendar } from 'lucide-react'
import type { TimeEntryType } from '../../lib/types'

interface ClockActionCardProps {
  nextExpectedType: TimeEntryType
  onRecord: (type?: TimeEntryType, customTime?: string) => Promise<any>
  isRecording: boolean
  timezone: string
}

export const ClockActionCard: React.FC<ClockActionCardProps> = ({
  nextExpectedType,
  onRecord,
  isRecording,
  timezone,
}) => {
  const [currentTime, setCurrentTime] = useState<string>('')
  const [currentDateFormatted, setCurrentDateFormatted] = useState<string>('')
  const [showManualModal, setShowManualModal] = useState(false)
  const [manualTime, setManualTime] = useState('')
  const [actionError, setActionError] = useState<string | null>(null)

  // Atualizar relógio em tempo real a cada segundo
  useEffect(() => {
    const updateTime = () => {
      const now = new Date()
      try {
        const timeStr = new Intl.DateTimeFormat('pt-BR', {
          timeZone: timezone || 'America/Sao_Paulo',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        }).format(now)

        const dateStr = new Intl.DateTimeFormat('pt-BR', {
          timeZone: timezone || 'America/Sao_Paulo',
          weekday: 'long',
          day: '2-digit',
          month: 'long',
          year: 'numeric',
        }).format(now)

        setCurrentTime(timeStr)
        setCurrentDateFormatted(dateStr.charAt(0).toUpperCase() + dateStr.slice(1))
      } catch {
        setCurrentTime(now.toLocaleTimeString('pt-BR'))
        setCurrentDateFormatted(now.toLocaleDateString('pt-BR'))
      }
    }

    updateTime()
    const interval = setInterval(updateTime, 1000)
    return () => clearInterval(interval)
  }, [timezone])

  const actionConfig = {
    CLOCK_IN: {
      label: 'Registrar Entrada',
      sublabel: 'Iniciar expediente de trabalho',
      color: 'bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white shadow-emerald-600/20',
      icon: Play,
      statusBadge: 'Fora de Expediente',
      statusBadgeColor: 'bg-slate-100 text-slate-700 border-slate-200',
    },
    BREAK_START: {
      label: 'Iniciar Intervalo',
      sublabel: 'Pausa para almoço ou descanso',
      color: 'bg-amber-500 hover:bg-amber-600 active:bg-amber-700 text-white shadow-amber-500/20',
      icon: Coffee,
      statusBadge: 'Em Expediente',
      statusBadgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    },
    BREAK_END: {
      label: 'Retornar do Intervalo',
      sublabel: 'Retomar as atividades de trabalho',
      color: 'bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white shadow-blue-600/20',
      icon: ArrowLeft,
      statusBadge: 'Em Intervalo',
      statusBadgeColor: 'bg-amber-50 text-amber-700 border-amber-200',
    },
    CLOCK_OUT: {
      label: 'Registrar Saída',
      sublabel: 'Finalizar expediente do dia',
      color: 'bg-rose-600 hover:bg-rose-700 active:bg-rose-800 text-white shadow-rose-600/20',
      icon: LogOut,
      statusBadge: 'Em Expediente',
      statusBadgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    },
  }[nextExpectedType] || {
    label: 'Bater Ponto',
    sublabel: 'Registrar marcação',
    color: 'bg-blue-600 text-white',
    icon: Clock,
    statusBadge: 'Aguardando',
    statusBadgeColor: 'bg-slate-100 text-slate-700 border-slate-200',
  }

  const IconComponent = actionConfig.icon

  const handleQuickRecord = async () => {
    setActionError(null)
    try {
      await onRecord(nextExpectedType)
    } catch (err: any) {
      const msg = err.response?.data?.message || err.response?.data?.errors?.type?.[0] || 'Erro ao registrar ponto.'
      setActionError(msg)
    }
  }

  const handleManualRecord = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!manualTime) return
    setActionError(null)

    try {
      await onRecord(nextExpectedType, manualTime)
      setShowManualModal(false)
      setManualTime('')
    } catch (err: any) {
      const msg = err.response?.data?.message || err.response?.data?.errors?.type?.[0] || 'Erro ao registrar ponto retroativo.'
      setActionError(msg)
    }
  }

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm relative overflow-hidden">
      {/* Decoração sutil de fundo */}
      <div className="absolute top-0 right-0 -mt-8 -mr-8 w-48 h-48 bg-blue-50/50 rounded-full blur-2xl pointer-events-none" />

      <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative z-0">
        {/* Lado Esquerdo: Relógio Digital e Status */}
        <div className="text-center md:text-left space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold border ${actionConfig.statusBadgeColor}">
            <span className="w-2 h-2 rounded-full bg-current animate-pulse" />
            Status: {actionConfig.statusBadge}
          </div>

          <div className="text-5xl sm:text-6xl font-black text-slate-900 tracking-tight font-mono">
            {currentTime || '--:--:--'}
          </div>

          <p className="text-sm font-medium text-slate-500 flex items-center justify-center md:justify-start gap-1.5">
            <Calendar className="h-4 w-4 text-slate-400" />
            {currentDateFormatted}
          </p>
        </div>

        {/* Lado Direito: Botão de Ponto 1-Clique */}
        <div className="flex flex-col items-center sm:items-end w-full md:w-auto gap-3">
          <button
            onClick={handleQuickRecord}
            disabled={isRecording}
            className={`w-full md:w-72 py-5 px-6 rounded-2xl font-bold text-base transition-all duration-200 flex items-center justify-center gap-3 shadow-lg active:scale-95 disabled:opacity-75 disabled:cursor-not-allowed cursor-pointer ${actionConfig.color}`}
          >
            {isRecording ? (
              <>
                <Loader2 className="h-6 w-6 animate-spin" />
                <span>Registrando...</span>
              </>
            ) : (
              <>
                <IconComponent className="h-6 w-6" />
                <div className="text-left leading-tight">
                  <div>{actionConfig.label}</div>
                  <div className="text-[11px] font-normal opacity-90">{actionConfig.sublabel}</div>
                </div>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={() => setShowManualModal(!showManualModal)}
            className="text-xs font-semibold text-slate-500 hover:text-blue-600 transition-colors cursor-pointer underline"
          >
            Esqueceu? Registrar horário manual
          </button>
        </div>
      </div>

      {actionError && (
        <div className="mt-4 p-3 rounded-xl bg-red-50 border border-red-100 text-red-700 text-xs flex items-center gap-2">
          <span>⚠️</span>
          <span>{actionError}</span>
        </div>
      )}

      {/* Modal de Registro Manual / Retroativo */}
      {showManualModal && (
        <div className="mt-6 p-4 rounded-2xl bg-slate-50 border border-slate-200 text-left animate-in fade-in duration-200">
          <h4 className="text-sm font-bold text-slate-800 mb-2">Registrar Horário Manual ({actionConfig.label})</h4>
          <p className="text-xs text-slate-500 mb-3">
            Caso tenha esquecido de bater o ponto na hora exata, informe a data e horário abaixo:
          </p>
          <form onSubmit={handleManualRecord} className="flex flex-col sm:flex-row gap-2">
            <input
              type="datetime-local"
              required
              value={manualTime}
              onChange={(e) => setManualTime(e.target.value)}
              className="px-3 py-2 rounded-xl border border-slate-300 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
            <button
              type="submit"
              disabled={isRecording}
              className="py-2 px-4 bg-slate-800 hover:bg-slate-900 text-white text-xs font-semibold rounded-xl transition-colors cursor-pointer"
            >
              Confirmar Registro Manual
            </button>
            <button
              type="button"
              onClick={() => setShowManualModal(false)}
              className="py-2 px-3 text-xs font-medium text-slate-600 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer"
            >
              Cancelar
            </button>
          </form>
        </div>
      )}
    </div>
  )
}
