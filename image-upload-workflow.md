# 图片上传与管理完整流程

## 目录
- [概述](#概述)
- [核心概念](#核心概念)
- [API 接口](#api-接口)
- [前端使用流程](#前端使用流程)
- [后端实现细节](#后端实现细节)
- [数据库设计](#数据库设计)
- [最佳实践](#最佳实践)

---

## 概述

本项目采用**统一附件管理机制**处理所有图片资源，包括：
- 内部上传图片（用户头像、电影海报、剧照等）
- 外部链接图片（豆瓣海报、TMDB 图片等）

**核心优势：**
- 统一管理，便于清理和统计
- 支持多尺寸衍生图（缩略图、中图、大图）
- 内外部图片自动区分返回格式
- 支持多态关联（一套机制服务所有业务场景）

---

## 核心概念

### 1. Attachments 表

| 字段 | 类型 | 说明 |
|------|------|------|
| `id` | bigint | 附件唯一ID |
| `kind` | enum | `image` / `file` / `audio` |
| `source` | enum | `upload`（内部上传） / `external`（外部链接） |
| `url` | varchar(512) | 访问地址（相对路径或完整URL） |
| `storagePath` | varchar(512) | 本地存储路径（外部图片为空） |
| `attachableType` | varchar(64) | 关联业务类型（如 `movie`, `user_profile`） |
| `attachableId` | bigint | 关联业务ID |
| `field` | varchar(64) | 字段语义（如 `poster`, `avatar`, `cover`） |
| `sortOrder` | int | 多图排序（如剧照） |

### 2. 业务实体逻辑外键

各业务实体通过**逻辑外键**关联固定图片：

```typescript
// Movie 实体示例
posterAttachmentId?: string;  // 海报附件ID
posterAttachment?: Relation<AttachmentEntity>;  // 可通过 relations 加载
```

### 3. URL 返回规则

| 来源 | 存储 | API 返回 | 前端处理 |
|------|------|----------|---------|
| 内部上传 | 相对路径 | `/uploads/images/23/45/abc.jpg` | 拼接 `BASE_URL` |
| 外部链接 | 完整URL | `https://img.douban.com/poster.jpg` | 直接使用 |

---

## API 接口

### 1. 上传内部图片

**接口：** `POST /images/upload`

**请求：**
```json
{
  "filename": "avatar.jpg",
  "content": "data:image/jpeg;base64,/9j/4AAQSkZJRg...",
  "attachableType": "user_profile",  // 可选：直接绑定
  "attachableId": "123456",          // 可选
  "field": "avatar"                  // 可选
}
```

**响应：**
```json
{
  "attachmentId": "1234567890",
  "url": "/uploads/images/23/45/abc.jpg"
}
```

---

### 2. 保存外部图片链接

**接口：** `POST /images/external`

**请求：**
```json
{
  "url": "https://img.douban.com/view/photo/l/public/p123456.jpg",
  "attachableType": "movie",  // 可选
  "attachableId": "789012",   // 可选
  "field": "poster"           // 可选
}
```

**响应：**
```json
{
  "attachmentId": "9876543210",
  "url": "https://img.douban.com/view/photo/l/public/p123456.jpg"
}
```

---

### 3. 查询附件

**接口：** `GET /attachments`

**参数：**
- `attachableType`: 业务类型（如 `movie`）
- `attachableId`: 业务ID
- `field`: 字段（如 `poster`）

**响应：**
```json
[
  {
    "id": "1234567890",
    "kind": "image",
    "source": "upload",
    "url": "/uploads/images/23/45/abc.jpg",
    "field": "poster"
  }
]
```

---

## 前端使用流程

### 场景 1：用户上传头像

```typescript
// 1. 用户选择文件
const file = document.querySelector('input[type="file"]').files[0];

// 2. 转为 base64
const base64 = await fileToBase64(file);

// 3. 上传图片
const { attachmentId } = await POST('/images/upload', {
  filename: file.name,
  content: base64
});

// 4. 设置为头像
await POST('/users/profile/avatar/set', { 
  attachmentId 
});
```

---

### 场景 2：创建电影（带海报）

```typescript
// 方式 A：用户上传本地图片
const posterFile = /* ... */;
const { attachmentId: posterAttachmentId } = await POST('/images/upload', {
  filename: posterFile.name,
  content: await fileToBase64(posterFile)
});

// 方式 B：用户输入外部URL
const externalUrl = 'https://img.douban.com/poster.jpg';
const { attachmentId: posterAttachmentId } = await POST('/images/external', {
  url: externalUrl
});

// 创建电影
await POST('/movies/create', {
  title: '肖申克的救赎',
  posterAttachmentId,  // 可选
  backdropAttachmentId,  // 可选
  // ... 其他字段
});
```

---

### 场景 3：通用图片处理函数

```typescript
/**
 * 通用图片处理：自动识别内外部
 */
async function processImage(input: File | string): Promise<string> {
  // 外部 URL
  if (typeof input === 'string' && /^https?:\/\//.test(input)) {
    const res = await POST('/images/external', { url: input });
    return res.attachmentId;
  }
  
  // 本地文件
  const base64 = await fileToBase64(input as File);
  const res = await POST('/images/upload', {
    filename: (input as File).name,
    content: base64
  });
  return res.attachmentId;
}

// 使用
const posterAttachmentId = await processImage(userInput);
```

---

### 场景 4：显示图片

```typescript
// 1. 从 API 获取电影详情
const movie = await GET('/movies/detail', { id: '123' });

// 2. 拼接图片URL
const posterUrl = movie.posterUrl.startsWith('http')
  ? movie.posterUrl  // 外部链接，直接使用
  : `${BASE_URL}${movie.posterUrl}`;  // 内部图片，拼接BASE_URL

// 3. 渲染
<img src={posterUrl} alt="海报" />
```

---

## 后端实现细节

### 1. AttachmentsService 核心逻辑

```typescript
// 规范化返回 URL
normalizeOutputUrl(attachment: { source?: AttachmentSource; ... }): string {
  // 外部链接：原样返回
  if (attachment.source === "external") {
    return attachment.url || "";
  }
  // 内部图片：转为相对路径
  return this.toRelativePath(attachment.storagePath, attachment.url);
}
```

### 2. 创建外部链接附件

```typescript
async createExternal(input: { url: string; ... }) {
  return this.create({
    kind: input.kind || "image",
    source: "external",
    size: "0",
    storagePath: "",  // 外部图无本地路径
    url: input.url,   // 完整 URL
    ...
  });
}
```

### 3. 业务实体查询时填充

```typescript
// Movie Service 示例
async getDetail(id: string) {
  const movie = await this.movieRepo.findOne({ where: { id } });
  
  // 方式 A：通过逻辑外键加载（推荐）
  const movieWithAttachments = await this.movieRepo.findOne({
    where: { id },
    relations: ['posterAttachment', 'backdropAttachment']
  });
  
  // 方式 B：批量查询
  const posterMap = await this.attachments.getLatestByTargetIds({
    attachableType: "movie",
    field: "poster",
    attachableIds: [id]
  });
  
  return {
    ...movie,
    posterUrl: posterMap.get(id)?.url ?? null,
  };
}
```

---

## 数据库设计

### 1. attachments 表结构

```sql
CREATE TABLE attachments (
  id BIGINT PRIMARY KEY,
  kind VARCHAR(16) NOT NULL,
  source VARCHAR(16) DEFAULT 'upload',  -- 新增
  mime VARCHAR(128),
  size BIGINT,
  url VARCHAR(512) NOT NULL,
  storage_path VARCHAR(512),
  original_name VARCHAR(256),
  uploader_user_id BIGINT,
  attachable_type VARCHAR(64),
  attachable_id BIGINT,
  field VARCHAR(64),
  sort_order INT,
  meta JSON,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  
  INDEX idx_attachments_target (attachable_type, attachable_id, field, sort_order),
  INDEX idx_attachments_source (source)
);
```

### 2. 业务实体添加逻辑外键

```sql
-- movies 表
ALTER TABLE movies ADD COLUMN poster_attachment_id BIGINT;
ALTER TABLE movies ADD COLUMN backdrop_attachment_id BIGINT;
CREATE INDEX idx_movies_poster ON movies(poster_attachment_id);
CREATE INDEX idx_movies_backdrop ON movies(backdrop_attachment_id);

-- series 表
ALTER TABLE series ADD COLUMN poster_attachment_id BIGINT;
ALTER TABLE series ADD COLUMN backdrop_attachment_id BIGINT;

-- playlists 表
ALTER TABLE playlists ADD COLUMN cover_attachment_id BIGINT;

-- user_profiles 表
ALTER TABLE user_profiles ADD COLUMN avatar_attachment_id BIGINT;
```

---

## 最佳实践

### 1. 前端

✅ **推荐：**
- 统一使用 `processImage()` 函数处理所有图片输入
- 显示图片时检查 URL 前缀自动处理
- 缓存 `BASE_URL` 避免重复拼接

❌ **避免：**
- 直接传图片 URL 给创建接口（应先转为附件ID）
- 假设所有图片都是内部路径
- 在多处重复实现图片上传逻辑

---

### 2. 后端

✅ **推荐：**
- 固定单图使用逻辑外键（`posterAttachmentId`）
- 多图或动态图使用虚拟属性 + 多态关联
- Service 层统一调用 `normalizeOutputUrl()`

❌ **避免：**
- 业务表直接存储图片 URL
- 混用多种图片存储机制
- 返回绝对路径给前端

---

### 3. 字段约定

| 业务类型 | attachableType | field | 说明 |
|---------|---------------|-------|------|
| Movie | `movie` | `poster` | 海报 |
| Movie | `movie` | `backdrop` | 背景图 |
| Series | `series` | `poster` | 海报 |
| Series | `series` | `backdrop` | 背景图 |
| Playlist | `playlist` | `cover` | 封面 |
| Torrent | `torrent` | `cover` | 封面 |
| Torrent | `torrent` | `still` | 剧照（多图） |
| Torrent | `torrent` | `cover_thumb` | 封面缩略图 |
| Torrent | `torrent` | `cover_medium` | 封面中图 |
| Torrent | `torrent` | `cover_large` | 封面大图 |
| UserProfile | `user_profile` | `avatar` | 头像 |

---

## 常见问题

### Q1: 为什么不直接存 URL 在业务表？

**A:** 统一附件管理有以下优势：
1. 支持多尺寸衍生图
2. 便于清理孤儿文件
3. 统计图片使用情况
4. 统一内外部图片处理逻辑

---

### Q2: 外部图片会下载到本地吗？

**A:** 不会。外部图片只保存链接，`storagePath` 为空，节省存储空间。

---

### Q3: 如何删除附件？

**A:** 
- 软删除业务实体时，附件不会自动删除（支持回收站功能）
- 需要定时任务清理孤儿附件（`attachableId` 指向已删除的实体）

---

### Q4: 如何替换图片？

**方式 A：上传新图后更新附件ID**
```typescript
const newAttachmentId = await processImage(newFile);
await POST('/movies/update', { 
  id: movieId,
  posterAttachmentId: newAttachmentId 
});
```

**方式 B：使用 `replaceSingle()` 方法（后端）**
```typescript
await this.attachments.replaceSingle(
  { attachableType: 'movie', attachableId: movieId, field: 'poster' },
  { kind: 'image', url: newUrl, ... }
);
```

---

## 相关文档

- [附件化改造前端变更说明](./torrents-attachments-migration.md)
- [API 接口规范](../API接口开发规范.md)
- [数据库设计](../../README.md)
