# Ant Design 移除计划 (Ant Design Removal Plan)

## 1. 项目目标 (Project Goals)

本计划旨在从 Admin 模块中完全移除 `antd` 和 `@ant-design/*` 依赖，实现 UI 风格的统一，降低包体积，并消除遗留技术债。

## 2. 组件替换策略 (Replacement Strategy)

### 2.1 核心组件映射 (Core Components)

| Antd 组件                | 目标组件/库 (Target)                            | 备注 (Notes)                                                                                |
| :----------------------- | :---------------------------------------------- | :------------------------------------------------------------------------------------------ |
| **Modal**                | `@/modules/admin/components/ui/dialog`          | 使用 Radix UI Primitives 封装的 Dialog。需注意 `open` vs `visible` 的属性差异。             |
| **Form**                 | `react-hook-form` + `zod`                       | 不再使用 Antd 的 Form.Item。验证逻辑迁移至 Zod Schema。                                     |
| **Input / Select**       | `@/modules/admin/components/ui/input`, `select` | 使用 Shadcn UI 风格的原子组件。Select 组件需特别注意 `onValueChange` 与 `onChange` 的差异。 |
| **Table**                | `@/modules/admin/components/ui/data-table`      | 基于 TanStack Table (React Table v8)。需重定义 columns 结构。                               |
| **Pagination**           | `DataTable` 内置分页                            | TanStack Table 自带分页逻辑，UI 使用 Pagination 组件。                                      |
| **Tree**                 | 自研 `PermissionTree` / `RouteTree`             | 需移除 Antd Tree，改为手动构建递归组件或寻找轻量级 Headless 替代品。                        |
| **Icons**                | `lucide-react`                                  | 手动查找对应图标进行替换。                                                                  |
| **Message/Notification** | `sonner` (toast)                                | 替换 `antd/message`。                                                                       |
| **Spin/Loading**         | `@/modules/admin/components/ui/spinner`         | 简单的 Loading 动画组件。                                                                   |

### 2.2 关键行为差异 (Critical Behavior Changes)

1.  **受控 vs 非受控**: `react-hook-form` 推荐非受控模式 (register)，而 Antd Form 深度受控。
2.  **验证时机**: Zod 验证通常在 submit 时或 onBlur 时触发，与 Antd 的即时验证体验略有不同，需配置 RHF 的 `mode`。
3.  **弹窗销毁**: Antd Modal 默认 `destroyOnClose={false}` (需手动设为 true)，自定义 Dialog 通常随组件卸载而销毁，状态重置需在 `onOpenChange` 中处理。

## 3. 分阶段实施计划 (Phased Implementation Plan)

### Phase 0: 基础设施解耦 (Infrastructure)

优先解决全局性的工具和样式依赖，防止牵一发而动全身。

- [x] **Global Message**: 重构 `src/modules/admin/utils/globalMessage.ts`，不再依赖 `antd/message`，改为封装 `sonner`。
- [ ] **Styles**: 清理 `admin.css` 和 `admin-theme.css` 中对 Antd 类名的覆盖。

### Phase 1: 公共组件模块 (Shared Components)

优先替换被多处引用的公共组件，具有高杠杆效应。

- [ ] **Users**:
  - [x] `EditUserModal.tsx`
  - [x] `BanUserModal.tsx`
  - [x] `AssignRolesModal.tsx`
  - [x] `AdvancedSearchModal.tsx`
  - [x] `UsersTable.tsx` (Table & Pagination)
- [ ] **Categories**:
  - [x] `CategoryModals.tsx`

### Phase 2: 复杂业务模块 (Complex Modules)

针对重灾区进行集中攻坚。

- [ ] **Users & Security**:
  - [ ] `RolesPage` (Table, Modal, Permissions)
  - [ ] `PermissionsPage` (Tree Component 重写)
- [ ] **System Routes**:
  - [ ] `RouteTree.tsx` (Tree Component 重写)
  - [ ] `CreateRouteModal.tsx`

### Phase 3: 剩余页面清扫 (Cleanup)

处理零散的页面。

- [ ] **Operations**: `TicketsPage`, `SendInvitePage`, `InvitesListPage`.
- [ ] **Economy**: `StoreItemsPage`, `Bonus` 相关 Modals.
- [ ] **Content**: `TorrentsList` 及其 Modals.
- [ ] **Layouts**: `KeepAliveTabs` (Tabs 组件), `Dashboard` (Cards).

## 4. 执行标准 (Execution Standards)

所有重构必须遵循以下标准：

1.  **文件名**: 使用 PascalCase 命名组件。
2.  **Hook 分离**: 必须将业务逻辑提取到 custom hook (e.g., `useUsersLogic.ts`)，组件只负责 UI 渲染。
3.  **类型安全**: 严禁使用 `any`，必须定义 Props 接口。
4.  **UI 规范**: 严格遵循 `docs/admin-design-system.md` 中的按钮变体和颜色规范。
