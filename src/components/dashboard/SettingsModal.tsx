import React, { useState } from 'react'
import { X, Loader2, Target, Globe, Check } from 'lucide-react'
import type { User } from '../../lib/types'
import { useWorkSchedule } from '../../hooks/useSummary'

interface SettingsModalProps {
  user: User
  onClose: () => void
  onUpdateUser: (data: Partial<Pick<User, 'timezone'>>) => Promise<any>
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  user,
  onClose,
  onUpdateUser,
}) => {
  const { schedule, updateSchedule, isUpdating } = useWorkSchedule()

  const [dailyHours, setDailyHours] = useState<number>(() => {
    return schedule?.daily_target_hours || 8.0
  })
  const [timezone, setTimezone] = useState<string>(user.timezone || 'America/Sao_Paulo')
  const [successMsg, setSuccessMsg] = useState<string | null>(null)

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setSuccessMsg(null)

    try {
      await updateSchedule({
        daily_target_hours: Number(dailyHours),
      })

      if (timezone !== user.timezone) {
        await onUpdateUser({ timezone })
      }

      setSuccessMsg('Configurações salvas com sucesso!')
      setTimeout(() => {
        onClose()
      }, 1200)
    } catch {
      // erro tratado no mutation
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in duration-150">
      <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-3xl shadow-2xl border border-slate-100 dark:border-slate-800 overflow-hidden transition-colors">
        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-lg">⚙️</span>
            <h3 className="font-bold text-slate-800 dark:text-slate-100 text-base">Configurações da Jornada</h3>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {successMsg && (
          <div className="mx-6 mt-4 p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800/60 text-emerald-700 dark:text-emerald-400 text-xs font-semibold flex items-center gap-2">
            <Check className="h-4 w-4" />
            <span>{successMsg}</span>
          </div>
        )}

        <form onSubmit={handleSave} className="p-6 space-y-5">
          {/* Meta Diária de Horas */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1.5 flex items-center gap-1.5">
              <Target className="h-4 w-4 text-purple-600 dark:text-purple-400" />
              Meta Diária de Horas
            </label>
            <div className="relative">
              <input
                type="number"
                step="0.5"
                min="1"
                max="24"
                required
                value={dailyHours}
                onChange={(e) => setDailyHours(Number(e.target.value))}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-sm bg-white dark:bg-slate-950 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-mono font-bold text-slate-900 dark:text-white"
              />
              <span className="absolute right-4 top-2.5 text-xs text-slate-400 dark:text-slate-500 font-semibold">horas / dia</span>
            </div>
            <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-1">
              Padrão comum: 8 horas (tempo integral) ou 6 horas (estágio / meio período).
            </p>
          </div>

          {/* Fuso Horário */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1.5 flex items-center gap-1.5">
              <Globe className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              Fuso Horário Principal
            </label>
            <select
              value={timezone}
              onChange={(e) => setTimezone(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-sm bg-white dark:bg-slate-950 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-800 dark:text-slate-200"
            >
              <option value="America/Sao_Paulo">Brasília (GMT-3)</option>
              <option value="America/Manaus">Manaus (GMT-4)</option>
              <option value="America/Belem">Belém (GMT-3)</option>
              <option value="America/Fortaleza">Fortaleza (GMT-3)</option>
              <option value="America/Recife">Recife (GMT-3)</option>
              <option value="America/Cuiaba">Cuiabá (GMT-4)</option>
              <option value="America/Rio_Branco">Rio Branco (GMT-5)</option>
              <option value="UTC">UTC (GMT+0)</option>
            </select>
            <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-1">Usado para calcular e exibir os horários exatos das batidas.</p>
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isUpdating}
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-xs font-bold rounded-xl transition-colors flex items-center gap-1.5 shadow-sm disabled:opacity-70 cursor-pointer"
            >
              {isUpdating ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  <span>Salvando...</span>
                </>
              ) : (
                <span>Salvar Configurações</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
