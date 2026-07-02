<template>
  <div class="page-shell">
    <section class="page-hero">
      <div>
        <div class="status-pill is-brand">用户与权限</div>
        <h1 class="page-hero__title">管理账号、部门和角色授权</h1>
        <p class="page-hero__desc">用户治理页改成更接近企业权限台的表达，适合后续接用户分页、角色授权和账号状态管理接口。</p>
      </div>
    </section>

    <section class="admin-overview">
      <article class="overview-card" @click="openOverview('all')">
        <span>用户总数</span>
        <strong>{{ tableData.length }}</strong>
        <small>所有已注册的用户账号</small>
      </article>
      <article class="overview-card" @click="openOverview('admin')">
        <span>管理员</span>
        <strong>{{ adminCount }}</strong>
        <small>包括管理员和超级管理员</small>
      </article>
      <article class="overview-card" @click="openOverview('active')">
        <span>活跃账号</span>
        <strong>{{ tableData.length }}</strong>
        <small>当前正常使用中的账号</small>
      </article>
    </section>

    <el-card class="panel-card">
      <template #header>
        <div class="section-head">
          <h3 class="section-head__title">用户列表</h3>
          <el-input v-model="keyword" placeholder="搜索用户名、部门或邮箱" clearable style="width: 280px" />
        </div>
      </template>

      <div class="user-stack">
        <article v-for="item in filteredUsers" :key="item.id" class="user-item">
          <div class="user-item__avatar">{{ item.username.slice(0, 1) }}</div>
          <div class="user-item__main">
            <div class="user-item__head">
              <div>
                <strong>{{ item.username }}</strong>
                <p>{{ item.department }}</p>
              </div>
              <el-tag :type="item.role === 'super_admin' ? 'danger' : item.role === 'admin' ? 'warning' : 'info'">{{ roleText(item.role) }}</el-tag>
            </div>
            <div class="user-item__meta">
              <span>{{ item.email }}</span>
              <span>{{ item.phone }}</span>
              <span>状态：启用</span>
            </div>
          </div>
          <div class="user-item__action">
            <el-button plain @click="selectedUser = item">分配角色</el-button>
            <el-button type="primary" @click="detailUser(item)">查看详情</el-button>
          </div>
        </article>
      </div>
    </el-card>

    <el-dialog v-if="overviewVisible" :model-value="true" :title="overviewTitle" width="560px" @close="overviewVisible = false">
      <div class="dialog-list">
        <div v-for="item in overviewItems" :key="item" class="dialog-card">{{ item }}</div>
      </div>
    </el-dialog>

    <el-drawer v-model="userDrawerVisible" title="角色分配" size="420px">
      <template v-if="selectedUser">
        <div class="drawer-stack">
          <div>
            <h3>{{ selectedUser.username }}</h3>
            <p class="muted">{{ selectedUser.department }}</p>
          </div>
          <el-select :model-value="selectedUser.role" style="width: 100%">
            <el-option label="普通用户" value="user" />
            <el-option label="管理员" value="admin" />
            <el-option label="超级管理员" value="super_admin" />
          </el-select>
          <el-button type="primary" style="width: 100%">保存角色</el-button>
        </div>
      </template>
    </el-drawer>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { fetchAdminUsers } from '@/services/campus'
import type { UserInfo, UserRole } from '@/types'

const keyword = ref('')
const overviewVisible = ref(false)
const overviewTitle = ref('')
const overviewItems = ref<string[]>([])
const selectedUser = ref<UserInfo | null>(null)
const tableData = ref<UserInfo[]>([])
const loading = ref(false)

const filteredUsers = computed(() =>
  tableData.value.filter((item) => [item.username, item.department, item.email].join('|').toLowerCase().includes(keyword.value.toLowerCase())),
)
const adminCount = computed(() => tableData.value.filter((item) => item.role === 'admin' || item.role === 'super_admin').length)
const userDrawerVisible = computed({
  get: () => Boolean(selectedUser.value),
  set: (value: boolean) => {
    if (!value) selectedUser.value = null
  },
})

onMounted(async () => {
  loading.value = true
  try {
    tableData.value = await fetchAdminUsers()
  } catch (error: unknown) {
    const err = error as { message?: string }
    ElMessage.error(err.message || '获取用户列表失败')
  } finally {
    loading.value = false
  }
})

function openOverview(mode: 'all' | 'admin' | 'active') {
  const mapping = {
    all: { title: '全部用户', items: tableData.value.map((item) => `${item.username} / ${item.department}`) },
    admin: { title: '管理员账号', items: tableData.value.filter((item) => item.role !== 'user').map((item) => `${item.username} / ${roleText(item.role)}`) },
    active: { title: '活跃账号', items: tableData.value.map((item) => `${item.username} / 启用`) },
  }
  overviewTitle.value = mapping[mode].title
  overviewItems.value = mapping[mode].items
  overviewVisible.value = true
}

function detailUser(item: UserInfo) {
  overviewTitle.value = `${item.username} 账号详情`
  overviewItems.value = [`邮箱：${item.email}`, `电话：${item.phone}`, `角色：${roleText(item.role)}`]
  overviewVisible.value = true
}

function roleText(role: UserRole) {
  const map: Record<UserRole, string> = {
    user: '普通用户',
    admin: '管理员',
    super_admin: '超级管理员',
  }
  return map[role] || '未知'
}
</script>

<style scoped lang="scss">
.admin-overview { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }
.overview-card { position: relative; display: grid; gap: 8px; padding: 22px; border-radius: 22px; background: rgba(255,255,255,.92); border: 1px solid var(--border-soft); box-shadow: var(--shadow-card); overflow: hidden; cursor: pointer; transition: transform .26s ease, box-shadow .26s ease; }
.overview-card::after { content: ''; position: absolute; inset: auto -24px -24px auto; width: 92px; height: 92px; border-radius: 50%; background: radial-gradient(circle, rgba(20,88,212,.08), rgba(20,88,212,0)); pointer-events: none; }
.overview-card:hover { transform: translateY(-6px); box-shadow: var(--shadow-card-hover); }
.overview-card span, .overview-card small { color: var(--text-secondary); }
.overview-card strong { font-size: 34px; }
.user-stack, .dialog-list, .drawer-stack { display: grid; gap: 14px; }
.user-item { display: grid; grid-template-columns: auto 1fr auto; gap: 16px; padding: 18px; border-radius: 20px; border: 1px solid var(--border-soft); background: linear-gradient(180deg, #fff, #f8fbff); transition: transform .24s ease, box-shadow .24s ease, border-color .24s ease; }
.user-item:hover { transform: translateY(-4px); box-shadow: 0 18px 28px rgba(20,33,61,.1); border-color: rgba(20,88,212,.14); }
.user-item__avatar { width: 56px; height: 56px; display: grid; place-items: center; border-radius: 18px; background: linear-gradient(135deg, #1458d4, #53a2ff); color: #fff; font-size: 22px; font-weight: 700; }
.user-item__main { display: grid; gap: 10px; }
.user-item__head { display: flex; justify-content: space-between; gap: 12px; }
.user-item__head p { margin: 4px 0 0; color: var(--text-tertiary); font-size: 12px; }
.user-item__meta { display: flex; flex-wrap: wrap; gap: 12px; color: var(--text-secondary); font-size: 13px; }
.user-item__action { display: flex; align-items: center; gap: 10px; }
.dialog-card { padding: 16px; border-radius: 18px; background: linear-gradient(180deg, #fff, #f8fbff); border: 1px solid var(--border-soft); }
@media (max-width: 960px) { .admin-overview { grid-template-columns: 1fr; } .user-item, .user-item__head, .user-item__action { display: flex; flex-direction: column; align-items: stretch; } }
</style>
