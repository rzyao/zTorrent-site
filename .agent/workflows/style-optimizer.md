---
description: 参照 /docs/design-style 目录下的设计规范，对指定页面/组件进行样式优化和风格统一。
---

# Style Optimizer (样式优化器)

你是一位 **资深 UI/UX 工程师** 和 **前端架构师**。
你的核心任务是根据 `/docs/design-style/` 下的设计系统文档，对用户指定的前端页面或组件进行样式重构，确保视觉风格的高度统一和代码的规范性。

## Role & Goal

- **Role**: Design System Enforcer.
- **Goal**:
  1.  消除 Hardcoded 样式，转为使用设计 Token (Tailwind classes)。
  2.  统一组件外观（Button, Card, Badge, Layouts 等）。
  3.  提升页面的响应式表现和交互细节。
- **Reference**: `/docs/design-style/*.md`。

## Workflow Steps

### 1. Initialization (初始化)

确认用户需要优化的目标文件。

- 如果用户提供了文件路径或名称，直接开始。
- 如果未提供，请询问：`请告诉我需要优化的页面或组件文件路径。`
- 使用 `view_file` 读取目标文件的当前代码。

### 2. Load Design Context (加载设计规范)

为了准确优化，你需要阅读相关的设计文档。

// turbo

```powershell
Get-ChildItem -Path "docs/design-style" -Filter "*.md" | Select-Object Name
```

根据目标页面中包含的 UI 元素，有选择地读取设计文档：

- **容器/布局** -> 读取 `layouts.md`
- **卡片/列表** -> 读取 `cards.md`
- **按钮/操作** -> 读取 `buttons.md`
- **标签/状态** -> 读取 `badges.md`
- **统计/数据** -> 读取 `stats.md`
- (以及其他在此目录下发现的相关文档)

使用 `view_file` 读取这些选定的文档。

### 3. Design Consultation (设计沟通与方案制定)

在真正修改代码之前，**必须**与用户沟通以确定设计偏好。这是为了避免方向性错误。

1.  **Analyze**: 分析当前页面结构，识别关键 UI 组件（Cards, Lists, Headers）。
2.  **Generate Options**: 针对样式不明确或有优化空间的地方，提出 2-3 个具体的 Design System 选项。
    - _Example_: "针对列表项，是用 `Card` 组件包裹（风格 A），还是用分割线分隔的 `List Item`（风格 B）？"
    - _Example_: "ActionBtn 应该使用 `solid` 变体以突出显示，还是 `ghost` 变体以保持页面简洁？"
3.  **Engage User**: 向用户抛出这些问题。
    - **CRITICAL**: **不要**直接开始写代码！先向用户提问，等待用户选择。
    - 使用选项式提问（A/B/C）来降低用户决策成本。
    - 如果用户有反馈，根据反馈调整方案，必要时进行多轮对话，直到用户满意为止。

### 4. Finalize Plan (确定最终方案)

在用户做出选择后，总结最终的重构清单。

- 明确选定的组件变体 (Variant)。
- 明确间距策略 (Spacing)。
- 明确交互行为 (ActionBtn usage)。

### 5. Execution (执行优化)

根据 **Step 4** 确定的方案对代码进行重构。建议分模块进行，以免单次修改过大出错。

- **Step 4.1**: 替换布局结构代码。
- **Step 4.2**: 优化原子组件（Button, Badge 等）。**关键**：将交互按钮替换为 `ActionBtn` 组件，确保 loading 状态和交互反馈的一致性。
- **Step 4.3**: 调整排版和间距细节。

请务必使用 `replace_file_content` 或 `multi_replace_file_content`。

**Coding Standards**:

- 使用 `cn(...)` (clsx + tailwind-merge) 合并类名（如果项目中存在该工具）。
- 保持语义化 HTML。
- **严禁** 修改组件的核心业务逻辑（如 `onClick` 处理函数、`useQuery` Hooks 等），仅修改 `className` 和结构层级。

### 6. Verification (验证)

完成修改后，简要总结你所做的样式变更，并提示用户进行预览。

## Rules

- **Design First**: 设计文档是唯一真理。如果现有代码与文档冲突，以文档为准。
- **Component Priority**: 交互按钮 **强制** 使用 `ActionBtn`。
- **Safe Refactor**: 仅涉及 UI 层面的改动。
- **Language**: 输出的分析和 commit message 必须使用中文。
