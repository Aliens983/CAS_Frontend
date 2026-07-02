<template>
  <div class="page-shell">
    <section class="page-hero">
      <div>
        <div class="status-pill is-brand">咨询服务</div>
        <h1 class="page-hero__title">学生服务与顾问预约的标准化入口</h1>
        <p class="page-hero__desc">保留 CAS 原有业务方向，但页面表达升级为企业产品化样式，便于后续继续接排班、空档和预约提交接口。</p>
      </div>
    </section>

    <section class="consultation-band">
      <div class="consultation-band__copy">
        <span>顾问矩阵</span>
        <strong>将能力标签、评分、可预约状态和最近空档统一到一张卡片里</strong>
      </div>
      <div class="consultation-band__count" @click="showAvailableConsultants">
        <span>在线顾问</span>
        <strong>{{ availableConsultants }}</strong>
      </div>
    </section>

    <section class="resource-grid">
      <article v-for="consultant in consultants" :key="consultant.id" class="resource-card consultant-card">
        <div class="cover-badge gradient-amber">{{ consultant.name }}</div>
        <div class="section-head" style="margin-bottom: 8px;">
          <div>
            <h3 class="section-head__title">{{ consultant.name }}</h3>
            <p class="muted">{{ consultant.title }} / {{ consultant.department }}</p>
          </div>
          <el-tag :type="consultant.available ? 'success' : 'info'">{{ consultant.available ? '可预约' : '本周已满' }}</el-tag>
        </div>
        <div class="info-list">
          <div class="info-row"><span>评分</span><strong>{{ consultant.rating }} / 5.0</strong></div>
          <div class="info-row"><span>评价数</span><strong>{{ consultant.reviews }}</strong></div>
          <div class="info-row"><span>最近可约</span><strong>{{ consultant.nextSlot }}</strong></div>
        </div>
        <div class="tag-wrap">
          <el-tag v-for="item in consultant.expertise" :key="item" round>{{ item }}</el-tag>
        </div>
        <div class="button-row">
          <el-button plain @click="selectedConsultant = consultant">查看简介</el-button>
          <el-button type="primary" :disabled="!consultant.available" @click="reserve(consultant)">预约顾问</el-button>
        </div>
      </article>
    </section>

    <el-dialog v-model="availableVisible" title="当前可预约顾问" width="620px">
      <div class="dialog-list">
        <div v-for="item in consultants.filter((consultant) => consultant.available)" :key="item.id" class="dialog-card">
          <strong>{{ item.name }} / {{ item.title }}</strong>
          <p>{{ item.department }}</p>
          <span>{{ item.nextSlot }}</span>
        </div>
      </div>
    </el-dialog>

    <el-drawer v-model="consultantDrawerVisible" title="顾问详情" size="420px">
      <template v-if="selectedConsultant">
        <div class="drawer-stack">
          <div class="cover-badge gradient-amber">{{ selectedConsultant.name }}</div>
          <div>
            <h3>{{ selectedConsultant.title }}</h3>
            <p class="muted">{{ selectedConsultant.department }}</p>
          </div>
          <div class="info-list">
            <div class="info-row"><span>评分</span><strong>{{ selectedConsultant.rating }} / 5.0</strong></div>
            <div class="info-row"><span>评价数</span><strong>{{ selectedConsultant.reviews }}</strong></div>
            <div class="info-row"><span>最近可约</span><strong>{{ selectedConsultant.nextSlot }}</strong></div>
          </div>
          <div class="tag-wrap">
            <el-tag v-for="item in selectedConsultant.expertise" :key="item" round>{{ item }}</el-tag>
          </div>
        </div>
      </template>
    </el-drawer>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { ElMessage } from 'element-plus'
import { consultants } from '@/mock/campus-data'
import type { Consultant } from '@/types'

const availableVisible = ref(false)
const selectedConsultant = ref<Consultant | null>(null)
const consultantDrawerVisible = computed({
  get: () => Boolean(selectedConsultant.value),
  set: (value: boolean) => {
    if (!value) selectedConsultant.value = null
  },
})

const availableConsultants = computed(() => consultants.filter((item) => item.available).length)

function showAvailableConsultants() {
  availableVisible.value = true
}

function reserve(consultant: Consultant) {
  selectedConsultant.value = consultant
  ElMessage.success(`已打开“${consultant.name}”的预约窗口。`)
}
</script>

<style scoped lang="scss">
.consultation-band { display: grid; grid-template-columns: 1.2fr .8fr; gap: 16px; }
.consultation-band__copy, .consultation-band__count { border-radius: 24px; border: 1px solid var(--border-soft); background: rgba(255,255,255,.92); box-shadow: var(--shadow-card); }
.consultation-band__copy { display: grid; gap: 10px; padding: 24px; }
.consultation-band__copy span, .consultation-band__count span { color: var(--text-secondary); }
.consultation-band__copy strong { font-size: 24px; line-height: 1.5; }
.consultation-band__count { display: grid; align-content: center; justify-items: center; gap: 8px; padding: 24px; text-align: center; cursor: pointer; transition: transform .24s ease, box-shadow .24s ease; }
.consultation-band__count:hover { transform: translateY(-4px); box-shadow: var(--shadow-card-hover); }
.consultation-band__count strong { font-size: 40px; }
.consultant-card { isolation: isolate; }
.consultant-card::before { opacity: .7; }
.tag-wrap { display: flex; flex-wrap: wrap; gap: 8px; }
.button-row { display: flex; gap: 10px; }
.dialog-list, .drawer-stack { display: grid; gap: 12px; }
.dialog-card { padding: 16px; border-radius: 18px; background: linear-gradient(180deg, #fff, #f8fbff); border: 1px solid var(--border-soft); }
.dialog-card p { margin: 6px 0; color: var(--text-secondary); }
@media (max-width: 960px) { .consultation-band { grid-template-columns: 1fr; } .button-row { flex-direction: column; } }
</style>