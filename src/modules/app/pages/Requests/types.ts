// 类型文件：用于集中管理“求种中心”页面的选项卡相关类型定义
// 设计原因：
// - 将类型从组件中抽离，保证 UI 层与数据结构的解耦；
// - 统一 TabView 枚举与 Tab 元数据结构，便于复用与类型校验；
// - 后续若新增标签或变更结构，只需修改此处即可，减少散落修改。

import type { LucideIcon } from 'lucide-react';

// TabView 表示当前页面支持的视图枚举
// 说明：保持与原始实现一致的字符串联合类型，不做旧代码兼容转换
export type TabView = 'hall' | 'my-requests' | 'my-responses' | 'moderation' | 'create';

// TabMeta 描述一个选项卡的所有展示所需元数据
// 字段含义：
// - id: 唯一标识，同时对应路由/视图切换依据
// - label: 标签文案
// - icon: lucide-react 图标组件（类型安全）
// - adminOnly: 是否仅管理员可见（默认非必须，便于通用复用）
export interface TabMeta {
  id: TabView;
  label: string;
  icon: LucideIcon;
  adminOnly?: boolean;
}

// 说明：此文件仅包含类型，不含业务逻辑或 UI；
// 保持“数据层”职责清晰，方便其他模块按需引入。

