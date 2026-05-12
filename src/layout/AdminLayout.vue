<template>
  <div class="layout">
    <div class="layout__glow layout__glow--a" />
    <div class="layout__glow layout__glow--b" />
    <div class="layout__glow layout__glow--c" />

    <aside class="sidebar" :class="{ 'is-collapse': collapsed }">
      <div class="brand">
        <div class="brand__mark">CAS</div>
        <div v-if="!collapsed" class="brand__meta">
          <strong>Campus Appointment</strong>
          <span>管理控制台</span>
        </div>
      </div>

      <el-scrollbar class="nav-scroll">
        <div class="nav-group">
          <div v-if="!collapsed" class="nav-group__title">管理端</div>
          <el-menu :default-active="route.path" router class="nav-menu nav-menu--secondary">
            <el-menu-item index="/admin"><el-icon><PieChart /></el-icon><span>管理驾驶舱</span></el-menu-item>
            <el-menu-item index="/admin/services"><el-icon><Management /></el-icon><span>服务治理</span></el-menu-item>
            <el-menu-item index="/admin/bookings"><el-icon><DocumentChecked /></el-icon><span>预约审核</span></el-menu-item>
            <el-menu-item index="/admin/users"><el-icon><Avatar /></el-icon><span>用户与权限</span></el-menu-item>
            <el-menu-item index="/admin/system"><el-icon><Setting /></el-icon><span>系统设置</span></el-menu-item>
          </el-menu>
        </div>

        <div class="nav-group">
          <div v-if="!collapsed" class="nav-group__title">通用页</div>
          <el-menu :default-active="route.path" router class="nav-menu">
            <el-menu-item index="/messages"><el-icon><Bell /></el-icon><span>消息中心</span></el-menu-item>
            <el-menu-item index="/profile"><el-icon><User /></el-icon><span>个人中心</span></el-menu-item>
          </el-menu>
        </div>
      </el-scrollbar>
    </aside>

    <div class="workspace">
      <header class="topbar glass-panel">
        <div class="topbar__left">
          <button class="ghost-btn" @click="collapsed = !collapsed">
            <el-icon><Expand v-if="collapsed" /><Fold v-else /></el-icon>
          </button>
          <div>
            <div class="topbar__title">{{ route.meta.title }}</div>
            <div class="topbar__subtitle">管理员 / 超级管理员工作区</div>
          </div>
        </div>

        <div class="topbar__right">
          <el-button plain class="workspace-switch" @click="router.push('/dashboard')">切换到用户端视图</el-button>
          <el-dropdown @command="handleCommand">
            <div class="user-chip">
              <div class="user-chip__ring">
                <el-avatar :size="38">{{ userInitial }}</el-avatar>
              </div>
              <div class="user-chip__meta">
                <strong>{{ userStore.userInfo?.username }}</strong>
                <span>{{ roleLabel }}</span>
              </div>
            </div>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="profile">个人中心</el-dropdown-item>
                <el-dropdown-item command="logout" divided>退出登录</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </header>

      <main class="content">
        <router-view />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()
const collapsed = ref(false)

const userInitial = computed(() => userStore.userInfo?.username?.slice(0, 1) || 'A')
const roleLabel = computed(() => (userStore.userInfo?.role === 'super_admin' ? '超级管理员' : '管理员'))

function handleCommand(command: string) {
  if (command === 'profile') {
    router.push('/profile')
    return
  }
  userStore.logout()
  router.push('/login')
}
</script>

<style scoped lang="scss">
.layout {
  position: relative;
  display: grid;
  grid-template-columns: auto 1fr;
  min-height: 100vh;
  overflow: hidden;
}

.layout__glow {
  position: fixed;
  border-radius: 50%;
  pointer-events: none;
  filter: blur(10px);
}

.layout__glow--a {
  inset: auto auto 6% -90px;
  width: 240px;
  height: 240px;
  background: radial-gradient(circle, rgba(20, 88, 212, 0.16), rgba(20, 88, 212, 0));
  animation: adminOrb 9s ease-in-out infinite;
}

.layout__glow--b {
  top: 4%;
  right: -100px;
  width: 280px;
  height: 280px;
  background: radial-gradient(circle, rgba(45, 212, 191, 0.12), rgba(45, 212, 191, 0));
  animation: adminOrbB 12s ease-in-out infinite;
}

.layout__glow--c {
  top: 42%;
  right: 28%;
  width: 180px;
  height: 180px;
  background: radial-gradient(circle, rgba(255, 255, 255, 0.24), rgba(255, 255, 255, 0));
  animation: adminOrbC 15s ease-in-out infinite;
}

.sidebar {
  position: relative;
  z-index: 1;
  width: 292px;
  padding: 20px 18px;
  background: linear-gradient(180deg, #0f172a, #132949 52%, #10264e);
  color: #fff;
  transition: width 0.24s ease;
  box-shadow: 18px 0 40px rgba(8, 15, 31, 0.18);
}

.sidebar::before {
  content: "";
  position: absolute;
  inset: 0;
  background:
    linear-gradient(180deg, rgba(255, 255, 255, 0.04), transparent 28%),
    radial-gradient(circle at top right, rgba(84, 160, 255, 0.14), transparent 28%);
  pointer-events: none;
}

.sidebar::after {
  content: "";
  position: absolute;
  inset: 18px 16px 18px auto;
  width: 1px;
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.14), rgba(255, 255, 255, 0));
  opacity: 0.55;
}

.sidebar.is-collapse {
  width: 108px;
}

.brand {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  gap: 14px;
  margin-bottom: 26px;
  padding: 10px 8px 18px;
  transition: transform 0.24s ease;
}

.brand:hover {
  transform: translateY(-2px);
}

.brand__mark {
  width: 46px;
  height: 46px;
  border-radius: 16px;
  display: grid;
  place-items: center;
  background: linear-gradient(135deg, #4d95ff, #1458d4);
  font-weight: 800;
  letter-spacing: 0.06em;
  box-shadow: 0 16px 28px rgba(20, 88, 212, 0.25);
}

.brand__meta {
  display: grid;
  gap: 4px;
}

.brand__meta span {
  color: rgba(255, 255, 255, 0.66);
  font-size: 12px;
}

.nav-scroll {
  height: calc(100vh - 110px);
  position: relative;
  z-index: 1;
}

.nav-group {
  margin-bottom: 18px;
}

.nav-group__title {
  margin: 0 0 10px;
  padding-left: 12px;
  color: rgba(255, 255, 255, 0.55);
  font-size: 12px;
  letter-spacing: 0.08em;
}

.nav-menu {
  border: 0;
  background: transparent;
}

:deep(.nav-menu .el-menu-item) {
  position: relative;
  height: 48px;
  margin-bottom: 8px;
  border-radius: 15px;
  color: rgba(255, 255, 255, 0.82);
  transition:
    transform 0.22s ease,
    background-color 0.22s ease,
    color 0.22s ease,
    box-shadow 0.22s ease;
}

:deep(.nav-menu .el-menu-item::before) {
  content: "";
  position: absolute;
  inset: 0;
  border-radius: inherit;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.08), transparent 70%);
  opacity: 0;
  transition: opacity 0.22s ease;
}

:deep(.nav-menu .el-menu-item:hover) {
  transform: translateX(4px);
  background: rgba(255, 255, 255, 0.08);
}

:deep(.nav-menu .el-menu-item:hover::before) {
  opacity: 1;
}

:deep(.nav-menu .el-menu-item.is-active) {
  background: rgba(84, 160, 255, 0.16);
  color: #fff;
  box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.04), 0 10px 20px rgba(8, 15, 31, 0.16);
}

:deep(.nav-menu--secondary .el-menu-item.is-active) {
  background: linear-gradient(135deg, rgba(45, 212, 191, 0.24), rgba(20, 88, 212, 0.18));
}

.workspace {
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.topbar {
  position: sticky;
  top: 0;
  z-index: 5;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin: 16px 18px 0;
  padding: 16px 20px;
  border: 1px solid rgba(255, 255, 255, 0.28);
  animation: adminTopbarIn 0.72s cubic-bezier(0.22, 1, 0.36, 1);
}

.topbar__left,
.topbar__right {
  display: flex;
  align-items: center;
  gap: 14px;
}

.topbar__title {
  font-size: 20px;
  font-weight: 700;
}

.topbar__subtitle {
  color: var(--text-secondary);
  font-size: 13px;
}

.ghost-btn {
  width: 42px;
  height: 42px;
  border: 0;
  border-radius: 14px;
  background: rgba(20, 33, 61, 0.05);
  color: var(--text-primary);
  cursor: pointer;
  transition: transform 0.22s ease, background-color 0.22s ease, box-shadow 0.22s ease;
}

.ghost-btn:hover {
  transform: translateY(-2px);
  background: rgba(20, 88, 212, 0.08);
  box-shadow: var(--shadow-soft);
}

.workspace-switch {
  box-shadow: var(--shadow-soft);
}

.user-chip {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 6px 8px 6px 6px;
  border-radius: 999px;
  cursor: pointer;
  transition: transform 0.22s ease, background-color 0.22s ease, box-shadow 0.22s ease;
}

.user-chip:hover {
  transform: translateY(-2px);
  background: rgba(20, 88, 212, 0.06);
  box-shadow: var(--shadow-soft);
}

.user-chip__ring {
  position: relative;
}

.user-chip__ring::after {
  content: "";
  position: absolute;
  inset: -4px;
  border-radius: 999px;
  background: linear-gradient(135deg, rgba(20, 88, 212, 0.2), rgba(84, 160, 255, 0.06));
  z-index: -1;
}

.user-chip__meta {
  display: grid;
  gap: 2px;
}

.user-chip__meta span {
  color: var(--text-secondary);
  font-size: 12px;
}

.content {
  position: relative;
  z-index: 1;
  padding: 24px 28px 30px;
}

@keyframes adminOrb {
  0%,
  100% {
    transform: translate3d(0, 0, 0) scale(1);
  }
  50% {
    transform: translate3d(34px, -22px, 0) scale(1.08);
  }
}

@keyframes adminOrbB {
  0%,
  100% {
    transform: translate3d(0, 0, 0) scale(1);
  }
  50% {
    transform: translate3d(-26px, 18px, 0) scale(1.1);
  }
}

@keyframes adminOrbC {
  0%,
  100% {
    transform: translate3d(0, 0, 0) scale(1);
  }
  50% {
    transform: translate3d(18px, -20px, 0) scale(1.14);
  }
}

@keyframes adminTopbarIn {
  from {
    opacity: 0;
    transform: translateY(-14px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (max-width: 960px) {
  .layout {
    grid-template-columns: 1fr;
  }

  .sidebar {
    display: none;
  }

  .topbar {
    margin: 14px 14px 0;
    padding: 14px 16px;
  }

  .content {
    padding: 20px 16px 24px;
  }
}

@media (max-width: 760px) {
  .topbar {
    flex-direction: column;
    align-items: stretch;
  }

  .topbar__left,
  .topbar__right {
    justify-content: space-between;
  }
}
</style>
