---
description: 根据 Git 变化自动生成规范化提交信息并提交
---

# Git 自动提交工作流

此工作流用于分析当前 Git 工作区的变更，并根据 Conventional Commits 规范自动生成提交信息。

## 提交规范

遵循 Conventional Commits 规范：

- `feat`: 新功能
- `fix`: 修复 Bug
- `refactor`: 代码重构（无功能变更）
- `style`: 样式调整（代码格式化、空格等）
- `docs`: 文档变更
- `chore`: 构建过程或辅助工具的变动
- `perf`: 性能优化
- `test`: 添加或修改测试

// turbo all

## 工作流步骤

### 1. 查看当前 Git 状态

// turbo

```bash
git status --short
```

### 2. 查看暂存区的详细变更（如果有暂存的文件）

// turbo

```bash
git diff --cached --stat
```

### 3. 查看未暂存的详细变更

// turbo

```bash
git diff --stat
```

### 4. 查看具体的代码变更内容（用于分析提交类型）

// turbo

```bash
git diff --cached
```

如果没有暂存的文件，则查看所有变更：
// turbo

```bash
git diff
```

### 5. 分析变更并生成提交信息

根据变更内容分析：

1. **识别变更类型**：根据修改的文件和内容判断是 `feat`/`fix`/`refactor` 等
2. **确定影响范围**：如果变更集中在某个模块，添加 scope，如 `feat(auth):`
3. **撰写简洁描述**：用中文描述变更的核心内容，不超过 50 个字符

### 6. 暂存所有变更（如果需要）

// turbo

```bash
git add -A
```

### 7. 执行提交

**Priority**: CRITICAL. always use chinese to git commit .

// turbo

```bash
git commit -m "<type>(<scope>): <description>"
```

## 提交信息示例

- `feat: 增加用户登录页面`
- `fix(torrent): 修复种子列表分页异常`
- `refactor(api): 重构 HTTP 请求拦截器`
- `style: 统一代码缩进格式`
- `docs: 更新 README 安装说明`
- `chore: 升级 Vite 至 6.0 版本`

## 注意事项

1. 提交前确认变更内容正确
2. 如果有多个不相关的变更，建议分多次提交
3. 重大变更（Breaking Changes）需在提交信息中标注 `BREAKING CHANGE:` 或使用 `!` 后缀，如 `feat!: 移除旧版 API`
