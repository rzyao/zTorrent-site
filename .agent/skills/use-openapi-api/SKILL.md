---
name: use-openapi-api
description: 在前端项目中统一使用 OpenAPI 生成的 Service 进行接口调用。
---

# 为前端项目使用 openapi 生成的接口代码

当你需要在前端调用后端接口时，必须遵循以下规范：

1.  **禁止手动 request**: 严禁直接使用底层 `request` 函数手动拼接 URL 和参数。
2.  **查找 Service**: 检查 `src/api/services/` 目录，找到对应的 Service 类。
3.  **标准调用**: 使用 Service 类提供的静态方法进行 API 调用。
4.  **接口更新**: 如果后端接口有变动，须先运行项目定义的 API 生成脚本（如 `pnpm run generate:api`）。
