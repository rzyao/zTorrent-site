# 媒体-种子关联接口重构变更说明

> **版本**: v2.0  
> **日期**: 2025-12-20  
> **影响范围**: 电影种子绑定、剧集种子绑定

---

## 一、核心变更

系统将电影/剧集与种子的关系从 **一对多** 重构为 **多对多**。

**对前端的影响**：

- 接口签名基本不变，但底层逻辑已改变
- `UnbindTorrentDto` 新增必填字段

---

## 二、接口变更详情

### 2.1 电影种子绑定

#### `POST /movies/torrents/bind`

**路径重命名**（签名不变），请求体不变：

```json
{
  "id": "电影ID",
  "torrentIds": ["种子ID1", "种子ID2"]
}
```

#### `POST /movies/torrents/unbind`

**路径重命名**（签名不变），请求体不变：

```json
{
  "id": "电影ID",
  "torrentIds": ["种子ID1", "种子ID2"]
}
```

---

### 2.2 剧集种子绑定

#### `POST /series/torrents/bind`

**无变更**，请求体不变：

```json
{
  "seriesId": "剧集ID",
  "torrentId": "种子ID",
  "episodeNumber": 1 // 可选，不传表示绑定到整部剧集
}
```

#### `POST /series/torrents/unbind`

⚠️ **有变更** - 新增必填字段 `seriesId`

**旧版请求体**：

```json
{
  "torrentId": "种子ID"
}
```

**新版请求体**：

```json
{
  "seriesId": "剧集ID", // ⚠️ 新增必填
  "torrentId": "种子ID",
  "episodeNumber": 1 // 可选，不传表示解绑剧集级别
}
```

---

### 2.3 剧集种子列表

#### `POST /series/torrents/list`

**无变更**，请求体不变：

```json
{
  "seriesId": "剧集ID",
  "page": 1,
  "limit": 100
}
```

**响应体字段变更**：

| 字段          | 旧值                     | 新值                     | 说明                                |
| ------------- | ------------------------ | ------------------------ | ----------------------------------- |
| `contentType` | `"series"` / `"episode"` | `"series"` / `"episode"` | 值不变，但来源从种子表改为关联表    |
| `episodeId`   | 种子表字段               | 关联表 mediaId           | 仅当 `contentType="episode"` 时有值 |

---

## 三、数据库变更（仅供参考）

### 新增表 `media_torrents`

| 列名         | 类型   | 说明                           |
| ------------ | ------ | ------------------------------ |
| `id`         | bigint | 主键                           |
| `media_id`   | bigint | 媒体 ID (电影/剧集/分集)       |
| `media_type` | enum   | `movie` / `series` / `episode` |
| `torrent_id` | bigint | 种子 ID                        |

### 移除字段（`torrents` 表）

- `movie_id`
- `series_id`
- `episode_id`
- `content_type`

---

## 四、前端迁移检查清单

- [ ] 更新 `/series/torrents/unbind` 调用，添加 `seriesId` 参数
- [ ] 确认种子列表响应中 `contentType` 和 `episodeId` 字段仍正常解析
- [ ] 测试电影绑定/解绑流程
- [ ] 测试剧集绑定/解绑流程（含分集）

---

## 五、常见问题

### Q: 一个种子现在可以同时关联多部电影吗？

**A**: 是的。多对多关系允许一个种子被多个媒体条目引用（如"指环王三部曲"可同时出现在三部电影的详情页）。

### Q: 解绑时不传 `episodeNumber` 会发生什么？

**A**: 系统会尝试解绑该种子与剧集本体（`mediaType=series`）的关联。如果种子是绑定在分集上的，需要传入对应的 `episodeNumber` 才能解绑。
