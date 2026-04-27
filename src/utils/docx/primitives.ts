import {
  Paragraph,
  TextRun,
  Table,
  TableRow,
  TableCell,
  AlignmentType,
  BorderStyle,
  WidthType,
} from 'docx'
import { BORDERS, BRAND, FONT } from './tokes'

/* ── Text primitives ─────────────────────── */

/** Highlighted placeholder for concierge to complete */
export function placeholder(text: string): TextRun {
  return new TextRun({
    text,
    font: FONT.body,
    size: 20,
    color: BRAND.muted,
    italics: true,
    highlight: 'yellow',
  })
}

/** Standard body text with optional overrides */
export function bodyText(
  text: string,
  opts: Partial<{
    bold: boolean
    color: string
    size: number
    italics: boolean
    font: string
  }> = {},
): TextRun {
  return new TextRun({
    text,
    font: opts.font || FONT.body,
    size: opts.size || 20,
    color: opts.color || BRAND.deep,
    bold: opts.bold || false,
    italics: opts.italics || false,
  })
}

/* ── Paragraph primitives ────────────────── */

/** Uppercase section divider */
export function sectionTitle(text: string): Paragraph {
  return new Paragraph({
    spacing: { before: 360, after: 160 },
    children: [
      new TextRun({
        text: text.toUpperCase(),
        font: FONT.body,
        size: 18,
        color: BRAND.accent,
        bold: true,
        characterSpacing: 80,
      }),
    ],
    border: {
      bottom: { style: BorderStyle.SINGLE, size: 1, color: BRAND.hint, space: 6 },
    },
  })
}

/** Serif subsection heading */
export function subHeading(text: string): Paragraph {
  return new Paragraph({
    spacing: { before: 240, after: 120 },
    children: [
      new TextRun({
        text,
        font: FONT.display,
        size: 24,
        color: BRAND.deep,
        bold: true,
      }),
    ],
  })
}

/** Day label (e.g. "Día 1 — mar 19 ago") */
export function dayLabel(text: string): Paragraph {
  return new Paragraph({
    spacing: { before: 200, after: 100 },
    children: [
      new TextRun({
        text,
        font: FONT.body,
        size: 19,
        color: BRAND.accent,
        bold: true,
      }),
    ],
  })
}

/** Empty vertical spacer */
export function spacer(pts = 120): Paragraph {
  return new Paragraph({ spacing: { before: pts, after: 0 }, children: [] })
}

/* ── Table primitives ────────────────────── */

/** Single key-value row (label | value) */
export function kvRow(label: string, value: string, isPlaceholder = false): TableRow {
  return new TableRow({
    children: [
      new TableCell({
        borders: BORDERS.none,
        width: { size: 2800, type: WidthType.DXA },
        margins: { top: 40, bottom: 40, left: 0, right: 100 },
        children: [
          new Paragraph({
            children: [bodyText(label, { color: BRAND.muted, size: 19 })],
          }),
        ],
      }),
      new TableCell({
        borders: BORDERS.none,
        width: { size: 6560, type: WidthType.DXA },
        margins: { top: 40, bottom: 40, left: 100, right: 0 },
        children: [
          new Paragraph({
            children: [isPlaceholder ? placeholder(value) : bodyText(value)],
          }),
        ],
      }),
    ],
  })
}

/** Two-column info table from kvRow entries */
export function kvTable(rows: TableRow[]): Table {
  return new Table({
    width: { size: 9360, type: WidthType.DXA },
    columnWidths: [2800, 6560],
    rows,
  })
}
