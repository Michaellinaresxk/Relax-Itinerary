<script setup lang="ts">
import FormField from '@/components/ui/FormField.vue'
import Accordion from '@/components/ui/Accordion.vue'
import { useFormData } from '@/composables/useFormData'
import { useValidation } from '@/composables/useValidation'
import { ID_TYPE_LABELS, TRIP_MOTIVE_OPTIONS } from '@/types'
import type { IdType, TripMotive } from '@/types'
import { computed, ref } from 'vue'

const {
  state, updateField, setChildren, updateChildAge,
  addGuest, removeGuest, updateGuest,
  setIdPhoto, adultsCount,
} = useFormData()

const { touch, fieldError } = useValidation()

const idTypes: { value: IdType; label: string }[] = [
  { value: 'passport', label: 'Pasaporte' },
  { value: 'cedula', label: 'Cédula' },
  { value: 'license', label: 'Licencia' },
]

const groupLabel = computed(() => {
  const parts = [`${adultsCount.value} adultos`]
  if (state.children > 0) parts.push(`${state.children} niños`)
  return parts.join(', ')
})

function onUpdate<K extends keyof typeof state>(field: K, value: (typeof state)[K]) {
  touch(field as string)
  updateField(field, value)
}

/* ── File input handling ─────────────────── */
const mainFileInput = ref<HTMLInputElement | null>(null)
const guestFileInputs = ref<Record<number, HTMLInputElement>>({})

function triggerMainUpload() {
  mainFileInput.value?.click()
}

function onMainFileChange(e: Event) {
  const file = (e.target as HTMLInputElement).files?.[0] ?? null
  setIdPhoto('main', file)
}

function triggerGuestUpload(i: number) {
  guestFileInputs.value[i]?.click()
}

function onGuestFileChange(i: number, e: Event) {
  const file = (e.target as HTMLInputElement).files?.[0] ?? null
  setIdPhoto(String(i), file)
}

function setGuestFileRef(i: number, el: any) {
  if (el) guestFileInputs.value[i] = el as HTMLInputElement
}
</script>

<template>
  <div>
    <!-- ── Contact ──────────────────────────── -->
    <div class="section-label">Datos de contacto</div>

    <FormField label="Nombre del huésped principal" required :error="fieldError('mainGuest')">
      <input class="inp" :value="state.mainGuest" placeholder="Nombre completo" @blur="touch('mainGuest')"
        @input="onUpdate('mainGuest', ($event.target as HTMLInputElement).value)" />
    </FormField>

    <div class="grid-2">
      <FormField label="Email" required :error="fieldError('email')">
        <input class="inp" type="email" :value="state.email" placeholder="tu@email.com" @blur="touch('email')"
          @input="onUpdate('email', ($event.target as HTMLInputElement).value)" />
      </FormField>
      <FormField label="Teléfono / WhatsApp" required :error="fieldError('phone')">
        <input class="inp" :value="state.phone" placeholder="+1 (555) 000-0000" @blur="touch('phone')"
          @input="onUpdate('phone', ($event.target as HTMLInputElement).value)" />
      </FormField>
    </div>

    <!-- ── Main guest ID ────────────────────── -->
    <div class="section-label">Identificación del huésped principal</div>
    <p class="hint">
      Necesitamos una copia de tu documento de identidad para verificar la reserva.
    </p>

    <div class="id-section">
      <div class="id-type-pills">
        <button v-for="t in idTypes" :key="t.value" class="id-pill"
          :class="{ 'id-pill--active': state.mainGuestIdType === t.value }"
          @click="updateField('mainGuestIdType', t.value)">
          {{ t.label }}
        </button>
      </div>

      <div v-if="state.mainGuestIdType" class="id-fields">
        <FormField :label="`Número de ${ID_TYPE_LABELS[state.mainGuestIdType]}`">
          <input class="inp" :value="state.mainGuestIdNumber" placeholder="Número del documento"
            @input="updateField('mainGuestIdNumber', ($event.target as HTMLInputElement).value)" />
        </FormField>

        <div class="upload-area" @click="triggerMainUpload">
          <input ref="mainFileInput" type="file" accept="image/*,.pdf" class="upload-input"
            @change="onMainFileChange" />

          <template v-if="state.mainGuestIdPhotoName">
            <div class="upload-area__done">
              <svg class="upload-area__icon upload-area__icon--ok" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                stroke-width="2">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              <span class="upload-area__filename">{{ state.mainGuestIdPhotoName }}</span>
              <button class="upload-area__remove" @click.stop="setIdPhoto('main', null)">
                Cambiar
              </button>
            </div>
          </template>

          <template v-else>
            <svg class="upload-area__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
              <polyline points="17 8 12 3 7 8" />
              <line x1="12" y1="3" x2="12" y2="15" />
            </svg>
            <span class="upload-area__text">Subir foto del documento</span>
            <span class="upload-area__hint">JPG, PNG o PDF</span>
          </template>
        </div>
      </div>
    </div>

    <!-- ── Stay dates ───────────────────────── -->
    <div class="section-label">Estancia</div>

    <div class="grid-2">
      <FormField label="Check-in" required :error="fieldError('checkIn')">
        <input class="inp" type="date" :value="state.checkIn" @blur="touch('checkIn')"
          @input="onUpdate('checkIn', ($event.target as HTMLInputElement).value)" />
      </FormField>
      <FormField label="Check-out" required :error="fieldError('checkOut')">
        <input class="inp" type="date" :value="state.checkOut" :min="state.checkIn || undefined"
          @blur="touch('checkOut')" @input="onUpdate('checkOut', ($event.target as HTMLInputElement).value)" />
      </FormField>
    </div>

    <!-- ── Trip motive ──────────────────────── -->
    <div class="section-label">Motivo del viaje</div>
    <p class="hint">¿Están celebrando algo especial? Esto nos ayuda a personalizar tu experiencia.</p>

    <div class="motive-grid">
      <button v-for="opt in TRIP_MOTIVE_OPTIONS" :key="opt.id" class="motive-card"
        :class="{ 'motive-card--active': state.tripMotive === opt.id }"
        @click="updateField('tripMotive', state.tripMotive === opt.id ? '' : opt.id)">
        <span class="motive-card__icon">{{ opt.icon }}</span>
        <span class="motive-card__label">{{ opt.label }}</span>
      </button>
    </div>

    <div v-if="state.tripMotive === 'other' || state.tripMotive === 'celebration'" style="margin-top: 12px">
      <FormField :label="state.tripMotive === 'other' ? 'Cuéntanos más' : 'Detalles de la celebración'">
        <input class="inp" :value="state.tripMotiveDetail"
          :placeholder="state.tripMotive === 'other' ? 'Ej: Reunión familiar' : 'Ej: Cumpleaños de María, 15 años'"
          @input="updateField('tripMotiveDetail', ($event.target as HTMLInputElement).value)" />
      </FormField>
    </div>

    <!-- ── Group size ───────────────────────── -->
    <div class="section-label">Grupo</div>

    <div class="group-summary">
      <div class="group-summary__item">
        <span class="group-summary__number">{{ adultsCount }}</span>
        <span class="group-summary__label">{{ adultsCount === 1 ? 'Adulto' : 'Adultos' }}</span>
        <span class="group-summary__hint">Huésped principal + invitados</span>
      </div>
      <div class="group-summary__sep" />
      <div class="group-summary__item">
        <div class="children-control">
          <button class="children-control__btn" @click="setChildren(Math.max(0, state.children - 1))">−</button>
          <span class="group-summary__number">{{ state.children }}</span>
          <button class="children-control__btn" @click="setChildren(state.children + 1)">+</button>
        </div>
        <span class="group-summary__label">{{ state.children === 1 ? 'Niño' : 'Niños' }}</span>
      </div>
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

    <!-- ── Guest list ───────────────────────── -->
    <Accordion title="Lista de invitados" :badge="state.guests.filter(g => g.name).length || undefined" default-open>
      <p class="hint">
        Total del grupo: {{ adultsCount + state.children }}
        ({{ groupLabel }}).
        Agrega a cada invitado adulto aparte del huésped principal.
      </p>

      <div v-for="(g, i) in state.guests" :key="i" class="guest-card">
        <div class="guest-card__header">
          <span class="guest-card__num">Invitado {{ i + 1 }}</span>
          <button class="btn-rm" @click="removeGuest(i)">Eliminar</button>
        </div>

        <div class="grid-2">
          <FormField label="Nombre completo">
            <input class="inp" :value="g.name" :placeholder="`Nombre del invitado ${i + 1}`"
              @input="updateGuest(i, 'name', ($event.target as HTMLInputElement).value)" />
          </FormField>
          <FormField label="Relación">
            <input class="inp" :value="g.relation" placeholder="Ej: Esposo, amiga, primo"
              @input="updateGuest(i, 'relation', ($event.target as HTMLInputElement).value)" />
          </FormField>
        </div>

        <!-- Guest ID -->
        <div class="guest-id">
          <div class="id-type-pills id-type-pills--sm">
            <button v-for="t in idTypes" :key="t.value" class="id-pill id-pill--sm"
              :class="{ 'id-pill--active': g.idType === t.value }" @click="updateGuest(i, 'idType', t.value)">
              {{ t.label }}
            </button>
          </div>

          <template v-if="g.idType">
            <FormField :label="`Nº ${ID_TYPE_LABELS[g.idType as keyof typeof ID_TYPE_LABELS]}`">
              <input class="inp" :value="g.idNumber" placeholder="Número del documento"
                @input="updateGuest(i, 'idNumber', ($event.target as HTMLInputElement).value)" />
            </FormField>

            <div class="upload-area upload-area--compact" @click="triggerGuestUpload(i)">
              <input :ref="(el) => setGuestFileRef(i, el)" type="file" accept="image/*,.pdf" class="upload-input"
                @change="(e) => onGuestFileChange(i, e)" />

              <template v-if="g.idPhotoName">
                <div class="upload-area__done">
                  <svg class="upload-area__icon upload-area__icon--ok" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" stroke-width="2">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  <span class="upload-area__filename">{{ g.idPhotoName }}</span>
                  <button class="upload-area__remove" @click.stop="setIdPhoto(String(i), null)">
                    Cambiar
                  </button>
                </div>
              </template>

              <template v-else>
                <svg class="upload-area__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                  <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
                  <polyline points="17 8 12 3 7 8" />
                  <line x1="12" y1="3" x2="12" y2="15" />
                </svg>
                <span class="upload-area__text">Subir foto del documento</span>
              </template>
            </div>
          </template>
        </div>
      </div>

      <button class="btn-add" @click="addGuest">+ Agregar invitado</button>
    </Accordion>

    <!-- ── Special notes ────────────────────── -->
    <Accordion title="Instrucciones especiales">
      <FormField label="Notas especiales" hint="Cumpleaños, sorpresas, solicitudes especiales">
        <textarea class="inp" style="min-height:56px" :value="state.specialNotes"
          placeholder="Ej: Celebramos el aniversario de María el día 2."
          @input="onUpdate('specialNotes', ($event.target as HTMLTextAreaElement).value)" />
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

.hint {
  font-size: 12px;
  color: var(--c-hint);
  margin-bottom: 14px;
  font-weight: 300;
  line-height: 1.5;
}

/* ── ID type pills ───────────────────────── */
.id-section {
  margin-bottom: 18px;
}

.id-type-pills {
  display: flex;
  gap: 8px;
  margin-bottom: 14px;
}

.id-type-pills--sm {
  margin-bottom: 10px;
}

.id-pill {
  padding: 9px 20px;
  border: 1px solid var(--c-border);
  border-radius: var(--radius-pill);
  background: transparent;
  font: 400 12px/1 var(--font-body);
  color: var(--c-soft);
  cursor: pointer;
  transition: all var(--duration) var(--ease);
  letter-spacing: 0.3px;
}

.id-pill--sm {
  padding: 6px 14px;
  font-size: 11px;
}

.id-pill:hover {
  border-color: var(--c-border-hover);
}

.id-pill--active {
  background: var(--c-deep);
  color: var(--c-white);
  border-color: var(--c-deep);
}

.id-fields {
  animation: fadeIn 0.25s var(--ease);
}

/* ── Upload area ─────────────────────────── */
.upload-area {
  border: 1.5px dashed var(--c-border);
  border-radius: var(--radius-md);
  padding: 24px;
  text-align: center;
  cursor: pointer;
  transition: all var(--duration) var(--ease);
  margin-bottom: 4px;
}

.upload-area--compact {
  padding: 14px;
}

.upload-area:hover {
  border-color: var(--c-accent-soft);
  background: var(--c-accent-whisper);
}

.upload-input {
  display: none;
}

.upload-area__icon {
  width: 28px;
  height: 28px;
  color: var(--c-hint);
  margin: 0 auto 8px;
  display: block;
}

.upload-area__icon--ok {
  width: 18px;
  height: 18px;
  color: var(--c-accent);
  margin: 0;
  display: inline;
}

.upload-area__text {
  display: block;
  font-size: 12px;
  color: var(--c-soft);
  font-weight: 400;
}

.upload-area__hint {
  display: block;
  font-size: 10px;
  color: var(--c-hint);
  font-weight: 300;
  margin-top: 2px;
}

.upload-area__done {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.upload-area__filename {
  font-size: 12px;
  color: var(--c-deep);
  font-weight: 400;
  max-width: 200px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.upload-area__remove {
  font-size: 11px;
  color: var(--c-accent-soft);
  cursor: pointer;
  font-weight: 400;
  padding: 2px 8px;
  border-radius: var(--radius-sm);
  transition: opacity var(--duration);
}

.upload-area__remove:hover {
  opacity: 0.7;
}

/* ── Trip motive grid ────────────────────── */
.motive-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
}

.motive-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  padding: 14px 8px;
  border: 1px solid var(--c-border);
  border-radius: var(--radius-md);
  background: transparent;
  cursor: pointer;
  transition: all var(--duration) var(--ease);
}

.motive-card:hover {
  border-color: var(--c-border-hover);
}

.motive-card--active {
  border-color: var(--c-accent-soft);
  background: var(--c-accent-whisper);
}

.motive-card__icon {
  font-size: 22px;
  line-height: 1;
}

.motive-card__label {
  font-size: 11px;
  font-weight: 400;
  color: var(--c-deep);
  text-align: center;
  line-height: 1.2;
}

/* ── Group summary ───────────────────────── */
.group-summary {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 28px;
  padding: 20px;
  background: var(--c-bg);
  border-radius: var(--radius-md);
  margin-bottom: 18px;
}

.group-summary__sep {
  width: 1px;
  height: 40px;
  background: var(--c-border);
}

.group-summary__item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
}

.group-summary__number {
  font-family: var(--font-display);
  font-size: 28px;
  font-weight: 300;
  color: var(--c-deep);
  line-height: 1;
}

.group-summary__label {
  font-size: 11px;
  font-weight: 400;
  color: var(--c-soft);
  text-transform: uppercase;
  letter-spacing: 1px;
}

.group-summary__hint {
  font-size: 10px;
  color: var(--c-hint);
  font-weight: 300;
}

.children-control {
  display: flex;
  align-items: center;
  gap: 14px;
}

.children-control__btn {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  border: 1px solid var(--c-border);
  background: transparent;
  color: var(--c-soft);
  font-size: 16px;
  font-weight: 300;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all var(--duration) var(--ease);
}

.children-control__btn:hover {
  border-color: var(--c-accent-soft);
  color: var(--c-accent);
}

/* ── Ages ─────────────────────────────────── */
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

/* ── Guest cards ─────────────────────────── */
.guest-card {
  background: var(--c-bg);
  border-radius: var(--radius-md);
  padding: 18px;
  margin-bottom: 12px;
}

.guest-card__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 14px;
}

.guest-card__num {
  font-size: 10px;
  font-weight: 400;
  color: var(--c-hint);
  letter-spacing: 1.5px;
  text-transform: uppercase;
}

.guest-id {
  padding-top: 12px;
  border-top: 1px solid var(--c-border);
  margin-top: 4px;
}

.btn-rm {
  font-size: 11px;
  color: var(--c-red);
  cursor: pointer;
  font-weight: 300;
  padding: 4px 0;
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
  .motive-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .guest-card {
    padding: 14px;
  }

  .group-summary {
    gap: 20px;
    padding: 16px;
  }
}
</style>
