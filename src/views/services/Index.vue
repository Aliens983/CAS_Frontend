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
        <strong>4</strong>
        <small>会议室、设备、咨询、打印</small>
      </article>
    </section>

    <section class="resource-grid">
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
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { services } from '@/mock/campus-data'

const router = useRouter()
const keyword = ref('')
const status = ref('')

const filteredServices = computed(() =>
  services.filter((item) => {
    const searchTarget = [item.name, item.category, item.description, ...item.tags].join('|')
    const matchKeyword = !keyword.value || searchTarget.toLowerCase().includes(keyword.value.toLowerCase())
    const matchStatus = !status.value || item.status === status.value
    return matchKeyword && matchStatus
  }),
)

const availableCount = computed(() => services.filter((item) => item.status === 'available').length)

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
.hero-actions {
  display: grid;
  gap: 12px;
  width: min(320px, 100%);
}

.service-overview {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
}

.overview-card {
  position: relative;
  display: grid;
  gap: 8px;
  padding: 22px;
  border-radius: 22px;
  background: rgba(255, 255, 255, 0.92);
  border: 1px solid var(--border-soft);
  box-shadow: var(--shadow-card);
  overflow: hidden;
  transition: transform 0.26s ease, box-shadow 0.26s ease;
}

.overview-card::after {
  content: '';
  position: absolute;
  inset: auto -22px -22px auto;
  width: 88px;
  height: 88px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(20, 88, 212, 0.08), rgba(20, 88, 212, 0));
}

.overview-card:hover {
  transform: translateY(-6px);
  box-shadow: var(--shadow-card-hover);
}

.overview-card span,
.overview-card small {
  color: var(--text-secondary);
}

.overview-card strong {
  font-size: 34px;
}

.resource-card__pulse {
  position: absolute;
  top: -24px;
  right: -24px;
  width: 88px;
  height: 88px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(20, 88, 212, 0.12), rgba(20, 88, 212, 0));
  animation: servicePulse 5.8s ease-in-out infinite;
}

.tag-wrap {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.button-row {
  display: flex;
  gap: 10px;
}

@keyframes servicePulse {
  0%,
  100% {
    transform: scale(1);
    opacity: 0.7;
  }
  50% {
    transform: scale(1.16);
    opacity: 1;
  }
}

@media (max-width: 900px) {
  .service-overview {
    grid-template-columns: 1fr;
  }
}
</style>
