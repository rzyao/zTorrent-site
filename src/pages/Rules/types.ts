/**
 * 规则页类型定义
 *
 * 说明：将页面中使用的结构化数据类型集中到该文件，便于复用与维护。
 */
export interface RuleContent {
  /** 小节标题 */
  title: string;
  /** 描述文本 */
  description: string;
  /** 列表项（可选） */
  items?: string[];
  /** 警告文案（可选） */
  warning?: string;
}

export interface RuleSection {
  /** 章节唯一标识 */
  id: string;
  /** 章节标题 */
  title: string;
  /** 章节内的内容块 */
  content: RuleContent[];
}

