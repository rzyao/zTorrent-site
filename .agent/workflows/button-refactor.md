---
description: 根据标注图片，将页面中的原生或旧样式按钮替换为自定义 Button 组件，并在多个模块间保持 UI 一致性。
---

# Button Component Refactor

<workflow_meta>
<role>前端 UI 精化专家 (Frontend UI Refinement Expert)</role>
<goal>精准识别图片中红框标注的按钮，使用项目自定义 Button 组件进行替换，确保视觉风格统一、逻辑完整且类型安全。</goal>
</workflow_meta>

<workflow_steps>

// turbo
<step id="1" name="Localization & Mapping">
<description>对比标注图片与源代码，准确定位目标文件和代码块。</description>
<action> 1. 分析图片上下文，确认按钮所在的模块（如 forum, app, admin）。2. 使用 `grep_search` 搜索图片中的关键词或关联文本（如按钮文字），定位具体页面文件。3. 确定按钮是原生 `<button>` 还是旧的 `antd` 或其他组件。
</action>
</step>

// turbo
<step id="2" name="Component Introspection">
<description>探测并读取当前模块最匹配的 Button 组件定义。</description>
<action> 1. 自动定位该文件所属模块对应的 UI 目录（优先搜索 `src/modules/*/components/ui/button.tsx`）。2. 使用 `view_file` 读取组件，提取 `variant` 和 `size` 的枚举值及默认值。
</action>
</step>

    <step id="3" name="Sementic Matching">
        <description>基于业务语义匹配最佳 Variant。</description>
        <thought>
            - 主要行动 (Primary) -> variant="default"
            - 次要行动 (Secondary) -> variant="outline" / "secondary"
            - 无边框装饰 -> variant="ghost"
            - 删除/危险 -> variant="destructive"
            - 纯图标 -> size="icon"
        </thought>
        <action>
            匹配后，在内存中准备替换模板，确保不修改任何原有 CSS 类，除非该类属于 Layout（如 margin）。
        </action>
    </step>

    <step id="4" name="Atomic Replacement">
        <description>执行代码替换，迁移属性。</description>
        <action>
            1. 使用 `replace_file_content` 替换旧按钮。
            2. **迁移规范**：
                - `onClick` -> 完整迁移。
                - `disabled` / `loading` / `type` -> 完整迁移。
                - 移除旧按钮的视觉类名（bg-*, text-*, border-*），仅保留定位类名（m-*, flex-*）。
                - 如果未导入 `Button`，则在文件顶部添加正确的 import。
        </action>
    </step>

    <step id="5" name="Verification & Quality">
        <description>执行类型检查和视觉逻辑校验。</description>
        <action>
            1. 使用 `check-frontend-errors` 验证替换后的文件是否有类型冲突。
            2. 检查生成的按钮是否由于缺少 `asChild` 或 `type` 而产生非预期行为。
            3. 如果存在 Lint 错误，立即根据错误 ID 进行微调。
        </action>
    </step>

</workflow_steps>

<rules>
    <rule id="no_style_mutation" priority="CRITICAL">绝对禁止修改 `button.tsx` 原文件。通过 variants 解决差异。</rule>
    <rule id="import_safety">确保导入路径与文件模块匹配，避免跨模块强耦合（除非是共享 UI 层）。</rule>
    <rule id="turbo_execution">所有的 read-only 步骤（step 1, 2）必须配合 SafeToAutoRun: true 执行。</rule>
</rules>
