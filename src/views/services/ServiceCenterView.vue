<template>
  <div class="page-shell">
    <section class="page-hero">
      <div>
        <div class="status-pill is-brand">服务中心</div>
        <h1 class="page-hero__title">按业务类型集中展示已开放的预约服务</h1>
        <p class="page-hero__desc">优先接入后端已有服务接口，保留搜索与筛选，减少页面跳转时的空白等待。</p>
      </div>
      <div class="hero-search">
        <el-input v-model="keyword" placeholder="搜索服务名称或描述" clearable />
      </div>
    </section>

    <section class="resource-grid">
      <article v-for="item in filteredServices" :key="item.id" class="resource-card">
        <div class="cover-badge" :class="item.image">{{ item.code }}</div>
        <div class="section-head" style="margin-bottom: 0;">
          <h3 class="section-head__title">{{ item.name }}</h3>
          <el-tag :type="item.status === 'available' ? 'success' : 'warning'">
            {{ item.status === 'available' ? '可申请' : '维护中' }}
          </el-tag>
        </div>
        <p class="muted">{{ item.description }}</p>
        <div class="tag-wrap">
          <el-tag v-for="tag in item.tags" :key="tag" round>{{ tag }}</el-tag>
        </div>
        <div class="info-list">
          <div class="info-row"><span>分类</span><strong>{{ item.category }}</strong></div>
          <div class="info-row"><span>入口</span><strong>{{ item.location }}</strong></div>
          <div class="info-row"><span>状态</span><strong>{{ item.priceLabel }}</strong></div>
        </div>
      </article>
    </section>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { loadServiceCards } from '@/services/portal'
import type { ServiceCard } from '@/types'

const services = ref<ServiceCard[]>([])
const keyword = ref('')

const filteredServices = computed(() =>
  services.value.filter((item) => `${item.name}${item.description}${item.category}`.toLowerCase().includes(keyword.value.toLowerCase())),
)

onMounted(async () => {
  services.value = await loadServiceCards()
})
</script>

<style scoped lang="scss">
.hero-search {
  width: min(320px, 100%);
}

.tag-wrap {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
</style>
