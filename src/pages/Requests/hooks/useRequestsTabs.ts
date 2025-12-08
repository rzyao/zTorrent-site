// 自定义 Hook：集中管理“求种中心”页面的选项卡逻辑状态
// 设计原因：
// - 将状态管理（当前激活标签、管理员标记、可见标签集合）从页面组件中抽离；
// - UI 组件保持无状态，只通过 props 接收数据与回调，提升可复用性与可测试性；
// - 后续若引入权限/服务端数据驱动标签，可在此处统一扩展逻辑。

import { useState } from 'react';
import { Bell, Award, CheckCircle, Shield, PlusCircle } from 'lucide-react';
import type { TabMeta, TabView } from '@/pages/Requests/types';

// 默认管理员开关仅用于示例，真实项目应从用户上下文/权限接口获取
export function useRequestsTabs(initialIsAdmin: boolean = true) {
  // 当前激活的标签视图
  const [activeTab, setActiveTab] = useState<TabView>('hall');

  // 是否为管理员（示例常量）；
  // 若后续改为动态权限，请将此状态迁移为从外部 Context/接口读取。
  const [isAdmin] = useState<boolean>(initialIsAdmin);

  // 全量标签元数据定义：仅承载展示所需信息，不含业务逻辑
  const allTabs: TabMeta[] = [
    { id: 'hall', label: '求种大厅', icon: Bell, adminOnly: false },
    { id: 'my-requests', label: '我的求种', icon: Award, adminOnly: false },
    { id: 'my-responses', label: '我的应答', icon: CheckCircle, adminOnly: false },
    { id: 'moderation', label: '仲裁中心', icon: Shield, adminOnly: true },
    { id: 'create', label: '发布求种', icon: PlusCircle, adminOnly: false },
  ];

  // 可见标签：根据管理员权限过滤
  const visibleTabs = allTabs.filter(tab => !tab.adminOnly || isAdmin);

  // 返回给 UI 层的最小必要数据与操作符
  return {
    activeTab,
    setActiveTab,
    isAdmin,
    visibleTabs,
    allTabs,
  };
}

// 使用说明：
// - 页面容器调用 useRequestsTabs()，将返回的 activeTab/visibleTabs 下发给无状态 UI 组件；
// - UI 组件通过 onChange 回调触发 setActiveTab，完成视图切换；
// - 若后续需要基于权限动态增删标签，仅需改动 allTabs/过滤逻辑。

