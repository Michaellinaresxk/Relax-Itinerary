import { Packer } from 'docx'
import type { FormData } from '@/types'
import { buildItineraryDoc } from './docx/buildDocument'

/* ── Public API ──────────────────────────── */

/** Generate .docx, send to concierge email, and download locally as backup */
export async function submitItinerary(data: FormData): Promise<void> {
  const doc = buildItineraryDoc(data)
  const blob = await Packer.toBlob(doc)
  const filename = buildFilename(data, 'docx')

  // Send to concierge via API — this is the primary action
  await sendToConcierge(blob, filename, data)

  // Also download locally as backup for the client
  download(blob, filename)
}

/** Generate and download .docx locally (fallback / offline) */
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

/* ── Email sending ───────────────────────── */

async function sendToConcierge(blob: Blob, filename: string, data: FormData): Promise<void> {
  const fileBase64 = await blobToBase64(blob)

  const res = await fetch('/api/send-itinerary', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      filename,
      fileBase64,
      guestName: data.mainGuest,
      email: data.email,
      checkIn: data.checkIn,
      checkOut: data.checkOut,
    }),
  })

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Unknown error' }))
    throw new Error(err.error || `Server responded with ${res.status}`)
  }
}

/* ── Internals ───────────────────────────── */

function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      const result = reader.result as string
      // Strip the data:...;base64, prefix — Resend expects raw base64
      const base64 = result.split(',')[1]
      resolve(base64 ?? '')
    }
    reader.onerror = () => reject(new Error('Failed to read blob'))
    reader.readAsDataURL(blob)
  })
}

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
