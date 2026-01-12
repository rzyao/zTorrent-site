import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AdminLayout } from "./layouts/AdminLayout";
import { AppToaster } from "@/modules/app/components/ui/sonner";
import { GlobalLoader } from "@/modules/app/components/ui/GlobalLoader";
import { AccessProvider } from "@/context/AccessContext";
import { UserSummaryProvider } from "@/modules/app/context/UserSummaryContext";
import { DownloadersProvider } from "@/modules/app/context/DownloadersContext";
import { Suspense, lazy } from "react";
import { RouteProgressBar } from "@/modules/app/components/ui/RouteProgressBar";

// 简单的 404 页面
const NotFound = () => <div className="p-8 text-center text-gray-500">页面未找到 (Dev Mode)</div>;

import { useNavigate } from "react-router-dom";
const LoginPage = lazy(() => import("@/modules/app/pages/Login"));

/**
 * 登录页面包装器 (Admin Dev)
 */
function LoginPageWrapper() {
  const navigate = useNavigate();
  const search = typeof window !== "undefined" ? window.location.search : "";
  const params = new URLSearchParams(search);
  const isLoggedIn = typeof window !== "undefined" && !!localStorage.getItem("accessToken");
  const from = params.get("from") || "/admin";

  if (isLoggedIn) {
    return <Navigate to={from} replace />;
  }

  return (
    <LoginPage
      onForgotPassword={() => {}}
      onRegister={() => {}}
      onLoginSuccess={() => navigate(from)}
      onTestApi={() => {}}
    />
  );
}

// 模拟动态加载组件
import { useDynamicRouteElements } from "@/routes/DynamicRoutes";

function AdminRoutesRenderer() {
  const { routeElements, isLoading } = useDynamicRouteElements();
  const isLoggedIn = !!localStorage.getItem("accessToken");

  if (isLoading) {
    return <RouteProgressBar />;
  }

  // 未登录时的路由配置
  if (!isLoggedIn) {
    return (
      <Routes>
        <Route path="/login" element={<LoginPageWrapper />} />
        {/* 任何其他路径都重定向到登录页 */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    );
  }

  // 登录后的路由配置
  return (
    <Routes>
      <Route path="/login" element={<LoginPageWrapper />} />
      <Route path="/" element={<Navigate to="/admin" replace />} />
      {routeElements}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export function AdminDevApp() {
  return (
    <BrowserRouter>
      <AccessProvider>
        <UserSummaryProvider>
          <DownloadersProvider>
            <GlobalLoader />
            <AppToaster />
            <Suspense fallback={<RouteProgressBar />}>
              <AdminRoutesRenderer />
            </Suspense>
          </DownloadersProvider>
        </UserSummaryProvider>
      </AccessProvider>
    </BrowserRouter>
  );
}
