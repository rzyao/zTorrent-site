---
name: multi-project-ui-standards
description: 跨项目的 UI 规范管理技能。根据文件路径自动切换 Admin, App, Forum 三套不同的设计标准。
---

# 跨项目 UI 规范技能 (Multi-Project UI Standards)

这个技能确保 Antigravity 在处理项目中不同的子业务模块时，始终遵循正确的 UI 规范。本项目包含三个完全独立 UI 体系的子模块。

## 逻辑切换规则

在执行代码编写、重构或审查时，请根据文件路径 (`AbsolutePath`) 自动应用对应的规范：

- **路径包含 `/src/modules/admin/`**:
  - 应用规范: [Admin UI Standards](./standards/admin.md)
  - 核心风格: Ant Design 兼容版 + Tailwind，紧凑型布局，`variant="link"` 操作。
- **路径包含 `/src/modules/app/`**:
  - 应用规范: [App UI Standards](./standards/app.md)
  - 核心风格: Shadcn UI (Radix + Tailwind)，圆润现代，Mobile-First。
- **路径包含 `/src/modules/forum/`**:
  - 应用规范: [Forum UI Standards](./standards/forum.md)
  - 核心风格: 侧重内容阅读，特定编辑器组件。

## 统一准则 (所有模块适用)

1. **图标**: 全力使用 `lucide-react`，禁止混用其他图标库（除非业务强要求）。
2. **响应式**: 使用 Tailwind 的断点（`sm`, `md`, `lg`），禁止在 JS 中硬编码像素宽度。
3. **颜色变量**: 优先使用 Tailwind 类名或 `--primary` 等 CSS 变量，禁止硬编码十六进制颜色值。

## 使用场景示例

### 1. 组件开发

"在 `src/modules/admin/` 下创建一个按钮。" -> **动作**: 查阅 `admin.md`，使用 `size="small"` 和管理端的主色定义。

### 2. UI 审查

"检查 `src/modules/app/pages/Home.tsx` 的风格。" -> **动作**: 查阅 `app.md`，检查是否有响应式适配和圆角设置。

---

_注意：每套规范都在对应的子文档中详细定义。如果发现规范冲突，以子文档为准。_
