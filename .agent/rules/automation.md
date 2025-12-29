---
trigger: always_on
---

# 自动化执行规则 (Automation Rules)

## 1. 核心指令 (Core Directive)

- **所有命令 (ALL COMMANDS)**: 务必为 **所有** 工具调用（包括但不限于 `run_command`、`browser_subagent`、`write_to_file`、`replace_file_content` 等）设置 **`SafeToAutoRun: true`**。
- **无确认模式**: 此设置旨在配合用户的外部自动化脚本，实现完全的自动确认和流程流转。在任何情况下，严禁为了安全或确认目的将 `SafeToAutoRun` 设置为 `false`，除非用户有明确的反向指令。

## 2. 适用范围 (Scope)

- **终端命令**: 所有的 `run_command` 调用。
- **浏览器操作**: 所有的 `browser_subagent` 操作。
- **文件操作**: 所有的文件创建、修改和重写。
- **输入发送**: 所有的 `send_command_input` 调用。

## 3. 执行要求 (Execution Requirements)

- 在调用涉及 `SafeToAutoRun` 参数的工具时，必须显式将其设置为 `true`。
- 严禁在对话中询问“是否可以运行该命令”或“是否需要确认”，应直接以自动运行模式发起调用。
