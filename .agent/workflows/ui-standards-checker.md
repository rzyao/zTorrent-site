---
description: 根据 UI_STANDARDS.md 对指定页面进行规范检查并生成优化方案
---

# UI Standards Checker

<workflow_meta>
<role>UI 规范审计专家 (UI Standards Auditor)</role>
<goal>基于 Admin UI 设计规范文档，对指定页面进行全面的规范性检查，识别不符合项，生成详细的优化方案，并在用户确认后执行代码优化。</goal>
</workflow_meta>

<workflow_steps>

<step id="1" name="Load Standards">
<description>读取 UI 设计规范文件。</description>
<action>
使用 `view_file` 读取 `src/modules/admin/guidelines/UI_STANDARDS.md`，提取关键规范点：
- 表格规范（字体、行高、边框、Hover 效果）
- 表头样式（背景色、文字、对齐）
- 操作列规范（对齐、宽度、按钮样式）
- 页面工具栏规范（按钮类型、尺寸、图标）
- 文字排版规范
- 颜色规范
- 布局与间距规范
</action>
</step>

<step id="2" name="Locate Target Page">
<description>确定要检查的目标页面。</description>
<action>
询问用户：
1. 要检查的页面路径（如 `src/modules/admin/pages/xxx/XxxPage.tsx`）
2. 是否需要同时检查相关的子组件和逻辑 Hook

如果用户提供了文件路径，使用 `view_file` 读取主文件。
如果是目录，使用 `list_dir` 列出所有相关文件。
</action>
</step>

<step id="3" name="Deep Analysis">
<description>深度分析页面代码结构。</description>
<action>
1. 使用 `view_file_outline` 获取页面文件的结构概览。
2. 使用 `view_file` 读取完整代码（如果文件较大，分段读取）。
3. 如果页面引用了子组件（如 columns.tsx, components/），递归读取这些文件。
4. 识别以下关键元素：
   - DataTable 组件的使用
   - Button 组件的 variant 和 size 属性
   - 操作列的定义（className, render 函数）
   - 页面布局容器（是否有重复 padding）
   - 文字样式类名（text-*, font-*）
   - 颜色类名（bg-*, text-*, border-*）
</action>
</step>

<step id="4" name="Standards Compliance Check">
<description>逐项对照规范进行检查。</description>
<action>
根据 UI_STANDARDS.md 的各个章节，逐项检查：

### 4.1 表格规范检查

- [ ] 表格字体是否为 `text-sm`
- [ ] 行边框是否为 `border-b border-gray-100`
- [ ] Hover 效果是否为 `hover:bg-neutral-50/50`
- [ ] 表头背景色是否为 `bg-[#FAFAFA]`
- [ ] 表头文字是否为 `text-antd-text font-semibold`

### 4.2 操作列检查

- [ ] 表头是否使用 `className="text-center"`
- [ ] 单元格内容是否使用 `flex justify-center`
- [ ] 是否设置了固定宽度（如 `w-[150px]`）
- [ ] 操作按钮是否使用 `variant="link"` 和 `size="small"`
- [ ] 删除按钮是否添加了 `danger` 属性
- [ ] 是否避免了带背景色的按钮

### 4.3 页面工具栏检查

- [ ] 主操作按钮是否使用 `variant="primary"`
- [ ] 次级操作按钮是否使用 `variant="default"`
- [ ] 危险操作按钮是否使用 `variant="primary" danger`
- [ ] 工具栏按钮是否使用默认尺寸（不设置 size）
- [ ] 按钮之间是否使用 `gap-2`
- [ ] 主操作按钮是否添加了语义化图标（如 Plus）

### 4.4 文字排版检查

- [ ] 页面标题是否使用 `text-xl font-semibold tracking-tight`
- [ ] 副标题/描述是否使用 `text-sm text-muted-foreground`
- [ ] 正文是否使用 `text-sm text-gray-900`
- [ ] 辅助文字是否使用 `text-xs text-muted-foreground`

### 4.5 布局与间距检查

- [ ] 页面根容器是否避免了重复的 padding
- [ ] 是否存在 `p-*` 套 `p-*` 的情况
- [ ] 卡片之间是否使用 `gap-4` 或 `gap-6`

记录所有不符合项的：

- 文件路径
- 行号
- 当前代码
- 应改为的代码
- 违反的规范条目
  </action>
  </step>

<step id="5" name="Generate Audit Report">
<description>生成详细的检查报告和优化方案。</description>
<action>
创建一个结构化的 Markdown 报告，包含：

## 📋 UI 规范检查报告

### 📁 检查范围

- 主页面: [文件路径]
- 相关组件: [列表]

### ✅ 符合项 (X 项)

列出所有符合规范的检查项。

### ❌ 不符合项 (X 项)

#### 1. [问题类别] - [严重程度: 高/中/低]

**位置**: `文件路径:行号`

**当前代码**:

```tsx
[当前代码片段];
```

**问题描述**:
违反了 [规范章节]，[具体说明]

**建议修改**:

```tsx
[修改后的代码];
```

**影响**: [对用户体验或代码质量的影响]

---

### 📊 统计摘要

- 总检查项: X
- 符合项: X (X%)
- 不符合项: X (X%)
- 高优先级问题: X
- 中优先级问题: X
- 低优先级问题: X

### 🎯 优化建议优先级

1. [高优先级问题列表]
2. [中优先级问题列表]
3. [低优先级问题列表]

将报告展示给用户，并询问是否继续执行优化。
</action>
</step>

<step id="6" name="User Confirmation">
<description>等待用户确认优化方案。</description>
<action>
向用户展示完整的检查报告，并询问：

**请确认以下操作：**

1. 是否同意执行所有优化？
2. 是否只修复高优先级问题？
3. 是否需要调整某些建议？
4. 是否取消优化？

根据用户的选择，决定下一步操作。
</action>
</step>

<step id="7" name="Execute Optimization">
<description>根据用户确认的方案执行代码优化。</description>
<action>
根据用户的选择，使用 `replace_file_content` 或 `multi_replace_file_content` 逐项修复代码：

1. **单文件多处修改**: 使用 `multi_replace_file_content`，将所有 ReplacementChunks 一次性应用。
2. **多文件修改**: 按文件逐个使用 `replace_file_content`。
3. **修改后验证**:
   - 使用 `view_file` 确认修改是否正确应用
   - 如果项目有 TypeScript 检查，运行 `npm run type-check`（如果存在）

每次修改后，向用户报告进度：

- ✅ 已修复: [文件路径] - [问题描述]
- ⏳ 进行中: [当前文件]
- ⏸️ 待处理: [剩余数量]
  </action>
  </step>

<step id="8" name="Final Verification">
<description>最终验证和总结。</description>
<action>
1. 重新读取修改后的文件，确认所有更改已正确应用。
2. 生成优化总结报告：

## ✨ 优化完成总结

### 📝 修改清单

- [文件1]: [修改项数量] 处修改
- [文件2]: [修改项数量] 处修改
- ...

### 🎯 解决的问题

- ✅ [问题1]
- ✅ [问题2]
- ...

### 📌 后续建议

- [ ] 运行 `npm run dev` 检查页面渲染
- [ ] 测试表格操作功能
- [ ] 检查其他相似页面是否存在同样问题

3. 询问用户是否需要提交 Git Commit。
   </action>
   </step>

</workflow_steps>

<rules>
<rule id="turbo" priority="HIGH">
只读命令（view_file, view_file_outline, list_dir）必须设置 SafeToAutoRun: true。
</rule>

<rule id="user_confirmation" priority="CRITICAL">
在执行任何代码修改之前，必须先生成完整的检查报告并获得用户明确确认。
严禁在用户未确认的情况下自动修改代码。
</rule>

<rule id="comprehensive_check" priority="HIGH">
检查必须覆盖 UI_STANDARDS.md 中的所有规范项，不得遗漏任何章节。
</rule>

<rule id="precise_location" priority="HIGH">
报告中的每个问题必须包含：
- 精确的文件路径
- 具体的行号范围
- 当前代码片段
- 修改后的代码片段
- 违反的具体规范条目
</rule>

<rule id="priority_classification" priority="MEDIUM">
问题严重程度分类标准：
- **高**: 影响用户体验或与规范严重不符（如操作列未居中、按钮尺寸错误）
- **中**: 影响视觉一致性（如颜色、字体不符）
- **低**: 优化建议（如间距微调）
</rule>

<rule id="batch_modification" priority="MEDIUM">
对同一文件的多处修改，必须使用 multi_replace_file_content 一次性完成，避免多次文件操作。
</rule>

<rule id="chinese_output" priority="CRITICAL">
所有输出（报告、问题描述、建议）必须使用中文。
代码实体（类名、函数名、文件路径）保持英文。
</rule>
</rules>
