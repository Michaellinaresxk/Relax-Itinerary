import { computed, reactive } from 'vue'
import { useFormData } from './useFormData'

export interface FieldError {
  field: string
  message: string
}

/**
 * Centralized validation with per-field error messages.
 * Each step returns an array of { field, message } so the UI
 * can highlight the exact input that needs attention.
 */
export function useValidation() {
  const { state } = useFormData()

  /* ── touched tracking ──────────────────── */
  const touched = reactive<Record<string, boolean>>({})

  function touch(field: string) {
    touched[field] = true
  }

  function isTouched(field: string): boolean {
    return !!touched[field]
  }

  /** Mark every field in a step as touched (on "Continuar" attempt) */
  function touchStep(stepId: string) {
    const fields = stepFields[stepId] ?? []
    fields.forEach((f) => (touched[f] = true))
  }

  const stepFields: Record<string, string[]> = {
    info: ['mainGuest', 'email', 'phone', 'checkIn', 'checkOut'],
    travel: [],
    activities: [],
    meals: [],
    review: [],
  }

  /* ── Step 1 — Info ─────────────────────── */

  const infoErrors = computed<FieldError[]>(() => {
    const errs: FieldError[] = []

    if (!state.mainGuest.trim()) {
      errs.push({ field: 'mainGuest', message: 'El nombre del huésped principal es obligatorio.' })
    }

    if (!state.email.trim()) {
      errs.push({ field: 'email', message: 'El email es obligatorio.' })
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(state.email)) {
      errs.push({ field: 'email', message: 'Introduce un email válido.' })
    }

    if (!state.phone.trim()) {
      errs.push({ field: 'phone', message: 'El teléfono es obligatorio.' })
    }

    if (!state.checkIn) {
      errs.push({ field: 'checkIn', message: 'La fecha de check-in es obligatoria.' })
    }

    if (!state.checkOut) {
      errs.push({ field: 'checkOut', message: 'La fecha de check-out es obligatoria.' })
    }

    // Both dates present — cross-validate
    if (state.checkIn && state.checkOut) {
      const cin = new Date(state.checkIn)
      const cout = new Date(state.checkOut)

      if (cout <= cin) {
        errs.push({
          field: 'checkOut',
          message: 'La fecha de check-out debe ser posterior al check-in.',
        })
      }
    }

    return errs
  })

  /* ── Per-step validity ─────────────────── */

  const stepValid: Record<string, () => boolean> = {
    info: () => infoErrors.value.length === 0,
    travel: () => true,
    activities: () => true,
    meals: () => true,
    review: () => true,
  }

  function isStepValid(stepId: string): boolean {
    return stepValid[stepId]?.() ?? true
  }

  /* ── Helpers for the UI ────────────────── */

  /** Get error message for a field (only if touched) */
  function fieldError(field: string): string | null {
    if (!isTouched(field)) return null
    const err = infoErrors.value.find((e) => e.field === field)
    return err?.message ?? null
  }

  /** Check if a field currently has a visible error */
  function hasError(field: string): boolean {
    return fieldError(field) !== null
  }

  return {
    touched,
    touch,
    isTouched,
    touchStep,
    infoErrors,
    isStepValid,
    fieldError,
    hasError,
  }
}
