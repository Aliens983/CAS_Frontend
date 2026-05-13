<template>
  <div class="auth-page">
    <div class="auth-shell">
      <section class="auth-hero">
        <span class="status-pill is-brand">性能已优化</span>
        <h1>校园预约系统</h1>
        <p>登录后按角色分流到用户端或管理端。当前前端优先联调了登录、用户信息、服务列表和预约状态接口。</p>
      </section>

      <section class="auth-card">
        <div class="auth-card__head">
          <h2>登录</h2>
          <p>后端当前以邮箱 + 密码登录，验证码图片已接通。</p>
        </div>

        <el-form ref="formRef" :model="form" :rules="rules" size="large">
          <el-form-item prop="email">
            <el-input v-model="form.email" placeholder="邮箱" />
          </el-form-item>
          <el-form-item prop="password">
            <el-input v-model="form.password" type="password" show-password placeholder="密码" />
          </el-form-item>
          <el-form-item prop="captcha">
            <div class="captcha-row">
              <el-input v-model="form.captcha" placeholder="图形验证码" />
              <div class="captcha-box" @click="refreshCaptcha">
                <img v-if="captchaImage" :src="captchaImage" alt="captcha" />
                <span v-else>获取验证码</span>
              </div>
            </div>
          </el-form-item>

          <el-button type="primary" class="submit-btn" :loading="loading" @click="submit">登录并进入系统</el-button>

          <div class="auth-footer">
            <span>还没有账号？</span>
            <el-link type="primary" @click="router.push('/register')">去注册</el-link>
          </div>
        </el-form>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, type FormInstance, type FormRules } from 'element-plus'
import request from '@/utils/request'
import { useUserStore } from '@/stores/user'
import { extractToken, resolveHomeByRole } from '@/utils/auth'
import { loadUserProfile } from '@/services/portal'

const router = useRouter()
const userStore = useUserStore()
const formRef = ref<FormInstance>()
const loading = ref(false)
const captchaImage = ref('')

const form = reactive({
  email: '',
  password: '',
  captcha: '',
})

const rules: FormRules = {
  email: [{ required: true, message: '请输入邮箱', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
  captcha: [{ required: true, message: '请输入图形验证码', trigger: 'blur' }],
}

async function refreshCaptcha() {
  try {
    const response = await request.get('/graphic/get') as unknown as { uuid: string; image: string }
    captchaImage.value = response.image
  } catch {
    captchaImage.value = ''
  }
}

async function submit() {
  await formRef.value?.validate()
  loading.value = true

  try {
    const loginResult = await request.post<string>('/login', {
      email: form.email,
      password: form.password,
    })

    const token = extractToken(loginResult) || String(loginResult || '')
    userStore.setToken(token)
    userStore.setUserInfo(await loadUserProfile())
    ElMessage.success('登录成功')
    router.push(resolveHomeByRole(userStore.userInfo?.role))
  } catch (error: unknown) {
    const err = error as { message?: string }
    ElMessage.error(err.message || '登录失败，请检查账号、密码或身份接口')
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  void refreshCaptcha()
})
</script>

<style scoped lang="scss">
.auth-page {
  min-height: 100vh;
  padding: 28px;
  display: grid;
  place-items: center;
}

.auth-shell {
  width: min(1100px, 100%);
  display: grid;
  grid-template-columns: 1fr 460px;
  border-radius: 28px;
  overflow: hidden;
  box-shadow: 0 28px 70px rgba(16, 24, 40, 0.16);
}

.auth-hero {
  padding: 44px;
  color: #fff;
  background: linear-gradient(145deg, #0b1e3a, #1458d4 56%, #58a4ff);
}

.auth-hero h1 {
  margin: 18px 0 12px;
  font-size: 44px;
}

.auth-hero p {
  margin: 0;
  max-width: 520px;
  line-height: 1.8;
  color: rgba(255, 255, 255, 0.86);
}

.auth-card {
  padding: 40px;
  background: rgba(255, 255, 255, 0.98);
}

.auth-card__head h2 {
  margin: 0 0 8px;
}

.auth-card__head p {
  margin: 0 0 24px;
  color: var(--text-secondary);
}

.captcha-row {
  display: grid;
  grid-template-columns: 1fr 120px;
  gap: 10px;
  width: 100%;
}

.captcha-box {
  height: 40px;
  display: grid;
  place-items: center;
  border-radius: 10px;
  border: 1px solid var(--border-soft);
  background: #fff;
  overflow: hidden;
  cursor: pointer;
}

.captcha-box img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.submit-btn {
  width: 100%;
}

.auth-footer {
  margin-top: 18px;
  display: flex;
  justify-content: space-between;
}

@media (max-width: 960px) {
  .auth-shell {
    grid-template-columns: 1fr;
  }
}
</style>
