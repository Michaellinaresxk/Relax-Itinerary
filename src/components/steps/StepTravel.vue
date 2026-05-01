<script setup lang="ts">
import FlightCard from '@/components/ui/FlightCard.vue'
import Accordion from '@/components/ui/Accordion.vue'
import { useFormData } from '@/composables/useFormData'
import type { Flight } from '@/types'
import { computed } from 'vue'

const { state, addFlight, removeFlight, updateFlight } = useFormData()

function onUpdate(
  type: 'arrival' | 'departure',
  i: number,
  f: keyof Flight,
  v: string | number | boolean | null,
) {
  updateFlight(type, i, f, v)
}

const arrCount = computed(() => state.arrivalFlights.filter(f => f.code).length)
const depCount = computed(() => state.departureFlights.filter(f => f.code).length)

const arrTransfers = computed(() =>
  state.arrivalFlights.filter(f => f.needsTransfer).length,
)
const depTransfers = computed(() =>
  state.departureFlights.filter(f => f.needsTransfer).length,
)
</script>

<template>
  <div>
    <p class="hint">
      Ingresa la información de cada vuelo y gestiona el transporte aeropuerto–villa
      directamente en cada grupo.
    </p>

    <Accordion title="Vuelos de llegada"
      :badge="arrCount ? `${arrCount} vuelo${arrCount > 1 ? 's' : ''}${arrTransfers ? ` · ${arrTransfers} transfer` : ''}` : undefined"
      default-open>
      <FlightCard v-for="(flight, i) in state.arrivalFlights" :key="i" :flight="flight" :index="i" type="arrival"
        :can-remove="state.arrivalFlights.length > 1" @update="(f, v) => onUpdate('arrival', i, f, v)"
        @remove="removeFlight('arrival', i)" />
      <button class="btn-add" @click="addFlight('arrival')">+ Agregar transporte</button>
    </Accordion>

    <Accordion title="Vuelos de salida"
      :badge="depCount ? `${depCount} vuelo${depCount > 1 ? 's' : ''}${depTransfers ? ` · ${depTransfers} transfer` : ''}` : undefined">
      <FlightCard v-for="(flight, i) in state.departureFlights" :key="i" :flight="flight" :index="i" type="departure"
        :can-remove="state.departureFlights.length > 1" @update="(f, v) => onUpdate('departure', i, f, v)"
        @remove="removeFlight('departure', i)" />
      <button class="btn-add" @click="addFlight('departure')">+ Agregar transporte</button>
    </Accordion>
  </div>
</template>

<style scoped>
.hint {
  font-size: 12px;
  color: var(--c-hint);
  font-weight: 300;
  margin-bottom: 16px;
  line-height: 1.5;
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
</style>
