/* ── Identity Document Types ─────────────── */

export type IdType = 'passport' | 'cedula' | 'license' | ''

export const ID_TYPE_LABELS: Record<Exclude<IdType, ''>, string> = {
  passport: 'Pasaporte',
  cedula: 'Cédula',
  license: 'Licencia',
}

/* ── Trip Motive ─────────────────────────── */

export type TripMotive =
  | 'celebration'
  | 'relax'
  | 'adventure'
  | 'anniversary'
  | 'birthday'
  | 'honeymoon'
  | 'family'
  | 'corporate'
  | 'other'
  | ''

export const TRIP_MOTIVE_OPTIONS: { id: TripMotive; label: string; icon: string }[] = [
  { id: 'relax', label: 'Relax', icon: '🌴' },
  { id: 'celebration', label: 'Celebración', icon: '🎉' },
  { id: 'anniversary', label: 'Aniversario', icon: '💍' },
  { id: 'birthday', label: 'Cumpleaños', icon: '🎂' },
  { id: 'honeymoon', label: 'Luna de Miel', icon: '🥂' },
  { id: 'adventure', label: 'Aventura', icon: '🏄' },
  { id: 'family', label: 'Vacaciones Familiares', icon: '👨‍👩‍👧‍👦' },
  { id: 'corporate', label: 'Corporativo', icon: '💼' },
  { id: 'other', label: 'Otro', icon: '✨' },
]

/* ── Guest ────────────────────────────────── */

export interface Guest {
  name: string
  relation: string
  idType: IdType
  idNumber: string
  /** Stored filename of the uploaded ID photo */
  idPhotoName: string
}

/* ── Flight ───────────────────────────────── */

export interface Flight {
  airline: string
  code: string
  date: string
  time: string
  origin: string
  destination: string
}

/* ── Activities ──────────────────────────── */

export interface SelectedActivity {
  id: string
  participants: number
  preferredTime: string
  notes: string
}

export interface SelectedEquipment {
  id: string
  quantity: number
}

export interface DayMeals {
  [mealTime: string]: string
}

/* ── Transfer ────────────────────────────── */

export interface TransferVehicle {
  id: string
  name: string
  capacity: string
  maxPassengers: number
  priceUsd: number
}

/* ── Chef ────────────────────────────────── */

export type ChefTier = 'regular' | 'experienced' | null

/* ── Form state ──────────────────────────── */

export interface FormData {
  /* Step 1 — Info */
  mainGuest: string
  email: string
  phone: string
  mainGuestIdType: IdType
  mainGuestIdNumber: string
  mainGuestIdPhotoName: string

  adults: number
  children: number
  childAges: string[]
  guests: Guest[]
  checkIn: string
  checkOut: string

  tripMotive: TripMotive
  tripMotiveDetail: string

  /* Step 2 — Travel */
  arrivalFlights: Flight[]
  departureFlights: Flight[]
  needsTransfer: boolean | null
  transferVehicleId: string
  passengers: number
  transferNotes: string

  /* Step 3 — Activities & Equipment */
  dayActivities: Record<string, SelectedActivity[]>
  equipment: SelectedEquipment[]

  /* Step 4 — Meals */
  chefTier: ChefTier
  wantGrocery: boolean | null
  groceryNotes: string
  dayMeals: Record<string, DayMeals>
  allergies: string

  /* General */
  specialNotes: string
}

/* ── Catalog types ───────────────────────── */

export type ActivityScheduleType = 'flexible' | 'fixed'

export interface ActivityCatalogItem {
  id: string
  name: string
  image: string
  price: number | null
  unit: string
  priceType: 'fixed' | 'quote'
  scheduleType: ActivityScheduleType
  fixedSchedule?: string
}

export interface EquipmentCatalogItem {
  id: string
  name: string
  image: string
  pricePerNight: number | null
  priceType: 'fixed' | 'quote'
  note?: string
}

export interface ChefOption {
  id: ChefTier
  name: string
  pricePerDay: number
  description: string
}

export interface StepMeta {
  id: string
  title: string
  sub: string
  group: string
}

export type StepId = 'info' | 'travel' | 'activities' | 'meals' | 'review'
