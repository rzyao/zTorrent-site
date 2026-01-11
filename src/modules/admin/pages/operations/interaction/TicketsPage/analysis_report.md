# React 代码分析报告 - TicketsPage

**目标文件**: `src/modules/admin/pages/operations/interaction/TicketsPage`

## 1. 摘要 (Summary)

**总体评估**: 🟡 **需要改进 (Needs Improvement)**

`TicketsPage` 的列表页 (`index.tsx`) 结构较为清晰，逻辑已分离到 `useTicketsLogic`。但详情页 (`TicketDetail.tsx`) 存在严重的逻辑耦合，且整个模块的数据获取依赖手动 `useEffect`，未使用项目推荐的 **TanStack Query**。此外，UI 组件混用了 Ant Design 和 Admin UI，特别是 `TicketDetail` 中大量使用了旧版组件。

---

## 2. 架构层问题 (Structural Analysis)

_此类问题可通过重构代码结构解决，优先级最高。_

### 🔴 详情页逻辑耦合 (High)

`TicketDetail.tsx` (245行) 包含了所有数据获取、表单提交 (`onReply`)、文件上传 (`beforeUpload`) 和状态管理逻辑。

- **建议**: 创建 `useTicketDetailLogic.ts`，将 `load`, `handleClose`, `onReply`, `beforeUpload` 等逻辑移出。
- **收益**: 组件将只负责渲染，大幅降低复杂度。

### 🔴 状态管理方案落后 (High)

`useTicketsLogic.tsx` 和 `TicketDetail.tsx` 均使用手动 `useState` + `useEffect` 进行数据请求。

- **建议**: 迁移至 **TanStack Query** (`useQuery`, `useMutation`)。
- **收益**: 自动处理缓存、Loading 状态、错误重试，代码量减少 40% 以上。

---

## 3. 手动优化层问题 (Manual Optimization)

_此类问题需要使用组件或 Hook 工具解决。_

### 🟡 Ant Design 组件混用 (Medium)

`TicketDetail.tsx` 引入了 `Tag`, `Form`, `Upload` 等 Ant Design 组件。

- **位置**: `TicketDetail.tsx` L2
- **建议**:
  - `Tag` -> 替换为 `@/modules/admin/components/ui/tag`。
  - `Form` -> 逐步迁移至 `react-hook-form` (建议作为后续独立任务)。
  - `Descriptions` -> 目前无直接替代，可暂时保留或手写 Grid 布局。

---

## 4. 优化建议与计划 (Refactoring Plan)

### 步骤 1: 详情页逻辑提取 (TicketDetail Logic Extraction)

创建 `useTicketDetailLogic.ts`，利用 **TanStack Query** 重写数据获取和变异逻辑。

```typescript
// 示例 useTicketDetailLogic.ts 结构
export function useTicketDetailLogic(id: string) {
  // Query
  const { data, isLoading } = useQuery({ ... });

  // Mutations
  const replyMutation = useMutation({ ... });
  const closeMutation = useMutation({ ... });

  return {
    detail: data?.detail,
    replies: data?.replies,
    loading: isLoading,
    handleReply: replyMutation.mutate,
    handleClose: closeMutation.mutate
  };
}
```

### 步骤 2: 列表页 React Query 改造 (List Page Refactor)

改造 `useTicketsLogic.tsx`，使用 `useQuery` 替代 `loadData`。

### 步骤 3: UI 标准化 (UI Standardization)

在 `TicketDetail.tsx` 中替换 `Tag` 组件，并清理未使用的 Import。

---

是否执行以上重构？建议优先执行 **步骤 1** 和 **步骤 2**。
