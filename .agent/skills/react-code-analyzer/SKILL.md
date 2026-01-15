# Skill: React Code Analyzer

在修改任何 React 组件或进行 UI 审查时，必须先使用此 Skill 来对组件进行深度架构分析、性能诊断，并强制执行 Admin 设计规范。

## 核心任务

1. **深度分析**: 识别不必要的 `useEffect`、状态提升、组件过大等问题。
2. **规范检查**: 严格对照 `docs/admin-design-system.md` 和 `src/modules/admin/guidelines/UI_STANDARDS.md`。
3. **重构建议**: 提供清晰的重构计划，包括逻辑提取、数据层迁移（TanStack Query）和 UI 标准化。

## 强制规范清单

- **表格操作列**: 必须使用 `variant="link"` 且居中对齐 (`text-center`)。
- **状态颜色**: Key/ID 必须使用 `geekblue` Tag，状态颜色必须符合规范。
- **文字排版**: 严禁在非标题处随意使用 `font-bold` 或大字号。
- **数据流**: 强制将手动 `useEffect` 数据请求迁移至 `TanStack Query`。

## 操作流程

1. **读取代码**: 使用 `view_file` 或 `view_file_outline` 获取结构。
2. **加载规范**: 读取 `docs/admin-design-system.md` 或 `UI_STANDARDS.md`（如果尚未加载）。
3. **输出报告**: 生成包含“UI 标准化”和“架构调整”建议的报告。
4. **执行变更**: 在用户确认后，使用 `multi_replace_file_content` 进行原子化修改。
