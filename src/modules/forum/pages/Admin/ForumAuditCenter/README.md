# 论坛审核中心（ForumAuditCenter）

## 目的
- 在论坛模块内统一承载“举报审核”和“悬赏取消申请审核”，遵守模块边界与论坛自有 UI 规范。
- 通过统一筛选、队列表格与详情抽屉提升审核效率；支持后续扩展更多论坛域审核类型。

## 路由与入口
- 路由：`/forum/admin/audit-center`
- 注册位置：`src/routes/forumRoutes.tsx`
- 侧边栏入口：`src/modules/forum/layouts/Sidebar/SidebarNav.tsx`，管理员/版主可见

## 组件结构
- `index.tsx`：页面容器，包含筛选栏、队列表格、分页与详情抽屉
- 复用论坛 UI：`Button`、`Select`、`Table`、`Drawer` 等

## 数据与接口映射
- 举报审核（Reports）
  - 列表查询：`ForumsReportsService.reportsControllerFindAll`
    - 请求：`QueryReportDto { page, limit, status?, keyword? }`
    - 响应：`{ items: ForumReport[], total, page, limit }`
    - 适配：为每项补齐 `id`（兼容不同返回字段）
  - 处理动作：`ForumsReportsService.reportsControllerHandle`
    - 请求：`HandleReportDto { reportId, status, handlerNote?, deleteContent?, lockTopic? }`
    - 备注：`status ∈ { RESOLVED, REJECTED }`
- 悬赏取消申请审核（Bounty Cancel）
  - 列表查询：`ForumsTopicsService.topicsControllerAdminListCancelRequests`
    - 请求：`AdminListTopicBountyCancelRequestsDto { page, limit, cancelRequestStatus? }`
    - 响应：`{ items, total, page, limit }`
    - 适配：为每项补齐 `id`（兼容不同返回字段）
  - 审核动作：`ForumsTopicsService.topicsControllerAdminReviewCancelRequest`
    - 请求：`AdminReviewTopicBountyCancelRequestDto { topicId, action, note? }`
    - 备注：`action ∈ { APPROVE, REJECT }`

## 权限
- 页面需管理员或版主角色：`admin` / `moderator`
- 接口权限由后端控制，前端在无权限时显示提示

## 扩展点
- 可新增论坛域其他审核类型（如未来的帖子审核队列），通过新增 hook 与表格列适配集成到同一页面
- 对长列表可接入虚拟滚动与更丰富筛选条件（日期、目标类型等）

