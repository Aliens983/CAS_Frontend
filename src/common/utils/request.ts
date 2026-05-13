import axios, { type AxiosInstance, type AxiosResponse, type InternalAxiosRequestConfig } from 'axios'
import { ElMessage } from 'element-plus'
import { useUserStore } from '@/common/stores/user'

const request: AxiosInstance = axios.create({
  baseURL: '/api',
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
})

request.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const userStore = useUserStore()
    if (userStore.token) {
      config.headers.Authorization = `Bearer ${userStore.token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

request.interceptors.response.use(
  (response: AxiosResponse) => {
    const { data } = response

    if (typeof data === 'string') {
      return data
    }

    if (data.code !== undefined && data.code !== 200) {
      const msg = data.msg || data.message || '请求失败'
      ElMessage.error(msg)
      return Promise.reject(new Error(msg))
    }

    return data.data !== undefined ? data.data : data
  },
  (error) => {
    const status = error.response?.status
    const msg = error.response?.data?.msg || error.response?.data?.message || error.message

    if (status === 401) {
      ElMessage.error('登录已过期，请重新登录')
      const userStore = useUserStore()
      userStore.logout()
      window.location.href = '/login'
    } else if (status === 403) {
      ElMessage.error('没有权限访问该资源')
    } else if (status === 404) {
      ElMessage.error('请求的资源不存在')
    } else if (status === 500) {
      ElMessage.error('服务器内部错误')
    } else {
      ElMessage.error(msg || '网络请求失败')
    }

    return Promise.reject(error)
  },
)

export default request