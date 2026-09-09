import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { api } from '../lib/api'
import type { DailySummary, MonthlySummary, WorkSchedule } from '../lib/types'

export function useDailySummary(date: string) {
  return useQuery<{ summary: DailySummary }>({
    queryKey: ['summary', 'daily', date],
    queryFn: async () => {
      const res = await api.get<{ summary: DailySummary }>(`/summary/daily?date=${date}`)
      return res.data
    },
  })
}

export function useMonthlySummary(month: string) {
  return useQuery<{ summary: MonthlySummary }>({
    queryKey: ['summary', 'monthly', month],
    queryFn: async () => {
      const res = await api.get<{ summary: MonthlySummary }>(`/summary/monthly?month=${month}`)
      return res.data
    },
  })
}

export function useWorkSchedule() {
  const queryClient = useQueryClient()

  const scheduleQuery = useQuery<WorkSchedule>({
    queryKey: ['work-schedule'],
    queryFn: async () => {
      const res = await api.get<WorkSchedule>('/work-schedules')
      return res.data
    },
  })

  const updateMutation = useMutation({
    mutationFn: async (data: Partial<WorkSchedule>) => {
      const res = await api.post<{ message: string; schedule: WorkSchedule }>('/work-schedules', data)
      return res.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['work-schedule'] })
      queryClient.invalidateQueries({ queryKey: ['summary'] })
    },
  })

  return {
    schedule: scheduleQuery.data,
    isLoading: scheduleQuery.isLoading,
    updateSchedule: updateMutation.mutateAsync,
    isUpdating: updateMutation.isPending,
  }
}
