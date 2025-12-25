---
description: 根据需求文档 (PRD) 自动生成结构化、XML 增强的 Agent 工作流文件。
---

# Create Workflow from PRD

<workflow_meta>
<role>工作流架构师 (Workflow Architect)</role>
<goal>读取指定的需求文档 (Markdown)，并将其转换为符合最佳实践的 XML 结构化 Agent 工作流文件 (.md)。</goal>
</workflow_meta>

<workflow_steps>

    <step id="1" name="Parse Input">
        <description>获取并读取需转换的需求文档路径。</description>
        <thought>
            用户应在指令中提供文件路径 (例如 `/create-workflow docs/requirements/my-feature.md`)。
            如果未提供，我需要主动询问或搜索相关文档。
        </thought>
        <action>
            1. 识别用户输入的文件路径。
            2. 使用 `view_file` 读取该文件内容。
            3. 如果文件不存在，提示错误。
        </action>
    </step>

    <step id="2" name="Generate Workflow Content">
        <description>将需求转换为 XML 结构化的工作流格式。</description>
        <thought>
            核心是将自然语言需求映射到 XML 结构：
            - `Role` & `Goal` -> `<workflow_meta>`
            - 步骤/逻辑 -> `<workflow_steps>` (包含 `thought` 和 `action`)
            - 约束/规范 -> `<rules>`
            并且头部必须有 standard YAML frontmatter。
        </thought>
        <action>
            生成文件内容，严格遵循以下模板结构：

            ```markdown
            ---
            description: [简短描述]
            ---

            # [Workflow Name]

            <workflow_meta>
            <role>[角色名称]</role>
            <goal>[主要目标]</goal>
            </workflow_meta>

            <workflow_steps>
                <step id="1" name="[步骤名]">
                    <description>[步骤描述]</description>
                    <thought>[思维过程]</thought>
                    <action>[具体行动]</action>
                </step>
                <!-- 更多步骤 -->
            </workflow_steps>

            <rules>
                <rule id="[规则ID]">[规则内容]</rule>
            </rules>
            ```
            **注意**：不要逐字翻译 PRD，而是要将其转化为 Agent 可执行的逻辑指令。
        </action>
    </step>

    <step id="3" name="Auto Save">
        <description>自动保存生成的工作流文件。</description>
        <thought>
            推导文件名: `docs/requirements/my-feature.md` -> `.agent/workflows/my-feature.md`.
            为了提升效率，直接通过自动化指令保存。
        </thought>
        <action>
            1. 确定目标文件路径 (位于 `.agent/workflows/` 下)。
            2. 使用 `write_to_file` 保存内容。如果目标文件已存在，直接覆盖 (Overwrite: true)。
            3. 告知用户生成成功，并说明调用方式 (例如 `@[workflow-name]` 或 `/workflow-name`)。
        </action>
    </step>

</workflow_steps>

<rules>
    <rule id="format" priority="CRITICAL">输出必须包含 `<workflow_meta>`, `<workflow_steps>`, `<rules>` 三大 XML 标签。</rule>
    <rule id="language">生成的 MD 文件内容（包括注释和思维链）必须使用**中文**。</rule>
    <rule id="automation">在执行 `write_to_file` 时，如果置信度高，应尝试设置 `SafeToAutoRun: true`。</rule>
</rules>
