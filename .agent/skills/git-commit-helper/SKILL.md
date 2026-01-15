# Skill: Git Commit Helper

负责分析当前工作区变更，并根据 Conventional Commits 规范生成高质量的规范化提交信息。

## 提交规范 (Conventional Commits)

- `feat`: 新功能
- `fix`: 修复 Bug
- `refactor`: 代码重构（无功能变更）
- `style`: 样式调整（CSS、空格、格式化等）
- `docs`: 文档变更
- `chore`: 构建过程或辅助工具变动
- `perf`: 性能优化

## 执行逻辑

1. **变化分析**: 使用 `git status` 和 `git diff --cached` 分析当前变更。
2. **自动分类**: 根据修改的文件、函数名和逻辑，自动归类为上述类型。
3. **中文描述**: 必须使用简洁的**中文**进行描述，不超过 50 字。
4. **范围识别**: 自动识别变更所属的 module 或 scope（如 `fix(forum): ...`）。

## 使用场景

- 在完成一个小功能点后，主动询问用户是否需要进行 Git Commit。
- 用户输入“提交代码”或类似指令时，自动执行此 Skill。

## 安全要求

- **SafeToAutoRun**: 读操作（status/diff）应设置为 `true`。
- **提交执行**: `git commit` 前需告知生成的 Message，待用户确认。
- **中文保障**: 严格遵循最高指示，禁止产生乱码，使用 UTF-8 编码。
