<template>
  <div class="page-shell">
    <section class="page-hero">
      <div>
        <div class="status-pill is-brand">服务中心</div>
        <h1 class="page-hero__title">按业务域组织的校园预约服务目录</h1>
        <p class="page-hero__desc">
          保留 CAS 的业务分类方式，同时以更接近企业门户的形式展示服务状态、适用范围和接入能力。
        </p>
      </div>
      <div class="hero-actions">
        <el-input v-model="keyword" placeholder="搜索服务、类型或标签" clearable />
        <el-select v-model="status">
          <el-option label="全部状态" value="" />
          <el-option label="可预约" value="available" />
          <el-option label="维护中" value="maintenance" />
        </el-select>
      </div>
    </section>

    <section class="service-overview">
      <article class="overview-card">
        <span>目录规模</span>
        <strong>{{ services.length }}</strong>
        <small>已纳入统一预约门户</small>
      </article>
      <article class="overview-card">
        <span>可用服务</span>
        <strong>{{ availableCount }}</strong>
        <small>支持直接发起申请</small>
      </article>
      <article class="overview-card">
        <span>能力整合</span>
        <strong>{{ categoryCount }}</strong>
        <small>会议室、设备、咨询、打印</small>
      </article>
    </section>

    <section v-if="loading" class="loading-state">
      <el-icon class="is-loading"><Loading /></el-icon>
      <span>加载中...</span>
    </section>
    <section v-else class="resource-grid">
      <article v-for="item in filteredServices" :key="item.id" class="resource-card">
        <div class="resource-card__pulse" />
        <div class="cover-badge" :class="item.image">{{ item.code }}</div>
        <div class="section-head" style="margin-bottom: 8px;">
          <h3 class="section-head__title">{{ item.name }}</h3>
          <el-tag :type="item.status === 'available' ? 'success' : 'warning'">
            {{ item.status === 'available' ? '可预约' : '维护中' }}
          </el-tag>
        </div>
        <p class="muted">{{ item.description }}</p>
        <div class="tag-wrap">
          <el-tag v-for="tag in item.tags" :key="tag" round>{{ tag }}</el-tag>
        </div>
        <div class="info-list">
          <div class="info-row"><span>业务类别</span><strong>{{ item.category }}</strong></div>
          <div class="info-row"><span>服务范围</span><strong>{{ item.location }}</strong></div>
          <div class="info-row"><span>说明</span><strong>{{ item.priceLabel }}</strong></div>
        </div>
        <div class="button-row">
          <el-button plain @click="router.push(`/service/${item.id}`)">查看详情</el-button>
          <el-button type="primary" @click="goService(item.id, item.type)">进入服务</el-button>
        </div>
      </article>
    </section>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { fetchServiceCards } from '@/common/campus'
import type { ServiceCard } from '@/common/types'

const router = useRouter()
const keyword = ref('')
const status = ref('')
const services = ref<ServiceCard[]>([])
const loading = ref(false)

const filteredServices = computed(() =>
  services.value.filter((item) => {
    const searchTarget = [item.name, item.category, item.description, ...item.tags].join('|')
    const matchKeyword = !keyword.value || searchTarget.toLowerCase().includes(keyword.value.toLowerCase())
    const matchStatus = !status.value || item.status === status.value
    return matchKeyword && matchStatus
  }),
)

const availableCount = computed(() => services.value.filter((item) => item.status === 'available').length)
const categoryCount = computed(() => new Set(services.value.map(item => item.type)).size)

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

function goService(id: number, type: string) {
  const pathMap: Record<string, string> = {
    room: '/rooms',
    equipment: '/equipment',
    consultation: '/consultation',
    printing: `/service/${id}`,
  }
  router.push(pathMap[type] || `/service/${id}`)
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

.hero-actions {
  display: grid;
  grid-template-columns: 1fr 180px;
  gap: 12px;
}

.service-overview {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
}

.resource-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
  gap: 20px;
}

.resource-card {
  position: relative;
  padding: 22px;
  border-radius: 22px;
  background: rgba(255,255,255,.92);
  border: 1px solid var(--border-soft);
  box-shadow: var(--shadow-card);
}

.resource-card__pulse {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  border-radius: 22px 22px 0 0;
  background: linear-gradient(90deg, #667eea, #764ba2);
}
</style>