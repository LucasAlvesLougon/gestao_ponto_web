import React, { useState } from 'react'
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react'
import type { User } from '../lib/types'
import { useTimeEntries } from '../hooks/useTimeEntries'
import { useDailySummary } from '../hooks/useSummary'
import { ClockActionCard } from '../components/clock/ClockActionCard'
import { DailyEntriesList } from '../components/clock/DailyEntriesList'
import { DailySummaryCard } from '../components/dashboard/DailySummaryCard'

interface DashboardProps {
  user: User
}

export const Dashboard: React.FC<DashboardProps> = ({ user }) => {
  // Data selecionada no formato YYYY-MM-DD
  const [selectedDate, setSelectedDate] = useState(() => {
    return new Date().toISOString().slice(0, 10)
  })

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

  const isToday = selectedDate === new Date().toISOString().slice(0, 10)

  const handlePreviousDay = () => {
    const d = new Date(selectedDate + 'T12:00:00')
    d.setDate(d.getDate() - 1)
    setSelectedDate(d.toISOString().slice(0, 10))
  }

  const handleNextDay = () => {
    const d = new Date(selectedDate + 'T12:00:00')
    d.setDate(d.getDate() + 1)
    setSelectedDate(d.toISOString().slice(0, 10))
  }

  const handleToday = () => {
    setSelectedDate(new Date().toISOString().slice(0, 10))
  }

  const { data: dailySummaryData, isLoading: isSummaryLoading } = useDailySummary(selectedDate)

  return (
    <div className="py-8 px-4 sm:px-6 max-w-5xl mx-auto space-y-6">
      {/* Top Banner com Saudação e Seletor de Data */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4 transition-colors">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Olá, {user.name}! 👋</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Fuso horário: <span className="font-semibold text-slate-700 dark:text-slate-200">{user.timezone}</span>
          </p>
        </div>

        {/* Navegador de Dias */}
        <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-800/80 p-1.5 rounded-2xl border border-slate-200 dark:border-slate-700/80 transition-colors">
          <button
            onClick={handlePreviousDay}
            title="Dia anterior"
            aria-label="Dia anterior"
            className="p-2 rounded-xl hover:bg-white dark:hover:bg-slate-700 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors shadow-xs cursor-pointer"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>

          <div className="flex items-center gap-2 px-3 text-xs font-bold text-slate-700 dark:text-slate-200 font-mono">
            <Calendar className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            <span>{selectedDate.split('-').reverse().join('/')}</span>
          </div>

          <button
            onClick={handleNextDay}
            title="Próximo dia"
            aria-label="Próximo dia"
            className="p-2 rounded-xl hover:bg-white dark:hover:bg-slate-700 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors shadow-xs cursor-pointer"
          >
            <ChevronRight className="h-4 w-4" />
          </button>

          {!isToday && (
            <button
              onClick={handleToday}
              className="ml-1 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white rounded-xl text-xs font-semibold transition-colors cursor-pointer"
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
          timezone={user.timezone}
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
      />
    </div>
  )
}
