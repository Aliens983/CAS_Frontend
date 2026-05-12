<template>
  <div class="user-layout">
    <div class="user-layout__mesh user-layout__mesh--a" />
    <div class="user-layout__mesh user-layout__mesh--b" />
    <div class="user-layout__mesh user-layout__mesh--c" />

    <header class="user-header glass-panel">
      <div class="brand" @click="router.push('/dashboard')">
        <div class="brand__mark">CAS</div>
        <div class="brand__meta">
          <strong>Campus Appointment</strong>
          <span>用户服务门户</span>
        </div>
      </div>

      <nav class="user-nav">
        <button
          v-for="item in navItems"
          :key="item.path"
          class="user-nav__item"
          :class="{ 'is-active': route.path.startsWith(item.path) }"
          @click="router.push(item.path)"
        >
          <span>{{ item.label }}</span>
        </button>
      </nav>

      <div class="user-actions">
        <el-button circle plain class="user-actions__btn" @click="router.push('/messages')">
          <el-icon><Bell /></el-icon>
        </el-button>
        <el-dropdown @command="handleCommand">
          <div class="user-chip">
            <div class="user-chip__ring">
              <el-avatar :size="40">{{ userInitial }}</el-avatar>
            </div>
            <div class="user-chip__meta">
              <strong>{{ userStore.userInfo?.username }}</strong>
              <span>{{ userStore.userInfo?.department || '校园统一身份账号' }}</span>
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

    <section class="user-banner">
      <div class="user-banner__content">
        <span class="status-pill is-brand">用户端</span>
        <h1>统一预约入口，体验更像正式产品门户</h1>
        <p>
          将会议室、设备借用、咨询服务和个人预约统一汇聚到一套更清晰的工作台里，
          让用户进入系统后第一眼就能快速找到服务、查看进度并完成下一步操作。
        </p>
        <div class="banner-actions">
          <button class="banner-stat" @click="router.push('/services')">
            <strong>服务直达</strong>
            <span>常用服务一键进入</span>
          </button>
          <button class="banner-stat" @click="router.push('/bookings')">
            <strong>进度回看</strong>
            <span>待审、通过、完成统一追踪</span>
          </button>
        </div>
      </div>

      <div class="banner-panel">
        <div class="banner-panel__item">
          <strong>一站式办理</strong>
          <span>会议室、设备、咨询、消息和预约进度在同一界面闭环处理。</span>
        </div>
        <div class="banner-panel__item">
          <strong>状态更清晰</strong>
          <span>重要提醒、待办事项、近期预约直接浮现在首页，不需要来回切换。</span>
        </div>
        <div class="banner-panel__item">
          <strong>操作更顺手</strong>
          <span>卡片、抽屉和弹窗反馈统一，演示和后续接后端都更自然。</span>
        </div>
      </div>
    </section>

    <main class="user-content">
      <router-view />
    </main>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()

const navItems = [
  { label: '工作台', path: '/dashboard' },
  { label: '服务中心', path: '/services' },
  { label: '会议室', path: '/rooms' },
  { label: '设备借用', path: '/equipment' },
  { label: '咨询服务', path: '/consultation' },
  { label: '我的预约', path: '/bookings' },
]

const userInitial = computed(() => userStore.userInfo?.username?.slice(0, 1) || 'U')

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
.user-layout {
  position: relative;
  min-height: 100vh;
  padding: 20px;
  background:
    radial-gradient(circle at top right, rgba(20, 88, 212, 0.08), transparent 22%),
    radial-gradient(circle at left center, rgba(14, 165, 233, 0.08), transparent 24%),
    linear-gradient(180deg, rgba(255, 255, 255, 0.12), rgba(255, 255, 255, 0)),
    var(--bg-page);
  overflow: hidden;
}

.user-layout__mesh {
  position: fixed;
  border-radius: 999px;
  pointer-events: none;
  filter: blur(12px);
  opacity: 0.65;
}

.user-layout__mesh--a {
  top: 10%;
  right: -80px;
  width: 240px;
  height: 240px;
  background: radial-gradient(circle, rgba(82, 161, 255, 0.2), rgba(82, 161, 255, 0));
  animation: floatOrb 10s ease-in-out infinite;
}

.user-layout__mesh--b {
  left: -80px;
  bottom: 12%;
  width: 260px;
  height: 260px;
  background: radial-gradient(circle, rgba(45, 212, 191, 0.16), rgba(45, 212, 191, 0));
  animation: floatOrbB 14s ease-in-out infinite;
}

.user-layout__mesh--c {
  top: 34%;
  left: 42%;
  width: 180px;
  height: 180px;
  background: radial-gradient(circle, rgba(255, 255, 255, 0.32), rgba(255, 255, 255, 0));
  animation: floatOrbC 16s ease-in-out infinite;
}

.user-header {
  position: relative;
  z-index: 1;
  display: grid;
  grid-template-columns: auto 1fr auto;
  gap: 18px;
  align-items: center;
  padding: 16px 20px;
  border-radius: 26px;
  border: 1px solid rgba(255, 255, 255, 0.38);
  animation: slideDown 0.7s cubic-bezier(0.22, 1, 0.36, 1);
}

.brand {
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  transition: transform 0.24s ease;
}

.brand:hover {
  transform: translateY(-2px);
}

.brand__mark {
  width: 46px;
  height: 46px;
  display: grid;
  place-items: center;
  border-radius: 16px;
  color: #fff;
  font-weight: 800;
  letter-spacing: 0.06em;
  background: linear-gradient(135deg, #1458d4, #47a2ff);
  box-shadow: 0 14px 28px rgba(20, 88, 212, 0.24);
}

.brand__meta {
  display: grid;
  gap: 4px;
}

.brand__meta span {
  color: var(--text-secondary);
  font-size: 12px;
}

.user-nav {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 10px;
}

.user-nav__item {
  position: relative;
  min-width: 88px;
  height: 42px;
  padding: 0 18px;
  border: 1px solid transparent;
  border-radius: 999px;
  color: var(--text-secondary);
  background: rgba(255, 255, 255, 0.28);
  cursor: pointer;
  overflow: hidden;
  transition:
    transform 0.22s ease,
    color 0.22s ease,
    background-color 0.22s ease,
    box-shadow 0.22s ease,
    border-color 0.22s ease;
}

.user-nav__item::before {
  content: "";
  position: absolute;
  inset: 1px;
  border-radius: inherit;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.42), rgba(255, 255, 255, 0.04));
  opacity: 0;
  transition: opacity 0.22s ease;
}

.user-nav__item::after {
  content: "";
  position: absolute;
  inset: auto 16px 7px;
  height: 2px;
  border-radius: 999px;
  background: currentColor;
  transform: scaleX(0);
  transform-origin: center;
  transition: transform 0.22s ease;
}

.user-nav__item span {
  position: relative;
  z-index: 1;
}

.user-nav__item:hover {
  transform: translateY(-2px);
  color: var(--text-primary);
  background: rgba(20, 88, 212, 0.08);
  border-color: rgba(20, 88, 212, 0.08);
  box-shadow: 0 10px 18px rgba(20, 33, 61, 0.08);
}

.user-nav__item:hover::before {
  opacity: 1;
}

.user-nav__item:hover::after,
.user-nav__item.is-active::after {
  transform: scaleX(1);
}

.user-nav__item.is-active {
  color: #fff;
  background: linear-gradient(135deg, #1458d4, #3386ff);
  border-color: rgba(255, 255, 255, 0.18);
  box-shadow: 0 14px 24px rgba(20, 88, 212, 0.22);
}

.user-actions {
  display: flex;
  align-items: center;
  gap: 12px;
}

.user-actions__btn {
  box-shadow: var(--shadow-soft);
}

.user-chip {
  display: flex;
  align-items: center;
  gap: 12px;
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
  background: linear-gradient(135deg, rgba(20, 88, 212, 0.22), rgba(82, 161, 255, 0.08));
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

.user-banner {
  position: relative;
  z-index: 1;
  margin-top: 18px;
  padding: 34px;
  display: grid;
  grid-template-columns: 1.3fr 0.7fr;
  gap: 24px;
  border-radius: 30px;
  color: #fff;
  background:
    linear-gradient(135deg, #0d2750, #1458d4 54%, #52a1ff),
    linear-gradient(180deg, rgba(255, 255, 255, 0.04), rgba(255, 255, 255, 0));
  box-shadow: var(--shadow-card);
  overflow: hidden;
  animation: riseUp 0.8s cubic-bezier(0.22, 1, 0.36, 1) 0.08s both;
}

.user-banner::before {
  content: "";
  position: absolute;
  inset: 0;
  background:
    linear-gradient(135deg, rgba(255, 255, 255, 0.08), transparent 38%),
    repeating-linear-gradient(
      120deg,
      rgba(255, 255, 255, 0.05) 0,
      rgba(255, 255, 255, 0.05) 12px,
      transparent 12px,
      transparent 28px
    );
  mix-blend-mode: screen;
}

.user-banner::after {
  content: "";
  position: absolute;
  inset: -20% auto auto -10%;
  width: 320px;
  height: 320px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(255, 255, 255, 0.18), rgba(255, 255, 255, 0));
  animation: haloShift 8s ease-in-out infinite;
}

.user-banner__content,
.banner-panel {
  position: relative;
  z-index: 1;
}

.user-banner h1 {
  margin: 16px 0 10px;
  font-size: 36px;
  line-height: 1.14;
}

.user-banner p {
  margin: 0;
  max-width: 760px;
  color: rgba(255, 255, 255, 0.84);
  line-height: 1.78;
}

.banner-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 26px;
}

.banner-stat {
  display: grid;
  gap: 6px;
  min-width: 180px;
  padding: 16px 18px;
  border: 1px solid rgba(255, 255, 255, 0.14);
  border-radius: 20px;
  color: #fff;
  text-align: left;
  background: rgba(255, 255, 255, 0.1);
  cursor: pointer;
  transition: transform 0.24s ease, background-color 0.24s ease, border-color 0.24s ease;
}

.banner-stat:hover {
  transform: translateY(-4px);
  background: rgba(255, 255, 255, 0.16);
  border-color: rgba(255, 255, 255, 0.22);
}

.banner-stat span {
  color: rgba(255, 255, 255, 0.74);
  font-size: 13px;
}

.banner-panel {
  display: grid;
  gap: 12px;
}

.banner-panel__item {
  display: grid;
  gap: 8px;
  padding: 18px;
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.12);
  border: 1px solid rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(8px);
  transition: transform 0.24s ease, background-color 0.24s ease, border-color 0.24s ease;
}

.banner-panel__item:hover {
  transform: translateY(-3px);
  background: rgba(255, 255, 255, 0.18);
  border-color: rgba(255, 255, 255, 0.18);
}

.banner-panel__item span {
  color: rgba(255, 255, 255, 0.78);
  font-size: 13px;
  line-height: 1.65;
}

.user-content {
  position: relative;
  z-index: 1;
  margin-top: 18px;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-16px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes riseUp {
  from {
    opacity: 0;
    transform: translateY(20px) scale(0.99);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

@keyframes floatOrb {
  0%,
  100% {
    transform: translate3d(0, 0, 0);
  }
  50% {
    transform: translate3d(-32px, 18px, 0);
  }
}

@keyframes floatOrbB {
  0%,
  100% {
    transform: translate3d(0, 0, 0);
  }
  50% {
    transform: translate3d(28px, -16px, 0);
  }
}

@keyframes floatOrbC {
  0%,
  100% {
    transform: translate3d(0, 0, 0) scale(1);
  }
  50% {
    transform: translate3d(18px, 22px, 0) scale(1.12);
  }
}

@keyframes haloShift {
  0%,
  100% {
    transform: translate3d(0, 0, 0) scale(1);
  }
  50% {
    transform: translate3d(40px, 20px, 0) scale(1.08);
  }
}

@media (max-width: 1180px) {
  .user-header {
    grid-template-columns: 1fr;
  }

  .user-nav {
    justify-content: flex-start;
  }

  .user-banner {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 760px) {
  .user-layout {
    padding: 14px;
  }

  .user-header,
  .user-banner {
    padding: 20px;
  }

  .banner-actions {
    flex-direction: column;
  }
}
</style>
