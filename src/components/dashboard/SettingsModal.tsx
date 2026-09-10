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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0a0a0a]/40 backdrop-blur-xs p-4 animate-in fade-in duration-150">
      <div className="bg-[#ffffff] w-full max-w-md rounded-[24px] card-shadow border border-[#e5e5e5] overflow-hidden text-[#0a0a0a]">
        <div className="px-6 py-4 border-b border-[#e5e5e5] flex items-center justify-between">
          <h3 className="font-semibold text-[#0a0a0a] text-sm tracking-tight">Configurações da Jornada</h3>
          <button
            onClick={onClose}
            className="text-[#737373] hover:text-[#0a0a0a] p-1.5 rounded-[18px] hover:bg-[#f5f5f5] transition-colors cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {successMsg && (
          <div className="mx-6 mt-4 p-3 rounded-[18px] bg-[#fafafa] border border-[#e5e5e5] text-[#0a0a0a] text-xs flex items-center gap-2">
            <Check className="h-4 w-4 text-[#0a0a0a]" />
            <span>{successMsg}</span>
          </div>
        )}

        <form onSubmit={handleSave} className="p-6 space-y-5">
          {/* Meta Diária de Horas */}
          <div>
            <label className="block text-xs font-medium uppercase tracking-[0.05em] text-[#737373] mb-1.5 flex items-center gap-1.5">
              <Target className="h-4 w-4 text-[#0a0a0a]" />
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
                className="w-full px-3.5 py-2.5 rounded-[18px] border border-[#e5e5e5] text-sm bg-[#f5f5f5] focus:bg-[#ffffff] focus:outline-none focus:ring-1 focus:ring-[#0a0a0a] font-mono font-medium text-[#0a0a0a]"
              />
              <span className="absolute right-4 top-2.5 text-xs text-[#737373] font-medium">horas / dia</span>
            </div>
            <p className="text-[11px] text-[#737373] mt-1">
              Padrão comum: 8 horas (tempo integral) ou 6 horas (estágio / meio período).
            </p>
          </div>

          {/* Fuso Horário */}
          <div>
            <label className="block text-xs font-medium uppercase tracking-[0.05em] text-[#737373] mb-1.5 flex items-center gap-1.5">
              <Globe className="h-4 w-4 text-[#0a0a0a]" />
              Fuso Horário Principal
            </label>
            <select
              value={timezone}
              onChange={(e) => setTimezone(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-[18px] border border-[#e5e5e5] text-sm bg-[#f5f5f5] focus:bg-[#ffffff] focus:outline-none focus:ring-1 focus:ring-[#0a0a0a] text-[#0a0a0a]"
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
            <p className="text-[11px] text-[#737373] mt-1">Usado para calcular e exibir os horários exatos das batidas.</p>
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#e5e5e5]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-[#0a0a0a] bg-[#f5f5f5] hover:bg-[#e5e5e5] rounded-[18px] transition-colors cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isUpdating}
              className="px-5 py-2.5 bg-[#0a0a0a] hover:bg-[#171717] text-[#fafafa] text-xs font-medium rounded-[18px] transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-70"
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
