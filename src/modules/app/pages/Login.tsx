import { useState } from "react";
import Logo from "@/assets/logo.svg";
import { useDynamicTitle } from "@/hooks/useDynamicTitle";
import { useLanguage } from "@/hooks/useLanguage";
import { Eye, EyeOff, User, Lock, LogIn, Clock } from "lucide-react";
import { Button } from "@/modules/app/components/ui/button";
import { Input } from "@/modules/app/components/ui/input";
import { Checkbox } from "@/modules/app/components/ui/checkbox";
import { ImageWithFallback } from "@/modules/app/components/figma/ImageWithFallback";
import { useAuth } from "@/hooks/useApi";
import { toast } from "sonner";

// 登录页面组件属性定义
interface LoginPageProps {
  // 点击忘记密码的回调
  onForgotPassword: () => void;
  // 点击注册的回调
  onRegister: () => void;
  // 登录成功后的回调
  onLoginSuccess: () => void;
  // 测试 API 的回调（可选）
  onTestApi?: () => void;
}

// 登录页面组件
export default function LoginPage({
  onForgotPassword,
  onRegister,
  onLoginSuccess,
  onTestApi,
}: LoginPageProps) {
  const { t } = useLanguage();
  // 设置页面标题
  useDynamicTitle(t("auth.login"));

  // 状态管理
  const [showPassword, setShowPassword] = useState(false); // 是否显示密码
  const [username, setUsername] = useState(""); // 用户名
  const [password, setPassword] = useState(""); // 密码
  const [autoLogout, setAutoLogout] = useState(false); // 是否自动登出

  // 使用 auth hook 处理登录逻辑
  const { login, isLoading, error: authError } = useAuth();

  // 处理登录表单提交
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // 调用登录接口，传入用户名、密码和自动登出选项
      await login(username, password, autoLogout);
      toast.success(t("auth.loginSuccess"));
      // 执行登录成功回调
      onLoginSuccess();
    } catch (err: any) {
      // 全局拦截器会处理 API 错误
      // Global interceptor handles API errors
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#0F171E]">
      {/* 背景图片区域 */}
      <div className="absolute inset-0">
        <ImageWithFallback
          src="https://images.unsplash.com/photo-1739433437912-cca661ba902f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1920"
          alt="Background"
          className="h-full w-full object-cover"
        />
        {/* 背景遮罩层 */}
        <div className="absolute inset-0 bg-linear-to-b from-[#0F171E]/95 via-[#0F171E]/85 to-[#0F171E]/95" />
        <div className="absolute inset-0 bg-linear-to-r from-[#0F171E] via-transparent to-[#0F171E]" />
      </div>

      {/* Logo 头部区域 */}
      <div className="relative z-10 hidden px-4 py-6 md:block md:px-8">
        <a href="#" className="flex items-center gap-2">
          <img src={Logo} alt="Logo" className="h-10 w-10 md:h-12 md:w-12" />
          <span className="text-3xl text-white">PT</span>
          <span className="text-3xl text-[#00A8E1]">Tracker</span>
        </a>
      </div>

      {/* 登录表单主体区域 */}
      <div className="absolute inset-0 z-10 flex items-center justify-center">
        <div className="flex h-full w-full flex-col md:block md:h-auto md:max-w-md">
          <div className="flex flex-1 flex-col justify-center rounded-none border-0 bg-black/60 p-8 backdrop-blur-md md:block md:rounded-lg md:border md:border-gray-800 md:p-10">
            <div className="mb-8 text-center">
              <h1 className="mb-2 text-3xl text-white">{t("auth.login")}</h1>
              <p className="text-sm text-gray-400">{t("auth.welcomeBack")}</p>
            </div>

            <form className="space-y-5" onSubmit={handleLogin}>
              <div className="space-y-2">
                <label className="text-sm text-white">{t("auth.username")}</label>
                <div className="relative">
                  <User className="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 text-gray-400" />
                  <Input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder={t("auth.usernamePlaceholder")}
                    className="w-full rounded-md border-gray-700 bg-gray-900/50 py-6 pr-4 pl-11 text-white placeholder:text-gray-500 focus:border-[#00A8E1] focus:ring-1 focus:ring-[#00A8E1]"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm text-white">{t("auth.password")}</label>
                <div className="relative">
                  <Lock className="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 text-gray-400" />
                  <Input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder={t("auth.passwordPlaceholder")}
                    className="w-full rounded-md border-gray-700 bg-gray-900/50 py-6 pr-12 pl-11 text-white placeholder:text-gray-500 focus:border-[#00A8E1] focus:ring-1 focus:ring-[#00A8E1]"
                    required
                  />
                  <Button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-400 hover:text-gray-300"
                    variant="ghost"
                    size="sm"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </Button>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="auto-logout"
                  checked={autoLogout}
                  onCheckedChange={(checked) => setAutoLogout(checked as boolean)}
                  className="border-gray-600 data-[state=checked]:border-[#00A8E1] data-[state=checked]:bg-[#00A8E1]"
                />
                <label
                  htmlFor="auto-logout"
                  className="flex cursor-pointer items-center gap-2 text-sm text-gray-300"
                >
                  <Clock className="h-4 w-4" />
                  {t("auth.autoLogout")}
                </label>
              </div>

              <div className="text-right text-sm">
                <Button
                  type="button"
                  onClick={onForgotPassword}
                  className="text-[#00A8E1] transition-colors hover:text-[#00A8E1]/80"
                  variant="link"
                  size="sm"
                >
                  {t("auth.forgotPassword")}
                </Button>
              </div>

              {authError && (
                <div className="rounded-md border border-red-800 bg-red-900/20 p-3 text-center text-sm text-red-400">
                  {authError}
                </div>
              )}

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full rounded-md bg-[#00A8E1] py-6 text-lg text-white transition-colors hover:bg-[#00A8E1]/90 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isLoading ? (
                  <>
                    <div className="mr-2 h-5 w-5 animate-spin rounded-full border-b-2 border-white"></div>
                    {t("auth.loggingIn")}
                  </>
                ) : (
                  <>
                    <LogIn className="mr-2 h-5 w-5" />
                    {t("auth.login")}
                  </>
                )}
              </Button>
            </form>

            <div className="mt-8 text-center text-sm">
              <span className="text-gray-400">{t("auth.noAccount")}</span>
              <Button
                type="button"
                onClick={onRegister}
                className="ml-2 text-[#00A8E1] transition-colors hover:text-[#00A8E1]/80"
                variant="link"
                size="sm"
              >
                {t("auth.registerNow")}
              </Button>
            </div>
          </div>
          {/* 说明区域 */}
          <div className="hidden p-4 text-center text-xs text-gray-500 md:mt-6 md:block md:p-0">
            <p>
              {t("auth.sitePrivate")}
              <br />
              {t("auth.noShareAccount")}
            </p>
          </div>
        </div>
      </div>

      <div className="absolute right-0 bottom-0 left-0 z-0 h-32 bg-linear-to-t from-[#0F171E] to-transparent" />
    </div>
  );
}
