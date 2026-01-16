# 论坛标签组与类别可见性 - 前端对接文档

## 概述

本文档描述论坛“标签组 + 类别标签可见性限制”相关接口与前端接入方式，用于：

- 发帖/编辑：根据当前分类动态过滤可选标签
- 分类页：侧边栏标签筛选器仅显示当前分类可用标签
- 管理后台：维护标签组、标签所属组、分类的标签可见性配置

**基础路径**：`/forums`

**响应格式**：统一响应封装（成功 `code=1000`，失败见“错误处理”）

## 一、统一响应与错误处理

### 1.1 成功响应结构

所有接口成功时返回：

```json
{
  "code": 1000,
  "message": "ok",
  "data": {},
  "path": "/forums/xxx",
  "timestamp": "2026-01-16T00:00:00.000Z"
}
```

### 1.2 失败响应结构

常见失败（参数校验/冲突/不存在/422 等）返回：

```json
{
  "code": 9400,
  "message": "xxx",
  "data": {
    "description": "xxx"
  },
  "path": "/forums/xxx",
  "timestamp": "2026-01-16T00:00:00.000Z"
}
```

### 1.3 前端判定建议

- **成功**：`code === 1000`
- **失败**：其余 code；展示 `message` 或 `data.description`
- 注意：后端会把响应 key 统一转换为 camelCase，前端无需处理 snake_case。

## 二、核心规则（前端必须理解）

### 2.1 资源私有化（关联即私有）

- 一旦某个 **Tag** 被关联到至少一个 Category（直接限制），该 Tag 即为“受限资源”，不会出现在“开放分类”的可选池中。
- 一旦某个 **TagGroup** 被关联到至少一个 Category（组限制），该组内所有 Tag 都视为“受限资源”，同样不会出现在“开放分类”的可选池中。

### 2.2 类别白名单（限制集 vs 公共集）

对于 Category C：

- **限制集**：`allowedTags(C)`（直接限制） ∪ `tags(allowedGroups(C))`（组限制下的成员标签）
- **公共集**：未被任何 Category 直接限制，且不属于任何“被限制组”的成员标签

最终可见集：

- **C 未配置任何限制**（allowedTags 与 allowedGroups 均为空）：仅显示公共集
- **C 配置了限制，且 allowOtherTags=false**：仅显示限制集（严格白名单）
- **C 配置了限制，且 allowOtherTags=true**：显示 `限制集 ∪ 公共集`

### 2.3 发帖/编辑重要行为变更

- 发帖/编辑接口仍使用 `tagNames: string[]` 传参（标签名称数组）。
- 后端已改为 **不再自动创建标签**：
  - tagNames 中只要有任意标签不存在或不可见，将返回失败（通常是 HTTP 422，`code=9400`）。
- 因此前端必须使用“分类可用标签接口”驱动选择器，避免用户输入自由创建。

## 三、发帖/编辑：分类可用标签查询

### 3.1 获取分类可用标签（平铺/分页）

**端点**：`POST /forums/categories/tags`

**请求**：

```json
{
  "categoryId": "175123456789012345",
  "grouped": false,
  "page": 1,
  "limit": 50
}
```

**响应 data（平铺）**：

```json
{
  "items": [
    { "id": "175...", "name": "JavaScript", "usageCount": 0 }
  ],
  "total": 120,
  "page": 1,
  "limit": 50,
  "totalPages": 3
}
```

### 3.2 获取分类可用标签（按标签组返回）

**端点**：`POST /forums/categories/tags`

**请求**：

```json
{
  "categoryId": "175123456789012345",
  "grouped": true,
  "page": 1,
  "limit": 200
}
```

**响应 data（分组）**：

```json
{
  "groups": [
    {
      "id": "175...",
      "name": "编程语言",
      "color": "#3498db",
      "sortOrder": 10,
      "tags": [{ "id": "175...", "name": "TypeScript", "usageCount": 0 }]
    }
  ],
  "ungroupedTags": [{ "id": "175...", "name": "公告", "usageCount": 0 }],
  "pagination": { "page": 1, "limit": 200, "total": 37 }
}
```

### 3.3 前端使用建议（标签选择器）

- 当用户选择/切换分类时：
  - 立即调用 `POST /forums/categories/tags` 获取可选标签（建议 grouped=true）
  - 若当前已选标签不在新分类的可选集合中，应提示并自动移除或阻止提交
- 提交发帖/编辑时：
  - 将用户选择的标签对象映射为 `tagNames: string[]`（取 `tag.name`）
  - 不要提交 tagId（后端仍以 name 为准）

## 四、后台管理：分类可见性配置

### 4.1 更新分类标签可见性（管理员）

**端点**：`POST /forums/categories/update-visibility`

**权限**：`forum:admin:category:*`（需要 Bearer Token）

**请求**：

```json
{
  "id": "175123456789012345",
  "allowOtherTags": true,
  "allowedTags": ["175123456789012346"],
  "allowedGroups": ["175123456789012347"]
}
```

**响应 data**：

```json
{
  "success": true,
  "message": "可见性配置已更新",
  "categoryId": "175123456789012345",
  "allowOtherTags": true,
  "hasRestrictions": true,
  "allowedTags": ["175123456789012346"],
  "allowedGroups": ["175123456789012347"]
}
```

### 4.2 后台 UI 交互建议

- `allowedTags/allowedGroups` 为空时：该分类视为“开放分类”，前台只会看到公共标签（allowOtherTags 会被保存，但对开放分类实际不生效）。
- 建议 UI：当用户选择了任意 allowedTags/allowedGroups 后，再显示/启用 allowOtherTags 开关。

## 五、后台管理：标签组与标签所属组

### 5.1 标签组 CRUD（管理员）

**权限**：`forum:admin:tag:*`

- `POST /forums/tag-groups/list`：分页列表（page/limit）
- `POST /forums/tag-groups/detail`：详情（id）
- `POST /forums/tag-groups/create`：创建（name/color/sortOrder）
- `POST /forums/tag-groups/update`：更新（id + 可选字段）
- `POST /forums/tag-groups/delete`：删除（软删除）

### 5.2 标签创建/更新时同步标签组（管理员）

**权限**：`forum:admin:tag:*`

- `POST /forums/tags/create`
- `POST /forums/tags/update`

新增字段：

```json
{
  "name": "JavaScript",
  "groupIds": ["175123456789012345"]
}
```

说明：

- `groupIds` 传入则后端会覆盖同步标签-组映射（以请求为准）。
- 不传 `groupIds` 则保持原行为，仅创建/更新标签名称。

## 六、错误场景对照（前端处理重点）

### 6.1 创建/编辑话题提交了不可见标签

典型返回（HTTP 422，`code=9400`）：

```json
{
  "code": 9400,
  "message": "标签不可用于该分类: 175123456789012346",
  "data": { "description": "标签不可用于该分类: 175123456789012346" }
}
```

处理建议：

- 弹出提示并刷新当前分类可用标签列表（防止前端缓存过期）
- 自动清理非法已选标签

### 6.2 管理端配置冲突或资源不存在

- 重名（Conflict / 409）：`code=9400`，message 为“标签组已存在/标签已存在”等
- 不存在（404）：`code=9404`，message 为“分类不存在/标签组不存在/标签不存在”等

## 七、推荐接入流程（最短路径）

1. 管理员创建标签组（可选）：`/forums/tag-groups/create`
2. 管理员创建标签并绑定标签组：`/forums/tags/create`（带 groupIds）
3. 管理员配置分类可见性：`/forums/categories/update-visibility`
4. 用户发帖页面：分类选择后调用 `/forums/categories/tags` 渲染标签选择器
5. 发帖提交：提交 `tagNames`（来自选择器的 tag.name）

