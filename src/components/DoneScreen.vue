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
        Tu itinerario se descargó como documento Word (.docx).<br />
        Completa los campos pendientes, conviértelo a PDF y envíalo al huésped.
      </p>

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
