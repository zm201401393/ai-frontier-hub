<template>
  <div v-if="item" class="daily-pick card" :class="type">
    <div class="pick-badge daily-pick-badge">{{ badgeText }}</div>
    <div class="pick-header">
      <img v-if="item.logo" :src="item.logo" class="pick-logo" />
      <div>
        <h3>{{ item.name }}</h3>
        <p class="pick-provider" v-if="item.provider">{{ item.provider }}</p>
        <p class="pick-provider" v-if="item.base_model">基于 {{ item.base_model }}</p>
      </div>
      <span v-if="item.score" class="pick-score">{{ item.score }}分</span>
    </div>
    <p class="pick-desc">{{ item.description }}</p>
    <p class="pick-reason" v-if="item.recommend_reason">{{ item.recommend_reason }}</p>
    <button class="btn btn-primary" @click.stop="openLink">立即体验 &rarr;</button>
  </div>
</template>

<script setup>
import { computed } from 'vue'
const props = defineProps({
  item: Object,
  type: { type: String, default: 'model' }
})

const badgeText = computed(() => props.type === 'model' ? '今日推荐模型' : '今日推荐产品')
function openLink() { window.open(props.item?.url, '_blank') }
</script>

<style scoped>
.daily-pick {
  background: linear-gradient(135deg, rgba(59,130,246,0.1), rgba(139,92,246,0.1));
  border-color: rgba(139,92,246,0.3);
  position: relative;
  overflow: hidden;
}
.daily-pick::before {
  content: '';
  position: absolute;
  top: -50%;
  right: -50%;
  width: 100%;
  height: 100%;
  background: radial-gradient(circle, rgba(139,92,246,0.08) 0%, transparent 70%);
}
.pick-badge { margin-bottom: 12px; align-self: flex-start; }
.pick-header { display: flex; align-items: center; gap: 12px; margin-bottom: 8px; position: relative; }
.pick-logo { width: 56px; height: 56px; border-radius: 14px; object-fit: contain; background: rgba(255,255,255,0.05); padding: 4px; }
.pick-header h3 { font-size: 18px; font-weight: 700; }
.pick-provider { font-size: 13px; color: var(--text-secondary); }
.pick-score { margin-left: auto; font-size: 22px; font-weight: 800; background: var(--accent-gradient); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
.pick-desc { font-size: 14px; color: var(--text-secondary); line-height: 1.6; position: relative; }
.pick-reason { font-size: 13px; color: var(--accent-cyan); font-style: italic; margin-top: 4px; position: relative; }
.daily-pick .btn { position: relative; margin-top: 8px; }
</style>
