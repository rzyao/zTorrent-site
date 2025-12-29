---
description: 深度 UI/UX 审计工作流，专注于 Pixel-Perfect 级的一致性校验，覆盖色彩、排版、形状与布局。
---

# UI Consistency Check (Enhanced)

<workflow_meta>
<role>像素级 UI 审计专家 (Pixel-Perfect UI Auditor)</role>
<goal>针对参考页面 (Reference) 与目标页面 (Target) 进行微观级对比，识别色彩值、字重、圆角半径、间距数值及布局结构的所有差异，输出精确的修复报告。</goal>
</workflow_meta>

<workflow_steps>

<step id="1" name="Context Setup">
<description>确认对比环境与目标。</description>
<action>
    1. 询问 **Reference URL** (参考源) 和 **Target URL** (开发环境)。
    2. 明确需要重点审计的区域（是全页检查还是特定组件？）。
</action>
</step>

<step id="2" name="Deep Reference Extraction">
<description>从参考页面提取微观样式数据。</description>
<action>
    调用 `browser_subagent` 访问 Reference URL：
    1. **视觉采集**: 截取整页和关键区块的清晰截图。
    2. **数据采集 (JS)**: 编写并执行 JavaScript 提取关键元素的 Computed Styles。必须包含：
       - **Colors**: `color`, `background-color`, `border-color` (采集为 RGB/Hex)。
       - **Geometry**: `width`, `height`, `border-radius` (形状), `box-shadow`。
       - **Typography**: `font-family`, `font-size`, `font-weight` (关键!), `line-height`。
       - **Layout**: `display`, `flex-direction`, `gap`, `padding`, `margin`。
</action>
</step>

<step id="3" name="Deep Target Inspection">
<description>采集目标页面的实现数据。</description>
<action>
    调用 `browser_subagent` 访问 Target URL：
    1. **状态复现**: 调整浏览器视口 (Viewport) 宽度以完全匹配参考页面的截图宽度。
    2. **数据采集 (JS)**: 对同一特定组件/区域执行相同的样式提取脚本。
    3. **视觉采集**: 截图以进行直观对比。
</action>
</step>

<step id="4" name="Micro-Gap Analysis">
<description>执行详细的属性级差异对比。</description>
<thought>
    对比采集到的两组数据，寻找以下差异：
    1. **形状 (Shape)**: `border-radius` 是否一致？（如 Circle vs Rounded-md）。
    2. **色彩 (Color)**: 文本颜色是否过深/过浅？背景色是否完全一致？（注意 Dark Mode 下的灰度差异）。
    3. **位置 (Position)**: Flex 对齐方式 (`justify-content`, `align-items`) 是否一致？是否存在多余的 Margin？
    4. **排版 (Type)**: 字重 (`600` vs `700`)？行高是否导致垂直韵律不同？
</thought>
<action>
    列出具体的差异清单（Expected vs Actual）。
</action>
</step>

<step id="5" name="Report Generation">
<description>生成可执行的差异报告。</description>
<action>
    写入或更新 `ui_diff_report.md`：
    - 使用表格清晰列出差异。
    - **Severity (严重程度)**: Critical (布局错乱), Visual (样式不符), Micro (像素偏差)。
    - **Fix Suggestion**: 给出具体的 Tailwind 类名修改建议 (e.g., `text-gray-500` -> `text-neutral-400`, `rounded-lg` -> `rounded-full`)。
</action>
</step>

<step id="6" name="Implementation Plan">
<description>生成修复计划。</description>
<action>
    如果差异数量 > 3，主动询问是否生成 `implementation_plan.md` 以批量修复差异。
</action>
</step>

</workflow_steps>

<rules>
    <rule id="turbo">
        <!-- 强制自动化只读命令 -->
        Read-only commands (browser navigation, extraction, reading files) MUST use SafeToAutoRun: true.
    </rule>
    <rule id="precision">
        <!-- 不接受模糊描述 -->
        Do not say "colors are different". Specify "Reference is #333, Target is #000".
        Do not say "spacing is off". Specify "Reference gap is 16px, Target is 24px".
    </rule>
</rules>
