# Task: 重构论坛首页为经典分区结构

## 目标

将论坛首页从单一的“帖子列表”改为经典的“分区 (Partition) > 版块 (Board)”索引页结构。

## 规格说明

1.  **布局**: 全宽布局 (Full Width)，无侧边栏。
2.  **结构**:
    - **首页**: 显示分区列表 -> 每个分区包含若干版块。
    - **分区逻辑**: 前端静态配置分区映射 (Strategy B)。默认分区：`站务大厅`, `资源分享`, `综合讨论`。
    - **版块展示**:
      - 图标 (Icon)
      - 名称 & 描述
      - 统计: 主题数, 今日发帖(如有)
      - 最后发表: 标题, 用户, 时间
3.  **交互**:
    - 点击版块 -> 进入该版块的帖子列表页 (现有的列表视图)。
    - 点击最后发表 -> 跳转帖子详情。

## 实现步骤

1.  **配置**: 在 `src/pages/Forum/constants.ts` 定义分区结构 `FORUM_PARTITIONS`。
2.  **组件开发**:
    - `src/pages/Forum/components/ForumIndex/BoardRow.tsx`: 单个版块行组件。
    - `src/pages/Forum/components/ForumIndex/PartitionGroup.tsx`: 分区容器组件。
    - `src/pages/Forum/components/ForumIndex/index.tsx`: 首页聚合组件。
3.  **页面集成**:
    - 修改 `src/pages/Forum/index.tsx`。
    - 引入“首页”状态 (`viewMode`: 'index' | 'list' | 'detail')。
    - 默认进入 'index' 模式。
    - 点击版块切换至 'list' 模式 (即设置 `activeCategoryId`)。

## 依赖检查

- 需要检查 `IForumCategory` 是否包含 `lastPost*` 相关字段。 (已确认包含 `lastPostAt`, `lastThreadId`, 等)。
- 需要图标库 (Lucide React)。
