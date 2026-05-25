<template>
  <div class="models-page container">
    <div class="page-header">
      <h1 class="page-title gradient-text">AI 大模型</h1>
      <p class="page-desc">一站式集成全球前沿 AI 大模型，按场景和能力分类，快速找到最适合你的 AI 工具</p>
    </div>

    <!-- Daily Pick -->
    <section v-if="store.dailyPick" class="section">
      <DailyPick :item="store.dailyPick" type="model" />
    </section>

    <!-- Filters -->
    <CategoryFilter v-model="filters" :groups="filterGroups" />

    <!-- Sort -->
    <div class="sort-bar">
      <span class="sort-label">排序：</span>
      <button class="filter-tab" :class="{ active: sortBy === 'score' }" @click="sortBy = 'score'; loadData()">按评分</button>
      <button class="filter-tab" :class="{ active: sortBy === 'ranking' }" @click="sortBy = 'ranking'; loadData()">按排名</button>
      <span class="model-count">共 {{ store.list.length }} 个模型</span>
    </div>

    <!-- Grid -->
    <div class="grid-3" v-if="store.list.length">
      <ModelCard v-for="item in store.list" :key="item.id" :item="item" />
    </div>
    <div v-else class="empty-state">
      <p>暂无匹配的模型</p>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, watch, onMounted } from 'vue'
import { useModelsStore } from '../stores/models'
import ModelCard from '../components/ModelCard.vue'
import DailyPick from '../components/DailyPick.vue'
import CategoryFilter from '../components/CategoryFilter.vue'

const store = useModelsStore()
const sortBy = ref('score')

const filters = reactive({
  scene: 'all',
  type: 'all'
})

const filterGroups = [
  {
    key: 'scene',
    label: '按场景',
    options: [
      { label: '全部', value: 'all' },
      { label: '工作效率', value: 'work' },
      { label: '学习教育', value: 'study' },
      { label: '创意设计', value: 'creative' },
    ]
  },
  {
    key: 'type',
    label: '按能力',
    options: [
      { label: '全部', value: 'all' },
      { label: '文本', value: 'text' },
      { label: '图像', value: 'image' },
      { label: '多模态', value: 'multimodal' },
      { label: '语音', value: 'voice' },
      { label: '视频', value: 'video' },
      { label: '代码', value: 'code' },
    ]
  }
]

function loadData() {
  const params = { sort: sortBy.value }
  if (filters.scene !== 'all') params.scene = filters.scene
  if (filters.type !== 'all') params.type = filters.type
  store.fetchList(params)
}

watch(filters, loadData)

onMounted(async () => {
  await Promise.all([
    store.fetchDailyPick(),
    loadData()
  ])
})
</script>

<style scoped>
.models-page { padding-top: 40px; padding-bottom: 60px; }
.page-header { text-align: center; margin-bottom: 32px; }
.page-title { font-size: 36px; font-weight: 800; margin-bottom: 8px; }
.gradient-text { background: linear-gradient(135deg, #3b82f6, #8b5cf6, #06b6d4); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
.page-desc { color: var(--text-secondary); font-size: 15px; max-width: 600px; margin: 0 auto; }
.section { margin-bottom: 32px; }

.sort-bar {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 24px;
}
.sort-label { font-size: 14px; color: var(--text-secondary); }
.model-count { margin-left: auto; font-size: 13px; color: var(--text-dim); }

.empty-state { text-align: center; padding: 80px 0; color: var(--text-dim); }
</style>
