<script setup lang="ts">
import FlightCard from '@/components/ui/FlightCard.vue'
import FormField from '@/components/ui/FormField.vue'
import OptionCard from '@/components/ui/OptionCard.vue'
import Accordion from '@/components/ui/Accordion.vue'
import { useFormData } from '@/composables/useFormData'
import { TRANSFER_VEHICLES, CASH_RATE_NOTE } from '@/constants/catalog'
import type { Flight } from '@/types'
import { computed, watch } from 'vue'

const { state, addFlight, removeFlight, updateFlight, updateField } = useFormData()

function onUpdateArr(i: number, f: keyof Flight, v: string) { updateFlight('arrival', i, f, v) }
function onUpdateDep(i: number, f: keyof Flight, v: string) { updateFlight('departure', i, f, v) }

const arrCount = computed(() => state.arrivalFlights.filter(f => f.code).length)
const depCount = computed(() => state.departureFlights.filter(f => f.code).length)

const totalGroupSize = computed(() => state.adults + state.children)

// Auto-set passengers from group size when transfer is first enabled
watch(() => state.needsTransfer, (val) => {
  if (val === true && state.passengers === 0) {
    state.passengers = totalGroupSize.value
  }
})

const selectedVehicle = computed(() =>
  TRANSFER_VEHICLES.find(v => v.id === state.transferVehicleId),
)

/** Smart suggestion when selected vehicle can't fit all passengers */
const vehicleWarning = computed<string | null>(() => {
  if (!selectedVehicle.value || state.passengers <= 0) return null

  const pax = state.passengers
  const max = selectedVehicle.value.maxPassengers

  if (pax <= max) return null

  // Find the cheapest vehicle that fits
  const fits = TRANSFER_VEHICLES
    .filter(v => v.maxPassengers >= pax)
    .sort((a, b) => a.priceUsd - b.priceUsd)

  if (fits.length > 0) {
    const rec = fits[0]!
    return `El ${selectedVehicle.value.name} tiene capacidad para ${max} personas, pero tu grupo es de ${pax}. Te recomendamos: ${rec.name} (${rec.capacity}) — $${rec.priceUsd} / trayecto.`
  }

  // No single vehicle fits — suggest 2 vehicles
  const best = TRANSFER_VEHICLES
    .filter(v => v.maxPassengers >= Math.ceil(pax / 2))
    .sort((a, b) => a.priceUsd - b.priceUsd)

  if (best.length > 0) {
    const rec = best[0]!
    return `Tu grupo de ${pax} personas no cabe en un solo ${selectedVehicle.value.name} (máx. ${max}). Considera 2× ${rec.name} — $${rec.priceUsd * 2} total / trayecto.`
  }

  return `Tu grupo de ${pax} personas excede la capacidad del ${selectedVehicle.value.name} (máx. ${max}). Contacta a tu concierge para opciones.`
})
</script>

<template>
  <div>
    <Accordion title="Vuelos de llegada" :badge="arrCount || undefined" default-open>
      <FlightCard v-for="(flight, i) in state.arrivalFlights" :key="i" :flight="flight" :index="i" type="arrival"
        :can-remove="state.arrivalFlights.length > 1" @update="(f, v) => onUpdateArr(i, f, v)"
        @remove="removeFlight('arrival', i)" />
      <button class="btn-add" @click="addFlight('arrival')">+ Agregar otro vuelo</button>
    </Accordion>

    <Accordion title="Vuelos de salida" :badge="depCount || undefined">
      <FlightCard v-for="(flight, i) in state.departureFlights" :key="i" :flight="flight" :index="i" type="departure"
        :can-remove="state.departureFlights.length > 1" @update="(f, v) => onUpdateDep(i, f, v)"
        @remove="removeFlight('departure', i)" />
      <button class="btn-add" @click="addFlight('departure')">+ Agregar otro vuelo</button>
    </Accordion>

    <div class="divider" />

    <div class="section-label">Transporte aeropuerto — villa</div>

    <div class="opt-grid">
      <OptionCard icon="" title="Transfer privado" description="Recogida en PUJ" :active="state.needsTransfer === true"
        @select="updateField('needsTransfer', true)" />
      <OptionCard icon="" title="Llego por mi cuenta" description="Transporte propio"
        :active="state.needsTransfer === false" @select="updateField('needsTransfer', false)" />
    </div>

    <template v-if="state.needsTransfer">
      <p class="hint">Selecciona el tipo de vehículo. Tarifas por trayecto.</p>

      <div class="passenger-info">
        <span class="passenger-info__label">Grupo total</span>
        <span class="passenger-info__count">{{ totalGroupSize }} personas</span>
        <span class="passenger-info__detail">
          ({{ state.adults }} adultos{{ state.children > 0 ? `, ${state.children} niños` : '' }})
        </span>
      </div>

      <div class="vehicle-list">
        <div v-for="v in TRANSFER_VEHICLES" :key="v.id" class="vehicle" :class="{
          'vehicle--selected': state.transferVehicleId === v.id,
          'vehicle--over': state.passengers > v.maxPassengers,
        }" @click="updateField('transferVehicleId', v.id)">
          <div class="vehicle__info">
            <span class="vehicle__name">{{ v.name }}</span>
            <span class="vehicle__cap">{{ v.capacity }}</span>
          </div>
          <span class="vehicle__price">${{ v.priceUsd }}</span>
        </div>
      </div>

      <!-- Smart vehicle suggestion -->
      <div v-if="vehicleWarning" class="vehicle-warn">
        <svg class="vehicle-warn__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
          <line x1="12" y1="9" x2="12" y2="13" />
          <line x1="12" y1="17" x2="12.01" y2="17" />
        </svg>
        <p>{{ vehicleWarning }}</p>
      </div>

      <p class="cash-note">{{ CASH_RATE_NOTE }}</p>

      <div class="grid-2">
        <FormField label="Pasajeros" hint="Cantidad total de personas que viajan">
          <input class="inp inp--center" type="number" min="1" :value="state.passengers"
            @input="updateField('passengers', Math.max(1, parseInt(($event.target as HTMLInputElement).value) || 1))" />
        </FormField>
        <FormField label="Solicitudes especiales" hint="Car seat, silla de ruedas, etc.">
          <input class="inp" :value="state.transferNotes" placeholder="Ej: car seat para bebé de 2 años"
            @input="updateField('transferNotes', ($event.target as HTMLInputElement).value)" />
        </FormField>
      </div>
    </template>
  </div>
</template>

<style scoped>
.section-label {
  font-size: 10px;
  font-weight: 400;
  color: var(--c-accent-soft);
  letter-spacing: 2px;
  text-transform: uppercase;
  margin: 0 0 14px;
  padding-bottom: 8px;
  border-bottom: 1px solid var(--c-border);
}

.divider {
  height: 1px;
  background: var(--c-border);
  margin: 24px 0;
}

.opt-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
  margin-bottom: 20px;
}

.hint {
  font-size: 12px;
  color: var(--c-hint);
  font-weight: 300;
  margin-bottom: 12px;
}

/* ── Vehicle list ────────────────────────── */
.vehicle-list {
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-bottom: 12px;
}

.vehicle {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  border: 1px solid var(--c-border);
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: all var(--duration) var(--ease);
}

.vehicle:hover {
  border-color: var(--c-border-hover);
}

.vehicle--selected {
  border-color: var(--c-accent-soft);
  background: var(--c-accent-whisper);
}

.vehicle--over:not(.vehicle--selected) {
  opacity: 0.5;
}

.passenger-info {
  display: flex;
  align-items: baseline;
  gap: 8px;
  padding: 12px 16px;
  background: var(--c-bg);
  border-radius: var(--radius-md);
  margin-bottom: 12px;
}

.passenger-info__label {
  font-size: 11px;
  color: var(--c-hint);
  font-weight: 300;
}

.passenger-info__count {
  font-family: var(--font-display);
  font-size: 16px;
  font-weight: 400;
  color: var(--c-deep);
}

.passenger-info__detail {
  font-size: 11px;
  color: var(--c-soft);
  font-weight: 300;
}

.vehicle-warn {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  padding: 14px 16px;
  border-radius: var(--radius-md);
  background: var(--c-warm-bg, #FFF8F0);
  border: 1px solid var(--c-warm-border, #F0D4B4);
  margin: 12px 0;
}

.vehicle-warn__icon {
  width: 18px;
  height: 18px;
  flex-shrink: 0;
  color: var(--c-warm, #D4A574);
  margin-top: 1px;
}

.vehicle-warn p {
  font-size: 12px;
  color: var(--c-warm-text, #8B6914);
  font-weight: 300;
  line-height: 1.5;
}

.vehicle__info {
  display: flex;
  flex-direction: column;
  gap: 1px;
}

.vehicle__name {
  font-size: 13px;
  font-weight: 400;
}

.vehicle__cap {
  font-size: 11px;
  color: var(--c-hint);
  font-weight: 300;
}

.vehicle__price {
  font-family: var(--font-display);
  font-size: 16px;
  font-weight: 400;
  color: var(--c-deep);
}

.cash-note {
  font-size: 11px;
  color: var(--c-hint);
  font-weight: 300;
  font-style: italic;
  margin-bottom: 20px;
}

.btn-add {
  color: var(--c-accent-soft);
  font-weight: 400;
  font-size: 12px;
  cursor: pointer;
  padding: 8px 0;
  letter-spacing: 0.3px;
  transition: color var(--duration);
}

.btn-add:hover {
  color: var(--c-accent);
}

@media (max-width: 480px) {
  .opt-grid {
    grid-template-columns: 1fr;
  }
}
</style>
