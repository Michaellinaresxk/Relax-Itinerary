<script setup lang="ts">
defineProps<{
  canProceed: boolean
  isFirstStep: boolean
  isLastStep: boolean
}>()

const emit = defineEmits<{
  next: []
  back: []
  submit: []
}>()
</script>

<template>
  <div class="nav">
    <button v-if="!isLastStep" class="nav__main" :class="{ 'nav__main--dim': !canProceed }" @click="emit('next')">
      Continuar
    </button>

    <button v-else class="nav__main nav__main--accent" @click="emit('submit')">
      Generar documento
    </button>

    <button v-if="!isFirstStep" class="nav__back" @click="emit('back')">
      Paso anterior
    </button>

    <p v-if="!canProceed && !isLastStep" class="nav__hint">
      Completa los campos obligatorios para continuar
    </p>
  </div>
</template>

<style scoped>
.nav {
  margin-top: 32px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.nav__main {
  width: 100%;
  max-width: 440px;
  padding: 15px;
  background: var(--c-deep);
  color: var(--c-white);
  border: none;
  border-radius: var(--radius-md);
  font-size: 12px;
  font-weight: 500;
  letter-spacing: 1.5px;
  text-transform: uppercase;
  cursor: pointer;
  transition: all var(--duration) var(--ease);
}

.nav__main:hover {
  background: var(--c-accent);
}

.nav__main--dim {
  opacity: 0.35;
  pointer-events: none;
}

.nav__main--accent {
  background: var(--c-accent);
}

.nav__main--accent:hover {
  background: var(--c-accent-soft);
}

.nav__back {
  background: none;
  border: none;
  color: var(--c-hint);
  font-size: 12px;
  font-weight: 300;
  cursor: pointer;
  padding: 8px 0;
  letter-spacing: 0.3px;
  transition: color var(--duration) var(--ease);
}

.nav__back:hover {
  color: var(--c-soft);
}

.nav__hint {
  font-size: 11px;
  color: var(--c-red);
  text-align: center;
  font-weight: 300;
}
</style>
