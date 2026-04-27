<script setup lang="ts">
import FormField from '@/components/ui/FormField.vue'
import Accordion from '@/components/ui/Accordion.vue'
import { useFormData } from '@/composables/useFormData'
import { computed } from 'vue'

const {
  state, updateField, setChildren, updateChildAge,
  addGuest, removeGuest, updateGuest,
} = useFormData()

const groupLabel = computed(() => {
  const parts = [`${state.adults} adultos`]
  if (state.children > 0) parts.push(`${state.children} niños`)
  return parts.join(', ')
})
</script>

<template>
  <div>
    <div class="section-label">Datos de contacto</div>

    <FormField label="Nombre del huésped principal" required>
      <input class="inp" :value="state.mainGuest" placeholder="Nombre completo"
        @input="updateField('mainGuest', ($event.target as HTMLInputElement).value)" />
    </FormField>

    <div class="grid-2">
      <FormField label="Email" required>
        <input class="inp" type="email" :value="state.email" placeholder="tu@email.com"
          @input="updateField('email', ($event.target as HTMLInputElement).value)" />
      </FormField>
      <FormField label="Teléfono / WhatsApp" required>
        <input class="inp" :value="state.phone" placeholder="+1 (555) 000-0000"
          @input="updateField('phone', ($event.target as HTMLInputElement).value)" />
      </FormField>
    </div>

    <div class="section-label">Estancia</div>

    <div class="grid-2">
      <FormField label="Check-in" required>
        <input class="inp" type="date" :value="state.checkIn"
          @input="updateField('checkIn', ($event.target as HTMLInputElement).value)" />
      </FormField>
      <FormField label="Check-out" required>
        <input class="inp" type="date" :value="state.checkOut"
          @input="updateField('checkOut', ($event.target as HTMLInputElement).value)" />
      </FormField>
    </div>

    <div class="grid-2">
      <FormField label="Adultos" required>
        <input class="inp inp--center" type="number" min="1" :value="state.adults"
          @input="updateField('adults', Math.max(1, parseInt(($event.target as HTMLInputElement).value) || 1))" />
      </FormField>
      <FormField label="Niños (0-17)">
        <input class="inp inp--center" type="number" min="0" :value="state.children"
          @input="setChildren(parseInt(($event.target as HTMLInputElement).value) || 0)" />
      </FormField>
    </div>

    <div v-if="state.children > 0" class="ages-box">
      <p class="ages-box__title">Edades de los niños</p>
      <div class="ages-row">
        <div v-for="(age, i) in state.childAges" :key="i" class="age-item">
          <span class="age-label">Niño {{ i + 1 }}</span>
          <input class="inp inp--center age-input" type="number" min="0" max="17" :value="age" placeholder="—"
            @input="updateChildAge(i, ($event.target as HTMLInputElement).value)" />
        </div>
      </div>
    </div>

    <Accordion title="Lista de invitados" :badge="state.guests.filter(g => g.name).length || undefined" default-open>
      <p class="hint">
        Grupo de {{ state.adults + state.children }} ({{ groupLabel }}). Lista a todos aparte del huésped principal.
      </p>
      <div v-for="(g, i) in state.guests" :key="i" class="guest-row">
        <input class="inp" style="flex:2" :value="g.name" :placeholder="`Invitado ${i + 1}`"
          @input="updateGuest(i, 'name', ($event.target as HTMLInputElement).value)" />
        <input class="inp" style="flex:1" :value="g.relation" placeholder="Relación"
          @input="updateGuest(i, 'relation', ($event.target as HTMLInputElement).value)" />
        <button class="btn-rm" @click="removeGuest(i)">Eliminar</button>
      </div>
      <button class="btn-add" @click="addGuest">+ Agregar invitado</button>
    </Accordion>

    <Accordion title="Alergias e instrucciones especiales">
      <FormField label="Alergias o restricciones alimentarias"
        hint="De cualquier invitado — esto es importante para su seguridad.">
        <textarea class="inp" style="min-height:56px" :value="state.allergies"
          placeholder="Ej: Konstance es alérgica a los frutos secos."
          @input="updateField('allergies', ($event.target as HTMLTextAreaElement).value)" />
      </FormField>
      <FormField label="Instrucciones especiales" hint="Cumpleaños, sorpresas, solicitudes especiales">
        <textarea class="inp" style="min-height:56px" :value="state.specialNotes"
          placeholder="Ej: Celebramos el aniversario de María el día 2."
          @input="updateField('specialNotes', ($event.target as HTMLTextAreaElement).value)" />
      </FormField>
    </Accordion>
  </div>
</template>

<style scoped>
.section-label {
  font-size: 10px;
  font-weight: 400;
  color: var(--c-accent-soft);
  letter-spacing: 2px;
  text-transform: uppercase;
  margin: 24px 0 14px;
  padding-bottom: 8px;
  border-bottom: 1px solid var(--c-border);
}

.section-label:first-child {
  margin-top: 0;
}

.ages-box {
  background: var(--c-bg);
  border-radius: var(--radius-md);
  padding: 16px;
  margin-bottom: 18px;
}

.ages-box__title {
  font-size: 11px;
  font-weight: 400;
  color: var(--c-soft);
  margin-bottom: 10px;
}

.ages-row {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.age-item {
  text-align: center;
}

.age-label {
  font-size: 10px;
  color: var(--c-hint);
  display: block;
  margin-bottom: 4px;
  font-weight: 300;
}

.age-input {
  width: 56px;
  padding: 8px 0;
}

.guest-row {
  display: flex;
  gap: 12px;
  margin-bottom: 10px;
  align-items: flex-end;
}

.btn-rm {
  font-size: 11px;
  color: var(--c-red);
  cursor: pointer;
  font-weight: 300;
  padding: 10px 0;
  flex-shrink: 0;
  white-space: nowrap;
  transition: opacity var(--duration);
}

.btn-rm:hover {
  opacity: 0.6;
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

.hint {
  font-size: 12px;
  color: var(--c-hint);
  margin-bottom: 14px;
  font-weight: 300;
  line-height: 1.5;
}

@media (max-width: 480px) {
  .guest-row {
    flex-direction: column;
    gap: 4px;
    padding-bottom: 12px;
    border-bottom: 1px solid var(--c-border);
  }

  .btn-rm {
    align-self: flex-end;
    padding: 4px 0;
  }
}
</style>
