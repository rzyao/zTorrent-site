import type { SelectProps } from 'antd'

/**
 * 工单状态文案与颜色映射
 * 原因：统一展示文案与颜色标签，避免各页面重复硬编码
 */
export const statusText: Record<string, string> = {
  pending: '待处理',
  processing: '处理中',
  resolved: '已解决',
  closed: '已关闭',
}
export const statusColor: Record<string, string> = {
  pending: 'blue',
  processing: 'gold',
  resolved: 'green',
  closed: 'default',
}
export const statusOptions: SelectProps['options'] = [
  { value: 'pending', label: statusText.pending },
  { value: 'processing', label: statusText.processing },
  { value: 'resolved', label: statusText.resolved },
  { value: 'closed', label: statusText.closed },
]

/** 工单类别映射 */
export const categoryText: Record<string, string> = {
  technical: '技术问题',
  account: '账号问题',
  resource: '资源问题',
  report: '举报投诉',
  other: '其他',
}
export const categoryOptions: SelectProps['options'] = [
  { value: 'technical', label: categoryText.technical },
  { value: 'account', label: categoryText.account },
  { value: 'resource', label: categoryText.resource },
  { value: 'report', label: categoryText.report },
  { value: 'other', label: categoryText.other },
]

/** 优先级映射 */
export const priorityText: Record<string, string> = {
  low: '低',
  normal: '普通',
  high: '高',
  urgent: '紧急',
}
export const priorityColor: Record<string, string> = {
  low: 'default',
  normal: 'blue',
  high: 'orange',
  urgent: 'red',
}
export const priorityOptions: SelectProps['options'] = [
  { value: 'low', label: priorityText.low },
  { value: 'normal', label: priorityText.normal },
  { value: 'high', label: priorityText.high },
  { value: 'urgent', label: priorityText.urgent },
]

