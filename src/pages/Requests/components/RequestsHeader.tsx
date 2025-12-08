// 无状态头部组件：仅负责页面顶部标题与说明的展示
// 提取原因：
// - 将视觉结构（Header）从页面容器中抽离，避免容器承担 UI 细节；
// - 组件保持纯展示，便于其他页面/场景复用；
// - 减少 RequestsPage.tsx 的 JSX 体量，提升可读性。

export function RequestsHeader() {
  return (
    <div className="bg-gradient-to-br from-amber-600/20 via-orange-600/20 to-amber-700/20 border-b border-amber-500/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-amber-50 mb-2">求种中心</h1>
        <p className="text-amber-200/70">发布您的资源需求，让社区帮您实现</p>
      </div>
    </div>
  );
}

