---
description: 对指定的 React 组件进行深度架构分析与运行时性能优化。
---

# React Performance & Architecture Analyzer

<workflow_meta>
<role>React 性能架构专家 (React Performance & Architecture Expert)</role>
<goal>通过深度分析组件的数据流、渲染机制和逻辑结构，消除冗余计算，优化重渲染性能，并确保架构的可维护性。</goal>
</workflow_meta>

<workflow_steps>

    <step id="1" name="Context Acquisition">
        <description>获取目标代码上下文并进行初步扫描。</description>
        <action>
            1. 获取用户指定的 React 文件路径。
            2. 使用 `view_file` 读取目标文件源代码。
            3. 扫描项目 `package.json` 或 `pnpm-lock.yaml` 确认依赖版本 (TanStack Query, React 版本)。
        </action>
    </step>

    <step id="2" name="Diagnostic Analysis">
        <description>执行架构、逻辑与性能的三维诊断。</description>
        <checklist>
            <category name="Architecture & Data Flow (架构与数据流)">
                <item>**Data Fetching**: 是否仍在使用 `useEffect` 维护本地加载状态？(强制建议迁移至 TanStack Query)</item>
                <item>**Logic Extraction**: 逻辑是否超过 100 行？是否需要提取为业务 Hook (`use[Feature]Logic`)？</item>
                <item>**State Locality**: `useState` 是否定义在不必要的高位节点？是否存在可以通过派生状态 (Derived State) 替代的 `useState`？</item>
            </category>
            <category name="Runtime Performance (运行时性能)">
                <item>**Render Isolation**: 庞大的父组件更新是否导致了昂贵的子组件重渲染？(检查 `React.memo` 应用)</item>
                <item>**Expensive Calculations**: `filter/map/reduce` 等高开销操作是否包裹在 `useMemo` 中？</item>
                <item>**Referential Integrity**: 传递给子组件的 Object/Array/Function 是否会导致缓存失效？(检查 `useCallback` / `useMemo`) </item>
                <item>**List Performance**: 列表渲染的 `key` 是否使用了 `index` 或不稳定随机数？</item>
            </category>
            <category name="Hooks & Context">
                <item>**Context Over-subscription**: 复杂的上下文对象是否未被拆分，导致消费者频繁无效更新？</item>
                <item>**Hooks Dependency**: `useEffect` 或 `useCallback` 的依赖项是否存在缺失或过度包含？</item>
            </category>
        </checklist>
        <output>包含性能瓶颈分析、架构缺陷报告及量化优化建议的 Markdown 文档。</output>
    </step>

    <step id="3" name="Refactoring Strategy">
        <description>制定并提交具体的代码重构策略方案。</description>
        <action>
            1. **核心逻辑迁移计划**: 定义 Custom Hook 的输入/输出接口。
            2. **缓存增强计划**: 明确需要添加 `useMemo` / `useCallback` 的具体变量与函数。
            3. **渲染优化方案**: 标识需要进行组件拆分（以隔离状态）的切分点。
        </action>
    </step>

    <step id="4" name="Review & Confirmation">
        <description>用户审查优化建议并确认执行权限。</description>
        <action>
            询问用户是否应用优化：
            - [ ] 应用全量性能优化 (架构重构 + 渲染调优)
            - [ ] 仅执行逻辑提取 (Logic Extraction)
            - [ ] 仅生成详细诊断报告
        </action>
    </step>

    <step id="5" name="Application of Changes">
        <description>执行自动化的代码修改与验证。</description>
        <action>
            1. **Logic Modernization**: 使用 `multi_replace_file_content` 替换 `useEffect` 为数据层 Hooks。
            2. **Performance Patch**: 插入 `useMemo`, `useCallback` 和 `React.memo`。
            3. **Type Verification**:
               // turbo
               运行 `pnpm tsc --noEmit` 确保重构后类型依然安全。
        </action>
    </step>

    <step id="6" name="Verification">
        <description>最终验证。</description>
        <action>
           1. 静态检查代码是否有逻辑断裂。
           2. 确认 `memo` 依赖项是否完全闭合。
        </action>
    </step>

</workflow_steps>

<rules>
    <rule id="performance_first">
        所有涉及数组转换、复杂过滤和深度对象的计算，必须优先考虑使用缓存钩子，除非数据量极小。
    </rule>
    <rule id="architecture_consistency">
        严禁在组件内部保留复杂的副作用逻辑，必须通过提取业务 Hook 的方式实现逻辑与 UI 的关注点分离。
    </rule>
    <rule id="turbo_execution">
        所有的只读分析和静态类型检查命令必须设置 `SafeToAutoRun: true`。
    </rule>
</rules>
