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
      className={`p-3 bg-[#121214] text-[#fafafa] rounded-[18px] border border-[#27272a] shadow-2xl ${className}`}
      classNames={{
        months: 'relative flex flex-col sm:flex-row gap-4',
        month: 'space-y-3',
        month_caption: 'flex justify-center pt-1 relative items-center mb-2 px-8',
        caption_label: 'text-sm font-semibold text-[#fafafa]',
        dropdowns: 'flex items-center gap-1.5',
        dropdown: 'bg-[#1c1c20] text-[#fafafa] border border-[#27272a] rounded-[10px] text-xs px-2 py-1 focus:outline-none cursor-pointer',
        nav: 'flex items-center justify-between absolute inset-x-1 top-1',
        button_previous: 'p-1.5 rounded-[10px] bg-[#1c1c20] text-[#a1a1aa] hover:text-[#fafafa] hover:bg-[#27272a] transition-colors cursor-pointer border border-[#27272a]',
        button_next: 'p-1.5 rounded-[10px] bg-[#1c1c20] text-[#a1a1aa] hover:text-[#fafafa] hover:bg-[#27272a] transition-colors cursor-pointer border border-[#27272a]',
        month_grid: 'w-full border-collapse space-y-1',
        weekdays: 'flex justify-between',
        weekday: 'text-[#a1a1aa] rounded-[10px] w-8 font-normal text-[0.8rem] text-center capitalize',
        week: 'flex justify-between w-full mt-1',
        day: 'p-0 text-center text-sm relative flex items-center justify-center',
        day_button: 'h-8 w-8 p-0 font-normal rounded-[10px] transition-colors hover:bg-[#27272a] hover:text-[#fafafa] flex items-center justify-center cursor-pointer text-[#fafafa]',
        selected: '!bg-[#fafafa] !text-[#09090b] font-semibold !rounded-[10px] hover:!bg-[#fafafa] hover:!text-[#09090b]',
        today: 'border border-[#fafafa]/40 font-semibold',
        outside: '!text-[#71717a] opacity-40',
        disabled: '!text-[#71717a] opacity-25 cursor-not-allowed hover:!bg-transparent',
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
            return <ChevronUp className={`h-4 w-4 ${chevronClass || ''}`} {...chevronProps} />
          }
          return <ChevronDown className={`h-4 w-4 ${chevronClass || ''}`} {...chevronProps} />
        },
      }}
      {...props}
    />
  )
}
Calendar.displayName = 'Calendar'
