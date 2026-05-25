<template>
  <div class="news-page container">
    <div class="page-header">
      <h1 class="page-title gradient-text">AI 资讯</h1>
      <p class="page-desc">实时追踪全球 AI 领域最新动态，每小时自动更新</p>
    </div>

    <div class="news-toolbar">
      <div class="filter-tabs">
        <button
          v-for="cat in categories"
          :key="cat.value"
          class="filter-tab"
          :class="{ active: currentCategory === cat.value }"
          @click="setCategory(cat.value)"
        >{{ cat.label }}</button>
      </div>
      <div class="search-box">
        <input
          v-model="searchText"
          placeholder="搜索资讯..."
          @keyup.enter="doSearch"
        />
        <button class="btn btn-primary btn-sm" @click="doSearch">搜索</button>
      </div>
    </div>

    <div class="news-info">
      <span class="update-hint">共 {{ store.total }} 条资讯</span>
      <button class="btn btn-outline btn-sm" @click="manualFetch" :disabled="fetching">
        {{ fetching ? '抓取中...' : '手动抓取最新' }}
      </button>
    </div>

    <div class="grid-3" v-if="store.list.length">
      <NewsCard v-for="item in store.list" :key="item.id" :item="item" />
    </div>
    <div v-else class="empty-state">
      <p>暂无资讯数据</p>
    </div>

    <div class="pagination" v-if="totalPages > 1">
      <button
        class="btn btn-outline btn-sm"
        :disabled="page <= 1"
        @click="goPage(page - 1)"
      >&laquo; 上一页</button>
      <span class="page-info">{{ page }} / {{ totalPages }}</span>
      <button
        class="btn btn-outline btn-sm"
        :disabled="page >= totalPages"
        @click="goPage(page + 1)"
      >下一页 &raquo;</button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useNewsStore } from '../stores/news'
import NewsCard from '../components/NewsCard.vue'

const store = useNewsStore()
const currentCategory = ref('all')
const searchText = ref('')
const page = ref(1)
const pageSize = 12
const fetching = ref(false)

const categories = [
  { label: '全部', value: 'all' },
  { label: '行业动态', value: 'industry' },
  { label: '学术研究', value: 'research' },
  { label: '产品发布', value: 'product' },
  { label: '综合', value: 'general' },
]

const totalPages = computed(() => Math.ceil(store.total / pageSize))

function loadData() {
  const params = { page: page.value, pageSize }
  if (currentCategory.value !== 'all') params.category = currentCategory.value
  if (searchText.value) params.search = searchText.value
  store.fetchList(params)
}

function setCategory(cat) {
  currentCategory.value = cat
  page.value = 1
  loadData()
}

function doSearch() {
  page.value = 1
  loadData()
}

function goPage(p) {
  page.value = p
  loadData()
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

async function manualFetch() {
  fetching.value = true
  try {
    await store.triggerFetch()
    loadData()
  } finally {
    fetching.value = false
  }
}

onMounted(loadData)
</script>

<style scoped>
.news-page { padding-top: 40px; padding-bottom: 60px; }
.page-header { text-align: center; margin-bottom: 32px; }
.page-title { font-size: 36px; font-weight: 800; margin-bottom: 8px; }
.gradient-text { background: linear-gradient(135deg, #3b82f6, #8b5cf6, #06b6d4); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
.page-desc { color: var(--text-secondary); font-size: 15px; }

.news-toolbar {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 16px;
  margin-bottom: 16px;
  flex-wrap: wrap;
}
.search-box { display: flex; gap: 8px; }
.search-box input {
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-sm);
  padding: 6px 14px;
  color: var(--text-primary);
  font-size: 14px;
  width: 200px;
  outline: none;
}
.search-box input:focus { border-color: var(--accent-blue); }
.btn-sm { padding: 6px 14px; font-size: 13px; }

.news-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}
.update-hint { font-size: 13px; color: var(--text-dim); }

.empty-state { text-align: center; padding: 80px 0; color: var(--text-dim); }

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 16px;
  margin-top: 32px;
}
.page-info { font-size: 14px; color: var(--text-secondary); }
</style>
