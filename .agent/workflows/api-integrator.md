---
description: 分析后端接口文档，生成对接规划书，并可继续执行接口对接的全生命周期工作流。
---

# API Full-Lifecycle Integrator

<workflow_meta>
<role>全栈集成专家 (Full Stack Integration Specialist)</role>
<goal>
根据后端接口文档，从「规划分析」到「代码对接」再到「验证清理」，一站式完成前后端 API 集成任务。
</goal>
</workflow_meta>

// turbo-all

<workflow_steps>

<!-- ============================================ -->
<!-- Phase 1: PLANNING (规划阶段)                -->
<!-- ============================================ -->

<step id="1" name="Context Gathering" phase="Plan">
<description>获取后端接口文档，提取核心信息，构建关键词列表。</description>
<action>
1. 向用户确认接口文档路径（如 `docs/dev/[module]-api.md`）和目标前端页面（如 `src/pages/[Module]/`）。
2. 使用 `view_file` 读取接口文档。
3. 提取以下信息：
   - **核心实体 (Entities)**: 数据模型名称。
   - **核心端点 (Endpoints)**: CRUD、批量操作等。
   - **潜在关键词**: 用于扫描前端代码 (如 `Favorite`, `Topic`, `User`)。
</action>
</step>

<step id="2" name="Codebase Scanning" phase="Plan">
<description>扫描前端代码库，分析现状差距 (Gap Analysis)。</description>
<action>
1. 使用 `grep_search` 在 `src/` 中搜索步骤 1 提取的关键词。
2. 使用 `find_by_name` 在 `src/api` 中确认是否存在自动生成的 Service。
3. 使用 `view_file` 阅读搜索到的核心文件 (如 `src/pages/[Module]`, `src/api/services/[Module]Service.ts`)。
4. 分析：
   - 当前页面是否使用 Mock 数据？
   - 是否存在旧的/错误的 API 调用？
   - API SDK 已生成的 Service 方法是否足够？
</action>
</step>

<step id="3" name="Plan Drafting" phase="Plan">
<description>基于 Gap Analysis，撰写接口对接与扩展规划书。</description>
<output_template>
# [Module] 接口对接规划

## 1. 现状分析

| 维度     | 详情                                    |
| -------- | --------------------------------------- |
| 相关文件 | `src/pages/...`, `src/api/services/...` |
| 当前状态 | [Mock 数据 / 旧接口 / 部分对接]         |

## 2. 对接任务清单

### 2.1 API 层 (`src/api`)

- [ ] 确认 OpenAPI 代码生成器已为此模块生成 Service
- [ ] 若需手动方法，添加到 `src/api/custom/`

### 2.2 数据层 (Hooks)

- [ ] 创建 `use[Entity]Query.ts` for TanStack Query (Query Key: `[module, ...]`)
- [ ] 创建/使用 `useAsyncAction` for Mutations

### 2.3 UI 组件

- [ ] 修改 `[Component].tsx`: 绑定真实数据
- [ ] 处理 Loading / Error / Empty 状态

## 3. 功能扩展建议 (Value Add)

> [!TIP]
> 利用接口能力提出的改进建议

- **建议 1**: [标题] - [描述]
  </output_template>
  <action>

1. 按模板撰写规划书。
2. 使用 `write_to_file` 保存到 `docs/dev/plans/[module]-integration.md`。
3. **询问用户**: "规划书已生成。您希望现在开始执行对接，还是稍后手动启动？"
   - 若用户同意，继续进入 Phase 2。
   - 若用户拒绝，工作流结束。
     </action>
     </step>

<!-- ============================================ -->
<!-- Phase 2: EXECUTION (执行阶段)               -->
<!-- ============================================ -->

<step id="4" name="Data Layer Preparation" phase="Execute">
<description>准备数据获取与变更的 Hooks/Service 调用。</description>
<action>
1. **查询 (Query)**:
   - 确认或创建 `useQuery` 封装，确保 `queryKey` 唯一。
2. **变更 (Mutation)**:
   - 使用 `useAsyncAction` 处理表单提交/修改操作。
   - 验证 API SDK 方法的参数与返回类型匹配。
</action>
</step>

<step id="5" name="UI Integration" phase="Execute">
<description>修改组件代码，完成数据与 UI 的绑定。</description>
<action>
1. **替换数据源**: 移除 Mock 数据或错误的 API 调用，使用步骤 4 准备的 Hooks。
2. **状态绑定**:
   - `isLoading`/`isPending` -> Loading Skeleton / Spinner。
   - `error` -> Error Alert / Toast。
3. **交互绑定**: 按钮点击 / 表单提交 -> `execute` 方法。
4. **类型修正**: 删除临时的 `interface`，直接引用 `src/api/models` 中的 DTO。
</action>
</step>

<step id="6" name="Cleanup" phase="Execute">
<description>清理代码冗余。</description>
<action>
1. 删除不再使用的 Mock 数据对象和变量。
2. 清理未使用的 Import 语句。
3. 确保 `cn()` 用于类名合并，遵循 Tailwind CSS 规范。
</action>
</step>

<step id="7" name="Verification" phase="Execute">
<description>验证集成结果，确保无类型错误。</description>
<action>
1. 运行 `npx tsc --noEmit` 检查 TypeScript 类型。
2. (可选) 启动 `npm run dev` 并使用 `browser_subagent` 校验页面功能。
3. 若发现问题，返回步骤 5 进行修复。
</action>
</step>

</workflow_steps>

<rules>
<rule id="turbo_read">Read-only commands (view_file, list_dir, grep_search, find_by_name) MUST use SafeToAutoRun: true.</rule>
<rule id="language">所有生成的文档、规划书和代码注释必须使用 **中文**。</rule>
<rule id="strict_types">禁止使用 `any` 类型。必须复用 `src/api` 中自动生成的 TypeScript 类型 (DTO)。</rule>
<rule id="react_query">获取数据必须使用 TanStack Query (useQuery)，禁止在 useEffect 中直接调用 API。</rule>
<rule id="error_handling">表单或操作类请求，使用 `useAsyncAction` 统一处理 Loading 和 Error Toast。</rule>
<rule id="plan_first">**强制先规划再执行**。若用户直接请求对接而未提供规划书，必须先执行 Phase 1 生成规划。</rule>
</rules>
