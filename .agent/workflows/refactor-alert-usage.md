---
description: 扫描并替换前端项目中的原生浏览器弹窗 (alert/confirm/prompt)，统一使用 UI 组件或移除冗余报错。
---

# Refactor Native Alerts

<workflow_meta>
<role>前端重构专家 (Frontend Refactoring Specialist)</role>
<goal>消除代码中的原生 `alert`, `confirm`, `prompt` 调用。针对 API 错误处理场景直接移除弹窗，针对业务交互场景替换为 `toast` 或 `Modal` 组件。</goal>
</workflow_meta>

<workflow_steps>

    <step id="1" name="Scan for Native Dialogs">
        <description>全项目扫描原生弹窗关键词。</description>
        <action>
            使用 `grep_search` 工具查找以下模式（启用正则 IsRegex: true）：
            `\balert\s*\(|\bconfirm\s*\(|\bprompt\s*\(`

            排除目录：`node_modules`, `dist`, `.git`。
        </action>
    </step>

    <step id="2" name="Context Analysis">
        <description>逐个文件读取并分析弹窗的使用场景。</description>
        <action>
            对上一步发现的每个文件，使用 `view_file` 读取上下文（建议读取匹配行前后 20 行）。

            **决策逻辑 (Decision Logic)**:
            1.  **API Error Context**: 如果 `alert` 出现在 `catch` 块中，或处理 API 响应的 `error` 回调中。
                *   -> **Action**: **移除 (Remote)**。因为全局已有统一错误弹窗，无需代码侧二次弹窗。

            2.  **Confirmation Context**: 如果是 `if (confirm('...'))`。
                *   -> **Action**: **重构 (Refactor)**。引入 `<ConfirmModal />` 或类似的确认组件代替。此操作通常涉及增加 state (`isOpen`)。

            3.  **Input Context**: 如果是 `prompt('...')`。
                *   -> **Action**: **重构 (Refactor)**。引入带有 `Input` 的 `Dialog` 组件。

            4.  **Notification Context**: 如果是普通的业务提示（如“复制成功”、“校验不通过”）。
                *   -> **Action**: **替换 (Replace)**。使用 `toast.success()`, `toast.warning()` 或 `toast.error()` (来自 `sonner` 库)。
        </action>
    </step>

    <step id="3" name="Execution & Import Check">
        <description>执行代码修改并确保依赖正确导入。</description>
        <action>
            1. 使用 `replace_file_content` 或 `multi_replace_file_content` 进行修改。
            2. **Critical**: 检查文件头部的 imports。
                *   如果使用了 `toast`，确保导入：`import { toast } from "sonner";`
                *   如果使用了 `ConfirmModal`，确保从正确的 UI 路径导入。
            3. 如果删除了 `alert` 导致捕获的错误变量（如 `e`）未被使用，且这是 TS 项目，请考虑改写为 `catch {}` 或忽略该变量。
        </action>
    </step>

    <step id="4" name="Verify">
        <description>验证修改结果。</description>
        <action>
            1. 再次运行 Step 1 的搜索命令，确保目标文件中的原生调用已被清理。
            2. 运行 `pnpm exec tsc --noEmit` (如果适用) 检查是否有因移除代码导致的未定义变量或类型错误。
        </action>
    </step>

</workflow_steps>

<rules>
    <rule id="no_redundant_alert">
        **绝对禁止**保留 `catch(e) { alert(e.message) }` 这种模式。根据用户需求，全局此时已有处理，此处必须移除。
    </rule>
    <rule id="toast_library">
        项目统一使用 `sonner` 库作为 toast 组件。不要引入 `react-toastify` 或其他库，除非项目已有明确依赖。
    </rule>
    <rule id="auto_run">
        搜索和读取文件的命令必须设置 `SafeToAutoRun: true`。
    </rule>
</rules>
