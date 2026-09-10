import * as React from 'react'
import { ChevronLeft, ChevronRight, ChevronDown, ChevronUp } from 'lucide-react'
import { DayPicker } from 'react-day-picker'
import 'react-day-picker/style.css'
import { ptBR } from 'date-fns/locale'

export type CalendarProps = React.ComponentProps<typeof DayPicker>

export function Calendar({
  className = '',
  classNames,
  showOutsideDays = true,
  locale = ptBR,
  ...props
}: CalendarProps) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      locale={locale}
      className={`p-3.5 bg-[#121214] text-[#fafafa] rounded-[18px] border border-[#27272a] shadow-2xl ${className}`}
      classNames={{
        months: 'relative flex flex-col',
        month: 'space-y-3',
        month_caption: 'flex justify-center items-center h-8 relative px-9 mb-2',
        dropdowns: 'flex items-center gap-1.5',
        dropdown_root: 'relative inline-flex items-center rounded-[8px] bg-[#1c1c20] border border-[#27272a] hover:bg-[#27272a] transition-colors',
        dropdown: 'absolute inset-0 opacity-0 w-full h-full cursor-pointer z-10',
        caption_label: 'flex items-center gap-1 text-xs font-medium text-[#fafafa] px-2 py-1 pointer-events-none capitalize',
        nav: 'flex items-center justify-between absolute inset-x-1 top-0.5 z-20 pointer-events-none',
        button_previous: 'pointer-events-auto h-7 w-7 p-0 flex items-center justify-center rounded-[8px] bg-[#1c1c20] text-[#a1a1aa] hover:text-[#fafafa] hover:bg-[#27272a] border border-[#27272a] transition-colors cursor-pointer',
        button_next: 'pointer-events-auto h-7 w-7 p-0 flex items-center justify-center rounded-[8px] bg-[#1c1c20] text-[#a1a1aa] hover:text-[#fafafa] hover:bg-[#27272a] border border-[#27272a] transition-colors cursor-pointer',
        month_grid: 'w-full border-collapse',
        weekdays: 'flex justify-between w-full mb-1',
        weekday: 'w-8 h-8 flex items-center justify-center text-[11px] font-medium text-[#71717a] text-center capitalize',
        week: 'flex justify-between w-full mt-1',
        day: 'w-8 h-8 p-0 text-center text-xs relative flex items-center justify-center',
        day_button: 'w-8 h-8 p-0 rounded-[8px] text-xs font-normal text-[#fafafa] hover:bg-[#27272a] hover:text-[#fafafa] flex items-center justify-center cursor-pointer transition-colors',
        selected: '[&>button]:!bg-[#fafafa] [&>button]:!text-[#09090b] [&>button]:font-semibold [&>button]:!rounded-[8px] [&>button]:hover:!bg-[#fafafa] [&>button]:hover:!text-[#09090b]',
        today: '[&>button]:border [&>button]:border-[#fafafa]/40 font-semibold',
        outside: 'opacity-30 text-[#71717a]',
        disabled: 'opacity-20 cursor-not-allowed [&>button]:cursor-not-allowed [&>button]:hover:!bg-transparent',
        hidden: 'invisible',
        ...classNames,
      }}
      components={{
        Chevron: ({ orientation, className: chevronClass, ...chevronProps }) => {
          if (orientation === 'left') {
            return <ChevronLeft className={`h-4 w-4 ${chevronClass || ''}`} {...chevronProps} />
          }
          if (orientation === 'right') {
            return <ChevronRight className={`h-4 w-4 ${chevronClass || ''}`} {...chevronProps} />
          }
          if (orientation === 'up') {
            return <ChevronUp className={`h-3.5 w-3.5 text-[#a1a1aa] ${chevronClass || ''}`} {...chevronProps} />
          }
          return <ChevronDown className={`h-3.5 w-3.5 text-[#a1a1aa] ${chevronClass || ''}`} {...chevronProps} />
        },
      }}
      {...props}
    />
  )
}
Calendar.displayName = 'Calendar'
