<template>
  <div class="filter-section" v-if="groups.length">
    <div v-for="group in groups" :key="group.key" class="filter-group">
      <span class="filter-label">{{ group.label }}:</span>
      <div class="filter-tabs">
        <button
          v-for="opt in group.options"
          :key="opt.value"
          class="filter-tab"
          :class="{ active: modelValue[group.key] === opt.value }"
          @click="select(group.key, opt.value)"
        >{{ opt.label }}</button>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  groups: Array,
  modelValue: Object
})
const emit = defineEmits(['update:modelValue'])

function select(key, value) {
  emit('update:modelValue', { ...props.modelValue, [key]: value })
}
</script>

<style scoped>
.filter-section { display: flex; flex-direction: column; gap: 12px; margin-bottom: 24px; }
.filter-group { display: flex; align-items: center; gap: 12px; flex-wrap: wrap; }
.filter-label { font-size: 14px; color: var(--text-secondary); white-space: nowrap; min-width: 65px; }
.filter-tabs { margin-bottom: 0; }
</style>
