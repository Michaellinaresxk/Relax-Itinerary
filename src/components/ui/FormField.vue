<script setup lang="ts">
defineProps<{
  label: string
  required?: boolean
  hint?: string
  error?: string | null
}>()
</script>

<template>
  <div class="field" :class="{ 'field--error': error }">
    <label class="field__label">
      {{ label }}
      <span v-if="required" class="field__req">*</span>
    </label>
    <slot />
    <p v-if="error" class="field__error">{{ error }}</p>
    <p v-else-if="hint" class="field__hint">{{ hint }}</p>
  </div>
</template>

<style scoped>
.field {
  margin-bottom: 18px;
}

.field--error :deep(.inp) {
  border-color: var(--c-red, #B85C5C);
}

.field__label {
  display: block;
  font-size: 11px;
  font-weight: 400;
  color: var(--c-soft);
  margin-bottom: 6px;
  letter-spacing: 0.3px;
}

.field__req {
  color: var(--c-warm);
}

.field__hint {
  font-size: 11px;
  color: var(--c-hint);
  margin-top: 5px;
  font-weight: 300;
  line-height: 1.4;
}

.field__error {
  font-size: 11px;
  color: var(--c-red, #B85C5C);
  margin-top: 5px;
  font-weight: 400;
  line-height: 1.4;
}
</style>
