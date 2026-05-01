import { reactive, computed } from 'vue'
import type { FormData, Flight, Guest, SelectedActivity, IdType } from '@/types'

/* ── File store ──────────────────────────────
   File objects don't play well with Vue's deep reactivity,
   so we store them in a plain Map keyed by a stable identifier.
   Keys: 'main' for main guest, '0', '1', '2'… for guest index.
   ─────────────────────────────────────────── */
const idPhotoFiles = new Map<string, File>()

const emptyFlight = (): Flight => ({
  airline: '',
  code: '',
  date: '',
  time: '',
  passengers: 0,
  destination: '',
  needsTransfer: null,
  transferVehicleId: '',
  transferNotes: '',
})

const emptyGuest = (): Guest => ({
  name: '',
  relation: '',
  idType: '',
  idNumber: '',
  idPhotoName: '',
})

const initial = (): FormData => ({
  mainGuest: '',
  email: '',
  phone: '',
  mainGuestIdType: '',
  mainGuestIdNumber: '',
  mainGuestIdPhotoName: '',

  adults: 2,
  children: 0,
  childAges: [],
  guests: [],
  checkIn: '',
  checkOut: '',

  tripMotive: '',
  tripMotiveDetail: '',

  arrivalFlights: [emptyFlight()],
  departureFlights: [emptyFlight()],
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

/**
 * Derived adults count:
 * main guest (1) + number of guests in the list = total adults.
 * Children are tracked separately.
 */
const adultsCount = computed(() => 1 + state.guests.length)

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
  function syncAdults() {
    state.adults = 1 + state.guests.length // main guest + list
  }

  function addGuest() {
    state.guests.push(emptyGuest())
    syncAdults()
  }

  function removeGuest(i: number) {
    // Clean up file reference
    idPhotoFiles.delete(String(i))
    // Re-key files for guests after the removed index
    for (let j = i + 1; j < state.guests.length; j++) {
      const file = idPhotoFiles.get(String(j))
      if (file) {
        idPhotoFiles.set(String(j - 1), file)
        idPhotoFiles.delete(String(j))
      }
    }
    state.guests.splice(i, 1)
    syncAdults()
  }

  function updateGuest(i: number, f: keyof Guest, v: string) {
    const guest = state.guests[i]
    if (guest) (guest as any)[f] = v
  }

  /* ── ID Photo handling ─────────────────── */

  /**
   * Store a photo file for a guest or the main guest.
   * @param key 'main' | guest index as string ('0', '1', …)
   */
  function setIdPhoto(key: string, file: File | null) {
    if (file) {
      idPhotoFiles.set(key, file)
      if (key === 'main') {
        state.mainGuestIdPhotoName = file.name
      } else {
        const idx = parseInt(key, 10)
        if (state.guests[idx]) state.guests[idx].idPhotoName = file.name
      }
    } else {
      idPhotoFiles.delete(key)
      if (key === 'main') {
        state.mainGuestIdPhotoName = ''
      } else {
        const idx = parseInt(key, 10)
        if (state.guests[idx]) state.guests[idx].idPhotoName = ''
      }
    }
  }

  function getIdPhoto(key: string): File | undefined {
    return idPhotoFiles.get(key)
  }

  function getAllIdPhotos(): Map<string, File> {
    return new Map(idPhotoFiles)
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

  function updateFlight(
    type: 'arrival' | 'departure',
    i: number,
    f: keyof Flight,
    v: string | number | boolean | null,
  ) {
    const k = type === 'arrival' ? 'arrivalFlights' : 'departureFlights'
    const flight = state[k][i]
    if (flight) (flight as any)[f] = v
  }

  /* ── Activities ────────────────────────── */
  function toggleActivity(dayKey: string, actId: string) {
    if (!state.dayActivities[dayKey]) state.dayActivities[dayKey] = []
    const list = state.dayActivities[dayKey]!
    const idx = list.findIndex((a) => a.id === actId)
    if (idx >= 0) list.splice(idx, 1)
    else list.push({ id: actId, participants: adultsCount.value, preferredTime: '', notes: '' })
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
    state.dayMeals[dayKey]![meal] = value
  }

  function resetForm() {
    Object.assign(state, initial())
    idPhotoFiles.clear()
  }

  return {
    state,
    adultsCount,
    updateField,
    setChildren,
    updateChildAge,
    addGuest,
    removeGuest,
    updateGuest,
    setIdPhoto,
    getIdPhoto,
    getAllIdPhotos,
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
