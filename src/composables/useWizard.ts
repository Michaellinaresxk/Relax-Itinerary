import { ref, computed } from 'vue'
import { STEPS } from '@/constants/catalog'
import { useFormData } from './useFormData'
import type { StepId } from '@/types'

export function useWizard() {
  const currentStep = ref(0)
  const isShaking = ref(false)
  const { state } = useFormData()

  const totalSteps = STEPS.length
  const currentMeta = computed(() => STEPS[currentStep.value])
  const progress = computed(() => ((currentStep.value + 1) / totalSteps) * 100)
  const isFirstStep = computed(() => currentStep.value === 0)
  const isLastStep = computed(() => currentStep.value === totalSteps - 1)

  const validators: Record<StepId, () => boolean> = {
    info: () => state.mainGuest.trim() !== '' && state.email.trim() !== '' && state.phone.trim() !== '' && state.checkIn !== '' && state.checkOut !== '' && new Date(state.checkOut) > new Date(state.checkIn),
    travel: () => true,
    activities: () => true,
    meals: () => true,
    review: () => true,
  }

  const canProceed = computed(() => {
    const id = currentMeta.value.id as StepId
    return validators[id]?.() ?? true
  })

  function goNext() {
    if (!canProceed.value) { triggerShake(); return }
    if (currentStep.value < totalSteps - 1) currentStep.value++
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function goBack() {
    if (currentStep.value > 0) currentStep.value--
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function goToStep(i: number) {
    if (i >= 0 && i < totalSteps) currentStep.value = i
  }

  function triggerShake() {
    isShaking.value = true
    setTimeout(() => { isShaking.value = false }, 500)
  }

  return {
    currentStep, currentMeta, totalSteps, progress,
    isFirstStep, isLastStep, canProceed, isShaking,
    goNext, goBack, goToStep,
  }
}
