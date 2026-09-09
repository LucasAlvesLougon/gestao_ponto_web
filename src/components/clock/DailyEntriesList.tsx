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
      color: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    },
    BREAK_START: {
      label: 'Início Intervalo',
      icon: Coffee,
      color: 'bg-amber-50 text-amber-700 border-amber-200',
    },
    BREAK_END: {
      label: 'Retorno Intervalo',
      icon: ArrowLeft,
      color: 'bg-blue-50 text-blue-700 border-blue-200',
    },
    CLOCK_OUT: {
      label: 'Saída',
      icon: LogOut,
      color: 'bg-rose-50 text-rose-700 border-rose-200',
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
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-bold text-slate-900">Histórico de Hoje</h3>
          <p className="text-xs text-slate-500 mt-0.5">Todas as marcações registradas para esta jornada</p>
        </div>
        <div className="text-xs font-semibold px-3 py-1 bg-slate-50 text-slate-600 rounded-full border border-slate-200">
          {entries.length} {entries.length === 1 ? 'registro' : 'registros'}
        </div>
      </div>

      {isLoading ? (
        <div className="py-12 flex flex-col items-center justify-center text-slate-400 gap-2">
          <Clock className="h-6 w-6 animate-spin text-blue-600" />
          <span className="text-xs font-medium">Carregando marcações...</span>
        </div>
      ) : entries.length === 0 ? (
        <div className="py-12 text-center border-2 border-dashed border-slate-100 rounded-2xl bg-slate-50/50">
          <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3 text-xl">
            📅
          </div>
          <h4 className="text-sm font-bold text-slate-700">Nenhum ponto registrado hoje</h4>
          <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
            Utilize o botão acima para registrar sua Entrada e iniciar o acompanhamento da jornada de trabalho.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {entries.map((entry, idx) => {
            const details = typeDetails[entry.type] || {
              label: entry.type,
              icon: Clock,
              color: 'bg-slate-50 text-slate-700 border-slate-200',
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
                className="flex items-center justify-between p-4 rounded-2xl border border-slate-100 hover:border-slate-200 bg-slate-50/40 hover:bg-slate-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2.5 rounded-xl border ${details.color}`}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-slate-900">{details.label}</span>
                      {entry.is_edited && (
                        <span
                          title={`Editado: ${entry.edit_reason}`}
                          className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-md bg-amber-50 text-amber-700 border border-amber-200"
                        >
                          <AlertTriangle className="h-3 w-3" />
                          Ajustado
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-slate-400 font-mono mt-0.5">
                      Horário: <span className="font-semibold text-slate-700">{timeStr}</span>
                      {entry.edit_reason && (
                        <span className="block text-[11px] text-slate-500 font-sans italic mt-0.5">
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
                    className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-colors cursor-pointer"
                  >
                    <Edit3 className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(entry.id)}
                    disabled={deletingId === entry.id}
                    title="Excluir marcação"
                    className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors cursor-pointer disabled:opacity-50"
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
