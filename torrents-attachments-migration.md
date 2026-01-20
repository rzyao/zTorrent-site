# 种子封面/剧照附件化改造 - 前端变更说明

## 背景

后端将「图片类字段」从业务表字段（如 `torrent.cover`、`movie.posterUrl`）迁移到统一的附件表（Attachments），以便：

- 统一存储与绑定关系（attachableType/attachableId/field）
- 支持同一业务对象的多图（数组）与多尺寸衍生图
- 减少业务表字段膨胀，统一图片来源与访问策略

本次变更中，**前端需要重点关注「种子上传/编辑」流程**：封面/剧照不再直接传 URL，而是传附件 ID。

---

## 影响范围（前端需要关注）

### 1) 种子创建/更新入参变更（必须改）

受影响接口：

- `POST /torrents/upload`（multipart/form-data）
- `POST /torrents/upload/update`（application/json）

变更点：

| 场景 | 旧字段 | 新字段 | 说明 |
|---|---|---|---|
| 封面 | `cover: string` | `coverAttachmentId: string` | 传图片上传后返回的附件ID |
| 剧照（多图） | `stills: string[]` | `stillAttachmentIds: string[]` | 传多个附件ID，后端会按顺序绑定 |

注意：

- `POST /torrents/upload` 为 multipart：`stillAttachmentIds` 推荐通过「重复同名字段」方式传递（多次 append 同一个 key），确保后端拿到数组。
- `POST /torrents/upload/update` 为 JSON：直接传数组即可。

对应 DTO 定义：

- [base-torrent-metadata.dto.ts](file:///c:/project/zTorrent/src/content/torrents/upload/dto/base-torrent-metadata.dto.ts)

---

### 2) 种子返回字段变化（可能需要改）

#### 2.1 保持可用（字段名不变）

多数列表/详情接口仍返回：

- `cover: string | null`（封面 URL）
- `stills: string[]`（剧照 URL 列表；主要在详情、创建/更新返回中出现）

但需要注意：

- 图片现在来自附件绑定关系，**可能为 null**（未上传封面/未绑定附件时）。

#### 2.2 不再返回（如前端在用则需要替换）

由于业务表字段已移除，以下字段不再由后端自动提供（如果前端历史上用到，需要改为查询附件接口）：

- `originalCoverUrl`
- `thumbCoverPath`
- `mediumCoverPath`
- `largeCoverPath`
- `stillsThumbs`

---

### 3) 其他模块：可能出现 null（通常只需兜底）

以下接口字段名通常不变，但图片来源改为附件，前端需确保对 `null` 有占位图/兜底逻辑：

- 收藏夹（favorites）中 Movie/Series/Playlist 的封面
- 订阅（subscriptions）中 Series/Playlist 的封面
- 片单条目（playlist items）中 Movie/Series 的 `posterUrl`
- 分集详情（episodes）中 Series 的 `posterUrl/backdropUrl`，以及返回的 torrent `cover`

---

## 新流程（推荐实现）

### Step 1：上传图片，拿到 `attachmentId`

接口：

- `POST /images/upload`

请求体（JSON）示例：

```json
{
  "filename": "cover.jpg",
  "content": "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQ..."
}
```

响应示例：

```json
{
  "attachmentId": "1234567890",
  "url": "https://your-host/uploads/images/..."
}
```

---

### Step 2：创建/更新种子时传 `coverAttachmentId/stillAttachmentIds`

#### 2.1 创建种子（multipart/form-data）

接口：

- `POST /torrents/upload`

form-data 建议：

- `file`: `.torrent` 文件
- 其它元数据字段（name/title/description/...）
- `coverAttachmentId`: 单值字符串
- `stillAttachmentIds`: 多值（重复同名字段）

#### 2.2 更新种子（application/json）

接口：

- `POST /torrents/upload/update`

请求体示例：

```json
{
  "id": "1785462145234",
  "coverAttachmentId": "1234567890",
  "stillAttachmentIds": ["2001", "2002", "2003"]
}
```

---

## 如何获取附件（封面多尺寸/剧照列表）

如果前端需要封面多尺寸或独立拉取剧照：

接口：

- `GET /attachments?attachableType=...&attachableId=...&field=...`

字段约定（本次改造涉及）：

### Torrent（attachableType = `torrent`）

- `field=cover`：封面原图
- `field=cover_thumb`：封面缩略图
- `field=cover_medium`：封面中等尺寸
- `field=cover_large`：封面大图
- `field=still`：剧照（数组型，多条记录，按 sortOrder 排序）

示例：

- 获取封面缩略图：`GET /attachments?attachableType=torrent&attachableId=<tid>&field=cover_thumb`
- 获取剧照列表：`GET /attachments?attachableType=torrent&attachableId=<tid>&field=still`

### Series（attachableType = `series`）

- `field=poster`
- `field=backdrop`

### Movie（attachableType = `movie`）

- `field=poster`

### Playlist（attachableType = `playlist`）

- `field=cover`

---

## 前端改造清单（建议按此排查）

- 种子上传页：封面输入从“URL/文本”改为“上传图片 -> attachmentId”
- 种子编辑页：封面/剧照保存改为提交 `coverAttachmentId/stillAttachmentIds`
- 图片展示组件：允许 `null`，统一占位图
- 若用到封面缩略图字段：改为调用 `/attachments` 获取 `cover_thumb/cover_medium/cover_large`

