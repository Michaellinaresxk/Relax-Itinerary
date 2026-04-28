<script setup lang="ts">
import FormField from '@/components/ui/FormField.vue'
import OptionCard from '@/components/ui/OptionCard.vue'
import { useFormData } from '@/composables/useFormData'
import { useDays } from '@/composables/useDays'
import { MEAL_TIMES, CHEF_OPTIONS, CHEF_NOTE, CASH_RATE_NOTE } from '@/constants/catalog'
import { formatDateShort, toISOKey } from '@/utils/dates'
import type { ChefTier } from '@/types'
import { ref, computed } from 'vue'

const { state, updateField, updateMeal } = useFormData()
const { days, numDays, hasDays } = useDays()

const activeDayIdx = ref(0)
const activeDay = computed(() => days.value[activeDayIdx.value])
const activeDayKey = computed(() => activeDay.value ? toISOKey(activeDay.value) : '')

function getMealVal(meal: string): string {
  return state.dayMeals[activeDayKey.value]?.[meal] || ''
}

function filledMealsForDay(dayKey: string): number {
  const m = state.dayMeals[dayKey]
  if (!m) return 0
  return Object.values(m).filter(v => v.trim()).length
}

function selectChef(tier: ChefTier) {
  updateField('chefTier', state.chefTier === tier ? null : tier)
}

const selectedChef = computed(() =>
  CHEF_OPTIONS.find(c => c.id === state.chefTier),
)

const chefTotal = computed(() => {
  if (!selectedChef.value) return 0
  return selectedChef.value.pricePerDay * numDays.value
})
</script>

<template>
  <div>
    <p v-if="!hasDays" class="empty-msg">
      Primero ingresa las fechas en el paso 1.
    </p>

    <template v-else>
      <!-- Chef service -->
      <div class="section-label">Servicio de cocina</div>
      <p class="hint">Selecciona el tipo de servicio. Puedes omitir si no necesitas chef.</p>

      <div class="chef-grid">
        <div v-for="opt in CHEF_OPTIONS" :key="opt.id!" class="chef-card"
          :class="{ 'chef-card--selected': state.chefTier === opt.id }" @click="selectChef(opt.id)">
          <div class="chef-card__top">
            <span class="chef-card__name">{{ opt.name }}</span>
            <span class="chef-card__price">${{ opt.pricePerDay }} / día</span>
          </div>
          <p class="chef-card__desc">{{ opt.description }}</p>
          <div v-if="state.chefTier === opt.id" class="chef-card__total">
            ~${{ opt.pricePerDay * numDays }} total ({{ numDays }} días)
          </div>
        </div>
      </div>

      <p class="chef-note">{{ CHEF_NOTE }}</p>
      <p class="cash-note">{{ CASH_RATE_NOTE }}</p>

      <div class="divider" />

      <!-- Grocery -->
      <div class="section-label">Servicio de compras</div>
      <div class="opt-grid">
        <OptionCard icon="" title="Sí, por favor" description="Nos encargamos de todo"
          :active="state.wantGrocery === true" @select="updateField('wantGrocery', true)" />
        <OptionCard icon="" title="No, gracias" description="Compro por mi cuenta" :active="state.wantGrocery === false"
          @select="updateField('wantGrocery', false)" />
      </div>

      <div v-if="state.wantGrocery" style="margin-bottom: 24px">
        <div class="warn">
          Tarifa de envío: US$60 por viaje, además del costo total de la compra.
          Se te proporcionará una lista para completar al menos 3 días antes de tu llegada.
        </div>
        <FormField label="Notas para la compra" hint="Marcas preferidas, cantidades, sustitutos aceptables">
          <textarea class="inp" style="min-height:56px" :value="state.groceryNotes"
            placeholder="Ej: Agua Cristal x24, leche de almendras, frutas frescas variadas..."
            @input="updateField('groceryNotes', ($event.target as HTMLTextAreaElement).value)" />
        </FormField>
      </div>

      <div class="divider" />

      <!-- Meal preferences -->
      <div class="section-label">Preferencias por día</div>

      <div class="day-pills">
        <button v-for="(day, i) in days" :key="toISOKey(day)" class="pill"
          :class="{ 'pill--active': i === activeDayIdx }" @click="activeDayIdx = i">
          <span>Día {{ i + 1 }}</span>
          <span v-if="filledMealsForDay(toISOKey(day))" class="pill__badge">
            {{ filledMealsForDay(toISOKey(day)) }}
          </span>
        </button>
      </div>

      <p class="day-date">{{ formatDateShort(activeDay) }}</p>

      <div class="meal-grid">
        <div v-for="meal in MEAL_TIMES" :key="meal" class="meal-card">
          <label class="meal-label">{{ meal }}</label>
          <textarea class="meal-input" :value="getMealVal(meal)"
            :placeholder="`Preferencias para ${meal.toLowerCase()}...`"
            @input="updateMeal(activeDayKey, meal, ($event.target as HTMLTextAreaElement).value)" />
        </div>
      </div>

      <!-- Allergies in this step since it's food-related -->
      <div class="divider" />
      <div class="section-label">Alergias</div>
      <FormField label="Alergias o restricciones alimentarias"
        hint="De cualquier invitado — esto es importante para su seguridad.">
        <textarea class="inp" style="min-height:56px" :value="state.allergies"
          placeholder="Ej: Konstance es alérgica a los frutos secos."
          @input="updateField('allergies', ($event.target as HTMLTextAreaElement).value)" />
      </FormField>
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

.hint {
  font-size: 12px;
  color: var(--c-hint);
  margin-bottom: 14px;
  font-weight: 300;
  line-height: 1.5;
}

.empty-msg {
  text-align: center;
  color: var(--c-soft);
  padding: 40px 20px;
  font-weight: 300;
}

/* Chef cards */
.chef-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  margin-bottom: 12px;
}

.chef-card {
  padding: 18px;
  border: 1px solid var(--c-border);
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: all var(--duration) var(--ease);
}

.chef-card:hover {
  border-color: var(--c-border-hover);
}

.chef-card--selected {
  border-color: var(--c-accent-soft);
  background: var(--c-accent-whisper);
}

.chef-card__top {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  margin-bottom: 8px;
}

.chef-card__name {
  font-family: var(--font-display);
  font-size: 16px;
  font-weight: 400;
  color: var(--c-deep);
}

.chef-card__price {
  font-size: 13px;
  font-weight: 400;
  color: var(--c-deep);
}

.chef-card__desc {
  font-size: 11px;
  color: var(--c-soft);
  font-weight: 300;
  line-height: 1.5;
}

.chef-card__total {
  margin-top: 10px;
  padding-top: 8px;
  border-top: 1px solid var(--c-border);
  font-size: 12px;
  color: var(--c-accent);
  font-weight: 400;
}

.chef-note {
  font-size: 11px;
  color: var(--c-warm);
  font-weight: 300;
  line-height: 1.5;
  margin-bottom: 4px;
}

.cash-note {
  font-size: 11px;
  color: var(--c-hint);
  font-weight: 300;
  font-style: italic;
}

/* Grocery */
.opt-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
  margin-bottom: 20px;
}

.warn {
  padding: 14px 18px;
  border-radius: var(--radius-md);
  background: var(--c-warm-bg);
  border: 1px solid var(--c-warm-border);
  font-size: 12px;
  color: var(--c-warm-text);
  font-weight: 300;
  margin-bottom: 16px;
  line-height: 1.5;
}

/* Day pills */
.day-pills {
  display: flex;
  gap: 6px;
  margin-bottom: 10px;
  overflow-x: auto;
  padding-bottom: 4px;
  -webkit-overflow-scrolling: touch;
}

.pill {
  padding: 7px 16px;
  border: 1px solid var(--c-border);
  border-radius: var(--radius-pill);
  background: transparent;
  font: 400 11px/1 var(--font-body);
  cursor: pointer;
  white-space: nowrap;
  display: flex;
  align-items: center;
  gap: 6px;
  transition: all var(--duration) var(--ease);
  color: var(--c-soft);
  letter-spacing: 0.3px;
}

.pill:hover {
  border-color: var(--c-border-hover);
}

.pill--active {
  background: var(--c-deep);
  color: var(--c-white);
  border-color: var(--c-deep);
}

.pill__badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 16px;
  height: 16px;
  border-radius: 50%;
  background: var(--c-accent-soft);
  color: var(--c-white);
  font-size: 9px;
}

.day-date {
  font-size: 12px;
  color: var(--c-hint);
  margin-bottom: 16px;
  text-transform: capitalize;
  font-weight: 300;
}

/* Meal cards */
.meal-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

.meal-card {
  padding: 14px;
  border: 1px solid var(--c-border);
  border-radius: var(--radius-md);
  transition: border-color var(--duration) var(--ease);
}

.meal-card:focus-within {
  border-color: var(--c-border-active);
}

.meal-label {
  font-family: var(--font-display);
  font-size: 15px;
  font-weight: 400;
  color: var(--c-deep);
  display: block;
  margin-bottom: 6px;
}

.meal-input {
  width: 100%;
  padding: 6px 0;
  border: none;
  border-bottom: 1px solid var(--c-border);
  font-family: var(--font-body);
  font-size: 12px;
  font-weight: 300;
  background: transparent;
  color: var(--c-text);
  outline: none;
  resize: vertical;
  min-height: 36px;
  line-height: 1.5;
  transition: border-color var(--duration);
}

.meal-input:focus {
  border-bottom-color: var(--c-accent-soft);
}

.meal-input::placeholder {
  color: var(--c-hint);
}

@media (max-width: 480px) {

  .opt-grid,
  .meal-grid,
  .chef-grid {
    grid-template-columns: 1fr;
  }
}
</style>
