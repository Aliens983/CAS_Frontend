<template>
  <div class="page-shell">
    <section class="metric-grid">
      <article class="metric-card">
        <span class="metric-card__label">平台用户数</span>
        <strong class="metric-card__value">{{ summary.totalUsers }}</strong>
        <span class="status-pill is-brand">已联调用户接口</span>
      </article>
      <article class="metric-card">
        <span class="metric-card__label">服务模块数</span>
        <strong class="metric-card__value">{{ summary.totalServices }}</strong>
        <span class="status-pill is-success">已联调服务接口</span>
      </article>
      <article class="metric-card">
        <span class="metric-card__label">活跃预约</span>
        <strong class="metric-card__value">{{ summary.activeBookings }}</strong>
        <span class="status-pill is-warning">已联调预约状态接口</span>
      </article>
      <article class="metric-card">
        <span class="metric-card__label">通过率</span>
        <strong class="metric-card__value">{{ summary.approvalRate }}</strong>
        <span class="status-pill is-danger">来自现有状态数据</span>
      </article>
    </section>

    <el-card class="panel-card">
      <template #header><div class="section-head"><h3 class="section-head__title">当前优化结果</h3></div></template>
      <div class="result-grid">
        <div class="result-card">路由切换加入 Suspense 占位，减少异步切页时的白屏感。</div>
        <div class="result-card">首屏与页面切换动画收敛，减少大面积模糊和过渡时长。</div>
        <div class="result-card">主路径文案与布局重新整理，避免乱码和挤压换行。</div>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { loadAdminSummary } from '@/services/portal'
import type { AdminSummary } from '@/types'

const summary = ref<AdminSummary>({
  totalUsers: 0,
  totalServices: 0,
  activeBookings: 0,
  approvalRate: '0%',
})

onMounted(async () => {
  summary.value = await loadAdminSummary()
})
</script>

<style scoped lang="scss">
.metric-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
}

.metric-card {
  padding: 22px;
  border-radius: 22px;
  border: 1px solid var(--border-soft);
  background: rgba(255, 255, 255, 0.94);
  box-shadow: var(--shadow-card);
}

.metric-card__label {
  color: var(--text-secondary);
  font-size: 13px;
}

.metric-card__value {
  display: block;
  margin: 10px 0 14px;
  font-size: 34px;
}

.result-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 14px;
}

.result-card {
  padding: 18px;
  border-radius: 18px;
  border: 1px solid var(--border-soft);
  background: linear-gradient(180deg, #fff, #f8fbff);
  line-height: 1.7;
}

@media (max-width: 1100px) {
  .metric-grid,
  .result-grid {
    grid-template-columns: 1fr;
  }
}
</style>
