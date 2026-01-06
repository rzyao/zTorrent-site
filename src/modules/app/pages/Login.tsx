import { useState } from "react";
import Logo from "@/assets/logo.svg";
import { useDynamicTitle } from "@/hooks/useDynamicTitle";
import { Eye, EyeOff, User, Lock, LogIn, Clock } from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Checkbox } from "../components/ui/checkbox";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { useAuth } from "../hooks/useApi";
import { toast } from "sonner";

interface LoginPageProps {
  onForgotPassword: () => void;
  onRegister: () => void;
  onLoginSuccess: () => void;
  onTestApi?: () => void;
}

export default function LoginPage({
  onForgotPassword,
  onRegister,
  onLoginSuccess,
  onTestApi,
}: LoginPageProps) {
  useDynamicTitle("登录");
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [autoLogout, setAutoLogout] = useState(false);
  const { login, isLoading, error: authError } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(username, password, autoLogout);
      toast.success("登录成功");
      onLoginSuccess();
    } catch (err: any) {
      toast.error("登录失败: " + (err.message || "未知错误"));
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#0F171E]">
      <div className="absolute inset-0">
        <ImageWithFallback
          src="https://images.unsplash.com/photo-1739433437912-cca661ba902f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1920"
          alt="Background"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-linear-to-b from-[#0F171E]/95 via-[#0F171E]/85 to-[#0F171E]/95" />
        <div className="absolute inset-0 bg-linear-to-r from-[#0F171E] via-transparent to-[#0F171E]" />
      </div>

      <div className="relative z-10 px-4 py-6 md:px-8">
        <a href="#" className="flex items-center gap-2">
          <img src={Logo} alt="Logo" className="h-10 w-10 md:h-12 md:w-12" />
          <span className="text-3xl text-white">PT</span>
          <span className="text-3xl text-[#00A8E1]">Tracker</span>
        </a>
      </div>

      <div className="relative z-10 flex items-center justify-center px-4 py-12 md:py-16">
        <div className="w-full max-w-md">
          <div className="rounded-lg border border-gray-800 bg-black/60 p-8 backdrop-blur-md md:p-10">
            <div className="mb-8 text-center">
              <h1 className="mb-2 text-3xl text-white">登录</h1>
              <p className="text-sm text-gray-400">欢迎回到 PTTracker</p>
            </div>

            <form className="space-y-5" onSubmit={handleLogin}>
              <div className="space-y-2">
                <label className="text-sm text-white">用户名</label>
                <div className="relative">
                  <User className="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 text-gray-400" />
                  <Input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="输入您的用户名"
                    className="w-full rounded-md border-gray-700 bg-gray-900/50 py-6 pr-4 pl-11 text-white placeholder:text-gray-500 focus:border-[#00A8E1] focus:ring-[#00A8E1]"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm text-white">密码</label>
                <div className="relative">
                  <Lock className="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 text-gray-400" />
                  <Input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="输入您的密码"
                    className="w-full rounded-md border-gray-700 bg-gray-900/50 py-6 pr-12 pl-11 text-white placeholder:text-gray-500 focus:border-[#00A8E1] focus:ring-[#00A8E1]"
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
                  30分钟无操作自动退出
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
                  忘记密码？
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
                    登录中...
                  </>
                ) : (
                  <>
                    <LogIn className="mr-2 h-5 w-5" />
                    登录
                  </>
                )}
              </Button>
            </form>

            <div className="mt-8 text-center text-sm">
              <span className="text-gray-400">还没有账号？</span>
              <Button
                type="button"
                onClick={onRegister}
                className="ml-2 text-[#00A8E1] transition-colors hover:text-[#00A8E1]/80"
                variant="link"
                size="sm"
              >
                立即注册
              </Button>
            </div>

            {onTestApi && (
              <div className="mt-4 text-center">
                <Button
                  type="button"
                  onClick={onTestApi}
                  className="text-sm text-blue-400 transition-colors hover:text-blue-300"
                >
                  API测试 (开发者)
                </Button>
              </div>
            )}
          </div>

          <div className="mt-6 text-center text-xs text-gray-500">
            <p>
              本站为私有PT站点，仅限邀请注册。
              <br />
              未经许可禁止分享账号或邀请码。
            </p>
          </div>
        </div>
      </div>

      <div className="absolute right-0 bottom-0 left-0 z-0 h-32 bg-linear-to-t from-[#0F171E] to-transparent" />
    </div>
  );
}
