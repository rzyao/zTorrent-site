# 动态路由系统接口文档 (Routes API)

## 1. 概览

- **模块名称**: `routes`
- **基础路径**: `/routes` (前台) | `/admin/routes` (后台)
- **描述**: 提供后端驱动的动态路由管控，支持无限层级嵌套、权限自动过滤、菜单可见性控制及路由禁用功能。

---

## 2. 核心概念

### 2.1 路由状态逻辑

系统通过两个核心字段控制路由行为：

| 字段          | 类型    | 说明     | 行为逻辑                                                                                 |
| :------------ | :------ | :------- | :--------------------------------------------------------------------------------------- |
| **isEnabled** | boolean | 启用状态 | `false` 时此路由完全下线，前端不渲染且 URL 访问返回 404。                                |
| **isVisible** | boolean | 菜单显示 | `false` 时该路由在菜单/导航栏中隐藏，但若用户知道 URL **仍可直接访问**（适用于详情页）。 |

### 2.2 权限过滤

- **逻辑**: 每个路由可绑定多个权限点（`permissions`）。
- **关系**: 逻辑 **OR**。用户只要拥有其中任何一个权限，即可看到且访问该路由。
- **默认**: 路由未绑定任何权限时，所有已登录用户均可访问。

---

## 3. 前台接口详情 (Consumer API)

### 3.1 获取用户可用路由配置

- **路径**: `POST /routes/user`
- **描述**: 根据当前登录用户的权限，返回经过过滤后的、树形结构的路由配置。
- **鉴权**: 需要 JWT Token (`ApiBearerAuth`)

#### 请求参数

无（空对象 `{}`）

#### 响应结构 (data)

```json
{
  "code": 1000,
  "message": "ok",
  "data": {
    "routes": [
      {
        "id": "123456789",
        "path": "/home",
        "component": "HomePage",
        "layout": "app",
        "name": "首页",
        "index": true,
        "isVisible": true,
        "permissions": [],
        "children": []
      }
    ]
  }
}
```

---

## 4. 管理后台接口 (Admin API)

> **注意**: 以下接口仅限具有 `super_admin` 权限的角色访问。

### 4.1 获取全量路由树

- **路径**: `POST /admin/routes/tree`
- **描述**: 获取数据库中存储的所有路由配置（包含已禁用和隐藏的节点）。

#### 响应结构 (data)

返回 `RouteTreeNodeDto[]` 数组。

### 4.2 创建路由节点

- **路径**: `POST /admin/routes/create`
- **描述**: 新增一个路由配置节点。

#### 请求参数 (Request Body)

| 字段名      | 类型     | 必填 | 描述         | 校验规则                     |
| :---------- | :------- | :--- | :----------- | :--------------------------- |
| routeKey    | string   | 是   | 唯一标识符   | Max: 100                     |
| path        | string   | 是   | 路由路径     | Max: 255                     |
| component   | string   | 否   | 前端组件名   | 对应 Registry                |
| layout      | enum     | 否   | 布局类型     | `app`/`admin`/`forum`/`none` |
| name        | string   | 否   | 显示名称     | Max: 100                     |
| parentId    | string   | 否   | 父节点 ID    | snowflake ID                 |
| isVisible   | boolean  | 否   | 菜单可见性   | 默认 true                    |
| isEnabled   | boolean  | 否   | 启用状态     | 默认 true                    |
| sortOrder   | number   | 否   | 排序权重     | 默认 0                       |
| permissions | string[] | 否   | 所需权限列表 | -                            |

### 4.3 更新路由节点

- **路径**: `POST /admin/routes/update`
- **描述**: 全量或增量更新指定路由节点的配置。

#### 请求参数 (Request Body)

包含 `id` (必填) 以及上述 `create` 接口中的所有可选字段。

- `parentId` 传入 `null` 可将节点移动至根级。

### 4.4 删除路由节点

- **路径**: `POST /admin/routes/delete`
- **描述**: 删除指定路由节点（递归删除所有子节点）。

#### 请求参数 (Request Body)

| 字段名 | 类型   | 必填 | 描述    |
| :----- | :----- | :--- | :------ |
| id     | string | 是   | 路由 ID |

### 4.5 批量更新权重排序

- **路径**: `POST /admin/routes/sort`
- **描述**: 前端拖拽排序后，批量同步排序权重。

#### 请求参数 (Request Body)

```json
{
  "items": [
    { "id": "id1", "sortOrder": 1 },
    { "id": "id2", "sortOrder": 2 }
  ]
```

}

### 4.6 批量导入路由

- **路径**: `POST /admin/routes/import`
- **描述**: 批量导入树形结构的路由配置（无损更新）。支持递归创建/更新，并在事务中执行。导入后自动清除缓存。

#### 请求参数 (Request Body)

| 字段名 | 类型             | 必填 | 描述             |
| :----- | :--------------- | :--- | :--------------- |
| routes | ImportRouteDto[] | 是   | 树形路由结构列表 |

**ImportRouteDto 结构**:
包含 `create` 接口的所有字段（除 `parentId` 外，由嵌套结构自动推断），以及 `children` 数组。

```json
{
  "routes": [
    {
      "routeKey": "home",
      "path": "/home",
      "component": "HomePage",
      "children": [
        {
          "routeKey": "dashboard",
          "path": "dashboard",
          "component": "DashboardPage"
        }
      ]
    }
  ]
}
```

---

## 5. 前端集成建议

1.  **缓存失效**: 后端在管理端修改路由后会立即清除 Redis 缓存。建议前端在检测到 403 权限变更或管理员通知刷新时，重新调用 `/routes/user` 接口。
2.  **组件加载**: 请求返回的 `component` 字符串应直接映射到前端的路由懒加载映射表。
3.  **404 处理**: 对于 `isEnabled: false` 的路由，后端过滤后前端将不会注册该路由，从而触发浏览器的默认 404 处理。
