<template>
  <div class="page-shell">
    <section class="metric-grid">
      <article class="metric-card">
        <span class="metric-card__label">服务总数</span>
        <strong class="metric-card__value">{{ services.length }}</strong>
        <span class="status-pill is-brand">已接通服务接口</span>
      </article>
      <article class="metric-card">
        <span class="metric-card__label">当前可申请</span>
        <strong class="metric-card__value">{{ availableCount }}</strong>
        <span class="status-pill is-success">可直接进入办理</span>
      </article>
      <article class="metric-card">
        <span class="metric-card__label">我的预约</span>
        <strong class="metric-card__value">{{ bookings.length }}</strong>
        <span class="status-pill is-warning">已接通预约状态接口</span>
      </article>
    </section>

    <section class="grid-cards">
      <el-card class="panel-card" style="grid-column: span 7;">
        <template #header>
          <div class="section-head">
            <h3 class="section-head__title">常用服务</h3>
            <el-button text @click="router.push('/services')">查看全部</el-button>
          </div>
        </template>
        <div class="resource-grid">
          <article v-for="item in services.slice(0, 4)" :key="item.id" class="resource-card">
            <div class="cover-badge" :class="item.image">{{ item.code }}</div>
            <div class="section-head" style="margin-bottom: 0;">
              <h3 class="section-head__title">{{ item.name }}</h3>
              <el-tag :type="item.status === 'available' ? 'success' : 'warning'">
                {{ item.status === 'available' ? '可申请' : '维护中' }}
              </el-tag>
            </div>
            <p class="muted">{{ item.description }}</p>
          </article>
        </div>
      </el-card>

      <el-card class="panel-card" style="grid-column: span 5;">
        <template #header>
          <div class="section-head">
            <h3 class="section-head__title">最近预约</h3>
            <el-button text @click="router.push('/bookings')">查看记录</el-button>
          </div>
        </template>
        <div class="booking-list">
          <article v-for="item in bookings.slice(0, 5)" :key="item.id" class="booking-item">
            <div>
              <strong>{{ item.serviceName }}</strong>
              <p>{{ item.date }} {{ item.timeRange }}</p>
            </div>
            <el-tag :type="tagMap[item.status]">{{ statusMap[item.status] }}</el-tag>
          </article>
        </div>
      </el-card>
    </section>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { loadBookingRecords, loadServiceCards } from '@/services/portal'
import type { BookingRecord, ServiceCard } from '@/types'

const router = useRouter()
const services = ref<ServiceCard[]>([])
const bookings = ref<BookingRecord[]>([])

const availableCount = computed(() => services.value.filter((item) => item.status === 'available').length)

const statusMap: Record<BookingRecord['status'], string> = {
  pending: '待审核',
  approved: '已通过',
  rejected: '已驳回',
  completed: '已完成',
  cancelled: '已取消',
}

const tagMap: Record<BookingRecord['status'], 'warning' | 'success' | 'danger' | 'info'> = {
  pending: 'warning',
  approved: 'success',
  rejected: 'danger',
  completed: 'info',
  cancelled: 'info',
}

onMounted(async () => {
  ;[services.value, bookings.value] = await Promise.all([loadServiceCards(), loadBookingRecords()])
})
</script>

<style scoped lang="scss">
.metric-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
}

.metric-card {
  padding: 22px;
  border-radius: 22px;
  border: 1px solid var(--border-soft);
  background: rgba(255, 255, 255, 0.92);
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

.booking-list {
  display: grid;
  gap: 12px;
}

.booking-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 16px;
  border-radius: 18px;
  border: 1px solid var(--border-soft);
  background: linear-gradient(180deg, #fff, #f8fbff);
}

.booking-item p {
  margin: 6px 0 0;
  color: var(--text-secondary);
  font-size: 13px;
}

@media (max-width: 1100px) {
  .metric-grid {
    grid-template-columns: 1fr;
  }
}
</style>
