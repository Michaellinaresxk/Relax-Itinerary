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
  { id: 'van_small', name: 'Van', capacity: '1–6 personas', priceUsd: 40 },
  { id: 'van_medium', name: 'Van', capacity: '7–10 personas', priceUsd: 65 },
  { id: 'van_large', name: 'Van', capacity: '11–16 personas', priceUsd: 75 },
  { id: 'suv', name: 'SUV', capacity: 'Hasta 6 personas', priceUsd: 80 },
  { id: 'sprinter', name: 'Mercedes Sprinter', capacity: 'Hasta 16 personas', priceUsd: 100 },
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
      },
      {
        id: 'yacht',
        name: 'Yate Privado',
        image: 'https://images.unsplash.com/photo-1567899378494-47b22a2ae96a?w=600&q=80',
        price: null,
        unit: 'grupo',
        priceType: 'quote',
      },
      {
        id: 'fishing',
        name: 'Pesca Deportiva',
        image: 'https://images.unsplash.com/photo-1545816250-e12bedba42ba?w=600&q=80',
        price: null,
        unit: 'grupo',
        priceType: 'quote',
      },
    ],
  },
  {
    id: 'adventure',
    label: 'Aventura y Tours',
    image: 'https://images.unsplash.com/photo-1506953823976-52e1fdc0149a?w=800&q=80',
    items: [
      {
        id: 'horseback',
        name: 'Paseo a Caballo',
        image: 'https://images.unsplash.com/photo-1553284965-83fd3e82fa5a?w=600&q=80',
        price: null,
        unit: 'persona',
        priceType: 'quote',
      },
      {
        id: 'excursions',
        name: 'Excursiones de Aventura',
        image: 'https://images.unsplash.com/photo-1502126324834-38f8e02d7160?w=600&q=80',
        price: null,
        unit: 'persona',
        priceType: 'quote',
      },
      {
        id: 'golf_tee',
        name: 'Reserva de Tee Time',
        image: 'https://images.unsplash.com/photo-1535131749006-b7f58c99034b?w=600&q=80',
        price: null,
        unit: 'persona',
        priceType: 'quote',
      },
    ],
  },
  {
    id: 'wellness',
    label: 'Bienestar',
    image: 'https://images.unsplash.com/photo-1600334129128-685c5582fd35?w=800&q=80',
    items: [
      {
        id: 'massage',
        name: 'Masaje Terapéutico',
        image: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=600&q=80',
        price: null,
        unit: 'persona',
        priceType: 'quote',
      },
      {
        id: 'training',
        name: 'Entrenamiento Personal',
        image: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=600&q=80',
        price: null,
        unit: 'sesión',
        priceType: 'quote',
      },
    ],
  },
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
      },
      {
        id: 'live_music',
        name: 'Música en Vivo',
        image: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600&q=80',
        price: null,
        unit: 'evento',
        priceType: 'quote',
      },
      {
        id: 'decoration',
        name: 'Decoraciones Personalizadas',
        image: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=600&q=80',
        price: null,
        unit: 'evento',
        priceType: 'quote',
      },
    ],
  },
  {
    id: 'services',
    label: 'Servicios Adicionales',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80',
    items: [
      {
        id: 'luxury_car',
        name: 'Alquiler de Auto de Lujo',
        image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=600&q=80',
        price: null,
        unit: 'día',
        priceType: 'quote',
      },
      {
        id: 'cleaning',
        name: 'Limpieza Adicional',
        image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=600&q=80',
        price: null,
        unit: 'servicio',
        priceType: 'quote',
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
  {
    id: 'bikes',
    name: 'Bicicletas',
    image: 'https://images.unsplash.com/photo-1471506480208-91b3a4cc78be?w=400&q=80',
    pricePerNight: null,
    priceType: 'quote',
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
