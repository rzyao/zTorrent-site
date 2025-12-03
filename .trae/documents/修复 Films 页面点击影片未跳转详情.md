## 问题定位
- Films 列表项点击后仅调用 `FilmsService.filmsControllerViewMovie` 增加浏览次数，并未进行路由跳转（`src/pages/FilmsPage.tsx:111-120`）。
- 路由表中未注册 `FilmDetailPage` 的详情路由，仅存在 `/films` 列表页与 `/torrent-detail/:id`（`src/routes/AppRoutes.tsx`）。

## 改动目标
- 在路由表中新增影片详情路由 `/films/:id`，渲染 `FilmDetailPage`。
- 在 Films 列表页点击卡片时，跳转到对应详情页 `/films/:id`。

## 修改文件
- `src/routes/AppRoutes.tsx`
- `src/pages/FilmsPage.tsx`

## 具体实现
1. 路由注册 `FilmDetailPage`
   - 导入默认导出：`import FilmDetailPage from '../pages/FilmDetailPage'`。
   - 新增受保护详情路由：
     ```tsx
     <Route
       path="/films/:id"
       element={
         <AuthRoute>
           <AppLayout>
             <FilmDetailRoute />
           </AppLayout>
         </AuthRoute>
       }
     />
     ```
   - 在同文件底部新增包装组件 `FilmDetailRoute`（仿照现有 `PlaylistDetailPageWrapper`）：
     ```tsx
     function FilmDetailRoute() {
       const { id } = useParams();
       if (!id) return <Navigate to="/films" replace />;
       return <FilmDetailPage torrentId={Number(id)} />;
     }
     ```
   - 作用：从路径参数获取 `id`，并以 `torrentId` 传入详情页组件。

2. Films 列表页点击跳转
   - 在 `src/pages/FilmsPage.tsx` 引入并实例化导航：
     ```tsx
     import { useNavigate } from 'react-router-dom';
     const navigate = useNavigate();
     ```
   - 更新 `handleMovieClick`：在调用浏览数 API 后执行跳转：
     ```tsx
     await FilmsService.filmsControllerViewMovie({ id: movie.id });
     navigate(`/films/${movie.id}`);
     ```
   - 保持收藏按钮的 `e.stopPropagation()`，避免干扰卡片点击跳转。

## 验证步骤
- 启动本地开发环境并登录。
- 访问 `/films`，点击任一影片卡片。
- 预期跳转到 `/films/:id`，显示 `FilmDetailPage` 内容（背景、海报、评分等），并由 `TorrentsService` 根据 `torrentId` 拉取详情数据。

## 兼容性与影响
- 新增路由不影响既有 `/torrent-detail/:id` 路由。
- `FilmDetailPage` 的默认导出名为组件本身（文件名与函数名不一致但不影响默认导入）。
- 若后端 `id` 非数字字符串，`Number(id)` 可能得到 `NaN`，届时可改为字符串传递并在详情页内处理类型。当前按“数字 ID”假设实现。