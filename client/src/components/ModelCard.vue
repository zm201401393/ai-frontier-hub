<template>
  <div class="model-card card" @click="openLink">
    <div class="model-header">
      <img :src="item.logo" :alt="item.name" class="model-logo" @error="onImgError" />
      <div class="model-info">
        <h3>{{ item.name }}</h3>
        <span class="model-provider">{{ item.provider }}</span>
      </div>
      <div class="model-rank" v-if="item.ranking">
        <span class="rank-badge">#{{ item.ranking }}</span>
      </div>
    </div>
    <p class="model-desc">{{ item.description }}</p>
    <div class="model-tags">
      <span class="tag" :class="sceneTagClass">{{ sceneLabel }}</span>
      <span class="tag" :class="typeTagClass">{{ typeLabel }}</span>
      <span class="tag" :class="pricingClass">{{ pricingLabel }}</span>
    </div>
    <div class="model-score">
      <div class="score-label">
        <span>评分</span>
        <span class="score-value">{{ item.score }}</span>
      </div>
      <div class="score-bar">
        <div class="score-bar-fill" :style="{ width: item.score + '%' }"></div>
      </div>
    </div>
    <div class="model-features" v-if="features.length">
      <span v-for="f in features" :key="f" class="feature-tag">{{ f }}</span>
    </div>
    <button class="btn btn-primary model-btn">立即体验 &rarr;</button>
  </div>
</template>

<script setup>
import { computed } from 'vue'
const props = defineProps({ item: Object })

const sceneMap = { work: '工作效率', study: '学习教育', creative: '创意设计' }
const typeMap = { text: '文本', image: '图像', multimodal: '多模态', voice: '语音', video: '视频', code: '代码' }
const pricingMap = { free: '免费', freemium: '免费增值', paid: '付费' }

const sceneLabel = computed(() => sceneMap[props.item.category_scene] || props.item.category_scene)
const typeLabel = computed(() => typeMap[props.item.category_type] || props.item.category_type)
const pricingLabel = computed(() => pricingMap[props.item.pricing] || props.item.pricing)
const sceneTagClass = computed(() => ({ work: 'tag-blue', study: 'tag-purple', creative: 'tag-pink' }[props.item.category_scene] || 'tag-blue'))
const typeTagClass = computed(() => ({ text: 'tag-cyan', image: 'tag-pink', multimodal: 'tag-orange', voice: 'tag-green', video: 'tag-purple', code: 'tag-blue' }[props.item.category_type] || 'tag-cyan'))
const pricingClass = computed(() => props.item.pricing === 'free' ? 'tag-green' : props.item.pricing === 'paid' ? 'tag-orange' : 'tag-blue')

const features = computed(() => {
  try { return JSON.parse(props.item.features || '[]') } catch { return [] }
})

function openLink() { window.open(props.item.url, '_blank') }
function onImgError(e) { e.target.style.display = 'none' }
</script>

<style scoped>
.model-card { cursor: pointer; display: flex; flex-direction: column; gap: 12px; }
.model-header { display: flex; align-items: center; gap: 12px; }
.model-logo { width: 48px; height: 48px; border-radius: 12px; object-fit: contain; background: rgba(255,255,255,0.05); padding: 4px; }
.model-info h3 { font-size: 16px; font-weight: 600; }
.model-provider { font-size: 13px; color: var(--text-secondary); }
.model-rank { margin-left: auto; }
.rank-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 36px;
  height: 28px;
  border-radius: 14px;
  font-size: 13px;
  font-weight: 700;
  background: var(--accent-gradient);
  color: white;
}
.model-desc { font-size: 13px; color: var(--text-secondary); line-height: 1.5; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
.model-tags { display: flex; gap: 6px; flex-wrap: wrap; }
.model-score { }
.score-label { display: flex; justify-content: space-between; font-size: 12px; color: var(--text-secondary); margin-bottom: 4px; }
.score-value { font-weight: 700; color: var(--accent-cyan); }
.model-features { display: flex; gap: 6px; flex-wrap: wrap; }
.feature-tag { font-size: 11px; padding: 2px 8px; border-radius: 4px; background: rgba(255,255,255,0.05); color: var(--text-dim); }
.model-btn { width: 100%; justify-content: center; margin-top: auto; }
</style>
