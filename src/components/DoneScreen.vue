<script setup lang="ts">
import { computed } from 'vue'
import { useFormData } from '@/composables/useFormData'

const { state } = useFormData()
const firstName = computed(() => state.mainGuest.split(' ')[0] || 'Viajero')

defineEmits<{ backToReview: [] }>()
</script>

<template>
  <div class="done">
    <div class="done__content">
      <div class="done__line" />
      <h1 class="done__title">Gracias, {{ firstName }}</h1>
      <p class="done__text">
        Tu información fue enviada correctamente al equipo de concierge.<br /><br />
        Un miembro del equipo revisará tus preferencias, confirmará
        disponibilidad y precios finales, y te enviará el itinerario
        completo en formato PDF por correo electrónico.
      </p>

      <div class="done__steps">
        <div class="done__step">
          <span class="done__step-num">1</span>
          <span>Tu solicitud fue recibida</span>
        </div>
        <div class="done__step done__step--pending">
          <span class="done__step-num">2</span>
          <span>El concierge confirma detalles y precios</span>
        </div>
        <div class="done__step done__step--pending">
          <span class="done__step-num">3</span>
          <span>Recibirás el itinerario final por email</span>
        </div>
      </div>

      <div class="done__contact">
        <p>info@relaxinnhomes.com</p>
        <p>1-786-655-4014</p>
      </div>

      <button class="done__btn" @click="$emit('backToReview')">
        Volver al resumen
      </button>

      <p class="done__brand">RelaxInn Vacation Homes</p>
    </div>
  </div>
</template>

<style scoped>
.done {
  min-height: 100vh;
  min-height: 100dvh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--c-bg);
  padding: 24px;
}

.done__content {
  text-align: center;
  max-width: 420px;
}

.done__line {
  width: 40px;
  height: 1px;
  background: var(--c-accent-soft);
  margin: 0 auto 24px;
}

.done__title {
  font-family: var(--font-display);
  font-size: 32px;
  font-weight: 300;
  color: var(--c-deep);
  margin-bottom: 12px;
}

.done__text {
  color: var(--c-soft);
  font-size: 14px;
  line-height: 1.7;
  margin-bottom: 28px;
  font-weight: 300;
}

.done__contact {
  font-size: 12px;
  color: var(--c-hint);
  margin-bottom: 32px;
  line-height: 1.8;
  font-weight: 300;
}

.done__steps {
  text-align: left;
  margin-bottom: 28px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.done__step {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 13px;
  color: var(--c-deep);
  font-weight: 300;
}

.done__step--pending {
  color: var(--c-soft);
}

.done__step-num {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 11px;
  font-weight: 500;
  flex-shrink: 0;
  background: var(--c-accent);
  color: var(--c-white);
}

.done__step--pending .done__step-num {
  background: var(--c-border);
  color: var(--c-soft);
}

.done__btn {
  display: inline-block;
  padding: 14px 40px;
  background: var(--c-deep);
  color: var(--c-white);
  border: none;
  border-radius: var(--radius-md);
  font-size: 12px;
  font-weight: 500;
  letter-spacing: 1px;
  text-transform: uppercase;
  cursor: pointer;
  transition: background var(--duration) var(--ease);
}

.done__btn:hover {
  background: var(--c-accent);
}

.done__brand {
  margin-top: 40px;
  font-size: 10px;
  color: var(--c-hint);
  letter-spacing: 2px;
  text-transform: uppercase;
  font-weight: 300;
}
</style>
