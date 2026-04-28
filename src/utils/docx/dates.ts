/** "19 de agosto de 2025" */
export function formatDate(iso: string): string {
  if (!iso) return ''
  const d = new Date(iso + 'T12:00:00')
  return d.toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })
}

/** "mar 19 ago" */
export function formatDateShort(iso: string): string {
  if (!iso) return ''
  const d = new Date(iso + 'T12:00:00')
  return d.toLocaleDateString('es-ES', { weekday: 'short', day: 'numeric', month: 'short' })
}

/** Returns array of ISO date keys between check-in and check-out (inclusive) */
export function getDayKeys(checkIn: string, checkOut: string): string[] {
  if (!checkIn || !checkOut) return []
  const start = new Date(checkIn + 'T12:00:00')
  const end = new Date(checkOut + 'T12:00:00')
  const result: string[] = []
  const current = new Date(start)
  while (current <= end) {
    result.push(current.toISOString().split('T')[0] ?? '')
    current.setDate(current.getDate() + 1)
  }
  return result
}
