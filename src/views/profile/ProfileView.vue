<template>
  <div class="page-shell">
    <section class="grid-cards">
      <el-card class="panel-card" style="grid-column: span 4;">
        <div class="profile-card">
          <el-avatar :size="88">{{ user.username.slice(0, 1) }}</el-avatar>
          <h3>{{ user.username }}</h3>
          <p>{{ user.department }}</p>
          <el-tag :type="user.role === 'user' ? 'success' : 'danger'">{{ roleText }}</el-tag>
        </div>
      </el-card>

      <el-card class="panel-card" style="grid-column: span 8;">
        <template #header><div class="section-head"><h3 class="section-head__title">账号信息</h3></div></template>
        <div class="info-list">
          <div class="info-row"><span>邮箱</span><strong>{{ user.email }}</strong></div>
          <div class="info-row"><span>手机号</span><strong>{{ user.phone || '暂未填写' }}</strong></div>
          <div class="info-row"><span>角色</span><strong>{{ roleText }}</strong></div>
          <div class="info-row"><span>创建时间</span><strong>{{ user.createdAt }}</strong></div>
        </div>
      </el-card>
    </section>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { loadUserProfile } from '@/services/portal'
import type { UserInfo } from '@/types'

const user = ref<UserInfo>({
  id: 0,
  username: '校园用户',
  email: '',
  phone: '',
  role: 'user',
  department: '校园预约中心',
  createdAt: '',
})

const roleText = computed(() => (user.value.role === 'super_admin' ? '超级管理员' : user.value.role === 'admin' ? '管理员' : '普通用户'))

onMounted(async () => {
  user.value = await loadUserProfile()
})
</script>

<style scoped lang="scss">
.profile-card {
  display: grid;
  justify-items: center;
  gap: 12px;
  padding: 12px 0;
  text-align: center;
}

.profile-card h3,
.profile-card p {
  margin: 0;
}

.profile-card p {
  color: var(--text-secondary);
}
</style>
