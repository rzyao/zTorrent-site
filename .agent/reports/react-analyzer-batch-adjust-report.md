# React Code Analyzer Report: Bonus Batch Adjust Page

## 1. 摘要 (Summary)

**整体评估**: 🟡 **需要改进 (Needs Improvement)**

`BatchAdjust` 页面目前将所有功能（CSV 解析、JSON 解析、API 调用、UI 渲染）堆砌在一个文件中，违反了关注点分离原则。此外，UI 使用了原生的 Ant Design 组件，未对齐项目最新的 Admin UI 规范。

主要改进方向是 **逻辑抽离 (Hook Extraction)** 和 **UI 标准化 (UI Standardization)**。

## 2. 架构层分析 (Structural Analysis)

### 🚨 架构问题

- **"Fat Component"**: `index.tsx` 包含了 CSV 解析逻辑 (`parseCsv`)、JSON 解析 (`handleParseJson`) 和 API 调用 (`handleSubmit`)。这些应该移至自定义 Hook 或工具函数中。
- **UI 耦合**: 数据展示表格和操作区域紧密耦合。
- **组件混用**: 使用了原生 `Table`，但项目已有增强版的 `DataTable`。

### 📌 建议重构方案

- **逻辑抽离**: 创建 `useBonusBatchAdjustLogic.ts` 处理文件解析和 API 交互。
- **工具函数抽离**: 将 `parseCsv` 移至 `utils.ts`。
- **拆分 UI**:
  - `components/ImportPanel.tsx`: 负责文件上传和 JSON 输入。
  - `components/PreviewTable.tsx`: 展示待提交数据。
  - `components/ResultTable.tsx`: 展示执行结果。

### 推荐目录结构

```
src/modules/admin/pages/economy/bonus/BatchAdjust/
├── components/
│   ├── ImportPanel.tsx
│   ├── PreviewTable.tsx
│   └── ResultTable.tsx
├── hooks/
│   └── useBonusBatchAdjustLogic.ts
├── utils/
│   └── csvParser.ts
├── types.ts                     # BatchItem, ResultItem
├── constants.ts                 # Columns definitions
└── index.tsx
```

## 3. 手动优化层分析 (Performance Analysis)

### ⚠️ 性能风险

- **内联对象**: `rowKey` 和 `render` 函数在每次渲染时重新创建。
- **大列表渲染**: 如果批量处理的数据量较大（如上千条），`Table` (非虚拟化) 可能会卡顿。但考虑到分批处理的场景，目前优先级较低。

## 4. 优化建议方案 (Refactoring Plan)

建议执行完整重构流程：

1.  **准备阶段**: 创建 `types.ts` 和 `utils/csvParser.ts`。
2.  **逻辑抽离**: 实现 `useBonusBatchAdjustLogic`。
3.  **UI 拆分与标准化**:
    - 创建使用 `DataTable` 的预览和结果表格组件。
    - 创建使用标准化 `Input` / `Button` 的导入面板。
4.  **组装**: `index.tsx` 仅负责布局和 Hook 调用。

---

**请确认下一步操作：**

- [ ] **执行完整架构重构 (推荐)**: 拆分 Hook、Utils 和 Components，并标准化 UI。
- [ ] **仅做逻辑分离**: 仅提取 Hook，保留原生表格。
- [ ] **不做修改**。
