<template>
  <div class="products-page container">
    <div class="page-header">
      <h1 class="page-title gradient-text">AI 产品推荐</h1>
      <p class="page-desc">发现全球最新基于大模型开发的行业 AI 产品，每日精选推荐</p>
    </div>

    <!-- Daily Pick -->
    <section v-if="store.dailyPick" class="section">
      <DailyPick :item="store.dailyPick" type="product" />
    </section>

    <!-- Category Filter -->
    <div class="filter-tabs">
      <button
        v-for="cat in categories"
        :key="cat.value"
        class="filter-tab"
        :class="{ active: currentCategory === cat.value }"
        @click="setCategory(cat.value)"
      >{{ cat.label }}</button>
    </div>

    <div class="product-count">共 {{ store.list.length }} 个产品</div>

    <!-- Grid -->
    <div class="grid-3" v-if="store.list.length">
      <ProductCard v-for="item in store.list" :key="item.id" :item="item" />
    </div>
    <div v-else class="empty-state">
      <p>暂无该分类的产品</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useProductsStore } from '../stores/products'
import ProductCard from '../components/ProductCard.vue'
import DailyPick from '../components/DailyPick.vue'

const store = useProductsStore()
const currentCategory = ref('all')

const categories = [
  { label: '全部', value: 'all' },
  { label: '开发', value: 'dev' },
  { label: '设计', value: 'design' },
  { label: '营销', value: 'marketing' },
  { label: '医疗', value: 'healthcare' },
  { label: '法律', value: 'legal' },
  { label: '教育', value: 'education' },
  { label: '金融', value: 'finance' },
  { label: '通用', value: 'other' },
]

function setCategory(cat) {
  currentCategory.value = cat
  const params = {}
  if (cat !== 'all') params.category = cat
  store.fetchList(params)
}

onMounted(async () => {
  await Promise.all([
    store.fetchDailyPick(),
    store.fetchList()
  ])
})
</script>

<style scoped>
.products-page { padding-top: 40px; padding-bottom: 60px; }
.page-header { text-align: center; margin-bottom: 32px; }
.page-title { font-size: 36px; font-weight: 800; margin-bottom: 8px; }
.gradient-text { background: linear-gradient(135deg, #3b82f6, #8b5cf6, #06b6d4); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
.page-desc { color: var(--text-secondary); font-size: 15px; }
.section { margin-bottom: 32px; }
.product-count { font-size: 13px; color: var(--text-dim); margin-bottom: 20px; }
.empty-state { text-align: center; padding: 80px 0; color: var(--text-dim); }
</style>
