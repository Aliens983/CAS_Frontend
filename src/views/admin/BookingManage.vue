<template>
  <div class="page-shell">
    <section class="page-hero page-hero--single">
      <div class="page-hero__main">
        <span class="page-hero__chip">预约审核</span>
        <h1 class="page-hero__title">预约申请审批管理</h1>
        <p class="page-hero__desc">集中处理待审核的预约申请，支持逐条审批、状态筛选与审核意见反馈。</p>
      </div>
    </section>

    <section class="admin-overview">
      <article class="overview-card" @click="openOverview('all')">
        <span>全部申请</span>
        <strong>{{ bookings.length }}</strong>
        <small>统一接入各类预约业务</small>
      </article>
      <article class="overview-card" @click="openOverview('pending')">
        <span>待审核</span>
        <strong>{{ pendingCount }}</strong>
        <small>建议优先处理临近时段申请</small>
      </article>
      <article class="overview-card" @click="openOverview('approved')">
        <span>已通过</span>
        <strong>{{ approvedCount }}</strong>
        <small>可继续扩展通知与落地回执</small>
      </article>
    </section>

    <el-card class="panel-card">
      <template #header>
        <div class="section-head">
          <h3 class="section-head__title">审核队列</h3>
          <el-segmented v-model="filter" :options="filters" />
        </div>
      </template>

      <div class="booking-stack">
        <article v-for="item in filteredBookings" :key="item.id" class="booking-item" @click="openBookingDrawer(item)">
          <div class="booking-item__main">
            <div class="booking-item__head">
              <div>
                <strong>{{ item.serviceName }}</strong>
                <p>{{ item.bookingNo }} / {{ item.applicant }} / {{ item.department }}</p>
              </div>
              <el-tag :type="statusTag(item.status)">{{ statusText(item.status) }}</el-tag>
            </div>
            <div class="booking-item__meta">
              <span>{{ item.location }}</span>
              <span>{{ item.date }}</span>
              <span>{{ item.timeRange }}</span>
            </div>
          </div>
          <div class="booking-item__action">
            <el-button size="small" type="success" :disabled="item.status !== 'pending'" @click.stop="handleAudit('通过', item)">通过</el-button>
            <el-button size="small" type="danger" :disabled="item.status !== 'pending'" @click.stop="handleAudit('驳回', item)">驳回</el-button>
          </div>
        </article>
      </div>
    </el-card>

    <el-dialog v-if="overviewVisible" :model-value="true" :title="overviewTitle" width="560px" @close="overviewVisible = false">
      <div class="dialog-list">
        <div v-for="item in overviewItems" :key="item" class="dialog-card">{{ item }}</div>
      </div>
    </el-dialog>

    <el-dialog v-if="auditDialogVisible" :model-value="true" :title="auditDialogTitle" width="460px" @close="closeAuditDialog">
      <el-input v-model="auditReason" type="textarea" :rows="4" :placeholder="auditAction === '驳回' ? '请输入驳回原因（必填）' : '请输入审核意见（选填）'" />
      <template #footer>
        <el-button @click="closeAuditDialog">取消</el-button>
        <el-button :type="auditAction === '通过' ? 'success' : 'danger'" :loading="auditing" @click="confirmAudit">
          确认{{ auditAction }}
        </el-button>
      </template>
    </el-dialog>

    <el-drawer v-if="bookingDrawerVisible" :model-value="true" title="审核详情" size="460px" @close="closeBookingDrawer">
      <template v-if="selectedBooking">
        <div class="drawer-stack">
          <div class="info-list">
            <div class="info-row"><span>编号</span><strong>{{ selectedBooking.bookingNo }}</strong></div>
            <div class="info-row"><span>申请人</span><strong>{{ selectedBooking.applicant }}</strong></div>
            <div class="info-row"><span>部门</span><strong>{{ selectedBooking.department }}</strong></div>
            <div class="info-row"><span>预约时间</span><strong>{{ selectedBooking.date }} {{ selectedBooking.timeRange }}</strong></div>
            <div class="info-row"><span>用途说明</span><strong>{{ selectedBooking.remarks || '暂无' }}</strong></div>
          </div>
          <el-input v-model="auditReason" type="textarea" :rows="4" :placeholder="'请输入审核意见（驳回时必填）'" />
          <div class="button-row">
            <el-button type="success" :loading="auditing" @click="handleAudit('通过')">通过</el-button>
            <el-button type="danger" :loading="auditing" @click="handleAudit('驳回')">驳回</el-button>
          </div>
        </div>
      </template>
    </el-drawer>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import request from '@/utils/request'
import type { BookingStatus } from '@/types'

interface AdminBooking {
  orderId: number
  userId: number
  username: string
  serviceName: string
  serviceDescribe: string
  createTime: string
  updateTime: string
  manageStatus: number
  statusDescription?: string
  reason?: string
}

interface BookingItem {
  id: number
  bookingNo: string
  serviceName: string
  applicant: string
  department: string
  location: string
  date: string
  timeRange: string
  status: BookingStatus
  createdAt: string
  remarks?: string
}

const filter = ref('all')
const overviewVisible = ref(false)
const overviewTitle = ref('')
const overviewItems = ref<string[]>([])
const selectedBooking = ref<BookingItem | null>(null)
const bookings = ref<BookingItem[]>([])
const loading = ref(false)
const auditing = ref(false)
const auditDialogVisible = ref(false)
const auditDialogTitle = ref('')
const auditAction = ref<'通过' | '驳回'>('通过')
const auditReason = ref('')
const auditTarget = ref<BookingItem | null>(null)

const filters = [
  { label: '全部', value: 'all' },
  { label: '待审核', value: 'pending' },
  { label: '已通过', value: 'approved' },
  { label: '已驳回', value: 'rejected' },
]

function mapAdminBooking(item: AdminBooking): BookingItem {
  const statusMap: Record<number, BookingStatus> = { 0: 'pending', 1: 'approved', 2: 'rejected', 3: 'cancelled' }
  const dateTime = String(item.createTime || '').replace('T', ' ')
  return {
    id: item.orderId,
    bookingNo: `BOOK-${String(item.orderId).padStart(6, '0')}`,
    serviceName: item.serviceName || '未命名服务',
    applicant: item.username || '未知用户',
    department: '校园统一预约中心',
    location: item.serviceDescribe || '',
    date: dateTime.slice(0, 10) || '待定',
    timeRange: dateTime.slice(11, 16) || '待分配时段',
    status: statusMap[item.manageStatus] || 'pending',
    createdAt: dateTime || '待定',
    remarks: item.reason || item.statusDescription || '',
  }
}

async function loadBookings() {
  loading.value = true
  try {
    const data = await request.get('/admin/bookings') as { records?: AdminBooking[] } | AdminBooking[]
    const list = Array.isArray(data) ? data : data?.records
    if (!Array.isArray(list)) {
      throw new Error('获取预约记录失败')
    }
    bookings.value = list.map(mapAdminBooking)
  } catch (error: unknown) {
    const err = error as { message?: string }
    ElMessage.error(err.message || '获取预约记录失败')
  } finally {
    loading.value = false
  }
}

const filteredBookings = computed(() =>
  filter.value === 'all' ? bookings.value : bookings.value.filter((item) => item.status === filter.value)
)
const pendingCount = computed(() => bookings.value.filter((item) => item.status === 'pending').length)
const approvedCount = computed(() => bookings.value.filter((item) => item.status === 'approved').length)
const bookingDrawerVisible = ref(false)

function openBookingDrawer(item: BookingItem) {
  selectedBooking.value = item
  bookingDrawerVisible.value = true
}

function closeBookingDrawer() {
  bookingDrawerVisible.value = false
  selectedBooking.value = null
  auditReason.value = ''
}

function closeAuditDialog() {
  auditDialogVisible.value = false
  auditReason.value = ''
  auditTarget.value = null
}

onMounted(() => {
  void loadBookings()
})

function openOverview(mode: 'all' | 'pending' | 'approved') {
  const mapping = {
    all: { title: '全部申请', items: bookings.value.map((item) => `${item.bookingNo} / ${item.serviceName}`) },
    pending: { title: '待审核申请', items: bookings.value.filter((item) => item.status === 'pending').map((item) => `${item.bookingNo} / ${item.applicant}`) },
    approved: { title: '已通过申请', items: bookings.value.filter((item) => item.status === 'approved').map((item) => `${item.bookingNo} / ${item.serviceName}`) },
  }
  overviewTitle.value = mapping[mode].title
  overviewItems.value = mapping[mode].items
  overviewVisible.value = true
}

function handleAudit(action: '通过' | '驳回', item?: BookingItem) {
  const target = item || selectedBooking.value
  if (!target) return
  // 从列表按钮直接点击时，先关闭抽屉防止 dialog 关闭后抽屉闪现
  if (item) {
    closeBookingDrawer()
  }
  auditAction.value = action
  auditTarget.value = target
  auditReason.value = ''
  auditDialogTitle.value = `${action}预约 — ${target.bookingNo}`
  auditDialogVisible.value = true
}

async function confirmAudit() {
  const target = auditTarget.value
  if (!target) return

  if (auditAction.value === '驳回' && !auditReason.value.trim()) {
    ElMessage.warning('驳回时必须填写原因')
    return
  }

  auditing.value = true
  try {
    const isApproved = auditAction.value === '通过'
    const path = isApproved
      ? `/admin/bookings/${target.id}/approve`
      : `/admin/bookings/${target.id}/reject`
    await request.patch(path, {
      orderId: target.id,
      status: isApproved ? 1 : 2,
      reason: auditReason.value.trim() || '',
    })
    ElMessage.success(`审核${auditAction.value}成功`)
    // 先关闭弹层，再更新本地数据
    closeBookingDrawer()
    closeAuditDialog()
    // 本地更新状态，避免全量刷新导致闪烁
    const idx = bookings.value.findIndex(b => b.id === target.id)
    if (idx !== -1) {
      bookings.value[idx] = {
        ...bookings.value[idx],
        status: isApproved ? 'approved' : 'rejected',
      }
    }
  } catch (error: unknown) {
    const err = error as { message?: string }
    ElMessage.error(err.message || `审核${auditAction.value}失败`)
  } finally {
    auditing.value = false
  }
}

function statusTag(status: BookingStatus) {
  return { pending: 'warning', approved: 'success', rejected: 'danger', completed: 'info', cancelled: 'info' }[status]
}

function statusText(status: BookingStatus) {
  return { pending: '待审核', approved: '已通过', rejected: '已驳回', completed: '已完成', cancelled: '已取消' }[status]
}
</script>

<style scoped lang="scss">
.admin-overview { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }
.overview-card { position: relative; display: grid; gap: 8px; padding: 22px; border-radius: 22px; background: rgba(255,255,255,.92); border: 1px solid var(--border-soft); box-shadow: var(--shadow-card); overflow: hidden; cursor: pointer; transition: transform .26s ease, box-shadow .26s ease; }
.overview-card::after { content: ''; position: absolute; inset: auto -24px -24px auto; width: 92px; height: 92px; border-radius: 50%; background: radial-gradient(circle, rgba(20,88,212,.08), rgba(20,88,212,0)); pointer-events: none; }
.overview-card:hover { transform: translateY(-6px); box-shadow: var(--shadow-card-hover); }
.overview-card span, .overview-card small { color: var(--text-secondary); }
.overview-card strong { font-size: 34px; }
.booking-stack, .dialog-list, .drawer-stack { display: grid; gap: 14px; }
.booking-item { display: flex; align-items: center; justify-content: space-between; gap: 16px; padding: 18px 20px; border-radius: 20px; border: 1px solid var(--border-soft); background: linear-gradient(180deg, #fff, #f8fbff); cursor: pointer; transition: transform .24s ease, box-shadow .24s ease, border-color .24s ease; }
.booking-item:hover { transform: translateY(-4px); box-shadow: 0 18px 28px rgba(20,33,61,.1); border-color: rgba(20,88,212,.14); }
.booking-item__main { flex: 1; display: grid; gap: 10px; }
.booking-item__head { display: flex; justify-content: space-between; gap: 12px; }
.booking-item__head p { margin: 4px 0 0; color: var(--text-tertiary); font-size: 12px; }
.booking-item__meta { display: flex; flex-wrap: wrap; gap: 12px; color: var(--text-secondary); font-size: 13px; }
.booking-item__action, .button-row { display: flex; gap: 10px; }
.dialog-card { padding: 16px; border-radius: 18px; background: linear-gradient(180deg, #fff, #f8fbff); border: 1px solid var(--border-soft); }
@media (max-width: 960px) { .admin-overview { grid-template-columns: 1fr; } .booking-item, .booking-item__head, .booking-item__action, .button-row { flex-direction: column; align-items: stretch; } }
</style>
