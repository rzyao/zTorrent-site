/**
 * 管理后台路由配置
 * 独立于主路由，使用 AdminLayout 布局
 */
import { Route, Navigate } from "react-router-dom";
import { lazy } from "react";
import { AuthRoute, PermissionRoute } from "./guards";
import { AdminLayout } from "@/layouts/AdminLayout";

// 后台页面懒加载
const ReportsPage = lazy(() => import("@/pages/Reports/index.tsx"));
const ReviewPage = lazy(() => import("@/pages/Review/index.tsx"));
const TicketsPage = lazy(() => import("@/pages/Tickets/TicketsPage.tsx"));

/**
 * 管理后台路由组件
 * 使用 AdminLayout 作为布局容器
 */
export function AdminRoutes() {
  return (
    <Route
      path="/admin"
      element={
        <AuthRoute>
          <AdminLayout />
        </AuthRoute>
      }
    >
      <Route
        path="reports"
        element={
          <PermissionRoute requiredPermissions={["reports"]} name="举报管理">
            <ReportsPage />
          </PermissionRoute>
        }
      />
      <Route
        path="review"
        element={
          <PermissionRoute requiredPermissions={["review"]} name="审核">
            <ReviewPage />
          </PermissionRoute>
        }
      />
      <Route
        path="tickets"
        element={
          <PermissionRoute requiredPermissions={["tickets"]} name="工单">
            <TicketsPage />
          </PermissionRoute>
        }
      />
      {/* 仪表盘占位 */}
      <Route
        path="dashboard"
        element={<div className="p-8 text-white">Admin Dashboard Coming Soon</div>}
      />
      <Route index element={<Navigate to="/admin/dashboard" replace />} />
    </Route>
  );
}
