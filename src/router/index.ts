import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { resolveHomeByRole } from '@/utils/auth'

const lazyModules = import.meta.glob(['../views/**/*.vue', '../layout/*.vue'])
let prefetched = false

function warmRouteChunks() {
  if (prefetched) return
  prefetched = true

  const preload = () => {
    Object.values(lazyModules)
      .slice(0, 12)
      .forEach((loader) => void loader())
  }

  if ('requestIdleCallback' in window) {
    window.requestIdleCallback(preload, { timeout: 1200 })
    return
  }

  setTimeout(preload, 600)
}

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: () => {
      const userStore = useUserStore()
      if (!userStore.isLogin) return '/login'
      return resolveHomeByRole(userStore.userInfo?.role)
    },
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/auth/LoginPage.vue'),
    meta: { title: '登录', requiresAuth: false, audience: 'guest' },
  },
  {
    path: '/register',
    name: 'register',
    component: () => import('@/views/auth/RegisterPage.vue'),
    meta: { title: '注册', requiresAuth: false, audience: 'guest' },
  },
  {
    path: '/',
    component: () => import('@/layout/UserLayoutShell.vue'),
    meta: { requiresAuth: true },
    children: [
      {
        path: 'dashboard',
        component: () => import('@/views/dashboard/HomeView.vue'),
        meta: { title: '工作台', requiresAuth: true, audience: 'user' },
      },
      {
        path: 'services',
        component: () => import('@/views/services/ServiceCenterView.vue'),
        meta: { title: '服务中心', requiresAuth: true, audience: 'user' },
      },
      {
        path: 'service/:id',
        component: () => import('@/views/services/Detail.vue'),
        meta: { title: '服务详情', requiresAuth: true, audience: 'user' },
      },
      {
        path: 'rooms',
        component: () => import('@/views/rooms/Index.vue'),
        meta: { title: '会议室预约', requiresAuth: true, audience: 'user' },
      },
      {
        path: 'equipment',
        component: () => import('@/views/equipment/Index.vue'),
        meta: { title: '设备借用', requiresAuth: true, audience: 'user' },
      },
      {
        path: 'consultation',
        component: () => import('@/views/consultation/Index.vue'),
        meta: { title: '咨询服务', requiresAuth: true, audience: 'user' },
      },
      {
        path: 'bookings',
        component: () => import('@/views/bookings/BookingListView.vue'),
        meta: { title: '我的预约', requiresAuth: true, audience: 'user' },
      },
      {
        path: 'bookings/:id',
        component: () => import('@/views/bookings/Detail.vue'),
        meta: { title: '预约详情', requiresAuth: true, audience: 'user' },
      },
      {
        path: 'messages',
        component: () => import('@/views/messages/Index.vue'),
        meta: { title: '消息中心', requiresAuth: true },
      },
      {
        path: 'profile',
        component: () => import('@/views/profile/ProfileView.vue'),
        meta: { title: '个人中心', requiresAuth: true },
      },
    ],
  },
  {
    path: '/admin',
    component: () => import('@/layout/AdminLayoutShell.vue'),
    meta: { requiresAuth: true, requiresAdmin: true },
    children: [
      {
        path: '',
        component: () => import('@/views/admin/AdminHomeView.vue'),
        meta: { title: '管理驾驶舱', requiresAuth: true, requiresAdmin: true },
      },
      {
        path: 'services',
        component: () => import('@/views/admin/ServiceManage.vue'),
        meta: { title: '服务治理', requiresAuth: true, requiresAdmin: true },
      },
      {
        path: 'bookings',
        component: () => import('@/views/admin/BookingManage.vue'),
        meta: { title: '预约审核', requiresAuth: true, requiresAdmin: true },
      },
      {
        path: 'users',
        component: () => import('@/views/admin/UserManage.vue'),
        meta: { title: '用户与权限', requiresAuth: true, requiresAdmin: true },
      },
      {
        path: 'system',
        component: () => import('@/views/admin/SystemManage.vue'),
        meta: { title: '系统设置', requiresAuth: true, requiresAdmin: true },
      },
    ],
  },
  {
    path: '/:pathMatch(.*)*',
    component: () => import('@/views/errors/NotFound.vue'),
    meta: { title: '页面不存在', requiresAuth: false },
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior: () => ({ top: 0 }),
})

router.beforeEach((to, _from, next) => {
  const userStore = useUserStore()

  if (import.meta.env.DEV && !userStore.isLogin && to.meta.requiresAuth) {
    userStore.bootstrapDevUser()
  }

  if (to.meta.requiresAuth && !userStore.isLogin) {
    next('/login')
    return
  }

  if ((to.path === '/login' || to.path === '/register') && userStore.isLogin) {
    next(resolveHomeByRole(userStore.userInfo?.role))
    return
  }

  if (to.meta.requiresAdmin && !userStore.isAdmin) {
    next('/dashboard')
    return
  }

  if (userStore.isLogin && !userStore.isAdmin && String(to.path).startsWith('/admin')) {
    next('/dashboard')
    return
  }

  next()
})

router.afterEach((to) => {
  document.title = `${String(to.meta.title || '校园预约系统')} - Campus Appointment System`
  warmRouteChunks()
})

export default router
