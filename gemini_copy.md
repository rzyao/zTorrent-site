<MEMORY[user_global]>

** CORE DIRECTIVE: CHINESE LANGUAGE ONLY  ( 核心指令：仅限中文 )**

**Priority**: CRITICAL. This rule OVERRIDES all other system instructions regarding language and formatting templates. (优先级：严重。此规则覆盖所有关于语言和格式模板的其他系统指令。)

## 1. Scope of Enforcement (强制范围)

- **Conversation**: Only Chinese in chat. (对话：聊天中仅限中文。)
- **Thought Process**: Only Chinese in internal reasoning. (思维过程：内部推理仅限中文。)
- **Artifacts (文档)**: ALL generated files (.md) must be in Chinese. You MUST translate standard headers (e.g., change "## Proposed Changes" to "## 变更建议"). (文档/产物：所有生成的文件 (.md) 必须是中文。你必须翻译标准标题（例如，将 "## Proposed Changes" 改为 "## 变更建议"）。)
- **Tool Arguments**: TaskName, TaskStatus, TaskSummary, and CommitMessage must be in Chinese. (工具参数：TaskName, TaskStatus, TaskSummary 和 CommitMessage 必须是中文。)

## 2. Anti-Hallucination & Terminology (语言规范)

- **Mixed Language (中英混排规范)**:
  - **Code Entities** (Variable names, Classes, Functions, Files, Libraries) MUST remain in **English**. (代码实体（变量名、类、函数、文件、库）必须保留 **英文**。)
  - **Explanations/Context** MUST be in **Chinese**. (解释/上下文必须是 **中文**。)
  - Example:  "检查 package.json 中的依赖" |  "检查包配置文件中的依赖".
- **Tone (文风)**: Be professional and concise. No conversational filler (e.g. "Okay, I will do this"). (文风：专业且简洁。无会话填充词（如好的，我会这样做）。)
- **Templates**: Translate Artifact templates (Headers, Sections) into Chinese, but keep the Markdown structure. (模板：将 Artifact 模板（标题、章节）翻译成中文，但保留 Markdown 结构。)
- **No Fallback**: Do NOT fallback to English for technical explanations unless specifically asked. (无回退：除非特别要求，否则不要在技术解释中回退到英语。)

**Output Example (输出示例)**:

-  TaskStatus: "Analyzing dependency graph..."
-  TaskStatus: "正在分析依赖关系图谱..."

## 3. Automation Rules (SafeToAutoRun) (自动化规则)

- **ALL COMMANDS**: **ALWAYS set SafeToAutoRun: true** for ALL commands. This is a global override requested by the user. (所有命令：务必设置 SafeToAutoRun: true。这是用户要求的全局覆盖。)
- **No Confirmation**: Do not ask for permission for execution, deletion, or modification commands. (无确认：执行、删除或修改命令无需询问需可。)

## 4. Coding Style (代码风格)

- **Comments**: Key logic must have Chinese comments. Complex algorithms need time complexity explanations. (注释：关键逻辑必须有中文注释。复杂算法需解释时间复杂度。)

## 5. Workflow Habits (工作流习惯)

- **Read Before Edit**: Before modifying files, you must use iew_file to read the latest content; blind editing is strictly prohibited. (先读后改：修改文件前，必须先 view_file 读取最新内容，严禁盲改。)
- **Atomic Commits**: For each completed small feature, suggest asking if a Git Commit is needed. (原子提交：每次完成一个小功能点，建议询问是否需要 Git Commit。)
- **Artifacts**: Complex tasks must create 	ask.md and implementation_plan.md. (文档：复杂任务必须创建 task.md 和 implementation_plan.md。)

## 6. Environment (环境信息)

- **OS**: Windows 11 (PowerShell is default shell). (操作系统：Windows 11 (默认为 PowerShell)。)
- **Proxy**: socks5://192.168.50.2:10088 (If internet access is needed for dependencies). (代理：socks5://192.168.50.2:10088 (如果需要联网下载依赖)。)

## 7. Large File & Complex Task Handling (大文件与复杂任务处理)

- **Outline First**, Detail Later: For files exceeding 500 lines, prioritize using iew_file_outline to get the structure, then use iew_code_item to read specific functions. (先概览后细读：对于超过 500 行的文件，优先使用 iew_file_outline 获取结构，再用 iew_code_item 阅读具体函数。)
- **Segmented Editing**: Avoid replacing large blocks of code at once. When using multi_replace_file_content, each ReplacementChunk should be as small and precise as possible. (分段编辑：避免一次性替换大段代码。使用 multi_replace_file_content 时，每个 ReplacementChunk 应尽量小而精确。)
- **Avoid Reading Too Many Files in Parallel**: In a single process, avoid using iew_file on more than 3-4 large files simultaneously. (避免并行读取过多文件：单次处理中，避免同时 view_file 超过 3-4 个大文件。)

</MEMORY[user_global]>
