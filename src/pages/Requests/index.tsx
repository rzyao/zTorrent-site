// 页面容器组件：组合已拆分的无状态 UI 组件与自定义 Hook
// 重构说明：
// - 原页面的“头部、标签导航、内容区域”被拆分为独立的纯展示组件；
// - 业务状态（activeTab、isAdmin、visibleTabs）收敛到自定义 Hook；
// - 页面只负责整体布局与组件拼装，提升可维护性与扩展性。

import type { TabView } from '@/pages/Requests/types';
import { useRequestsTabs } from '@/pages/Requests/hooks/useRequestsTabs';
import { RequestsHeader } from '@/pages/Requests/components/RequestsHeader';
import { RequestsTabs } from '@/pages/Requests/components/RequestsTabs';
import { RequestsContent } from '@/pages/Requests/components/RequestsContent';

export function RequestsPage() {
  // 使用自定义 Hook 管理选项卡相关状态与数据源
  const { activeTab, setActiveTab, visibleTabs } = useRequestsTabs();

  return (
    <div className="min-h-screen bg-[#0F171E] pt-16">
      {/* 头部：纯展示组件，承载标题与说明文案 */}
      <RequestsHeader />

      {/* 标签导航：纯展示组件，接收 activeTab/tabs 与 onChange 回调 */}
      <RequestsTabs
        activeTab={activeTab as TabView}
        tabs={visibleTabs}
        onChange={setActiveTab}
      />

      {/* 内容区域：根据 activeTab 渲染具体子页面 */}
      <RequestsContent activeTab={activeTab as TabView} />
    </div>
  );
}
