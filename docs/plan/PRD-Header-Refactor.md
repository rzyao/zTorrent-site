# zTorrent Site 导航栏 (Header) 重构与动态配置 PRD

## 1. 项目背景与目标 (Project Background & Objectives)

### 1.1 背景

当前 `Header.tsx` 组件代码量已超过 900 行，承担了过多的职责（UI 渲染、权限判断、路由导航、状态管理），导致维护困难。同时，导航菜单项目前采用了硬编码方式，缺乏灵活性，无法满足不同用户组差异化展示及运营活动动态调整的需求。

### 1.2 目标

1.  **架构解耦**：将 Header 组件彻底重构为“配置驱动”模式，分离数据与视图。
2.  **动态可配**：支持通过后端 API 动态下发导航配置，实现运行时可配置。
3.  **多端独立**：支持桌面端与移动端完全独立的导航菜单配置。
4.  **精细化权限**：支持基于用户组（Role-based）的菜单可见性控制。
5.  **极致体验**：优化加载体验，采用骨架屏渐进式渲染策略。

## 2. 核心用户角色 (User Roles)

| 角色         | 核心诉求                                                                            |
| :----------- | :---------------------------------------------------------------------------------- |
| **站点用户** | 快速找到所需功能入口；在权限加载过程中获得平滑的视觉体验。                          |
| **管理员**   | 在后台灵活配置导航菜单的显示/隐藏、排序、名称及可见用户组；区分桌面端与移动端配置。 |
| **开发者**   | 清晰的代码结构，便捷的扩展组件能力。                                                |

## 3. 功能需求说明 (Functional Requirements)

### 3.1 前端组件重构 (Frontend Refactoring)

#### 3.1.1 架构设计

- **Header 主组件**：回归纯粹的容器组件，负责布局结构（Logo、Nav、UserPanel）。
- **配置驱动**：UI 渲染完全依赖于 `useNavigation()` Hook 获取的数据，不再硬编码。
- **组件拆分**：
  - `DesktopNav`: 桌面端导航渲染器。
  - `MobileNav`: 移动端侧边栏导航渲染器。
  - `UseMenu`: 用户下拉菜单组件。
  - `NavDropdown`: 通用下拉菜单逻辑封装（取代重复的 `onMouseEnter` 逻辑）。

#### 3.1.2 加载体验策略

采用 **Type B: 渐进显示** 策略：

1.  **公开导航项（如首页、电影）**：若本地缓存存在默认配置，优先立即渲染，保证首屏内容。
2.  **权限导航项（如审核、管理）**：在 API 响应返回前，显示 **骨架屏 (Skeleton)** 占位。
3.  **最终状态**：API 数据返回后，根据权限过滤并更新导航列表，移除骨架屏。

### 3.2 后端 API 支持 (Backend API Support)

需要新增 `Navigation` 模块，提供以下能力。

#### 3.2.1 获取导航配置

- **接口**：`GET /api/navigation`
- **逻辑**：根据当前登录用户的角色，返回已过滤的导航菜单列表。
- **响应结构**：区分 `desktop` 和 `mobile` 两个独立数组。

#### 3.2.2 管理端配置接口

- `GET /api/admin/navigation`: 获取所有（包含禁用/无权限）导航项配置。
- `PUT /api/admin/navigation/batch`: 批量更新导航项（排序、显示状态）。
- `POST /api/admin/navigation`: 新增导航项（预留）。
- `DELETE /api/admin/navigation/:id`: 删除导航项。

### 3.3 管理后台配置 (Admin Dashboard)

#### 3.3.1 配置界面设计

管理后台新增「站点设置 -> 导航管理」页面。

- **多端切换**：顶部 Tab 切换「桌面端菜单」与「移动端菜单」。
- **列表管理**：需支持 **拖拽排序**。
- **配置项**：
  - **显示名称** (Label)：支持修改菜单展示文字。
  - **跳转路径** (Path)：内部路由或外部链接。
  - **可见性开关** (Visible)：全局显示/隐藏控制。
  - **用户组权限** (Roles)：多选框，勾选可见的用户组（如 `VIP`, `Admin`, `User`）。
  - **图标设置** (Icon)：(可选) 选择菜单图标。
  - **打开方式**：当前窗口 / 新窗口。

## 4. 数据模型设计 (Database Schema)

### 4.1 表结构：`navigation_items`

| 字段名           | 类型       | 描述                     | 示例                     |
| :--------------- | :--------- | :----------------------- | :----------------------- |
| `id`             | UUID       | 主键                     | `nav_01`                 |
| `platform`       | ENUM       | 平台类型                 | `'desktop'`, `'mobile'`  |
| `parent_id`      | UUID       | 父菜单ID（支持二级菜单） | `null` 或 `nav_05`       |
| `label`          | STRING     | 显示名称                 | `'种子'`                 |
| `path`           | STRING     | 路由路径                 | `'/torrents'`            |
| `icon`           | STRING     | 图标标识符               | `'Disc'`                 |
| `sort_order`     | INT        | 排序权重                 | `10`                     |
| `is_visible`     | BOOLEAN    | 是否启用                 | `true`                   |
| `target`         | STRING     | 链接打开方式             | `'_self'`, `'_blank'`    |
| `required_roles` | JSON/ARRAY | 可见用户组列表           | `['admin', 'moderator']` |
| `created_at`     | TIMESTAMP  | 创建时间                 |                          |
| `updated_at`     | TIMESTAMP  | 更新时间                 |                          |

## 5. API 接口定义 (API Definition)

### 5.1 获取用户导航

**Request:**
`GET /api/navigation`

**Headers:**
`Authorization: Bearer <token>`

**Response:**

```json
{
  "desktop": [
    {
      "id": "1",
      "label": "首页",
      "path": "/home",
      "children": [],
      "isExternal": false
    },
    {
      "id": "5",
      "label": "发布",
      "path": "/upload",
      "children": [],
      "isExternal": false
    }
  ],
  "mobile": [
    {
      "id": "1",
      "label": "首页",
      "path": "/home"
    }
  ]
}
```

_注：后端应根据请求用户的 `roles` 自动过滤掉无权访问的条目。_

### 5.2 (管理端) 批量更新配置

**Request:**
`PUT /api/admin/navigation/batch`

**Body:**

```json
{
  "platform": "desktop",
  "items": [
    {
      "id": "1",
      "sortOrder": 0,
      "isVisible": true,
      "requiredRoles": ["user", "admin"]
    },
    {
      "id": "5",
      "sortOrder": 1,
      "isVisible": true,
      "requiredRoles": ["admin"]
    }
  ]
}
```

## 6. 开发实施计划 (Implementation Plan)

1.  **Phase 1: 后端开发**
    - 创建 `Navigation` 模块与数据库迁移。
    - 实现基础 CRUD 与权限过滤逻辑。
    - 输出 Swagger/OpenAPI 文档。
2.  **Phase 2: 前端重构 (Header)**
    - 抽离 `Header` UI 组件。
    - 接入 API，实现 `useNavigation` Hook。
    - 实现骨架屏与渐进式加载逻辑。
3.  **Phase 3: 前端开发 (管理后台)**
    - 开发拖拽配置页面。
    - 对接批量更新接口。
