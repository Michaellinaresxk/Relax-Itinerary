<script setup lang="ts">
import { useFormData } from '@/composables/useFormData'
import { useDays } from '@/composables/useDays'
import {
  ACTIVITY_CATEGORIES, ALL_ACTIVITIES, EQUIPMENT,
  EQUIPMENT_SCHEDULE, CASH_RATE_NOTE,
} from '@/constants/catalog'
import { formatDateLong, toISOKey } from '@/utils/dates'
import { computed, ref } from 'vue'

const { state, adultsCount, toggleActivity, updateActivity, toggleEquipment, updateEquipmentQty } = useFormData()
const { days, numDays, hasDays } = useDays()

/* ═══════════════════════════════════════════════════════════════
   SUB-WIZARD STATE
   Phase flow per day:
     'choose-category' → 'choose-activity' → 'configure' → back to 'choose-category'
   After last day → 'equipment'
   ═══════════════════════════════════════════════════════════════ */
const currentDayIdx = ref(0)
const phase = ref<'choose-category' | 'choose-activity' | 'configure' | 'equipment'>('choose-category')
const selectedCatId = ref('')

const currentDay = computed<Date>(() => days.value[currentDayIdx.value] ?? new Date())
const currentDayKey = computed(() => currentDay.value ? toISOKey(currentDay.value) : '')
const isLastDay = computed(() => currentDayIdx.value === days.value.length - 1)
const isFirstDay = computed(() => currentDayIdx.value === 0)

const selectedCat = computed(() =>
  ACTIVITY_CATEGORIES.find(c => c.id === selectedCatId.value),
)

/** Activities selected for the current day */
const daySelectedActivities = computed(() =>
  state.dayActivities[currentDayKey.value] || [],
)

/** How many activities selected for the current day */
const dayCount = computed(() => daySelectedActivities.value.length)

/** Check if an activity is selected for the current day */
function isActSelected(actId: string): boolean {
  return daySelectedActivities.value.some(a => a.id === actId)
}

function getActDetail(actId: string) {
  return daySelectedActivities.value.find(a => a.id === actId)
}

/** Count for any day (used in the progress dots) */
function countForDay(dayIdx: number): number {
  const key = toISOKey(days.value[dayIdx])
  return (state.dayActivities[key] || []).length
}

/* ── Navigation ─────────────────────────── */

function selectCategory(catId: string) {
  selectedCatId.value = catId
  phase.value = 'choose-activity'
}

function backToCategories() {
  selectedCatId.value = ''
  phase.value = 'choose-category'
}

function selectActivity(actId: string) {
  toggleActivity(currentDayKey.value, actId)

  // If just selected (now exists), go to configure
  if (isActSelected(actId)) {
    phase.value = 'configure'
  }
}

function addMoreActivities() {
  phase.value = 'choose-category'
  selectedCatId.value = ''
}

function nextDay() {
  if (isLastDay.value) {
    phase.value = 'equipment'
  } else {
    currentDayIdx.value++
    phase.value = 'choose-category'
    selectedCatId.value = ''
  }
}

function prevDay() {
  if (phase.value === 'equipment') {
    currentDayIdx.value = days.value.length - 1
    phase.value = 'choose-category'
    return
  }
  if (!isFirstDay.value) {
    currentDayIdx.value--
    phase.value = 'choose-category'
    selectedCatId.value = ''
  }
}

function goToDay(idx: number) {
  currentDayIdx.value = idx
  phase.value = 'choose-category'
  selectedCatId.value = ''
}

function goToEquipment() {
  phase.value = 'equipment'
}

function removeActivity(actId: string) {
  toggleActivity(currentDayKey.value, actId)
}

/* ── Equipment helpers ───────────────────── */
function isEqSelected(id: string) { return state.equipment.some(e => e.id === id) }
function getEqQty(id: string) { return state.equipment.find(e => e.id === id)?.quantity || 1 }

function eqPriceDisplay(eq: typeof EQUIPMENT[number]): string {
  if (eq.priceType === 'quote') return 'Cotizar'
  return `$${eq.pricePerNight} / noche`
}

function eqTotalDisplay(eq: typeof EQUIPMENT[number]): string {
  if (eq.priceType === 'quote' || !eq.pricePerNight) return ''
  const qty = getEqQty(eq.id)
  return ` · ~$${eq.pricePerNight * qty * numDays.value} total`
}

function actCatalog(id: string) {
  return ALL_ACTIVITIES.find(a => a.id === id)
}
</script>

<template>
  <div>
    <p v-if="!hasDays" class="empty-msg">
      Primero ingresa las fechas de check-in y check-out en el paso anterior.
    </p>

    <template v-else>
      <!-- ── Day progress dots ──────────────── -->
      <div class="day-progress">
        <button v-for="(day, i) in days" :key="toISOKey(day)" class="day-dot" :class="{
          'day-dot--active': phase !== 'equipment' && i === currentDayIdx,
          'day-dot--done': countForDay(i) > 0,
          'day-dot--future': i > currentDayIdx && phase !== 'equipment',
        }" @click="goToDay(i)">
          <span class="day-dot__num">{{ i + 1 }}</span>
          <span v-if="countForDay(i) > 0" class="day-dot__badge">{{ countForDay(i) }}</span>
        </button>
        <div class="day-dot__line" />
        <button class="day-dot day-dot--eq" :class="{ 'day-dot--active': phase === 'equipment' }"
          @click="goToEquipment">
          <svg class="day-dot__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <path
              d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.8-3.8a3 3 0 01-4.2 4.2L7.5 19.5a2.1 2.1 0 01-3-3l9.8-9.8a3 3 0 014.2 4.2" />
          </svg>
        </button>
      </div>

      <!-- ═══════════════════════════════════════
           PHASE: CHOOSE CATEGORY
           "¿Qué te gustaría hacer en el Día X?"
           ═══════════════════════════════════════ -->
      <template v-if="phase === 'choose-category'">
        <div class="day-header">
          <span class="day-header__label">Día {{ currentDayIdx + 1 }} de {{ days.length }}</span>
          <h3 class="day-header__title">¿Qué te gustaría hacer?</h3>
          <p class="day-header__date">{{ formatDateLong(currentDay) }}</p>
        </div>

        <!-- Show already selected activities for this day -->
        <div v-if="dayCount > 0" class="selected-summary">
          <p class="selected-summary__title">
            {{ dayCount }} {{ dayCount === 1 ? 'actividad seleccionada' : 'actividades seleccionadas' }}
          </p>
          <div v-for="sa in daySelectedActivities" :key="sa.id" class="selected-chip">
            <span class="selected-chip__name">{{ actCatalog(sa.id)?.name }}</span>
            <span class="selected-chip__meta">
              {{ sa.participants }} pax
              <template v-if="sa.preferredTime"> · {{ sa.preferredTime }}</template>
            </span>
            <button class="selected-chip__rm" @click="removeActivity(sa.id)">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>
        </div>

        <!-- Category cards -->
        <div class="cat-grid">
          <button v-for="cat in ACTIVITY_CATEGORIES" :key="cat.id" class="cat-card" @click="selectCategory(cat.id)">
            <img :src="cat.image" :alt="cat.label" class="cat-card__img" loading="lazy" />
            <div class="cat-card__overlay">
              <span class="cat-card__name">{{ cat.label }}</span>
              <span class="cat-card__count">{{ cat.items.length }} opciones</span>
            </div>
          </button>
        </div>

        <!-- Day navigation -->
        <div class="day-nav">
          <button v-if="!isFirstDay" class="day-nav__btn day-nav__btn--back" @click="prevDay">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" width="16" height="16">
              <polyline points="15 18 9 12 15 6" />
            </svg>
            Día anterior
          </button>
          <span v-else />

          <button class="day-nav__btn day-nav__btn--next" @click="nextDay">
            <template v-if="isLastDay">
              Equipamiento
            </template>
            <template v-else>
              {{ dayCount > 0 ? 'Siguiente día' : 'Omitir este día' }}
            </template>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" width="16" height="16">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
        </div>
      </template>

      <!-- ═══════════════════════════════════════
           PHASE: CHOOSE ACTIVITY within a category
           ═══════════════════════════════════════ -->
      <template v-if="phase === 'choose-activity' && selectedCat">
        <div class="day-header">
          <button class="breadcrumb" @click="backToCategories">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" width="14" height="14">
              <polyline points="15 18 9 12 15 6" />
            </svg>
            Día {{ currentDayIdx + 1 }}
          </button>
          <h3 class="day-header__title">{{ selectedCat.label }}</h3>
          <p class="day-header__date">Selecciona una o varias actividades</p>
        </div>

        <div class="act-list">
          <div v-for="act in selectedCat.items" :key="act.id" class="act-card"
            :class="{ 'act-card--selected': isActSelected(act.id) }" @click="selectActivity(act.id)">
            <img :src="act.image" :alt="act.name" class="act-card__img" loading="lazy" />
            <div class="act-card__body">
              <span class="act-card__name">{{ act.name }}</span>
              <span v-if="act.priceType === 'fixed'" class="act-card__price">
                ${{ act.price }} / {{ act.unit }}
              </span>
              <span v-else class="act-card__price act-card__price--quote">Cotizar</span>
              <span v-if="act.scheduleType === 'fixed'" class="act-card__schedule">
                {{ act.fixedSchedule }}
              </span>
            </div>
            <div class="act-card__check" :class="{ 'act-card__check--on': isActSelected(act.id) }">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
          </div>
        </div>

        <div class="day-nav">
          <button class="day-nav__btn day-nav__btn--back" @click="backToCategories">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" width="16" height="16">
              <polyline points="15 18 9 12 15 6" />
            </svg>
            Volver
          </button>
          <span />
        </div>
      </template>

      <!-- ═══════════════════════════════════════
           PHASE: CONFIGURE selected activities
           participants + time preference
           ═══════════════════════════════════════ -->
      <template v-if="phase === 'configure'">
        <div class="day-header">
          <button class="breadcrumb" @click="backToCategories">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" width="14" height="14">
              <polyline points="15 18 9 12 15 6" />
            </svg>
            Día {{ currentDayIdx + 1 }}
          </button>
          <h3 class="day-header__title">Configura tu experiencia</h3>
          <p class="day-header__date">{{ formatDateLong(currentDay) }}</p>
        </div>

        <div class="config-list">
          <div v-for="sa in daySelectedActivities" :key="sa.id" class="config-card">
            <div class="config-card__header">
              <span class="config-card__name">{{ actCatalog(sa.id)?.name }}</span>
              <button class="config-card__rm" @click="removeActivity(sa.id)">Quitar</button>
            </div>

            <div class="config-card__fields">
              <div class="config-field">
                <label class="config-label">¿Cuántas personas?</label>
                <div class="stepper">
                  <button class="stepper__btn" :disabled="sa.participants <= 1"
                    @click="updateActivity(currentDayKey, sa.id, 'participants', Math.max(1, sa.participants - 1))">−</button>
                  <span class="stepper__value">{{ sa.participants }}</span>
                  <button class="stepper__btn"
                    @click="updateActivity(currentDayKey, sa.id, 'participants', sa.participants + 1)">+</button>
                </div>
              </div>

              <div class="config-field">
                <template v-if="actCatalog(sa.id)?.scheduleType === 'fixed'">
                  <label class="config-label">Horario del proveedor</label>
                  <span class="config-fixed-time">{{ actCatalog(sa.id)?.fixedSchedule }}</span>
                </template>
                <template v-else>
                  <label class="config-label">¿Mañana o tarde?</label>
                  <div class="time-pills">
                    <button class="time-pill" :class="{ 'time-pill--active': sa.preferredTime === 'Mañana' }"
                      @click="updateActivity(currentDayKey, sa.id, 'preferredTime', 'Mañana')">Mañana</button>
                    <button class="time-pill" :class="{ 'time-pill--active': sa.preferredTime === 'Tarde' }"
                      @click="updateActivity(currentDayKey, sa.id, 'preferredTime', 'Tarde')">Tarde</button>
                    <input class="inp inp--sm" type="time" style="width: 100px"
                      :value="!['Mañana', 'Tarde'].includes(sa.preferredTime) ? sa.preferredTime : ''"
                      placeholder="Hora exacta"
                      @input="updateActivity(currentDayKey, sa.id, 'preferredTime', ($event.target as HTMLInputElement).value)" />
                  </div>
                </template>
              </div>
            </div>
          </div>
        </div>

        <button class="btn-add-more" @click="addMoreActivities">
          + Agregar otra actividad para este día
        </button>

        <div class="day-nav">
          <button class="day-nav__btn day-nav__btn--back" @click="backToCategories">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" width="16" height="16">
              <polyline points="15 18 9 12 15 6" />
            </svg>
            Volver
          </button>
          <button class="day-nav__btn day-nav__btn--next" @click="nextDay">
            <template v-if="isLastDay">Equipamiento</template>
            <template v-else>Siguiente día</template>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" width="16" height="16">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
        </div>
      </template>

      <!-- ═══════════════════════════════════════
           PHASE: EQUIPMENT
           ═══════════════════════════════════════ -->
      <template v-if="phase === 'equipment'">
        <div class="day-header">
          <button class="breadcrumb" @click="goToDay(days.length - 1)">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" width="14" height="14">
              <polyline points="15 18 9 12 15 6" />
            </svg>
            Volver a días
          </button>
          <h3 class="day-header__title">Equipamiento</h3>
          <p class="day-header__date">
            Entrega: {{ EQUIPMENT_SCHEDULE.delivery }} · Devolución: {{ EQUIPMENT_SCHEDULE.returnTime }}.
            Tarifas por noche, sujetas a disponibilidad.
          </p>
        </div>

        <div class="eq-list">
          <div v-for="eq in EQUIPMENT" :key="eq.id" class="eq-card"
            :class="{ 'eq-card--selected': isEqSelected(eq.id) }" @click="toggleEquipment(eq.id)">
            <img :src="eq.image" :alt="eq.name" class="eq-card__img" loading="lazy" />
            <div class="eq-card__info">
              <p class="eq-card__name">{{ eq.name }}</p>
              <p class="eq-card__price">{{ eqPriceDisplay(eq) }}{{ isEqSelected(eq.id) ? eqTotalDisplay(eq) : '' }}</p>
              <p v-if="eq.note" class="eq-card__note">{{ eq.note }}</p>
            </div>
            <div class="chk" :class="{ 'chk--on': isEqSelected(eq.id) }">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>

            <div v-if="isEqSelected(eq.id)" class="eq-card__qty" @click.stop>
              <span class="detail-label">Cantidad</span>
              <input class="inp inp--sm inp--center" type="number" min="1" style="width:60px" :value="getEqQty(eq.id)"
                @input="updateEquipmentQty(eq.id, parseInt(($event.target as HTMLInputElement).value) || 1)" />
            </div>
          </div>
        </div>

        <p class="cash-note">{{ CASH_RATE_NOTE }}</p>
      </template>
    </template>
  </div>
</template>

<style scoped>
/* ── Day progress dots ───────────────────── */
.day-progress {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  margin-bottom: 28px;
  position: relative;
  padding: 0 8px;
}

.day-dot {
  position: relative;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: 1.5px solid var(--c-border);
  background: transparent;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all var(--duration) var(--ease);
  z-index: 1;
}

.day-dot:hover {
  border-color: var(--c-accent-soft);
}

.day-dot--active {
  border-color: var(--c-accent);
  background: var(--c-accent);
}

.day-dot--active .day-dot__num {
  color: var(--c-white);
}

.day-dot--done:not(.day-dot--active) {
  border-color: var(--c-accent-soft);
}

.day-dot--future {
  opacity: 0.4;
}

.day-dot__num {
  font-family: var(--font-body);
  font-size: 12px;
  font-weight: 400;
  color: var(--c-soft);
}

.day-dot__badge {
  position: absolute;
  top: -4px;
  right: -4px;
  min-width: 16px;
  height: 16px;
  border-radius: 50%;
  background: var(--c-accent-soft);
  color: var(--c-white);
  font-size: 9px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 4px;
}

.day-dot--eq {
  width: 36px;
  height: 36px;
}

.day-dot__icon {
  width: 16px;
  height: 16px;
  color: var(--c-soft);
}

.day-dot--active .day-dot__icon {
  color: var(--c-white);
}

.day-dot__line {
  position: absolute;
  left: 32px;
  right: 32px;
  top: 50%;
  height: 1px;
  background: var(--c-border);
  z-index: 0;
}

/* ── Day header ──────────────────────────── */
.day-header {
  text-align: center;
  margin-bottom: 24px;
}

.day-header__label {
  font-size: 10px;
  font-weight: 400;
  color: var(--c-hint);
  letter-spacing: 2px;
  text-transform: uppercase;
}

.day-header__title {
  font-family: var(--font-display);
  font-size: 22px;
  font-weight: 300;
  color: var(--c-deep);
  margin: 6px 0 4px;
}

.day-header__date {
  font-size: 12px;
  color: var(--c-hint);
  font-weight: 300;
  text-transform: capitalize;
}

/* ── Breadcrumb ──────────────────────────── */
.breadcrumb {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 11px;
  color: var(--c-accent-soft);
  cursor: pointer;
  font-weight: 400;
  letter-spacing: 0.3px;
  margin-bottom: 8px;
  transition: color var(--duration);
}

.breadcrumb:hover {
  color: var(--c-accent);
}

/* ── Selected summary (chips) ────────────── */
.selected-summary {
  background: var(--c-bg);
  border-radius: var(--radius-md);
  padding: 14px;
  margin-bottom: 20px;
}

.selected-summary__title {
  font-size: 11px;
  color: var(--c-soft);
  font-weight: 400;
  margin-bottom: 8px;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.selected-chip {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 0;
  border-bottom: 1px solid var(--c-border);
}

.selected-chip:last-child {
  border-bottom: none;
}

.selected-chip__name {
  font-size: 13px;
  font-weight: 400;
  color: var(--c-deep);
  flex: 1;
}

.selected-chip__meta {
  font-size: 11px;
  color: var(--c-hint);
  font-weight: 300;
}

.selected-chip__rm {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: var(--c-hint);
  transition: all var(--duration);
  flex-shrink: 0;
}

.selected-chip__rm svg {
  width: 12px;
  height: 12px;
}

.selected-chip__rm:hover {
  color: var(--c-red);
  background: var(--c-border);
}

/* ── Category grid ───────────────────────── */
.cat-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
  margin-bottom: 24px;
}

.cat-card {
  position: relative;
  border-radius: var(--radius-md);
  overflow: hidden;
  cursor: pointer;
  border: 1px solid transparent;
  transition: all var(--duration) var(--ease);
}

.cat-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.cat-card__img {
  width: 100%;
  height: 120px;
  object-fit: cover;
  display: block;
  transition: transform 0.4s var(--ease);
}

.cat-card:hover .cat-card__img {
  transform: scale(1.04);
}

.cat-card__overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 14px 12px 12px;
  background: linear-gradient(transparent, rgba(0, 0, 0, 0.6));
  color: white;
}

.cat-card__name {
  font-family: var(--font-display);
  font-size: 15px;
  font-weight: 400;
  display: block;
  line-height: 1.2;
}

.cat-card__count {
  font-size: 10px;
  font-weight: 300;
  opacity: 0.8;
  margin-top: 2px;
  display: block;
}

/* ── Activity list (within category) ─────── */
.act-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 24px;
}

.act-card {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 12px;
  border: 1px solid var(--c-border);
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: all var(--duration) var(--ease);
}

.act-card:hover {
  border-color: var(--c-border-hover);
}

.act-card--selected {
  background: var(--c-accent-whisper);
  border-color: var(--c-accent-soft);
}

.act-card__img {
  width: 56px;
  height: 56px;
  border-radius: var(--radius-sm);
  object-fit: cover;
  flex-shrink: 0;
}

.act-card__body {
  flex: 1;
  min-width: 0;
}

.act-card__name {
  font-size: 14px;
  font-weight: 400;
  color: var(--c-deep);
  display: block;
}

.act-card__price {
  font-size: 11px;
  color: var(--c-hint);
  font-weight: 300;
  display: block;
  margin-top: 2px;
}

.act-card__price--quote {
  color: var(--c-warm);
  font-style: italic;
}

.act-card__schedule {
  font-size: 10px;
  color: var(--c-accent-soft);
  display: block;
  margin-top: 2px;
}

.act-card__check {
  width: 22px;
  height: 22px;
  border-radius: 50%;
  border: 1.5px solid var(--c-border);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: all 0.2s var(--ease);
  color: transparent;
}

.act-card__check svg {
  width: 12px;
  height: 12px;
}

.act-card__check--on {
  background: var(--c-accent);
  border-color: var(--c-accent);
  color: var(--c-white);
}

/* ── Configuration cards ─────────────────── */
.config-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 16px;
}

.config-card {
  background: var(--c-bg);
  border-radius: var(--radius-md);
  padding: 18px;
}

.config-card__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.config-card__name {
  font-family: var(--font-display);
  font-size: 16px;
  font-weight: 400;
  color: var(--c-deep);
}

.config-card__rm {
  font-size: 11px;
  color: var(--c-red);
  cursor: pointer;
  font-weight: 300;
  transition: opacity var(--duration);
}

.config-card__rm:hover {
  opacity: 0.6;
}

.config-card__fields {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.config-field {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.config-label {
  font-size: 11px;
  color: var(--c-soft);
  font-weight: 400;
  letter-spacing: 0.3px;
}

.config-fixed-time {
  font-size: 13px;
  color: var(--c-warm);
  font-weight: 400;
  font-style: italic;
}

/* ── Stepper ─────────────────────────────── */
.stepper {
  display: flex;
  align-items: center;
  gap: 16px;
}

.stepper__btn {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: 1px solid var(--c-border);
  background: transparent;
  color: var(--c-soft);
  font-size: 18px;
  font-weight: 300;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all var(--duration) var(--ease);
}

.stepper__btn:hover:not(:disabled) {
  border-color: var(--c-accent-soft);
  color: var(--c-accent);
}

.stepper__btn:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

.stepper__value {
  font-family: var(--font-display);
  font-size: 24px;
  font-weight: 300;
  color: var(--c-deep);
  line-height: 1;
  min-width: 24px;
  text-align: center;
}

/* ── Time pills ──────────────────────────── */
.time-pills {
  display: flex;
  gap: 8px;
  align-items: center;
  flex-wrap: wrap;
}

.time-pill {
  padding: 8px 20px;
  border: 1px solid var(--c-border);
  border-radius: var(--radius-pill);
  background: transparent;
  font: 400 12px/1 var(--font-body);
  color: var(--c-soft);
  cursor: pointer;
  transition: all var(--duration) var(--ease);
  letter-spacing: 0.3px;
}

.time-pill:hover {
  border-color: var(--c-border-hover);
}

.time-pill--active {
  background: var(--c-deep);
  color: var(--c-white);
  border-color: var(--c-deep);
}

/* ── Add more button ─────────────────────── */
.btn-add-more {
  width: 100%;
  padding: 12px;
  border: 1.5px dashed var(--c-border);
  border-radius: var(--radius-md);
  background: transparent;
  color: var(--c-accent-soft);
  font: 400 12px/1 var(--font-body);
  cursor: pointer;
  transition: all var(--duration) var(--ease);
  letter-spacing: 0.3px;
  margin-bottom: 20px;
}

.btn-add-more:hover {
  border-color: var(--c-accent-soft);
  background: var(--c-accent-whisper);
}

/* ── Day navigation ──────────────────────── */
.day-nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 20px;
  border-top: 1px solid var(--c-border);
  margin-top: 8px;
}

.day-nav__btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font: 400 12px/1 var(--font-body);
  cursor: pointer;
  transition: all var(--duration) var(--ease);
  padding: 10px 16px;
  border-radius: var(--radius-pill);
  letter-spacing: 0.3px;
}

.day-nav__btn--back {
  color: var(--c-soft);
  border: 1px solid var(--c-border);
}

.day-nav__btn--back:hover {
  border-color: var(--c-border-hover);
  color: var(--c-deep);
}

.day-nav__btn--next {
  background: var(--c-deep);
  color: var(--c-white);
  border: 1px solid var(--c-deep);
}

.day-nav__btn--next:hover {
  opacity: 0.9;
}

/* ── Equipment ───────────────────────────── */
.eq-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.eq-card {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 14px;
  border: 1px solid var(--c-border);
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: all var(--duration) var(--ease);
  flex-wrap: wrap;
}

.eq-card:hover {
  border-color: var(--c-border-hover);
}

.eq-card--selected {
  background: var(--c-accent-whisper);
  border-color: var(--c-accent-soft);
}

.eq-card__img {
  width: 48px;
  height: 48px;
  border-radius: var(--radius-sm);
  object-fit: cover;
  flex-shrink: 0;
}

.eq-card__info {
  flex: 1;
  min-width: 120px;
}

.eq-card__name {
  font-size: 13px;
  font-weight: 400;
}

.eq-card__price {
  font-size: 11px;
  color: var(--c-hint);
  font-weight: 300;
  margin-top: 1px;
}

.eq-card__note {
  font-size: 10px;
  color: var(--c-warm);
  font-weight: 300;
  font-style: italic;
  margin-top: 2px;
}

.chk {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  border: 1.5px solid var(--c-border);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: all 0.2s var(--ease);
  color: transparent;
}

.chk svg {
  width: 11px;
  height: 11px;
}

.chk--on {
  background: var(--c-accent);
  border-color: var(--c-accent);
  color: var(--c-white);
}

.eq-card__qty {
  width: 100%;
  padding-top: 10px;
  border-top: 1px solid var(--c-border);
  display: flex;
  align-items: center;
  gap: 8px;
}

.detail-label {
  font-size: 10px;
  color: var(--c-hint);
  display: block;
  margin-bottom: 4px;
  font-weight: 300;
  letter-spacing: 0.3px;
}

.cash-note {
  font-size: 11px;
  color: var(--c-hint);
  font-weight: 300;
  font-style: italic;
  margin-top: 12px;
}

.empty-msg {
  text-align: center;
  color: var(--c-soft);
  padding: 40px 20px;
  font-weight: 300;
}

/* ── Responsive ──────────────────────────── */
@media (max-width: 480px) {
  .cat-grid {
    grid-template-columns: 1fr;
  }

  .cat-card__img {
    height: 140px;
  }

  .day-progress {
    gap: 8px;
  }

  .day-dot {
    width: 30px;
    height: 30px;
  }

  .day-dot__num {
    font-size: 11px;
  }
}

@media (min-width: 768px) {
  .cat-grid {
    grid-template-columns: 1fr 1fr 1fr;
  }

  .cat-card__img {
    height: 140px;
  }
}
</style>
