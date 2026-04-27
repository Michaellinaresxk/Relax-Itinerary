<script setup lang="ts">
defineProps<{
  label: string
  required?: boolean
  hint?: string
}>()
</script>

<template>
  <div class="field">
    <label class="field__label">
      {{ label }}
      <span v-if="required" class="field__req">*</span>
    </label>
    <slot />
    <p v-if="hint" class="field__hint">{{ hint }}</p>
  </div>
</template>

<style scoped>
.field {
  margin-bottom: 18px;
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
</style>
