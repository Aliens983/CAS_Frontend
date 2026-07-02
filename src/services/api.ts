import request from '@/utils/request'
import type { UserInfo } from '@/types'

// 用户相关API
export const userAPI = {
  // 获取图形验证码
  getGraphicCaptcha: () => {
    return request.get('/graphic/get')
  },

  // 登录
  login: (data: { email: string; password: string; captcha?: string }) => {
    return request.post('/login', data)
  },

  // 注册
  register: (data: { name: string; email: string; password: string; code: string; grade?: string; sex?: string }) => {
    return request.post('/register/verify-code', data)
  },

  // 登出
  logout: () => {
    return Promise.resolve()
  },

  // 获取用户信息
  getInfo: () => {
    return request.get('/user')
  },

  // 更新用户信息
  updateInfo: (data: Partial<UserInfo>) => {
    return request.post('/user/create', data)
  },

  // 修改密码
  changePassword: (data: { oldPassword: string; newPassword: string }) => {
    return request.put('/user/password', data)
  },

  // 发送邮箱验证码
  sendCaptcha: (email: string) => {
    return request.post('/email', { to: email })
  }
}

// 预约相关API
export const bookingAPI = {
  // 获取预约列表
  getBookings: (params: {
    page?: number
    pageSize?: number
    type?: string
    date?: string
    status?: string
  }) => {
    return request.get('/book/allService', { params })
  },

  // 获取预约详情
  getBooking: (id: string) => {
    return request.get(`/book/allService/${id}`)
  },

  // 创建预约
  createBooking: (data: { serviceIds: number[] }) => {
    return request.post('/book', data)
  },

  // 创建会议室预约
  createRoomBooking: (data: {
    roomId: string
    date: string
    startTime: string
    endTime: string
    purpose: string
    remarks?: string
  }) => {
    return request.post('/book/room', data)
  },

  // 创建设备预约
  createEquipmentBooking: (data: {
    equipmentId: string
    date: string
    startTime: string
    endTime: string
    purpose: string
    remarks?: string
  }) => {
    return request.post('/book/equipment', data)
  },

  // 创建咨询预约
  createConsultationBooking: (data: {
    consultantId: string
    date: string
    startTime: string
    endTime: string
    subject: string
    description: string
  }) => {
    return request.post('/book/consultation', data)
  },

  // 取消预约
  cancelBooking: (bookingId: string) => {
    return request.post('/book/cancel', { bookingIds: [Number(bookingId)] })
  },

  // 管理员审批预约
  approveBooking: (bookingId: string, status: 'approved' | 'rejected', remark?: string) => {
    const auditStatus = status === 'approved' ? 1 : 2
    const path = status === 'approved'
      ? '/admin/service-status/audit/pass'
      : '/admin/service-status/audit/reject'
    return request.post(path, { orderId: Number(bookingId), status: auditStatus, reason: remark || '' })
  }
}

// 会议室相关API (后端使用 /service)
export const roomAPI = {
  // 获取会议室列表
  getRooms: (params: {
    page?: number
    pageSize?: number
    type?: string
    capacity?: number
    available?: boolean
  }) => {
    return request.get('/service', { params })
  },

  // 获取会议室详情
  getRoom: (id: string) => {
    return request.get(`/service/${id}`)
  },

  // 获取可用会议室
  getAvailableRooms: (params: {
    date: string
    startTime: string
    endTime: string
    capacity?: number
  }) => {
    return request.get('/service', { params })
  }
}

// 设备相关API
export const equipmentAPI = {
  getEquipment: (params: {
    page?: number
    pageSize?: number
    category?: string
    available?: boolean
  }) => {
    return request.get('/equipment', { params })
  },
  getCategories: () => {
    return request.get('/equipment/categories')
  },
  getEquipmentDetail: (id: string) => {
    return request.get(`/equipment/${id}`)
  }
}

// 咨询相关API
export const consultationAPI = {
  getConsultants: (params: {
    page?: number
    pageSize?: number
    department?: string
    available?: boolean
  }) => {
    return request.get('/consultation', { params })
  },
  getConsultant: (id: string) => {
    return request.get(`/consultation/${id}`)
  },
  getAvailableTime: (consultantId: string, date: string) => {
    return request.get('/consultation/available', { params: { consultantId, date } })
  }
}

// 管理员相关API
export const adminAPI = {
  // 获取系统统计 (后端暂无此接口)
  // getStatistics: () => request.get('/admin/statistics')

  // 获取用户列表
  getUsers: (params: {
    page?: number
    pageSize?: number
    username?: string
    email?: string
    status?: string
  }) => {
    return request.get('/user/all_users', { params })
  },

  // 获取预约管理列表 (使用 service-status)
  getBookingManagement: (params: {
    page?: number
    pageSize?: number
    type?: string
    status?: string
    date?: string
  }) => {
    return request.get('/admin/service-status', { params })
  },

  // 获取日志列表 (后端暂无此接口)
  // getLogs: (params) => request.get('/admin/logs', { params })
}