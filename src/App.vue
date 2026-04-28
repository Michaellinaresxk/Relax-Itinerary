<script setup lang="ts">
import { ref, computed } from 'vue'
import { useWizard } from '@/composables/useWizard'
import { useFormData } from '@/composables/useFormData'
import { submitItinerary, exportAsDocx } from '@/utils/exportData'

import AppHeader from '@/components/layout/AppHeader.vue'
import ProgressBar from '@/components/layout/ProgressBar.vue'
import StepNavigation from '@/components/layout/StepNavigation.vue'
import DoneScreen from '@/components/DoneScreen.vue'

import StepInfo from '@/components/steps/StepInfo.vue'
import StepTravel from '@/components/steps/StepTravel.vue'
import StepActivities from '@/components/steps/StepActivities.vue'
import StepMeals from '@/components/steps/StepMeals.vue'
import StepReview from '@/components/steps/StepReview.vue'

const stepMap: Record<string, any> = {
  info: StepInfo,
  travel: StepTravel,
  activities: StepActivities,
  meals: StepMeals,
  review: StepReview,
}

const {
  currentStep, currentMeta, totalSteps, progress,
  isFirstStep, isLastStep, canProceed, isShaking,
  goNext, goBack, goToStep,
} = useWizard()

const { state } = useFormData()

const isDone = ref(false)
const isSending = ref(false)
const sendError = ref('')

const activeComponent = computed(() => stepMap[currentMeta.value.id])
const cardClass = computed(() => ({
  card: true,
  'fade-in': !isShaking.value,
  shake: isShaking.value,
}))

async function handleSubmit() {
  isSending.value = true
  sendError.value = ''

  try {
    await submitItinerary(state)
    isDone.value = true
  } catch (err) {
    console.error('Submit failed:', err)
    sendError.value =
      err instanceof Error ? err.message : 'Error al enviar. Intenta de nuevo.'

    // Fallback: at least download the file locally
    try {
      await exportAsDocx(state)
      sendError.value += ' — Se descargó una copia local como respaldo.'
    } catch {
      // If even the download fails, the error message is enough
    }
  } finally {
    isSending.value = false
  }
}

function backToReview() {
  isDone.value = false
  sendError.value = ''
  goToStep(totalSteps - 1)
}
</script>

<template>
  <DoneScreen v-if="isDone" @back-to-review="backToReview" />

  <div v-else class="wizard">
    <AppHeader :current-step="currentStep" :total-steps="totalSteps" />
    <ProgressBar :progress="progress" />

    <div class="wizard__content">
      <div class="step-header">
        <span class="step-header__label">Paso {{ currentStep + 1 }}</span>
        <h2 class="step-header__title">{{ currentMeta.title }}</h2>
        <p class="step-header__sub">{{ currentMeta.sub }}</p>
      </div>

      <div :class="cardClass" :key="currentMeta.id">
        <component :is="activeComponent" />
      </div>

      <!-- Send error banner -->
      <div v-if="sendError" class="error-banner">
        <p>{{ sendError }}</p>
        <button class="error-banner__close" @click="sendError = ''">Cerrar</button>
      </div>

      <StepNavigation :can-proceed="canProceed && !isSending" :is-first-step="isFirstStep" :is-last-step="isLastStep"
        :is-loading="isSending" @next="goNext" @back="goBack" @submit="handleSubmit" />
    </div>

    <footer class="footer">
      <span class="footer__brand">RelaxInn Vacation Homes</span>
      <span class="footer__sep">·</span>
      <span>Punta Cana, República Dominicana</span>
    </footer>
  </div>
</template>

<style scoped>
.wizard {
  min-height: 100vh;
  min-height: 100dvh;
  background: var(--c-bg);
}

.wizard__content {
  max-width: var(--content-max);
  margin: 0 auto;
  padding: 40px var(--content-padding) 120px;
}

.step-header {
  text-align: center;
  margin-bottom: 32px;
}

.step-header__label {
  font-family: var(--font-body);
  font-size: 10px;
  font-weight: 400;
  color: var(--c-hint);
  letter-spacing: 2px;
  text-transform: uppercase;
}

.step-header__title {
  font-family: var(--font-display);
  font-size: 28px;
  font-weight: 300;
  color: var(--c-deep);
  margin: 6px 0 4px;
}

.step-header__sub {
  color: var(--c-soft);
  font-size: 13px;
  font-weight: 300;
}

.card {
  background: var(--c-surface);
  border-radius: var(--radius-lg);
  padding: 32px 28px;
  border: 1px solid var(--c-border);
}

.error-banner {
  margin-top: 16px;
  padding: 14px 18px;
  border-radius: var(--radius-md);
  background: #fdecea;
  border: 1px solid #f5c6cb;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
}

.error-banner p {
  font-size: 13px;
  color: var(--c-red, #B85C5C);
  font-weight: 300;
  line-height: 1.5;
}

.error-banner__close {
  font-size: 11px;
  color: var(--c-red, #B85C5C);
  cursor: pointer;
  white-space: nowrap;
  font-weight: 400;
  padding: 4px 8px;
  border-radius: var(--radius-sm);
  transition: opacity var(--duration) var(--ease);
}

.error-banner__close:hover {
  opacity: 0.6;
}

.footer {
  text-align: center;
  padding: 20px var(--content-padding);
  font-size: 11px;
  color: var(--c-hint);
  letter-spacing: 0.5px;
  font-weight: 300;
  border-top: 1px solid var(--c-border);
}

.footer__brand {
  font-weight: 400;
}

.footer__sep {
  margin: 0 6px;
}

@media (max-width: 640px) {
  .wizard__content {
    padding: 24px 16px 100px;
  }

  .step-header {
    margin-bottom: 24px;
  }

  .step-header__title {
    font-size: 24px;
  }

  .card {
    padding: 24px 18px;
    border-radius: var(--radius-md);
  }
}

@media (min-width: 1024px) {
  .wizard__content {
    padding: 48px var(--content-padding) 120px;
  }

  .card {
    padding: 36px 32px;
  }
}
</style>
