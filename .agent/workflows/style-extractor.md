---
description: 智能提取前端代码中的设计风格与Tailwind类名，支持从单一文件拆解多种组件风格，生成“一类一档”的原子化设计文档。
---

# Style Extractor (多风格设计提取器)

自动分析组件代码，提取视觉特征（Color, Typography, Shadows, Spacing）。核心能力是将**复杂文件解构**为多个独立的设计类别（Category），并按“功能族群”归档。

## Role & Goal

- **Role**: 设计系统架构师 (Design System Architect)
- **Goal**: 解构代码中的设计语言，维护细粒度、高复用性的设计文档系统。
- **Output Pattern**: `docs/design-style/<Category>.md` (例如 `buttons.md`, `cards.md`, `inputs.md`)

## Workflow Steps

### 1. Initialization & Analysis (初始化与拆解)

确定分析目标，并制定**拆分归档策略**。

1.  **读取文件**: 使用 `view_file` 读取目标代码文件。
2.  **风格命名 (Style Name)**: 确定当前提取的风格主题（如 "Default", "DarkGlass", "Cyberpunk"）。
3.  **识别类别 (Categories Identification)**:
    - **核心规则**: 不要简单地根据文件名分类。要根据**视觉组件的本质**分类。
    - **拆解原则 (Deconstruction)**: 如果一个文件（如 `HomePage.tsx`）包含按钮、卡片、输入框等多种元素，**必须**将它们分别归类，而不是统统放入 `pages`。
    - **分类映射示例**:
      - 页面中的提交按钮 -> 归入 **`buttons`**
      - 页面中的展示卡片 -> 归入 **`cards`**
      - 页面中的搜索框 -> 归入 **`inputs`**
      - 页面整体网格布局 -> 归入 **`layouts`** 或 **`pages`**
    - **Decision**: 列出所有需要提取的 Categories 列表（例如: `['cards', 'badges', 'layouts']`）。

### 2. Context Check (上下文检查)

检查目标分类文档是否存在，避免重复造轮子。

// turbo-all

针对上一步识别出的**每一个** Category，执行检查：

```powershell
$targetDir = "docs/design-style"
# 确保目录存在
if (!(Test-Path $targetDir)) { New-Item -ItemType Directory -Force -Path $targetDir }

# 替换为实际分析出的类别列表
$categories = @("cards", "buttons", "badges")

foreach ($cat in $categories) {
    $path = "$targetDir/$cat.md"
    if (Test-Path $path) {
        Write-Output "Category [$cat] exists. Reading content..."
        Get-Content $path -Raw
    } else {
        Write-Output "Category [$cat] will be created."
    }
}
```

### 3. Content Generation (内容生成)

按类别分别生成或追加 Markdown 内容。

**对于每一个 Category**:

1.  **提取特征**:
    - **Design Tokens**: 颜色、边框、圆角、阴影。
    - **Interactive States**: `hover`, `active`, `focus`。
2.  **构建文档块**:
    - 如果是新文件，包含一级标题 `# [Category] Design System`。
    - 包含/追加二级标题 `## Style: [StyleName]`。
    - 在风格下添加组件详情。

**文档模板**:

````markdown
# [Category] Design System

## Style: [StyleName]

> [风格描述]

### [Component Name] (e.g. TorrentCard)

**Visual Summary**:

- **Base**: `bg-neutral-800 rounded-xl border-neutral-700`
- **Interactive**: `hover:border-amber-500 hover:shadow-lg`

#### Code Snippet

```html
<div class="...">...</div>
```
````

```

### 4. Archiving (保存与归档)

将生成的内容写入对应的文件。

- **操作**: 使用 `write_to_file` (新文件) 或 `multi_replace_file_content` (追加/更新)。
- **注意**: 如果一次性提取了 `cards`, `badges`, `layouts` 三类，你需要分别对 `docs/design-style/cards.md`, `docs/design-style/badges.md` 等文件进行操作。
- **语言**: 必须使用 **中文**。

## Automation Rules (Turbo)

- 涉及只读操作 (`view_file`, `Get-Content`, `Test-Path`) 必须设置 `SafeToAutoRun: true`。
- 涉及目录创建 (`New-Item`) 必须设置 `SafeToAutoRun: true`。
```
