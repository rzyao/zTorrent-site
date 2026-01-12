# 实施计划 - TicketsPage 重构

## 第一步：重构 useTicketsLogic.tsx

- 引入 `toast` 从 `sonner`。
- 引入 `useForm` 从 `react-hook-form`。
- 修改 `handleClose`：不再调用 `Modal.confirm`，而是设置 `closeConfirmId` 和 `closeConfirmOpen(true)`。
- 修改 `handleSubmitCreate`：直接作为 RHF 的 submit 处理函数。
- 更新 `columns`：使用 flex 布局替代 `Space`。

## 第二步：重构 TicketModal.tsx

- 接受 `control` 和 `errors` 作为 props（或通过 `useFormContext`，推荐前者以便保持组件解耦）。
- 使用 `Label` 和 `Controller` 组织表单域。
- 去掉 `antd/Form` 包装。

## 第三步：更新 index.tsx

- 移除 `Card` 的导入和使用。
- 为 `handleClose` 添加 `Dialog` 确认组件。
- 更新 `TicketModal` 的引用。
