# API 路由变更文档

## 变更日期：2025-12-25

## 变更概要

本次后端重构将 `torrent-record` 模块合并到 `torrents` 模块中，**API 路由前缀发生变更**。

---

## 🔴 破坏性变更（Breaking Changes）

### 路由前缀变更

| 变更类型            | 旧路由前缀            | 新路由前缀             |
| :------------------ | :-------------------- | :--------------------- |
| **Record 相关接口** | `/torrent-record/...` | `/torrents/record/...` |

---

## 📋 完整路由映射表

以下是所有受影响的接口，请按照映射表更新前端调用地址：

| 接口描述                     | 旧路由                                          | 新路由                                           | 方法 |
| :--------------------------- | :---------------------------------------------- | :----------------------------------------------- | :--- |
| 用户已发布的种子列表         | `POST /torrent-record/published`                | `POST /torrents/record/published`                | POST |
| 用户正在做种的种子列表       | `POST /torrent-record/seeding`                  | `POST /torrents/record/seeding`                  | POST |
| 用户正在下载的种子列表       | `POST /torrent-record/downloading`              | `POST /torrents/record/downloading`              | POST |
| 用户已完成的种子列表         | `POST /torrent-record/completed`                | `POST /torrents/record/completed`                | POST |
| 用户未完成的种子列表         | `POST /torrent-record/incomplete`               | `POST /torrents/record/incomplete`               | POST |
| 统计各类型种子数量           | `POST /torrent-record/stats`                    | `POST /torrents/record/stats`                    | POST |
| 查询下载记录列表             | `POST /torrent-record/records/list`             | `POST /torrents/record/records/list`             | POST |
| 按种子 ID 查询正在下载的记录 | `POST /torrent-record/torrent/downloading/list` | `POST /torrents/record/torrent/downloading/list` | POST |
| 按种子 ID 查询已发布的种子   | `POST /torrent-record/torrent/published/list`   | `POST /torrents/record/torrent/published/list`   | POST |
| 按种子 ID 查询正在做种的记录 | `POST /torrent-record/torrent/seeding/list`     | `POST /torrents/record/torrent/seeding/list`     | POST |
| 按种子 ID 查询已完成的记录   | `POST /torrent-record/torrent/completed/list`   | `POST /torrents/record/torrent/completed/list`   | POST |
| 按种子 ID 查询未完成的记录   | `POST /torrent-record/torrent/incomplete/list`  | `POST /torrents/record/torrent/incomplete/list`  | POST |
| 按用户 ID 查询下载记录列表   | `POST /torrent-record/user/records/list`        | `POST /torrents/record/user/records/list`        | POST |

---

## ✅ 未变更的接口

以下接口路由保持不变，无需修改：

- `/torrents/...` - 种子主接口
- `/torrents/download/...` - 下载相关接口
- `/tracker/...` - Tracker 相关接口

---

## 🔧 前端迁移指南

### 1. 全局替换

在前端代码中执行以下全局替换：

```
查找: /torrent-record/
替换: /torrents/record/
```

### 2. API 配置更新

如果前端使用了 API 常量配置，请更新相关配置：

```typescript
// 旧配置
const TORRENT_RECORD_API = "/torrent-record";

// 新配置
const TORRENT_RECORD_API = "/torrents/record";
```

### 3. TypeScript 类型定义

接口的请求参数和响应结构保持不变，无需修改类型定义。

---

## 📅 生效时间

- **变更生效日期**：2025-12-25
- **旧接口废弃日期**：立即生效（旧路由不再可用）

---

## 📞 联系方式

如有疑问，请联系后端开发团队。
