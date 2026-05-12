<template>
  <div class="shell">
    <header class="shell__header glass-panel">
      <div class="brand" @click="router.push('/dashboard')">
        <div class="brand__mark">CAS</div>
        <div class="brand__meta">
          <strong>Campus Appointment</strong>
          <span>校园统一预约门户</span>
        </div>
      </div>

      <nav class="nav">
        <button
          v-for="item in navItems"
          :key="item.path"
          class="nav__item"
          :class="{ 'is-active': route.path.startsWith(item.path) }"
          @click="router.push(item.path)"
        >
          {{ item.label }}
        </button>
      </nav>

      <div class="user">
        <div class="user__meta">
          <strong>{{ userStore.userInfo?.username || '校园用户' }}</strong>
          <span>{{ userStore.userInfo?.department || '校园预约中心' }}</span>
        </div>
        <el-dropdown @command="handleCommand">
          <el-avatar :size="40">{{ initial }}</el-avatar>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item command="profile">个人中心</el-dropdown-item>
              <el-dropdown-item command="logout" divided>退出登录</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </header>

    <section class="hero">
      <div>
        <span class="status-pill is-brand">用户端</span>
        <h1>常用预约与进度回看集中在同一入口</h1>
        <p>保留校园预约系统的业务结构，同时压缩切页等待感，优化主导航、文案排版和首屏信息密度。</p>
      </div>
      <div class="hero__tips">
        <div>已联调：用户信息、服务列表、我的预约</div>
        <div>未实现接口保持占位，不阻断现有流程</div>
      </div>
    </section>

    <main class="shell__content">
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
  { label: '我的预约', path: '/bookings' },
  { label: '个人中心', path: '/profile' },
]

const initial = computed(() => userStore.userInfo?.username?.slice(0, 1) || 'U')

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
.shell {
  min-height: 100vh;
  padding: 18px;
}

.shell__header {
  display: grid;
  grid-template-columns: auto 1fr auto;
  gap: 18px;
  align-items: center;
  padding: 16px 18px;
  border-radius: 24px;
}

.brand {
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
}

.brand__mark {
  width: 44px;
  height: 44px;
  display: grid;
  place-items: center;
  border-radius: 14px;
  color: #fff;
  font-weight: 800;
  background: linear-gradient(135deg, #1458d4, #4c98ff);
}

.brand__meta {
  display: grid;
  gap: 4px;
}

.brand__meta span,
.user__meta span {
  color: var(--text-secondary);
  font-size: 12px;
}

.nav {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 10px;
}

.nav__item {
  min-width: 92px;
  padding: 10px 18px;
  border: 0;
  border-radius: 999px;
  background: rgba(20, 88, 212, 0.06);
  color: var(--text-secondary);
  cursor: pointer;
}

.nav__item.is-active {
  color: #fff;
  background: linear-gradient(135deg, #1458d4, #3386ff);
}

.user {
  display: flex;
  align-items: center;
  gap: 12px;
}

.user__meta {
  display: grid;
  justify-items: end;
  gap: 2px;
  text-align: right;
}

.hero {
  margin-top: 18px;
  padding: 28px 30px;
  border-radius: 28px;
  color: #fff;
  display: grid;
  grid-template-columns: 1.25fr 0.75fr;
  gap: 20px;
  background: linear-gradient(135deg, #0d2750, #1458d4 55%, #52a1ff);
  box-shadow: var(--shadow-card);
}

.hero h1 {
  margin: 14px 0 10px;
  font-size: 34px;
  line-height: 1.2;
}

.hero p {
  margin: 0;
  max-width: 760px;
  line-height: 1.75;
  color: rgba(255, 255, 255, 0.86);
}

.hero__tips {
  display: grid;
  gap: 12px;
}

.hero__tips div {
  padding: 16px 18px;
  border-radius: 18px;
  background: rgba(255, 255, 255, 0.12);
  line-height: 1.65;
}

.shell__content {
  margin-top: 18px;
}

@media (max-width: 1100px) {
  .shell__header,
  .hero {
    grid-template-columns: 1fr;
  }

  .nav {
    justify-content: flex-start;
  }

  .user {
    justify-content: space-between;
  }
}

@media (max-width: 760px) {
  .shell {
    padding: 12px;
  }

  .hero {
    padding: 20px;
  }

  .hero h1 {
    font-size: 28px;
  }

  .user__meta {
    display: none;
  }
}
</style>
