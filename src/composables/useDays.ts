import { computed } from 'vue'
import { useFormData } from './useFormData'

export function useDays() {
  const { state } = useFormData()

  const days = computed<Date[]>(() => {
    if (!state.checkIn || !state.checkOut) return []

    const start = new Date(state.checkIn + 'T12:00:00')
    const end = new Date(state.checkOut + 'T12:00:00')
    const result: Date[] = []
    const current = new Date(start)

    while (current <= end) {
      result.push(new Date(current))
      current.setDate(current.getDate() + 1)
    }

    return result
  })

  const numDays = computed(() => Math.max(days.value.length, 1))

  const hasDays = computed(() => days.value.length > 0)

  return { days, numDays, hasDays }
}
