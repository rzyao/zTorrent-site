# Header Refactor & Dynamic Configuration Implementation Plan

基于 [PRD-Header-Refactor](./PRD-Header-Refactor.md) 文档制定的实施计划。

## Phase 1: Backend - Navigation Module Setup (后端开发)

> **注意**: 本阶段需在后端仓库执行，此处列出以确保前后端对接顺畅。

### Task 1.1: Create Navigation Module & Entity

- **ID**: 1.1
- **Description**: 创建 `Navigation` 模块及数据库实体。
- **Subtasks**:
  - [x] 定义 `NavigationItem` 实体 (UUID, platform, label, path, required_roles, sort_order, is_visible)。
  - [x] 创建数据库迁移脚本 `create_navigation_table` (自动同步，无需脚本)。

### Task 1.2: Implement CRUD Service

- **ID**: 1.2
- **Depends On**: 1.1
- **Description**: 实现核心业务逻辑服务。
- **Subtasks**:
  - [x] `findAll(platform)`: 按 `sort_order` 排序返回。
  - [x] `updateBatch(items)`: 批量更新排序和属性。

### Task 1.3: Public API (User Side)

- **ID**: 1.3
- **Depends On**: 1.2
- **Description**: 用户端获取导航配置接口。
- **Context**:
  - `GET /api/navigation`
  - 核心逻辑：`item.requiredRoles.some(role => user.roles.includes(role))` 过滤。

### Task 1.4: Admin API (Management Side)

- **ID**: 1.4
- **Depends On**: 1.2
- **Description**: 管理端配置接口。
- **Context**:
  - `GET /api/admin/navigation`: 返回所有项。
  - `PUT /api/admin/navigation/batch`: 批量保存。

---

## Phase 2: Frontend - Infrastructure (前端基建)

### Task 2.1: API SDK Generation

- **ID**: 2.1
- **Depends On**: 1.3, 1.4
- **Description**: 更新前端 API 客户端定义。
- **Actions**:
  - [x] 等待后端 Swagger 更新。
  - [x] 运行 `npm run api:generate` (或相应命令) 生成 `NavigationService`。

### Task 2.2: Mock Data & Types

- **ID**: 2.2
- **Description**: (可选，若后端未就绪) 定义前端 TypeScript 类型和 Mock 数据。
- **Subtasks**:
  - [x] 在 `src/types/navigation.ts` 定义 `NavigationItem` 接口。
  - [x] 创建 `src/mocks/navigationData.ts` 包含默认桌面/移动端配置。

### Task 2.3: `useNavigation` Hook

- **ID**: 2.3
- **Depends On**: 2.1
- **Description**: 封装导航数据获取逻辑。
- **Context**:
  - 文件: `src/hooks/useNavigation.ts`
  - 使用 `useQuery` 缓存数据 'navigation'。
  - 实现 `fallbackData`：当 API 加载中或失败时，可选择返回 Mock 数据或空。

---

## Phase 3: Frontend - Header Component Refactor (组件重构)

### Task 3.1: Create Sub-components (Atomic)

- **ID**: 3.1
- **Description**: 拆分 `Header.tsx` 为独立组件。
- **Files**:
  - `src/layouts/header/components/NavDropdown.tsx`: 下拉菜单容器。
  - `src/layouts/header/components/UserMenu.tsx`: 用户头像及下拉菜单。
  - `src/layouts/header/components/DesktopNavItem.tsx`: 单个导航项组件。

### Task 3.2: Implement `DesktopNav`

- **ID**: 3.2
- **Depends On**: 2.3, 3.1
- **Description**: 组装桌面端导航栏。
- **Context**:
  - 读取 `useNavigation().desktop` 数据。
  - 遍历渲染 `DesktopNavItem`。
  - **骨架屏**: 当 `isLoading` 为 true 时，使用 `Skeleton` 组件占位（仅针对需权限项，或整体占位）。

### Task 3.3: Implement `MobileNav`

- **ID**: 3.3
- **Depends On**: 2.3
- **Description**: 组装移动端侧边栏。
- **Context**:
  - 读取 `useNavigation().mobile` 数据。
  - 保持现有滑动抽屉交互体验。

### Task 3.4: Rebuild `Header.tsx`

- **ID**: 3.4
- **Depends On**: 3.2, 3.3
- **Description**: 将主 `Header` 组件重写为容器组件。
- **Actions**:
  - [x] 移除硬编码的 `<NavLink>`。
  - [x] 引入 `<DesktopNav />` 和 `<MobileNav />`。
  - [x] 确保 Logo 和 UserPanel 布局正常。

---

## Phase 4: Frontend - Admin Dashboard (管理后台)

### Task 4.1: Setup Admin Page

- **ID**: 4.1
- **Description**: 创建导航管理页面路由和基础布局。
- **Files**:
  - `src/pages/admin/NavigationSettings.tsx`
  - 路由: `/admin/settings/navigation`

### Task 4.2: Draggable List UI

- **ID**: 4.2
- **Depends On**: 4.1
- **Description**: 实现可拖拽排序的列表。
- **Tech**: 推荐使用 `@dnd-kit/core` 或 `react-beautiful-dnd`（如果项目中已有）。
- **Features**:
  - 列表项显示：Label, Path, Visibility Switch, Roles Tags。

### Task 4.3: Edit Dialog

- **ID**: 4.3
- **Depends On**: 4.1
- **Description**: 编辑单个导航项详情的弹窗。
- **Fields**: Label, Path, Required Roles (Select), Is Visible.

### Task 4.4: Save Integration

- **ID**: 4.4
- **Depends On**: 4.2, 4.3
- **Description**: 对接批量保存接口。
- **Action**: 提交变更后的数组到 `PUT /api/admin/navigation/batch`。
