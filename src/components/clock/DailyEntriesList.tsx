import React, { useState } from 'react'
import { Play, Coffee, ArrowLeft, LogOut, Edit3, Trash2, Clock, AlertTriangle } from 'lucide-react'
import type { TimeEntry } from '../../lib/types'
import { EditEntryModal } from './EditEntryModal'

interface DailyEntriesListProps {
  entries: TimeEntry[]
  isLoading: boolean
  onUpdate: (id: number, time: string, reason?: string) => Promise<any>
  onDelete: (id: number) => Promise<any>
  isUpdating: boolean
  isDeleting: boolean
  selectedDate?: string
  timezone?: string
}

export const DailyEntriesList: React.FC<DailyEntriesListProps> = ({
  entries,
  isLoading,
  onUpdate,
  onDelete,
  isUpdating,
  selectedDate,
  timezone = 'America/Sao_Paulo',
}) => {
  const [selectedEntry, setSelectedEntry] = useState<TimeEntry | null>(null)
  const [deletingId, setDeletingId] = useState<number | null>(null)

  const dateFormatted = selectedDate ? selectedDate.split('-').reverse().join('/') : null
  const todayStr = new Intl.DateTimeFormat('sv-SE', { timeZone: timezone }).format(new Date())
  const isToday = !selectedDate || selectedDate === todayStr

  const typeDetails = {
    CLOCK_IN: {
      label: 'Entrada',
      icon: Play,
      color: 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800/60',
    },
    BREAK_START: {
      label: 'Início Intervalo',
      icon: Coffee,
      color: 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800/60',
    },
    BREAK_END: {
      label: 'Retorno Intervalo',
      icon: ArrowLeft,
      color: 'bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800/60',
    },
    CLOCK_OUT: {
      label: 'Saída',
      icon: LogOut,
      color: 'bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-400 border-rose-200 dark:border-rose-800/60',
    },
  }

  const handleDelete = async (id: number) => {
    if (window.confirm('Tem certeza que deseja remover esta marcação de ponto?')) {
      setDeletingId(id)
      try {
        await onDelete(id)
      } finally {
        setDeletingId(null)
      }
    }
  }

  return (
    <div className="bg-[#121214] rounded-[24px] p-6 border border-[#27272a] card-shadow">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-base font-semibold text-[#fafafa] tracking-tight">
            {isToday ? 'Histórico de Hoje' : `Histórico do Dia (${dateFormatted})`}
          </h3>
          <p className="text-xs text-[#a1a1aa] mt-0.5">Todas as marcações registradas para esta jornada</p>
        </div>
        <div className="text-xs font-medium px-2.5 py-0.5 bg-[#1c1c20] text-[#fafafa] rounded-[18px] border border-[#27272a]">
          {entries.length} {entries.length === 1 ? 'registro' : 'registros'}
        </div>
      </div>

      {isLoading ? (
        <div className="py-12 flex flex-col items-center justify-center text-[#a1a1aa] gap-2">
          <Clock className="h-6 w-6 animate-spin text-[#fafafa]" />
          <span className="text-xs font-medium">Carregando marcações...</span>
        </div>
      ) : entries.length === 0 ? (
        <div className="py-12 text-center border border-dashed border-[#27272a] rounded-[18px] bg-[#1c1c20]">
          <div className="w-10 h-10 rounded-[10px] bg-[#27272a] border border-[#3f3f46] text-[#fafafa] flex items-center justify-center mx-auto mb-3 text-base">
            📅
          </div>
          <h4 className="text-sm font-semibold text-[#fafafa]">
            {isToday ? 'Nenhum ponto registrado hoje' : `Nenhum ponto registrado em ${dateFormatted}`}
          </h4>
          <p className="text-xs text-[#a1a1aa] mt-1 max-w-sm mx-auto">
            {isToday
              ? 'Utilize as opções acima para registrar sua Entrada e iniciar o acompanhamento da jornada de trabalho.'
              : 'Não foram encontrados registros para esta data.'}
          </p>
        </div>
      ) : (
        <div className="space-y-2.5">
          {entries.map((entry, idx) => {
            const details = typeDetails[entry.type] || {
              label: entry.type,
              icon: Clock,
              color: '',
            }
            const Icon = details.icon

            let timeStr = '--:--'
            if (entry.registered_at) {
              try {
                timeStr = new Intl.DateTimeFormat('pt-BR', {
                  timeZone: timezone,
                  hour: '2-digit',
                  minute: '2-digit',
                  second: '2-digit',
                  hour12: false,
                }).format(new Date(entry.registered_at))
              } catch {
                timeStr = new Date(entry.registered_at).toLocaleTimeString('pt-BR', { hour12: false })
              }
            }

            return (
              <div
                key={entry.id || idx}
                className="flex items-center justify-between p-3.5 sm:p-4 rounded-[18px] border border-[#27272a] bg-[#18181b] hover:bg-[#27272a]/40 hover:border-[#3f3f46] transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-[10px] bg-[#27272a] text-[#fafafa] border border-[#3f3f46] shrink-0">
                    <Icon className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-[#fafafa]">{details.label}</span>
                      {entry.is_edited && (
                        <span
                          className="inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-[18px] bg-[#27272a] text-[#fafafa] border border-[#3f3f46]"
                        >
                          <AlertTriangle className="h-3 w-3 text-[#a1a1aa]" />
                          Ajustado
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-[#a1a1aa] font-mono mt-0.5">
                      Horário: <span className="font-semibold text-[#fafafa]">{timeStr}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={() => setSelectedEntry(entry)}
                    title="Ajustar horário"
                    aria-label="Ajustar horário"
                    className="p-2 text-[#a1a1aa] hover:text-[#fafafa] hover:bg-[#27272a] active:scale-[0.95] rounded-[18px] transition-all cursor-pointer"
                  >
                    <Edit3 className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(entry.id)}
                    disabled={deletingId === entry.id}
                    title="Excluir marcação"
                    aria-label="Excluir marcação"
                    className="p-2 text-[#a1a1aa] hover:text-[#ef4444] hover:bg-[#ef4444]/10 active:scale-[0.95] rounded-[18px] transition-all cursor-pointer disabled:opacity-50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Modal de Edição */}
      <EditEntryModal
        entry={selectedEntry}
        onClose={() => setSelectedEntry(null)}
        onSave={onUpdate}
        isSaving={isUpdating}
      />
    </div>
  )
}
