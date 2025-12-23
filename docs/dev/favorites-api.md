# Favorites 模块接口文档

## 1. 概览

- **Base Path**: `/favorites`
- **描述**: 提供用户收藏功能，支持某种资源（种子、电影、剧集等）的添加、移除、批量操作及列表查询。

## 2. 接口详情

### 2.1 添加收藏

- **路径**: `POST /favorites/add`
- **描述**: 添加收藏

#### 请求参数 (Request Body)

| 字段名     | 类型          | 必填 | 描述        | 校验规则                                  |
| :--------- | :------------ | :--- | :---------- | :---------------------------------------- |
| targetId   | string        | Yes  | 目标资源 ID | IsString, IsNotEmpty                      |
| targetType | string (enum) | Yes  | 目标类型    | IsEnum (torrent, movie, series, playlist) |
| note       | string        | No   | 备注        | IsOptional, MaxLength(500)                |

#### 响应结构 (Response)

```json
{
  "code": 1000,
  "message": "ok",
  "data": {
    // 成功返回 true 或创建的实体信息
  }
}
```

### 2.2 批量添加收藏

- **路径**: `POST /favorites/batch-add`
- **描述**: 批量添加收藏

#### 请求参数 (Request Body)

| 字段名     | 类型          | 必填 | 描述                         | 校验规则                            |
| :--------- | :------------ | :--- | :--------------------------- | :---------------------------------- |
| targetIds  | string[]      | Yes  | 目标资源 ID 列表             | IsArray, IsString(each), IsNotEmpty |
| targetType | string (enum) | Yes  | 目标类型                     | IsEnum                              |
| note       | string        | No   | 备注（所有项目使用相同备注） | IsOptional, MaxLength(500)          |

#### 响应结构 (Response)

```json
{
  "code": 1000,
  "message": "ok",
  "data": {
    // 批量操作结果
  }
}
```

### 2.3 取消收藏

- **路径**: `POST /favorites/remove`
- **描述**: 取消收藏

#### 请求参数 (Request Body)

| 字段名     | 类型          | 必填 | 描述        | 校验规则             |
| :--------- | :------------ | :--- | :---------- | :------------------- |
| targetId   | string        | Yes  | 目标资源 ID | IsString, IsNotEmpty |
| targetType | string (enum) | Yes  | 目标类型    | IsEnum               |
| note       | string        | No   | 备注 (忽略) | IsOptional           |

#### 响应结构 (Response)

```json
{
  "code": 1000,
  "message": "ok",
  "data": {
    // 操作结果
  }
}
```

### 2.4 批量取消收藏

- **路径**: `POST /favorites/batch-remove`
- **描述**: 批量取消收藏

#### 请求参数 (Request Body)

| 字段名     | 类型          | 必填 | 描述             | 校验规则                            |
| :--------- | :------------ | :--- | :--------------- | :---------------------------------- |
| targetIds  | string[]      | Yes  | 目标资源 ID 列表 | IsArray, IsString(each), IsNotEmpty |
| targetType | string (enum) | Yes  | 目标类型         | IsEnum                              |
| note       | string        | No   | 备注 (忽略)      | IsOptional                          |

#### 响应结构 (Response)

```json
{
  "code": 1000,
  "message": "ok",
  "data": {
    // 批量操作结果
  }
}
```

### 2.5 检查是否已收藏

- **路径**: `POST /favorites/check`
- **描述**: 检查是否已收藏

#### 请求参数 (Request Body)

| 字段名     | 类型          | 必填 | 描述        | 校验规则             |
| :--------- | :------------ | :--- | :---------- | :------------------- |
| targetId   | string        | Yes  | 目标资源 ID | IsString, IsNotEmpty |
| targetType | string (enum) | Yes  | 目标类型    | IsEnum               |

#### 响应结构 (Response)

```json
{
  "code": 1000,
  "message": "ok",
  "data": {
    "isFavorite": boolean // 假设返回结构，具体视 Service 实现而定
  }
}
```

### 2.6 获取我的收藏列表

- **路径**: `POST /favorites/list`
- **描述**: 获取我的收藏列表

#### 请求参数 (Request Body)

| 字段名     | 类型          | 必填 | 描述           | 校验规则                      |
| :--------- | :------------ | :--- | :------------- | :---------------------------- |
| targetType | string (enum) | No   | 按目标类型过滤 | IsOptional, IsEnum            |
| page       | number        | No   | 页码           | Default: 1, Min(1)            |
| limit      | number        | No   | 每页数量       | Default: 20, Min(1), Max(100) |

#### 响应结构 (Response)

```json
{
  "code": 1000,
  "message": "ok",
  "data": {
    "items": [
      {
        "id": "string",
        "targetId": "string",
        "targetType": "enum (torrent, movie, series, playlist)",
        "targetTitle": "string?",
        "targetCover": "string?",
        "note": "string?",
        "createdAt": "Date"
      }
    ],
    "total": 0,
    "page": 1,
    "limit": 20
  }
}
```
