<template>
  <div class="page-shell">
    <section class="page-hero">
      <el-button text @click="router.back()">← 返回</el-button>
      <h1 class="page-hero__title">预约详情</h1>
    </section>
    <el-card class="panel-card" v-if="booking">
      <div class="detail-grid">
        <div class="detail-row"><span>预约编号</span><strong>{{ booking.bookingNo }}</strong></div>
        <div class="detail-row"><span>服务名称</span><strong>{{ booking.serviceName }}</strong></div>
        <div class="detail-row"><span>预约日期</span><strong>{{ booking.date }}</strong></div>
        <div class="detail-row"><span>时段</span><strong>{{ booking.timeRange }}</strong></div>
        <div class="detail-row"><span>地点</span><strong>{{ booking.location }}</strong></div>
        <div class="detail-row"><span>申请人</span><strong>{{ booking.applicant }}</strong></div>
        <div class="detail-row"><span>部门</span><strong>{{ booking.department }}</strong></div>
        <div class="detail-row"><span>状态</span><el-tag :type="statusTag(booking.status)">{{ statusText(booking.status) }}</el-tag></div>
        <div class="detail-row"><span>备注</span><strong>{{ booking.remarks }}</strong></div>
        <div class="detail-row"><span>创建时间</span><strong>{{ booking.createdAt }}</strong></div>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import { fetchBookingRecords } from '@/common/campus'
import type { BookingRecord, BookingStatus } from '@/common/types'

const router = useRouter()
const route = useRoute()
const booking = ref<BookingRecord | null>(null)

onMounted(async () => {
  const id = Number(route.params.id)
  try {
    const records = await fetchBookingRecords()
    booking.value = records.find(r => r.id === id) || null
    if (!booking.value) ElMessage.warning('未找到该预约记录')
  } catch (error: unknown) {
    const err = error as { message?: string }
    ElMessage.error(err.message || '获取预约详情失败')
  }
})

function statusTag(status: BookingStatus) {
  return { pending: 'warning', approved: 'success', rejected: 'danger', completed: 'info', cancelled: 'info' }[status]
}
function statusText(status: BookingStatus) {
  return { pending: '待审核', approved: '已通过', rejected: '已驳回', completed: '已完成', cancelled: '已取消' }[status]
}
</script>

<style scoped lang="scss">
.detail-grid { display: grid; gap: 16px; }
.detail-row { display: flex; gap: 16px; padding: 12px 0; border-bottom: 1px solid var(--border-soft); }
.detail-row span { width: 100px; color: var(--text-secondary); flex-shrink: 0; }
.detail-row strong { flex: 1; }
</style>