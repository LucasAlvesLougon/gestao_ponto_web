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
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm animate-pulse">
        <div className="h-4 bg-slate-100 rounded w-1/4 mb-4" />
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="h-16 bg-slate-100 rounded-2xl" />
          <div className="h-16 bg-slate-100 rounded-2xl" />
          <div className="h-16 bg-slate-100 rounded-2xl" />
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
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-bold text-slate-900">Resumo da Jornada</h3>
          <p className="text-xs text-slate-500 mt-0.5">Balanço e progresso em relação à sua meta diária</p>
        </div>
        {isGoalMet && (
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold">
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
            Meta Atingida!
          </div>
        )}
      </div>

      {/* Grid de Métricas */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Total Trabalhado */}
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-center gap-3.5">
          <div className="p-2.5 rounded-xl bg-blue-50 text-blue-600 border border-blue-100">
            <Clock className="h-5 w-5" />
          </div>
          <div>
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">Trabalhado</span>
            <div className="text-xl font-black text-slate-900 font-mono">
              {summary.total_worked_formatted}
            </div>
          </div>
        </div>

        {/* Meta Diária */}
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-center gap-3.5">
          <div className="p-2.5 rounded-xl bg-purple-50 text-purple-600 border border-purple-100">
            <Target className="h-5 w-5" />
          </div>
          <div>
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">Meta do Dia</span>
            <div className="text-xl font-black text-slate-900 font-mono">
              {summary.target_formatted}
            </div>
          </div>
        </div>

        {/* Saldo do Dia */}
        <div className={`p-4 rounded-2xl border flex items-center gap-3.5 ${
          summary.is_positive_balance
            ? 'bg-emerald-50/50 border-emerald-200 text-emerald-800'
            : 'bg-rose-50/50 border-rose-200 text-rose-800'
        }`}>
          <div className={`p-2.5 rounded-xl border ${
            summary.is_positive_balance
              ? 'bg-emerald-100 text-emerald-700 border-emerald-200'
              : 'bg-rose-100 text-rose-700 border-rose-200'
          }`}>
            {summary.is_positive_balance ? (
              <TrendingUp className="h-5 w-5" />
            ) : (
              <TrendingDown className="h-5 w-5" />
            )}
          </div>
          <div>
            <span className="text-[11px] font-semibold uppercase tracking-wider opacity-75">Saldo Diário</span>
            <div className="text-xl font-black font-mono">
              {summary.balance_formatted}
            </div>
          </div>
        </div>
      </div>

      {/* Barra de Progresso */}
      <div className="space-y-1.5">
        <div className="flex justify-between text-xs font-semibold text-slate-500">
          <span>Progresso da meta</span>
          <span>{progressPercent}%</span>
        </div>
        <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
          <div
            className={`h-full transition-all duration-500 rounded-full ${
              isGoalMet ? 'bg-emerald-500' : 'bg-blue-600'
            }`}
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>
    </div>
  )
}
