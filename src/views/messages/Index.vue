<template>
  <div class="page-shell">
    <section class="page-hero">
      <div>
        <div class="status-pill is-brand">消息中心</div>
        <h1 class="page-hero__title">审批通知、系统公告与业务提醒统一回流</h1>
        <p class="page-hero__desc">页面已经按企业产品的信息流方式重组，后续你只需要接入站内信、公告和业务通知接口即可。</p>
      </div>
    </section>

    <section class="message-overview">
      <article class="overview-card" @click="openOverview('all')">
        <span>全部消息</span>
        <strong>{{ messages.length }}</strong>
        <small>统一汇总到一个收件箱</small>
      </article>
      <article class="overview-card" @click="openOverview('unread')">
        <span>未读提醒</span>
        <strong>{{ unreadCount }}</strong>
        <small>建议优先处理审批结果和时效类消息</small>
      </article>
      <article class="overview-card" @click="openOverview('types')">
        <span>消息类型</span>
        <strong>{{ messageTypes }}</strong>
        <small>公告、审核、提醒统一展示</small>
      </article>
    </section>

    <el-card class="panel-card">
      <template #header>
        <div class="section-head">
          <h3 class="section-head__title">消息流</h3>
          <el-segmented v-model="filter" :options="filters" />
        </div>
      </template>
      <div class="message-list">
        <article
          v-for="item in filteredMessages"
          :key="item.id"
          class="message-item"
          :class="{ 'is-unread': item.unread }"
          @click="selectedMessage = item"
        >
          <div class="message-item__glow" />
          <div class="message-item__main">
            <div class="message-item__head">
              <strong>{{ item.title }}</strong>
              <span class="status-pill" :class="item.unread ? 'is-brand' : 'is-success'">{{ item.unread ? '未读' : '已读' }}</span>
            </div>
            <p>{{ item.content }}</p>
          </div>
          <div class="message-item__side">
            <el-tag effect="plain">{{ typeLabel(item.type) }}</el-tag>
            <span>{{ item.time }}</span>
          </div>
        </article>
      </div>
    </el-card>

    <el-dialog v-model="overviewVisible" :title="overviewTitle" width="560px">
      <div class="dialog-list">
        <div v-for="item in overviewItems" :key="item" class="dialog-card">{{ item }}</div>
      </div>
    </el-dialog>

    <el-drawer v-model="messageDrawerVisible" title="消息详情" size="420px">
      <template v-if="selectedMessage">
        <div class="drawer-stack">
          <div>
            <h3>{{ selectedMessage.title }}</h3>
            <p class="muted">{{ selectedMessage.time }} / {{ typeLabel(selectedMessage.type) }}</p>
          </div>
          <div class="detail-card">
            <p>{{ selectedMessage.content }}</p>
          </div>
          <div class="button-row">
            <el-button plain @click="handleMessageAction(selectedMessage.type)">前往相关页面</el-button>
            <el-button type="primary">标记已处理</el-button>
          </div>
        </div>
      </template>
    </el-drawer>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import type { MessageItem } from '@/types'

const router = useRouter()
const filter = ref<'all' | 'approval' | 'system' | 'notice'>('all')
const overviewVisible = ref(false)
const overviewTitle = ref('')
const overviewItems = ref<string[]>([])
const selectedMessage = ref<MessageItem | null>(null)
const messages = ref<MessageItem[]>([])
const filters = [
  { label: '全部', value: 'all' },
  { label: '审核', value: 'approval' },
  { label: '系统', value: 'system' },
  { label: '公告', value: 'notice' },
]

const unreadCount = computed(() => messages.value.filter((item) => item.unread).length)
const messageTypes = computed(() => new Set(messages.value.map((item) => item.type)).size)
const filteredMessages = computed(() => (filter.value === 'all' ? messages.value : messages.value.filter((item) => item.type === filter.value)))
const messageDrawerVisible = computed({
  get: () => Boolean(selectedMessage.value),
  set: (value: boolean) => {
    if (!value) selectedMessage.value = null
  },
})

function typeLabel(type: MessageItem['type']) {
  return { approval: '审核', system: '系统', notice: '公告' }[type]
}

function openOverview(mode: 'all' | 'unread' | 'types') {
  const mapping = {
    all: { title: '全部消息', items: ['审批通知 1 条', '系统升级通知 1 条', '规则公告 1 条'] },
    unread: { title: '未读提醒', items: ['设备借用待审核提醒', '系统升级维护通知'] },
    types: { title: '消息类型', items: ['审核类消息 1 种', '系统类消息 1 种', '公告类消息 1 种'] },
  }
  overviewTitle.value = mapping[mode].title
  overviewItems.value = mapping[mode].items
  overviewVisible.value = true
}

function handleMessageAction(type: MessageItem['type']) {
  const pathMap = { approval: '/bookings', system: '/profile', notice: '/services' }
  router.push(pathMap[type])
}
</script>

<style scoped lang="scss">
.message-overview { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }
.overview-card { position: relative; display: grid; gap: 8px; padding: 22px; border-radius: 22px; background: rgba(255,255,255,.92); border: 1px solid var(--border-soft); box-shadow: var(--shadow-card); overflow: hidden; cursor: pointer; transition: transform .26s ease, box-shadow .26s ease; }
.overview-card::after { content: ''; position: absolute; inset: auto -24px -24px auto; width: 92px; height: 92px; border-radius: 50%; background: radial-gradient(circle, rgba(20,88,212,.08), rgba(20,88,212,0)); pointer-events: none; }
.overview-card:hover { transform: translateY(-6px); box-shadow: var(--shadow-card-hover); }
.overview-card span, .overview-card small { color: var(--text-secondary); }
.overview-card strong { font-size: 34px; }
.message-list { display: grid; gap: 16px; }
.message-item { position: relative; display: flex; justify-content: space-between; gap: 20px; padding: 20px; border-radius: 20px; border: 1px solid var(--border-soft); background: linear-gradient(180deg, #fff, #f8fbff); overflow: hidden; cursor: pointer; transition: transform .24s ease, box-shadow .24s ease, border-color .24s ease; }
.message-item:hover { transform: translateY(-4px); box-shadow: 0 18px 28px rgba(20,33,61,.1); border-color: rgba(20,88,212,.14); }
.message-item.is-unread { border-color: rgba(20,88,212,.2); }
.message-item__glow { position: absolute; top: -24px; right: -24px; width: 88px; height: 88px; border-radius: 50%; background: radial-gradient(circle, rgba(20,88,212,.1), rgba(20,88,212,0)); transition: transform .28s ease; }
.message-item:hover .message-item__glow { transform: scale(1.18); }
.message-item__main, .message-item__side { position: relative; z-index: 1; }
.message-item__main { flex: 1; }
.message-item__head { display: flex; align-items: center; justify-content: space-between; gap: 12px; margin-bottom: 8px; }
.message-item__main p { margin: 0; color: var(--text-secondary); line-height: 1.75; }
.message-item__side { display: grid; justify-items: end; align-content: start; gap: 8px; color: var(--text-tertiary); font-size: 12px; }
.dialog-list, .drawer-stack { display: grid; gap: 12px; }
.dialog-card, .detail-card { padding: 16px; border-radius: 18px; background: linear-gradient(180deg, #fff, #f8fbff); border: 1px solid var(--border-soft); }
.detail-card p { margin: 0; line-height: 1.8; color: var(--text-secondary); }
.button-row { display: flex; gap: 10px; }
@media (max-width: 900px) { .message-overview { grid-template-columns: 1fr; } .message-item, .button-row { flex-direction: column; } .message-item__side { justify-items: start; } }
</style>
