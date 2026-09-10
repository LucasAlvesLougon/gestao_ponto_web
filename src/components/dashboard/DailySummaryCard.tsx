import React from 'react'
import { Clock, Target, TrendingUp, TrendingDown, CheckCircle2 } from 'lucide-react'
import type { DailySummary } from '../../lib/types'

interface DailySummaryCardProps {
  summary?: DailySummary
  isLoading: boolean
}

export const DailySummaryCard: React.FC<DailySummaryCardProps> = ({ summary, isLoading }) => {
  if (isLoading) {
    return (
      <div className="bg-[#ffffff] rounded-[24px] p-6 border border-[#e5e5e5] card-shadow animate-pulse">
        <div className="h-4 bg-[#f5f5f5] rounded w-1/4 mb-4" />
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="h-16 bg-[#f5f5f5] rounded-[18px]" />
          <div className="h-16 bg-[#f5f5f5] rounded-[18px]" />
          <div className="h-16 bg-[#f5f5f5] rounded-[18px]" />
        </div>
      </div>
    )
  }

  if (!summary) return null

  const progressPercent = summary.target_minutes > 0
    ? Math.min(100, Math.round((summary.total_worked_minutes / summary.target_minutes) * 100))
    : 0

  const isGoalMet = summary.total_worked_minutes >= summary.target_minutes && summary.target_minutes > 0

  return (
    <div className="bg-[#ffffff] rounded-[24px] p-6 border border-[#e5e5e5] card-shadow space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-semibold text-[#0a0a0a] tracking-tight">Resumo da Jornada</h3>
          <p className="text-xs text-[#737373] mt-0.5">Balanço e progresso em relação à sua meta diária</p>
        </div>
        {isGoalMet && (
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-[18px] bg-[#f5f5f5] border border-[#e5e5e5] text-[#171717] text-xs font-medium">
            <CheckCircle2 className="h-3.5 w-3.5 text-[#0a0a0a]" />
            Meta Atingida!
          </div>
        )}
      </div>

      {/* Grid de Métricas */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Total Trabalhado */}
        <div className="p-4 rounded-[18px] bg-[#fafafa] border border-[#e5e5e5] flex items-center gap-3.5">
          <div className="p-2.5 rounded-[10px] bg-[#ffffff] text-[#0a0a0a] border border-[#e5e5e5]">
            <Clock className="h-5 w-5" />
          </div>
          <div>
            <span className="text-[11px] font-medium uppercase tracking-[0.05em] text-[#737373]">Trabalhado</span>
            <div className="text-xl font-semibold text-[#0a0a0a] font-mono">
              {summary.total_worked_formatted}
            </div>
          </div>
        </div>

        {/* Meta Diária */}
        <div className="p-4 rounded-[18px] bg-[#fafafa] border border-[#e5e5e5] flex items-center gap-3.5">
          <div className="p-2.5 rounded-[10px] bg-[#ffffff] text-[#0a0a0a] border border-[#e5e5e5]">
            <Target className="h-5 w-5" />
          </div>
          <div>
            <span className="text-[11px] font-medium uppercase tracking-[0.05em] text-[#737373]">Meta do Dia</span>
            <div className="text-xl font-semibold text-[#0a0a0a] font-mono">
              {summary.target_formatted}
            </div>
          </div>
        </div>

        {/* Saldo do Dia */}
        <div className="p-4 rounded-[18px] bg-[#fafafa] border border-[#e5e5e5] flex items-center gap-3.5">
          <div className="p-2.5 rounded-[10px] bg-[#ffffff] text-[#0a0a0a] border border-[#e5e5e5]">
            {summary.is_positive_balance ? (
              <TrendingUp className="h-5 w-5 text-[#0a0a0a]" />
            ) : (
              <TrendingDown className="h-5 w-5 text-[#737373]" />
            )}
          </div>
          <div>
            <span className="text-[11px] font-medium uppercase tracking-[0.05em] text-[#737373]">Saldo Diário</span>
            <div className="text-xl font-semibold text-[#0a0a0a] font-mono">
              {summary.balance_formatted}
            </div>
          </div>
        </div>
      </div>

      {/* Barra de Progresso */}
      <div className="space-y-1.5">
        <div className="flex justify-between text-xs font-medium text-[#737373]">
          <span>Progresso da meta</span>
          <span>{progressPercent}%</span>
        </div>
        <div className="w-full h-2 bg-[#f5f5f5] rounded-full overflow-hidden border border-[#e5e5e5]">
          <div
            className="h-full bg-[#0a0a0a] rounded-full transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>
    </div>
  )
}
