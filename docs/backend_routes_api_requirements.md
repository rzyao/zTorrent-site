# 动态路由系统后端 API 需求文档

## 1. 概述

为前端动态路由系统提供 API 支持，实现路由配置的后端管控与权限联动。

---

## 2. API 接口规范

### 2.1 获取用户路由配置

```
POST /routes/user
Authorization: Bearer <JWT>
```

**请求体**：无（或空对象 `{}`）

**响应体**：

```json
{
  "code": 0,
  "message": "success",
  "data": {
    "routes": [
      {
        "id": "app-layout",
        "path": "/",
        "component": "",
        "layout": "app",
        "children": [
          {
            "id": "home",
            "path": "/home",
            "component": "HomePage",
            "name": "首页"
          },
          {
            "id": "upload",
            "path": "/upload",
            "component": "UploadTorrentPage",
            "name": "上传",
            "permissions": ["upload"]
          }
        ]
      }
    ]
  }
}
```

**核心逻辑**：

1. 解析 JWT 获取用户权限列表
2. 遍历完整路由配置树
3. 过滤掉用户无权访问的路由节点
4. 返回过滤后的路由树

---

## 3. 数据结构

### 3.1 RouteConfig 实体

| 字段        | 类型          | 必填 | 说明                                   |
| ----------- | ------------- | ---- | -------------------------------------- |
| id          | string        | ✅   | 路由唯一标识                           |
| path        | string        | ✅   | 路由路径                               |
| component   | string        | ❌   | 前端组件标识符                         |
| layout      | enum          | ❌   | 布局类型：`app`/`admin`/`forum`/`none` |
| name        | string        | ❌   | 路由名称（用于面包屑）                 |
| permissions | string[]      | ❌   | 所需权限列表（OR 关系）                |
| children    | RouteConfig[] | ❌   | 子路由                                 |
| index       | boolean       | ❌   | 是否为索引路由                         |
| redirect    | string        | ❌   | 重定向目标                             |
| sortOrder   | number        | ❌   | 排序权重                               |
| isVisible   | boolean       | ❌   | 是否可见                               |

---

## 4. 数据库设计

### 4.1 routes 表

```sql
CREATE TABLE routes (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  route_key VARCHAR(100) NOT NULL UNIQUE,
  path VARCHAR(255) NOT NULL,
  component VARCHAR(100),
  layout VARCHAR(20) DEFAULT 'app',
  name VARCHAR(100),
  parent_id BIGINT,
  sort_order INT DEFAULT 0,
  is_visible BOOLEAN DEFAULT true,
  is_index BOOLEAN DEFAULT false,
  redirect VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (parent_id) REFERENCES routes(id) ON DELETE CASCADE
);
```

### 4.2 route_permissions 表（多对多关联）

```sql
CREATE TABLE route_permissions (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  route_id BIGINT NOT NULL,
  permission_key VARCHAR(100) NOT NULL,
  FOREIGN KEY (route_id) REFERENCES routes(id) ON DELETE CASCADE,
  UNIQUE KEY (route_id, permission_key)
);
```

---

## 5. 权限过滤逻辑

```pseudocode
function filterRoutes(routes, userPermissions):
  result = []
  for route in routes:
    // 检查权限
    if route.permissions is not empty:
      hasPermission = any(p in userPermissions for p in route.permissions)
      if not hasPermission:
        continue

    // 递归过滤子路由
    filteredChildren = filterRoutes(route.children, userPermissions)

    // 如果是布局路由且无可见子路由，跳过
    if route.component is empty and filteredChildren is empty:
      continue

    result.append({
      ...route,
      children: filteredChildren
    })

  return result
```

---

## 6. 前端组件对照表

后端需返回的 `component` 值必须与前端 `componentRegistry.ts` 中的 key 对应：

| component 值      | 对应页面                      |
| ----------------- | ----------------------------- |
| HomePage          | 首页                          |
| TorrentsPage      | 种子列表                      |
| MoviesPage        | 电影列表                      |
| SeriesPage        | 剧集列表                      |
| UploadTorrentPage | 上传                          |
| ReportsPage       | 举报管理                      |
| ReviewPage        | 审核                          |
| TicketsPage       | 工单                          |
| ForumHomePage     | 论坛首页                      |
| TopicDetail       | 话题详情                      |
| ...               | （参见 componentRegistry.ts） |

---

## 7. 初始数据

建议将 `staticRouteConfig.ts` 中的配置导入数据库作为初始数据：

```bash
# 前端项目中已有静态配置
src/routes/staticRouteConfig.ts
```

---

## 8. 注意事项

> [!IMPORTANT]
>
> 1. **缓存策略**：路由配置变更频率低，建议使用 Redis 缓存，TTL 5-10 分钟
> 2. **权限同步**：路由权限应与 `permissions` 表保持一致
> 3. **向后兼容**：新增字段需提供默认值，避免前端解析失败
