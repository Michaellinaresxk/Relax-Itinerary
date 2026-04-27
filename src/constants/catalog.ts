import type { StepMeta, ActivityCatalogItem, EquipmentCatalogItem } from '@/types'

/* ═══════════════════════════════════════════════════════════════
   STEPS — no icons, clean labels
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
  { id: 'meals', title: 'Comidas', sub: 'Preferencias culinarias y compras', group: 'Estancia' },
  { id: 'review', title: 'Resumen', sub: 'Revisa y envía tu itinerario', group: 'Envío' },
]

/* ═══════════════════════════════════════════════════════════════
   ACTIVITIES — photo-driven cards grouped by category
   Replace image URLs with your own photography for production
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
    label: 'Acuáticas',
    image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&q=80',
    items: [
      {
        id: 'catamaran',
        name: 'Paseo en Catamarán',
        image: 'https://images.unsplash.com/photo-1540946485063-a40da27545f8?w=600&q=80',
        price: 150,
        unit: 'persona',
        priceType: 'fixed',
      },
      {
        id: 'snorkel',
        name: 'Snorkeling',
        image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=600&q=80',
        price: 85,
        unit: 'persona',
        priceType: 'fixed',
      },
      {
        id: 'diving',
        name: 'Buceo',
        image: 'https://images.unsplash.com/photo-1682687220742-aba13b6e50ba?w=600&q=80',
        price: 120,
        unit: 'persona',
        priceType: 'fixed',
      },
      {
        id: 'fishing',
        name: 'Pesca Deportiva',
        image: 'https://images.unsplash.com/photo-1545816250-e12bedba42ba?w=600&q=80',
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
        id: 'saona',
        name: 'Excursión Isla Saona',
        image: 'https://images.unsplash.com/photo-1559128010-7c1ad6e1b6a5?w=600&q=80',
        price: 130,
        unit: 'persona',
        priceType: 'fixed',
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
        price: 75,
        unit: 'persona',
        priceType: 'fixed',
      },
      {
        id: 'zipline',
        name: 'Tirolesa / Canopy',
        image: 'https://images.unsplash.com/photo-1502126324834-38f8e02d7160?w=600&q=80',
        price: 95,
        unit: 'persona',
        priceType: 'fixed',
      },
      {
        id: 'buggy',
        name: 'Tour en Buggy',
        image: 'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=600&q=80',
        price: 110,
        unit: 'persona',
        priceType: 'fixed',
      },
      {
        id: 'golf',
        name: 'Golf 18 hoyos',
        image: 'https://images.unsplash.com/photo-1535131749006-b7f58c99034b?w=600&q=80',
        price: 250,
        unit: 'persona',
        priceType: 'fixed',
      },
      {
        id: 'cultural',
        name: 'Tour Cultural Santo Domingo',
        image: 'https://images.unsplash.com/photo-1580237072617-771c3ecc4a24?w=600&q=80',
        price: null,
        unit: 'grupo',
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
        id: 'spa',
        name: 'Día de Spa',
        image: 'https://images.unsplash.com/photo-1600334129128-685c5582fd35?w=600&q=80',
        price: null,
        unit: 'persona',
        priceType: 'quote',
      },
      {
        id: 'massage',
        name: 'Masaje en la Villa',
        image: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=600&q=80',
        price: 100,
        unit: 'persona',
        priceType: 'fixed',
      },
      {
        id: 'chef',
        name: 'Chef Privado',
        image: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=600&q=80',
        price: null,
        unit: 'evento',
        priceType: 'quote',
      },
      {
        id: 'pool_party',
        name: 'Pool Party + DJ',
        image: 'https://images.unsplash.com/photo-1504196606672-aef5c9cefc92?w=600&q=80',
        price: null,
        unit: 'evento',
        priceType: 'quote',
      },
    ],
  },
]

export const ALL_ACTIVITIES: ActivityCatalogItem[] = ACTIVITY_CATEGORIES.flatMap((c) => c.items)

/* ═══════════════════════════════════════════════════════════════
   EQUIPMENT — photo thumbnails
   ═══════════════════════════════════════════════════════════════ */
export const EQUIPMENT: EquipmentCatalogItem[] = [
  {
    id: 'golf_cart_6',
    name: 'Golf Cart 6 plazas',
    image: 'https://images.unsplash.com/photo-1591370874773-6702e8f12fd8?w=400&q=80',
    perDay: 110,
  },
  {
    id: 'golf_cart_4',
    name: 'Golf Cart 4 plazas',
    image: 'https://images.unsplash.com/photo-1591370874773-6702e8f12fd8?w=400&q=80',
    perDay: 80,
  },
  {
    id: 'bikes',
    name: 'Bicicletas',
    image: 'https://images.unsplash.com/photo-1471506480208-91b3a4cc78be?w=400&q=80',
    perDay: 40,
  },
]

/* ═══════════════════════════════════════════════════════════════
   MEALS
   ═══════════════════════════════════════════════════════════════ */
export const MEAL_TIMES = ['Desayuno', 'Comida', 'Cena', 'Aperitivos'] as const
