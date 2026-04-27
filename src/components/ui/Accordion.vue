<script setup lang="ts">
import { ref } from 'vue'

const props = defineProps<{
  title: string
  icon?: string
  badge?: string | number
  defaultOpen?: boolean
}>()

const isOpen = ref(props.defaultOpen ?? false)

function toggle() {
  isOpen.value = !isOpen.value
}
</script>

<template>
  <div class="accordion" :class="{ 'accordion--open': isOpen }">
    <button class="accordion__header" @click="toggle">
      <span class="accordion__title">{{ title }}</span>
      <div class="accordion__right">
        <span v-if="badge" class="accordion__badge">{{ badge }}</span>
        <span class="accordion__arrow">{{ isOpen ? '−' : '+' }}</span>
      </div>
    </button>
    <Transition name="accordion-body">
      <div v-show="isOpen" class="accordion__body">
        <slot />
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.accordion {
  border: 1px solid var(--c-border);
  border-radius: var(--radius-md);
  margin-bottom: 8px;
  overflow: hidden;
  transition: border-color var(--duration) var(--ease);
}

.accordion:hover {
  border-color: var(--c-border-hover);
}

.accordion--open {
  border-color: var(--c-border-active);
}

.accordion__header {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 14px 18px;
  background: transparent;
  border: none;
  cursor: pointer;
  font-family: var(--font-body);
  transition: background var(--duration) var(--ease);
}

.accordion__header:hover {
  background: var(--c-accent-whisper);
}

.accordion__title {
  font-size: 13px;
  font-weight: 400;
  color: var(--c-deep);
}

.accordion__right {
  display: flex;
  align-items: center;
  gap: 8px;
}

.accordion__badge {
  background: var(--c-accent-soft);
  color: var(--c-white);
  font-size: 10px;
  font-weight: 400;
  padding: 2px 8px;
  border-radius: var(--radius-pill);
}

.accordion__arrow {
  color: var(--c-hint);
  font-size: 14px;
  font-weight: 300;
  width: 20px;
  text-align: center;
}

.accordion__body {
  padding: 0 18px 18px;
}

.accordion-body-enter-active,
.accordion-body-leave-active {
  transition: all 0.25s var(--ease);
  overflow: hidden;
}

.accordion-body-enter-from,
.accordion-body-leave-to {
  opacity: 0;
  max-height: 0;
  padding-bottom: 0;
}
</style>
