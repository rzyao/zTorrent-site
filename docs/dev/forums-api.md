# Forums (论坛) 模块接口文档

## 1. 概览

- **Base Path**: `forums/`
- **描述**: 提供完整的论坛功能，包括分类、话题、回复、标签、订阅、举报及数据统计。
- **公共规范**:
  - 所有请求方法均为 **POST**。
  - 入参及出参均使用 **camelCase** 驼峰命名。
  - 标准响应结构：`{ code: 1000, message: "ok", data: any, timestamp: string }`。

---

## 2. 接口详情

### 2.1 话题 (Topics)

**Base Path**: `forums/topics`

#### 2.1.1 获取话题列表

- **路径**: `POST /forums/topics/list`
- **描述**: 根据分类、关键字分页查询话题。

| 字段名     | 类型   | 必填 | 描述               | 校验规则 |
| :--------- | :----- | :--- | :----------------- | :------- |
| categoryId | string | 否   | 分类 ID 过滤       | -        |
| search     | string | 否   | 搜索关键字         | -        |
| page       | number | 否   | 页码 (默认 1)      | Min(1)   |
| limit      | number | 否   | 每页条数 (默认 20) | Min(1)   |

#### 2.1.2 获取话题详情

- **路径**: `POST /forums/topics/detail`
- **描述**: 获取指定话题的详细信息（包含作者、分类等关系）。

| 字段名 | 类型   | 必填 | 描述    |
| :----- | :----- | :--- | :------ |
| id     | string | 是   | 话题 ID |

#### 2.1.3 发布话题

- **路径**: `POST /forums/topics/create`
- **鉴权**: 需要登录 (Bearer Token)
- **描述**: 在指定分类下发布新话题。

| 字段名     | 类型     | 必填 | 描述                | 校验规则    |
| :--------- | :------- | :--- | :------------------ | :---------- |
| title      | string   | 是   | 话题标题            | 最小 5 字符 |
| content    | string   | 是   | 话题内容 (Markdown) | -           |
| categoryId | string   | 是   | 分类 ID             | -           |
| tagNames   | string[] | 否   | 标签名称列表        | -           |

---

### 2.2 回复 (Posts)

**Base Path**: `forums/posts`

#### 2.2.1 获取回复列表

- **路径**: `POST /forums/posts/list`
- **描述**: 分页获取指定话题下的所有回复。

| 字段名  | 类型   | 必填 | 描述     |
| :------ | :----- | :--- | :------- |
| topicId | string | 是   | 话题 ID  |
| page    | number | 否   | 页码     |
| limit   | number | 否   | 每页条数 |

#### 2.2.2 发表回复

- **路径**: `POST /forums/posts/create`
- **鉴权**: 需要登录
- **描述**: 参与话题讨论或回复特定楼层。

| 字段名    | 类型   | 必填 | 描述                |
| :-------- | :----- | :--- | :------------------ |
| topicId   | string | 是   | 话题 ID             |
| content   | string | 是   | 回复内容 (Markdown) |
| replyToId | string | 否   | 引用回复的目标 ID   |

---

### 2.3 分类 (Categories)

**Base Path**: `forums/categories`

#### 2.3.1 获取所有分类

- **路径**: `POST /forums/categories/list`
- **描述**: 获取系统所有可用的论坛分类（常用于侧边栏或首页）。

#### 2.3.2 获取分类详情 (Slug)

- **路径**: `POST /forums/categories/by-slug`
- **描述**: 通过 URL 友好的标识符获取分类信息。

| 字段名 | 类型   | 必填 | 描述       |
| :----- | :----- | :--- | :--------- |
| slug   | string | 是   | 分类标识符 |

---

### 2.4 订阅 (Subscriptions)

**Base Path**: `forums/subscriptions`

#### 2.4.1 订阅话题

- **路径**: `POST /forums/subscriptions/subscribe`
- **鉴权**: 需要登录
- **描述**: 订阅特定话题，接收更新通知。

| 字段名      | 类型    | 必填 | 描述             |
| :---------- | :------ | :--- | :--------------- |
| topicId     | string  | 是   | 话题 ID          |
| emailNotify | boolean | 否   | 是否启用邮件通知 |
| siteNotify  | boolean | 否   | 是否启用站内通知 |

---

### 2.5 举报 (Reports)

**Base Path**: `forums/reports`

#### 2.5.1 提交举报

- **路径**: `POST /forums/reports/create`
- **鉴权**: 需要登录
- **描述**: 举报违规帖子或话题。

| 字段名      | 类型   | 必填 | 描述          |
| :---------- | :----- | :--- | :------------ | ------ |
| type        | string | 是   | 类型: 'topic' | 'post' |
| targetId    | string | 是   | 举报对象 ID   |
| reason      | string | 是   | 举报原因      |
| description | string | 否   | 详细描述      |

---

### 2.6 数据统计 (Statistics)

**Base Path**: `forums/statistics`

#### 2.6.1 今日概览

- **路径**: `POST /forums/statistics/today`
- **描述**: 获取今日发帖量、新话题数等统计数据。

#### 2.6.2 热门话题榜

- **路径**: `POST /forums/statistics/hot-topics`
- **描述**: 获取全站浏览量或回复量最高的话题。

| 字段名 | 类型   | 必填 | 描述               |
| :----- | :----- | :--- | :----------------- |
| limit  | number | 否   | 返回条数 (默认 10) |

---

## 3. 标准响应示例 (成功)

```json
{
  "code": 1000,
  "message": "ok",
  "data": {
    "id": "123456789",
    "title": "示例话题",
    "content": "内容详情...",
    "replyCount": 5,
    "lastReplyAt": "2023-12-30T10:00:00Z",
    "author": {
      "username": "tester",
      "avatar": "..."
    }
  },
  "timestamp": "2023-12-30T10:05:00.000Z"
}
```
