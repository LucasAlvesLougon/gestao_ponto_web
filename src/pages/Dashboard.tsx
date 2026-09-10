import React, { useState } from 'react'
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react'
import type { User } from '../lib/types'
import { useTimeEntries } from '../hooks/useTimeEntries'
import { useDailySummary } from '../hooks/useSummary'
import { ClockActionCard } from '../components/clock/ClockActionCard'
import { DailyEntriesList } from '../components/clock/DailyEntriesList'
import { DailySummaryCard } from '../components/dashboard/DailySummaryCard'
import { getLocalDateString, formatDateBR, addDays } from '../lib/dateUtils'

interface DashboardProps {
  user: User
}

export const Dashboard: React.FC<DashboardProps> = ({ user }) => {
  const timezone = user.timezone || 'America/Sao_Paulo'
  const todayStr = getLocalDateString(new Date(), timezone)

  // Data selecionada no formato YYYY-MM-DD respeitando o fuso brasileiro do usuário
  const [selectedDate, setSelectedDate] = useState(() => todayStr)

  const {
    entries,
    nextExpectedType,
    isLoading,
    recordEntry,
    isRecording,
    updateEntry,
    isUpdating,
    deleteEntry,
    isDeleting,
  } = useTimeEntries(selectedDate)

  const isToday = selectedDate === todayStr

  const handlePreviousDay = () => {
    setSelectedDate((current) => addDays(current, -1))
  }

  const handleNextDay = () => {
    setSelectedDate((current) => addDays(current, 1))
  }

  const handleToday = () => {
    setSelectedDate(todayStr)
  }

  const { data: dailySummaryData, isLoading: isSummaryLoading } = useDailySummary(selectedDate)

  return (
    <div className="py-8 px-4 sm:px-6 max-w-[1280px] mx-auto space-y-6">
      {/* Top Banner com Saudação e Seletor de Data */}
      <div className="bg-[#ffffff] p-5 sm:p-6 rounded-[24px] border border-[#e5e5e5] card-shadow flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-[#0a0a0a] tracking-tight">Olá, {user.name}</h2>
          <p className="text-sm text-[#737373] mt-0.5">
            Fuso horário: <span className="font-medium text-[#0a0a0a]">{user.timezone}</span>
          </p>
        </div>

        {/* Navegador de Dias */}
        <div className="flex items-center gap-1 bg-[#f5f5f5] p-1 rounded-[18px] border border-[#e5e5e5]">
          <button
            onClick={handlePreviousDay}
            title="Dia anterior"
            aria-label="Dia anterior"
            className="p-2 rounded-[18px] hover:bg-[#ffffff] text-[#737373] hover:text-[#0a0a0a] transition-colors cursor-pointer"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>

          <div className="flex items-center gap-2 px-3 text-xs font-medium text-[#0a0a0a] font-mono">
            <Calendar className="h-4 w-4 text-[#0a0a0a]" />
            <span>{formatDateBR(selectedDate)}</span>
          </div>

          <button
            onClick={handleNextDay}
            title="Próximo dia"
            aria-label="Próximo dia"
            className="p-2 rounded-[18px] hover:bg-[#ffffff] text-[#737373] hover:text-[#0a0a0a] transition-colors cursor-pointer"
          >
            <ChevronRight className="h-4 w-4" />
          </button>

          {!isToday && (
            <button
              onClick={handleToday}
              className="ml-1 px-3 py-1.5 bg-[#0a0a0a] hover:bg-[#171717] text-[#fafafa] rounded-[18px] text-xs font-medium transition-colors cursor-pointer"
            >
              Hoje
            </button>
          )}
        </div>
      </div>

      {/* Relógio em Tempo Real e Botão de Ponto */}
      {isToday && (
        <ClockActionCard
          nextExpectedType={nextExpectedType}
          onRecord={(type, customTime) => recordEntry({ type, customTime })}
          isRecording={isRecording}
          timezone={timezone}
        />
      )}

      {/* Card de Resumo da Jornada Diária */}
      <DailySummaryCard
        summary={dailySummaryData?.summary}
        isLoading={isSummaryLoading}
      />

      {/* Lista e Histórico do Dia */}
      <DailyEntriesList
        entries={entries}
        isLoading={isLoading}
        onUpdate={(id, time, reason) => updateEntry({ id, time, reason })}
        onDelete={(id) => deleteEntry(id)}
        isUpdating={isUpdating}
        isDeleting={isDeleting}
        selectedDate={selectedDate}
        timezone={timezone}
      />
    </div>
  )
}
