# 任务：重构 TicketsPage 移除 Ant Design 依赖

## 1. 目标

- 完全移除 `src/modules/admin/pages/operations/interaction/TicketsPage` 中的 `antd` 相关引用。
- 确保 UI 符合 Admin 系统规范。
- 修复逻辑中的 Antd 相关行为（如 Modal.confirm, Form.useForm）。

## 2. 子任务清单

- [ ] **useTicketsLogic.tsx**:
  - [ ] 移除 `antd` 导入。
  - [ ] 替换 `message` 为 `toast` (sonner)。
  - [ ] 替换 `Modal.confirm` 为状态驱动的确认逻辑。
  - [ ] 替换 `antd/Form` 为 `react-hook-form`。
- [ ] **index.tsx**:
  - [ ] 移除 `antd/Card`，改用简单的 `div` 样式或通用卡片。
  - [ ] 集成二次确认 `Dialog`。
  - [ ] 更新 `TicketModal` 的调用方式。
- [ ] **components/TicketModal.tsx**:
  - [ ] 移除 `antd/Form`。
  - [ ] 使用 `react-hook-form` 的 `Controller` 重新实现表单。
- [ ] **constants.ts**:
  - [ ] 检查是否有依赖 Antd 的颜色值（如有必要进行调整）。

## 3. 当前进度

- [ ] 开始重构 `useTicketsLogic.tsx`
