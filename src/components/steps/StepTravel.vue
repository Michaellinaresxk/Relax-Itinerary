<script setup lang="ts">
import FlightCard from '@/components/ui/FlightCard.vue'
import FormField from '@/components/ui/FormField.vue'
import OptionCard from '@/components/ui/OptionCard.vue'
import Accordion from '@/components/ui/Accordion.vue'
import { useFormData } from '@/composables/useFormData'
import { TRANSFER_VEHICLES, CASH_RATE_NOTE } from '@/constants/catalog'
import type { Flight } from '@/types'
import { computed } from 'vue'

const { state, addFlight, removeFlight, updateFlight, updateField } = useFormData()

function onUpdateArr(i: number, f: keyof Flight, v: string) { updateFlight('arrival', i, f, v) }
function onUpdateDep(i: number, f: keyof Flight, v: string) { updateFlight('departure', i, f, v) }

const arrCount = computed(() => state.arrivalFlights.filter(f => f.code).length)
const depCount = computed(() => state.departureFlights.filter(f => f.code).length)

const selectedVehicle = computed(() =>
  TRANSFER_VEHICLES.find(v => v.id === state.transferVehicleId),
)
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

      <div class="vehicle-list">
        <div v-for="v in TRANSFER_VEHICLES" :key="v.id" class="vehicle"
          :class="{ 'vehicle--selected': state.transferVehicleId === v.id }"
          @click="updateField('transferVehicleId', v.id)">
          <div class="vehicle__info">
            <span class="vehicle__name">{{ v.name }}</span>
            <span class="vehicle__cap">{{ v.capacity }}</span>
          </div>
          <span class="vehicle__price">${{ v.priceUsd }}</span>
        </div>
      </div>

      <p class="cash-note">{{ CASH_RATE_NOTE }}</p>

      <div class="grid-2">
        <FormField label="Cantidad de maletas">
          <input class="inp inp--center" type="number" min="0" :value="state.bags"
            @input="updateField('bags', Math.max(0, parseInt(($event.target as HTMLInputElement).value) || 0))" />
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
