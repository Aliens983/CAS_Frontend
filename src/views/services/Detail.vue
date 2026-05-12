<template>
  <div class="page-shell" v-if="service">
    <section class="page-hero">
      <div>
        <div class="status-pill is-brand">{{ service.code }}</div>
        <h1 class="page-hero__title">{{ service.name }}</h1>
        <p class="page-hero__desc">{{ service.description }}</p>
      </div>
      <div class="hero-summary">
        <div><span>业务分类</span><strong>{{ service.category }}</strong></div>
        <div><span>覆盖区域</span><strong>{{ service.location }}</strong></div>
        <div><span>使用说明</span><strong>{{ service.priceLabel }}</strong></div>
      </div>
    </section>

    <section class="grid-cards">
      <el-card class="panel-card span-8">
        <template #header><div class="section-head"><h3 class="section-head__title">模块能力说明</h3></div></template>
        <el-timeline>
          <el-timeline-item v-for="step in moduleSteps" :key="step.title" :timestamp="step.phase" placement="top">
            <strong>{{ step.title }}</strong>
            <p class="muted">{{ step.desc }}</p>
          </el-timeline-item>
        </el-timeline>
      </el-card>

      <el-card class="panel-card span-4">
        <template #header><div class="section-head"><h3 class="section-head__title">当前交付说明</h3></div></template>
        <div class="info-list">
          <div class="info-row"><span>前端状态</span><strong>页面与交互已补齐</strong></div>
          <div class="info-row"><span>接口状态</span><strong>支持后续替换</strong></div>
          <div class="info-row"><span>审批能力</span><strong>已预留后台位</strong></div>
          <div class="info-row"><span>适合后续</span><strong>接口联调 / 权限串接</strong></div>
        </div>
        <el-divider />
        <div class="tag-wrap">
          <el-tag v-for="tag in service.tags" :key="tag" round>{{ tag }}</el-tag>
        </div>
        <div class="button-group">
          <el-button type="primary" class="go-btn" @click="jumpToModule">进入业务页</el-button>
          <el-button plain class="go-btn" @click="showRelatedResources">查看相关资源</el-button>
        </div>
      </el-card>
    </section>

    <el-dialog v-model="relatedVisible" title="相关资源" width="620px">
      <div class="dialog-list">
        <div v-for="item in relatedItems" :key="item.title" class="dialog-card">
          <strong>{{ item.title }}</strong>
          <p>{{ item.desc }}</p>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { consultants, equipments, rooms, services } from '@/mock/campus-data'

const route = useRoute()
const router = useRouter()
const relatedVisible = ref(false)
const service = computed(() => services.find((item) => item.id === Number(route.params.id)))

const moduleSteps = [
  { phase: '01', title: '服务展示', desc: '面向用户展示资源、能力、状态和规则。' },
  { phase: '02', title: '预约发起', desc: '支持提交时间、用途、联系方式等表单数据。' },
  { phase: '03', title: '审批处理', desc: '后台统一处理待审申请，便于接后端工作流。' },
  { phase: '04', title: '消息回流', desc: '审批结果、系统提醒和通知消息统一回流消息中心。' },
]

const relatedItems = computed(() => {
  if (!service.value) return []
  if (service.value.type === 'room') {
    return rooms.map((item) => ({ title: item.name, desc: `${item.building} ${item.floor} / ${item.capacity} 人` }))
  }
  if (service.value.type === 'equipment') {
    return equipments.map((item) => ({ title: item.name, desc: `${item.location} / 可借 ${item.availableStock} ${item.unit}` }))
  }
  if (service.value.type === 'consultation') {
    return consultants.map((item) => ({ title: item.name, desc: `${item.title} / ${item.nextSlot}` }))
  }
  return [{ title: '图文中心', desc: '后续可接打印任务、装订和取件节点。' }]
})

function jumpToModule() {
  if (!service.value) return
  const pathMap: Record<string, string> = {
    room: '/rooms',
    equipment: '/equipment',
    consultation: '/consultation',
    printing: '/services',
  }
  router.push(pathMap[service.value.type] || '/services')
}

function showRelatedResources() {
  relatedVisible.value = true
}
</script>

<style scoped lang="scss">
.hero-summary { display: grid; gap: 12px; min-width: 280px; }
.hero-summary div { display: grid; gap: 6px; padding: 16px 18px; border-radius: 18px; background: rgba(255,255,255,.12); transition: transform .24s ease, background-color .24s ease; }
.hero-summary div:hover { transform: translateY(-3px); background: rgba(255,255,255,.18); }
.hero-summary span { color: rgba(255,255,255,.72); font-size: 12px; }
.span-8 { grid-column: span 8; }
.span-4 { grid-column: span 4; }
.tag-wrap { display: flex; flex-wrap: wrap; gap: 8px; }
.button-group { display: grid; gap: 12px; margin-top: 18px; }
.go-btn { width: 100%; }
.dialog-list { display: grid; gap: 12px; }
.dialog-card { padding: 16px; border-radius: 18px; background: linear-gradient(180deg, #fff, #f8fbff); border: 1px solid var(--border-soft); }
.dialog-card p { margin: 6px 0; color: var(--text-secondary); }
@media (max-width: 1200px) { .span-8, .span-4 { grid-column: span 12; } }
</style>
