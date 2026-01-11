---
description: 自动生成或重构 Admin 模块的列表页面，强化对旧代码功能的还原与 UI 标准化。
---

# Admin 列表页生成器 (Admin List Page Generator - XML v2.1)

<workflow_meta>
<role>前端架构资深开发 (Senior Frontend Architect)</role>
<goal>将 Admin 模块的列表页面标准化，确保业务逻辑 (Hook) 与 UI 布局 (Component) 分离，并**完整还原**原有的操作栏功能（搜索、筛选、按钮）及表格列逻辑，严格符合 Ant Design + Tailwind 规范。</goal>
</workflow_meta>

<workflow_steps>

    <step id="1" name="环境与旧代码分析 (Context & Legacy Analysis)">
        <description>获取目标模块信息，并深度分析旧文件（如果是重构任务）以防功能遗漏。</description>
        // turbo
        <action>
            1. 确定目标模块路径及对应的 API Service。
            2. **旧代码扫描**：如果存在旧文件（如 `OldPage.tsx`），必须提取以下要素：
               - **操作栏 (Toolbar)**：所有的搜索框（Key/Enter触发）、下拉筛选（Status/Type）、操作按钮（Add/Export/Batch）。
               - **表格列 (Columns)**：列定义，特别是自定义 `render`（如 `Switch`, `Tag`, `Button`）。
               - **分页设置**：默认 `pageSize` 及分页选项。
            3. 阅读 `src/modules/admin/guidelines/antd-tailwind-integration.md` 确认 UI 规范。
        </action>
    </step>

    <step id="2" name="结构初始化 (Structure Initialization)">
        <description>建立标准化的模块目录结构。</description>
        // turbo
        <action>
            1. 在 `src/modules/admin/pages/[parent-path]/[module-name]/` 下创建目录。
               (不再推荐使用 `shared` 目录，建议就在 `pages` 下建立自包含模块)。
            2. 创建空文件：`types.ts`, `use[Module]Logic.tsx`, `index.tsx`, 和 `components/[Module]Modal.tsx`。
        </action>
    </step>

    <step id="3" name="核心逻辑抽离 (Logic Orchestration)">
        <description>实现 `use[Module]Logic.tsx`，集中管理状态与业务。</description>
        <thought>
            这个 Hook 是页面的大脑。
            - **状态管理**：`query` (包含 `page`, `limit` 及所有筛选字段), `loading`, `data`, `total`。
            - **搜索逻辑**：必须实现 `searchText` 独立状态 + `handleSearch` 方法（重置页码为1）。
            - **列定义**：完整迁移旧代码的列，包括使用 `Switch` (状态切换)、`Button` (操作) 等组件的 `render` 函数。
            - **CRUD**：基于 `useAsyncAction` 封装删除、更新状态等操作。
        </thought>
        <action>编写 Logic Hook。</action>
    </step>

    <step id="4" name="原子组件与操作栏 (Components & Toolbar)">
        <description>开发弹窗组件并规划操作栏结构。</description>
        <action>
            1. **Modal 开发**：实现新增/编辑弹窗，遵循 AntD Form 规范。
            2. **UI 元素准备**：准备好 `index.tsx` 需要的 UI 组件：
               - 搜索：`Input` + `Button` (无圆角连接，`-ml-px`)。
               - 筛选：使用 **Admin UI Select** (`@/modules/admin/components/ui/select`) 替换原生 select。
               - 按钮：主要操作放在 `toolbarRight`，筛选放在 `toolbarLeft`。
        </action>
    </step>

    <step id="5" name="页面组装 (Page Assembly)">
        <description>实现 `index.tsx` 入口。</description>
        <action>
            1. 注入 Hook，解构出 `columns`, `data`, `toolbarProps` 等。
            2. 使用 `DataTable` 组件：
               - **toolbarLeft**：放置 搜索框组合 + 状态 Select。
               - **toolbarRight**：放置 "新增" 按钮。
               - **pagination**：绑定 Hook 的分页状态。
            3. 注册路由到 `componentRegistry.ts`。
        </action>
    </step>

    <step id="6" name="完整性验证 (Integrity Verification)">
        <description>检查是否遗漏功能。</description>
        <checklist>
            <item>功能回归：旧页面的所有筛选器是否都已存在？</item>
            <item>列完整性：由 `render` 渲染的复杂列（如时间格式化、状态开关）是否正常工作？</item>
            <item>交互一致：搜索是否支持回车触发？下拉选择是否立即生效？</item>
            <item>样式合规：是否移除了所有 Shadcn 的默认样式，使用了 AntD 风格的 Select 和 Input？</item>
        </checklist>
    </step>

</workflow_steps>

<rules>
    <rule id="toolbar_mandatory" priority="HIGH">
        **必须显式实现操作栏**：严禁遗漏搜索框和筛选器。搜索框必须配套搜索按钮。
    </rule>
    <rule id="antd_ui_only">
        必须使用 `src/modules/admin/components/ui` 下的标准化组件 (`Select`, `Input`, `Switch`)，禁止使用原生 HTML 标签。
    </rule>
    <rule id="no_page_container">
        页面组件 (Index.tsx) 严禁使用 `AdminPageContainer` 包裹。外层 Admin 布局已统一设置内边距 (`p-6`)，页面组件应直接使用 Fragment 或 `div` 作为根元素，避免重复内边距。
    </rule>
    <rule id="turbo_mode">
        只读查看、目录创建等无副作用命令需设置 `SafeToAutoRun: true`。
    </rule>
</rules>
