# 审核功能接口文档

本系统所有审核相关接口统一遵循 RESTful 风格（POST 方式），需携带 Bearer Token 进行鉴权。

## 1. 通用说明

- **鉴权**: Header `Authorization: Bearer <token>`
- **权限**: 需要具备对应模块的审核权限（如 `series:review`）。
- **状态机**: 资源通常经历 `pending` (待审核) -> `approved` (通过) / `rejected` (拒绝)。

## 2. 种子审核 (Torrents)

**Base URL**: `/torrents/review`

### 2.1 获取待审核列表

- **Path**: `/pending`
- **Method**: POST
- **Body**: `PendingReviewsDto` (分页参数)

### 2.2 执行审核

- **Path**: `/action`
- **Method**: POST
- **Body**: `ReviewDto`
  - `id`: 种子 ID
  - `action`: 'approve' | 'reject'
  - `note`: 备注 (可选)
  - `reasonCode`: 原因代码 (可选)

### 2.3 审核历史

- **Path**: `/history`
- **Method**: POST
- **Body**: `ReviewHistoryDto`

---

## 3. 电影审核 (Movies)

**Base URL**: `/movies/review`

### 3.1 获取待审核列表

- **Path**: `/pending`
- **Method**: POST
- **Body**: `PendingMoviesDto`

### 3.2 执行审核

- **Path**: `/action`
- **Method**: POST
- **Body**: `ReviewMovieDto` (扩展自 ReviewDto)

### 3.3 审核历史

- **Path**: `/history`
- **Method**: POST
- **Description**: **[增强]** 返回结果包含审核人 (`operator`) 详细信息。
- **Body**: `MovieReviewHistoryDto`

---

## 4. 剧集审核 (Series)

**Base URL**: `/series/review`

### 4.1 获取待审核列表

- **Path**: `/pending`
- **Method**: POST
- **Body**: `ListPendingSeriesDto`

### 4.2 执行审核

- **Path**: `/action`
- **Method**: POST
- **Body**: `ReviewSeriesDto` (扩展自 ReviewDto，含 id)

### 4.3 审核历史

- **Path**: `/history`
- **Method**: POST
- **Description**: **[增强]** 返回结果包含审核人 (`operator`) 详细信息。
- **Body**: `SeriesReviewHistoryDto`

---

## 5. 分集审核 (Episodes)

**Base URL**: `/episodes/review`

### 5.1 获取待审核列表

- **Path**: `/pending`
- **Method**: POST
- **Body**: `ListPendingEpisodesDto`

### 5.2 执行审核

- **Path**: `/action`
- **Method**: POST
- **Body**: `ReviewEpisodeDto`

### 5.3 审核历史

- **Path**: `/history`
- **Method**: POST
- **Description**: **[增强]** 返回结果包含审核人 (`operator`) 详细信息。
- **Body**: `EpisodeReviewHistoryDto`

---

## 6. 片单审核 (Playlists)

**Base URL**: `/playlists/review`

### 6.1 获取待审核列表

- **Path**: `/pending`
- **Method**: POST
- **Body**: `ListPendingPlaylistsDto`

### 6.2 执行审核

- **Path**: `/action`
- **Method**: POST
- **Body**: `ReviewDto` (通用 DTO)

### 6.3 审核历史

- **Path**: `/history`
- **Method**: POST
- **Description**: **[增强]** 返回结果包含审核人 (`operator`) 详细信息。
- **Body**: `PlaylistReviewHistoryDto`
