# 网站偏好（PreferencesTab）后端接口文档

> 适用前端组件：`src/pages/control/components/tabs/PreferencesTab.tsx`
>
> 关联状态：`src/pages/control/hooks/useControlState.ts`

## 概述
- 提供用户网站偏好的读写接口，以及分类/影片类型选项的获取接口。
- 偏好包含：语言、主题、默认视图、成人模式、默认展示的种子分类与影片类型。
- 所有接口采用统一响应包装与鉴权策略，便于前后端一致集成与扩展。

## 鉴权与统一响应
- 鉴权：`Authorization: Bearer {token}`（后端从令牌解析当前用户）
- 统一响应包装：
```json
{
  "code": 200,
  "message": "OK",
  "data": {},
  "path": "/api/path",
  "timestamp": "2025-12-05T10:00:00Z"
}
```
- 常见错误码：`400` 参数错误、`401` 未认证、`403` 禁止访问、`404` 资源不存在、`500` 服务器错误。

## 数据模型
```ts
// 完整用户偏好（响应/存储）
export interface UserPreferencesDto {
  /** 语言：与UI枚举一致（PreferencesTab.tsx:71-75） */
  language: 'zh-CN' | 'zh-TW' | 'en-US' | 'ja-JP';
  /** 主题：与UI枚举一致（PreferencesTab.tsx:91-94） */
  theme: 'dark' | 'light' | 'auto';
  /** 默认视图：与UI枚举一致（PreferencesTab.tsx:108-110） */
  defaultView: 'grid' | 'list';
  /** 显示成人模式：保存后生效，用于后端内容过滤（PreferencesTab.tsx:54） */
  showAdult: boolean;
  /** 默认展示的种子分类：必须为分类选项的key集合子集 */
  defaultTorrentCategories: string[];
  /** 默认展示的影片类型：必须为影片类型选项集合子集 */
  defaultFilmGenres: string[];
}

// 增量更新请求体（未传字段保持不变）
export interface UpdateUserPreferencesDto {
  language?: UserPreferencesDto['language'];
  theme?: UserPreferencesDto['theme'];
  defaultView?: UserPreferencesDto['defaultView'];
  showAdult?: boolean;
  defaultTorrentCategories?: string[];
  defaultFilmGenres?: string[];
}
```

- 集合长度建议：`defaultTorrentCategories` 最大 50 项；`defaultFilmGenres` 最大 100 项。
- 合法值约束：
  - `language`：`'zh-CN'|'zh-TW'|'en-US'|'ja-JP'`
  - `theme`：`'dark'|'light'|'auto'`
  - `defaultView`：`'grid'|'list'`
  - `defaultTorrentCategories`：必须来自`/categories/user/list-categories`的`key`集合（推荐仅接受`enabled=true`）
  - `defaultFilmGenres`：必须来自`/films/list-genres`的`genres`集合

## 端点定义
### 1) 获取偏好
- `POST /users/preferences/get`
- 描述：获取当前登录用户的完整网站偏好。
- Headers：`Authorization: Bearer {token}`
- Body：`{}`（空对象）
- 200 响应：`data: UserPreferencesDto`
- 示例：
```json
{
  "code": 200,
  "message": "OK",
  "data": {
    "language": "zh-CN",
    "theme": "dark",
    "defaultView": "grid",
    "showAdult": false,
    "defaultTorrentCategories": ["电影", "剧集"],
    "defaultFilmGenres": ["科幻", "剧情", "动作"]
  },
  "path": "/users/preferences/get",
  "timestamp": "2025-12-05T10:00:00Z"
}
```

### 2) 保存偏好（增量）
- `POST /users/preferences/save`
- 描述：增量更新当前用户偏好；未包含的字段保持不变。
- Headers：`Authorization: Bearer {token}`
- Body：`UpdateUserPreferencesDto`
- 校验：枚举合法、集合元素在可选集内、长度不超限；非法返回`400`并列出错误字段。
- 200 响应：`data: UserPreferencesDto`（返回更新后的完整偏好）
- 请求示例：
```json
{
  "showAdult": true,
  "defaultTorrentCategories": ["电影", "音乐"],
  "defaultFilmGenres": ["科幻", "犯罪"],
  "theme": "auto",
  "language": "zh-TW",
  "defaultView": "list"
}
```
- 响应示例：
```json
{
  "code": 200,
  "message": "OK",
  "data": {
    "language": "zh-TW",
    "theme": "auto",
    "defaultView": "list",
    "showAdult": true,
    "defaultTorrentCategories": ["电影", "音乐"],
    "defaultFilmGenres": ["科幻", "犯罪"]
  },
  "path": "/users/preferences/save",
  "timestamp": "2025-12-05T10:00:02Z"
}
```

### 3) 获取分类选项
- `POST /categories/user/list-categories`
- 描述：列出当前用户可展示的分类选项，用于“种子分类默认展示（多选）”。
- Headers：`Authorization: Bearer {token}`
- Body：`{}`
- 200 响应：`data: CategoryDto[]`（关键字段：`key`、`label`；含`enabled`、`isDefault`、`sort`等）
- 示例：
```json
{
  "code": 200,
  "message": "OK",
  "data": [
    { "id": "c1", "key": "电影", "label": "电影", "enabled": true, "isDefault": true, "sort": 1 },
    { "id": "c2", "key": "剧集", "label": "剧集", "enabled": true, "isDefault": false, "sort": 2 }
  ],
  "path": "/categories/user/list-categories",
  "timestamp": "2025-12-05T10:00:00Z"
}
```

### 4) 获取影片类型选项
- `POST /films/list-genres`
- 描述：获取影片类型列表（genres），用于“影片分类默认展示（多选）”。
- Headers：`Authorization: Bearer {token}`
- Body：`{}`
- 200 响应：`data: { genres: string[] }`
- 示例：
```json
{
  "code": 200,
  "message": "OK",
  "data": { "genres": ["科幻", "剧情", "动作", "犯罪", "冒险", "动画", "奇幻", "悬疑", "惊悚", "历史", "战争"] },
  "path": "/films/list-genres",
  "timestamp": "2025-12-05T10:00:00Z"
}
```

## 错误体示例
```json
{
  "code": 400,
  "message": "参数错误: defaultFilmGenres 包含未定义类型",
  "path": "/users/preferences/save",
  "timestamp": "2025-12-05T10:00:00Z"
}
```
- 典型场景：枚举非法、集合元素不在可选集内、长度超限（400）；令牌缺失或失效（401）；用户被封禁（403）；用户不存在（404）；未处理的服务器错误（500）。

## 前端对接说明
- 组件与枚举来源：
  - 语言枚举：`src/pages/control/components/tabs/PreferencesTab.tsx:71-75`
  - 主题枚举：`src/pages/control/components/tabs/PreferencesTab.tsx:91-94`
  - 默认视图枚举：`src/pages/control/components/tabs/PreferencesTab.tsx:108-110`
- 初始化：将`localStorage`读取替换为调用`POST /users/preferences/get`（参考 `src/pages/control/hooks/useControlState.ts` 初始化流程）。
- 保存：将`savePreferences({...})`替换为`POST /users/preferences/save`，请求体包含当前UI状态 `adultMode`、`selectedTorrentCategories`、`selectedFilmGenres` 及 `preferences.language/theme/defaultView`。
- 选项获取：沿用当前分类与类型选项接口；保存前在前端进行预校验以提升反馈速度：
```ts
selectedTorrentCategories.every(k => torrentCategoryOptions.some(c => c.key === k));
selectedFilmGenres.every(g => filmGenreOptions.includes(g));
```

## 设计与原因说明
- 与UI枚举严格对齐，避免前后端不一致导致不可选值。
- 增量保存契合组件“局部更新”交互，返回完整偏好便于一次性同步状态。
- 统一响应与鉴权复用现有服务风格，降低接入成本并提升一致性。
- 将成人模式作为服务端过滤开关（保存后生效），确保跨设备一致与服务端策略统一。

## 版本与扩展
- 版本：v1.0（2025-12-05）
- 未来扩展：可在`save`内部同步至其他相关服务（如分类偏好子系统），保持接口对前端无破坏性。

