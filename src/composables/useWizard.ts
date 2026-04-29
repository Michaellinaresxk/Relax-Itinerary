import { ref, computed } from 'vue'
import { STEPS } from '@/constants/catalog'
import { useValidation } from './useValidation'
import type { StepMeta } from '@/types'

export function useWizard() {
  const currentStep = ref(0)
  const isShaking = ref(false)
  const { isStepValid, touchStep } = useValidation()

  const totalSteps = STEPS.length

  const currentMeta = computed<StepMeta>(() => STEPS[currentStep.value] as StepMeta)
  const progress = computed(() => ((currentStep.value + 1) / totalSteps) * 100)
  const isFirstStep = computed(() => currentStep.value === 0)
  const isLastStep = computed(() => currentStep.value === totalSteps - 1)

  const canProceed = computed(() => isStepValid(currentMeta.value.id))

  function goNext() {
    const id = currentMeta.value.id

    if (!canProceed.value) {
      // Mark all fields as touched so inline errors become visible
      touchStep(id)
      triggerShake()
      return
    }

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
    setTimeout(() => {
      isShaking.value = false
    }, 500)
  }

  return {
    currentStep,
    currentMeta,
    totalSteps,
    progress,
    isFirstStep,
    isLastStep,
    canProceed,
    isShaking,
    goNext,
    goBack,
    goToStep,
  }
}
