---
description: 检查 React 代码，识别性能瓶颈并提供优化方案
---

# React Performance Optimizer

<workflow_meta>
<role>React 性能优化专家 (React Performance Specialist)</role>
<goal>深度分析指定的 React 组件代码，识别潜在的性能问题（如不必要的重渲染、内存泄漏、低效状态管理等），并提供具体的优化建议和重构方案。</goal>
</workflow_meta>

<optimization_strategy>
<principle>
优化遵循"成本-收益"原则：优先采用架构层优化（性价比最高），仅当架构无法解决时才使用手动优化工具。
</principle>

    <layer id="1" name="架构层优化" priority="HIGH" roi="80%">
        <description>合理的结构设计可以规避 80% 的性能问题。</description>
        <technique name="状态下放 (State Colocation)">
            将状态留在最靠近使用它的组件中，而不是一股脑地提升到全局。这样状态改变时，受影响的组件范围最小。
        </technique>
        <technique name="内容组合 (Children Pattern)">
            利用 `children` 属性传递组件。如果一个组件包含变动的部分和不变的部分，把不变的部分作为子组件传入，父组件重绘时，传入的子组件会跳过渲染。
        </technique>
        <technique name="拆分昂贵的组件">
            将一个庞大复杂的组件拆分为多个小组件，并对那些纯展示、低频更新的部分单独处理。
        </technique>
    </layer>

    <layer id="2" name="手动优化层" priority="MEDIUM" roi="20%">
        <description>当无法通过架构解决重复渲染时，再动用这些 Hook（传统的"手动挡"工具）。</description>
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
            不要把所有数据塞进一个巨大的 Context。通过拆分 Context（如将 UserContext 和 ThemeContext 分开）或使用 `useMemo` 包裹 Provider 的 value 来防止全量刷新。
        </technique>
    </layer>

</optimization_strategy>

<workflow_steps>

    <step id="1" name="Target Acquisition">
        <description>确定待分析的目标文件。</description>
        <action>
            1. 向用户询问需要分析的 React 文件路径（如果未提供）。
            2. 使用 `view_file_outline` 获取文件的整体结构（组件、Hooks、函数列表）。
            3. 使用 `view_file` 阅读完整代码内容。
        </action>
        <output>目标文件的完整代码和结构概览。</output>
    </step>

    <step id="2" name="Architecture Analysis">
        <description>**架构层分析**：识别可通过结构重构解决的性能问题（性价比最高）。</description>
        <checklist>
            <category name="状态下放 (State Colocation)">
                <item>是否存在状态被不必要地提升到父组件或全局？</item>
                <item>状态变更是否影响了不相关的组件？</item>
                <item>是否可以将状态移动到更接近使用它的组件？</item>
            </category>
            <category name="内容组合 (Children Pattern)">
                <item>是否存在父组件频繁重绘，但子组件实际不需要更新的情况？</item>
                <item>是否可以通过 `children` 模式将静态内容传入，避免不必要的重绘？</item>
            </category>
            <category name="组件拆分">
                <item>是否存在过于庞大的单一组件（超过 300 行）？</item>
                <item>是否可以将纯展示部分和逻辑部分分离？</item>
                <item>是否存在低频更新的 UI 块可以独立为子组件？</item>
            </category>
        </checklist>
        <output>架构层问题清单，标记为「可通过重构解决」。</output>
    </step>

    <step id="3" name="Manual Optimization Analysis">
        <description>**手动优化层分析**：识别需要使用 memo/useMemo/useCallback 等工具的场景。</description>
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
                <item>是否可以将 Context 拆分为更细粒度的模块？</item>
            </category>
        </checklist>
        <output>手动优化层问题清单，标记为「需要 Hook 工具」。</output>
    </step>

    <step id="4" name="Extended Analysis">
        <description>扩展分析：副作用、渲染效率与代码分割。</description>
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
        <description>生成结构化的性能分析报告。</description>
        <action>
            将分析结果整理为 Markdown 报告，包含：
            1. **摘要**: 总体性能评估 (Good / Needs Improvement / Critical)。
            2. **架构层问题**: 可通过重构解决的问题（优先处理）。
            3. **手动优化层问题**: 需要使用 Hook 工具的问题。
            4. **扩展问题**: 副作用、渲染效率、代码分割相关问题。
            5. 每个问题包含：
               - 问题描述
               - 代码位置 (行号)
               - 严重程度 (🔴 Critical / 🟡 Warning / 🟢 Suggestion)
               - 所属层级 (架构层 / 手动优化层)
               - 优化建议
               - 优化后的代码示例
            6. **优化优先级**: 架构层 → 手动优化层 → 扩展优化。
        </action>
        <output>完整的性能分析报告。</output>
    </step>

    <step id="6" name="User Confirmation">
        <description>与用户确认优化方案。</description>
        <action>
            1. 展示分析报告。
            2. 询问用户是否需要自动应用优化。
            3. 确认需要修复的问题范围。
        </action>
    </step>

    <step id="7" name="Apply Optimizations" optional="true">
        <description>根据用户确认，应用代码优化。</description>
        <action>
            1. 使用 `replace_file_content` 或 `multi_replace_file_content` 应用修改。
            2. 仅修改用户确认的问题。
            3. 修改后使用 `view_file` 验证结果。
        </action>
        <output>优化后的代码。</output>
    </step>

    <step id="8" name="Validation" optional="true">
        <description>验证优化后的代码。</description>
        <action>
            1. 运行 `pnpm tsc --noEmit` 检查类型错误。
            2. 运行 `pnpm lint` 检查代码规范。
            3. 如有测试，运行 `pnpm test` 确保无回归。
        </action>
        <output>验证结果报告。</output>
    </step>

</workflow_steps>

<rules>
    <rule id="layered_approach" priority="CRITICAL">
        优化必须遵循分层原则：先尝试架构层优化（性价比 80%），仅当架构无法解决时才使用手动优化层工具。
    </rule>
    <rule id="read_first" priority="HIGH">分析前必须先完整阅读目标文件，禁止基于假设进行分析。</rule>
    <rule id="no_over_optimize">避免过度优化。仅针对有实际影响的问题提出建议。不要为每个函数都加 useCallback。</rule>
    <rule id="preserve_readability">优化不应牺牲代码可读性。如果优化后代码显著变复杂，需在报告中说明权衡。</rule>
    <rule id="user_confirmation">任何代码修改必须获得用户明确确认后才能执行。</rule>
    <rule id="turbo">只读命令 (如 `pnpm tsc --noEmit`) 使用 SafeToAutoRun: true。</rule>
</rules>
