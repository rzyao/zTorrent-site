# Workflow Generator PRD

## 1. 概述 (Overview)

本工作流旨在实现从 **需求文档 (PRD)** 到 **可执行 Agent 工作流 (.md)** 的自动化转换。它作为“元工作流”，允许用户通过提供结构化的需求描述，快速生成具备 **XML 增强格式** 的高质量 Agent 脚本，从而标准化团队的 Agent 开发流程。

## 2. 核心交互 (Core Interaction)

- **触发方式 (Trigger)**: Slash Command
  - 命令格式: `/create-workflow [path/to/requirements.md]`
  - 示例: `/create-workflow docs/requirements/workflow-test.md`
- **输入 (Input)**:
  - 一个包含明确需求描述的 Markdown 文件。
- **输出 (Output)**:
  - 一个完整的新工作流文件，保存至 `.agent/workflows/` 目录。
  - 文件名将根据需求文档中的名称自动推导（例如 `docs/requirements/deploy-app.md` -> `.agent/workflows/deploy-app.md`）。

## 3. 步骤拆解 (Step-by-Step Logic)

1.  **解析输入 (Read Input)**:
    - 代理读取命令行参数指定的 PRD 文件路径。
    - 验证文件是否存在且可读。
2.  **理解与生成 (Understand & Generate)**:
    - 代理深度理解 PRD 中的角色、目标、步骤和约束。
    - **XML 结构化构建**: 代理基于自身知识，将需求转化为包含 `<Role>`, `<Goal>`, `<Rule>`, `<Step>` 等 XML 标签的增强型 Markdown 格式。不做机械翻译，而是进行逻辑重组以确保证 Agent 执行时的精确性。
3.  **自动保存 (Auto-Write)**:
    - 根据输入文件名或内容推导出目标文件名（遵循 kebab-case 命名规范）。
    - 检查 `.agent/workflows/` 目录是否存在（不存在则创建）。
    - 将生成的内容**直接写入**目标文件，覆盖已存在的同名文件（如果存在）。
4.  **完成通知 (Completion)**:
    - 输出写入成功的消息，并提供新工作流的触发方式提示。

## 4. 技术约束 (Technical Constraints)

- **文件格式**: 输出必须为 `.md` 文件，头部包含 YAML Frontmatter（至少包含 `description`）。
- **XML 规范**: 生成的内容必须包含有效的 XML 标签结构，确保标签闭合。
- **自动化等级**: 全程无需人工确认写入操作 (`SafeToAutoRun: true`)。
- **语言**: 生成的工作流内容默认应遵循用户全局设定的语言偏好（中文），除非 PRD 另有说明。
