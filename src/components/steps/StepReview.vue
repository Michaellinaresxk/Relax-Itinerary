<script setup lang="ts">
import { computed } from 'vue'
import { useFormData } from '@/composables/useFormData'
import { useDays } from '@/composables/useDays'
import {
  ALL_ACTIVITIES, EQUIPMENT, TRANSFER_VEHICLES,
  CHEF_OPTIONS, EQUIPMENT_SCHEDULE,
} from '@/constants/catalog'
import { formatDateShort, toISOKey } from '@/utils/dates'

const { state } = useFormData()
const { days, numDays } = useDays()

const filledGuests = computed(() => state.guests.filter(g => g.name.trim()))

const hasActivities = computed(() =>
  days.value.some(d => (state.dayActivities[toISOKey(d)] || []).length > 0),
)

const selectedVehicle = computed(() =>
  TRANSFER_VEHICLES.find(v => v.id === state.transferVehicleId),
)

const selectedChef = computed(() =>
  CHEF_OPTIONS.find(c => c.id === state.chefTier),
)

function actName(id: string) { return ALL_ACTIVITIES.find(a => a.id === id) }
function eqCatalog(id: string) { return EQUIPMENT.find(e => e.id === id) }
</script>

<template>
  <div>
    <!-- Guest -->
    <section class="sec">
      <span class="sec__tag">Huésped principal</span>
      <div class="row"><span class="row__l">Nombre</span><span class="row__v">{{ state.mainGuest }}</span></div>
      <div class="row"><span class="row__l">Email</span><span class="row__v">{{ state.email }}</span></div>
      <div class="row"><span class="row__l">Teléfono</span><span class="row__v">{{ state.phone }}</span></div>
      <div class="row">
        <span class="row__l">Grupo</span>
        <span class="row__v">
          {{ state.adults }} adultos<template v-if="state.children > 0">, {{ state.children }} niños ({{
            state.childAges.join(', ') }} años)</template>
        </span>
      </div>
      <div v-if="state.checkIn && state.checkOut" class="row">
        <span class="row__l">Estancia</span>
        <span class="row__v">{{ state.checkIn }} — {{ state.checkOut }} ({{ days.length }} noches)</span>
      </div>
    </section>

    <!-- Guests list -->
    <section v-if="filledGuests.length" class="sec">
      <span class="sec__tag">Invitados</span>
      <div v-for="(g, i) in filledGuests" :key="i" class="row">
        <span class="row__l">#{{ i + 1 }}</span>
        <span class="row__v">{{ g.name }}<template v-if="g.relation"> · {{ g.relation }}</template></span>
      </div>
    </section>

    <!-- Flights -->
    <section class="sec">
      <span class="sec__tag">Vuelos</span>
      <template v-for="(f, i) in state.arrivalFlights.filter(f => f.code)" :key="'a' + i">
        <div class="row">
          <span class="row__l">Llegada {{ i + 1 }}</span>
          <span class="row__v">{{ f.airline }} {{ f.code }} · {{ f.date }} {{ f.time }} · desde {{ f.origin }}</span>
        </div>
      </template>
      <template v-for="(f, i) in state.departureFlights.filter(f => f.code)" :key="'d' + i">
        <div class="row">
          <span class="row__l">Salida {{ i + 1 }}</span>
          <span class="row__v">{{ f.airline }} {{ f.code }} · {{ f.date }} {{ f.time }} · hacia {{ f.destination
            }}</span>
        </div>
      </template>
      <p v-if="!state.arrivalFlights.some(f => f.code) && !state.departureFlights.some(f => f.code)" class="empty-hint">
        No se ingresaron vuelos
      </p>
    </section>

    <!-- Transfer -->
    <section class="sec">
      <span class="sec__tag">Transporte</span>
      <div class="row">
        <span class="row__l">Transfer</span>
        <span class="row__v">
          {{ state.needsTransfer === true ? 'Transfer privado' : state.needsTransfer === false ? 'Transporte propio' :
            'No especificado' }}
        </span>
      </div>
      <template v-if="state.needsTransfer">
        <div v-if="selectedVehicle" class="row">
          <span class="row__l">Vehículo</span>
          <span class="row__v">{{ selectedVehicle.name }} ({{ selectedVehicle.capacity }}) · ${{
            selectedVehicle.priceUsd }} / trayecto</span>
        </div>
        <div class="row"><span class="row__l">Pasajeros</span><span class="row__v">{{ state.passengers }}</span></div>
        <div v-if="selectedVehicle && state.passengers > selectedVehicle.maxPassengers" class="capacity-warn">
          El vehículo seleccionado no tiene capacidad suficiente para {{ state.passengers }} personas.
        </div>
        <div v-if="state.transferNotes" class="row"><span class="row__l">Notas</span><span class="row__v">{{
          state.transferNotes }}</span></div>
      </template>
    </section>

    <!-- Activities -->
    <section v-if="hasActivities" class="sec">
      <span class="sec__tag">Experiencias</span>
      <template v-for="(day, di) in days" :key="toISOKey(day)">
        <template v-if="(state.dayActivities[toISOKey(day)] || []).length">
          <p class="day-sub">Día {{ di + 1 }} — {{ formatDateShort(day) }}</p>
          <div v-for="a in state.dayActivities[toISOKey(day)]" :key="a.id" class="row">
            <span class="row__l">{{ actName(a.id)?.name }}</span>
            <span class="row__v">
              {{ a.participants }} pax ·
              <template v-if="actName(a.id)?.scheduleType === 'fixed'">
                <em class="schedule-tag">{{ actName(a.id)?.fixedSchedule }}</em>
              </template>
              <template v-else>
                {{ a.preferredTime || 'sin hora' }}
              </template>
              ·
              <template v-if="actName(a.id)?.priceType === 'fixed'">${{ (actName(a.id)?.price || 0) * a.participants
                }}</template>
              <template v-else><em class="quote-label">Cotizar</em></template>
            </span>
          </div>
        </template>
      </template>
    </section>

    <!-- Equipment -->
    <section v-if="state.equipment.length" class="sec">
      <span class="sec__tag">Equipamiento</span>
      <div v-for="eq in state.equipment" :key="eq.id" class="row">
        <span class="row__l">{{ eqCatalog(eq.id)?.name }} ×{{ eq.quantity }}</span>
        <span class="row__v">
          <template v-if="eqCatalog(eq.id)?.priceType === 'fixed'">
            ${{ eqCatalog(eq.id)?.pricePerNight }} / noche · ~${{ (eqCatalog(eq.id)?.pricePerNight || 0) * eq.quantity *
              numDays }}
          </template>
          <template v-else><em class="quote-label">Cotizar</em></template>
        </span>
      </div>
      <div class="row">
        <span class="row__l">Entrega / Devolución</span>
        <span class="row__v">{{ EQUIPMENT_SCHEDULE.delivery }} / {{ EQUIPMENT_SCHEDULE.returnTime }}</span>
      </div>
    </section>

    <!-- Chef -->
    <section v-if="selectedChef" class="sec">
      <span class="sec__tag">Servicio de cocina</span>
      <div class="row"><span class="row__l">Tipo</span><span class="row__v">{{ selectedChef.name }}</span></div>
      <div class="row"><span class="row__l">Tarifa</span><span class="row__v">${{ selectedChef.pricePerDay }} / día ·
          ~${{
            selectedChef.pricePerDay * numDays }} total</span></div>
    </section>

    <!-- Grocery -->
    <section v-if="state.wantGrocery" class="sec">
      <span class="sec__tag">Servicio de compras</span>
      <div class="row"><span class="row__l">Estado</span><span class="row__v">Solicitado</span></div>
      <div v-if="state.groceryNotes" class="row">
        <span class="row__l">Notas</span>
        <span class="row__v row__v--wrap">{{ state.groceryNotes }}</span>
      </div>
    </section>

    <!-- Allergies -->
    <section v-if="state.allergies" class="sec">
      <span class="sec__tag">Alergias</span>
      <p class="alert-text">{{ state.allergies }}</p>
    </section>

    <!-- Special notes -->
    <section v-if="state.specialNotes" class="sec">
      <span class="sec__tag">Instrucciones especiales</span>
      <p class="note-text">{{ state.specialNotes }}</p>
    </section>

    <!-- CTA -->
    <div class="success-box">
      <p class="success-box__title">Todo listo</p>
      <p class="success-box__desc">
        Al enviar, tu concierge recibirá esta información para confirmar
        disponibilidad, precios finales y preparar tu itinerario en PDF.
      </p>
    </div>
  </div>
</template>

<style scoped>
.sec {
  margin-bottom: 20px;
}

.sec__tag {
  display: inline-block;
  font-size: 10px;
  color: var(--c-accent-soft);
  letter-spacing: 1.5px;
  text-transform: uppercase;
  font-weight: 400;
  margin-bottom: 10px;
  padding-bottom: 6px;
  border-bottom: 1px solid var(--c-border);
  width: 100%;
}

.row {
  display: flex;
  justify-content: space-between;
  padding: 7px 0;
  font-size: 13px;
  border-bottom: 1px solid var(--c-border);
  gap: 16px;
}

.row:last-child {
  border-bottom: none;
}

.row__l {
  color: var(--c-soft);
  flex-shrink: 0;
  font-weight: 300;
}

.row__v {
  font-weight: 400;
  text-align: right;
}

.row__v--wrap {
  white-space: normal;
  max-width: 60%;
}

.day-sub {
  font-size: 11px;
  font-weight: 400;
  color: var(--c-accent-soft);
  margin: 8px 0 2px;
  letter-spacing: 0.3px;
}

.quote-label {
  color: var(--c-warm);
  font-style: italic;
}

.schedule-tag {
  color: var(--c-warm);
  font-style: italic;
  font-size: 12px;
}

.capacity-warn {
  padding: 10px 14px;
  border-radius: var(--radius-sm);
  background: #FFF3ED;
  border: 1px solid #F0D4B4;
  font-size: 12px;
  color: #8B6914;
  font-weight: 300;
  margin: 4px 0;
}

.empty-hint {
  font-size: 12px;
  color: var(--c-hint);
  font-style: italic;
  font-weight: 300;
}

.alert-text {
  font-size: 13px;
  color: var(--c-red);
  font-weight: 400;
  line-height: 1.5;
}

.note-text {
  font-size: 13px;
  line-height: 1.5;
  font-weight: 300;
}

.success-box {
  margin-top: 24px;
  padding: 22px;
  text-align: center;
  border: 1px solid var(--c-accent-soft);
  border-radius: var(--radius-md);
  background: var(--c-accent-whisper);
}

.success-box__title {
  font-family: var(--font-display);
  font-size: 20px;
  font-weight: 300;
  color: var(--c-accent);
  margin-bottom: 4px;
}

.success-box__desc {
  font-size: 12px;
  color: var(--c-soft);
  font-weight: 300;
}

@media (max-width: 480px) {
  .row {
    flex-direction: column;
    gap: 2px;
  }

  .row__v {
    text-align: left;
  }

  .row__v--wrap {
    max-width: 100%;
  }
}
</style>
