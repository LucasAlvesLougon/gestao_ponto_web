import React, { useEffect, useState } from 'react'
import { Clock, Play, Coffee, ArrowLeft, LogOut, Loader2, Calendar, CalendarClock } from 'lucide-react'
import type { TimeEntryType } from '../../lib/types'
import { ManualEntryModal } from './ManualEntryModal'

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
      icon: Play,
      statusBadge: 'Fora de Expediente',
    },
    BREAK_START: {
      label: 'Iniciar Intervalo',
      sublabel: 'Pausa para almoço ou descanso',
      icon: Coffee,
      statusBadge: 'Em Expediente',
    },
    BREAK_END: {
      label: 'Retornar do Intervalo',
      sublabel: 'Retomar as atividades de trabalho',
      icon: ArrowLeft,
      statusBadge: 'Em Intervalo',
    },
    CLOCK_OUT: {
      label: 'Registrar Saída',
      sublabel: 'Finalizar expediente do dia',
      icon: LogOut,
      statusBadge: 'Em Expediente',
    },
  }[nextExpectedType] || {
    label: 'Bater Ponto',
    sublabel: 'Registrar marcação',
    icon: Clock,
    statusBadge: 'Aguardando',
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
    <div className="bg-[#ffffff] rounded-[24px] p-6 sm:p-8 border border-[#e5e5e5] card-shadow relative overflow-hidden">
      <div className="flex flex-col lg:flex-row items-center justify-between gap-8 relative z-0">
        {/* Lado Esquerdo: Relógio Digital e Status */}
        <div className="text-center lg:text-left space-y-2.5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-[18px] text-xs font-medium bg-[#f5f5f5] text-[#171717] border border-[#e5e5e5]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#171717]" />
            Status: {actionConfig.statusBadge}
          </div>

          <div className="text-5xl sm:text-6xl font-semibold text-[#0a0a0a] tracking-tight font-mono">
            {currentTime || '--:--:--'}
          </div>

          <p className="text-sm font-normal text-[#737373] flex items-center justify-center lg:justify-start gap-1.5">
            <Calendar className="h-4 w-4 text-[#737373]" />
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
            className="flex-1 sm:w-64 py-3.5 px-4 rounded-[18px] text-left transition-colors flex items-center gap-3.5 bg-[#0a0a0a] hover:bg-[#171717] text-[#fafafa] active:scale-[0.99] disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer"
          >
            {isRecording ? (
              <div className="flex items-center gap-3">
                <Loader2 className="h-6 w-6 animate-spin text-[#fafafa]" />
                <div>
                  <div className="text-sm font-medium">Registrando...</div>
                  <div className="text-xs text-[#737373]">Gravando horário</div>
                </div>
              </div>
            ) : (
              <>
                <div className="p-2.5 rounded-[10px] bg-[#171717] text-[#fafafa] border border-white/10 shrink-0">
                  <IconComponent className="h-5 w-5" />
                </div>
                <div className="leading-tight">
                  <div className="text-[10px] uppercase tracking-[0.05em] text-[#737373] font-medium">
                    Tempo Real
                  </div>
                  <div className="text-sm font-semibold text-[#fafafa]">{actionConfig.label}</div>
                  <div className="text-xs text-[#737373] font-mono mt-0.5">
                    Agora • {currentTime || '--:--:--'}
                  </div>
                </div>
              </>
            )}
          </button>

          {/* BOTÃO 2: MARCAÇÃO MANUAL (Outline Pill) */}
          <button
            type="button"
            onClick={handleOpenManual}
            disabled={isRecording}
            title="Registrar marcação informando data e hora retroativa"
            className="flex-1 sm:w-64 py-3.5 px-4 rounded-[18px] text-left transition-colors flex items-center gap-3.5 bg-transparent hover:bg-[#f5f5f5] text-[#0a0a0a] border border-[#e5e5e5] active:scale-[0.99] cursor-pointer group"
          >
            <div className="p-2.5 rounded-[10px] bg-[#f5f5f5] text-[#0a0a0a] border border-[#e5e5e5] shrink-0">
              <CalendarClock className="h-5 w-5" />
            </div>
            <div className="leading-tight">
              <div className="text-[10px] uppercase tracking-[0.05em] text-[#737373] font-medium">
                Opção Retroativa
              </div>
              <div className="text-sm font-semibold text-[#0a0a0a]">
                Marcação Manual
              </div>
              <div className="text-xs text-[#737373] mt-0.5">
                Ajustar data & horário
              </div>
            </div>
          </button>
        </div>
      </div>

      {actionError && (
        <div className="mt-4 p-3 rounded-[18px] bg-red-50 border border-red-200 text-[#e7000b] text-xs flex items-center gap-2">
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
