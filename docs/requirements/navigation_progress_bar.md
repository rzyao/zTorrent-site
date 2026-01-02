# 导航进度条优化需求文档 (Navigation Progress Bar PRD)

## 1. 项目背景与目标 (Project Background)

- **背景**: 当前 ZTorrent Site 前端项目在所有路由/页面跳转时，均会触发位于顶层的 `<Suspense>` 边界，导致显示全屏遮罩 (`FullScreenLoader`)。这使得侧边栏 (Sidebar) 和顶部导航栏 (Header) 在跳转过程中消失，造成页面“闪烁”感，用户体验产生割裂，不符合 Discourse 等现代 SPA 论坛的流畅体验标准。
- **目标**: 优化页面加载体验，实现类似 Discourse 的导航反馈。
  - **首屏加载**: 保持全屏动画，掩盖资源加载过程。
  - **站内导航**: 点击链接跳转时，保持 UI 框架（侧边栏/顶栏）不动，仅在顶部显示微交互进度条，内容区域进行局部刷新或骨架屏占位。

## 2. 核心需求 (Core Requirements)

### 2.1 触发机制

- **首屏加载 (Initial Load)**: 用户首次访问网站（刷新浏览器）时，显示现有的 `FullScreenLoader` (Logo + 转圈动画)。
- **路由切换 (Navigation)**: 用户在站内点击链接（如从论坛首页跳到话题详情）时，**禁止**出现全屏遮罩，改为在页面最顶部显示线性进度条。

### 2.2 样式规范

- **组件选型**: 使用 `nprogress` 库（业界标准）。
- **位置**: 浏览器视口顶部固定 (Fixed Top, z-index 最高)。
- **颜色**:
  - **Light Mode**: Amber-500 (#f59e0b)
  - **Dark Mode**: Amber-500 (#f59e0b) (保持品牌色一致性，高对比度)。
- **视觉**:
  - 移除默认的 Spinner (右上角转圈)，仅保留水平进度条。
  - 进度条高度约为 2px - 3px。
  - 添加阴影 (Peg) 效果，增加动态感。

### 2.3 交互细节

- **布局稳定性**: 切换页面时，`Header` 和 `Sidebar` 应当保持可见，不应被 Unmount 或重新渲染。
- **降级策略**: 如果某个 Lazy Load 的页面加载极快，进度条可能瞬间完成，这是可接受的。

## 3. 技术方案 (Technical Implementation)

### 3.1 依赖引入

- 安装 `nprogress` 及其类型定义 `@types/nprogress`。

### 3.2 组件设计

- **`src/components/ui/RouteProgressBar.tsx`**:
  - 封装 `nprogress` 的逻辑。
  - 这是一个功能性组件，用于作为 `<Suspense>` 的 `fallback`。
  - **Lifecycle**:
    - `useEffect` Mount: 调用 `NProgress.start()`。
    - `useEffect` Unmount: 调用 `NProgress.done()`。
  - **Render**: 返回 `null` (因为它只负责控制全局进度条，不渲染实际 DOM 元素) 或一个极简的不可见占位符。

### 3.3 路由架构改造

- **`src/routes/AppRoutes.tsx`**:
  - 顶层 `Suspense` (`FullScreenLoader`) 保持不变，用于捕获第一层路由（如 `Login`, `AppLayout`, `ForumLayout` 本身）的代码分割加载。
- **`src/pages/Forums/layouts/ForumLayout.tsx`**:
  - 在 `<Outlet />` 外层包裹新的 `<Suspense fallback={<RouteProgressBar />}>`。
  - 这样，当加载论坛子页面（如 `TopicDetail`）时，React 会优先匹配到这个较近的 Suspense 边界，从而只显示进度条，而不触发顶层的全屏 Loader。
- **`src/layouts/AppLayout.tsx`**:
  - 同样在 `<Outlet />` 外层包裹 `<Suspense fallback={<RouteProgressBar />}>`。

### 3.4 样式覆盖

- 在 `src/index.css` 中添加 `#nprogress` 的自定义样式，覆盖默认的蓝色，应用 Tailwind 的 Theme Colors。

## 4. 验收标准 (Acceptance Criteria)

1.  **全局刷新**: 访问首页，看到 FULL SCREEN LOADER，加载完成后消失。
2.  **论坛导航**: 在论坛首页点击任意“话题”，页面**不**变白，Sidebar 保持在左侧，顶部出现橙色进度条，随后内容区更新为话题详情。
3.  **App 导航**: 在 App 首页点击“电影” tab，顶部出现橙色进度条，导航栏保持不动。
4.  **主题切换**: 切换到暗黑模式，进度条依然清晰可见 (Amber-500)。
