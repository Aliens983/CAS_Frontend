<template>
  <div class="page-shell">
    <section class="page-hero">
      <div>
        <div class="status-pill is-brand">服务治理</div>
        <h1 class="page-hero__title">统一维护服务目录、状态和接入说明</h1>
        <p class="page-hero__desc">这里适合作为后续服务管理接口的承接位，目录概览、治理动作和新增服务入口都已经统一到企业级页面结构里。</p>
      </div>
      <el-button type="primary" size="large" @click="createDrawer = true">新增服务</el-button>
    </section>

    <section class="admin-overview">
      <article class="overview-card" @click="openOverview('all')">
        <span>服务总数</span>
        <strong>{{ services.length }}</strong>
        <small>已纳入统一预约体系</small>
      </article>
      <article class="overview-card" @click="openOverview('available')">
        <span>可用服务</span>
        <strong>{{ availableCount }}</strong>
        <small>当前可直接开放给用户预约</small>
      </article>
      <article class="overview-card" @click="openOverview('maintenance')">
        <span>维护中</span>
        <strong>{{ maintenanceCount }}</strong>
        <small>适合接入暂停开放和公告提醒</small>
      </article>
    </section>

    <el-card class="panel-card">
      <template #header>
        <div class="section-head">
          <h3 class="section-head__title">服务列表</h3>
          <div class="toolbar">
            <el-input v-model="keyword" placeholder="搜索服务名称或分类" clearable />
            <el-select v-model="statusFilter" style="width: 150px">
              <el-option label="全部状态" value="" />
              <el-option label="可用" value="available" />
              <el-option label="维护中" value="maintenance" />
            </el-select>
          </div>
        </div>
      </template>

      <div class="service-stack">
        <article v-for="item in filteredServices" :key="item.id" class="service-item">
          <div class="service-item__cover" :class="item.image">{{ item.code }}</div>
          <div class="service-item__main">
            <div class="service-item__head">
              <div>
                <strong>{{ item.name }}</strong>
                <p>{{ item.category }} / {{ item.location }}</p>
              </div>
              <el-tag :type="item.status === 'available' ? 'success' : 'warning'">{{ item.status === 'available' ? '可用' : '维护中' }}</el-tag>
            </div>
            <div class="service-item__meta">
              <span>{{ item.priceLabel }}</span>
              <span>{{ item.description }}</span>
            </div>
          </div>
          <div class="service-item__action">
            <el-button plain @click="selectedService = item">编辑</el-button>
            <el-button type="primary" @click="openAccess(item)">查看接入</el-button>
          </div>
        </article>
      </div>
    </el-card>

    <el-dialog v-if="overviewVisible" :model-value="true" :title="overviewTitle" width="560px" @close="overviewVisible = false">
      <div class="dialog-list">
        <div v-for="item in overviewItems" :key="item" class="dialog-card">{{ item }}</div>
      </div>
    </el-dialog>

    <el-drawer v-model="serviceDrawerVisible" title="服务编辑" size="460px">
      <template v-if="selectedService">
        <el-form label-position="top">
          <el-form-item label="服务名称"><el-input :model-value="selectedService.name" /></el-form-item>
          <el-form-item label="服务分类"><el-input :model-value="selectedService.category" /></el-form-item>
          <el-form-item label="服务说明"><el-input type="textarea" :rows="5" :model-value="selectedService.description" /></el-form-item>
        </el-form>
        <el-button type="primary" style="width: 100%">保存修改</el-button>
      </template>
    </el-drawer>

    <el-drawer v-model="createDrawer" title="新增服务占位表单" size="480px">
      <el-form label-position="top">
        <el-form-item label="服务名称"><el-input placeholder="后续接创建接口" /></el-form-item>
        <el-form-item label="服务分类"><el-input /></el-form-item>
        <el-form-item label="服务说明"><el-input type="textarea" :rows="5" /></el-form-item>
        <el-form-item label="开放范围"><el-input /></el-form-item>
      </el-form>
      <el-button type="primary" style="width: 100%">保存</el-button>
    </el-drawer>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { fetchServiceCards } from '@/services/campus'
import type { ServiceCard } from '@/types'

const createDrawer = ref(false)
const keyword = ref('')
const statusFilter = ref('')
const overviewVisible = ref(false)
const overviewTitle = ref('')
const overviewItems = ref<string[]>([])
const selectedService = ref<ServiceCard | null>(null)
const services = ref<ServiceCard[]>([])
const loading = ref(false)

const filteredServices = computed(() =>
  services.value.filter((item) => {
    const matchKeyword = !keyword.value || [item.name, item.category, item.location].join('|').toLowerCase().includes(keyword.value.toLowerCase())
    const matchStatus = !statusFilter.value || item.status === statusFilter.value
    return matchKeyword && matchStatus
  }),
)
const availableCount = computed(() => services.value.filter((item) => item.status === 'available').length)
const maintenanceCount = computed(() => services.value.filter((item) => item.status !== 'available').length)
const serviceDrawerVisible = computed({
  get: () => Boolean(selectedService.value),
  set: (value: boolean) => {
    if (!value) selectedService.value = null
  },
})

onMounted(async () => {
  loading.value = true
  try {
    services.value = await fetchServiceCards()
  } catch (error: unknown) {
    const err = error as { message?: string }
    ElMessage.error(err.message || '获取服务列表失败')
  } finally {
    loading.value = false
  }
})

function openOverview(mode: 'all' | 'available' | 'maintenance') {
  const mapping = {
    all: { title: '服务总览', items: services.value.map((item) => `${item.name} / ${item.category}`) },
    available: { title: '可用服务', items: services.value.filter((item) => item.status === 'available').map((item) => item.name) },
    maintenance: { title: '维护中服务', items: services.value.filter((item) => item.status !== 'available').map((item) => item.name) },
  }
  overviewTitle.value = mapping[mode].title
  overviewItems.value = mapping[mode].items
  overviewVisible.value = true
}

function openAccess(item: ServiceCard) {
  overviewTitle.value = `${item.name} 接入说明`
  overviewItems.value = [
    `业务分类：${item.category}`,
    `开放范围：${item.location}`,
    '后续可在这里接服务开关、权限范围和接口联调信息。',
  ]
  overviewVisible.value = true
}
</script>

<style scoped lang="scss">
.admin-overview { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }
.overview-card { position: relative; display: grid; gap: 8px; padding: 22px; border-radius: 22px; background: rgba(255,255,255,.92); border: 1px solid var(--border-soft); box-shadow: var(--shadow-card); overflow: hidden; cursor: pointer; transition: transform .26s ease, box-shadow .26s ease; }
.overview-card::after { content: ''; position: absolute; inset: auto -24px -24px auto; width: 92px; height: 92px; border-radius: 50%; background: radial-gradient(circle, rgba(20,88,212,.08), rgba(20,88,212,0)); pointer-events: none; }
.overview-card:hover { transform: translateY(-6px); box-shadow: var(--shadow-card-hover); }
.overview-card span, .overview-card small { color: var(--text-secondary); }
.overview-card strong { font-size: 34px; }
.toolbar { display: flex; gap: 12px; }
.service-stack, .dialog-list { display: grid; gap: 14px; }
.service-item { display: grid; grid-template-columns: auto 1fr auto; gap: 16px; padding: 18px; border-radius: 20px; border: 1px solid var(--border-soft); background: linear-gradient(180deg, #fff, #f8fbff); transition: transform .24s ease, box-shadow .24s ease, border-color .24s ease; }
.service-item:hover { transform: translateY(-4px); box-shadow: 0 18px 28px rgba(20,33,61,.1); border-color: rgba(20,88,212,.14); }
.service-item__cover { width: 72px; min-height: 72px; display: grid; place-items: center; border-radius: 18px; color: #fff; font-weight: 700; }
.service-item__main { display: grid; gap: 10px; }
.service-item__head { display: flex; justify-content: space-between; gap: 12px; }
.service-item__head p { margin: 4px 0 0; color: var(--text-tertiary); font-size: 12px; }
.service-item__meta { display: grid; gap: 6px; color: var(--text-secondary); font-size: 13px; }
.service-item__action { display: flex; align-items: center; gap: 10px; }
.dialog-card { padding: 16px; border-radius: 18px; background: linear-gradient(180deg, #fff, #f8fbff); border: 1px solid var(--border-soft); }
@media (max-width: 960px) { .admin-overview { grid-template-columns: 1fr; } .toolbar, .service-item, .service-item__head, .service-item__action { display: flex; flex-direction: column; align-items: stretch; } }
</style>
