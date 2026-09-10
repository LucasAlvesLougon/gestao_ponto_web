import React, { useState } from 'react'
import { Calendar, ChevronLeft, ChevronRight, ChevronDown, Clock, Target, TrendingUp, TrendingDown, CheckCircle2, AlertCircle, Edit3 } from 'lucide-react'
import { useMonthlySummary } from '../../hooks/useSummary'
import { ExportButtons } from './ExportButtons'
import { DayEntriesModal } from './DayEntriesModal'
import { MonthPickerPopover } from './MonthPickerPopover'
import { getLocalMonthString, formatMonthYearLabel, formatDateBR, addMonths } from '../../lib/dateUtils'

export const MonthlyDashboard: React.FC = () => {
  const [selectedMonth, setSelectedMonth] = useState(() => {
    return getLocalMonthString(new Date())
  })
  const [selectedDateForModal, setSelectedDateForModal] = useState<string | null>(null)
  const [isMonthPickerOpen, setIsMonthPickerOpen] = useState(false)

  const { data, isLoading } = useMonthlySummary(selectedMonth)
  const summary = data?.summary

  const handlePreviousMonth = () => {
    setSelectedMonth((curr) => addMonths(curr, -1))
  }

  const handleNextMonth = () => {
    setSelectedMonth((curr) => addMonths(curr, 1))
  }

  const currentMonthLabel = formatMonthYearLabel(selectedMonth)

  return (
    <div className="space-y-6">
      {/* Header do Mês, Navegador e Botões de Exportação */}
      <div className="bg-[#ffffff] p-5 sm:p-6 rounded-[24px] border border-[#e5e5e5] card-shadow flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h3 className="text-xl font-semibold text-[#0a0a0a] tracking-tight">Banco de Horas Mensal</h3>
          <p className="text-xs text-[#737373] mt-0.5">Acompanhamento consolidado do período</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Botões de Exportação CSV e Impressão PDF */}
          <ExportButtons month={selectedMonth} />

          {/* Navegador de Meses com Seletor Interativo */}
          <div className="relative">
            <div className="flex items-center gap-1 bg-[#f5f5f5] p-1 rounded-[18px] border border-[#e5e5e5]">
              <button
                type="button"
                onClick={handlePreviousMonth}
                title="Mês anterior"
                aria-label="Mês anterior"
                className="p-2 rounded-[18px] hover:bg-[#ffffff] text-[#737373] hover:text-[#0a0a0a] transition-colors cursor-pointer"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>

              <button
                type="button"
                onClick={() => setIsMonthPickerOpen((prev) => !prev)}
                title="Clique para escolher mês e ano"
                aria-label="Clique para escolher mês e ano"
                aria-expanded={isMonthPickerOpen}
                className="flex items-center gap-2 px-3 py-1.5 rounded-[18px] hover:bg-[#ffffff] text-xs font-medium text-[#0a0a0a] font-mono transition-colors cursor-pointer group"
              >
                <Calendar className="h-4 w-4 text-[#0a0a0a]" />
                <span>{currentMonthLabel}</span>
                <ChevronDown
                  className={`h-3.5 w-3.5 text-[#737373] transition-transform duration-200 ${
                    isMonthPickerOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>

              <button
                type="button"
                onClick={handleNextMonth}
                title="Próximo mês"
                aria-label="Próximo mês"
                className="p-2 rounded-[18px] hover:bg-[#ffffff] text-[#737373] hover:text-[#0a0a0a] transition-colors cursor-pointer"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>

            {/* Popover de Escolha de Mês e Ano */}
            <MonthPickerPopover
              selectedMonth={selectedMonth}
              onChange={setSelectedMonth}
              isOpen={isMonthPickerOpen}
              onClose={() => setIsMonthPickerOpen(false)}
            />
          </div>
        </div>
      </div>

      {/* 4 Cards de Métricas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Horas Trabalhadas */}
        <div className="bg-[#ffffff] p-5 rounded-[24px] border border-[#e5e5e5] card-shadow flex items-center gap-3.5">
          <div className="p-2.5 rounded-[10px] bg-[#f5f5f5] text-[#0a0a0a] border border-[#e5e5e5]">
            <Clock className="h-5 w-5" />
          </div>
          <div>
            <span className="text-[11px] font-medium text-[#737373] uppercase tracking-[0.05em]">Total Trabalhado</span>
            <div className="text-2xl font-semibold text-[#0a0a0a] font-mono mt-0.5">
              {summary ? summary.total_worked_formatted : '--:--'}
            </div>
          </div>
        </div>

        {/* Meta Total */}
        <div className="bg-[#ffffff] p-5 rounded-[24px] border border-[#e5e5e5] card-shadow flex items-center gap-3.5">
          <div className="p-2.5 rounded-[10px] bg-[#f5f5f5] text-[#0a0a0a] border border-[#e5e5e5]">
            <Target className="h-5 w-5" />
          </div>
          <div>
            <span className="text-[11px] font-medium text-[#737373] uppercase tracking-[0.05em]">Meta do Período</span>
            <div className="text-2xl font-semibold text-[#0a0a0a] font-mono mt-0.5">
              {summary ? summary.total_target_formatted : '--:--'}
            </div>
          </div>
        </div>

        {/* Saldo Acumulado */}
        <div className="bg-[#ffffff] p-5 rounded-[24px] border border-[#e5e5e5] card-shadow flex items-center gap-3.5">
          <div className="p-2.5 rounded-[10px] bg-[#f5f5f5] text-[#0a0a0a] border border-[#e5e5e5]">
            {summary?.is_positive_balance ? (
              <TrendingUp className="h-5 w-5 text-[#0a0a0a]" />
            ) : (
              <TrendingDown className="h-5 w-5 text-[#737373]" />
            )}
          </div>
          <div>
            <span className="text-[11px] font-medium uppercase tracking-[0.05em] text-[#737373]">Saldo do Mês</span>
            <div className="text-2xl font-semibold text-[#0a0a0a] font-mono mt-0.5">
              {summary ? summary.balance_formatted : '--:--'}
            </div>
          </div>
        </div>

        {/* Dias Trabalhados */}
        <div className="bg-[#ffffff] p-5 rounded-[24px] border border-[#e5e5e5] card-shadow flex items-center gap-3.5">
          <div className="p-2.5 rounded-[10px] bg-[#f5f5f5] text-[#0a0a0a] border border-[#e5e5e5]">
            <Calendar className="h-5 w-5" />
          </div>
          <div>
            <span className="text-[11px] font-medium text-[#737373] uppercase tracking-[0.05em]">Dias Trabalhados</span>
            <div className="text-2xl font-semibold text-[#0a0a0a] font-mono mt-0.5">
              {summary ? `${summary.days_worked_count} dias` : '--'}
            </div>
          </div>
        </div>
      </div>

      {/* Tabela de Detalhamento Diário */}
      <div className="bg-[#ffffff] rounded-[24px] p-6 border border-[#e5e5e5] card-shadow overflow-hidden">
        <h4 className="text-base font-semibold text-[#0a0a0a] tracking-tight mb-4">Detalhamento por Dia</h4>

        {isLoading ? (
          <div className="py-12 flex flex-col items-center justify-center text-[#737373] gap-2">
            <Clock className="h-6 w-6 animate-spin text-[#0a0a0a]" />
            <span className="text-xs font-medium">Carregando demonstrativo do mês...</span>
          </div>
        ) : !summary || summary.daily_summaries.length === 0 ? (
          <div className="py-12 text-center border border-dashed border-[#e5e5e5] rounded-[18px] bg-[#fafafa]">
            <p className="text-sm font-semibold text-[#0a0a0a]">Nenhum registro de ponto encontrado neste mês.</p>
            <p className="text-xs text-[#737373] mt-1">Conforme você bater ponto, os dias aparecerão consolidados aqui.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-[#e5e5e5] text-[11px] font-medium uppercase tracking-[0.05em] text-[#737373]">
                  <th className="pb-3 pl-2">Data</th>
                  <th className="pb-3">Registros</th>
                  <th className="pb-3">Horas Trabalhadas</th>
                  <th className="pb-3">Meta</th>
                  <th className="pb-3">Saldo</th>
                  <th className="pb-3 text-center">Status</th>
                  <th className="pb-3 pr-2 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e5e5e5]">
                {summary.daily_summaries.map((day) => {
                  const dateFormatted = formatDateBR(day.date)

                  return (
                    <tr key={day.date} className="hover:bg-[#fafafa] transition-colors">
                      <td className="py-3.5 pl-2 font-mono font-semibold text-[#0a0a0a]">
                        {dateFormatted}
                      </td>
                      <td className="py-3.5 text-xs text-[#737373]">
                        {day.entries_count} batidas
                      </td>
                      <td className="py-3.5 font-mono font-medium text-[#0a0a0a]">
                        {day.total_worked_formatted}
                      </td>
                      <td className="py-3.5 font-mono text-[#737373] text-xs">
                        {day.target_formatted}
                      </td>
                      <td className="py-3.5 font-mono font-medium">
                        <span className="px-2 py-0.5 rounded-[18px] text-xs bg-[#f5f5f5] text-[#171717] border border-[#e5e5e5]">
                          {day.balance_formatted}
                        </span>
                      </td>
                      <td className="py-3.5 text-center">
                        {day.is_complete ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-medium text-[#0a0a0a]">
                            <CheckCircle2 className="h-3.5 w-3.5" />
                            Fechada
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[11px] font-medium text-[#737373]">
                            <AlertCircle className="h-3.5 w-3.5" />
                            Em aberto
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 pr-2 text-right">
                        <button
                          onClick={() => setSelectedDateForModal(day.date)}
                          title={`Visualizar e editar marcações de ${dateFormatted}`}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[18px] text-xs font-medium text-[#0a0a0a] bg-transparent border border-[#e5e5e5] hover:bg-[#f5f5f5] transition-colors cursor-pointer"
                        >
                          <Edit3 className="h-3.5 w-3.5" />
                          <span>Editar Dia</span>
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal para visualizar e editar detalhamentos do dia selecionado */}
      <DayEntriesModal
        date={selectedDateForModal}
        isOpen={!!selectedDateForModal}
        onClose={() => setSelectedDateForModal(null)}
      />
    </div>
  )
}
