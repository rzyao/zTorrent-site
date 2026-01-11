---
description: 对指定的 React 组件进行全方位分析
---

# React Code Analyzer (Optimization Rules Included)

<workflow_meta>
<role>React 代码架构师 (React Code Architect)</role>
<goal>对指定的 React 组件进行全方位分析，涵盖**性能瓶颈识别**与**代码结构重构**两大核心任务。遵循"架构优先"原则，自动应用最佳实践（如 TanStack Query），减少人工干预。</goal>
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
            将 `useState`、`useEffect` 和事件处理函数抽离到 `use[PageName]Logic.ts`。UI 组件只负责"显示"，Hook 负责"怎么做"。
        </technique>
        <technique name="静态数据抽离">
            将 TypeScript 类型移入 `types.ts`，常量移入 `constants.ts`，工具函数移入 `utils.ts`，保持主组件清爽。
        </technique>
        <technique name="数据层现代化 (TanStack Query)">
            **强制使用** TanStack Query (`useQuery`, `useMutation`) 替代手动的 `useEffect` + `useState` 进行数据请求。
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
                <item>是否可以将这些逻辑抽离到自定义 Hook (`use[PageName]Logic.ts`)？</item>
            </category>
            <category name="数据层检查 (Data Fetching)">
                <item>是否使用了手动的 `useEffect` 进行 API 请求？(是->需重构为 TanStack Query)</item>
                <item>是否缺少自动的 Loading/Error 状态管理？</item>
                <item>列表页和详情页是否缺少缓存失效机制 (`invalidateQueries`)？</item>
            </category>
            <category name="UI 规范检查 (UI Standards)">
                <item>是否混用了 Ant Design 和 Admin UI 组件？(如 `Tag` vs `AdminTag`)</item>
                <item>搜索栏是否使用了标准的 `SearchInput` 组件？</item>
                <item>`Select` 组件是否使用了 `allowClear` 和 `placeholder`？</item>
                <item>是否不再需要 `Reset` 按钮？</item>
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
            1. **摘要**: 总体评估。
            2. **架构层问题**:
               - **TanStack Query 迁移**: 明确指出所有需要替换 `useEffect` 的地方。
               - **逻辑 Hook 命名**: 统一为 `use[PageName]Logic.ts`。
            3. **UI 规范问题**:
               - 列出所有非标准组件的使用（如 AntD Tag -> Admin UI Tag）。
               - 检查 SearchInput 和 Select 的配置。
            4. **推荐目录结构**:
               - 展示标准的 PascalCase Page 目录结构。
        </action>
        <template name="推荐目录结构">

```
src/pages/[ModuleName]Page/      # 目录名必须是 PascalCase + Page 后缀 (如 TicketsPage)
├── components/                  # 该页面专用的子组件
│   ├── Header.tsx
│   ├── DataTable.tsx
│   └── ActionModal.tsx
├── hooks/                       # 该页面专用的逻辑
│   ├── use[ModuleName]Logic.ts  # 主逻辑
│   └── use[DetailName]Logic.ts  # 详情页逻辑
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
               - [ ] 自动执行架构层重构 (包含 TanStack Query 迁移、逻辑提取、UI 标准化)
               - [ ] 自动应用性能优化 (添加 memo/useMemo/useCallback)
            3. 确认需要修改的问题范围。
        </action>
    </step>

    <step id="7" name="Apply Refactoring" optional="true">
        <description>根据用户确认，执行代码重构。</description>
        <action>
            **架构层重构步骤 (按顺序执行)**：
            1. **剥离常量与类型**：将 `interface`/`type` 和 `const` 移到单独文件。
            2. **UI 标准化**:
               - 替换 Ant Design `Tag` 为 Admin UI `Tag`。
               - 替换组合搜索框为标准 `SearchInput`。
               - 为 `Select` 添加 `allowClear`, `placeholder`，移除 `RotateCcw` 重置按钮。
            3. **逻辑提取 & 数据层现代化**:
               - 创建/更新 `use[PageName]Logic.ts`。
               - **使用 `useQuery` 替代 `useEffect` 获取列表**。
               - **使用 `useMutation` 替代手动请求处理操作**。
               - 确保 Mutation 成功后调用 `invalidateQueries`。
            4. **拆分大块 UI**：将 JSX 中独立块剪切为新组件文件。
            5. **整理 Imports**：检查并修正所有 import 路径。

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
            // turbo
            4. 运行 `pnpm tsc --noEmit` 检查类型错误。
        </action>
        <output>优化后的代码。</output>
    </step>

</workflow_steps>

<rules>
    <rule id="layered_approach" priority="CRITICAL">
        优化必须遵循分层原则：**架构层优化优先**（TanStack Query、逻辑分离、UI 标准化），仅当架构无法解决时才使用手动优化层工具。
    </rule>
    <rule id="data_fetching" priority="CRITICAL">
        **必须**使用 TanStack Query 替代手动的 `useEffect` 进行数据请求。这是非协商性规则。
    </rule>
    <rule id="ui_standards" priority="HIGH">
        **搜索框**: 必须使用 `@/modules/admin/components/ui/search-input`。
        **Select**: 必须包含 `allowClear` 和 `placeholder`。无需独立的重置按钮。
        **Tag**: 必须使用 `@/modules/admin/components/ui/tag` 而非 AntD Tag。
    </rule>
    <rule id="directory_naming" priority="HIGH">
        **页面目录命名规范**：目录名必须使用 **PascalCase (驼峰命名)** 并以 `Page` 结尾。例如：`FilmsPage`。禁止使用小写连字符命名。
    </rule>
    <rule id="read_first" priority="HIGH">
        分析前必须先完整阅读目标文件，禁止基于假设进行分析。
    </rule>
    <rule id="turbo">
        只读命令 (如 `pnpm tsc --noEmit`) 使用 `SafeToAutoRun: true`。
    </rule>
</rules>
