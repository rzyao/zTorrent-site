---
description: 自动生成或重构 Admin 模块的列表页面，遵循逻辑抽离、组件原子化以及 Ant Design + Tailwind 融合规范。
---

# Admin 列表页生成器 (Admin List Page Generator - XML v2)

<workflow_meta>
<role>前端架构资深开发 (Senior Frontend Architect)</role>
<goal>将 Admin 模块的列表页面标准化，实现业务逻辑 (Hook) 与 UI 布局 (Component) 的深度分离，并确保视觉风格严格符合 Ant Design 设计规范与项目定制的 Tailwind 主题。</goal>
</workflow_meta>

<workflow_steps>

    <step id="1" name="环境与规范同步 (Context & Guidelines)">
        <description>获取目标模块信息并确认 AntD-Tailwind 融合规范。</description>
        // turbo
        <action>
            1. 使用 `view_file` 阅读 `src/modules/admin/guidelines/antd-tailwind-integration.md` 确保最新的 Token 映射关系。
            2. 确定目标模块 `[module]` 名称及对应的 API Service。
        </action>
    </step>

    <step id="2" name="结构初始化 (Structure Initialization)">
        <description>在 `src/modules/admin/shared/[module]` 目录下建立标准化的工程结构。</description>
        // turbo
        <action>
            1. 执行 `run_command` 创建目录：`mkdir -p src/modules/admin/shared/[module]/{components,hooks}`。
            2. 创建空文件：`types.ts`, `constants.ts`。
        </action>
    </step>

    <step id="3" name="核心逻辑抽离 (Logic Orchestration)">
        <description>实现模块业务逻辑中心 `hooks/use[Module]Logic.tsx`。</description>
        <thought>
            这个 Hook 必须是页面的“大脑”，不含任何 UI 渲染逻辑。
            - 状态管理：使用 `DataTable` 所需的 `query`, `setQuery`, `data`, `loading`。
            - 列定义 (`columns`)：在 Hook 内部或 `constants.ts` 中定义，必须包含操作列且使用项目标准 UI 组件。
            - 弹窗控制：封装所有的 `open/close` 状态及基于 `useAsyncAction` 的 CRUD 操作。
            - 样式参考：间距应参考 AntD Spacing 规范，文本使用 `text-neutral-900` (主要) 和 `text-neutral-500` (次要)。
        </thought>
        <action>编写 `use[Module]Logic.tsx` 并导出所有状态与方法。</action>
    </step>

    <step id="4" name="原子业务组件开发 (Atomic Component Development)">
        <description>实现具体的业务弹窗组件 (如 EditModal, DetailModal)。</description>
        <action>
            1. 在 `shared/[module]/components` 中为每个操作模块创建组件。
            2. **强制规范**：
               - 使用 `src/modules/admin/components/ui/modal` 作为容器。
               - 控件高度必须匹配 AntD 规范：默认使用 `h-8` (32px)，小型使用 `h-6` (24px)。
               - 边框颜色使用 `border-gray-200`，分割线使用 `divide-gray-100`。
        </action>
    </step>

    <step id="5" name="页面组装与注册 (Page Assembly & Registration)">
        <description>在 `src/modules/admin/pages/` 下创建入口并注册路由。</description>
        <action>
            1. 实现 `Index.tsx`：注入 `use[Module]Logic`，通过 `DataTable` 渲染列表。
            2. 更新 `src/routes/componentRegistry.ts`，确保导入路径正确。
        </action>
    </step>

    <step id="6" name="规范验证 (Verification & Audit)">
        <description>对生成的代码进行合规性检查。</description>
        <checklist>
            <item>UI 检查：是否还有直接引用 `antd` 组件的情况？（应使用 `ui/` 下的封装组件）</item>
            <item>样式检查：颜色类名是否使用了 `neutral-*` 系列代替通用的 `gray-*`？</item>
            <item>逻辑检查：`Index.tsx` 是否超过 150 行？核心逻辑是否已提取到 Hook？</item>
            <item>类型检查：使用 `tsc` 或查看编辑器 lint 错误。</item>
        </checklist>
    </step>

</workflow_steps>

<rules>
    <rule id="antd_consistency">
        所有手动编写的 Tailwind 类名必须参考 `antd-tailwind-integration.md` 中的映射表。严禁使用未经定义的颜色值。
    </rule>
    <rule id="logic_purity">
        Hook (`use[Module]Logic`) 禁止返回任何 JSX 元素（除 `columns` 中的渲染函数外）。列表操作按钮的样式必须由 Hook 内部逻辑决定，但由原子组件执行。
    </rule>
    <rule id="component_size">
        单个业务弹窗组件文件不应超过 200 行，若逻辑复杂应进一步拆分子组件。
    </rule>
    <rule id="turbo_mode">
        所有的只读查看 (view_file)、目录创建 (mkdir)、简单的文件改名 (mv) 命令必须设置 `SafeToAutoRun: true`。
    </rule>
</rules>
