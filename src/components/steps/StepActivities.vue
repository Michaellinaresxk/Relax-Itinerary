<script setup lang="ts">
import Accordion from '@/components/ui/Accordion.vue'
import { useFormData } from '@/composables/useFormData'
import { useDays } from '@/composables/useDays'
import { ACTIVITY_CATEGORIES, ALL_ACTIVITIES, EQUIPMENT } from '@/constants/catalog'
import { formatDateLong, toISOKey } from '@/utils/dates'
import { computed, ref } from 'vue'

const { state, toggleActivity, updateActivity, toggleEquipment, updateEquipmentQty } = useFormData()
const { days, numDays, hasDays } = useDays()

const activeDayIdx = ref(0)
const activeDay = computed(() => days.value[activeDayIdx.value])
const activeDayKey = computed(() => activeDay.value ? toISOKey(activeDay.value) : '')

function selectDay(i: number) { activeDayIdx.value = i }

function isActSelected(actId: string): boolean {
  return (state.dayActivities[activeDayKey.value] || []).some(a => a.id === actId)
}

function getActDetail(actId: string) {
  return (state.dayActivities[activeDayKey.value] || []).find(a => a.id === actId)
}

function selectedCountForDay(dayKey: string): number {
  return (state.dayActivities[dayKey] || []).length
}

function isEqSelected(id: string) { return state.equipment.some(e => e.id === id) }
function getEqQty(id: string) { return state.equipment.find(e => e.id === id)?.quantity || 1 }
</script>

<template>
  <div>
    <p v-if="!hasDays" class="empty-msg">
      Primero ingresa las fechas de check-in y check-out en el paso anterior.
    </p>

    <template v-else>
      <div class="section-label">Actividades por día</div>
      <p class="hint">
        Selecciona las experiencias que te interesan. Los servicios marcados como
        <em class="hint--quote">cotizar</em> serán confirmados por tu concierge.
      </p>

      <div class="day-pills">
        <button v-for="(day, i) in days" :key="toISOKey(day)" class="pill"
          :class="{ 'pill--active': i === activeDayIdx }" @click="selectDay(i)">
          <span>Día {{ i + 1 }}</span>
          <span v-if="selectedCountForDay(toISOKey(day))" class="pill__badge">
            {{ selectedCountForDay(toISOKey(day)) }}
          </span>
        </button>
      </div>

      <p class="day-date">{{ formatDateLong(activeDay) }}</p>

      <Accordion v-for="cat in ACTIVITY_CATEGORIES" :key="cat.id" :title="cat.label"
        :badge="cat.items.filter(a => isActSelected(a.id)).length || undefined">
        <div class="act-grid">
          <div v-for="act in cat.items" :key="act.id" class="act-card"
            :class="{ 'act-card--selected': isActSelected(act.id) }" @click="toggleActivity(activeDayKey, act.id)">
            <div class="act-card__img-wrap">
              <img :src="act.image" :alt="act.name" class="act-card__img" loading="lazy" />
              <div class="act-card__overlay">
                <span class="act-card__name">{{ act.name }}</span>
                <span v-if="act.priceType === 'fixed'" class="act-card__price">
                  ${{ act.price }} / {{ act.unit }}
                </span>
                <span v-else class="act-card__price act-card__price--quote">
                  Cotizar
                </span>
              </div>
              <div v-if="isActSelected(act.id)" class="act-card__check">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
            </div>

            <div v-if="isActSelected(act.id)" class="act-card__details" @click.stop>
              <div class="detail-row">
                <div class="detail-field">
                  <span class="detail-label">Participantes</span>
                  <input class="inp inp--sm inp--center" type="number" min="1"
                    :value="getActDetail(act.id)?.participants"
                    @input="updateActivity(activeDayKey, act.id, 'participants', parseInt(($event.target as HTMLInputElement).value) || 1)" />
                </div>
                <div class="detail-field">
                  <span class="detail-label">Hora preferida</span>
                  <input class="inp inp--sm" type="time" :value="getActDetail(act.id)?.preferredTime"
                    @input="updateActivity(activeDayKey, act.id, 'preferredTime', ($event.target as HTMLInputElement).value)" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </Accordion>
    </template>

    <div class="divider" />

    <div class="section-label">Equipamiento</div>
    <p class="hint">Entrega y recogida en la villa incluidas.</p>

    <div class="eq-list">
      <div v-for="eq in EQUIPMENT" :key="eq.id" class="eq-card" :class="{ 'eq-card--selected': isEqSelected(eq.id) }"
        @click="toggleEquipment(eq.id)">
        <img :src="eq.image" :alt="eq.name" class="eq-card__img" loading="lazy" />
        <div class="eq-card__info">
          <p class="eq-card__name">{{ eq.name }}</p>
          <p class="eq-card__price">${{ eq.perDay }} / día · ~${{ eq.perDay * numDays }} total</p>
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
  </div>
</template>

<style scoped>
.section-label {
  font-size: 10px;
  font-weight: 400;
  color: var(--c-accent-soft);
  letter-spacing: 2px;
  text-transform: uppercase;
  margin: 0 0 10px;
  padding-bottom: 8px;
  border-bottom: 1px solid var(--c-border);
}

.hint {
  font-size: 12px;
  color: var(--c-hint);
  margin-bottom: 16px;
  font-weight: 300;
  line-height: 1.5;
}

.hint--quote {
  color: var(--c-warm);
  font-style: italic;
}

.empty-msg {
  text-align: center;
  color: var(--c-soft);
  padding: 40px 20px;
  font-weight: 300;
}

.divider {
  height: 1px;
  background: var(--c-border);
  margin: 28px 0;
}

/* ── Day pills ───────────────────────────── */
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
  margin-bottom: 14px;
  text-transform: capitalize;
  font-weight: 300;
}

/* ── Activity photo cards ────────────────── */
.act-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
}

.act-card {
  border-radius: var(--radius-md);
  overflow: hidden;
  cursor: pointer;
  transition: all var(--duration) var(--ease);
  border: 1px solid transparent;
}

.act-card:hover {
  transform: translateY(-1px);
}

.act-card--selected {
  border-color: var(--c-accent-soft);
}

.act-card__img-wrap {
  position: relative;
  overflow: hidden;
}

.act-card__img {
  width: 100%;
  height: 120px;
  object-fit: cover;
  display: block;
  transition: transform 0.4s var(--ease);
}

.act-card:hover .act-card__img {
  transform: scale(1.03);
}

.act-card__overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 10px 12px;
  background: linear-gradient(transparent, rgba(0, 0, 0, 0.55));
  color: white;
}

.act-card__name {
  font-family: var(--font-display);
  font-size: 15px;
  font-weight: 300;
  display: block;
  line-height: 1.2;
}

.act-card__price {
  font-size: 11px;
  font-weight: 300;
  opacity: 0.8;
  display: block;
  margin-top: 1px;
}

.act-card__price--quote {
  color: #F0D4B8;
  font-style: italic;
  opacity: 1;
}

.act-card__check {
  position: absolute;
  top: 8px;
  right: 8px;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.92);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--c-accent);
}

.act-card__check svg {
  width: 13px;
  height: 13px;
}

.act-card__details {
  padding: 10px 12px;
  background: var(--c-bg);
}

.detail-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

.detail-field {
  display: flex;
  flex-direction: column;
}

.detail-label {
  font-size: 10px;
  color: var(--c-hint);
  display: block;
  margin-bottom: 4px;
  font-weight: 300;
  letter-spacing: 0.3px;
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

@media (max-width: 480px) {
  .act-grid {
    grid-template-columns: 1fr;
  }

  .act-card__img {
    height: 140px;
  }

  .detail-row {
    grid-template-columns: 1fr;
    gap: 8px;
  }
}

@media (min-width: 768px) {
  .act-grid {
    grid-template-columns: 1fr 1fr 1fr;
  }

  .act-card__img {
    height: 140px;
  }
}
</style>
