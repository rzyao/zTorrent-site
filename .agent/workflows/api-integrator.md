---
description: 基于后端接口文档和前端页面完成接口对接/修正
---

# API Integrator

<workflow_meta>
<role>全栈集成专家 (Full Stack Integration Specialist)</role>
<goal>读取后端接口定义与前端页面代码，移除 Mock 数据或修正错误的接口调用，完整实现前后端数据对接。</goal>
</workflow_meta>

<workflow_steps>

<step id="1" name="Analyze Context">
<description>分析对接需求：确定涉及的页面组件与目标 API。</description>
<action>
1. **读取前端代码**：使用 `view_file` 读取目标页面或组件文件。
2. **定位 API 定义**：
   - 搜索 `src/api` 目录，找到对应的 Service 和 DTO 定义。
   - 如果有外部文档 (如 `docs/` 下的 Markdown)，也一并读取。
3. **识别现状**：
   - **Mock 场景**：对比页面 Mock 数据结构与 API DTO 结构的差异。
   - **修正场景**：识别当前使用的错误 Service/Endpoint，并找到正确的 API 方法。
</action>
</step>

<step id="2" name="Prepare Data Layer">
<description>准备数据获取与变更的 Hooks。</description>
<action>
1. **查询 (Query)**：
   - 确认是否需要创建或更新 `useQuery` 封装。
   - 确保 `queryKey` 符合规范且唯一。
2. **变更 (Mutation)**：
   - 对于提交/修改操作，准备 `useAsyncAction` 或 `useMutation`。
   - 确认 API SDK 方法的参数类型匹配。
</action>
</step>

<step id="3" name="Implement Integration">
<description>修改组件代码进行对接。</description>
<action>
1. **替换/修正数据源**：将页面中的静态数据、Mock 数据或错误的 API 调用替换为正确的 Hook 调用。
2. **状态绑定**：
   - 将 `isLoading`/`isPending` 绑定到 UI 的 Loading 状态。
   - 将 `error` 绑定到错误提示 UI。
3. **交互绑定**：将按钮点击或表单提交事件连接到正确的 API Mutation 方法。
4. **类型修正**：删除临时的 interface 定义，直接引用 `src/api` 下生成的 DTO 类型。
</action>
</step>

<step id="4" name="Cleanup & Verify">
<description>清理与验证。</description>
<action>
1. 删除不再使用的 Mock 数据对象和错误的 API 引用。
2. 清理未使用的 Import。
3. 检查是否有 TypeScript 类型报错。
4. 确认代码风格符合项目规范 (使用 `cn()` 合并类名，使用 Tailwind CSS)。
</action>
</step>

</workflow_steps>

<rules>
<rule id="turbo">Read-only commands (view_file, list_dir, grep_search) MUST use SafeToAutoRun: true.</rule>
<rule id="strict_types">禁止使用 `any` 类型。必须复用 `src/api` 中自动生成的 TypeScript 类型 (DTO)。</rule>
<rule id="react_query">获取数据必须使用 TanStack Query (useQuery)，禁止在 useEffect 中直接调用 API。</rule>
<rule id="error_handling">表单或操作类请求，推荐使用 `useAsyncAction` 统一处理 Loading 和 Error Toast。</rule>
</rules>
