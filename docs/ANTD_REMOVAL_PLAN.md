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
| **Tree**                 | 自研 `PermissionTree` / `RouteTree`             | 采用了 `react-arborist` 进行树形数据处理。                                                  |
| **Icons**                | `lucide-react`                                  | 已移除 `@ant-design/icons`。                                                                |
| **Message/Notification** | `sonner` (toast)                                | 替换 `antd/message`。                                                                       |
| **Spin/Loading**         | `@/modules/admin/components/ui/spinner`         | 简单的 Loading 动画组件。                                                                   |

### 2.2 关键行为差异 (Critical Behavior Changes)

1.  **受控 vs 非受控**: `react-hook-form` 推荐非受控模式 (register)，而 Antd Form 深度受控。
2.  **验证时机**: Zod 验证通常在 submit 时或 onBlur 时触发，与 Antd 的即时验证体验略有不同，需配置 RHF 的 `mode`。
3.  **弹窗销毁**: Antd Modal 默认 `destroyOnClose={false}` (需手动设为 true)，自定义 Dialog 通常随组件卸载而销毁，状态重置需在 `onOpenChange` 中处理。

## 3. 分阶段实施状况 (Phased Implementation Status)

### Phase 0: 基础设施解耦 (Infrastructure) - [100%]

- [x] **Global Message**: 重构 `src/modules/admin/utils/globalMessage.ts`，不再依赖 `antd/message`，改为封装 `sonner`。
- [x] **Styles**: 清理 `admin.css` 中对 Antd 类名 (.ant-layout 等) 的覆盖。
- [x] **Layout**: 移除 `AdminLayout` 中的 `ConfigProvider` 和 `App` 组件。
- [x] **Theme**: 完全移除 `SiteConfigProvider` 中的 Antd 主题注入。

### Phase 1: 公共组件模块 (Shared Components) - [100%]

- [x] **Users**: 全面重构 Users 管理相关 Modals 及 Table。
- [x] **Categories**: 分类管理模块重构。
- [x] **Shared UI**: Input, Button, Modal, Tag 等组件全部完成原子化重写。

### Phase 2: 复杂业务模块 (Complex Modules) - [100%]

- [x] **Users & Security**: RolesPage, PermissionsPage 全部完成 Lucide 图标适配及 RHF 迁移。
- [x] **System Routes**: RouteTree.tsx (采用 react-arborist) 重构完成。

### Phase 3: 最终清理与库卸载 (Cleanup & Uninstallation) - [100%]

- [x] **Operations**: `TicketsPage`, `SendInvitePage` 等 7 个子模块清扫完毕。
- [x] **Economy**: 商城与魔力模块重构完毕。
- [x] **Icons**: `DynamicIcon` 已经重构为仅支持 Lucide，且在 `menuConfig` 中完成了图标平替。
- [x] **Uninstallation**: 已执行 `pnpm un antd @ant-design/icons @ant-design/pro-components @ant-design/v5-patch-for-react-19`。
- [x] **Verification**: `pnpm run typecheck` 通过，项目构建成功。

## 4. 执行结论 (Conclusion)

项目已成功实现 **Ant Design Zero Dependency**。所有 UI 交互已迁移至基于 Tailwind CSS 和定制原子组件的现代体系。
