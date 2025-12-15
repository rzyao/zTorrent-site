---
trigger: always_on
---

# zTorrent Site 前端项目规范

## 1. 技术栈概览 (Tech Stack Overview)

本项目采用现代化的 React 技术栈构建，追求极致的性能与开发体验。

- **核心框架**: React 19 + TypeScript
- **构建工具**: Vite 6.x
- **样式方案**: Tailwind CSS v4 + Radix UI Primitives (基于 Shadcn UI 架构)
- **图标库**: Lucide React
- **路由**: React Router v7
- **状态管理**:
  - **全局 UI 状态**: Zustand
  - **服务端状态/缓存**: TanStack Query (React Query)
- **表单处理**: React Hook Form + Zod (推荐)
- **HTTP 客户端**: Axios (配合 OpenAPI Code Generator)

## 2. 目录结构规范 (Directory Structure)

保持扁平且语义化的目录结构：

- src/api: **[自动生成]** OpenAPI 生成的 Service 和 Model，**严禁手动修改**。
- src/assets: 静态资源（图片、SVG 等）。
- src/components: 通用 UI 组件（如 Button, Dialog 等基础组件）。
- src/context: React Context 定义（用于非频繁更新的全局共享）。
- src/hooks: 自定义 React Hooks（业务逻辑复用）。
- src/layouts: 页面布局组件（如 MainLayout, AuthLayout）。
- src/pages: 页面级组件，与路由一一对应。
- src/routes: 路由配置文件。
- src/stores: Zustand Store 定义（全局状态）。
- src/types: 全局 TypeScript 类型定义。
- src/utils: 通用工具函数（如日期格式化、类名合并等）。

## 3. 开发规范 (Development Guidelines)

### 3.1 组件开发 (Components)

- **命名**: 文件名和组件名使用 **PascalCase** (例如 UserCard.tsx)。
- **形式**: 必须使用 **函数式组件 (Functional Components)**。
- **结构**:
  - 导出组件为 export function ComponentName 或 export const ComponentName。
  - Props 类型定义优先使用 interface，并以此作为组件参数类型。
- **原子化**: 保持组件单一职责，过大的组件应拆分为子组件。

### 3.2 样式与 UI (Styling & UI)

- **Tailwind 优先**: 严禁编写传统的 CSS/SCSS 文件（index.css 除外）。所有样式应通过 Tailwind Utility Class 实现。
- **类名合并**: 所有的条件样式必须使用 cn(...) (即 clsx + ailwind-merge) 工具函数，以确保类名优先级正确且无冲突。
- **响应式**: 遵循 **Mobile-First** 原则，先写移动端样式，再通过 md:, lg: 等断点适配桌面端。

### 3.3 状态管理 (State Management)

- **服务端数据**: 必须使用 **TanStack Query** (useQuery, useMutation)。
  - 禁止在组件中手动使用 useEffect + xios 请求数据。
  - 使用 Query Key 管理缓存失效。
- **全局 UI 状态**: 使用 **Zustand**。适用于 Sidebar 开关、多语言切换、主题切换等。
- **复杂本地状态**: 优先使用 useReducer 或提取为自定义 Hook。

### 3.4 类型安全 (Type Safety)

- **Strict Mode**: 项目已开启严格模式，**禁止使用 ny** 类型。
- **类型定义**: 优先利用自动生成的 API 类型（位于 src/api），避免手动重复定义接口返回与请求参数类型。

### 3.5 性能优化 (Performance)

- **按需加载**: 路由组件必须使用 React.lazy 或 React Router 的 lazy 属性进行代码分割。
- **重渲染控制**: 合理使用 useMemo 和 useCallback，特别是作为 Props 传递给子组件的对象和函数。

## 4. Git 提交规范 (Git Commit)

遵循 Conventional Commits 规范：

- feat: 新功能
- fix: 修复 Bug
- refactor: 代码重构（无功能变更）
- style: 样式调整
- docs: 文档变更
- chore: 构建过程或辅助工具的变动

**示例**: feat: 增加用户登录页面
