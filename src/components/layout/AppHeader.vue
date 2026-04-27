<script setup lang="ts">
defineProps<{
  currentStep: number
  totalSteps: number
}>()
</script>

<template>
  <header class="header">
    <div class="header__inner">
      <div class="header__brand">
        <h1 class="header__logo">RelaxInn</h1>
        <p class="header__sub">Vacation Homes</p>
      </div>
      <span class="header__counter">{{ currentStep + 1 }} / {{ totalSteps }}</span>
    </div>
  </header>
</template>

<style scoped>
.header {
  background: var(--c-surface);
  padding: 18px var(--content-padding);
  border-bottom: 1px solid var(--c-border);
}

.header__inner {
  max-width: var(--content-max);
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
}

.header__logo {
  font-family: var(--font-display);
  font-size: 22px;
  font-weight: 300;
  color: var(--c-deep);
  letter-spacing: 3px;
  line-height: 1;
}

.header__sub {
  font-family: var(--font-body);
  font-size: 9px;
  font-weight: 400;
  color: var(--c-soft);
  letter-spacing: 2.5px;
  text-transform: uppercase;
  margin-top: 2px;
}

.header__counter {
  font-size: 11px;
  color: var(--c-hint);
  font-weight: 300;
  letter-spacing: 1px;
}

@media (max-width: 640px) {
  .header {
    padding: 14px 16px;
  }

  .header__logo {
    font-size: 20px;
  }
}
</style>
