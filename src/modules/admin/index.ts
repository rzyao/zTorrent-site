/**
 * Admin 模块导出入口
 * 统一管理后台模块的公共导出
 */

// 布局组件
export { AdminLayout } from "./layouts/AdminLayout";
export { AdminSidebar } from "./layouts/AdminSidebar";

// 页面组件 (懒加载时使用 componentRegistry，这里仅供直接导入)
export { default as RouteManagePage } from "./pages/system/routes";
