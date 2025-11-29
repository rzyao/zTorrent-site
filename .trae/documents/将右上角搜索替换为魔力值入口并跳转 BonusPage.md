## 目标
- 移除页面右上角的 `Search` 图标按钮
- 在同位置新增一个代表魔力值的图标（使用 `Sparkles`）
- 点击该图标跳转到魔力值中心页面 `BonusPage`（路径 `/bonus`）

## 涉及文件
- `src\layouts\Header.tsx`
- `src\routes\AppRoutes.tsx`
- 现有页面：`src\pages\BonusPage.tsx`（已存在并具名导出）

## 改动说明
- `Header.tsx`
  - 删除右上角的搜索按钮（当前位置：`src\layouts\Header.tsx:97-103`）
  - 从 import 列表中移除 `Search`，新增 `Sparkles`（当前位置：`src\layouts\Header.tsx:1`）
  - 在原搜索按钮位置新增一个按钮，图标为 `Sparkles`，点击调用 `navigate('/bonus')` 跳转（按钮样式与已有通知、私信按钮保持一致）
- `AppRoutes.tsx`
  - 具名引入 `BonusPage`：`import { BonusPage } from '../pages/BonusPage'`
  - 新增受保护路由 `/bonus`，使用现有的 `AuthRoute` 与 `AppLayout` 包裹，以保持统一布局和权限策略

## 实施步骤
- 步骤 1：修改 `Header.tsx`
  - 更新 import：移除 `Search`，新增 `Sparkles`
  - 删除搜索按钮代码块
  - 添加魔力值按钮，`onClick={() => navigate('/bonus')}`
- 步骤 2：修改 `AppRoutes.tsx`
  - 引入 `BonusPage`
  - 在顶层 `Routes` 中新增：
    - `path="/bonus"` → `element` 为 `AuthRoute` + `AppLayout` + `BonusPage`
- 步骤 3：验证（确认后执行）
  - 本地启动开发服务，检查右上角图标视觉与交互
  - 点击图标应跳转到 `BonusPage` 并正常渲染

## 原因与考虑
- 一致性：沿用现有右上角按钮的视觉与交互，避免突兀差异
- 权限：`BonusPage` 属于用户个人中心功能，应在登录态下访问，故使用 `AuthRoute`
- 维护性：路由集中在 `AppRoutes.tsx` 管理，符合项目当前路由架构

## 代码参考
- 搜索按钮位置：`src\layouts\Header.tsx:97-103`
- 导航与按钮组结构：`src\layouts\Header.tsx:64-96`
- 路由集中管理：`src\routes\AppRoutes.tsx:146-363`
- `BonusPage` 具名导出：`src\pages\BonusPage.tsx:14`