<template>
  <div class="page-shell">
    <section class="page-hero">
      <div>
        <div class="status-pill is-brand">设备借用</div>
        <h1 class="page-hero__title">统一管理设备库存、借用申请与归还闭环</h1>
        <p class="page-hero__desc">前端先承接分类、库存、申请信息和规则提示，后续你只需要把真实库存和借还接口接进来。</p>
      </div>
      <el-alert title="当前为前端占位数据，库存和借出状态后续接真实接口即可" type="info" :closable="false" />
    </section>

    <section class="equipment-banner">
      <div class="equipment-banner__text">
        <span>借用体验</span>
        <strong>从库存感知、可借数量到规则提示形成一体化借用入口</strong>
      </div>
      <div class="equipment-banner__stats">
        <div @click="showBorrowable">
          <span>设备品类</span>
          <strong>{{ equipments.length }}</strong>
        </div>
        <div @click="showBorrowable">
          <span>可借资源</span>
          <strong>{{ borrowableCount }}</strong>
        </div>
      </div>
    </section>

    <section class="resource-grid">
      <article v-for="item in equipments" :key="item.id" class="resource-card equipment-card">
        <div class="cover-badge" :class="item.image">{{ item.category }}</div>
        <div class="section-head" style="margin-bottom: 8px;">
          <h3 class="section-head__title">{{ item.name }}</h3>
          <el-tag :type="item.availableStock > 0 ? 'success' : 'danger'">{{ item.availableStock > 0 ? '可借用' : '库存不足' }}</el-tag>
        </div>
        <p class="muted">{{ item.description }}</p>
        <div class="info-list">
          <div class="info-row"><span>库存总量</span><strong>{{ item.stock }} {{ item.unit }}</strong></div>
          <div class="info-row"><span>可借数量</span><strong>{{ item.availableStock }} {{ item.unit }}</strong></div>
          <div class="info-row"><span>存放位置</span><strong>{{ item.location }}</strong></div>
          <div class="info-row"><span>计费方式</span><strong>{{ item.priceLabel }}</strong></div>
        </div>
        <div class="button-row">
          <el-button plain @click="selectedEquipment = item">查看详情</el-button>
          <el-button type="primary" @click="borrow(item)">发起借用</el-button>
        </div>
      </article>
    </section>

    <el-dialog v-model="borrowableVisible" title="当前可借资源" width="620px">
      <div class="dialog-list">
        <div v-for="item in borrowableResources" :key="item.id" class="dialog-card">
          <strong>{{ item.name }}</strong>
          <p>{{ item.location }}</p>
          <span>可借 {{ item.availableStock }} {{ item.unit }}</span>
        </div>
      </div>
    </el-dialog>

    <el-drawer v-model="equipmentDrawerVisible" title="设备详情" size="420px">
      <template v-if="selectedEquipment">
        <div class="drawer-stack">
          <div class="cover-badge" :class="selectedEquipment.image">{{ selectedEquipment.category }}</div>
          <h3>{{ selectedEquipment.name }}</h3>
          <p class="muted">{{ selectedEquipment.description }}</p>
          <div class="info-list">
            <div class="info-row"><span>存放位置</span><strong>{{ selectedEquipment.location }}</strong></div>
            <div class="info-row"><span>计费方式</span><strong>{{ selectedEquipment.priceLabel }}</strong></div>
            <div class="info-row"><span>可借数量</span><strong>{{ selectedEquipment.availableStock }} {{ selectedEquipment.unit }}</strong></div>
          </div>
        </div>
      </template>
    </el-drawer>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { ElMessage } from 'element-plus'
import { equipments } from '@/mock/campus-data'
import type { EquipmentResource } from '@/types'

const borrowableVisible = ref(false)
const selectedEquipment = ref<EquipmentResource | null>(null)
const equipmentDrawerVisible = computed({
  get: () => Boolean(selectedEquipment.value),
  set: (value: boolean) => {
    if (!value) selectedEquipment.value = null
  },
})

const borrowableCount = computed(() => equipments.filter((item) => item.availableStock > 0).length)
const borrowableResources = computed(() => equipments.filter((item) => item.availableStock > 0))

function showBorrowable() {
  borrowableVisible.value = true
}

function borrow(item: EquipmentResource) {
  if (item.availableStock <= 0) {
    ElMessage.warning('当前设备库存不足')
    return
  }
  selectedEquipment.value = item
  ElMessage.success(`已预留“${item.name}”的借用入口，后续可直接接入后端流程。`)
}
</script>

<style scoped lang="scss">
.equipment-banner { display: grid; grid-template-columns: 1.2fr .8fr; gap: 16px; }
.equipment-banner__text, .equipment-banner__stats { border-radius: 24px; border: 1px solid var(--border-soft); background: rgba(255,255,255,.92); box-shadow: var(--shadow-card); }
.equipment-banner__text { display: grid; gap: 10px; padding: 24px; }
.equipment-banner__text span, .equipment-banner__stats span { color: var(--text-secondary); }
.equipment-banner__text strong { font-size: 24px; line-height: 1.5; }
.equipment-banner__stats { display: grid; grid-template-columns: repeat(2,1fr); gap: 1px; overflow: hidden; }
.equipment-banner__stats div { display: grid; gap: 8px; padding: 24px; background: linear-gradient(180deg, #fff, #f8fbff); cursor: pointer; transition: transform .24s ease; }
.equipment-banner__stats div:hover { transform: translateY(-4px); }
.equipment-banner__stats strong { font-size: 34px; }
.equipment-card .cover-badge { letter-spacing: .08em; }
.button-row { display: flex; gap: 10px; }
.dialog-list, .drawer-stack { display: grid; gap: 12px; }
.dialog-card { padding: 16px; border-radius: 18px; background: linear-gradient(180deg, #fff, #f8fbff); border: 1px solid var(--border-soft); }
.dialog-card p { margin: 6px 0; color: var(--text-secondary); }
@media (max-width: 960px) { .equipment-banner { grid-template-columns: 1fr; } .button-row { flex-direction: column; } }
</style>