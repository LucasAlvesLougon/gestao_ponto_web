import React, { useState, useEffect, useRef } from 'react'
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react'

interface MonthPickerPopoverProps {
  selectedMonth: string // YYYY-MM
  onChange: (month: string) => void
  isOpen: boolean
  onClose: () => void
}

export const MonthPickerPopover: React.FC<MonthPickerPopoverProps> = ({
  selectedMonth,
  onChange,
  isOpen,
  onClose,
}) => {
  const [selectedYear, selectedMonthNum] = selectedMonth.split('-').map(Number)
  const [displayYear, setDisplayYear] = useState(selectedYear)
  const popoverRef = useRef<HTMLDivElement>(null)

  // Sincroniza o ano ao abrir o popover ou quando selectedMonth muda
  useEffect(() => {
    if (isOpen) {
      setDisplayYear(selectedYear)
    }
  }, [isOpen, selectedYear])

  // Fecha ao clicar fora ou pressionar Escape
  useEffect(() => {
    if (!isOpen) return

    const handleClickOutside = (event: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
        onClose()
      }
    }

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose()
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('keydown', handleEscape)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleEscape)
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  const months = [
    { short: 'Jan', full: 'Janeiro', num: 1 },
    { short: 'Fev', full: 'Fevereiro', num: 2 },
    { short: 'Mar', full: 'Março', num: 3 },
    { short: 'Abr', full: 'Abril', num: 4 },
    { short: 'Mai', full: 'Maio', num: 5 },
    { short: 'Jun', full: 'Junho', num: 6 },
    { short: 'Jul', full: 'Julho', num: 7 },
    { short: 'Ago', full: 'Agosto', num: 8 },
    { short: 'Set', full: 'Setembro', num: 9 },
    { short: 'Out', full: 'Outubro', num: 10 },
    { short: 'Nov', full: 'Novembro', num: 11 },
    { short: 'Dez', full: 'Dezembro', num: 12 },
  ]

  const now = new Date()
  const currentYear = now.getFullYear()
  const currentMonthNum = now.getMonth() + 1
  const currentMonthIso = `${currentYear}-${String(currentMonthNum).padStart(2, '0')}`

  const handleSelectMonth = (monthNum: number) => {
    const formatted = `${displayYear}-${String(monthNum).padStart(2, '0')}`
    onChange(formatted)
    onClose()
  }

  const handleGoToCurrentMonth = () => {
    onChange(currentMonthIso)
    onClose()
  }

  return (
    <div
      ref={popoverRef}
      className="absolute right-0 top-full mt-2 z-50 w-72 max-w-[calc(100vw-2rem)] bg-[#121214] border border-[#27272a] rounded-[24px] p-4 card-shadow animate-in fade-in zoom-in-95 duration-150 text-[#fafafa]"
    >
      {/* Seletor de Ano */}
      <div className="flex items-center justify-between pb-3 border-b border-[#27272a]">
        <button
          type="button"
          onClick={() => setDisplayYear((y) => y - 1)}
          className="p-1.5 rounded-[18px] hover:bg-[#1c1c20] text-[#a1a1aa] hover:text-[#fafafa] transition-colors cursor-pointer"
          title="Ano anterior"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>

        <span className="font-mono font-semibold text-sm text-[#fafafa]">{displayYear}</span>

        <button
          type="button"
          onClick={() => setDisplayYear((y) => y + 1)}
          className="p-1.5 rounded-[18px] hover:bg-[#1c1c20] text-[#a1a1aa] hover:text-[#fafafa] transition-colors cursor-pointer"
          title="Próximo ano"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      {/* Grade de Meses (3 colunas x 4 linhas) */}
      <div className="grid grid-cols-3 gap-2 py-3">
        {months.map((m) => {
          const isSelected = displayYear === selectedYear && m.num === selectedMonthNum
          const isCurrent = displayYear === currentYear && m.num === currentMonthNum

          return (
            <button
              key={m.num}
              type="button"
              onClick={() => handleSelectMonth(m.num)}
              title={m.full}
              className={`py-2 px-2.5 rounded-[18px] text-xs transition-colors cursor-pointer text-center ${
                isSelected
                  ? 'bg-[#fafafa] text-[#09090b] font-medium'
                  : isCurrent
                  ? 'bg-[#1c1c20] text-[#fafafa] border border-[#27272a] font-medium'
                  : 'text-[#a1a1aa] hover:bg-[#1c1c20] hover:text-[#fafafa]'
              }`}
            >
              {m.short}
            </button>
          )
        })}
      </div>

      {/* Ação rápida: Mês Atual */}
      <div className="pt-2.5 border-t border-[#27272a] flex items-center justify-between">
        <button
          type="button"
          onClick={handleGoToCurrentMonth}
          className="w-full flex items-center justify-center gap-1.5 py-1.5 rounded-[18px] text-xs font-medium text-[#fafafa] hover:bg-[#1c1c20] transition-colors cursor-pointer"
        >
          <Calendar className="h-3.5 w-3.5 text-[#fafafa]" />
          <span>Ir para o mês atual</span>
        </button>
      </div>
    </div>
  )
}
