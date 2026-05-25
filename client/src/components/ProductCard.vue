<template>
  <div class="product-card card" @click="openLink">
    <div class="product-header">
      <img :src="item.logo" :alt="item.name" class="product-logo" @error="onImgError" />
      <div>
        <h3>{{ item.name }}</h3>
        <span class="tag tag-cyan" style="font-size:11px;">{{ item.base_model }}</span>
      </div>
      <span v-if="item.is_daily_pick" class="daily-pick-badge">今日推荐</span>
    </div>
    <p class="product-desc">{{ item.description }}</p>
    <div class="product-category">
      <span class="tag" :class="categoryClass">{{ categoryLabel }}</span>
    </div>
    <button class="btn btn-outline product-btn">了解更多 &rarr;</button>
  </div>
</template>

<script setup>
import { computed } from 'vue'
const props = defineProps({ item: Object })

const catMap = {
  healthcare: { label: '医疗健康', class: 'tag-green' },
  finance: { label: '金融', class: 'tag-blue' },
  education: { label: '教育', class: 'tag-purple' },
  legal: { label: '法律', class: 'tag-orange' },
  marketing: { label: '营销', class: 'tag-pink' },
  design: { label: '设计', class: 'tag-cyan' },
  dev: { label: '开发', class: 'tag-blue' },
  other: { label: '通用', class: 'tag-purple' }
}
const categoryLabel = computed(() => catMap[props.item.category]?.label || '通用')
const categoryClass = computed(() => catMap[props.item.category]?.class || 'tag-blue')

function openLink() { window.open(props.item.url, '_blank') }
function onImgError(e) { e.target.style.display = 'none' }
</script>

<style scoped>
.product-card { cursor: pointer; display: flex; flex-direction: column; gap: 12px; }
.product-header { display: flex; align-items: center; gap: 12px; }
.product-logo { width: 44px; height: 44px; border-radius: 10px; object-fit: contain; background: rgba(255,255,255,0.05); padding: 4px; }
.product-header h3 { font-size: 16px; font-weight: 600; margin-bottom: 4px; }
.product-header .daily-pick-badge { margin-left: auto; }
.product-desc { font-size: 13px; color: var(--text-secondary); line-height: 1.5; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
.product-btn { width: 100%; justify-content: center; margin-top: auto; }
</style>
