import {
  Document,
  Paragraph,
  TextRun,
  Header,
  Footer,
  PageNumber,
  TabStopType,
  TabStopPosition,
} from 'docx'
import type { FormData } from '@/types'
import { getDayKeys } from './dates'
import {
  coverSection,
  quickInfoSection,
  welcomeSection,
  propertySection,
  guestsSection,
  contactSection,
  flightsSection,
  arrivalSection,
  transferSection,
  activitiesSection,
  equipmentSection,
  mealsSection,
  allergiesSection,
  cancellationSection,
  closingSection,
} from './sections'
import { BRAND, FONT } from './tokes'

export function buildItineraryDoc(data: FormData): Document {
  const guestName = data.mainGuest || 'Huésped'
  const days = getDayKeys(data.checkIn, data.checkOut)
  const totalDays = Math.max(days.length, 1)

  /* ── Has content flags for page breaks ── */
  const hasExperiences =
    days.some((d) => (data.dayActivities[d] || []).length > 0) || data.equipment.length > 0

  /* ── Assemble all blocks ───────────────── */
  const children = [
    ...coverSection(guestName),
    ...quickInfoSection(data),
    ...welcomeSection(guestName),
    ...propertySection(),
    ...guestsSection(data),
    ...contactSection(),
    ...flightsSection(data),
    ...arrivalSection(data),
    ...transferSection(data),
    ...(hasExperiences
      ? [...activitiesSection(data, days), ...equipmentSection(data, totalDays)]
      : []),
    ...mealsSection(data, days),
    ...allergiesSection(data),
    ...cancellationSection(),
    ...closingSection(),
  ]

  return new Document({
    styles: {
      default: {
        document: {
          run: { font: FONT.body, size: 20, color: BRAND.deep },
        },
      },
      paragraphStyles: [
        {
          id: 'Heading1',
          name: 'Heading 1',
          basedOn: 'Normal',
          next: 'Normal',
          quickFormat: true,
          run: { size: 32, bold: true, font: FONT.display, color: BRAND.deep },
          paragraph: { spacing: { before: 360, after: 200 }, outlineLevel: 0 },
        },
        {
          id: 'Heading2',
          name: 'Heading 2',
          basedOn: 'Normal',
          next: 'Normal',
          quickFormat: true,
          run: { size: 26, bold: true, font: FONT.display, color: BRAND.deep },
          paragraph: { spacing: { before: 240, after: 160 }, outlineLevel: 1 },
        },
      ],
    },
    sections: [
      {
        properties: {
          page: {
            size: { width: 12240, height: 15840 },
            margin: { top: 1200, right: 1440, bottom: 1200, left: 1440 },
          },
        },
        headers: {
          default: new Header({
            children: [
              new Paragraph({
                alignment: 'right' as any,
                children: [
                  new TextRun({
                    text: 'RelaxInn Vacation Homes',
                    font: FONT.body,
                    size: 14,
                    color: BRAND.hint,
                    characterSpacing: 40,
                  }),
                ],
              }),
            ],
          }),
        },
        footers: {
          default: new Footer({
            children: [
              new Paragraph({
                tabStops: [{ type: TabStopType.RIGHT, position: TabStopPosition.MAX }],
                children: [
                  new TextRun({
                    text: `Itinerario — ${guestName}`,
                    font: FONT.body,
                    size: 14,
                    color: BRAND.hint,
                  }),
                  new TextRun({
                    children: ['\t', 'Página ', PageNumber.CURRENT, ' de ', PageNumber.TOTAL_PAGES],
                    font: FONT.body,
                    size: 14,
                    color: BRAND.hint,
                  }),
                ],
              }),
            ],
          }),
        },
        children,
      },
    ],
  })
}
