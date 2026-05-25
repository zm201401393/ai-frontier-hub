<template>
  <div class="news-card card" @click="openLink">
    <div class="news-image">
      <img :src="item.image_url" :alt="item.title" loading="lazy" @error="onImgError" />
      <span class="news-category tag" :class="categoryClass">{{ categoryLabel }}</span>
    </div>
    <div class="news-body">
      <h3 class="news-title">{{ item.title }}</h3>
      <p class="news-summary">{{ item.summary }}</p>
      <div class="news-meta">
        <span class="news-source">{{ item.source }}</span>
        <span class="news-time">{{ timeAgo }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
const props = defineProps({ item: Object })

const categoryMap = {
  general: { label: '综合', class: 'tag-blue' },
  research: { label: '研究', class: 'tag-purple' },
  industry: { label: '行业', class: 'tag-cyan' },
  product: { label: '产品', class: 'tag-green' }
}
const categoryLabel = computed(() => categoryMap[props.item.category]?.label || '综合')
const categoryClass = computed(() => categoryMap[props.item.category]?.class || 'tag-blue')

const timeAgo = computed(() => {
  const now = Date.now()
  const pub = new Date(props.item.published_at).getTime()
  const diff = now - pub
  const mins = Math.floor(diff / 60000)
  if (mins < 60) return `${mins}分钟前`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours}小时前`
  const days = Math.floor(hours / 24)
  return `${days}天前`
})

function openLink() { window.open(props.item.url, '_blank') }
function onImgError(e) { e.target.src = `https://picsum.photos/seed/${Date.now()}/600/300` }
</script>

<style scoped>
.news-card { padding: 0; overflow: hidden; cursor: pointer; }
.news-image { position: relative; height: 180px; overflow: hidden; }
.news-image img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.3s; }
.news-card:hover .news-image img { transform: scale(1.05); }
.news-category { position: absolute; top: 12px; left: 12px; }
.news-body { padding: 16px; }
.news-title { font-size: 16px; font-weight: 600; line-height: 1.4; margin-bottom: 8px; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
.news-summary { font-size: 13px; color: var(--text-secondary); line-height: 1.5; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; margin-bottom: 12px; }
.news-meta { display: flex; justify-content: space-between; font-size: 12px; color: var(--text-dim); }
</style>
