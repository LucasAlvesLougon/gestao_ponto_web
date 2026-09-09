import React, { useState } from 'react'
import { Play, Coffee, ArrowLeft, LogOut, Edit3, Trash2, Clock, AlertTriangle } from 'lucide-react'
import type { TimeEntry } from '../../lib/types'
import { EditEntryModal } from './EditEntryModal'

interface DailyEntriesListProps {
  entries: TimeEntry[]
  isLoading: boolean
  onUpdate: (id: number, time: string, reason: string) => Promise<any>
  onDelete: (id: number) => Promise<any>
  isUpdating: boolean
  isDeleting: boolean
}

export const DailyEntriesList: React.FC<DailyEntriesListProps> = ({
  entries,
  isLoading,
  onUpdate,
  onDelete,
  isUpdating,
}) => {
  const [selectedEntry, setSelectedEntry] = useState<TimeEntry | null>(null)
  const [deletingId, setDeletingId] = useState<number | null>(null)

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
    <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm transition-colors">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">Histórico de Hoje</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Todas as marcações registradas para esta jornada</p>
        </div>
        <div className="text-xs font-semibold px-3 py-1 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-full border border-slate-200 dark:border-slate-700">
          {entries.length} {entries.length === 1 ? 'registro' : 'registros'}
        </div>
      </div>

      {isLoading ? (
        <div className="py-12 flex flex-col items-center justify-center text-slate-400 dark:text-slate-500 gap-2">
          <Clock className="h-6 w-6 animate-spin text-blue-600 dark:text-blue-400" />
          <span className="text-xs font-medium">Carregando marcações...</span>
        </div>
      ) : entries.length === 0 ? (
        <div className="py-12 text-center border-2 border-dashed border-slate-100 dark:border-slate-800 rounded-2xl bg-slate-50/50 dark:bg-slate-800/30">
          <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 flex items-center justify-center mx-auto mb-3 text-xl">
            📅
          </div>
          <h4 className="text-sm font-bold text-slate-700 dark:text-slate-300">Nenhum ponto registrado hoje</h4>
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-1 max-w-sm mx-auto">
            Utilize as opções acima para registrar sua Entrada e iniciar o acompanhamento da jornada de trabalho.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {entries.map((entry, idx) => {
            const details = typeDetails[entry.type] || {
              label: entry.type,
              icon: Clock,
              color: 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700',
            }
            const Icon = details.icon

            const timeStr = entry.registered_at
              ? new Date(entry.registered_at).toLocaleTimeString('pt-BR', {
                  hour: '2-digit',
                  minute: '2-digit',
                  second: '2-digit',
                })
              : '--:--'

            return (
              <div
                key={entry.id || idx}
                className="flex items-center justify-between p-4 rounded-2xl border border-slate-100 dark:border-slate-800/80 hover:border-slate-200 dark:hover:border-slate-700 bg-slate-50/40 dark:bg-slate-800/40 hover:bg-slate-50 dark:hover:bg-slate-800/70 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2.5 rounded-xl border ${details.color}`}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-slate-900 dark:text-white">{details.label}</span>
                      {entry.is_edited && (
                        <span
                          title={`Editado: ${entry.edit_reason}`}
                          className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-md bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800/60"
                        >
                          <AlertTriangle className="h-3 w-3" />
                          Ajustado
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-slate-400 dark:text-slate-500 font-mono mt-0.5">
                      Horário: <span className="font-semibold text-slate-700 dark:text-slate-300">{timeStr}</span>
                      {entry.edit_reason && (
                        <span className="block text-[11px] text-slate-500 dark:text-slate-400 font-sans italic mt-0.5">
                          Motivo: {entry.edit_reason}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setSelectedEntry(entry)}
                    title="Ajustar horário"
                    aria-label="Ajustar horário"
                    className="p-2 text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/50 rounded-xl transition-colors cursor-pointer"
                  >
                    <Edit3 className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(entry.id)}
                    disabled={deletingId === entry.id}
                    title="Excluir marcação"
                    aria-label="Excluir marcação"
                    className="p-2 text-slate-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/50 rounded-xl transition-colors cursor-pointer disabled:opacity-50"
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
