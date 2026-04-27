<script setup lang="ts">
defineProps<{
  icon: string
  title: string
  description: string
  active: boolean
}>()

const emit = defineEmits<{
  select: []
}>()
</script>

<template>
  <div class="opt" :class="{ 'opt--active': active }" @click="emit('select')">
    <p class="opt__title">{{ title }}</p>
    <p class="opt__desc">{{ description }}</p>
  </div>
</template>

<style scoped>
.opt {
  background: transparent;
  border: 1px solid var(--c-border);
  border-radius: var(--radius-md);
  padding: 20px 16px;
  cursor: pointer;
  transition: all var(--duration) var(--ease);
  text-align: center;
}

.opt:hover {
  border-color: var(--c-border-hover);
}

.opt--active {
  border-color: var(--c-accent-soft);
  background: var(--c-accent-whisper);
}

.opt__title {
  font-family: var(--font-display);
  font-weight: 400;
  font-size: 16px;
  color: var(--c-deep);
  margin-bottom: 2px;
}

.opt__desc {
  font-size: 11px;
  color: var(--c-hint);
  font-weight: 300;
}
</style>
