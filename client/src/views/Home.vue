<template>
  <div class="home">
    <!-- Hero Section -->
    <section class="hero">
      <div class="hero-bg"></div>
      <div class="container hero-content">
        <h1 class="hero-title">
          <span class="gradient-text">AI Frontier Hub</span>
        </h1>
        <p class="hero-subtitle">探索人工智能前沿，连接未来科技生态</p>
        <p class="hero-desc">实时追踪 AI 资讯 / 一站式大模型导航 / 全球 AI 产品发现</p>
        <div class="hero-stats">
          <div class="hero-stat">
            <span class="stat-num">{{ newsStore.latest.length }}+</span>
            <span class="stat-text">实时资讯</span>
          </div>
          <div class="hero-stat">
            <span class="stat-num">{{ modelsStore.list.length }}+</span>
            <span class="stat-text">AI 大模型</span>
          </div>
          <div class="hero-stat">
            <span class="stat-num">{{ productsStore.list.length }}+</span>
            <span class="stat-text">AI 产品</span>
          </div>
        </div>
      </div>
    </section>

    <div class="container">
      <!-- Daily Picks -->
      <section class="section">
        <h2 class="section-title">今日推荐</h2>
        <div class="grid-2">
          <DailyPick :item="modelsStore.dailyPick" type="model" />
          <DailyPick :item="productsStore.dailyPick" type="product" />
        </div>
      </section>

      <!-- Latest News -->
      <section class="section">
        <h2 class="section-title">
          最新资讯
          <router-link to="/news" class="more">查看全部 &rarr;</router-link>
        </h2>
        <div class="news-scroll">
          <NewsCard v-for="item in newsStore.latest.slice(0, 8)" :key="item.id" :item="item" />
        </div>
      </section>

      <!-- Top Models -->
      <section class="section">
        <h2 class="section-title">
          热门大模型
          <router-link to="/models" class="more">查看全部 &rarr;</router-link>
        </h2>
        <div class="grid-3">
          <ModelCard v-for="item in topModels" :key="item.id" :item="item" />
        </div>
      </section>

      <!-- AI Products -->
      <section class="section">
        <h2 class="section-title">
          AI 产品发现
          <router-link to="/products" class="more">查看全部 &rarr;</router-link>
        </h2>
        <div class="grid-3">
          <ProductCard v-for="item in productsStore.list.slice(0, 6)" :key="item.id" :item="item" />
        </div>
      </section>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useNewsStore } from '../stores/news'
import { useModelsStore } from '../stores/models'
import { useProductsStore } from '../stores/products'
import NewsCard from '../components/NewsCard.vue'
import ModelCard from '../components/ModelCard.vue'
import ProductCard from '../components/ProductCard.vue'
import DailyPick from '../components/DailyPick.vue'

const newsStore = useNewsStore()
const modelsStore = useModelsStore()
const productsStore = useProductsStore()

const topModels = computed(() => [...modelsStore.list].sort((a, b) => b.score - a.score).slice(0, 6))

onMounted(async () => {
  await Promise.all([
    newsStore.fetchLatest(),
    modelsStore.fetchList(),
    modelsStore.fetchDailyPick(),
    productsStore.fetchList(),
    productsStore.fetchDailyPick()
  ])
})
</script>

<style scoped>
.hero {
  position: relative;
  padding: 80px 0 60px;
  overflow: hidden;
}
.hero-bg {
  position: absolute;
  inset: 0;
  background: radial-gradient(ellipse at 30% 20%, rgba(59,130,246,0.15) 0%, transparent 50%),
              radial-gradient(ellipse at 70% 60%, rgba(139,92,246,0.12) 0%, transparent 50%),
              radial-gradient(ellipse at 50% 100%, rgba(6,182,212,0.08) 0%, transparent 50%);
}
.hero-content { position: relative; text-align: center; }
.hero-title { font-size: 56px; font-weight: 800; margin-bottom: 16px; }
.gradient-text { background: linear-gradient(135deg, #3b82f6, #8b5cf6, #06b6d4); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
.hero-subtitle { font-size: 22px; color: var(--text-secondary); margin-bottom: 8px; }
.hero-desc { font-size: 15px; color: var(--text-dim); margin-bottom: 32px; }
.hero-stats { display: flex; justify-content: center; gap: 48px; }
.hero-stat { text-align: center; }
.stat-num { display: block; font-size: 32px; font-weight: 800; background: var(--accent-gradient); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
.stat-text { font-size: 13px; color: var(--text-dim); }

.section { padding: 40px 0; }

.news-scroll {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
}
@media (max-width: 1024px) { .news-scroll { grid-template-columns: repeat(3, 1fr); } }
@media (max-width: 768px) { .news-scroll { grid-template-columns: repeat(2, 1fr); } }
@media (max-width: 480px) { .news-scroll { grid-template-columns: 1fr; } }
</style>
