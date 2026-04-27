<script setup lang="ts">
import FormField from './FormField.vue'
import type { Flight } from '@/types'

const props = defineProps<{
  flight: Flight
  index: number
  type: 'arrival' | 'departure'
  canRemove: boolean
}>()

const emit = defineEmits<{
  update: [field: keyof Flight, value: string]
  remove: []
}>()

const directionLabel = props.type === 'arrival' ? 'Origen' : 'Destino'
const directionField = props.type === 'arrival' ? 'origin' : 'destination'
const directionPlaceholder = props.type === 'arrival' ? 'Miami (MIA)' : 'New York (JFK)'
</script>

<template>
  <div class="flight">
    <div class="flight__top">
      <span class="flight__label">Vuelo {{ index + 1 }}</span>
      <button v-if="canRemove" class="flight__remove" @click="emit('remove')">
        Eliminar
      </button>
    </div>

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
      <FormField :label="directionLabel">
        <input class="inp" :value="(flight as any)[directionField]" :placeholder="directionPlaceholder"
          @input="emit('update', directionField as keyof Flight, ($event.target as HTMLInputElement).value)" />
      </FormField>
    </div>
  </div>
</template>

<style scoped>
.flight {
  background: var(--c-bg);
  border-radius: var(--radius-md);
  padding: 20px;
  margin-bottom: 12px;
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

@media (max-width: 480px) {
  .flight {
    padding: 16px;
  }
}
</style>
