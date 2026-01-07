// 全局消息实例：用于在 React 组件树外部（如 API 拦截器）安全调用 message
// 原因：静态 import { message } from 'antd' 无法获取 ConfigProvider 的上下文，会触发警告
// 解决：在 App 组件挂载时注入动态实例，模块级代码使用该实例

import type { MessageInstance } from 'antd/es/message/interface'

let messageInstance: MessageInstance | null = null

export function setMessageInstance(instance: MessageInstance) {
  messageInstance = instance
}

export function getMessageInstance(): MessageInstance | null {
  return messageInstance
}

// 便捷方法：安全调用 message，如果实例未注入则静默失败
export const globalMessage = {
  success: (content: string) => messageInstance?.success(content),
  error: (content: string) => messageInstance?.error(content),
  warning: (content: string) => messageInstance?.warning(content),
  info: (content: string) => messageInstance?.info(content),
}
