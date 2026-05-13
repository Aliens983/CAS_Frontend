<template>
  <div class="page-shell">
    <section class="page-hero">
      <div>
        <div class="status-pill is-brand">个人中心</div>
        <h1 class="page-hero__title">账号、角色和偏好配置统一管理</h1>
        <p class="page-hero__desc">结构按企业产品个人中心重组，方便你后续继续接用户资料、通知偏好和安全设置接口。</p>
      </div>
    </section>

    <section class="profile-overview">
      <article class="overview-card" @click="router.push('/bookings')">
        <span>我的预约</span>
        <strong>3</strong>
        <small>快速查看进行中和历史记录</small>
      </article>
      <article class="overview-card" @click="router.push('/messages')">
        <span>消息提醒</span>
        <strong>2</strong>
        <small>未读通知与审批提醒</small>
      </article>
      <article class="overview-card" @click="quickVisible = true">
        <span>快捷操作</span>
        <strong>4</strong>
        <small>常用入口集中放在个人中心</small>
      </article>
    </section>

    <section class="grid-cards">
      <el-card class="panel-card span-4">
        <div class="profile-summary">
          <div class="profile-summary__halo" />
          <el-avatar :size="92">{{ user?.username?.slice(0, 1) || 'U' }}</el-avatar>
          <h3>{{ user?.username || '未登录' }}</h3>
          <p>{{ user?.department || '未分配部门' }}</p>
          <el-tag :type="user?.role === 'admin' || user?.role === 'super_admin' ? 'danger' : 'success'">{{ roleLabel }}</el-tag>
        </div>
      </el-card>

      <el-card class="panel-card span-8">
        <template #header><div class="section-head"><h3 class="section-head__title">账户信息</h3></div></template>
        <div class="info-list">
          <div class="info-row"><span>邮箱</span><strong>{{ user?.email || '-' }}</strong></div>
          <div class="info-row"><span>手机号</span><strong>{{ user?.phone || '-' }}</strong></div>
          <div class="info-row"><span>角色</span><strong>{{ roleLabel }}</strong></div>
          <div class="info-row"><span>创建时间</span><strong>{{ user?.createdAt || '-' }}</strong></div>
        </div>
        <el-divider />
        <div class="preference-grid">
          <div class="preference-card" @click="preferenceVisible = true">
            <div>
              <strong>通知偏好</strong>
              <p>管理邮件和系统通知的接收方式</p>
            </div>
            <el-icon><ArrowRight /></el-icon>
          </div>
          <div class="preference-card" @click="handleLogout">
            <div>
              <strong>退出登录</strong>
              <p>清除登录状态并返回登录页</p>
            </div>
            <el-icon><ArrowRight /></el-icon>
          </div>
        </div>
      </el-card>
    </section>

    <el-drawer v-model="quickVisible" title="快捷操作" size="420px">
      <div class="drawer-stack">
        <el-button type="primary" @click="router.push('/dashboard')">返回工作台</el-button>
        <el-button plain @click="router.push('/bookings')">我的预约</el-button>
        <el-button plain @click="router.push('/services')">服务中心</el-button>
        <el-button plain @click="router.push('/messages')">消息中心</el-button>
      </div>
    </el-drawer>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { useUserStore } from '@/common/stores/user'

const router = useRouter()
const userStore = useUserStore()
const preferenceVisible = ref(false)
const quickVisible = ref(false)

const user = computed(() => userStore.userInfo)

const roleLabel = computed(() => {
  const role = user.value?.role
  if (role === 'super_admin') return '超级管理员'
  if (role === 'admin') return '管理员'
  return '普通用户'
})

function handleLogout() {
  userStore.logout()
  ElMessage.success('已退出登录')
  router.push('/login')
}
</script>

<style scoped lang="scss">
.profile-overview { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }
.overview-card { position: relative; display: grid; gap: 8px; padding: 22px; border-radius: 22px; background: rgba(255,255,255,.92); border: 1px solid var(--border-soft); box-shadow: var(--shadow-card); overflow: hidden; cursor: pointer; transition: transform .26s ease, box-shadow .26s ease; }
.overview-card::after { content: ''; position: absolute; inset: auto -24px -24px auto; width: 92px; height: 92px; border-radius: 50%; background: radial-gradient(circle, rgba(20,88,212,.08), rgba(20,88,212,0)); }
.overview-card:hover { transform: translateY(-6px); box-shadow: var(--shadow-card-hover); }
.overview-card span, .overview-card small { color: var(--text-secondary); }
.overview-card strong { font-size: 34px; }
.span-4 { grid-column: span 4; }
.span-8 { grid-column: span 8; }
.profile-summary { position: relative; display: grid; justify-items: center; gap: 12px; padding: 12px 0; text-align: center; overflow: hidden; }
.profile-summary__halo { position: absolute; top: -32px; width: 120px; height: 120px; border-radius: 50%; background: radial-gradient(circle, rgba(20,88,212,.12), rgba(20,88,212,0)); animation: haloFloat 6s ease-in-out infinite; }
.profile-summary h3, .profile-summary p { position: relative; z-index: 1; margin: 0; }
.profile-summary p { color: var(--text-secondary); }
.preference-grid, .dialog-list, .drawer-stack { display: grid; gap: 12px; }
.preference-card { display: flex; align-items: center; justify-content: space-between; gap: 16px; padding: 16px 18px; border-radius: 18px; border: 1px solid var(--border-soft); background: linear-gradient(180deg, #fff, #f8fbff); cursor: pointer; transition: transform .24s ease, box-shadow .24s ease; }
.preference-card:hover { transform: translateY(-4px); box-shadow: 0 16px 28px rgba(20,33,61,.1); }
.preference-card p { margin: 4px 0 0; color: var(--text-secondary); font-size: 13px; }
.dialog-card { padding: 16px; border-radius: 18px; background: linear-gradient(180deg, #fff, #f8fbff); border: 1px solid var(--border-soft); }
@keyframes haloFloat { 0%,100% { transform: translate3d(0,0,0) scale(1);} 50% { transform: translate3d(0,10px,0) scale(1.08);} }
@media (max-width: 1200px) { .profile-overview { grid-template-columns: 1fr; } .span-4, .span-8 { grid-column: span 12; } }
@media (max-width: 760px) { .preference-card { flex-direction: column; align-items: flex-start; } }
</style>