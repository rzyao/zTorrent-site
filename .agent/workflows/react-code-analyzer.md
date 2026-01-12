---
description: 对指定的 React 组件进行全方位分析，并强制执行 Admin 设计规范
---

# React Code Analyzer (Design System Enhanced)

<workflow_meta>
<role>React 代码架构师 & UI 规范督察员</role>
<goal>对组件进行深度架构分析与性能诊断，同时作为"UI 警察"强制执行 `docs/admin-design-system.md` 中的视觉与交互规范。</goal>
</workflow_meta>

<optimization_strategy>
<principle>
架构先行，规范护航。先解决状态管理与数据流问题 (TanStack Query)，再统一视觉语言 (Admin Design System)。
</principle>

    <layer id="1" name="架构与规范层 (Architecture & Standards)" priority="CRITICAL" roi="90%">
        <description>核心架构重构与视觉一致性校准。</description>
        <technique name="Design System Enforcement (视觉强制)">
            严格对照 `docs/admin-design-system.md`。表格操作列必须用 Link 按钮；ID/Key 必须用 Geekblue Tag；严禁正文随意加粗。
        </technique>
        <technique name="Data Layer Modernization (数据现代化)">
            强制迁移至 TanStack Query。废弃手动 `useEffect` 请求。
        </technique>
        <technique name="Component Decomposition (组件拆分)">
            提取无状态 UI 组件 (`components/`) 和业务逻辑 Hook (`hooks/`)。
        </technique>
    </layer>

    <layer id="2" name="性能优化层 (Performance)" priority="MEDIUM" roi="10%">
        <description>针对性的渲染性能调优。</description>
        <technique name="Render Tuning">
            使用 `React.memo` 隔离重渲染，`useMemo` 缓存复杂计算。
        </technique>
    </layer>

</optimization_strategy>

<workflow_steps>

    <step id="1" name="Initialization">
        <description>获取目标文件与设计规范上下文。</description>
        <action>
            1. 获取用户指定的 React 文件路径。
            2. 读取 `view_file docs/admin-design-system.md` 以加载最新的视觉规范。
            3. 读取目标文件代码 (`view_file`)。
        </action>
    </step>

    <step id="2" name="Deep Analysis">
        <description>执行架构、逻辑与 UI 规范的三维诊断。</description>
        <checklist>
            <category name="UI Design Compliance (设计规范符合度)">
                <description>对照 `docs/admin-design-system.md` 进行审查</description>
                <item>**Button Context**: 表格操作列是否使用了 `variant="link"`？页面主操作是否使用了 `variant="primary"`？</item>
                <item>**Tag Semantics**: Key/ID/Code 是否使用了 `color="geekblue"`？状态颜色是否统一？</item>
                <item>**Typography Control**: 是否存在未授权的 `font-bold` 或 `text-lg`+？(仅限标题/表头)</item>
                <item>**Alignment**: 表格操作列是否居中 (`text-center`)？数值列是否右对齐？</item>
            </category>
            <category name="Architecture & Logic">
                <item>**State Management**: 是否存在大量 `useState` 需要提取到 Custom Hook？</item>
                <item>**Data Fetching**: 是否使用了 `useEffect` 进行 API 调用？(必须重构为 useQuery)</item>
                <item>**Component Structure**: 是否混用了 AntD 原生组件与 Admin UI 封装组件？</item>
            </category>
        </checklist>
        <output>包含架构重构建议与 UI 整改清单的分析报告。</output>
    </step>

    <step id="3" name="Refactoring Plan Generation">
        <description>生成重构计划。</description>
        <action>
            基于分析结果，生成 Markdown 格式的重构计划，包含：
            1. **UI 标准化任务**: 列出需要替换的 Button variant 和 Tag color。
            2. **逻辑提取任务**: 定义 `use[Page]Logic.ts` 的接口。
            3. **数据层迁移**: 定义 Query Keys 和 Mutation 策略。
        </action>
    </step>

    <step id="4" name="Execution Confirmation">
        <description>用户确认执行策略。</description>
        <action>
            询问用户是否执行自动重构：
            - [ ] 执行全量重构 (架构 + UI 规范 + 性能)
            - [ ] 仅执行 UI 规范化 (Fix Design System violations)
            - [ ] 仅生成报告
        </action>
    </step>

    <step id="5" name="Apply Changes" optional="true">
        <description>执行代码变更。</description>
        <action>
            1. **Logic Extraction**: 创建/更新 Custom Hook，迁移数据逻辑。
            2. **UI Standardization**:
               - 使用 `multi_replace_file_content` 批量修正 Button 和 Tag 的样式。
               - 强制移除不合规的 `font-bold` 和大字号类名。
            3. **Component Cleanup**: 拆分组件，清理 Imports。
            // turbo
            4. 运行 `pnpm tsc --noEmit` 验证类型安全。
        </action>
    </step>

</workflow_steps>

<rules>
    <rule id="design_system" priority="CRITICAL">
        必须严格遵守 `docs/admin-design-system.md`。**表格操作列按钮必须是 Link 样式且居中**；**Key/ID 必须是 Geekblue**；**严禁随意加粗字体**。
    </rule>
    <rule id="atomic_changes" priority="HIGH">
        UI 样式的修改应作为独立的原子操作进行，不要混在逻辑重构中，以便于 Review。
    </rule>
    <rule id="turbo_mode">
        只读分析命令和类型检查命令应设置 `SafeToAutoRun: true`。
    </rule>
</rules>
