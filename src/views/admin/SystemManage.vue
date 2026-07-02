<template>
  <div class="page-shell">
    <section class="page-hero">
      <div>
        <div class="status-pill is-brand">系统设置</div>
        <h1 class="page-hero__title">统一配置预约策略、通知规则和业务约束</h1>
        <p class="page-hero__desc">
          这一页作为全局配置中枢，后续适合接系统参数、预约规则、字典项和通知策略接口。
        </p>
      </div>
    </section>

    <section class="admin-overview">
      <article class="overview-card">
        <span>策略分组</span>
        <strong>3</strong>
        <small>预约、通知、约束统一管理</small>
      </article>
      <article class="overview-card">
        <span>启用通知</span>
        <strong>2</strong>
        <small>当前保留站内信和邮件提醒</small>
      </article>
      <article class="overview-card">
        <span>配置状态</span>
        <strong>稳定</strong>
        <small>适合继续接入后端配置读写接口</small>
      </article>
    </section>

    <section class="grid-cards">
      <el-card class="panel-card span-6">
        <template #header>
          <div class="section-head">
            <h3 class="section-head__title">预约策略</h3>
          </div>
        </template>
        <div class="setting-stack">
          <div class="setting-item">
            <div>
              <strong>最早可预约时间</strong>
              <p>用于控制用户最远提前预约范围</p>
            </div>
            <el-input model-value="提前 7 天" />
          </div>
          <div class="setting-item">
            <div>
              <strong>默认审批模式</strong>
              <p>不同业务可继续扩展为多级审批策略</p>
            </div>
            <el-select model-value="部门审批">
              <el-option label="部门审批" value="部门审批" />
              <el-option label="系统自动通过" value="系统自动通过" />
            </el-select>
          </div>
          <div class="setting-item setting-item--switch">
            <div>
              <strong>超时自动取消</strong>
              <p>未确认或逾期使用的预约自动释放资源</p>
            </div>
            <el-switch model-value />
          </div>
        </div>
      </el-card>

      <el-card class="panel-card span-6">
        <template #header>
          <div class="section-head">
            <h3 class="section-head__title">通知策略</h3>
          </div>
        </template>
        <div class="setting-stack">
          <div class="setting-item setting-item--switch">
            <div>
              <strong>站内通知</strong>
              <p>审批结果、系统公告和预约提醒</p>
            </div>
            <el-switch model-value />
          </div>
          <div class="setting-item setting-item--switch">
            <div>
              <strong>短信提醒</strong>
              <p>适合时效性更高的审核和即将开始通知</p>
            </div>
            <el-switch />
          </div>
          <div class="setting-item setting-item--switch">
            <div>
              <strong>邮件通知</strong>
              <p>适合留痕和正式通知场景</p>
            </div>
            <el-switch model-value />
          </div>
        </div>
      </el-card>
    </section>
  </div>
</template>

<style scoped lang="scss">
.admin-overview {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
}

.overview-card {
  position: relative;
  display: grid;
  gap: 8px;
  padding: 22px;
  border-radius: 22px;
  background: rgba(255, 255, 255, 0.92);
  border: 1px solid var(--border-soft);
  box-shadow: var(--shadow-card);
  overflow: hidden;
  transition: transform 0.26s ease, box-shadow 0.26s ease;
}

.overview-card::after {
  content: '';
  position: absolute;
  inset: auto -24px -24px auto;
  width: 92px;
  height: 92px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(20, 88, 212, 0.08), rgba(20, 88, 212, 0));
  pointer-events: none;
}

.overview-card:hover {
  transform: translateY(-6px);
  box-shadow: var(--shadow-card-hover);
}

.overview-card span,
.overview-card small {
  color: var(--text-secondary);
}

.overview-card strong {
  font-size: 34px;
}

.span-6 {
  grid-column: span 6;
}

.setting-stack {
  display: grid;
  gap: 14px;
}

.setting-item {
  display: grid;
  gap: 10px;
  padding: 18px;
  border-radius: 20px;
  border: 1px solid var(--border-soft);
  background: linear-gradient(180deg, #fff, #f8fbff);
  transition: transform 0.24s ease, box-shadow 0.24s ease;
}

.setting-item:hover {
  transform: translateY(-4px);
  box-shadow: 0 18px 28px rgba(20, 33, 61, 0.1);
}

.setting-item p {
  margin: 4px 0 0;
  color: var(--text-secondary);
  font-size: 13px;
  line-height: 1.7;
}

.setting-item--switch {
  grid-template-columns: 1fr auto;
  align-items: center;
}

@media (max-width: 1200px) {
  .admin-overview {
    grid-template-columns: 1fr;
  }

  .span-6 {
    grid-column: span 12;
  }
}

@media (max-width: 760px) {
  .setting-item--switch {
    grid-template-columns: 1fr;
  }
}
</style>
