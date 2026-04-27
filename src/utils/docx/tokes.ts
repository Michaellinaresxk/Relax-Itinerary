import { BorderStyle } from 'docx'

/* ── Brand palette ───────────────────────── */
export const BRAND = {
  deep: '2E3530',
  accent: '4A7C6B',
  accentSoft: '7DA394',
  warm: 'D4A574',
  muted: '8A9189',
  hint: 'B4BAB6',
  sand: 'F5F0E8',
  white: 'FFFFFF',
  red: 'B85C5C',
} as const

/* ── Fonts ───────────────────────────────── */
export const FONT = {
  display: 'Georgia',
  body: 'Calibri',
} as const

/* ── Reusable border configs ─────────────── */
const none = { style: BorderStyle.NONE, size: 0, color: BRAND.white }
const thin = { style: BorderStyle.SINGLE, size: 1, color: BRAND.hint }

export const BORDERS = {
  none: { top: none, bottom: none, left: none, right: none },
  thin: { top: thin, bottom: thin, left: thin, right: thin },
} as const
