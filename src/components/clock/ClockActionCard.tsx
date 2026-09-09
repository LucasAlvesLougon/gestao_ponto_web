import React, { useEffect, useState } from 'react'
import { Clock, Play, Coffee, ArrowLeft, LogOut, Loader2, Calendar, CalendarClock, X, Check } from 'lucide-react'
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
  const [manualType, setManualType] = useState<TimeEntryType>(nextExpectedType)
  const [manualTime, setManualTime] = useState('')
  const [actionError, setActionError] = useState<string | null>(null)

  // Keep manualType in sync when nextExpectedType changes
  useEffect(() => {
    setManualType(nextExpectedType)
  }, [nextExpectedType])

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
      color: 'bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white shadow-lg shadow-emerald-600/25',
      icon: Play,
      statusBadge: 'Fora de Expediente',
      statusBadgeColor: 'bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700',
    },
    BREAK_START: {
      label: 'Iniciar Intervalo',
      sublabel: 'Pausa para almoço ou descanso',
      color: 'bg-amber-500 hover:bg-amber-600 active:bg-amber-700 text-white shadow-lg shadow-amber-500/25',
      icon: Coffee,
      statusBadge: 'Em Expediente',
      statusBadgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-800/60',
    },
    BREAK_END: {
      label: 'Retornar do Intervalo',
      sublabel: 'Retomar as atividades de trabalho',
      color: 'bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white shadow-lg shadow-blue-600/25',
      icon: ArrowLeft,
      statusBadge: 'Em Intervalo',
      statusBadgeColor: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-800/60',
    },
    CLOCK_OUT: {
      label: 'Registrar Saída',
      sublabel: 'Finalizar expediente do dia',
      color: 'bg-rose-600 hover:bg-rose-700 active:bg-rose-800 text-white shadow-lg shadow-rose-600/25',
      icon: LogOut,
      statusBadge: 'Em Expediente',
      statusBadgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-800/60',
    },
  }[nextExpectedType] || {
    label: 'Bater Ponto',
    sublabel: 'Registrar marcação',
    color: 'bg-blue-600 text-white',
    icon: Clock,
    statusBadge: 'Aguardando',
    statusBadgeColor: 'bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700',
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

  const handleOpenManual = () => {
    // Pré-carrega data e hora atual no formato YYYY-MM-DDTHH:mm
    const now = new Date()
    const offset = now.getTimezoneOffset()
    const localDate = new Date(now.getTime() - offset * 60 * 1000)
    setManualTime(localDate.toISOString().slice(0, 16))
    setManualType(nextExpectedType)
    setShowManualModal(true)
    setActionError(null)
  }

  const handleManualRecord = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!manualTime) return
    setActionError(null)

    try {
      await onRecord(manualType, manualTime)
      setShowManualModal(false)
      setManualTime('')
    } catch (err: any) {
      const msg = err.response?.data?.message || err.response?.data?.errors?.type?.[0] || 'Erro ao registrar ponto retroativo.'
      setActionError(msg)
    }
  }

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden transition-colors">
      {/* Glow sutil de fundo */}
      <div className="absolute top-0 right-0 -mt-8 -mr-8 w-56 h-56 bg-blue-500/10 dark:bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />

      <div className="flex flex-col lg:flex-row items-center justify-between gap-8 relative z-0">
        {/* Lado Esquerdo: Relógio Digital e Status */}
        <div className="text-center lg:text-left space-y-2.5">
          <div className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold border ${actionConfig.statusBadgeColor}`}>
            <span className="w-2 h-2 rounded-full bg-current animate-pulse" />
            Status: {actionConfig.statusBadge}
          </div>

          <div className="text-5xl sm:text-6xl font-black text-slate-900 dark:text-white tracking-tight font-mono">
            {currentTime || '--:--:--'}
          </div>

          <p className="text-sm font-medium text-slate-500 dark:text-slate-400 flex items-center justify-center lg:justify-start gap-1.5">
            <Calendar className="h-4 w-4 text-slate-400 dark:text-slate-500" />
            {currentDateFormatted}
          </p>
        </div>

        {/* Lado Direito: DUAS OPÇÕES EVIDENTES DE MARCAÇÃO */}
        <div className="w-full lg:w-auto flex flex-col sm:flex-row items-stretch gap-4">
          {/* BOTÃO 1: MARCAÇÃO EM TEMPO REAL */}
          <button
            onClick={handleQuickRecord}
            disabled={isRecording}
            title="Registrar marcação instantânea com a hora atual"
            className={`flex-1 sm:w-64 py-4 px-5 rounded-2xl font-bold text-left transition-all duration-200 flex items-center gap-4 active:scale-98 disabled:opacity-75 disabled:cursor-not-allowed cursor-pointer ${actionConfig.color}`}
          >
            {isRecording ? (
              <div className="flex items-center gap-3">
                <Loader2 className="h-7 w-7 animate-spin" />
                <div>
                  <div className="text-sm font-bold">Registrando...</div>
                  <div className="text-[11px] opacity-80">Gravando horário</div>
                </div>
              </div>
            ) : (
              <>
                <div className="p-2.5 rounded-xl bg-white/20 backdrop-blur-xs shrink-0">
                  <IconComponent className="h-6 w-6" />
                </div>
                <div className="leading-tight">
                  <div className="text-[10px] uppercase tracking-wider font-extrabold opacity-80">
                    Marcação em Tempo Real
                  </div>
                  <div className="text-base font-black">{actionConfig.label}</div>
                  <div className="text-[11px] font-medium opacity-90 mt-0.5 font-mono">
                    Agora • {currentTime || '--:--:--'}
                  </div>
                </div>
              </>
            )}
          </button>

          {/* BOTÃO 2: MARCAÇÃO MANUAL (MUITO EVIDENTE) */}
          <button
            type="button"
            onClick={handleOpenManual}
            disabled={isRecording}
            title="Registrar marcação informando data e hora retroativa"
            className="flex-1 sm:w-64 py-4 px-5 rounded-2xl font-bold text-left transition-all duration-200 flex items-center gap-4 bg-slate-100 dark:bg-slate-800/90 hover:bg-slate-200 dark:hover:bg-slate-750 text-slate-800 dark:text-slate-100 border-2 border-slate-300 dark:border-slate-700 shadow-sm active:scale-98 cursor-pointer group"
          >
            <div className="p-2.5 rounded-xl bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 group-hover:bg-blue-100 group-hover:text-blue-600 dark:group-hover:bg-blue-950/60 dark:group-hover:text-blue-400 transition-colors shrink-0">
              <CalendarClock className="h-6 w-6" />
            </div>
            <div className="leading-tight">
              <div className="text-[10px] uppercase tracking-wider font-extrabold text-slate-500 dark:text-slate-400">
                Opção Retroativa
              </div>
              <div className="text-base font-black text-slate-900 dark:text-white">
                Marcação Manual
              </div>
              <div className="text-[11px] font-normal text-slate-500 dark:text-slate-400 mt-0.5">
                Ajustar data & horário
              </div>
            </div>
          </button>
        </div>
      </div>

      {actionError && (
        <div className="mt-4 p-3.5 rounded-2xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/50 text-red-700 dark:text-red-300 text-xs flex items-center gap-2">
          <span>⚠️</span>
          <span>{actionError}</span>
        </div>
      )}

      {/* Painel Expansível de Registro Manual */}
      {showManualModal && (
        <div className="mt-6 p-5 sm:p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border-2 border-blue-200 dark:border-blue-900/60 text-left animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <CalendarClock className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                Registrar Ponto Manualmente
              </h4>
            </div>
            <button
              type="button"
              onClick={() => setShowManualModal(false)}
              className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
            Selecione o tipo de marcação e defina a data/hora exata que deseja registrar:
          </p>

          <form onSubmit={handleManualRecord} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Tipo de Ponto */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Tipo de Registro
                </label>
                <select
                  value={manualType}
                  onChange={(e) => setManualType(e.target.value as TimeEntryType)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-sm bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-semibold"
                >
                  <option value="CLOCK_IN">Entrada</option>
                  <option value="BREAK_START">Início de Intervalo</option>
                  <option value="BREAK_END">Retorno de Intervalo</option>
                  <option value="CLOCK_OUT">Saída</option>
                </select>
              </div>

              {/* Data e Hora */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Data e Horário
                </label>
                <input
                  type="datetime-local"
                  required
                  value={manualTime}
                  onChange={(e) => setManualTime(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-sm bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-mono"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowManualModal(false)}
                className="py-2.5 px-4 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl transition-colors cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={isRecording}
                className="py-2.5 px-5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-xs font-bold rounded-xl transition-colors flex items-center gap-1.5 shadow-md shadow-blue-600/20 cursor-pointer disabled:opacity-70"
              >
                <Check className="h-4 w-4" />
                <span>Salvar Marcação Manual</span>
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}
