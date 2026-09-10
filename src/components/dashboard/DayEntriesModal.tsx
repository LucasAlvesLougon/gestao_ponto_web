import React, { useState } from 'react'
import { X, Play, Coffee, ArrowLeft, LogOut, Edit3, Trash2, Clock, Plus, AlertTriangle, Calendar } from 'lucide-react'
import type { TimeEntry, TimeEntryType } from '../../lib/types'
import { useTimeEntries } from '../../hooks/useTimeEntries'
import { EditEntryModal } from '../clock/EditEntryModal'
import { ManualEntryModal } from '../clock/ManualEntryModal'

interface DayEntriesModalProps {
  date: string | null // YYYY-MM-DD
  isOpen: boolean
  onClose: () => void
}

export const DayEntriesModal: React.FC<DayEntriesModalProps> = ({
  date,
  isOpen,
  onClose,
}) => {
  if (!isOpen || !date) return null

  const {
    entries,
    isLoading,
    recordEntry,
    isRecording,
    updateEntry,
    isUpdating,
    deleteEntry,
    isDeleting,
  } = useTimeEntries(date)

  const [isManualModalOpen, setIsManualModalOpen] = useState(false)
  const [editingEntry, setEditingEntry] = useState<TimeEntry | null>(null)
  const [deletingId, setDeletingId] = useState<number | null>(null)

  // Formatação de data em português: ex: 10/09/2026 (Quinta-feira)
  const [year, month, day] = date.split('-').map(Number)
  const dateObj = new Date(year, month - 1, day)
  const formattedDate = `${String(day).padStart(2, '0')}/${String(month).padStart(2, '0')}/${year}`
  const weekday = dateObj.toLocaleDateString('pt-BR', { weekday: 'long' })
  const formattedWeekday = weekday.charAt(0).toUpperCase() + weekday.slice(1)

  const typeDetails = {
    CLOCK_IN: {
      label: 'Entrada',
      icon: Play,
      color: 'bg-emerald-950/40 text-emerald-400 border-emerald-800/60',
    },
    BREAK_START: {
      label: 'Início Intervalo',
      icon: Coffee,
      color: 'bg-amber-950/40 text-amber-400 border-amber-800/60',
    },
    BREAK_END: {
      label: 'Retorno Intervalo',
      icon: ArrowLeft,
      color: 'bg-blue-950/40 text-blue-400 border-blue-800/60',
    },
    CLOCK_OUT: {
      label: 'Saída',
      icon: LogOut,
      color: 'bg-rose-950/40 text-rose-400 border-rose-800/60',
    },
  }

  const handleDelete = async (id: number) => {
    if (window.confirm('Tem certeza que deseja remover esta batida de ponto?')) {
      setDeletingId(id)
      try {
        await deleteEntry(id)
      } finally {
        setDeletingId(null)
      }
    }
  }

  const handleManualSave = async (type: TimeEntryType, customTime: string) => {
    await recordEntry({ type, customTime })
  }

  const handleEditSave = async (id: number, time: string, reason?: string) => {
    await updateEntry({ id, time, reason })
    setEditingEntry(null)
  }

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0a0a0a]/40 backdrop-blur-xs p-4 animate-in fade-in duration-150">
        <div className="bg-[#ffffff] w-full max-w-2xl rounded-[24px] card-shadow border border-[#e5e5e5] overflow-hidden flex flex-col max-h-[90vh] text-[#0a0a0a]">
          {/* Header */}
          <div className="px-6 py-5 border-b border-[#e5e5e5] flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-[10px] bg-[#f5f5f5] border border-[#e5e5e5] text-[#0a0a0a]">
                <Calendar className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-semibold text-[#0a0a0a] text-sm tracking-tight">
                  Detalhamento do Dia — {formattedDate}
                </h3>
                <p className="text-xs text-[#737373] capitalize">{formattedWeekday}</p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="text-[#737373] hover:text-[#0a0a0a] p-1.5 rounded-[18px] hover:bg-[#f5f5f5] transition-colors cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Subheader / Ações Rápidas */}
          <div className="px-6 py-3 bg-[#fafafa] border-b border-[#e5e5e5] flex items-center justify-between shrink-0">
            <div className="text-xs text-[#737373]">
              <span className="font-semibold text-[#0a0a0a]">{entries.length}</span>{' '}
              {entries.length === 1 ? 'marcação registrada' : 'marcações registradas'}
            </div>

            <button
              onClick={() => setIsManualModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[18px] bg-[#0a0a0a] hover:bg-[#171717] text-[#fafafa] text-xs font-medium transition-colors cursor-pointer"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Adicionar Batida</span>
            </button>
          </div>

          {/* Conteúdo Principal */}
          <div className="p-6 overflow-y-auto space-y-3">
            {isLoading ? (
              <div className="py-12 flex flex-col items-center justify-center text-[#737373] gap-2">
                <Clock className="h-6 w-6 animate-spin text-[#0a0a0a]" />
                <span className="text-xs font-medium">Carregando batidas do dia...</span>
              </div>
            ) : entries.length === 0 ? (
              <div className="py-12 text-center border border-dashed border-[#e5e5e5] rounded-[18px] bg-[#fafafa]">
                <div className="w-10 h-10 rounded-[10px] bg-[#f5f5f5] border border-[#e5e5e5] text-[#0a0a0a] flex items-center justify-center mx-auto mb-3 text-base">
                  📅
                </div>
                <h4 className="text-sm font-semibold text-[#0a0a0a]">Nenhum registro nesta data</h4>
                <p className="text-xs text-[#737373] mt-1 max-w-sm mx-auto mb-4">
                  Você não possui batidas cadastradas para este dia. Adicione manualmente se esqueceu de registrar o ponto.
                </p>
                <button
                  onClick={() => setIsManualModalOpen(true)}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-[18px] bg-[#0a0a0a] hover:bg-[#171717] text-[#fafafa] text-xs font-medium transition-colors cursor-pointer"
                >
                  <Plus className="h-4 w-4" />
                  <span>Cadastrar Registro Manual</span>
                </button>
              </div>
            ) : (
              <div className="space-y-2.5">
                {entries.map((entry, idx) => {
                  const details = typeDetails[entry.type] || {
                    label: entry.type,
                    icon: Clock,
                  }
                  const Icon = details.icon

                  const timeStr = entry.registered_at
                    ? new Date(entry.registered_at).toLocaleTimeString('pt-BR', {
                        hour: '2-digit',
                        minute: '2-digit',
                        second: '2-digit',
                        hour12: false,
                      })
                    : '--:--'

                  return (
                    <div
                      key={entry.id || idx}
                      className="flex items-center justify-between p-3.5 rounded-[18px] border border-[#e5e5e5] bg-[#ffffff] hover:bg-[#fafafa] transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-[10px] bg-[#f5f5f5] text-[#0a0a0a] border border-[#e5e5e5]">
                          <Icon className="h-4 w-4" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-semibold text-[#0a0a0a]">
                              {details.label}
                            </span>
                            {entry.is_edited && (
                              <span
                                className="inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-[18px] bg-[#f5f5f5] text-[#171717] border border-[#e5e5e5]"
                              >
                                <AlertTriangle className="h-3 w-3 text-[#737373]" />
                                Ajustado
                              </span>
                            )}
                          </div>
                          <div className="text-xs text-[#737373] font-mono mt-0.5">
                            Horário: <span className="font-semibold text-[#0a0a0a]">{timeStr}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => setEditingEntry(entry)}
                          title="Ajustar horário ou data"
                          aria-label="Ajustar horário ou data"
                          className="p-2 text-[#737373] hover:text-[#0a0a0a] hover:bg-[#f5f5f5] rounded-[18px] transition-colors cursor-pointer"
                        >
                          <Edit3 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(entry.id)}
                          disabled={deletingId === entry.id || isDeleting}
                          title="Excluir marcação"
                          aria-label="Excluir marcação"
                          className="p-2 text-[#737373] hover:text-[#e7000b] hover:bg-red-50 rounded-[18px] transition-colors cursor-pointer disabled:opacity-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="px-6 py-3 border-t border-[#e5e5e5] flex items-center justify-end shrink-0">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-[#0a0a0a] bg-[#f5f5f5] hover:bg-[#e5e5e5] rounded-[18px] transition-colors cursor-pointer"
            >
              Fechar
            </button>
          </div>
        </div>
      </div>

      {/* Modal de Registro Manual para esta data */}
      <ManualEntryModal
        isOpen={isManualModalOpen}
        onClose={() => setIsManualModalOpen(false)}
        onSave={handleManualSave}
        initialDate={date}
        isSaving={isRecording}
      />

      {/* Modal de Ajuste de Horário */}
      <EditEntryModal
        entry={editingEntry}
        onClose={() => setEditingEntry(null)}
        onSave={handleEditSave}
        isSaving={isUpdating}
      />
    </>
  )
}
