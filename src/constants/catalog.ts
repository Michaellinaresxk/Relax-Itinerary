import type {
  StepMeta,
  ActivityCatalogItem,
  EquipmentCatalogItem,
  TransferVehicle,
  ChefOption,
} from '@/types'

/* ═══════════════════════════════════════════════════════════════
   STEPS
   ═══════════════════════════════════════════════════════════════ */
export const STEPS: StepMeta[] = [
  { id: 'info', title: 'Tu Información', sub: 'Datos del grupo y la estancia', group: 'Datos' },
  { id: 'travel', title: 'Vuelos y Transporte', sub: 'Llegada, salida y transfer', group: 'Viaje' },
  {
    id: 'activities',
    title: 'Experiencias',
    sub: 'Actividades, tours y equipamiento',
    group: 'Estancia',
  },
  {
    id: 'meals',
    title: 'Comidas',
    sub: 'Servicio de chef, compras y preferencias',
    group: 'Estancia',
  },
  { id: 'review', title: 'Resumen', sub: 'Revisa y envía tu itinerario', group: 'Envío' },
]

/* ═══════════════════════════════════════════════════════════════
   TRANSFER VEHICLES
   Cash rates — taxes apply if paying by credit card
   ═══════════════════════════════════════════════════════════════ */
export const TRANSFER_VEHICLES: TransferVehicle[] = [
  { id: 'van_small', name: 'Van', capacity: '1–6 personas', maxPassengers: 6, priceUsd: 40 },
  { id: 'van_medium', name: 'Van', capacity: '7–10 personas', maxPassengers: 10, priceUsd: 65 },
  { id: 'van_large', name: 'Van', capacity: '11–16 personas', maxPassengers: 16, priceUsd: 75 },
  { id: 'suv', name: 'SUV', capacity: 'Hasta 6 personas', maxPassengers: 6, priceUsd: 80 },
  {
    id: 'sprinter',
    name: 'Mercedes Sprinter',
    capacity: 'Hasta 16 personas',
    maxPassengers: 16,
    priceUsd: 100,
  },
]

/* ═══════════════════════════════════════════════════════════════
   ACTIVITIES — grouped by category
   Replace image URLs with your own photography
   ═══════════════════════════════════════════════════════════════ */
export interface ActivityCategory {
  id: string
  label: string
  image: string
  items: ActivityCatalogItem[]
}

export const ACTIVITY_CATEGORIES: ActivityCategory[] = [
  /* ── Acuáticas y Navegación ────────────── */
  {
    id: 'water',
    label: 'Acuáticas y Navegación',
    image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&q=80',
    items: [
      {
        id: 'catamaran',
        name: 'Paseo en Catamarán',
        image: 'https://images.unsplash.com/photo-1540946485063-a40da27545f8?w=600&q=80',
        price: null,
        unit: 'grupo',
        priceType: 'quote',
        scheduleType: 'fixed',
        fixedSchedule: '9:00 AM o 2:00 PM',
      },
      {
        id: 'yacht',
        name: 'Yate Privado',
        image: 'https://images.unsplash.com/photo-1567899378494-47b22a2ae96a?w=600&q=80',
        price: null,
        unit: 'grupo',
        priceType: 'quote',
        scheduleType: 'flexible',
      },
      {
        id: 'fishing',
        name: 'Pesca Deportiva',
        image: 'https://images.unsplash.com/photo-1545816250-e12bedba42ba?w=600&q=80',
        price: null,
        unit: 'grupo',
        priceType: 'quote',
        scheduleType: 'fixed',
        fixedSchedule: '6:00 AM o 1:00 PM',
      },
      {
        id: 'saona_tour',
        name: 'Tour Saona',
        image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&q=80',
        price: null,
        unit: 'persona',
        priceType: 'quote',
        scheduleType: 'fixed',
        fixedSchedule: 'Salida 8:00 AM — día completo',
      },
      {
        id: 'diving',
        name: 'Diving',
        image: 'https://images.unsplash.com/photo-1544551763-77ef2d0cfc6c?w=600&q=80',
        price: null,
        unit: 'persona',
        priceType: 'quote',
        scheduleType: 'flexible',
      },
      {
        id: 'jetski',
        name: 'Jet Ski + Aqua Karts',
        image: 'https://images.unsplash.com/photo-1626954079979-ec0db9a21c72?w=600&q=80',
        price: null,
        unit: 'persona',
        priceType: 'quote',
        scheduleType: 'flexible',
      },
    ],
  },

  /* ── Aventura y Tours ──────────────────── */
  {
    id: 'adventure',
    label: 'Aventura y Tours',
    image: 'https://images.unsplash.com/photo-1506953823976-52e1fdc0149a?w=800&q=80',
    items: [
      {
        id: 'local_city_tour',
        name: 'Local City Tour',
        image: 'https://images.unsplash.com/photo-1569154941061-e231b4725ef1?w=600&q=80',
        price: null,
        unit: 'persona',
        priceType: 'quote',
        scheduleType: 'flexible',
      },
      {
        id: 'atv',
        name: 'ATV',
        image: 'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=600&q=80',
        price: null,
        unit: 'persona',
        priceType: 'quote',
        scheduleType: 'flexible',
      },
      {
        id: 'horseback',
        name: 'Paseo a Caballo',
        image: 'https://images.unsplash.com/photo-1553284965-83fd3e82fa5a?w=600&q=80',
        price: null,
        unit: 'persona',
        priceType: 'quote',
        scheduleType: 'fixed',
        fixedSchedule: '9:00 AM o 3:00 PM',
      },
      {
        id: 'monkey_land',
        name: 'Monkey Land',
        image: 'https://images.unsplash.com/photo-1540573133985-87b6da6d54a9?w=600&q=80',
        price: null,
        unit: 'persona',
        priceType: 'quote',
        scheduleType: 'flexible',
      },
      {
        id: 'santo_domingo_tour',
        name: 'Santo Domingo City Tour',
        image: 'https://images.unsplash.com/photo-1588367608840-5c5a1e2c4cfd?w=600&q=80',
        price: null,
        unit: 'persona',
        priceType: 'quote',
        scheduleType: 'fixed',
        fixedSchedule: 'Salida temprano — día completo',
      },
      {
        id: 'la_hacienda',
        name: 'La Hacienda',
        image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=600&q=80',
        price: null,
        unit: 'persona',
        priceType: 'quote',
        scheduleType: 'flexible',
      },
      {
        id: 'safari',
        name: 'Safari',
        image: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?w=600&q=80',
        price: null,
        unit: 'persona',
        priceType: 'quote',
        scheduleType: 'flexible',
      },
    ],
  },

  /* ── Bienestar ─────────────────────────── */
  {
    id: 'wellness',
    label: 'Bienestar',
    image: 'https://images.unsplash.com/photo-1600334129128-685c5582fd35?w=800&q=80',
    items: [
      {
        id: 'yoga',
        name: 'Yoga',
        image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=600&q=80',
        price: null,
        unit: 'sesión',
        priceType: 'quote',
        scheduleType: 'flexible',
      },
      {
        id: 'massage',
        name: 'Masaje',
        image: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=600&q=80',
        price: null,
        unit: 'persona',
        priceType: 'quote',
        scheduleType: 'flexible',
      },
    ],
  },

  /* ── Entretenimiento ───────────────────── */
  {
    id: 'entertainment',
    label: 'Entretenimiento',
    image: 'https://images.unsplash.com/photo-1504196606672-aef5c9cefc92?w=800&q=80',
    items: [
      {
        id: 'karaoke',
        name: 'Karaoke Privado',
        image: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=600&q=80',
        price: null,
        unit: 'evento',
        priceType: 'quote',
        scheduleType: 'flexible',
      },
      {
        id: 'live_music',
        name: 'Música en Vivo',
        image: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600&q=80',
        price: null,
        unit: 'evento',
        priceType: 'quote',
        scheduleType: 'flexible',
      },
      {
        id: 'dj',
        name: 'DJ',
        image: 'https://images.unsplash.com/photo-1571266028243-e4733b0f0bb0?w=600&q=80',
        price: null,
        unit: 'evento',
        priceType: 'quote',
        scheduleType: 'flexible',
      },
    ],
  },

  /* ── Servicios Adicionales ─────────────── */
  {
    id: 'services',
    label: 'Servicios Adicionales',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80',
    items: [
      {
        id: 'decoration',
        name: 'Decoración Personalizada',
        image: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=600&q=80',
        price: null,
        unit: 'evento',
        priceType: 'quote',
        scheduleType: 'flexible',
      },
      {
        id: 'luxury_car',
        name: 'Alquiler de Vehículo de Lujo',
        image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=600&q=80',
        price: null,
        unit: 'día',
        priceType: 'quote',
        scheduleType: 'flexible',
      },
      {
        id: 'golf_tee',
        name: 'Reserva de Golf',
        image: 'https://images.unsplash.com/photo-1535131749006-b7f58c99034b?w=600&q=80',
        price: null,
        unit: 'persona',
        priceType: 'quote',
        scheduleType: 'fixed',
        fixedSchedule: 'Sujeto a disponibilidad del campo',
      },
      {
        id: 'golf_cart_rental',
        name: 'Golf Cart Rentals',
        image: 'https://images.unsplash.com/photo-1591370874773-6702e8f12fd8?w=600&q=80',
        price: null,
        unit: 'día',
        priceType: 'quote',
        scheduleType: 'flexible',
      },
    ],
  },
]

export const ALL_ACTIVITIES: ActivityCatalogItem[] = ACTIVITY_CATEGORIES.flatMap((c) => c.items)

/* ═══════════════════════════════════════════════════════════════
   EQUIPMENT RENTALS
   Cash rates — taxes apply if paying by credit card
   Delivery: 3:00 PM · Return: 2:00 PM
   Rates per night, subject to availability
   ═══════════════════════════════════════════════════════════════ */
export const EQUIPMENT: EquipmentCatalogItem[] = [
  {
    id: 'golf_cart_4',
    name: 'Golf Cart 4 plazas',
    image: 'https://images.unsplash.com/photo-1591370874773-6702e8f12fd8?w=400&q=80',
    pricePerNight: 65,
    priceType: 'fixed',
    note: 'Tarifa puede variar en reservas de último momento',
  },
  {
    id: 'golf_cart_6',
    name: 'Golf Cart 6 plazas',
    image: 'https://images.unsplash.com/photo-1591370874773-6702e8f12fd8?w=400&q=80',
    pricePerNight: 85,
    priceType: 'fixed',
    note: 'Tarifa puede variar en reservas de último momento',
  },
]

export const EQUIPMENT_SCHEDULE = {
  delivery: '3:00 PM',
  returnTime: '2:00 PM',
} as const

/* ═══════════════════════════════════════════════════════════════
   CHEF / COOK SERVICE
   Cash rates — taxes apply if paying by credit card
   Grocery shopping + $60 delivery fee NOT included
   ═══════════════════════════════════════════════════════════════ */
export const CHEF_OPTIONS: ChefOption[] = [
  {
    id: 'regular',
    name: 'Cocinero Regular',
    pricePerDay: 120,
    description:
      'Cocina casera de buena calidad. No trabaja con menú fijo — acepta sugerencias y solicitudes del huésped. Hasta 10 personas.',
  },
  {
    id: 'experienced',
    name: 'Chef Experimentado',
    pricePerDay: 175,
    description:
      'Formación culinaria profesional. Ofrece menú curado, alta presentación y manejo de dietas especiales. Hasta 10 personas.',
  },
]

export const CHEF_NOTE =
  'El servicio de compras y la tarifa de envío de US$60 no están incluidos y se consideran costos adicionales.'

/* ═══════════════════════════════════════════════════════════════
   MEALS
   ═══════════════════════════════════════════════════════════════ */
export const MEAL_TIMES = ['Desayuno', 'Comida', 'Cena', 'Aperitivos'] as const

/* ═══════════════════════════════════════════════════════════════
   PRICING NOTE — shown in various places
   ═══════════════════════════════════════════════════════════════ */
export const CASH_RATE_NOTE =
  'Tarifas en efectivo — aplican impuestos si paga con tarjeta de crédito.'
