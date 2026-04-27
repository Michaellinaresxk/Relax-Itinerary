export interface Guest {
  name: string
  relation: string
}

export interface Flight {
  airline: string
  code: string
  date: string
  time: string
  origin: string
  destination: string
}

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

export interface FormData {
  mainGuest: string
  email: string
  phone: string
  adults: number
  children: number
  childAges: string[]
  guests: Guest[]
  checkIn: string
  checkOut: string
  arrivalFlights: Flight[]
  departureFlights: Flight[]
  needsTransfer: boolean | null
  bags: number
  transferNotes: string
  dayActivities: Record<string, SelectedActivity[]>
  equipment: SelectedEquipment[]
  dayMeals: Record<string, DayMeals>
  wantGrocery: boolean | null
  groceryNotes: string
  allergies: string
  specialNotes: string
}

export interface ActivityCatalogItem {
  id: string
  name: string
  image: string
  price: number | null
  unit: string
  priceType: 'fixed' | 'quote'
}

export interface EquipmentCatalogItem {
  id: string
  name: string
  image: string
  perDay: number
}

export interface StepMeta {
  id: string
  title: string
  sub: string
  group: string
}

export type StepId = 'info' | 'travel' | 'activities' | 'meals' | 'review'
