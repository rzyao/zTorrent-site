/**
 * 应用路由入口
 * 使用动态路由系统
 */
import { lazy, Suspense, useEffect } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { FullScreenLoader } from "@/modules/app/components/ui/FullScreenLoader";
import { useDynamicRouteElements } from "./DynamicRoutes";
import { useGlobalLoader } from "@/stores/globalLoaderStore";

// 公开页面（无需登录）
const LoginPage = lazy(() => import("@/modules/app/pages/Login"));
const Register = lazy(() => import("@/modules/app/pages/Register"));
const ForgotPasswordPage = lazy(() => import("@/modules/app/pages/ForgotPassword"));

/**
 * 登录页面包装器
 */
function LoginPageWrapper() {
  const navigate = useNavigate();
  const search = typeof window !== "undefined" ? window.location.search : "";
  const params = new URLSearchParams(search);
  const isLoggedIn = typeof window !== "undefined" && !!localStorage.getItem("accessToken");
  const from = params.get("from") || "/app/home";

  if (isLoggedIn) {
    return <Navigate to={from.startsWith("/app") ? from : "/app/home"} replace />;
  }

  return (
    <LoginPage
      onForgotPassword={() => navigate("/forgot-password")}
      onRegister={() => navigate("/register")}
      onLoginSuccess={() => navigate(from)}
      onTestApi={() => navigate("/api-test")}
    />
  );
}

/**
 * 注册页面包装器
 */
function RegisterPageWrapper() {
  const navigate = useNavigate();
  return (
    <Register onBack={() => navigate("/login")} onRegisterSuccess={() => navigate("/login")} />
  );
}

/**
 * 忘记密码页面包装器
 */
function ForgotPasswordPageWrapper() {
  const navigate = useNavigate();
  return <ForgotPasswordPage onBack={() => navigate("/login")} />;
}

/**
 * 路由配置加载指示器
 */
function RouteConfigLoader() {
  const { startLoading, finishLoading } = useGlobalLoader();
  useEffect(() => {
    startLoading();
    return () => finishLoading();
  }, [startLoading, finishLoading]);
  return null;
}

/**
 * 应用路由主组件
 */
export default function AppRoutes() {
  const { routeElements, isLoading } = useDynamicRouteElements();

  // 路由配置加载中
  if (isLoading) {
    return <RouteConfigLoader />;
  }

  return (
    <Suspense fallback={<FullScreenLoader />}>
      <Routes>
        {/* 公开路由：登录、注册、忘记密码 */}
        <Route path="/login" element={<LoginPageWrapper />} />
        <Route path="/register" element={<RegisterPageWrapper />} />
        <Route path="/forgot-password" element={<ForgotPasswordPageWrapper />} />
        <Route path="/" element={<Navigate to="/app/home" replace />} />

        {/* 动态路由：所有受保护页面（包括 Admin） */}
        {routeElements}

        {/* 404 回退 */}
        <Route path="*" element={<NotFoundRedirect />} />
      </Routes>
    </Suspense>
  );
}

// 懒加载 404 页面
const NotFoundPage = lazy(() => import("@/modules/app/pages/NotFoundPage"));

function NotFoundRedirect() {
  const location = window.location;
  const isLoggedIn = !!localStorage.getItem("accessToken");

  if (!isLoggedIn) {
    const from = location.pathname + location.search;
    return <Navigate to={`/login?from=${encodeURIComponent(from)}`} replace />;
  }

  // 显示 404 页面而非重定向
  return <NotFoundPage />;
}
