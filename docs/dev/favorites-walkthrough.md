# Favorites Module Walkthrough

## 1. 变更摘要 (Changes Summary)

本次更新实现了通用的收藏功能，支持多种资源类型（种子、电影、剧集等）。

### 新增文件 (New Files)

- `src/hooks/useFavorite.ts`: 核心 Hook，封装收藏状态管理与交互逻辑。
- `src/components/common/FavoriteButton.tsx`: 通用收藏按钮组件。
- `src/pages/Favorites/index.tsx`: “我的收藏”列表页面。

### 修改文件 (Modified Files)

- `src/routes/AppRoutes.tsx`: 注册 `/favorites` 路由。
- `src/pages/MovieDetail/components/Hero.tsx`: 替换收藏按钮。
- `src/pages/MovieDetail/index.tsx`: 移除旧的收藏状态逻辑。
- `src/pages/SeriesDetail/components/InfoBar.tsx`: 替换收藏按钮。
- `src/pages/SeriesDetail/index.tsx`: 移除旧的收藏状态逻辑。
- `src/pages/TorrentDetail/index.tsx`: 替换收藏按钮。
- `src/api/services/Service.ts`: (自动生成) 包含收藏相关的 API 方法。

## 2. 功能验证 (Verification)

### 2.1 收藏按钮 (Favorite Button)

- **位置**:
  - 电影详情页 (Hero 区域)
  - 剧集详情页 (InfoBar 区域)
  - 种子详情页 (功能按钮组)
- **行为**:
  - 点击按钮，图标状态应立即切换 (Heart 实心/空心)。
  - 应弹出 Toast 提示 ("已收藏" / "已取消收藏")。
  - 状态应在不同页面间同步 (例如在详情页收藏，返回列表页再进入详情页，状态应保持)。

### 2.2 收藏列表页 (Favorites Page)

- **路径**: `/favorites` (或通过导航栏进入 - 需手动添加导航入口，目前可通过 URL 访问)。
- **功能**:
  - **Tabs**: 切换 全部 / 种子 / 电影 / 剧集 / 歌单。
  - **列表**: 显示已收藏的项目。
  - **卡片**: 点击图片跳转到详情页；点击卡片右上角的按钮可取消收藏。

## 3. 注意事项 (Notes)

- **API 生成**: 由于后端 OpenAPI Spec 缺少 Tag，Favorites 相关的 API 方法被生成在 `Service` 类中 (e.g. `Service.favoritesControllerAdd`)，而非独立的 `FavoritesService`。目前代码已适配此情况。
- **导航栏**: 目前尚未在 Header/Sidebar 添加 "我的收藏" 入口，建议后续添加。

## 4. 下一步建议 (Next Steps)

- 在全局导航栏 (Navbar) 或用户下拉菜单中添加 `/favorites` 链接。
- 完善 `FavoritesPage` 的 UI 细节 (如加载更多、空状态插画)。
