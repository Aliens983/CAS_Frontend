import request from '@/utils/request'
import type { AdminSummary, BookingRecord, ServiceCard, UserInfo } from '@/types'
import { normalizeRole, normalizeUserInfo } from '@/utils/auth'

type ApiService = {
  serviceId?: number
  serviceName?: string
  serviceDescribe?: string
  serviceState?: number
}

type ApiBooking = {
  orderId?: number
  serviceName?: string
  serviceDescribe?: string
  username?: string
  createTime?: string
  updateTime?: string
  manageStatus?: number
  statusDescription?: string
}

type ApiUser = {
  name?: string
  email?: string
  role?: string | number
}

const fallbackUser: UserInfo = {
  id: 1,
  username: '校园用户',
  email: 'user@campus.edu.cn',
  phone: '13800138000',
  role: 'user',
  department: '校园预约中心',
  createdAt: '2026-05-12 10:00:00',
}

const fallbackServices: ServiceCard[] = [
  {
    id: 1,
    code: 'CAS-001',
    name: '会议室预约',
    description: '支持校园会议室、答辩室和活动空间统一预约。',
    type: 'room',
    category: '空间资源',
    location: '校园统一预约中心',
    priceLabel: '当前可申请',
    status: 'available',
    tags: ['场地预约', '统一入口'],
    image: 'gradient-brand',
  },
  {
    id: 2,
    code: 'CAS-002',
    name: '设备借用',
    description: '支持投影仪、相机和音频设备借用申请。',
    type: 'equipment',
    category: '设备资源',
    location: '校园统一预约中心',
    priceLabel: '当前可申请',
    status: 'available',
    tags: ['设备借用', '库存联动'],
    image: 'gradient-teal',
  },
]

const fallbackBookings: BookingRecord[] = [
  {
    id: 1,
    bookingNo: 'BOOK-000001',
    serviceName: '会议室预约',
    type: 'room',
    applicant: fallbackUser.username,
    department: fallbackUser.department,
    location: '创新中心 A301',
    date: '2026-05-12',
    timeRange: '14:00 - 16:00',
    status: 'approved',
    createdAt: '2026-05-11 09:30:00',
    remarks: '项目评审会',
  },
]

const gradients = ['gradient-brand', 'gradient-teal', 'gradient-amber', 'gradient-slate'] as const

function getServiceType(name: string): ServiceCard['type'] {
  if (name.includes('会议') || name.includes('教室') || name.includes('场地')) return 'room'
  if (name.includes('设备') || name.includes('投影') || name.includes('相机')) return 'equipment'
  if (name.includes('咨询')) return 'consultation'
  return 'printing'
}

function mapUserRole(role: string | number | undefined): UserInfo['role'] {
  if (role === 2 || role === '2') return 'super_admin'
  if (role === 1 || role === '1') return 'admin'
  return normalizeRole(role)
}

function mapService(item: ApiService, index: number): ServiceCard {
  const serviceName = item.serviceName || `服务 ${index + 1}`
  const type = getServiceType(serviceName)

  return {
    id: Number(item.serviceId || index + 1),
    code: `CAS-${String(item.serviceId || index + 1).padStart(3, '0')}`,
    name: serviceName,
    description: item.serviceDescribe || '暂无服务说明',
    type,
    category:
      type === 'room' ? '空间资源' : type === 'equipment' ? '设备资源' : type === 'consultation' ? '咨询服务' : '综合服务',
    location: '校园统一预约中心',
    priceLabel: item.serviceState === 1 ? '当前可申请' : '暂不可申请',
    status: item.serviceState === 1 ? 'available' : 'maintenance',
    tags: ['后端接口', type === 'room' ? '场地预约' : type === 'equipment' ? '设备借用' : type === 'consultation' ? '咨询排班' : '综合办理'],
    image: gradients[index % gradients.length],
  }
}

function mapBooking(item: ApiBooking, index: number): BookingRecord {
  const status =
    item.manageStatus === 1
      ? 'approved'
      : item.manageStatus === 2
        ? 'rejected'
        : item.manageStatus === 3
          ? 'cancelled'
          : 'pending'
  const dateTime = String(item.createTime || '').replace('T', ' ')

  return {
    id: Number(item.orderId || index + 1),
    bookingNo: `BOOK-${String(item.orderId || index + 1).padStart(6, '0')}`,
    serviceName: item.serviceName || '未命名服务',
    type: getServiceType(item.serviceName || ''),
    applicant: item.username || fallbackUser.username,
    department: fallbackUser.department,
    location: item.serviceDescribe || '校园统一预约中心',
    date: dateTime.slice(0, 10) || '待定',
    timeRange: item.updateTime ? `${String(item.createTime || '').slice(11, 16)} - ${String(item.updateTime).slice(11, 16)}` : '待分配时段',
    status,
    createdAt: dateTime || '待定',
    remarks: item.statusDescription || item.serviceDescribe || '',
  }
}

export async function loadUserProfile() {
  try {
    const data = (await request.get('/user')) as ApiUser
    return normalizeUserInfo({
      ...data,
      username: data?.name,
      name: data?.name,
      role: mapUserRole(data?.role),
      department: fallbackUser.department,
      phone: fallbackUser.phone,
    })
  } catch {
    return fallbackUser
  }
}

export async function loadServiceCards() {
  try {
    const data = (await request.get('/service')) as ApiService[]
    return Array.isArray(data) && data.length ? data.map(mapService) : fallbackServices
  } catch {
    return fallbackServices
  }
}

export async function loadBookingRecords() {
  try {
    const response = (await request.get('/service-status/user')) as { serviceStatusList?: ApiBooking[] }
    const list = response?.serviceStatusList
    return Array.isArray(list) && list.length ? list.map(mapBooking) : fallbackBookings
  } catch {
    return fallbackBookings
  }
}

export async function loadAdminUsers() {
  try {
    const users = (await request.get('/user/all_users')) as ApiUser[]
    return Array.isArray(users) ? users : []
  } catch {
    return []
  }
}

export async function loadAdminSummary(): Promise<AdminSummary> {
  const [users, services, bookings] = await Promise.all([loadAdminUsers(), loadServiceCards(), loadBookingRecords()])
  const approvedCount = bookings.filter((item) => item.status === 'approved').length
  const total = bookings.length || 1

  return {
    totalUsers: users.length || 0,
    totalServices: services.length,
    activeBookings: bookings.filter((item) => ['pending', 'approved'].includes(item.status)).length,
    approvalRate: `${Math.round((approvedCount / total) * 1000) / 10}%`,
  }
}
