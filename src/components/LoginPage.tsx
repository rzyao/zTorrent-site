import { useState } from 'react';
import { Eye, EyeOff, User, Lock, LogIn, Clock } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Checkbox } from './ui/checkbox';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { useAuth } from '../hooks/useApi';

interface LoginPageProps {
  onForgotPassword: () => void;
  onRegister: () => void;
  onLoginSuccess: () => void;
  onTestApi?: () => void;
}

export function LoginPage({ onForgotPassword, onRegister, onLoginSuccess, onTestApi }: LoginPageProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [autoLogout, setAutoLogout] = useState(false);
  const { login, isLoading, error: authError } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('=== LOGIN DEBUG START ===');
    console.log('Login attempt - username:', username, 'password:', password, 'autoLogout:', autoLogout);

    try {
      console.log('Calling login function with autoLogout option...');
      const result = await login(username, password, autoLogout);
      console.log('Login successful, result:', result);
      console.log('localStorage auth_token:', localStorage.getItem('auth_token'));
      console.log('localStorage user_info:', localStorage.getItem('user_info'));

      // 直接跳转到主页，使用强制刷新
      console.log('Redirecting to / with hard refresh');
      alert('登录成功！即将跳转到主页...');
      setTimeout(() => {
        window.location.replace('/');
      }, 1000);

    } catch (err: any) {
      console.log('Login failed:', err);
      console.log('Error message:', err.message);
      alert('登录失败: ' + (err.message || '未知错误'));
      // Error is handled by the hook
    }
    console.log('=== LOGIN DEBUG END ===');
  };

  return (
    <div className="min-h-screen bg-[#0F171E] relative overflow-hidden">
      {/* 背景图片 */}
      <div className="absolute inset-0">
        <ImageWithFallback
          src="https://images.unsplash.com/photo-1739433437912-cca661ba902f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1920"
          alt="Background"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0F171E]/95 via-[#0F171E]/85 to-[#0F171E]/95" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0F171E] via-transparent to-[#0F171E]" />
      </div>

      {/* 顶部Logo */}
      <div className="relative z-10 px-4 md:px-8 py-6">
        <a href="#" className="flex items-center gap-1">
          <span className="text-white text-3xl">PT</span>
          <span className="text-[#00A8E1] text-3xl">Tracker</span>
        </a>
      </div>

      {/* 登录表单 */}
      <div className="relative z-10 flex items-center justify-center px-4 py-12 md:py-16">
        <div className="w-full max-w-md">
          <div className="bg-black/60 backdrop-blur-md rounded-lg p-8 md:p-10 border border-gray-800">
            {/* 标题 */}
            <div className="text-center mb-8">
              <h1 className="text-white text-3xl mb-2">
                登录
              </h1>
              <p className="text-gray-400 text-sm">
                欢迎回到 PTTracker
              </p>
              <button
                type="button"
                onClick={() => console.log('Test button clicked, current auth_token:', localStorage.getItem('auth_token'))}
                className="mt-2 text-xs text-blue-400 hover:text-blue-300"
              >
                调试: 检查认证状态
              </button>
            </div>

            {/* 表单 */}
            <form className="space-y-5" onSubmit={handleLogin}>
              {/* 用户名 */}
              <div className="space-y-2">
                <label className="text-white text-sm">用户名</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="输入您的用户名"
                    className="w-full bg-gray-900/50 border-gray-700 text-white pl-11 pr-4 py-6 rounded-md focus:border-[#00A8E1] focus:ring-[#00A8E1] placeholder:text-gray-500"
                    required
                  />
                </div>
              </div>

              {/* 密码 */}
              <div className="space-y-2">
                <label className="text-white text-sm">密码</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="输入您的密码"
                    className="w-full bg-gray-900/50 border-gray-700 text-white pl-11 pr-12 py-6 rounded-md focus:border-[#00A8E1] focus:ring-[#00A8E1] placeholder:text-gray-500"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-300"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* 自动退出选项 */}
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="auto-logout"
                  checked={autoLogout}
                  onCheckedChange={(checked) => setAutoLogout(checked as boolean)}
                  className="border-gray-600 data-[state=checked]:bg-[#00A8E1] data-[state=checked]:border-[#00A8E1]"
                />
                <label
                  htmlFor="auto-logout"
                  className="text-sm text-gray-300 cursor-pointer flex items-center gap-2"
                >
                  <Clock className="w-4 h-4" />
                  30分钟无操作自动退出
                </label>
              </div>

              {/* 忘记密码 */}
              <div className="text-right text-sm">
                <button
                  type="button"
                  onClick={onForgotPassword}
                  className="text-[#00A8E1] hover:text-[#00A8E1]/80 transition-colors"
                >
                  忘记密码？
                </button>
              </div>

              {/* 错误提示 */}
              {authError && (
                <div className="text-red-400 text-sm text-center bg-red-900/20 p-3 rounded-md border border-red-800">
                  {authError}
                </div>
              )}

              {/* 登录按钮 */}
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-[#00A8E1] hover:bg-[#00A8E1]/90 text-white py-6 text-lg rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    登录中...
                  </>
                ) : (
                  <>
                    <LogIn className="w-5 h-5 mr-2" />
                    登录
                  </>
                )}
              </Button>
            </form>

            {/* 注册入口 */}
            <div className="mt-8 text-center text-sm">
              <span className="text-gray-400">
                还没有账号？
              </span>
              <button
                type="button"
                onClick={onRegister}
                className="ml-2 text-[#00A8E1] hover:text-[#00A8E1]/80 transition-colors"
              >
                立即注册
              </button>
            </div>

            {/* API测试入口 */}
            {onTestApi && (
              <div className="mt-4 text-center">
                <button
                  type="button"
                  onClick={onTestApi}
                  className="text-sm text-blue-400 hover:text-blue-300 transition-colors"
                >
                  API测试 (开发者)
                </button>
              </div>
            )}

            {/* 调试按钮 */}
            <div className="mt-4 text-center space-y-2">
              <button
                type="button"
                onClick={() => {
                  console.log('Manual login test');
                  login('testuser', 'testpass').then(result => {
                    console.log('Manual login success:', result);
                    console.log('Redirecting with window.location.replace');
                    window.location.replace('/');
                  }).catch(err => {
                    console.log('Manual login failed:', err);
                  });
                }}
                className="text-sm text-green-400 hover:text-green-300 transition-colors bg-green-900/20 px-3 py-1 rounded"
              >
                测试登录 (testuser/testpass)
              </button>
              <button
                type="button"
                onClick={() => {
                  console.log('Clearing localStorage');
                  localStorage.removeItem('auth_token');
                  localStorage.removeItem('user_info');
                  console.log('localStorage cleared');
                }}
                className="text-sm text-red-400 hover:text-red-300 transition-colors bg-red-900/20 px-3 py-1 rounded"
              >
                清除认证数据
              </button>
            </div>
          </div>

          {/* 底部提示 */}
          <div className="mt-6 text-center text-xs text-gray-500">
            <p>
              本站为私有PT站点，仅限邀请注册。
              <br />
              未经许可禁止分享账号或邀请码。
            </p>
          </div>
        </div>
      </div>

      {/* 底部装饰 */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#0F171E] to-transparent z-0" />
    </div>
  );
}