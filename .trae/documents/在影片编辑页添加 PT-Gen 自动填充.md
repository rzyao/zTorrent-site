## 目标
- 在“添加影片”模式下，标题输入框上方新增 PT-Gen 工具栏（URL 输入 + 获取并填充按钮）。
- 新增并填充以下表单字段：`awards`、`region`、`doubanLink`、`imdbLink`、`doubanRatingAverage`、`imdbRatingAverage`、`language`。
- 使用 `/pt-gen/fetch` 返回的数据进行清洗与映射，自动填充上述字段与原有基础字段。

## 关键约束
- 现有可写负载（`CreateFilmDto`/`UpdateFilmDto`）不包含上述新增字段，直接保存到后端将不会生效。此次改动仅在前端表单层面增加与填充；如需持久化，需后续扩展 API DTO 与服务端。

## 涉及文件
- `src/pages/edit/EditMoviePage.tsx`：新增 UI、状态与获取填充逻辑；扩展表单为包含新增字段。
- `src/api/services/PtGenService.ts`：复用 `ptGenControllerFetch`。无需改动。
- 可选：新增 `src/utils/ptGen.ts` 封装清洗与映射函数，减少不同页面的重复逻辑。

## UI 改动（仅在“创建影片”时显示 PT-Gen 工具栏）
- 标题上方新增工具栏：
  - `input`：录入 Douban/IMDb 等页面 URL。
  - `button`：“获取并填充”，含加载态与错误反馈。
- 表单新增字段控件：
  - `awards`：`textarea`（多行文本，按行展示/编辑）。
  - `region`：多选输入（或 `chips`），绑定字符串数组。
  - `language`：多选输入（或 `chips`），绑定字符串数组。
  - `doubanLink`、`imdbLink`：`input`（URL）。
  - `doubanRatingAverage`、`imdbRatingAverage`：`input`（number，0–10，步进 0.1）。
- 原因：与返回结构一致，避免丢失信息；数组型采用可视化可编辑方式（chips/多选），提升可用性。

## 状态与类型改动
- 扩展 `movieForm`：新增上述 7 个字段；其中 `region`/`language` 为 `string[]`；`awards` 为 `string[]` 或以 `\n` 分隔的文本串；`doubanLink`/`imdbLink` 为 `string`；评分为 `number`。
- 新增 PT-Gen 状态：`ptGenUrl`, `ptGenLoading`, `ptGenError`。
- 原因：保持受控表单的一致性，便于后续校验与提交。

## 数据获取与清洗
- 触发时：校验 URL 非空→置加载态→调用 `PtGenService.ptGenControllerFetch({ url })`。
- 清洗规则：
  - 去除反引号与首尾空格（`poster/doubanLink/imdbLink` 等）。
  - `duration`：从“139分钟”提取数字 `139`；可回退为原始文本。
  - `awards`：维持为数组；UI 展示为多行文本时按行序列化。
  - 数组型字段保持原样（`region/genre/language/aka`）。
- 原因：返回数据存在格式化字符与装饰符，清洗后才能通过既有校验与显示。

## 字段映射与填充
- 原有字段：
  - `title` ← `chineseTitle`
  - `originalTitle` ← `foreignTitle`
  - `year` ← `year`
  - `poster` ← 清洗后的 `poster`
  - `genres` ← `genre`
  - `duration` ← 解析后分钟数或原文
  - `director` ← `director[].name` 聚合
  - `cast` ← `cast[].name` 聚合
  - `description` ← `introduction`
  - `rating` ← `doubanRatingAverage || imdbRatingAverage`
- 新增字段：
  - `awards` ← `awards`（数组）
  - `region` ← `region`（数组）
  - `language` ← `language`（数组）
  - `doubanLink` ← 清洗后的 `doubanLink`
  - `imdbLink` ← 清洗后的 `imdbLink`
  - `doubanRatingAverage` ← 解析为 `number`
  - `imdbRatingAverage` ← 解析为 `number`
- 策略：
  - 一次性批量更新；存在值则覆盖对应字段；缺失则跳过，不清空用户已填内容。
  - UI 中保留用户二次编辑能力。

## 校验与交互
- 保留既有 `validateFilmForm` 对原字段的校验；新增字段的前端校验：
  - `doubanLink`/`imdbLink`：基本 URL 校验。
  - `doubanRatingAverage`/`imdbRatingAverage`：范围 `0–10`，步进 `0.1`。
  - `region`/`language`：数组长度合理控制（如 ≤20）。
  - `awards`：非必填，可为多行文本。
- 失败时不阻断其他字段编辑；工具栏就近展示错误信息。

## 保存行为（当前版本）
- 不将新增字段提交到后端（受限于现有 `CreateFilmDto`/`UpdateFilmDto`）。
- 如需持久化，后续变更方案：扩展 DTO、服务与服务端；或临时将新增字段序列化并追加到 `description`（可配置开关）。

## 验证与回归
- 使用示例 Douban 链接测试：确认新增字段与原字段均被正确填充；校验通过后可保存（仅原字段生效）。
- 回归检查：编辑已有影片时（非创建）不显示 PT-Gen 工具栏；列表与筛选功能不受影响。

## 注释与维护
- 在清洗函数与映射函数处添加详细注释，解释规则与字段对应关系；在表单新增字段处注释用途与类型选择原因。