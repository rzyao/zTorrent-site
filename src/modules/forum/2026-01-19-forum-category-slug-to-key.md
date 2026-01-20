# API 变更文档：论坛分类 slug → key

## 变更日期：2026-01-19

## 变更概要

论坛分类（ForumCategory）的业务唯一标识字段从 `slug` 全量替换为 `key`，并同步调整了查询分类的接口路由与请求体字段。

本次变更为**破坏性变更**：不提供旧字段/旧接口兼容，也不提供数据库迁移脚本。

---

## 破坏性变更（Breaking Changes）

### 1) 数据字段：`slug` 改为 `key`

- `ForumCategory.slug` 被移除，改为 `ForumCategory.key`。
- 该字段仍保持唯一性约束（unique）。

影响：
- 前端/调用方创建分类、更新分类时，请求体字段必须从 `slug` 改为 `key`。
- 后端按分类唯一标识查询分类时，查询条件从 `slug` 改为 `key`。

### 2) 分类查询接口：`/by-slug` 改为 `/by-key`

| 接口描述 | 旧路由 | 新路由 | 方法 |
| :-- | :-- | :-- | :-- |
| 根据唯一标识获取分类 | `POST /forums/categories/by-slug` | `POST /forums/categories/by-key` | POST |

旧接口立即废弃（不可用）。

---

## 请求体变更说明

### 1) 根据唯一标识获取分类

#### 旧请求体

```json
{
  "slug": "general"
}
```

#### 新请求体

```json
{
  "key": "general"
}
```

### 2) 创建分类 / 更新分类

#### 旧字段

- `slug: string`

#### 新字段

- `key: string`

说明：
- 更新分类接口仍为 `POST /forums/categories/update`，仅字段名变更。

---

## 数据库变更提示（不包含迁移实现）

代码已将实体字段从 `slug` 切换为 `key`，数据库需要自行保证以下条件，否则会在运行时出现列不存在/写入失败等错误：

- 表 `forum_categories` 存在列 `key`
- `key` 列满足唯一性约束（unique）
- 旧列 `slug` 的处理策略由部署侧决定（例如重命名列、创建新列并回填数据等）

注意：当前项目 TypeORM `synchronize` 默认由环境变量控制，通常为 `false`，不会自动修改表结构。

---

## 受影响代码位置（便于检索）

- 实体：`src/community/forums/entities/forum-category.entity.ts`
- DTO：
  - `src/community/forums/categories/dto/create-category.dto.ts`
  - `src/community/forums/categories/dto/update-category.dto.ts`
  - `src/community/forums/categories/dto/category-by-key.dto.ts`
- Controller：`src/community/forums/categories/categories.controller.ts`
- Service：`src/community/forums/categories/categories.service.ts`
- 脚本：`src/cli/verify-forum-tags-visibility.ts`

---

## 悬赏操作限制（与 key 变更同步）

- 仅当话题所属分类 `key = "bounty"` 时，允许进行悬赏相关操作：
  - 设置悬赏：`POST /forums/topics/bounty/set`
  - 取消申请：`POST /forums/topics/bounty/cancel-request`
  - 追加金额：`POST /forums/topics/bounty/increase`
  - 发放悬赏：`POST /forums/topics/bounty/award`
- 服务层新增统一校验（示意）：根据 `topic.categoryId` 查询分类，若：
  - 分类不存在：返回 `BAD_REQUEST`，`message = "话题分类不存在，禁止设置悬赏"`
  - 分类存在但 `key ≠ "bounty"`：返回 `BAD_REQUEST`，`message = "仅悬赏分类话题允许设置悬赏"`
- 前端同步优化：
  - 话题详情页的操作入口（作者/管理员）仅在 `category.key === "bounty"` 时显示或可用。
  - 在触发悬赏相关请求前进行前置校验，不满足条件直接提示并不发送请求。
  - 错误文案统一：`仅悬赏分类话题允许设置悬赏` 与 `话题分类不存在，禁止设置悬赏`。
