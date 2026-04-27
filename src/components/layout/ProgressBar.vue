<script setup lang="ts">
defineProps<{
  progress: number
}>()
</script>

<template>
  <div class="progress">
    <div class="progress__fill" :style="{ width: `${progress}%` }" />
  </div>
</template>

<style scoped>
.progress {
  background: var(--c-border);
  height: 1.5px;
}

.progress__fill {
  height: 100%;
  background: var(--c-accent-soft);
  transition: width 0.5s var(--ease);
}
</style>
