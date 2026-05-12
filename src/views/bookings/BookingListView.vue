<template>
  <div class="page-shell">
    <section class="page-hero">
      <div>
        <div class="status-pill is-brand">我的预约</div>
        <h1 class="page-hero__title">统一查看预约状态、提交时间和处理进度</h1>
        <p class="page-hero__desc">当前页面使用后端预约状态接口；如果后端暂无数据，前端会自动回退到示例数据。</p>
      </div>
    </section>

    <el-card class="panel-card">
      <template #header>
        <div class="section-head">
          <h3 class="section-head__title">预约列表</h3>
          <el-segmented v-model="filter" :options="filters" />
        </div>
      </template>
      <div class="booking-list">
        <article v-for="item in filteredBookings" :key="item.id" class="booking-item">
          <div class="booking-item__main">
            <strong>{{ item.serviceName }}</strong>
            <p>{{ item.bookingNo }}</p>
            <div class="booking-item__meta">
              <span>{{ item.location }}</span>
              <span>{{ item.date }}</span>
              <span>{{ item.timeRange }}</span>
            </div>
          </div>
          <el-tag :type="tagMap[item.status]">{{ statusMap[item.status] }}</el-tag>
        </article>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { loadBookingRecords } from '@/services/portal'
import type { BookingRecord } from '@/types'

const filter = ref('all')
const bookings = ref<BookingRecord[]>([])
const filters = [
  { label: '全部', value: 'all' },
  { label: '待审核', value: 'pending' },
  { label: '已通过', value: 'approved' },
  { label: '已取消', value: 'cancelled' },
]

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

const filteredBookings = computed(() => (filter.value === 'all' ? bookings.value : bookings.value.filter((item) => item.status === filter.value)))

onMounted(async () => {
  bookings.value = await loadBookingRecords()
})
</script>

<style scoped lang="scss">
.booking-list {
  display: grid;
  gap: 14px;
}

.booking-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 18px;
  border-radius: 18px;
  border: 1px solid var(--border-soft);
  background: linear-gradient(180deg, #fff, #f8fbff);
}

.booking-item__main {
  min-width: 0;
}

.booking-item__main p {
  margin: 4px 0 8px;
  color: var(--text-tertiary);
  font-size: 12px;
}

.booking-item__meta {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  color: var(--text-secondary);
  font-size: 13px;
}

@media (max-width: 760px) {
  .booking-item {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
