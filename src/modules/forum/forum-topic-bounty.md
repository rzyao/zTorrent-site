# Forum Topic 悬赏功能（前端开发文档）

本文档面向前端开发，描述论坛 Topic 悬赏功能的业务流程、规则、状态机、UI 建议与后端接口契约（请求/响应/错误码）。\n
## 1. 背景与目标

悬赏功能用于鼓励高质量回复：\n
- 话题作者可使用“魔力值”设置悬赏金额与期限。\n
- 作者可对某条回复进行“采纳”，把奖金发放给该回复作者。\n
- 若超期未采纳，则奖金会由“回复者”平分（自动执行）。\n
- 作者如需取消悬赏，必须提交取消申请，由管理员审核通过后才会退回预占资金。\n
## 2. 关键概念与字段

### 2.1 悬赏数据结构（Topic.bounty）

Topic 详情与列表接口会返回 `topic.bounty`（如果该话题设置了悬赏）。\n
字段来源：后端实体 [ForumTopicBounty](file:///c:/project/zTorrent/src/community/forums/entities/forum-topic-bounty.entity.ts)。\n
核心字段（前端必须关心）：\n
- `id`: 悬赏记录 ID\n
- `topicId`: 话题 ID\n
- `sponsorUserId`: 悬赏发起人（通常等于 Topic.authorId）\n
- `amount`: 悬赏金额（字符串 bigInt）\n
- `expiresAt`: 到期时间（ISO 时间）\n
- `status`: 悬赏状态（见 2.2）\n
- `cancelRequestStatus`: 取消申请状态（见 2.3）\n
- `cancelRequestedAt / cancelRequestReason`: 取消申请信息\n
- `winnerPostId / winnerUserId / awardedAt`: 采纳信息\n
- `expiredAt / expiredPayoutUserCount / expiredPayoutPerUser`: 到期平分统计（用于展示“已到期平分”结果）\n
\n
> 注意：金额字段全部按字符串处理（bigint），前端显示/输入需要做正整数校验；计算剩余时间时用 `expiresAt` 与当前时间。\n
### 2.2 悬赏状态（status）

对应枚举：`ForumTopicBountyStatus`。\n
- `open`：悬赏进行中，可采纳，可提交取消申请\n
- `awarded`：已采纳并发放奖金，流程结束\n
- `expired`：已到期自动平分/退回（无回复者时退回），流程结束\n
- `canceled`：管理员审核通过后取消，流程结束\n
\n
### 2.3 取消申请状态（cancelRequestStatus）

对应枚举：`ForumTopicBountyCancelRequestStatus`。\n
- `none`：未提交取消申请\n
- `pending`：已提交取消申请，等待管理员审核\n
- `approved`：管理员已同意取消（此时 `status` 应为 `canceled`）\n
- `rejected`：管理员已拒绝取消（此时通常 `status` 仍为 `open`，悬赏继续有效）\n
\n
## 3. 业务流程与规则（前端行为建议）

### 3.1 设置悬赏（作者）

触发入口：Topic 详情页，作者可见“设置悬赏”按钮。\n
前置校验（前端可做体验优化，最终以服务端为准）：\n
- 当前用户是 Topic 作者\n
- 话题未归档（`topic.isArchived !== true`）\n
- 话题尚未设置悬赏（`topic.bounty == null`）\n
\n
输入：\n
- `amount`（正整数，字符串）\n
- `expiresAt` 或 `durationDays`（二选一）\n
\n
后端资金逻辑（用于前端文案解释）：\n
- 设置悬赏时不会立刻扣掉余额，会把对应金额计入“预占（lockedBalance）”，保证后续能发放。\n
\n
成功后：\n
- 刷新 Topic 详情（接口返回的 Topic 已包含 bounty）\n
- UI 显示“悬赏金额 / 截止时间 / 剩余时间”\n
\n
### 3.2 采纳并发放（作者）

触发入口：Topic 详情页的回复列表（post 列表），作者在某条回复上点击“采纳”。\n
规则：\n
- 仅当 `topic.bounty.status === 'open'` 且 `cancelRequestStatus !== 'pending'` 且未到期时可采纳\n
- 被采纳的回复必须属于该 Topic，且未删除\n
- 禁止采纳自己（后端强制：winnerUserId != sponsorUserId）\n
\n
成功后：\n
- 刷新 Topic 详情（bounty 会变为 `awarded` 并带回 `winnerPostId/winnerUserId/awardedAt`）\n
- UI 建议：\n
  - 在被采纳回复上显示“已采纳”标识\n
  - 悬赏信息区显示“已发放”状态与发放时间\n
\n
### 3.3 提交取消申请（作者，需审核）

触发入口：Topic 详情页悬赏信息区，作者点击“申请取消悬赏”。\n
规则：\n
- 只允许 `status=open` 的悬赏提交申请\n
- 提交申请不会立即退回金额，仅记录申请状态 `pending`\n
\n
成功后：\n
- 刷新 Topic 详情\n
- UI 建议：\n
  - 悬赏区显示“取消审核中”\n
  - 禁止再进行“采纳发放”（后端会拒绝）\n
\n
### 3.4 管理员审核取消申请（后台）

管理端入口：需要管理员权限 `forum:admin:topic:*`。\n
流程：\n
- 管理员查看取消申请列表（默认筛选 pending）\n
- 对单条申请进行 approve / reject\n
\n
审核结果：\n
- approve：释放预占，悬赏结束（`status=canceled`，`cancelRequestStatus=approved`）\n
- reject：悬赏继续（`status` 通常仍为 `open`，`cancelRequestStatus=rejected`）\n
\n
### 3.5 到期自动平分（系统）

后端每 5 分钟扫描一次已到期且仍为 open 的悬赏，并执行到期处理。\n
“回复者”定义（当前实现）：\n
- 属于该 Topic 的回复（`floor >= 2`）\n
- 回复未软删\n
- 以作者维度去重（同一用户多条回复只算 1 人）\n
- 默认排除 Topic 作者本人\n
\n
平分规则：\n
- 设悬赏总额为 `amount`，回复者人数为 `N`\n
- 每人基础分配：`base = floor(amount / N)`\n
- 余数：`remainder = amount - base * N`\n
- 余数分配策略：按“最早回复时间”升序，前 `remainder` 个用户每人额外 +1\n
\n
特殊情况：\n
- 若 `N=0`（没有有效回复者）：直接释放预占（相当于退回），并标记为 expired\n
- 若到期时仍存在 `cancelRequestStatus=pending`：会被系统自动标记为 `rejected`，并写入备注“悬赏已到期自动处理，取消申请失效”\n
\n
前端表现：\n
- 前端无需主动触发到期，依赖后端定时任务。\n
- 建议在详情页做“到期后状态刷新”：\n
  - 进入页面时正常请求详情\n
  - 若 `status=open` 且当前时间已超过 `expiresAt`，可每隔 30-60 秒轮询一次详情，直到状态变为 `expired` 或 `awarded`（减少用户感知延迟）\n
\n
### 3.6 追加悬赏（作者）\n
\n
触发入口：Topic 详情页右侧扳手菜单（作者可见）中的“追加悬赏”。\n
\n
前置校验（前端体验优化，最终以服务端为准）：\n
- 当前用户是 Topic 作者\n
- 话题未归档（`topic.isArchived !== true`）\n
- 已存在悬赏且 `topic.bounty.status === 'open'`\n
- 取消申请不在审核中（`topic.bounty.cancelRequestStatus !== 'pending'`）\n
\n
输入：\n
- `amountDelta`（正整数字符串，最低建议 2000、按百位递增；UI 提示）\n
\n
前端行为与文案建议：\n
- 表单仅包含“追加金额”一项，提交后弹出成功提示并刷新 Topic 详情\n
- 刷新后：标题右侧的“悬赏 金额”徽标数值应实时更新\n
- 错误码映射：\n
  - `4052` 状态不允许 → 提示“当前状态不支持该操作”并刷新详情\n
  - `4053` 取消审核中 → 提示“取消审核中，暂不可追加”\n
  - `4055` 悬赏已到期 → 提示“悬赏已到期，等待系统平分/已平分”\n
  - `5020` 可用余额不足 → 提示“魔力值不足”并引导充值/赚取\n
\n
成功后：\n
- 后端仅“预占 lockedBalance”，不会立刻扣减实际余额；真正扣款仍在采纳发放或到期平分时发生\n
- 返回最新 Topic 详情对象（包含更新后的 `bounty.amount`）\n
\n
## 4. 接口契约（后端）

### 4.1 统一响应结构

系统统一返回结构： [UnifiedResponseDto](file:///c:/project/zTorrent/src/common/dto/unified-response.dto.ts)\n
```json
{
  \"code\": 1000,
  \"message\": \"ok\",
  \"data\": {},
  \"path\": \"/api/forums/topics/bounty/set\",
  \"timestamp\": \"2026-01-17T00:00:00.000Z\"
}
```\n
当 `code != 1000` 时表示业务失败，HTTP 通常仍为 200。\n
### 4.2 设置悬赏（作者）

- Method：POST\n
- Path：`/forums/topics/bounty/set`\n
- Auth：需要登录（JWT）\n
- Body： [SetTopicBountyDto](file:///c:/project/zTorrent/src/community/forums/topics/dto/set-topic-bounty.dto.ts)\n
```json
{
  \"topicId\": \"175123456789012345\",
  \"amount\": \"1000\",
  \"durationDays\": 7
}
```\n
或：\n
```json
{
  \"topicId\": \"175123456789012345\",
  \"amount\": \"1000\",
  \"expiresAt\": \"2026-01-20T12:00:00.000Z\"
}
```\n
成功返回：`data` 为 Topic 详情对象（包含 `bounty`）。\n
\n
### 4.3 提交取消申请（作者，需审核）

- Method：POST\n
- Path：`/forums/topics/bounty/cancel-request`\n
- Auth：需要登录（JWT）\n
- Body： [CancelTopicBountyRequestDto](file:///c:/project/zTorrent/src/community/forums/topics/dto/cancel-topic-bounty-request.dto.ts)\n
```json
{
  \"topicId\": \"175123456789012345\",
  \"reason\": \"误操作\"
}
```\n
成功返回：Topic 详情对象（包含 `bounty.cancelRequestStatus=pending`）。\n
\n
### 4.4 采纳发放（作者）

- Method：POST\n
- Path：`/forums/topics/bounty/award`\n
- Auth：需要登录（JWT）\n
- Body： [AwardTopicBountyDto](file:///c:/project/zTorrent/src/community/forums/topics/dto/award-topic-bounty.dto.ts)\n
```json
{
  \"topicId\": \"175123456789012345\",
  \"postId\": \"175223456789012345\"
}
```\n
成功返回：Topic 详情对象（包含 `bounty.status=awarded`、`winnerPostId/winnerUserId/awardedAt`）。\n
\n
### 4.5 追加悬赏金额（作者）
\n
- Method：POST\n
- Path：`/forums/topics/bounty/increase`\n
- Auth：需要登录（JWT）\n
- Body： [IncreaseTopicBountyDto](file:///c:/project/zTorrent/src/community/forums/topics/dto/increase-topic-bounty.dto.ts)\n
```json
{
  \"topicId\": \"175123456789012345\",
  \"amountDelta\": \"500\"
}
```\n
\n
规则：\n
- 仅作者可操作\n
- 仅 `bounty.status=open` 且未到期且不在取消审核中（cancelRequestStatus!=pending）时允许追加\n
- 追加时同样只做“预占 lockedBalance”，不会立刻扣除 balance；真正扣款仍在“采纳发放/到期平分”发生\n
\n
成功返回：Topic 详情对象（包含更新后的 `bounty.amount`）。\n
\n
### 4.6 管理员：取消申请列表

- Method：POST\n
- Path：`/forums/topics/admin/bounty/cancel-requests/list`\n
- Auth：需要登录 + 权限 `forum:admin:topic:*`\n
- Body： [AdminListTopicBountyCancelRequestsDto](file:///c:/project/zTorrent/src/community/forums/topics/dto/admin-list-topic-bounty-cancel-requests.dto.ts)\n
```json
{
  \"page\": 1,
  \"limit\": 20,
  \"cancelRequestStatus\": \"pending\"
}
```\n
成功返回：\n
```json
{
  \"items\": [
    {
      \"id\": \"...bountyId\",
      \"topicId\": \"...\",\n
      \"amount\": \"1000\",\n
      \"cancelRequestStatus\": \"pending\",\n
      \"topic\": { \"id\": \"...\", \"title\": \"...\" }\n
    }
  ],\n
  \"total\": 1,\n
  \"page\": 1,\n
  \"limit\": 20\n
}
```\n
\n
### 4.7 管理员：审核取消申请

- Method：POST\n
- Path：`/forums/topics/admin/bounty/cancel-requests/review`\n
- Auth：需要登录 + 权限 `forum:admin:topic:*`\n
- Body： [AdminReviewTopicBountyCancelRequestDto](file:///c:/project/zTorrent/src/community/forums/topics/dto/admin-review-topic-bounty-cancel-request.dto.ts)\n
```json
{
  \"topicId\": \"175123456789012345\",
  \"action\": \"approve\",
  \"note\": \"同意取消\"
}
```\n
成功返回：Topic 详情对象（包含最新 bounty 状态）。\n
\n
## 5. 错误码与前端提示建议

错误码定义： [error-codes.ts](file:///c:/project/zTorrent/src/common/constants/error-codes.ts)\n
前端建议按错误码映射到稳定的 UI 提示/交互：\n
\n
### 5.1 悬赏相关（4xxx）

- `4050 TOPIC_BOUNTY_ALREADY_EXISTS`：已设置悬赏（禁用设置按钮，提示“已存在悬赏”）\n
- `4051 TOPIC_BOUNTY_NOT_FOUND`：未设置悬赏（隐藏采纳/取消入口）\n
- `4052 TOPIC_BOUNTY_STATUS_INVALID`：状态不允许（通常提示“当前状态不支持该操作”并刷新详情）\n
- `4053 TOPIC_BOUNTY_CANCEL_PENDING`：取消审核中（禁用采纳按钮，提示“取消审核中”）\n
- `4054 TOPIC_BOUNTY_SELF_AWARD_FORBIDDEN`：禁止给自己发（提示并阻止）\n
- `4055 TOPIC_BOUNTY_EXPIRED`：已到期（提示“悬赏已到期，等待系统平分/已平分”）\n
\n
### 5.2 余额相关（5xxx）

- `5020 BOUNTY_INSUFFICIENT`：可用余额不足（提示“魔力值不足”并引导充值/赚取）\n
- `5001 BALANCE_INSUFFICIENT`：扣减后余额不足（一般不应发生，提示并刷新余额）\n
\n
### 5.3 通用（9xxx）

- `9401 UNAUTHORIZED`：未登录（跳转登录）\n
- `9403 FORBIDDEN`：无权限（提示“无权限”）\n
- `9404 NOT_FOUND`：资源不存在（提示“话题/回复不存在”）\n
\n
## 6. UI/交互建议（推荐落地）

### 6.1 Topic 列表卡片

- 若 `topic.bounty?.status === 'open'`：展示“悬赏”徽标 + 金额\n
- 若 `status === 'awarded'`：展示“已采纳”徽标\n
- 若 `status === 'expired'`：展示“已到期”徽标\n
\n
### 6.2 Topic 详情页悬赏区块

展示：金额、截止时间、剩余时间、状态文案。\n
按钮逻辑：\n
- 作者且 bounty 不存在：显示“设置悬赏”\n
- 作者且 status=open 且 cancelRequestStatus=none/rejected：显示“申请取消”“采纳入口（在回复处）”\n
- status=open 且 cancelRequestStatus=pending：显示“取消审核中（禁用）”，隐藏/禁用采纳\n
- status=awarded：显示获奖信息（可定位到 winnerPostId）\n
- status=expired：显示“已到期平分”，可展示 `expiredPayoutUserCount/expiredPayoutPerUser`\n
- status=canceled：显示“已取消”\n
\n
### 6.3 轮询刷新策略

若详情页显示 `status=open` 但当前时间已超过 `expiresAt`：\n
- 建议启动轻量轮询（30-60s）刷新详情，直到状态变化。\n
- 原因：后端到期任务是 5 分钟粒度，轮询可让用户更快看到最终结果。\n
\n
### 6.4 扳手菜单操作（作者）\n
\n
- 设置悬赏：仅在话题未归档且未设置悬赏时显示；`status=open` 时不支持再次设置\n
- 追加悬赏：在 `status=open` 时显示；仅输入追加金额 `amountDelta`\n
- 取消悬赏：在 `status=open` 且 `cancelRequestStatus!==pending` 时显示，提交取消申请（需管理员审核）\n
- 提示与禁用：依据错误码/状态判断进行禁用与提示（见 5.1/5.2）\n
\n
## 7. 相关源码定位

- Controller 路由： [topics.controller.ts](file:///c:/project/zTorrent/src/community/forums/topics/topics.controller.ts)\n
- 业务实现： [topic-bounty.service.ts](file:///c:/project/zTorrent/src/community/forums/topics/topic-bounty.service.ts)\n
- Topic 返回包含 bounty： [topics.service.ts](file:///c:/project/zTorrent/src/community/forums/topics/topics.service.ts)\n
- 错误码： [error-codes.ts](file:///c:/project/zTorrent/src/common/constants/error-codes.ts)\n
