import request from '@/utils/request'
import type { UserInfo } from '@/types'

// 用户相关API
export const userAPI = {
  // 获取图形验证码
  getGraphicCaptcha: () => {
    return request.get('/graphic/get', { responseType: 'blob' })
  },
  
  // 登录
  login: (data: { username: string; password: string; captcha?: string }) => {
    return request.post('/auth/login', data)
  },
  
  // 注册
  register: (data: { username: string; email: string; password: string; confirmPassword?: string; captcha?: string }) => {
    return request.post('/auth/register', data)
  },
  
  // 登出
  logout: () => {
    return request.post('/auth/logout')
  },
  
  // 获取用户信息
  getInfo: () => {
    return request.get('/user/info')
  },
  
  // 更新用户信息
  updateInfo: (data: Partial<UserInfo>) => {
    return request.put('/user/info', data)
  },
  
  // 修改密码
  changePassword: (data: { oldPassword: string; newPassword: string }) => {
    return request.put('/user/password', data)
  },
  
  // 发送验证码
  sendCaptcha: (email: string) => {
    return request.post('/auth/captcha', { email })
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
    return request.get('/bookings', { params })
  },
  
  // 获取预约详情
  getBooking: (id: string) => {
    return request.get(`/bookings/${id}`)
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
    return request.post('/bookings/room', data)
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
    return request.post('/bookings/equipment', data)
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
    return request.post('/bookings/consultation', data)
  },
  
  // 取消预约
  cancelBooking: (id: string) => {
    return request.delete(`/bookings/${id}`)
  },
  
  // 管理员: 审批预约
  approveBooking: (id: string, status: 'approved' | 'rejected', remark?: string) => {
    return request.put(`/bookings/${id}/status`, { status, remark })
  }
}

// 会议室相关API
export const roomAPI = {
  // 获取会议室列表
  getRooms: (params: {
    page?: number
    pageSize?: number
    type?: string
    capacity?: number
    available?: boolean
  }) => {
    return request.get('/rooms', { params })
  },
  
  // 获取会议室详情
  getRoom: (id: string) => {
    return request.get(`/rooms/${id}`)
  },
  
  // 获取可用会议室
  getAvailableRooms: (params: {
    date: string
    startTime: string
    endTime: string
    capacity?: number
  }) => {
    return request.get('/rooms/available', { params })
  }
}

// 设备相关API
export const equipmentAPI = {
  // 获取设备列表
  getEquipment: (params: {
    page?: number
    pageSize?: number
    category?: string
    available?: boolean
  }) => {
    return request.get('/equipment', { params })
  },
  
  // 获取设备分类
  getCategories: () => {
    return request.get('/equipment/categories')
  },
  
  // 获取设备详情
  getEquipmentDetail: (id: string) => {
    return request.get(`/equipment/${id}`)
  }
}

// 咨询相关API
export const consultationAPI = {
  // 获取咨询师列表
  getConsultants: (params: {
    page?: number
    pageSize?: number
    department?: string
    available?: boolean
  }) => {
    return request.get('/consultants', { params })
  },
  
  // 获取咨询师详情
  getConsultant: (id: string) => {
    return request.get(`/consultants/${id}`)
  },
  
  // 获取咨询师可用时间
  getAvailableTime: (consultantId: string, date: string) => {
    return request.get(`/consultants/${consultantId}/available`, { params: { date } })
  }
}

// 管理员相关API
export const adminAPI = {
  // 获取系统统计
  getStatistics: () => {
    return request.get('/admin/statistics')
  },
  
  // 获取用户列表
  getUsers: (params: {
    page?: number
    pageSize?: number
    username?: string
    email?: string
    status?: string
  }) => {
    return request.get('/admin/users', { params })
  },
  
  // 获取预约管理列表
  getBookingManagement: (params: {
    page?: number
    pageSize?: number
    type?: string
    status?: string
    date?: string
  }) => {
    return request.get('/admin/bookings', { params })
  },
  
  // 获取日志列表
  getLogs: (params: {
    page?: number
    pageSize?: number
    type?: string
    startDate?: string
    endDate?: string
  }) => {
    return request.get('/admin/logs', { params })
  }
}