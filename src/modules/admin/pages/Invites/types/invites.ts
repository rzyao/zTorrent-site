/**
 * 邀请模块前端类型定义
 * 说明：后端统一响应壳为 { code, message, data, path, timestamp }，
 * 前端业务组件从 data 字段读取下述实体/DTO 对象。
 */

// 邀请记录的状态枚举（与后端约定保持一致）
export type InviteStatus = 'sent' | 'accepted' | 'expired' | 'revoked'

// 邀请类型枚举（与后端约定保持一致）
export type InviteType = 'private-invitation' | 'office-invitation'

// 邀请记录实体：用于列表页展示与操作
export interface InviteRecord {
  id: string // 记录ID（Snowflake 字符串）
  createdAt?: string // 创建时间
  inviterUserId?: string // 邀请发起人用户ID
  inviteeEmail?: string // 被邀请邮箱
  code?: string // 邀请码（页面遮挡显示）
  expiresAt?: string // 过期时间
  acceptedAt?: string | null // 接受时间
  quotaId?: string | null // 使用的名额ID（私人邀请）
  type?: InviteType // 邀请类型
  status?: InviteStatus // 当前状态
}

// 邀请名额实体：用于名额页展示
export interface InviteQuota {
  id: string // 名额ID
  userId?: string // 所属用户ID
  isPermanent?: boolean // 是否为永久名额
  expiresAt?: string | null // 名额过期时间
  consumedAt?: string | null // 名额消耗时间
  consumedRecordId?: string | null // 被哪个邀请记录消耗
}

// 列表筛选请求体：分页查询邀请记录
export interface ListInvitesDto {
  page: number // 页码（>=1）
  limit: number // 每页数量（>=1）
  status?: InviteStatus // 状态筛选
  type?: InviteType // 类型筛选
  email?: string // 被邀请邮箱
  issuerId?: string // 邀请发起人用户ID
  dateFrom?: string // 起始日期（YYYY-MM-DD 或 ISO）
  dateTo?: string // 结束日期（YYYY-MM-DD 或 ISO）
  sortBy?: 'createdAt' | 'expiresAt' | 'acceptedAt' // 排序字段
  order?: 'ASC' | 'DESC' // 排序方向
}

// 名额列表筛选请求体
export interface ListInviteQuotaDto {
  page: number
  limit: number
  userId?: string
  permanentOnly?: boolean
  activeOnly?: boolean
}

// 发送邀请请求体（私人与官方共用）
export interface SendInviteDto {
  email: string // 被邀请邮箱
  username: string // 邮件展示名
}

// 撤销邀请请求体
export interface RevokeInviteDto {
  recordId: string // 邀请记录ID
  reason?: string // 撤销原因
}

// 重发邀请请求体
export interface ResendInviteDto {
  recordId: string // 邀请记录ID
  email?: string // 可覆盖目标邮箱
}

// 统计请求体
export interface StatisticsDto {
  dateFrom: string // 起始日期
  dateTo: string // 结束日期
  granularity: 'day' | 'week' | 'month' // 统计粒度
  issuerId?: string // 发起人ID（可选）
}

// 导出请求体：复用列表筛选项 + 指定列
export interface ExportInvitesDto extends Omit<ListInvitesDto, 'page' | 'limit'> {
  columns?: string[] // 需要导出的列（可选）
}

