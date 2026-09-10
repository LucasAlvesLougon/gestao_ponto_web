import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { api } from '../lib/api'
import type { TimeEntry, TimeEntryType } from '../lib/types'

interface TimeEntriesResponse {
  date: string
  timezone: string
  next_expected_type: TimeEntryType
  entries: TimeEntry[]
}

export function useTimeEntries(date: string) {
  const queryClient = useQueryClient()

  // Buscar registros da data selecionada
  const { data, isLoading, error, refetch } = useQuery<TimeEntriesResponse>({
    queryKey: ['time-entries', date],
    queryFn: async () => {
      const response = await api.get<TimeEntriesResponse>(`/time-entries?date=${date}`)
      return response.data
    },
  })

  // Mutação para bater ponto
  const recordMutation = useMutation({
    mutationFn: async ({ type, customTime }: { type?: TimeEntryType; customTime?: string }) => {
      const payload: { type?: TimeEntryType; custom_time?: string } = {}
      if (type) payload.type = type
      if (customTime) payload.custom_time = customTime

      const response = await api.post<{ message: string; entry: TimeEntry; next_expected_type: TimeEntryType }>(
        '/time-entries',
        payload
      )
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['time-entries', date] })
      queryClient.invalidateQueries({ queryKey: ['summary'] })
    },
  })

  // Mutação para editar registro
  const updateMutation = useMutation({
    mutationFn: async ({ id, time, reason }: { id: number; time: string; reason?: string }) => {
      const response = await api.put<{ message: string; entry: TimeEntry }>(`/time-entries/${id}`, {
        time,
        ...(reason ? { reason } : {}),
      })
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['time-entries', date] })
      queryClient.invalidateQueries({ queryKey: ['summary'] })
    },
  })

  // Mutação para excluir registro
  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await api.delete<{ message: string }>(`/time-entries/${id}`)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['time-entries', date] })
      queryClient.invalidateQueries({ queryKey: ['summary'] })
    },
  })

  return {
    entries: data?.entries ?? [],
    nextExpectedType: data?.next_expected_type ?? 'CLOCK_IN',
    timezone: data?.timezone,
    isLoading,
    error,
    refetch,
    recordEntry: recordMutation.mutateAsync,
    isRecording: recordMutation.isPending,
    recordError: recordMutation.error as any,
    updateEntry: updateMutation.mutateAsync,
    isUpdating: updateMutation.isPending,
    deleteEntry: deleteMutation.mutateAsync,
    isDeleting: deleteMutation.isPending,
  }
}
