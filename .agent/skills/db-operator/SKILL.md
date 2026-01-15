# 数据库操作专家 (Database Operator Skill)

此技能允许 Antigravity 直接连接并操作 PostgreSQL 数据库。它集成了用户提供的连接配置，可以通过脚本执行任意 SQL 语句。

## 1. 核心功能

- **执行查询**: 运行 `SELECT` 语句并以表格形式显示结果。
- **数据修改**: 支持 `INSERT`, `UPDATE`, `DELETE` 等 DML 操作。
- **结构查看**: 可以执行查看表结构、索引等管理查询。

## 2. 使用方法

你可以通过运行内置的 `query.ts` 脚本来执行 SQL 操作：

```powershell
# 语法
npx tsx .agent/skills/db-operator/scripts/query.ts "你的 SQL 语句"

# 示例：查询用户
npx tsx .agent/skills/db-operator/scripts/query.ts "SELECT * FROM users LIMIT 5"

# 示例：更新配置
npx tsx .agent/skills/db-operator/scripts/query.ts "UPDATE settings SET value = 'true' WHERE key = 'maintenance_mode'"
```

## 3. 注意事项

- **安全性**: 谨慎执行修改或删除操作，建议在操作前先进行 SELECT 验证。
- **编码**: 脚本默认使用 UTF-8 编码处理输出。
- **依赖**: 依赖项目中已安装的 `pg` 包和 `tsx` 执行器。

## 4. 数据库配置

- **Host**: 192.168.50.2
- **Port**: 5432
- **User**: ztorrent
- **DB**: ztorrent
