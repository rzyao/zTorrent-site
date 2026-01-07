# 动态路由模块前端对接文档

此文档描述了动态路由模块的 API 接口及数据结构，用于前端实现动态路由加载、菜单渲染和权限控制。

## 1. 核心概念

- **多分支结构**: 路由分为 `app` (主站)、`admin` (管理后台)、`forum` (论坛) 三个顶级分支。
- **权限过滤**: 接口会根据当前登录用户的权限自动过滤掉无权访问的节点（Admin 用户除外）。
- **组件映射**: `component` 字段返回的是组件库中的 Key（如 `HomePage`），前端需建立映射表。
- **缓存机制**: 用户路由树在 Redis 中缓存 10 分钟，后台修改后会自动清理。

---

## 2. 接口说明

### 2.1 用户路由接口 (前台/用户端)

用于前端初始化时获取当前用户可访问的路由树。

- **URL**: `POST /routes/user`
- **认证**: 必须携带 Bearer Token
- **描述**: 根据用户权限返回过滤后的路由树。管理员 (`username === 'admin'`) 可见所有启用路由。

**响应示例数据结构 (`UserRoutesResponseDto`):**

```json
{
  "code": 1000,
  "message": "ok",
  "data": {
    "routes": [
      {
        "id": "795987674820382720",
        "path": "/",
        "component": null,
        "layout": "app",
        "name": "App Layout",
        "index": false,
        "redirect": "/home",
        "sortOrder": 0,
        "isVisible": true,
        "permissions": [],
        "children": [
          {
            "id": "795987674879102976",
            "path": "/home",
            "component": "HomePage",
            "layout": "app",
            "name": "首页",
            "isVisible": true,
            "permissions": []
          }
        ]
      }
    ]
  }
}
```

---

### 2.2 路由管理接口 (后台)

**所有接口前缀**: `/admin/routes`
**权限要求**: `super_admin`

| 接口名         | 方法   | 路径                | 说明                                 |
| :------------- | :----- | :------------------ | :----------------------------------- |
| 获取完整路由树 | `POST` | `/tree`             | 返回全量路由数据（不考虑权限）       |
| 创建路由节点   | `POST` | `/create`           | 创建新的路由节点                     |
| 更新路由节点   | `POST` | `/update`           | 更新路由（ID 必填，其他选填）        |
| 删除路由节点   | `POST` | `/delete`           | 删除路由（递归删除子节点，谨慎使用） |
| 批量排序       | `POST` | `/sort`             | 更新同级路由的排序权重               |
| 绑定权限       | `POST` | `/bind-permissions` | 为路由节点分配权限点                 |

---

## 3. 数据模型说明

### RouteTreeNodeDto (基础节点)

| 字段名      | 类型     | 必填 | 说明                                               |
| :---------- | :------- | :--- | :------------------------------------------------- |
| id          | string   | 是   | 数据库唯一 ID                                      |
| path        | string   | 是   | 路由路径（如 `/home`, `latest`），不同分支允许重复 |
| routeKey    | string   | 否   | 全局唯一标识符（代码内引用用）                     |
| component   | string   | 否   | 前端组件名称（如 `MoviesPage`）                    |
| layout      | string   | 否   | `app` \| `admin` \| `forum` \| `none`              |
| name        | string   | 否   | 显示名称（菜单/面包屑）                            |
| index       | boolean  | 否   | 是否为索引/默认路由                                |
| redirect    | string   | 否   | 重定向目标路径                                     |
| sortOrder   | number   | 否   | 排序权重（升序）                                   |
| isVisible   | boolean  | 否   | 是否在菜单渲染（false 则保留路径但隐藏入口）       |
| permissions | string[] | 否   | 访问所需权限点列表                                 |
| children    | Array    | 否   | 嵌套的子路由节点                                   |

---

## 4. 前端使用建议

1. **路由构建**:

   - 建议在全局路由守卫中调用 `POST /routes/user`。
   - 使用递归函数将扁平的 `routes` 转换为 Vue Router 或 React Router 的路由配置。
   - `component` 字段应与本地的组件映射表匹配：
     ```javascript
     const componentMap = {
       HomePage: () => import("@/pages/Home.vue"),
       MoviesPage: () => import("@/pages/Movies.vue"),
     };
     ```

2. **菜单渲染**:

   - 仅渲染 `isVisible === true` 的节点。
   - 多级菜单使用 `children` 字段。

3. **路由占位**:
   - 若 `component` 为空且有 `children`，该节点通常作为布局组件或目录。

---

## 5. 开发调试工具

- **手动清理缓存**: `POST /routes/clear-cache` (公开接口)
- **初始化导入**: `POST /routes/import` (公开接口，传全量 JSON 覆盖)
