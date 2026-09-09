export type TimeEntryType = 'CLOCK_IN' | 'BREAK_START' | 'BREAK_END' | 'CLOCK_OUT'

export interface User {
  id: number
  name: string
  email: string
  timezone: string
  created_at?: string
  updated_at?: string
}

export interface WorkSchedule {
  id?: number
  user_id?: number
  daily_target_hours: number
  break_duration: string
  effective_from: string
  effective_until?: string | null
}

export interface TimeEntry {
  id: number
  user_id: number
  type: TimeEntryType
  registered_at: string
  is_edited: boolean
  edit_reason?: string | null
  original_registered_at?: string | null
  created_at?: string
  updated_at?: string
}

export interface DailySummary {
  date: string
  total_worked_minutes: number
  total_worked_formatted: string
  target_minutes: number
  target_formatted: string
  balance_minutes: number
  balance_formatted: string
  is_positive_balance: boolean
  entries_count: number
  is_complete: boolean
}

export interface MonthlySummary {
  month: string
  total_worked_minutes: number
  total_worked_formatted: string
  total_target_minutes: number
  total_target_formatted: string
  balance_minutes: number
  balance_formatted: string
  is_positive_balance: boolean
  days_worked_count: number
  daily_summaries: DailySummary[]
}

export interface AuthResponse {
  user: User
  token: string
}
