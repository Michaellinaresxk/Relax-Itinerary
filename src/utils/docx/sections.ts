import {
  Paragraph,
  TextRun,
  Table,
  TableRow,
  PageBreak,
  AlignmentType,
  ShadingType,
  ExternalHyperlink,
} from 'docx'
import type { FormData } from '@/types'
import { ALL_ACTIVITIES, EQUIPMENT, MEAL_TIMES } from '@/constants/catalog'
import { BRAND, FONT } from './tokes'
import {
  bodyText,
  placeholder,
  sectionTitle,
  subHeading,
  dayLabel,
  spacer,
  kvRow,
  kvTable,
} from './primitives'
import { formatDate, formatDateShort } from './dates'

type Block = Paragraph | Table

/* ═══════════════════════════════════════════════════════════════ */

export function coverSection(guestName: string): Block[] {
  return [
    new Paragraph({
      spacing: { before: 600, after: 0 },
      alignment: AlignmentType.CENTER,
      children: [
        new TextRun({
          text: 'RELAXINN',
          font: FONT.display,
          size: 48,
          color: BRAND.deep,
          characterSpacing: 200,
        }),
      ],
    }),
    new Paragraph({
      spacing: { before: 40, after: 200 },
      alignment: AlignmentType.CENTER,
      children: [
        new TextRun({
          text: 'VACATION HOMES',
          font: FONT.body,
          size: 16,
          color: BRAND.accentSoft,
          characterSpacing: 160,
        }),
      ],
    }),
    new Paragraph({
      spacing: { before: 0, after: 0 },
      alignment: AlignmentType.CENTER,
      border: { bottom: { style: 'single' as any, size: 1, color: BRAND.hint, space: 12 } },
      children: [
        new TextRun({
          text: 'ITINERARIO',
          font: FONT.display,
          size: 36,
          color: BRAND.accent,
          characterSpacing: 120,
        }),
      ],
    }),
    spacer(200),
  ]
}

/* ── Quick info ──────────────────────────── */

export function quickInfoSection(data: FormData): Block[] {
  const rows = [
    kvRow('Huésped principal', data.mainGuest || '—'),
    kvRow('Email', data.email || '—'),
    kvRow('Teléfono', data.phone || '—'),
    kvRow('Check-in', data.checkIn ? formatDate(data.checkIn) : '—'),
    kvRow('Check-out', data.checkOut ? formatDate(data.checkOut) : '—'),
    kvRow('Adultos', String(data.adults)),
    ...(data.children > 0
      ? [kvRow('Niños', `${data.children} (edades: ${data.childAges.join(', ') || '—'})`)]
      : []),
    kvRow('Villa', '(completar)', true),
    kvRow('Resort', '(completar)', true),
    kvRow('Concierge', '(nombre del concierge)', true),
  ]
  return [kvTable(rows), spacer(60)]
}

/* ── Welcome ─────────────────────────────── */

export function welcomeSection(guestName: string): Block[] {
  return [
    new Paragraph({
      spacing: { before: 200, after: 200 },
      children: [
        bodyText(`Estimado/a ${guestName},`, { italics: true, size: 21, font: FONT.display }),
      ],
    }),
    new Paragraph({
      spacing: { before: 0, after: 120 },
      children: [
        bodyText(
          'Gracias por reservar tu próxima escapada con RelaxInn Vacation Homes. En este documento encontrarás tu itinerario final con todos los detalles clave y los números de contacto importantes para tu estancia.',
        ),
      ],
    }),
    new Paragraph({
      spacing: { before: 0, after: 200 },
      children: [
        bodyText(
          'Te recomendamos llevar una copia impresa para tener a mano durante todo el viaje.',
          { color: BRAND.muted },
        ),
      ],
    }),
  ]
}

/* ── Property ────────────────────────────── */

export function propertySection(): Block[] {
  return [
    sectionTitle('Detalles de la propiedad'),
    kvTable([
      kvRow('Villa', '(nombre de la villa)', true),
      kvRow('Resort', '(nombre del resort)', true),
      kvRow('Habitaciones', '(cantidad y descripción)', true),
      kvRow('Personal incluido', '(chef, mucama, etc.)', true),
      kvRow('Servicios', '(piscina, jacuzzi, etc.)', true),
      kvRow('Dirección', '(dirección completa)', true),
      kvRow('Wi-Fi usuario', '(nombre de red)', true),
      kvRow('Wi-Fi contraseña', '(contraseña)', true),
    ]),
  ]
}

/* ── Guest list ──────────────────────────── */

export function guestsSection(data: FormData): Block[] {
  const filledGuests = data.guests.filter((g) => g.name.trim())
  const totalGroup = data.adults + data.children
  const filled = 1 + filledGuests.length

  const rows: TableRow[] = [
    kvRow(`1. ${data.mainGuest || 'Huésped principal'}`, 'Huésped principal'),
    ...filledGuests.map((g, i) => kvRow(`${i + 2}. ${g.name}`, g.relation || '—')),
  ]

  for (let i = filled; i < totalGroup; i++) {
    rows.push(kvRow(`${i + 1}.`, '(completar)', true))
  }

  return [sectionTitle('Información de invitados'), kvTable(rows)]
}

/* ── Contact ─────────────────────────────── */

export function contactSection(): Block[] {
  return [
    sectionTitle('Datos de contacto'),
    kvTable([
      kvRow('Concierge', '(número de teléfono)', true),
      kvRow('Email concierge', '(correo electrónico)', true),
      kvRow('Oficina RelaxInn', '1-786-655-4014'),
      kvRow('Email oficina', 'info@relaxinnhomes.com'),
      kvRow('Emergencias PuntaCana', '1-809-959-9911 (Ambulancia, Bomberos, Seguridad)'),
    ]),
  ]
}

/* ── Flights ─────────────────────────────── */

export function flightsSection(data: FormData): Block[] {
  const blocks: Block[] = [
    sectionTitle('Vuelos'),
    new Paragraph({
      spacing: { before: 0, after: 160 },
      children: [
        bodyText(
          'Aquí tienes la información de vuelo registrada. Por favor revisa y avísanos si necesitas alguna corrección.',
          { color: BRAND.muted, size: 19 },
        ),
      ],
    }),
  ]

  const arrivals = data.arrivalFlights.filter((f) => f.code)
  if (arrivals.length) {
    blocks.push(subHeading('Vuelos de llegada'))
    arrivals.forEach((f, i) => {
      blocks.push(
        kvTable([
          kvRow(`Vuelo ${i + 1}`, `${f.airline} ${f.code}`),
          kvRow('Fecha / Hora', `${f.date ? formatDate(f.date) : '—'} · ${f.time || '—'}`),
          kvRow('Origen', f.origin || '—'),
        ]),
        spacer(80),
      )
    })
  } else {
    blocks.push(
      new Paragraph({
        spacing: { before: 0, after: 80 },
        children: [placeholder('(No se proporcionaron vuelos de llegada — completar)')],
      }),
    )
  }

  const departures = data.departureFlights.filter((f) => f.code)
  if (departures.length) {
    blocks.push(subHeading('Vuelos de salida'))
    departures.forEach((f, i) => {
      blocks.push(
        kvTable([
          kvRow(`Vuelo ${i + 1}`, `${f.airline} ${f.code}`),
          kvRow('Fecha / Hora', `${f.date ? formatDate(f.date) : '—'} · ${f.time || '—'}`),
          kvRow('Destino', f.destination || '—'),
        ]),
        spacer(80),
      )
    })
  } else {
    blocks.push(
      new Paragraph({
        spacing: { before: 0, after: 80 },
        children: [placeholder('(No se proporcionaron vuelos de salida — completar)')],
      }),
    )
  }

  return blocks
}

/* ── Itinerary header + arrival ───────────── */

export function arrivalSection(data: FormData): Block[] {
  return [
    new Paragraph({ children: [new PageBreak()] }),
    sectionTitle('Itinerario'),
    new Paragraph({
      spacing: { before: 80, after: 200 },
      alignment: AlignmentType.CENTER,
      children: [
        new TextRun({
          text:
            data.checkIn && data.checkOut
              ? `${formatDate(data.checkIn)} — ${formatDate(data.checkOut)}`
              : '(Fechas por confirmar)',
          font: FONT.display,
          size: 24,
          color: BRAND.deep,
          italics: true,
        }),
      ],
    }),
    subHeading('Detalles de la llegada'),
    new Paragraph({
      spacing: { before: 80, after: 80 },
      children: [
        new TextRun({
          text: '¡Bienvenido a Punta Cana!',
          font: FONT.display,
          size: 26,
          color: BRAND.accent,
          italics: true,
        }),
      ],
    }),
    new Paragraph({
      spacing: { before: 80, after: 120 },
      children: [
        bodyText(
          'A su llegada, por favor diríjase a la salida de la terminal donde le esperará su conductor de transfer. El conductor llevará un cartel con su nombre.',
        ),
      ],
    }),
    kvTable([kvRow('Check-in', '3:00 PM'), kvRow('Check-out', '11:00 AM')]),
  ]
}

/* ── Transfer ────────────────────────────── */

export function transferSection(data: FormData): Block[] {
  const blocks: Block[] = [sectionTitle('Transporte')]

  if (data.needsTransfer === true) {
    const rows = [
      kvRow('Recogida', 'Aeropuerto Internacional de Punta Cana (PUJ)'),
      kvRow('Entrega', '(nombre de la propiedad)', true),
      kvRow('Fecha y hora', '(confirmar con vuelo de llegada)', true),
      kvRow(
        'Pasajeros',
        `${data.adults + data.children} (${data.adults} adultos${data.children > 0 ? `, ${data.children} niños` : ''})`,
      ),
      kvRow('Maletas', String(data.bags || '—')),
      ...(data.transferNotes ? [kvRow('Notas especiales', data.transferNotes)] : []),
    ]
    blocks.push(subHeading('Servicios de transfer confirmados'), kvTable(rows))
  } else if (data.needsTransfer === false) {
    blocks.push(
      new Paragraph({
        spacing: { before: 80, after: 80 },
        children: [
          bodyText('El huésped ha indicado que cuenta con transporte propio.', {
            italics: true,
            color: BRAND.muted,
          }),
        ],
      }),
    )
  } else {
    blocks.push(
      new Paragraph({
        spacing: { before: 80, after: 80 },
        children: [placeholder('(Transporte no especificado — confirmar con el huésped)')],
      }),
    )
  }

  return blocks
}

/* ── Activities ──────────────────────────── */

export function activitiesSection(data: FormData, days: string[]): Block[] {
  const hasActs = days.some((d) => (data.dayActivities[d] || []).length > 0)
  if (!hasActs) return []

  const blocks: Block[] = [subHeading('Actividades')]

  days.forEach((dayKey, di) => {
    const acts = data.dayActivities[dayKey] || []
    if (!acts.length) return

    blocks.push(dayLabel(`Día ${di + 1} — ${formatDateShort(dayKey)}`))

    const rows = acts.map((a) => {
      const cat = ALL_ACTIVITIES.find((c) => c.id === a.id)
      if (!cat) return kvRow('—', '—')
      const price =
        cat.priceType === 'fixed'
          ? `$${(cat.price || 0) * a.participants} USD (${a.participants} pax × $${cat.price})`
          : 'Cotizar con concierge'
      return kvRow(cat.name, `${a.participants} pax · ${a.preferredTime || 'sin hora'} · ${price}`)
    })

    blocks.push(kvTable(rows))
  })

  return blocks
}

/* ── Equipment ───────────────────────────── */

export function equipmentSection(data: FormData, totalDays: number): Block[] {
  if (!data.equipment.length) return []

  const blocks: Block[] = [
    subHeading('Equipamiento'),
    new Paragraph({
      spacing: { before: 0, after: 100 },
      children: [
        bodyText('Entrega y recogida en la villa incluidas.', { color: BRAND.muted, size: 19 }),
      ],
    }),
  ]

  const rows = data.equipment.map((eq) => {
    const cat = EQUIPMENT.find((e) => e.id === eq.id)
    if (!cat) return kvRow('—', '—')
    return kvRow(
      `${cat.name} ×${eq.quantity}`,
      `$${cat.pricePerNight ?? 0} / día · ~$${(cat.pricePerNight ?? 0) * eq.quantity * totalDays} total`,
    )
  })

  blocks.push(
    kvTable(rows),
    spacer(80),
    kvTable([
      kvRow('Entrega', '(fecha y hora de entrega)', true),
      kvRow('Recogida', '(fecha y hora de recogida)', true),
    ]),
  )

  return blocks
}

/* ── Meals & grocery ─────────────────────── */

export function mealsSection(data: FormData, days: string[]): Block[] {
  const hasMeals = days.some((d) => {
    const m = data.dayMeals[d]
    return m && Object.values(m).some((v) => v.trim())
  })

  if (!data.wantGrocery && !hasMeals) return []

  const blocks: Block[] = [
    new Paragraph({ children: [new PageBreak()] }),
    sectionTitle('Comidas y servicio de compras'),
    new Paragraph({
      spacing: { before: 80, after: 160 },
      shading: { fill: BRAND.sand, type: ShadingType.CLEAR },
      children: [
        bodyText(
          'Los ingredientes necesarios para la preparación de las comidas no están incluidos en el servicio. Se cobran por separado durante la estancia.',
          { size: 19, color: BRAND.warm },
        ),
      ],
    }),
  ]

  if (data.wantGrocery) {
    blocks.push(
      subHeading('Servicio de compras'),
      new Paragraph({
        spacing: { before: 0, after: 100 },
        children: [bodyText('El huésped ha solicitado servicio de compras.', { bold: true })],
      }),
    )

    if (data.groceryNotes) {
      blocks.push(
        new Paragraph({
          spacing: { before: 80, after: 80 },
          children: [
            bodyText('Notas: ', { bold: true, size: 19, color: BRAND.muted }),
            bodyText(data.groceryNotes, { size: 19 }),
          ],
        }),
      )
    }

    blocks.push(spacer(80))

    const notes = [
      'La mayoría de los alimentos se comprarán exclusivamente en Supermercados Nacional.',
      'Todos los artículos están sujetos a disponibilidad y algunos pueden ser estacionales.',
      'Si un artículo no está en stock, el proveedor no volverá a buscarlo. Incluye sustitutos.',
      'Una vez entregadas las compras en la villa, el servicio se considera completo.',
    ]
    blocks.push(
      new Paragraph({
        spacing: { before: 0, after: 60 },
        children: [bodyText('Notas importantes:', { bold: true, size: 19, color: BRAND.muted })],
      }),
    )
    notes.forEach((n) => {
      blocks.push(
        new Paragraph({
          spacing: { before: 20, after: 20 },
          indent: { left: 360 },
          children: [bodyText(`— ${n}`, { size: 18, color: BRAND.muted })],
        }),
      )
    })
  }

  if (hasMeals) {
    blocks.push(subHeading('Preferencias de comida por día'))
    days.forEach((dayKey, di) => {
      const meals = data.dayMeals[dayKey]
      if (!meals || !Object.values(meals).some((v) => v.trim())) return

      blocks.push(dayLabel(`Día ${di + 1} — ${formatDateShort(dayKey)}`))

      const rows: TableRow[] = []
      for (const meal of MEAL_TIMES) {
        const val = meals[meal]
        if (val?.trim()) rows.push(kvRow(meal, val))
      }
      if (rows.length) blocks.push(kvTable(rows))
    })
  }

  return blocks
}

/* ── Allergies & special notes ───────────── */

export function allergiesSection(data: FormData): Block[] {
  const blocks: Block[] = []

  if (data.allergies) {
    blocks.push(spacer(200), subHeading('Alergias'))
    blocks.push(
      new Paragraph({
        spacing: { before: 80, after: 80 },
        shading: { fill: 'FDECEA', type: ShadingType.CLEAR },
        children: [
          new TextRun({
            text: 'IMPORTANTE: ',
            font: FONT.body,
            size: 20,
            color: BRAND.red,
            bold: true,
          }),
          bodyText(data.allergies, { color: BRAND.red }),
        ],
      }),
    )
  }

  if (data.specialNotes) {
    blocks.push(subHeading('Instrucciones especiales'))
    blocks.push(
      new Paragraph({
        spacing: { before: 80, after: 80 },
        children: [bodyText(data.specialNotes)],
      }),
    )
  }

  return blocks
}

/* ── Cancellation ────────────────────────── */

export function cancellationSection(): Block[] {
  const texts = [
    'Para confirmar tu reserva, se requiere el pago completo del importe total del servicio en un plazo de 48 horas desde la aceptación del servicio solicitado.',
    'Las cancelaciones realizadas más de 7 días antes de la fecha de llegada serán reembolsadas, menos una tasa de cancelación del 20% basada en el importe total del servicio.',
    'Las cancelaciones realizadas dentro de los 7 días siguientes a la fecha de llegada no son reembolsables.',
    'Todas las cancelaciones y solicitudes de cambios deben enviarse por escrito a RelaxInn Vacation Homes.',
    'No realizar pagos dentro de las fechas de vencimiento especificadas puede resultar en la cancelación de la reserva sin reembolso.',
  ]

  return [
    new Paragraph({ children: [new PageBreak()] }),
    sectionTitle('Política de cancelación'),
    ...texts.map(
      (t) =>
        new Paragraph({
          spacing: { before: 40, after: 40 },
          children: [bodyText(t, { size: 19, color: BRAND.muted })],
        }),
    ),
  ]
}

/* ── Closing ─────────────────────────────── */

export function closingSection(): Block[] {
  return [
    spacer(300),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 0, after: 80 },
      children: [
        new TextRun({
          text: 'Gracias por elegir RelaxInn Vacation Homes',
          font: FONT.display,
          size: 28,
          color: BRAND.accent,
          italics: true,
        }),
      ],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 0, after: 60 },
      children: [
        bodyText(
          'Que tengas un viaje maravilloso. No dudes en contactarnos para cualquier ayuda antes, durante o después de tu viaje.',
          { size: 19, color: BRAND.muted },
        ),
      ],
    }),
    spacer(100),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 0, after: 20 },
      children: [
        new ExternalHyperlink({
          children: [
            new TextRun({
              text: 'www.relaxinnhomes.com',
              style: 'Hyperlink',
              font: FONT.body,
              size: 19,
            }),
          ],
          link: 'http://www.relaxinnhomes.com',
        }),
      ],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 0, after: 20 },
      children: [
        bodyText('info@relaxinnhomes.com · 1-786-655-4014', { size: 19, color: BRAND.muted }),
      ],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [bodyText('Punta Cana, República Dominicana', { size: 19, color: BRAND.hint })],
    }),
  ]
}
