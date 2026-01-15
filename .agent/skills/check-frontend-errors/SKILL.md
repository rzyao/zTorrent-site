---
name: check-frontend-errors
description: 使用 TypeScript 编译器检查前端项目是否存在编译或类型错误。
---

# 使用 pnpm exec tsc --noEmit 检查前端项目是否报错

在提交或完成前端代码修改后，必须进行类型检查：

1.  **执行检查**: 在前端项目根目录下运行以下命令：
    ```powershell
    pnpm exec tsc --noEmit
    ```
2.  **分析错误**: 观察命令输出。如果存在任何 `error TSxxxx` 报错，必须立即在相关文件中修复。
3.  **通过标准**: 只有当该命令以退出码 0 结束且无错误输出时，才视为代码合格。
