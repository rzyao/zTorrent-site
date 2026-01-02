# 导航进度条实施计划 (Navigation Progress Bar Implementation Plan)

## Phase 1: 基础设施 (Infrastructure)

- [ ] **Step 1.1**: 安装依赖
  - `npm install nprogress`
  - `npm install -D @types/nprogress`
- [ ] **Step 1.2**: 配置样式
  - 编辑 `src/index.css`
  - 添加 `#nprogress` 相关样式 (Color, Height, Box-shadow)
  - 确保 `pointer-events: none`

## Phase 2: 组件开发 (Component Development)

- [ ] **Step 2.1**: 创建 `RouteProgressBar`
  - 路径: `src/components/ui/RouteProgressBar.tsx`
  - 逻辑: 在 Mount 时 `NProgress.start()`，Unmount 时 `NProgress.done()`
  - 配置: `NProgress.configure({ showSpinner: false })`

## Phase 3: 路由改造 (Router Refactor)

- [ ] **Step 3.1**: 改造 `ForumLayout.tsx`
  - 引入 `RouteProgressBar`
  - 将 `<Outlet />` 用 `<Suspense fallback={<RouteProgressBar />}>` 包裹
- [ ] **Step 3.2**: 改造 `AppLayout.tsx`
  - 引入 `RouteProgressBar`
  - 将 `<Outlet />` 用 `<Suspense fallback={<RouteProgressBar />}>` 包裹
- [ ] **Step 3.3**: 验证 `AppRoutes.tsx`
  - 确认顶层 `Suspense` 依然存在以处理首屏加载

## Phase 4: 验证与优化 (Verification)

- [ ] **Step 4.1**: 交互测试
  - 验证首屏加载是否正常
  - 验证论坛内跳转是否为顶部进度条
  - 验证 App 内跳转是否为顶部进度条
