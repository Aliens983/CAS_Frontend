import request from '@/utils/request'
import { bookings as mockBookings, currentUser, services as mockServices } from '@/mock/campus-data'
import type { AdminSummary, BookingRecord, ServiceCard, UserInfo } from '@/types'
import { normalizeRole, normalizeUserInfo } from '@/utils/auth'

type BackendService = {
  serviceId?: number
  serviceName?: string
  serviceDescribe?: string
  serviceState?: number
}

type BackendBooking = {
  orderId?: number
  serviceName?: string
  serviceDescribe?: string
  username?: string
  createTime?: string
  updateTime?: string
  manageStatus?: number
  statusDescription?: string
}

type BackendUser = {
  name?: string
  email?: string
  role?: string | number
}

const serviceGradients = ['gradient-brand', 'gradient-teal', 'gradient-amber', 'gradient-slate'] as const

function getServiceType(name: string): ServiceCard['type'] {
  if (name.includes('会议') || name.includes('教室') || name.includes('场地')) return 'room'
  if (name.includes('设备') || name.includes('投影') || name.includes('相机')) return 'equipment'
  if (name.includes('咨询')) return 'consultation'
  return 'printing'
}

function mapService(item: BackendService, index: number): ServiceCard {
  const serviceName = item.serviceName || `服务 ${index + 1}`
  const type = getServiceType(serviceName)

  return {
    id: Number(item.serviceId || index + 1),
    code: `CAS-${String(item.serviceId || index + 1).padStart(3, '0')}`,
    name: serviceName,
    description: item.serviceDescribe || '暂无服务说明，后续可由后台补充完整描述。',
    type,
    category:
      type === 'room' ? '空间资源' : type === 'equipment' ? '设备资源' : type === 'consultation' ? '咨询服务' : '综合服务',
    location: '校园统一预约中心',
    priceLabel: item.serviceState === 1 ? '当前可申请' : '暂不可申请',
    status: item.serviceState === 1 ? 'available' : 'maintenance',
    tags: [type === 'room' ? '场地预约' : type === 'equipment' ? '设备借用' : type === 'consultation' ? '咨询排班' : '综合办理', '后端已联调'],
    image: serviceGradients[index % serviceGradients.length],
  }
}

function mapBooking(item: BackendBooking, index: number): BookingRecord {
  const status =
    item.manageStatus === 1
      ? 'approved'
      : item.manageStatus === 2
        ? 'rejected'
        : item.manageStatus === 3
          ? 'cancelled'
          : 'pending'
  const dateText = item.createTime ? String(item.createTime).replace('T', ' ') : ''

  return {
    id: Number(item.orderId || index + 1),
    bookingNo: `BOOK-${String(item.orderId || index + 1).padStart(6, '0')}`,
    serviceName: item.serviceName || '未命名服务',
    type: getServiceType(item.serviceName || ''),
    applicant: item.username || currentUser.username,
    department: currentUser.department,
    location: item.serviceDescribe || '校园统一预约中心',
    date: dateText.slice(0, 10) || '待定',
    timeRange: item.updateTime ? `${String(item.createTime || '').slice(11, 16)} - ${String(item.updateTime).slice(11, 16)}` : '待分配时段',
    status,
    createdAt: dateText || '待定',
    remarks: item.statusDescription || item.serviceDescribe || '',
  }
}

function mapRole(role: string | number | undefined): UserInfo['role'] {
  if (role === 2 || role === '2') return 'super_admin'
  if (role === 1 || role === '1') return 'admin'
  return normalizeRole(role)
}

export async function fetchUserProfile() {
  try {
    const data = (await request.get('/user')) as BackendUser
    return normalizeUserInfo({
      ...data,
      username: data?.name,
      name: data?.name,
      role: mapRole(data?.role),
      department: currentUser.department,
      phone: currentUser.phone,
    })
  } catch {
    return currentUser
  }
}

export async function fetchServiceCards() {
  try {
    const data = (await request.get('/service')) as BackendService[]
    if (!Array.isArray(data) || data.length === 0) {
      return mockServices
    }
    return data.map(mapService)
  } catch {
    return mockServices
  }
}

export async function fetchBookingRecords() {
  try {
    const response = (await request.get('/service-status/user')) as { serviceStatusList?: BackendBooking[] }
    const list = response?.serviceStatusList
    if (!Array.isArray(list) || list.length === 0) {
      return mockBookings
    }
    return list.map(mapBooking)
  } catch {
    return mockBookings
  }
}

export async function fetchAdminUsers() {
  try {
    const data = (await request.get('/user/all_users')) as BackendUser[]
    return Array.isArray(data) ? data : []
  } catch {
    return []
  }
}

export async function fetchAdminSummary(): Promise<AdminSummary> {
  const [users, services, bookings] = await Promise.all([fetchAdminUsers(), fetchServiceCards(), fetchBookingRecords()])
  const approvedCount = bookings.filter((item) => item.status === 'approved').length
  const total = bookings.length || 1

  return {
    totalUsers: users.length || 3892,
    totalServices: services.length,
    activeBookings: bookings.filter((item) => item.status === 'pending' || item.status === 'approved').length,
    approvalRate: `${Math.round((approvedCount / total) * 1000) / 10}%`,
  }
}
