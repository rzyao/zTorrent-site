// 无状态内容容器组件：根据 activeTab 渲染对应功能子页面
// 设计原因：
// - 将内容选择（switch）集中为单一职责组件，页面容器只负责布局与组合；
// - 不引入自身状态，保持纯展示；
// - 遵循“不要修改子页面”要求，仅进行选择与挂载。

import type { TabView } from '@/pages/Requests/types';
import { RequestsHall } from '@/pages/Requests/components/RequestsHall';
import { MyRequests } from '@/pages/Requests/components/MyRequests';
import { MyResponses } from '@/pages/Requests/components/MyResponses';
import { ModerationCenter } from '@/pages/Requests/components/ModerationCenter';
import { CreateRequest } from '@/pages/Requests/components/CreateRequest';

interface RequestsContentProps {
  activeTab: TabView;
}

export function RequestsContent({ activeTab }: RequestsContentProps) {
  // 根据当前激活的标签选择渲染组件
  const renderContent = () => {
    switch (activeTab) {
      case 'hall':
        return <RequestsHall />;
      case 'my-requests':
        return <MyRequests />;
      case 'my-responses':
        return <MyResponses />;
      case 'moderation':
        return <ModerationCenter />;
      case 'create':
        return <CreateRequest />;
      default:
        // 兜底：任何未知值默认回退到“求种大厅”，避免页面空白
        return <RequestsHall />;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {renderContent()}
    </div>
  );
}

