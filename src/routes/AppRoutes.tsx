/**
 * 应用路由入口
 * 使用动态路由系统
 */
import { lazy, Suspense } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { FullScreenLoader } from "@/components/ui/FullScreenLoader";
import { DynamicRoutes } from "./DynamicRoutes";

// 公开页面（无需登录）
const LoginPage = lazy(() => import("@/pages/Login"));
const Register = lazy(() => import("@/pages/Register"));
const ForgotPasswordPage = lazy(() => import("@/pages/ForgotPassword"));

/**
 * 登录页面包装器
 */
function LoginPageWrapper() {
  const navigate = useNavigate();
  const search = typeof window !== "undefined" ? window.location.search : "";
  const params = new URLSearchParams(search);
  const from = params.get("from") || "/home";
  const isLoggedIn = !!localStorage.getItem("accessToken");

  if (isLoggedIn) {
    return <Navigate to={from} replace />;
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
 * 应用路由主组件
 */
export default function AppRoutes() {
  return (
    <Suspense fallback={<FullScreenLoader />}>
      <Routes>
        {/* 公开路由：登录、注册、忘记密码 */}
        <Route path="/login" element={<LoginPageWrapper />} />
        <Route path="/register" element={<RegisterPageWrapper />} />
        <Route path="/forgot-password" element={<ForgotPasswordPageWrapper />} />
        <Route path="/" element={<Navigate to="/home" replace />} />

        {/* 动态路由：所有受保护页面 */}
        <Route path="/*" element={<DynamicRoutes />} />
      </Routes>
    </Suspense>
  );
}
