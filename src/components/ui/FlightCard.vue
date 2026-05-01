<script setup lang="ts">
import FormField from './FormField.vue'
import type { Flight } from '@/types'
import { TRANSFER_VEHICLES, CASH_RATE_NOTE } from '@/constants/catalog'
import { computed } from 'vue'

const props = defineProps<{
  flight: Flight
  index: number
  type: 'arrival' | 'departure'
  canRemove: boolean
}>()

const emit = defineEmits<{
  update: [field: keyof Flight, value: string | number | boolean | null]
  remove: []
}>()

const selectedVehicle = computed(() =>
  TRANSFER_VEHICLES.find(v => v.id === props.flight.transferVehicleId),
)

const vehicleWarning = computed<string | null>(() => {
  if (!selectedVehicle.value || props.flight.passengers <= 0) return null
  const pax = props.flight.passengers
  const max = selectedVehicle.value.maxPassengers
  if (pax <= max) return null

  const fits = TRANSFER_VEHICLES
    .filter(v => v.maxPassengers >= pax)
    .sort((a, b) => a.priceUsd - b.priceUsd)

  if (fits.length > 0) {
    const rec = fits[0]!
    return `Capacidad insuficiente (máx. ${max}). Recomendamos: ${rec.name} (${rec.capacity}) — $${rec.priceUsd}`
  }

  const best = TRANSFER_VEHICLES
    .filter(v => v.maxPassengers >= Math.ceil(pax / 2))
    .sort((a, b) => a.priceUsd - b.priceUsd)

  if (best.length > 0) {
    const rec = best[0]!
    return `${pax} personas no caben en un solo vehículo. Considera 2× ${rec.name} — $${rec.priceUsd * 2} total.`
  }

  return `${pax} personas exceden la capacidad. Tu concierge te ayudará con opciones.`
})

const typeLabel = props.type === 'arrival' ? 'Llegada' : 'Salida'
</script>

<template>
  <div class="flight" :class="{ 'flight--has-transfer': flight.needsTransfer }">
    <!-- Header -->
    <div class="flight__top">
      <span class="flight__label">{{ typeLabel }} {{ index + 1 }}</span>
      <button v-if="canRemove" class="flight__remove" @click="emit('remove')">
        Eliminar
      </button>
    </div>

    <!-- Flight info -->
    <div class="grid-2">
      <FormField label="Aerolínea">
        <input class="inp" :value="flight.airline" placeholder="JetBlue"
          @input="emit('update', 'airline', ($event.target as HTMLInputElement).value)" />
      </FormField>
      <FormField label="Nº vuelo">
        <input class="inp" :value="flight.code" placeholder="B6 1234"
          @input="emit('update', 'code', ($event.target as HTMLInputElement).value)" />
      </FormField>
    </div>

    <div class="grid-3">
      <FormField label="Fecha">
        <input class="inp" type="date" :value="flight.date"
          @input="emit('update', 'date', ($event.target as HTMLInputElement).value)" />
      </FormField>
      <FormField label="Hora">
        <input class="inp" type="time" :value="flight.time"
          @input="emit('update', 'time', ($event.target as HTMLInputElement).value)" />
      </FormField>
      <FormField label="Pasajeros" hint="En este vuelo">
        <input class="inp inp--center" type="number" min="1" :value="flight.passengers || ''" placeholder="0"
          @input="emit('update', 'passengers', Math.max(0, parseInt(($event.target as HTMLInputElement).value) || 0))" />
      </FormField>
    </div>

    <!-- Destination (departure only) -->
    <div v-if="type === 'departure'">
      <FormField label="Destino">
        <input class="inp" :value="flight.destination" placeholder="New York (JFK)"
          @input="emit('update', 'destination', ($event.target as HTMLInputElement).value)" />
      </FormField>
    </div>

    <!-- Transport section -->
    <div v-if="flight.passengers > 0" class="transport">
      <div class="transport__header">
        <svg class="transport__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <path d="M5 17h14M5 17a2 2 0 01-2-2V7a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2M5 17l-1 3m16-3l1 3" />
          <circle cx="7.5" cy="17" r="1.5" />
          <circle cx="16.5" cy="17" r="1.5" />
        </svg>
        <span class="transport__title">
          Transporte para {{ flight.passengers }}
          {{ flight.passengers === 1 ? 'persona' : 'personas' }}
        </span>
      </div>

      <div class="transport__toggle">
        <button class="t-pill" :class="{ 't-pill--active': flight.needsTransfer === true }"
          @click="emit('update', 'needsTransfer', true)">
          Transfer privado
        </button>
        <button class="t-pill" :class="{ 't-pill--active': flight.needsTransfer === false }"
          @click="emit('update', 'needsTransfer', false)">
          Por su cuenta
        </button>
      </div>

      <template v-if="flight.needsTransfer">
        <div class="vehicle-list">
          <div v-for="v in TRANSFER_VEHICLES" :key="v.id" class="vehicle" :class="{
            'vehicle--selected': flight.transferVehicleId === v.id,
            'vehicle--over': flight.passengers > v.maxPassengers,
          }" @click="emit('update', 'transferVehicleId', v.id)">
            <div class="vehicle__info">
              <span class="vehicle__name">{{ v.name }}</span>
              <span class="vehicle__cap">{{ v.capacity }}</span>
            </div>
            <span class="vehicle__price">${{ v.priceUsd }}</span>
          </div>
        </div>

        <div v-if="vehicleWarning" class="vehicle-warn">
          <svg class="vehicle-warn__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
            <line x1="12" y1="9" x2="12" y2="13" />
            <line x1="12" y1="17" x2="12.01" y2="17" />
          </svg>
          <p>{{ vehicleWarning }}</p>
        </div>

        <FormField label="Notas de transporte" hint="Car seat, silla de ruedas, parada adicional">
          <input class="inp" :value="flight.transferNotes" placeholder="Ej: car seat para bebé de 2 años"
            @input="emit('update', 'transferNotes', ($event.target as HTMLInputElement).value)" />
        </FormField>

        <p class="cash-note">{{ CASH_RATE_NOTE }}</p>
      </template>
    </div>
  </div>
</template>

<style scoped>
.flight {
  background: var(--c-bg);
  border-radius: var(--radius-md);
  padding: 20px;
  margin-bottom: 12px;
  border: 1px solid transparent;
  transition: border-color var(--duration) var(--ease);
}

.flight--has-transfer {
  border-color: var(--c-accent-soft);
}

.flight__top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 14px;
}

.flight__label {
  font-size: 10px;
  font-weight: 400;
  color: var(--c-hint);
  letter-spacing: 1.5px;
  text-transform: uppercase;
}

.flight__remove {
  font-size: 11px;
  color: var(--c-red);
  cursor: pointer;
  font-weight: 300;
  padding: 2px 0;
  transition: opacity var(--duration) var(--ease);
}

.flight__remove:hover {
  opacity: 0.7;
}

/* ── Transport section ───────────────────── */
.transport {
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid var(--c-border);
  animation: fadeIn 0.25s var(--ease);
}

.transport__header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
}

.transport__icon {
  width: 18px;
  height: 18px;
  color: var(--c-accent-soft);
  flex-shrink: 0;
}

.transport__title {
  font-size: 12px;
  font-weight: 400;
  color: var(--c-deep);
  letter-spacing: 0.3px;
}

.transport__toggle {
  display: flex;
  gap: 8px;
  margin-bottom: 14px;
}

.t-pill {
  flex: 1;
  padding: 10px 14px;
  border: 1px solid var(--c-border);
  border-radius: var(--radius-md);
  background: transparent;
  font: 400 12px/1 var(--font-body);
  color: var(--c-soft);
  cursor: pointer;
  transition: all var(--duration) var(--ease);
  text-align: center;
}

.t-pill:hover {
  border-color: var(--c-border-hover);
}

.t-pill--active {
  background: var(--c-deep);
  color: var(--c-white);
  border-color: var(--c-deep);
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
  padding: 10px 14px;
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
  opacity: 0.45;
}

.vehicle__info {
  display: flex;
  flex-direction: column;
  gap: 1px;
}

.vehicle__name {
  font-size: 12px;
  font-weight: 400;
}

.vehicle__cap {
  font-size: 10px;
  color: var(--c-hint);
  font-weight: 300;
}

.vehicle__price {
  font-family: var(--font-display);
  font-size: 14px;
  font-weight: 400;
  color: var(--c-deep);
}

.vehicle-warn {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  padding: 10px 14px;
  border-radius: var(--radius-md);
  background: var(--c-warm-bg, #FFF8F0);
  border: 1px solid var(--c-warm-border, #F0D4B4);
  margin-bottom: 12px;
}

.vehicle-warn__icon {
  width: 16px;
  height: 16px;
  flex-shrink: 0;
  color: var(--c-warm, #D4A574);
  margin-top: 1px;
}

.vehicle-warn p {
  font-size: 11px;
  color: var(--c-warm-text, #8B6914);
  font-weight: 300;
  line-height: 1.4;
}

.cash-note {
  font-size: 10px;
  color: var(--c-hint);
  font-weight: 300;
  font-style: italic;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-4px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (max-width: 480px) {
  .flight {
    padding: 16px;
  }

  .transport__toggle {
    flex-direction: column;
    gap: 6px;
  }
}
</style>
