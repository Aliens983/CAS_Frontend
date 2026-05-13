<template>
  <div class="page-shell">
    <section class="page-hero">
      <div>
        <div class="status-pill is-brand">我的预约</div>
        <h1 class="page-hero__title">统一查看个人预约状态、时间与审批进展</h1>
        <p class="page-hero__desc">保留预约总览能力，但交互升级为门户式个人中心体验，后续接入接口时只需要替换数据源。</p>
      </div>
    </section>

    <section class="booking-overview">
      <article class="overview-card" @click="openOverview('all')">
        <span>全部预约</span>
        <strong>{{ bookings.length }}</strong>
        <small>包含会议室、设备和咨询服务</small>
      </article>
      <article class="overview-card" @click="openOverview('pending')">
        <span>待审核</span>
        <strong>{{ pendingCount }}</strong>
        <small>建议优先关注近期时段申请</small>
      </article>
      <article class="overview-card" @click="openOverview('completed')">
        <span>已完成</span>
        <strong>{{ completedCount }}</strong>
        <small>历史记录可继续扩展为归档列表</small>
      </article>
    </section>

    <el-card class="panel-card">
      <template #header>
        <div class="section-head">
          <h3 class="section-head__title">预约列表</h3>
          <div class="header-actions">
            <el-segmented v-model="filter" :options="filters" />
            <el-button plain @click="quickVisible = true">快速操作</el-button>
          </div>
        </div>
      </template>

      <div v-if="loading" class="loading-state">
        <el-icon class="is-loading"><Loading /></el-icon>
        <span>加载中...</span>
      </div>
      <div v-else class="booking-stack">
        <article v-for="item in filteredBookings" :key="item.id" class="booking-item" @click="router.push(`/bookings/${item.id}`)">
          <div class="booking-item__glow" />
          <div class="booking-item__main">
            <div class="booking-item__head">
              <div>
                <strong>{{ item.serviceName }}</strong>
                <p>{{ item.bookingNo }}</p>
              </div>
              <el-tag :type="statusTag(item.status)">{{ statusText(item.status) }}</el-tag>
            </div>
            <div class="booking-item__meta">
              <span>{{ item.location }}</span>
              <span>{{ item.date }}</span>
              <span>{{ item.timeRange }}</span>
            </div>
          </div>
          <div class="booking-item__arrow">查看详情</div>
        </article>
        <div v-if="filteredBookings.length === 0" class="empty-state">
          <span>暂无预约记录</span>
        </div>
      </div>
    </el-card>

    <el-dialog v-model="overviewVisible" :title="overviewTitle" width="560px">
      <div class="dialog-list">
        <div v-for="item in overviewItems" :key="item" class="dialog-card">{{ item }}</div>
      </div>
    </el-dialog>

    <el-drawer v-model="quickVisible" title="预约快捷操作" size="420px">
      <div class="drawer-stack">
        <el-button type="primary" @click="router.push('/rooms')">发起会议室预约</el-button>
        <el-button plain @click="router.push('/equipment')">查看设备借用</el-button>
        <el-button plain @click="router.push('/consultation')">查看咨询排班</el-button>
        <el-button plain @click="router.push('/messages')">查看审批消息</el-button>
      </div>
    </el-drawer>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { fetchBookingRecords } from '@/common/campus'
import type { BookingRecord, BookingStatus } from '@/common/types'

const router = useRouter()
const filter = ref('all')
const quickVisible = ref(false)
const overviewVisible = ref(false)
const overviewTitle = ref('')
const overviewItems = ref<string[]>([])
const bookings = ref<BookingRecord[]>([])
const loading = ref(false)
const filters = [
  { label: '全部', value: 'all' },
  { label: '待审核', value: 'pending' },
  { label: '已通过', value: 'approved' },
  { label: '已完成', value: 'completed' },
]

const filteredBookings = computed(() => (filter.value === 'all' ? bookings.value : bookings.value.filter((item) => item.status === filter.value)))
const pendingCount = computed(() => bookings.value.filter((item) => item.status === 'pending').length)
const completedCount = computed(() => bookings.value.filter((item) => item.status === 'completed').length)

onMounted(async () => {
  loading.value = true
  try {
    bookings.value = await fetchBookingRecords()
  } catch (error: unknown) {
    const err = error as { message?: string }
    ElMessage.error(err.message || '获取预约记录失败')
  } finally {
    loading.value = false
  }
})

function openOverview(mode: 'all' | 'pending' | 'completed') {
  const mapping = {
    all: { title: '全部预约', items: bookings.value.map((item) => `${item.serviceName} / ${item.date} ${item.timeRange}`) },
    pending: { title: '待审核预约', items: bookings.value.filter((item) => item.status === 'pending').map((item) => `${item.bookingNo} / ${item.serviceName}`) },
    completed: { title: '已完成预约', items: bookings.value.filter((item) => item.status === 'completed').map((item) => `${item.bookingNo} / ${item.serviceName}`) },
  }
  overviewTitle.value = mapping[mode].title
  overviewItems.value = mapping[mode].items
  overviewVisible.value = true
}

function statusTag(status: BookingStatus) {
  return { pending: 'warning', approved: 'success', rejected: 'danger', completed: 'info', cancelled: 'info' }[status]
}

function statusText(status: BookingStatus) {
  return { pending: '待审核', approved: '已通过', rejected: '已驳回', completed: '已完成', cancelled: '已取消' }[status]
}
</script>

<style scoped lang="scss">
.loading-state {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 40px;
  color: var(--text-secondary);
}

.empty-state {
  text-align: center;
  padding: 40px;
  color: var(--text-secondary);
}

.header-actions {
  display: flex;
  gap: 12px;
  align-items: center;
}
</style>