import { reactive } from 'vue'
import type { FormData, Flight, Guest, SelectedActivity } from '@/types'

const emptyFlight = (): Flight => ({
  airline: '',
  code: '',
  date: '',
  time: '',
  origin: '',
  destination: '',
})

const initial = (): FormData => ({
  mainGuest: '',
  email: '',
  phone: '',
  adults: 2,
  children: 0,
  childAges: [],
  guests: [],
  checkIn: '',
  checkOut: '',
  arrivalFlights: [emptyFlight()],
  departureFlights: [emptyFlight()],
  needsTransfer: null,
  transferVehicleId: '',
  bags: 0,
  transferNotes: '',
  dayActivities: {},
  equipment: [],
  chefTier: null,
  dayMeals: {},
  wantGrocery: null,
  groceryNotes: '',
  allergies: '',
  specialNotes: '',
})

const state = reactive<FormData>(initial())

export function useFormData() {
  function updateField<K extends keyof FormData>(key: K, value: FormData[K]) {
    state[key] = value
  }

  /* ── Children ──────────────────────────── */
  function setChildren(count: number) {
    const n = Math.max(0, count)
    state.children = n
    state.childAges = Array.from({ length: n }, (_, i) => state.childAges[i] || '')
  }
  function updateChildAge(i: number, v: string) {
    state.childAges[i] = v
  }

  /* ── Guests ────────────────────────────── */
  function addGuest() {
    state.guests.push({ name: '', relation: '' })
  }
  function removeGuest(i: number) {
    state.guests.splice(i, 1)
  }
  function updateGuest(i: number, f: keyof Guest, v: string) {
    state.guests[i][f] = v
  }

  /* ── Flights ───────────────────────────── */
  function addFlight(type: 'arrival' | 'departure') {
    const k = type === 'arrival' ? 'arrivalFlights' : 'departureFlights'
    state[k].push(emptyFlight())
  }
  function removeFlight(type: 'arrival' | 'departure', i: number) {
    const k = type === 'arrival' ? 'arrivalFlights' : 'departureFlights'
    if (state[k].length > 1) state[k].splice(i, 1)
  }
  function updateFlight(type: 'arrival' | 'departure', i: number, f: keyof Flight, v: string) {
    const k = type === 'arrival' ? 'arrivalFlights' : 'departureFlights'
    state[k][i][f] = v
  }

  /* ── Activities ────────────────────────── */
  function toggleActivity(dayKey: string, actId: string) {
    if (!state.dayActivities[dayKey]) state.dayActivities[dayKey] = []
    const list = state.dayActivities[dayKey]
    const idx = list.findIndex((a) => a.id === actId)
    if (idx >= 0) list.splice(idx, 1)
    else list.push({ id: actId, participants: state.adults, preferredTime: '', notes: '' })
  }
  function updateActivity(
    dayKey: string,
    actId: string,
    field: keyof SelectedActivity,
    value: string | number,
  ) {
    const act = state.dayActivities[dayKey]?.find((a) => a.id === actId)
    if (act) (act as any)[field] = value
  }

  /* ── Equipment ─────────────────────────── */
  function toggleEquipment(id: string) {
    const idx = state.equipment.findIndex((e) => e.id === id)
    if (idx >= 0) state.equipment.splice(idx, 1)
    else state.equipment.push({ id, quantity: 1 })
  }
  function updateEquipmentQty(id: string, qty: number) {
    const item = state.equipment.find((e) => e.id === id)
    if (item) item.quantity = Math.max(1, qty)
  }

  /* ── Meals ─────────────────────────────── */
  function updateMeal(dayKey: string, meal: string, value: string) {
    if (!state.dayMeals[dayKey]) state.dayMeals[dayKey] = {}
    state.dayMeals[dayKey][meal] = value
  }

  function resetForm() {
    Object.assign(state, initial())
  }

  return {
    state,
    updateField,
    setChildren,
    updateChildAge,
    addGuest,
    removeGuest,
    updateGuest,
    addFlight,
    removeFlight,
    updateFlight,
    toggleActivity,
    updateActivity,
    toggleEquipment,
    updateEquipmentQty,
    updateMeal,
    resetForm,
  }
}
