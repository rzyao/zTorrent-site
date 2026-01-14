---
name: postgres-manager
description: 直接操作 PostgreSQL 数据库的技能，支持查询和更新操作。
---

# PostgreSQL Manager 技能

此技能允许 Antigravity 直接通过提供好的凭据访问和操作 PostgreSQL 数据库。

## 功能特性

- 执行原生 SQL 查询。
- 支持 SELECT, INSERT, UPDATE, DELETE 等操作。
- 结果以 JSON 格式输出，方便解析。

## 数据库配置

- **主机**: 192.168.50.2
- **端口**: 5432
- **用户名**: ztorrent
- **数据库**: ztorrent

## 使用方法

### 1. 执行 SQL 查询

使用 `run_command` 调用位于 `scripts/query.mjs` 的脚本：

```powershell
node .agent/skills/postgres-manager/scripts/query.mjs "SELECT * FROM users LIMIT 5;"
```

### 2. 执行更新/删除

```powershell
node .agent/skills/postgres-manager/scripts/query.mjs "UPDATE settings SET value = 'true' WHERE key = 'maintenance_mode';"
```

## 注意事项

- **安全性**: 在构建 SQL 语句时要极其小心，防止意外的数据丢失或破坏。
- **编码**: 确保 SQL 语句中的中文字符正确处理。
- **环境**: 必须确保项目中已安装 `pg` 依赖包（已经在 `package.json` 的 `devDependencies` 中）。

## 常用查询示例

- 查看表结构: `SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'your_table_name';`
- 列出所有表: `SELECT table_name FROM information_schema.tables WHERE table_schema = 'public';`
