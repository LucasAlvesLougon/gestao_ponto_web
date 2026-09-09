import React, { useState } from 'react'
import { X, Loader2, AlertCircle } from 'lucide-react'
import type { TimeEntry } from '../../lib/types'

interface EditEntryModalProps {
  entry: TimeEntry | null
  onClose: () => void
  onSave: (id: number, time: string, reason: string) => Promise<any>
  isSaving: boolean
}

export const EditEntryModal: React.FC<EditEntryModalProps> = ({
  entry,
  onClose,
  onSave,
  isSaving,
}) => {
  if (!entry) return null

  // Converte ISO registered_at para YYYY-MM-DDTHH:mm para o input datetime-local
  const defaultDateTime = entry.registered_at ? entry.registered_at.slice(0, 16) : ''

  const [newTime, setNewTime] = useState(defaultDateTime)
  const [reason, setReason] = useState(entry.edit_reason || '')
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newTime) {
      setError('Informe o novo horário.')
      return
    }
    if (!reason || reason.trim().length < 5) {
      setError('A justificativa é obrigatória (mínimo 5 caracteres).')
      return
    }

    setError(null)
    try {
      await onSave(entry.id, newTime, reason.trim())
      onClose()
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Erro ao atualizar registro de ponto.'
      setError(msg)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4 animate-in fade-in duration-150">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-slate-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-lg">✏️</span>
            <h3 className="font-bold text-slate-800 text-base">Ajustar Registro de Ponto</h3>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {error && (
          <div className="mx-6 mt-4 p-3 rounded-xl bg-red-50 border border-red-100 text-red-700 text-xs flex items-center gap-2">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">
              Tipo de Registro
            </label>
            <div className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700">
              {entry.type === 'CLOCK_IN' && 'Entrada'}
              {entry.type === 'BREAK_START' && 'Início de Intervalo'}
              {entry.type === 'BREAK_END' && 'Retorno de Intervalo'}
              {entry.type === 'CLOCK_OUT' && 'Saída'}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">
              Novo Horário
            </label>
            <input
              type="datetime-local"
              required
              value={newTime}
              onChange={(e) => setNewTime(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">
              Justificativa da Alteração <span className="text-red-500">*</span>
            </label>
            <textarea
              required
              rows={3}
              minLength={5}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Ex: Esqueci de registrar na chegada; reunião externa..."
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 resize-none"
            />
            <p className="text-[11px] text-slate-400 mt-1">O histórico original é preservado para conformidade e auditoria.</p>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="px-5 py-2 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-xs font-bold rounded-xl transition-colors flex items-center gap-1.5 shadow-sm disabled:opacity-70 cursor-pointer"
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
      </div>
    </div>
  )
}
