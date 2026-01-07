# 路由启用状态控制功能

## 功能说明

为动态路由系统添加了 `isEnabled` 字段,用于控制路由是否被加载到路由表中。这与 `isVisible` 字段分离,实现了更精细的路由控制。

## 字段对比

| 字段        | 作用                         | 位置     | 默认值 |
| ----------- | ---------------------------- | -------- | ------ |
| `isEnabled` | 控制路由是否加载到路由表     | 基础配置 | `true` |
| `isVisible` | 控制路由是否在侧边栏菜单显示 | 访问控制 | `true` |

## 使用场景

### `isEnabled = false` (禁用路由)

- ✅ 路由不会被注册到路由表
- ✅ 用户无法通过任何方式访问该路由
- ✅ 适用于:
  - 临时下线的功能
  - 开发中的功能(未完成)
  - 需要完全禁用的路由

### `isVisible = false` (隐藏菜单)

- ✅ 路由正常加载,可以访问
- ✅ 只是不在侧边栏菜单中显示
- ✅ 适用于:
  - 详情页、编辑页等子页面
  - 通过其他入口访问的页面
  - 不需要在菜单中显示的功能页

### 组合使用

| isEnabled | isVisible | 效果                       |
| --------- | --------- | -------------------------- |
| `true`    | `true`    | ✅ 路由可访问,菜单显示     |
| `true`    | `false`   | ✅ 路由可访问,菜单隐藏     |
| `false`   | `true`    | ❌ 路由不可访问,菜单不显示 |
| `false`   | `false`   | ❌ 路由不可访问,菜单不显示 |

## 实现细节

### 1. 类型定义 (`src/types/routeConfig.ts`)

```typescript
export interface RouteConfig {
  // ... 其他字段
  /** 是否在菜单中可见 */
  isVisible?: boolean;
  /** 是否启用(加载到路由表) */
  isEnabled?: boolean;
}
```

### 2. 路由过滤逻辑 (`src/routes/DynamicRoutes.tsx`)

在 `renderRoute` 和 `renderLayoutRoutes` 函数中添加过滤:

```tsx
function renderRoute(config: RouteConfig, parentPath: string = ""): React.ReactNode {
  const { isEnabled } = config;

  // 如果路由未启用,不渲染
  if (isEnabled === false) {
    return null;
  }

  // ... 其他逻辑

  if (children && children.length > 0) {
    // 过滤掉未启用的子路由
    const enabledChildren = children.filter((child) => child.isEnabled !== false);
    return (
      <Route key={id} path={path} element={element}>
        {enabledChildren.map((child) => renderRoute(child, fullPath))}
      </Route>
    );
  }
}
```

### 3. DTO 映射 (`src/hooks/useRouteConfig.ts`)

```typescript
function mapDtoToConfig(dto: RouteTreeNodeDto): RouteConfig {
  return {
    // ... 其他字段
    isVisible: dto.isVisible,
    isEnabled: (dto as any).isEnabled !== false, // 默认为 true
    children: dto.children?.map(mapDtoToConfig),
  };
}
```

**默认值说明**:

- `isEnabled !== false` 意味着:
  - 如果后端返回 `isEnabled: true` → `true`
  - 如果后端返回 `isEnabled: false` → `false`
  - 如果后端未返回该字段 → `true` (默认启用)

### 4. 管理界面 (`DetailsPanel.tsx`)

在"基础配置"区域添加开关:

```tsx
<Form.Item
  label="是否启用"
  name="isEnabled"
  valuePropName="checked"
  tooltip="控制路由是否加载到路由表,禁用后该路由将无法访问"
>
  <Switch checkedChildren="启用" unCheckedChildren="禁用" />
</Form.Item>
```

## 使用方法

### 在路由管理页面配置

1. 访问 `/admin/routes` 进入路由管理页面
2. 选择需要配置的路由节点
3. 在右侧详情面板的"基础配置"区域:
   - 切换"是否启用"开关
4. 在"访问控制"区域:
   - 切换"侧边栏是否显示"开关
5. 点击"保存变更"

### 后端数据结构

后端需要在路由表中添加 `isEnabled` 字段(布尔类型):

```json
{
  "id": "feature-in-development",
  "path": "/new-feature",
  "component": "NewFeaturePage",
  "isEnabled": false,
  "isVisible": true
}
```

## 典型场景示例

### 场景 1: 临时下线功能

```json
{
  "id": "maintenance-feature",
  "path": "/feature",
  "component": "FeaturePage",
  "isEnabled": false, // 禁用路由,用户无法访问
  "isVisible": false // 隐藏菜单
}
```

### 场景 2: 详情页(不在菜单显示)

```json
{
  "id": "user-detail",
  "path": "/users/:id",
  "component": "UserDetailPage",
  "isEnabled": true, // 路由可访问
  "isVisible": false // 不在菜单显示
}
```

### 场景 3: 正常功能页

```json
{
  "id": "users-list",
  "path": "/users",
  "component": "UsersListPage",
  "isEnabled": true, // 路由可访问
  "isVisible": true // 在菜单显示
}
```

## 性能优化

### 过滤时机

路由过滤在**渲染时**进行,而不是在数据获取时:

- ✅ **优点**: 保持数据完整性,便于调试和管理
- ✅ **优点**: 可以在管理界面看到所有路由(包括禁用的)
- ⚠️ **注意**: 禁用的路由不会被渲染,不会影响性能

### 子路由过滤

当父路由被禁用时,其所有子路由也会被过滤:

```tsx
// 父路由 isEnabled: false
{
  id: "parent",
  isEnabled: false,
  children: [
    { id: "child1", isEnabled: true },  // 不会被渲染
    { id: "child2", isEnabled: true },  // 不会被渲染
  ]
}
```

## 注意事项

1. **默认启用**: 如果后端未返回 `isEnabled` 字段,默认为 `true`(启用)
2. **级联效果**: 禁用父路由会导致所有子路由不可访问
3. **菜单同步**: 禁用路由后,即使 `isVisible: true`,菜单也不会显示
4. **权限独立**: `isEnabled` 与 `permissions` 独立,两者都需要满足才能访问

## 后续优化建议

### 1. 添加禁用原因字段

```typescript
interface RouteConfig {
  isEnabled?: boolean;
  disabledReason?: string; // 禁用原因
}
```

### 2. 添加定时启用/禁用

```typescript
interface RouteConfig {
  isEnabled?: boolean;
  enabledFrom?: string; // 启用开始时间
  enabledUntil?: string; // 启用结束时间
}
```

### 3. 在路由树中显示禁用状态

在 `RouteTree.tsx` 中为禁用的路由添加视觉标识:

```tsx
const titleRender = (node: RouteTreeDataNode) => {
  const isDisabled = node.routeData.isEnabled === false;
  if (isDisabled) {
    return <span style={{ color: "#ff4d4f" }}>{node.title} (已禁用)</span>;
  }
  // ...
};
```

## 相关文件

- `src/types/routeConfig.ts` - 类型定义
- `src/hooks/useRouteConfig.ts` - DTO 映射
- `src/routes/DynamicRoutes.tsx` - 路由过滤逻辑
- `src/modules/admin/pages/RouteManage/components/DetailsPanel.tsx` - 管理界面
