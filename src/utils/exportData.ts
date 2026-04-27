import { Packer } from 'docx'
import type { FormData } from '@/types'
import { buildItineraryDoc } from './docx/buildDocument'

/** Generate and download .docx itinerary */
export async function exportAsDocx(data: FormData): Promise<void> {
  const doc = buildItineraryDoc(data)
  const blob = await Packer.toBlob(doc)

  download(blob, buildFilename(data, 'docx'))
}

/** Download raw JSON (debug / integration) */
export function exportAsJson(data: FormData): void {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })

  download(blob, buildFilename(data, 'json'))
}

/* ── Internals ───────────────────────────── */

function buildFilename(data: FormData, ext: string): string {
  const name = data.mainGuest.replace(/\s+/g, '_') || 'cliente'
  const date = data.checkIn || 'sin-fecha'
  return `itinerario-${name}-${date}.${ext}`
}

function download(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}
