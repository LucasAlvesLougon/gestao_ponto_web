import React, { useEffect, useState } from 'react'
import { Clock, Play, Coffee, ArrowLeft, LogOut, Loader2, Calendar, CalendarClock } from 'lucide-react'
import type { TimeEntry, TimeEntryType } from '../../lib/types'
import { ManualEntryModal } from './ManualEntryModal'

interface ClockActionCardProps {
  nextExpectedType: TimeEntryType
  onRecord: (type?: TimeEntryType, customTime?: string) => Promise<any>
  isRecording: boolean
  timezone: string
  entries?: TimeEntry[]
}

export const ClockActionCard: React.FC<ClockActionCardProps> = ({
  nextExpectedType,
  onRecord,
  isRecording,
  timezone,
  entries = [],
}) => {
  const [currentTime, setCurrentTime] = useState<string>('')
  const [currentDateFormatted, setCurrentDateFormatted] = useState<string>('')
  const [showManualModal, setShowManualModal] = useState(false)
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

  // Determinação do status de expediente e estilo com cores contidas (sóbrias, não neon)
  const isShiftFinished = entries.length > 0 && entries[entries.length - 1].type === 'CLOCK_OUT'

  const statusConfig = (() => {
    if (isShiftFinished) {
      return {
        label: 'Expediente Finalizado',
        badgeClass: 'bg-[#18192c] text-[#a5b4fc] border-[#2d3056]',
        dotClass: 'bg-[#818cf8]',
        pulse: false,
      }
    }

    switch (nextExpectedType) {
      case 'CLOCK_IN':
        return {
          label: 'Fora de Expediente',
          badgeClass: 'bg-[#1c1c20] text-[#a1a1aa] border-[#27272a]',
          dotClass: 'bg-[#71717a]',
          pulse: false,
        }
      case 'BREAK_START':
      case 'CLOCK_OUT':
        return {
          label: 'Em Expediente',
          badgeClass: 'bg-[#0d2818] text-[#6ee7b7] border-[#1b4d32]',
          dotClass: 'bg-[#34d399]',
          pulse: true,
        }
      case 'BREAK_END':
        return {
          label: 'Em Intervalo',
          badgeClass: 'bg-[#2a1a0c] text-[#fcd34d] border-[#5e3814]',
          dotClass: 'bg-[#f59e0b]',
          pulse: false,
        }
      default:
        return {
          label: 'Aguardando',
          badgeClass: 'bg-[#1c1c20] text-[#a1a1aa] border-[#27272a]',
          dotClass: 'bg-[#71717a]',
          pulse: false,
        }
    }
  })()

  const actionConfig = {
    CLOCK_IN: {
      label: 'Registrar Entrada',
      sublabel: 'Iniciar expediente de trabalho',
      icon: Play,
    },
    BREAK_START: {
      label: 'Iniciar Intervalo',
      sublabel: 'Pausa para almoço ou descanso',
      icon: Coffee,
    },
    BREAK_END: {
      label: 'Retornar do Intervalo',
      sublabel: 'Retomar as atividades de trabalho',
      icon: ArrowLeft,
    },
    CLOCK_OUT: {
      label: 'Registrar Saída',
      sublabel: 'Finalizar expediente do dia',
      icon: LogOut,
    },
  }[nextExpectedType] || {
    label: 'Bater Ponto',
    sublabel: 'Registrar marcação',
    icon: Clock,
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
    setShowManualModal(true)
    setActionError(null)
  }

  return (
    <div className="bg-[#121214] rounded-[24px] p-6 sm:p-8 border border-[#27272a] card-shadow relative overflow-hidden">
      <div className="flex flex-col lg:flex-row items-center justify-between gap-8 relative z-0">
        {/* Lado Esquerdo: Relógio Digital e Status com Cores Contidas */}
        <div className="text-center lg:text-left space-y-2.5">
          <div
            className={`inline-flex items-center gap-2 px-3 py-1 rounded-[18px] text-xs font-medium border transition-colors ${statusConfig.badgeClass}`}
          >
            <span className="relative flex h-2 w-2 shrink-0">
              {statusConfig.pulse && (
                <span
                  className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-60 ${statusConfig.dotClass}`}
                />
              )}
              <span className={`relative inline-flex rounded-full h-2 w-2 ${statusConfig.dotClass}`} />
            </span>
            <span>Status: {statusConfig.label}</span>
          </div>

          <div className="text-5xl sm:text-6xl font-semibold text-[#fafafa] tracking-tight font-mono">
            {currentTime || '--:--:--'}
          </div>

          <p className="text-sm font-normal text-[#a1a1aa] flex items-center justify-center lg:justify-start gap-1.5">
            <Calendar className="h-4 w-4 text-[#a1a1aa]" />
            {currentDateFormatted}
          </p>
        </div>

        {/* Lado Direito: DUAS OPÇÕES EVIDENTES DE MARCAÇÃO */}
        <div className="w-full lg:w-auto flex flex-col sm:flex-row items-stretch gap-3">
          {/* BOTÃO 1: MARCAÇÃO EM TEMPO REAL (Primary Filled Pill) */}
          <button
            onClick={handleQuickRecord}
            disabled={isRecording}
            title="Registrar marcação instantânea com a hora atual"
            className="flex-1 sm:w-64 py-3.5 px-4 rounded-[18px] text-left transition-colors flex items-center gap-3.5 bg-[#fafafa] hover:bg-[#e4e4e7] text-[#09090b] active:scale-[0.99] disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer"
          >
            {isRecording ? (
              <div className="flex items-center gap-3">
                <Loader2 className="h-6 w-6 animate-spin text-[#09090b]" />
                <div>
                  <div className="text-sm font-medium">Registrando...</div>
                  <div className="text-xs text-[#71717a]">Gravando horário</div>
                </div>
              </div>
            ) : (
              <>
                <div className="p-2.5 rounded-[10px] bg-[#09090b] text-[#fafafa] shrink-0">
                  <IconComponent className="h-5 w-5" />
                </div>
                <div className="leading-tight">
                  <div className="text-[10px] uppercase tracking-[0.05em] text-[#71717a] font-medium">
                    Tempo Real
                  </div>
                  <div className="text-sm font-semibold text-[#09090b]">{actionConfig.label}</div>
                  <div className="text-xs text-[#71717a] font-mono mt-0.5">
                    Agora • {currentTime || '--:--:--'}
                  </div>
                </div>
              </>
            )}
          </button>

          {/* BOTÃO 2: MARCAÇÃO MANUAL (Outline / Surface Alt Pill) */}
          <button
            type="button"
            onClick={handleOpenManual}
            disabled={isRecording}
            title="Registrar marcação informando data e hora retroativa"
            className="flex-1 sm:w-64 py-3.5 px-4 rounded-[18px] text-left transition-colors flex items-center gap-3.5 bg-[#1c1c20] hover:bg-[#27272a] text-[#fafafa] border border-[#27272a] active:scale-[0.99] cursor-pointer group"
          >
            <div className="p-2.5 rounded-[10px] bg-[#27272a] text-[#fafafa] border border-[#3f3f46] shrink-0">
              <CalendarClock className="h-5 w-5" />
            </div>
            <div className="leading-tight">
              <div className="text-[10px] uppercase tracking-[0.05em] text-[#a1a1aa] font-medium">
                Opção Retroativa
              </div>
              <div className="text-sm font-semibold text-[#fafafa]">
                Marcação Manual
              </div>
              <div className="text-xs text-[#a1a1aa] mt-0.5">
                Ajustar data & horário
              </div>
            </div>
          </button>
        </div>
      </div>

      {actionError && (
        <div className="mt-4 p-3 rounded-[18px] bg-[#1c1c20] border border-[#ef4444]/30 text-[#ef4444] text-xs flex items-center gap-2">
          <span>⚠️</span>
          <span>{actionError}</span>
        </div>
      )}

      {/* Modal Moderno com 4 Layers e Data/Hora Numéricas */}
      <ManualEntryModal
        isOpen={showManualModal}
        onClose={() => setShowManualModal(false)}
        onSave={(type, customTime) => onRecord(type, customTime)}
        initialType={nextExpectedType}
        isSaving={isRecording}
      />
    </div>
  )
}
