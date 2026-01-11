---
description: React 代码深度分析与重构工作流，融合性能优化与页面拆分最佳实践
---

# React Code Analyzer

<workflow_meta>
<role>React 代码架构师 (React Code Architect)</role>
<goal>对指定的 React 组件进行全方位分析，涵盖**性能瓶颈识别**与**代码结构重构**两大核心任务。遵循"架构优先"原则，输出可行的优化方案和拆分建议，并可选择性地自动应用修改。</goal>
</workflow_meta>

<optimization_strategy>
<principle>
优化遵循"成本-收益"原则：优先采用架构层优化（性价比最高，约解决 80% 问题），仅当架构无法解决时才使用手动优化工具。
</principle>

    <layer id="1" name="架构层优化 (Structural Refactoring)" priority="CRITICAL" roi="80%">
        <description>通过合理的结构设计规避大部分性能问题，同时提升代码可维护性。</description>
        <technique name="状态下放 (State Colocation)">
            将状态留在最靠近使用它的组件中，而不是一股脑地提升到全局。这样状态改变时，受影响的组件范围最小。
        </technique>
        <technique name="内容组合 (Children Pattern)">
            利用 `children` 属性传递组件。如果一个组件包含变动的部分和不变的部分，把不变的部分作为子组件传入，父组件重绘时，传入的子组件会跳过渲染。
        </technique>
        <technique name="UI 组件拆分">
            将 JSX 中独立的视觉块（如搜索栏、数据表格、弹窗）提取为无状态子组件，只通过 Props 接收数据和回调。
        </technique>
        <technique name="逻辑提取 (Custom Hooks)">
            将 `useState`、`useEffect` 和事件处理函数抽离到 `use[PageName].ts`，UI 组件只负责"显示"，Hook 负责"怎么做"。
        </technique>
        <technique name="静态数据抽离">
            将 TypeScript 类型移入 `types.ts`，常量移入 `constants.ts`，工具函数移入 `utils.ts`，保持主组件清爽。
        </technique>
    </layer>

    <layer id="2" name="手动优化层 (Manual Optimization)" priority="MEDIUM" roi="20%">
        <description>当无法通过架构解决重复渲染时，再动用这些"手动挡"工具。</description>
        <technique name="React.memo">
            对组件进行浅比较。只有 Props 改变时才重新渲染组件。适用于渲染开销较大的纯展示组件。
        </technique>
        <technique name="useMemo">
            缓存复杂的计算结果，避免每次渲染都重新计算。
        </technique>
        <technique name="useCallback">
            缓存函数引用，防止父组件重绘时导致子组件的 memo 失效。
        </technique>
        <technique name="Context 优化">
            不要把所有数据塞进一个巨大的 Context。通过拆分 Context 或使用 `useMemo` 包裹 Provider 的 value 来防止全量刷新。
        </technique>
    </layer>

</optimization_strategy>

<workflow_steps>

    <step id="1" name="Target Acquisition">
        <description>获取待分析的目标文件。</description>
        <action>
            1. 向用户询问需要分析的 React 文件路径（如果未提供）。
            2. 使用 `view_file_outline` 获取文件结构（组件、Hooks、函数列表）。
            3. 使用 `view_file` 阅读完整代码内容。
        </action>
        <output>目标文件的完整代码 and 结构概览。</output>
    </step>

    <step id="2" name="Structural Analysis (架构层分析)">
        <description>识别可通过**代码结构重构**解决的问题（关注点分离、组件拆分）。</description>
        <checklist>
            <category name="组件拆分 (UI Decomposition)">
                <item>单一组件是否超过 **300 行**？</item>
                <item>JSX 中是否存在可独立的视觉块（如 Modal、Table、Header）？</item>
                <item>这些视觉块是否为"纯展示"，可拆分为无状态组件？</item>
            </category>
            <category name="逻辑提取 (Hook Extraction)">
                <item>组件内是否充斥大量 `useState`、`useEffect` 和事件处理函数？</item>
                <item>是否可以将这些逻辑抽离到自定义 Hook (`use[PageName].ts`)？</item>
            </category>
            <category name="静态数据抽离">
                <item>文件头部是否有大量 `interface`、`type` 定义？应移至 `types.ts`。</item>
                <item>是否有静态常量（如下拉选项、列定义）？应移至 `constants.ts`。</item>
                <item>是否有与组件无关的纯函数？应移至 `utils.ts`。</item>
            </category>
            <category name="状态下放 (State Colocation)">
                <item>是否存在状态被不必要地提升到父组件或全局？</item>
                <item>状态变更是否影响了不相关的组件？</item>
            </category>
            <category name="内容组合 (Children Pattern)">
                <item>是否存在父组件频繁重绘，但子组件实际不需要更新的情况？</item>
                <item>是否可以通过 `children` 模式将静态内容传入？</item>
            </category>
        </checklist>
        <output>架构层问题清单，标记为「可通过重构解决」。</output>
    </step>

    <step id="3" name="Performance Analysis (性能分析)">
        <description>识别需要使用 `memo`/`useMemo`/`useCallback` 等工具的场景。</description>
        <checklist>
            <category name="React.memo 适用场景">
                <item>是否存在渲染开销大的纯展示组件频繁重绘？</item>
                <item>组件的 Props 是否为简单类型或稳定引用？</item>
            </category>
            <category name="useMemo 适用场景">
                <item>是否存在每次渲染都重复执行的复杂计算（如过滤、排序、聚合）？</item>
                <item>是否在组件内部定义了对象/数组字面量作为 Props？</item>
            </category>
            <category name="useCallback 适用场景">
                <item>是否存在传递给 memo 化子组件的函数 Props？</item>
                <item>函数是否作为 useEffect 的依赖项？</item>
            </category>
            <category name="Context 优化">
                <item>是否存在巨大的单一 Context 导致无关组件联动刷新？</item>
                <item>Provider 的 value 是否在每次渲染时都创建新对象？</item>
            </category>
        </checklist>
        <output>手动优化层问题清单，标记为「需要 Hook 工具」。</output>
    </step>

    <step id="4" name="Extended Analysis (扩展分析)">
        <description>副作用、渲染效率与代码分割。</description>
        <checklist>
            <category name="副作用问题 (Side Effects)">
                <item>`useEffect` 依赖数组是否正确？是否存在过度触发？</item>
                <item>是否存在未清理的订阅、定时器或事件监听器？</item>
                <item>数据请求是否应该使用 TanStack Query 替代手动 `useEffect`？</item>
            </category>
            <category name="渲染效率 (Render Efficiency)">
                <item>列表渲染是否使用了正确的 `key`？</item>
                <item>大列表是否需要虚拟化 (react-window/react-virtuoso)？</item>
                <item>条件渲染逻辑是否可以优化？</item>
            </category>
            <category name="代码分割 (Code Splitting)">
                <item>是否有大型组件可以使用 `React.lazy` 延迟加载？</item>
                <item>是否有重型库可以动态导入？</item>
            </category>
        </checklist>
        <output>扩展问题清单。</output>
    </step>

    <step id="5" name="Report Generation">
        <description>生成结构化的分析报告。</description>
        <action>
            整理分析结果为 Markdown 报告，包含：
            1. **摘要**: 总体评估 (Good / Needs Improvement / Critical)。
            2. **架构层问题**: 可通过重构解决的问题（**优先处理**）。
               - 包含推荐的拆分后目录结构。
            3. **手动优化层问题**: 需要使用 Hook 工具的问题。
            4. **扩展问题**: 副作用、渲染效率、代码分割相关问题。
            5. 每个问题包含：
               - 问题描述
               - 代码位置 (行号)
               - 严重程度 (🔴 Critical / 🟡 Warning / 🟢 Suggestion)
               - 所属层级 (架构层 / 手动优化层)
               - 优化/重构建议
               - 优化后的代码示例
            6. **优化优先级**: 架构层 → 手动优化层 → 扩展优化。
        </action>
        <template name="推荐目录结构">

```
src/pages/[ModuleName]Page/      # 目录名必须是 PascalCase + Page 后缀 (如 FilmsPage)
├── components/                  # 该页面专用的子组件
│   ├── Header.tsx
│   ├── DataTable.tsx
│   └── ActionModal.tsx
├── hooks/                       # 该页面专用的逻辑
│   └── use[ModuleName]Logic.ts
├── utils/                       # (可选) 页面专用工具函数
├── types.ts                     # 类型定义
├── constants.ts                 # 静态常量 (如 tableColumns)
└── index.tsx                    # 主入口 (组装以上内容)
```

        </template>
        <output>完整的分析报告。</output>
    </step>

    <step id="6" name="User Confirmation">
        <description>与用户确认优化方案。</description>
        <action>
            1. 展示分析报告。
            2. 询问用户需要执行的操作：
               - [ ] 仅查看报告 (不修改代码)
               - [ ] 自动执行架构层重构 (创建文件、移动代码)
               - [ ] 自动应用性能优化 (添加 memo/useMemo/useCallback)
            3. 确认需要修改的问题范围。
        </action>
    </step>

    <step id="7" name="Apply Refactoring" optional="true">
        <description>根据用户确认，执行代码重构。</description>
        <action>
            **架构层重构步骤 (按顺序执行，风险最小)**：
            1. **剥离常量与类型**：将 `interface`/`type` 和 `const` 移到单独文件，主文件 `import` 进来。
            2. **拆分大块 UI**：将 JSX 中独立块剪切为新组件文件，通过 Props 传参。
            3. **拆分逻辑 (Hook)**：创建 `use[PageName].ts`，将状态和事件处理逻辑移入。
            4. **整理 Imports**：检查并修正所有 import 路径。

            使用 `write_to_file` 创建新文件，`multi_replace_file_content` 修改现有文件。
        </action>
        <output>重构后的代码和目录结构。</output>
    </step>

    <step id="8" name="Apply Optimizations" optional="true">
        <description>根据用户确认，应用性能优化。</description>
        <action>
            1. 使用 `replace_file_content` 或 `multi_replace_file_content` 添加 `React.memo`、`useMemo`、`useCallback`。
            2. 仅修改用户确认的问题。
            3. 修改后使用 `view_file` 验证结果。
        </action>
        <output>优化后的代码。</output>
    </step>

    <step id="9" name="Validation" optional="true">
        <description>验证修改后的代码。</description>
        <action>
            // turbo
            1. 运行 `pnpm tsc --noEmit` 检查类型错误。
            2. 运行 `pnpm lint` 检查代码规范。
            3. 如有测试，运行 `pnpm test` 确保无回归。
        </action>
        <output>验证结果报告。</output>
    </step>

</workflow_steps>

<rules>
    <rule id="layered_approach" priority="CRITICAL">
        优化必须遵循分层原则：**架构层优化优先**（性价比约 80%），仅当架构无法解决时才使用手动优化层工具。
    </rule>
    <rule id="read_first" priority="HIGH">
        分析前必须先完整阅读目标文件，禁止基于假设进行分析。
    </rule>
    <rule id="no_over_optimize">
        避免过度优化。仅针对有实际影响的问题提出建议。不要为每个函数都加 `useCallback`。
    </rule>
    <rule id="preserve_readability">
        优化不应牺牲代码可读性。如果优化后代码显著变复杂，需在报告中说明权衡。
    </rule>
    <rule id="user_confirmation" priority="HIGH">
        任何代码修改必须获得用户明确确认后才能执行。
    </rule>
    <rule id="directory_naming" priority="HIGH">
        **页面目录命名规范**：目录名必须使用 **PascalCase (驼峰命名)** 并以 `Page` 结尾。例如：`FilmsPage`、`UsersPage`、`PunishmentsPage`。禁止使用小写连字符命名如 `films`、`user-list`。
    </rule>
    <rule id="turbo">
        只读命令 (如 `pnpm tsc --noEmit`, `pnpm lint`) 使用 `SafeToAutoRun: true`。
    </rule>
    <rule id="split_order">
        架构层重构遵循低风险顺序：剥离常量/类型 → 拆分 UI 组件 → 提取 Hook 逻辑 → 整理 Imports。
    </rule>
</rules>
