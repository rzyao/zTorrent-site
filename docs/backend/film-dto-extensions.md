# Create/Update 影片 DTO 扩展规范（后端实现文档）

## 目标
- 基于前端表单扩展，为后端 `CreateFilmDto` 与 `UpdateFilmDto` 增加以下 7 个字段。
- 保持现有接口与数据模型稳定；新增字段全部为可选项，不影响旧请求。

## 新增字段
- awards
  - 类型：`string[]`
  - 说明：影片获奖列表，每项为一条获奖记录的完整文本
  - 示例：`["第82届威尼斯电影节 金狮奖(提名)", "第46届韩国电影青龙奖 最佳影片"]`
- region
  - 类型：`string[]`
  - 说明：产地/地区标签
  - 示例：`["韩国"]`
- language
  - 类型：`string[]`
  - 说明：主要语言列表
  - 示例：`["韩语", "英语"]`
- doubanLink
  - 类型：`string`
  - 说明：豆瓣影片页链接（去除反引号，并清洗首尾空白）
  - 校验：`http/https` URL，最大长度建议 `300`
  - 示例：`https://movie.douban.com/subject/4092781/`
- imdbLink
  - 类型：`string`
  - 说明：IMDb 影片页链接（去除反引号，并清洗首尾空白）
  - 校验：`http/https` URL，最大长度建议 `300`
  - 示例：`https://www.imdb.com/title/tt1527793/`
- doubanRatingAverage
  - 类型：`number`
  - 说明：豆瓣评分平均值（0–10，保留一位小数）
  - 示例：`7.3`
- imdbRatingAverage
  - 类型：`number`
  - 说明：IMDb 评分平均值（0–10，保留一位小数）
  - 示例：`7.6`

## 字段行为与清洗
- 统一输入清洗
  - 端到端移除反引号与首尾空白：`doubanLink`、`imdbLink`、`posterUrl` 等链接字段
  - `awards/region/language`：去除空字符串项，必要时去重
- 评分协同
  - 新旧字段并存：保留现有 `rating` 字段
  - 合理默认：当 `rating` 未提供时，可在后端以 `doubanRatingAverage ?? imdbRatingAverage ?? rating` 的顺序设置；若需严格控制，请保持 `rating` 仅由客户端决定

## OpenAPI 变更（示例 YAML）
### CreateFilmDto
```yaml
components:
  schemas:
    CreateFilmDto:
      type: object
      properties:
        title:
          type: string
        description:
          type: string
          nullable: true
        coverUrl:
          type: string
          nullable: true
        enabled:
          type: boolean
          nullable: true
        sort:
          type: number
          format: int32
          nullable: true
        originalTitle:
          type: string
          nullable: true
        year:
          type: string
          description: 年份，支持 YYYY 或 YYYY-YYYY
          nullable: true
        category:
          type: string
          enum: [film, series, documentary, anime]
          nullable: true
        rating:
          type: number
          format: float
          nullable: true
        duration:
          type: string
          nullable: true
        director:
          type: string
          nullable: true
        posterUrl:
          type: string
          nullable: true
        backdropUrl:
          type: string
          nullable: true
        genres:
          type: array
          items:
            type: string
          maxItems: 20
          nullable: true
        cast:
          type: array
          items:
            type: string
          maxItems: 20
          nullable: true
        awards:
          type: array
          items:
            type: string
          description: 获奖列表
          nullable: true
        region:
          type: array
          items:
            type: string
          description: 地区标签
          nullable: true
        language:
          type: array
          items:
            type: string
          description: 语言列表
          nullable: true
        doubanLink:
          type: string
          description: 豆瓣链接（http/https）
          maxLength: 300
          nullable: true
        imdbLink:
          type: string
          description: IMDb 链接（http/https）
          maxLength: 300
          nullable: true
        doubanRatingAverage:
          type: number
          format: float
          minimum: 0
          maximum: 10
          description: 豆瓣平均分（0–10，建议一位小数）
          nullable: true
        imdbRatingAverage:
          type: number
          format: float
          minimum: 0
          maximum: 10
          description: IMDb 平均分（0–10，建议一位小数）
          nullable: true
```

### UpdateFilmDto
```yaml
components:
  schemas:
    UpdateFilmDto:
      type: object
      properties:
        title:
          type: string
          nullable: true
        description:
          type: string
          nullable: true
        coverUrl:
          type: string
          nullable: true
        enabled:
          type: boolean
          nullable: true
        sort:
          type: number
          format: int32
          nullable: true
        originalTitle:
          type: string
          nullable: true
        year:
          type: string
          description: 年份，支持 YYYY 或 YYYY-YYYY
          nullable: true
        category:
          type: string
          enum: [film, series, documentary, anime]
          nullable: true
        rating:
          type: number
          format: float
          nullable: true
        duration:
          type: string
          nullable: true
        director:
          type: string
          nullable: true
        posterUrl:
          type: string
          nullable: true
        backdropUrl:
          type: string
          nullable: true
        genres:
          type: array
          items:
            type: string
          maxItems: 20
          nullable: true
        cast:
          type: array
          items:
            type: string
          maxItems: 20
          nullable: true
        awards:
          type: array
          items:
            type: string
          description: 获奖列表
          nullable: true
        region:
          type: array
          items:
            type: string
          description: 地区标签
          nullable: true
        language:
          type: array
          items:
            type: string
          description: 语言列表
          nullable: true
        doubanLink:
          type: string
          description: 豆瓣链接（http/https）
          maxLength: 300
          nullable: true
        imdbLink:
          type: string
          description: IMDb 链接（http/https）
          maxLength: 300
          nullable: true
        doubanRatingAverage:
          type: number
          format: float
          minimum: 0
          maximum: 10
          description: 豆瓣平均分（0–10，建议一位小数）
          nullable: true
        imdbRatingAverage:
          type: number
          format: float
          minimum: 0
          maximum: 10
          description: IMDb 平均分（0–10，建议一位小数）
          nullable: true
```

## 示例请求体
### 创建 `POST /films`
```json
{
  "title": "无可奈何",
  "originalTitle": "어쩔수가없다",
  "year": "2025",
  "category": "film",
  "rating": 7.3,
  "duration": "139分钟",
  "director": "朴赞郁 Chan-wook Park",
  "posterUrl": "https://img1.doubanio.com/view/photo/l_ratio_poster/public/p2925885108.jpg",
  "backdropUrl": "",
  "genres": ["剧情", "喜剧", "惊悚", "犯罪"],
  "cast": ["李炳宪 Byung-hun Lee", "孙艺珍 Ye-jin Son"],
  "awards": [
    "第82届威尼斯电影节 主竞赛单元 金狮奖(提名) 朴赞郁",
    "第46届韩国电影青龙奖 最佳影片"
  ],
  "region": ["韩国"],
  "language": ["韩语", "英语"],
  "doubanLink": "https://movie.douban.com/subject/4092781/",
  "imdbLink": "https://www.imdb.com/title/tt1527793/",
  "doubanRatingAverage": 7.3,
  "imdbRatingAverage": 7.6
}
```

### 更新 `PATCH /films/{id}`（示例仅更新扩展字段）
```json
{
  "awards": ["第46届韩国电影青龙奖 最佳导演 朴赞郁"],
  "region": ["韩国"],
  "language": ["韩语"],
  "doubanLink": "https://movie.douban.com/subject/4092781/",
  "imdbLink": "https://www.imdb.com/title/tt1527793/",
  "doubanRatingAverage": 7.3,
  "imdbRatingAverage": 7.6
}
```

## 返回模型建议（DTO）
- 前端需要展示：请在 `PublicFilmDto` 与 `PublicFilmDetailDto` 同步增加上述 7 字段，并保持类型一致。
- 若已存在 `language` 字段但为 `string`，建议统一改为 `string[]` 以兼容多语言场景（或新增 `languages` 字段，保留旧 `language` 只读兼容）。

## 存储与索引建议
- awards/region/language：
  - 关系型库：拆分关联表（如 `film_languages`、`film_regions`、`film_awards`）以利于筛选与索引。
  - 索引：建议对 `region` 与 `language` 做可选索引，便于筛选。
- 链接字段：
  - 最大长度 1000，URL 统一小写化可选；保留协议与路径原样。
- 评分字段：
  - `decimal(3,1)` 或 `float`，范围约束 0–10。

- 若需要后端自动补全 `rating`：
  - 当 `rating` 缺失时，以 `doubanRatingAverage ?? imdbRatingAverage` 赋值；否则维持客户端传值。



