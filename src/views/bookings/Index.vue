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

      <div class="booking-stack">
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
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { bookings } from '@/mock/campus-data'
import type { BookingStatus } from '@/types'

const router = useRouter()
const filter = ref('all')
const quickVisible = ref(false)
const overviewVisible = ref(false)
const overviewTitle = ref('')
const overviewItems = ref<string[]>([])
const filters = [
  { label: '全部', value: 'all' },
  { label: '待审核', value: 'pending' },
  { label: '已通过', value: 'approved' },
  { label: '已完成', value: 'completed' },
]

const filteredBookings = computed(() => (filter.value === 'all' ? bookings : bookings.filter((item) => item.status === filter.value)))
const pendingCount = computed(() => bookings.filter((item) => item.status === 'pending').length)
const completedCount = computed(() => bookings.filter((item) => item.status === 'completed').length)

function openOverview(mode: 'all' | 'pending' | 'completed') {
  const mapping = {
    all: { title: '全部预约', items: bookings.map((item) => `${item.serviceName} / ${item.date} ${item.timeRange}`) },
    pending: { title: '待审核预约', items: bookings.filter((item) => item.status === 'pending').map((item) => `${item.bookingNo} / ${item.serviceName}`) },
    completed: { title: '已完成预约', items: bookings.filter((item) => item.status === 'completed').map((item) => `${item.bookingNo} / ${item.serviceName}`) },
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
.booking-overview { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }
.overview-card { position: relative; display: grid; gap: 8px; padding: 22px; border-radius: 22px; background: rgba(255,255,255,.92); border: 1px solid var(--border-soft); box-shadow: var(--shadow-card); overflow: hidden; cursor: pointer; transition: transform .26s ease, box-shadow .26s ease; }
.overview-card::after { content: ''; position: absolute; inset: auto -24px -24px auto; width: 92px; height: 92px; border-radius: 50%; background: radial-gradient(circle, rgba(20,88,212,.08), rgba(20,88,212,0)); }
.overview-card:hover { transform: translateY(-6px); box-shadow: var(--shadow-card-hover); }
.overview-card span, .overview-card small { color: var(--text-secondary); }
.overview-card strong { font-size: 34px; }
.header-actions { display: flex; gap: 12px; align-items: center; }
.booking-stack { display: grid; gap: 14px; }
.booking-item { position: relative; display: flex; align-items: center; justify-content: space-between; gap: 16px; padding: 18px 20px; border-radius: 20px; border: 1px solid var(--border-soft); background: linear-gradient(180deg, #fff, #f8fbff); cursor: pointer; overflow: hidden; transition: transform .24s ease, box-shadow .24s ease, border-color .24s ease; }
.booking-item:hover { transform: translateY(-4px); box-shadow: 0 18px 28px rgba(20,33,61,.1); border-color: rgba(20,88,212,.14); }
.booking-item__glow { position: absolute; top: -28px; right: -28px; width: 96px; height: 96px; border-radius: 50%; background: radial-gradient(circle, rgba(20,88,212,.1), rgba(20,88,212,0)); transition: transform .28s ease; }
.booking-item:hover .booking-item__glow { transform: scale(1.2); }
.booking-item__main, .booking-item__arrow { position: relative; z-index: 1; }
.booking-item__main { flex: 1; }
.booking-item__head { display: flex; align-items: center; justify-content: space-between; gap: 12px; margin-bottom: 8px; }
.booking-item__head p { margin: 4px 0 0; color: var(--text-tertiary); font-size: 12px; }
.booking-item__meta { display: flex; flex-wrap: wrap; gap: 12px; color: var(--text-secondary); font-size: 13px; }
.booking-item__arrow { color: var(--brand-500); font-size: 13px; font-weight: 600; }
.dialog-list, .drawer-stack { display: grid; gap: 12px; }
.dialog-card { padding: 16px; border-radius: 18px; background: linear-gradient(180deg, #fff, #f8fbff); border: 1px solid var(--border-soft); }
@media (max-width: 900px) { .booking-overview { grid-template-columns: 1fr; } .booking-item, .booking-item__head, .header-actions { flex-direction: column; align-items: flex-start; } }
</style>