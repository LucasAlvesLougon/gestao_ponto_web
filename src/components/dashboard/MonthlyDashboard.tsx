import React, { useState } from 'react'
import { Calendar, ChevronLeft, ChevronRight, Clock, Target, TrendingUp, TrendingDown, CheckCircle2, AlertCircle } from 'lucide-react'
import { useMonthlySummary } from '../../hooks/useSummary'
import { ExportButtons } from './ExportButtons'

export const MonthlyDashboard: React.FC = () => {
  const [selectedMonth, setSelectedMonth] = useState(() => {
    return new Date().toISOString().slice(0, 7) // YYYY-MM
  })

  const { data, isLoading } = useMonthlySummary(selectedMonth)
  const summary = data?.summary

  const handlePreviousMonth = () => {
    const [year, month] = selectedMonth.split('-').map(Number)
    const date = new Date(year, month - 2, 1)
    setSelectedMonth(date.toISOString().slice(0, 7))
  }

  const handleNextMonth = () => {
    const [year, month] = selectedMonth.split('-').map(Number)
    const date = new Date(year, month, 1)
    setSelectedMonth(date.toISOString().slice(0, 7))
  }

  const [year, monthNum] = selectedMonth.split('-')
  const monthNames = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ]
  const currentMonthLabel = `${monthNames[parseInt(monthNum, 10) - 1]} de ${year}`

  return (
    <div className="space-y-6">
      {/* Header do Mês, Navegador e Botões de Exportação */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h3 className="text-xl font-bold text-slate-900">Banco de Horas Mensal</h3>
          <p className="text-xs text-slate-500 mt-0.5">Acompanhamento consolidado do período</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Botões de Exportação CSV e Impressão PDF */}
          <ExportButtons month={selectedMonth} />

          {/* Navegador de Meses */}
          <div className="flex items-center gap-2 bg-slate-50 p-1.5 rounded-2xl border border-slate-200">
            <button
              onClick={handlePreviousMonth}
              title="Mês anterior"
              className="p-2 rounded-xl hover:bg-white text-slate-600 hover:text-slate-900 transition-colors shadow-xs cursor-pointer"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>

            <div className="flex items-center gap-2 px-3 text-xs font-bold text-slate-800 font-mono">
              <Calendar className="h-4 w-4 text-blue-600" />
              <span>{currentMonthLabel}</span>
            </div>

            <button
              onClick={handleNextMonth}
              title="Próximo mês"
              className="p-2 rounded-xl hover:bg-white text-slate-600 hover:text-slate-900 transition-colors shadow-xs cursor-pointer"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* 4 Cards de Métricas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Horas Trabalhadas */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="p-3 rounded-2xl bg-blue-50 text-blue-600 border border-blue-100">
            <Clock className="h-6 w-6" />
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Trabalhado</span>
            <div className="text-2xl font-black text-slate-900 font-mono mt-0.5">
              {summary ? summary.total_worked_formatted : '--:--'}
            </div>
          </div>
        </div>

        {/* Meta Total */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="p-3 rounded-2xl bg-purple-50 text-purple-600 border border-purple-100">
            <Target className="h-6 w-6" />
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Meta do Período</span>
            <div className="text-2xl font-black text-slate-900 font-mono mt-0.5">
              {summary ? summary.total_target_formatted : '--:--'}
            </div>
          </div>
        </div>

        {/* Saldo Acumulado (Em Destaque) */}
        <div className={`p-6 rounded-3xl border shadow-sm flex items-center gap-4 ${
          summary?.is_positive_balance
            ? 'bg-emerald-50/70 border-emerald-200 text-emerald-900'
            : 'bg-rose-50/70 border-rose-200 text-rose-900'
        }`}>
          <div className={`p-3 rounded-2xl border ${
            summary?.is_positive_balance
              ? 'bg-emerald-100 text-emerald-700 border-emerald-200'
              : 'bg-rose-100 text-rose-700 border-rose-200'
          }`}>
            {summary?.is_positive_balance ? (
              <TrendingUp className="h-6 w-6" />
            ) : (
              <TrendingDown className="h-6 w-6" />
            )}
          </div>
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider opacity-75">Saldo do Mês</span>
            <div className="text-2xl font-black font-mono mt-0.5">
              {summary ? summary.balance_formatted : '--:--'}
            </div>
          </div>
        </div>

        {/* Dias Trabalhados */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="p-3 rounded-2xl bg-slate-100 text-slate-700 border border-slate-200">
            <Calendar className="h-6 w-6" />
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Dias Trabalhados</span>
            <div className="text-2xl font-black text-slate-900 font-mono mt-0.5">
              {summary ? `${summary.days_worked_count} dias` : '--'}
            </div>
          </div>
        </div>
      </div>

      {/* Tabela de Detalhamento Diário */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm overflow-hidden">
        <h4 className="text-base font-bold text-slate-900 mb-4">Detalhamento por Dia</h4>

        {isLoading ? (
          <div className="py-12 flex flex-col items-center justify-center text-slate-400 gap-2">
            <Clock className="h-6 w-6 animate-spin text-blue-600" />
            <span className="text-xs font-medium">Carregando demonstrativo do mês...</span>
          </div>
        ) : !summary || summary.daily_summaries.length === 0 ? (
          <div className="py-12 text-center border-2 border-dashed border-slate-100 rounded-2xl bg-slate-50/50">
            <p className="text-sm font-bold text-slate-600">Nenhum registro de ponto encontrado neste mês.</p>
            <p className="text-xs text-slate-400 mt-1">Conforme você bater ponto, os dias aparecerão consolidados aqui.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-100 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  <th className="pb-3 pl-2">Data</th>
                  <th className="pb-3">Registros</th>
                  <th className="pb-3">Horas Trabalhadas</th>
                  <th className="pb-3">Meta</th>
                  <th className="pb-3">Saldo</th>
                  <th className="pb-3 pr-2 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {summary.daily_summaries.map((day) => {
                  const [y, m, d] = day.date.split('-')
                  const dateFormatted = `${d}/${m}/${y}`

                  return (
                    <tr key={day.date} className="hover:bg-slate-50/50 transition-colors">
                      <td className="py-3.5 pl-2 font-mono font-bold text-slate-800">
                        {dateFormatted}
                      </td>
                      <td className="py-3.5 text-xs text-slate-500">
                        {day.entries_count} batidas
                      </td>
                      <td className="py-3.5 font-mono font-semibold text-slate-900">
                        {day.total_worked_formatted}
                      </td>
                      <td className="py-3.5 font-mono text-slate-500 text-xs">
                        {day.target_formatted}
                      </td>
                      <td className="py-3.5 font-mono font-bold">
                        <span className={`px-2 py-0.5 rounded-lg text-xs ${
                          day.is_positive_balance
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-rose-50 text-rose-700 border border-rose-200'
                        }`}>
                          {day.balance_formatted}
                        </span>
                      </td>
                      <td className="py-3.5 pr-2 text-right">
                        {day.is_complete ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600">
                            <CheckCircle2 className="h-3.5 w-3.5" />
                            Fechada
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-600">
                            <AlertCircle className="h-3.5 w-3.5" />
                            Em aberto
                          </span>
                        )}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
