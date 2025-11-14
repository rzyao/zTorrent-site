import { useState, useEffect } from 'react';
import { Mail, Lock, UserPlus, ArrowLeft, User, AlertCircle } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { useAuth } from '../hooks/useApi';

interface RegisterProps {
  onBack: () => void;
  onRegisterSuccess: () => void;
  inviteCode?: string;
}

interface FormData {
  username: string;
  email: string;
  emailCode: string;
  password: string;
}

export function Register({ onBack, onRegisterSuccess, inviteCode }: RegisterProps) {
  // 使用认证Hook
  const { register, sendVerificationCode, isLoading: hookLoading, error: hookError } = useAuth();

  // 步骤状态：1-邮箱验证，2-设置账号
  const [currentStep, setCurrentStep] = useState(1);

  // 页面状态
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 验证码状态
  const [isSendingCode, setIsSendingCode] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [codeSent, setCodeSent] = useState(false);
  const [expirySeconds, setExpirySeconds] = useState<number | null>(null);

  // 表单数据
  const [formData, setFormData] = useState<FormData>({
    username: '',
    email: '',
    emailCode: '',
    password: ''
  });

  // 错误状态
  const [errors, setErrors] = useState<Partial<FormData>>({});

  // 更新表单数据
  const handleFieldChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // 清除对应字段的错误
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  // 发送邮箱验证码
  const handleRequestEmailCode = async () => {
    // 验证邮箱格式
    if (!formData.email) {
      setErrors(prev => ({ ...prev, email: '请输入邮箱地址' }));
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setErrors(prev => ({ ...prev, email: '请输入有效的邮箱地址' }));
      return;
    }

    setIsSendingCode(true);
    try {
      const resp: any = await sendVerificationCode(formData.email);
      setCodeSent(true);
      if (resp && typeof resp.expiry === 'number') {
        setExpirySeconds(resp.expiry);
      }
      setCountdown(60);
      alert('验证码已发送到您的邮箱，请查收');
    } catch (error: any) {
      console.error('发送验证码失败:', error);
      alert(error.message || '发送验证码失败，请重试');
    } finally {
      setIsSendingCode(false);
    }
  };

  // 倒计时效果
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  // 第一步验证（邮箱和验证码）
  const validateStep1 = (): boolean => {
    const newErrors: Partial<FormData> = {};

    if (!formData.email) {
      newErrors.email = '请输入邮箱地址';
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        newErrors.email = '请输入有效的邮箱地址';
      }
    }

    if (!formData.emailCode) {
      newErrors.emailCode = '请输入邮箱验证码';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // 第二步验证（用户名和密码）
  const validateStep2 = (): boolean => {
    const newErrors: Partial<FormData> = {};

    if (!formData.username) {
      newErrors.username = '请输入用户名';
    }

    if (!formData.password) {
      newErrors.password = '请输入密码';
    } else if (formData.password.length < 8) {
      newErrors.password = '密码长度至少8个字符';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // 下一步（从第一步到第二步）
  const handleNextStep = () => {
    if (validateStep1()) {
      setCurrentStep(2);
    }
  };

  // 上一步（从第二步回到第一步）
  const handlePrevStep = () => {
    setCurrentStep(1);
    // 清除第二步的错误
    setErrors({ ...errors, username: undefined, password: undefined });
  };

  // 提交注册
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 第二步验证
    if (!validateStep2()) {
      return;
    }

    setIsSubmitting(true);
    try {
      // 使用API注册
      await register(formData.email, formData.username, formData.password, formData.emailCode);

      // 注册成功
      alert('注册成功！即将跳转到登录页面...');
      onRegisterSuccess();
    } catch (error: any) {
      console.error('注册失败:', error);
      alert(error.message || '注册失败，请重试');
    } finally {
      setIsSubmitting(false);
    }
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
        <div className="flex items-center justify-between">
          <a href="#" className="flex items-center gap-1">
            <span className="text-white text-3xl">PT</span>
            <span className="text-[#00A8E1] text-3xl">Tracker</span>
          </a>
        </div>
      </div>

      {/* 注册表单 */}
      <div className="relative z-10 flex items-center justify-center px-4 py-12 md:py-16">
        <div className="w-full max-w-md">
          <div className="bg-black/60  rounded-lg p-8 md:p-10 border border-gray-800">
            {/* 标题 */}
            <div className="text-center mb-8">
              <h1 className="text-white text-3xl mb-2">
                注册
              </h1>
              <p className="text-gray-400 text-sm">
                加入最优质的PT资源分享社区
              </p>
            </div>

            {/* 错误提示 */}
            {hookError && (
              <div className="mb-4 p-3 bg-red-900/20 border border-red-800 rounded-md">
                <div className="flex items-center gap-2 text-red-400">
                  <AlertCircle className="w-4 h-4" />
                  <span className="text-sm">{hookError}</span>
                </div>
              </div>
            )}

            {/* 步骤指示器 */}
            <div className="flex items-center justify-center gap-4 mb-8">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${currentStep === 1 ? 'bg-[#00A8E1] text-white' : 'bg-green-500 text-white'
                }`}>
                1
              </div>
              <div className={`w-20 h-0.5 ${currentStep === 2 ? 'bg-green-500' : 'bg-gray-700'
                }`} />
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${currentStep === 2 ? 'bg-[#00A8E1] text-white' : 'bg-gray-700 text-gray-400'
                }`}>
                2
              </div>
            </div>

            {/* 表单 */}
            <form className="space-y-5" onSubmit={handleSubmit}>
              {currentStep === 1 && (
                <>
                  {/* 邮箱地址 - 第一步 */}
                  <div className="space-y-2">
                    <label className="text-white text-sm">邮箱地址</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <Input
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleFieldChange('email', e.target.value)}
                        placeholder="输入您的邮箱地址"
                        className={`w-full bg-gray-900/50 border-gray-700 text-white pl-11 pr-4 py-6 rounded-md focus:border-[#00A8E1] focus:ring-[#00A8E1] placeholder:text-gray-500 ${errors.email ? 'border-red-500' : ''
                          }`}
                        required
                      />
                    </div>
                    {errors.email && (
                      <p className="text-xs text-red-400">{errors.email}</p>
                    )}
                  </div>

                  {/* 邮箱验证码 - 第一步 */}
                  <div className="space-y-2">
                    <label className="text-white text-sm">邮箱验证码</label>
                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <Input
                          type="text"
                          value={formData.emailCode}
                          onChange={(e) => handleFieldChange('emailCode', e.target.value)}
                          placeholder="输入验证码"
                          className={`w-full bg-gray-900/50 border-gray-700 text-white pl-11 pr-4 py-6 rounded-md focus:border-[#00A8E1] focus:ring-[#00A8E1] placeholder:text-gray-500 ${errors.emailCode ? 'border-red-500' : ''
                            }`}
                          required
                        />
                      </div>
                      <Button
                        type="button"
                        onClick={handleRequestEmailCode}
                        disabled={isSendingCode || countdown > 0}
                        className="px-4 py-6 bg-gray-700 hover:bg-gray-600 text-white rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap">
                        {isSendingCode ? '发送中...' : countdown > 0 ? (countdown + 's') : '发送验证码'}
                      </Button>
                    </div>
                    {errors.emailCode && (
                      <p className="text-xs text-red-400">{errors.emailCode}</p>
                    )}
                    <p className="text-xs text-gray-500">
                      验证码有效期{expirySeconds ? Math.ceil(expirySeconds / 60) : 10}分钟
                    </p>
                  </div>

                  {/* 下一步按钮 */}
                  <Button
                    type="button"
                    onClick={handleNextStep}
                    className="w-full bg-[#00A8E1] hover:bg-[#00A8E1]/90 text-white py-6 text-lg rounded-md transition-colors"
                  >
                    下一步
                  </Button>
                </>
              )}

              {currentStep === 2 && (
                <>
                  {/* 用户名 - 第二步 */}
                  <div className="space-y-2">
                    <label className="text-white text-sm">用户名</label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <Input
                        type="text"
                        value={formData.username}
                        onChange={(e) => handleFieldChange('username', e.target.value)}
                        placeholder="选择一个用户名"
                        className={`w-full bg-gray-900/50 border-gray-700 text-white pl-11 pr-4 py-3 rounded-md focus:border-[#00A8E1] focus:ring-[#00A8E1] placeholder:text-gray-500 ${errors.username ? 'border-red-500' : ''
                          }`}
                        required
                      />
                    </div>
                    {errors.username && (
                      <p className="text-xs text-red-400">{errors.username}</p>
                    )}
                    <p className="text-xs text-gray-500">
                      4-16个字符，支持字母、数字和下划线
                    </p>
                  </div>

                  {/* 密码 - 第二步（只输入一遍） */}
                  <div className="space-y-2">
                    <label className="text-white text-sm">密码</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <Input
                        type="password"
                        value={formData.password}
                        onChange={(e) => handleFieldChange('password', e.target.value)}
                        placeholder="设置登录密码"
                        className={`w-full bg-gray-900/50 border-gray-700 text-white pl-11 pr-4 py-3 rounded-md focus:border-[#00A8E1] focus:ring-[#00A8E1] placeholder:text-gray-500 ${errors.password ? 'border-red-500' : ''
                          }`}
                        required
                      />
                    </div>
                    {errors.password && (
                      <p className="text-xs text-red-400">{errors.password}</p>
                    )}
                    <p className="text-xs text-gray-500">
                      至少8个字符，包含字母和数字
                    </p>
                  </div>

                  {/* 注册协议 */}
                  <div className="text-xs text-gray-400">
                    <label className="flex items-start gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        className="w-4 h-4 mt-0.5 rounded border-gray-600 bg-gray-900/50 text-[#00A8E1] focus:ring-[#00A8E1]"
                        required
                      />
                      <span>
                        我已阅读并同意{' '}
                        <a href="#" className="text-[#00A8E1] hover:underline">
                          用户协议
                        </a>{' '}
                        和{' '}
                        <a href="#" className="text-[#00A8E1] hover:underline">
                          隐私政策
                        </a>
                      </span>
                    </label>
                  </div>

                  {/* 按钮组 */}
                  <div className="flex gap-3">
                    <Button
                      type="button"
                      onClick={handlePrevStep}
                      className="flex-1 bg-gray-700 hover:bg-gray-600 text-white py-3 rounded-md transition-colors"
                    >
                      <ArrowLeft className="w-4 h-4 mr-2 inline" />
                      上一步
                    </Button>
                    <Button
                      type="submit"
                      disabled={isSubmitting || hookLoading}
                      className="flex-1 bg-[#00A8E1] hover:bg-[#00A8E1]/90 text-white py-3 text-lg rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSubmitting || hookLoading ? (
                        <>
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                          注册中...
                        </>
                      ) : (
                        <>
                          <UserPlus className="w-5 h-5 mr-2" />
                          创建账号
                        </>
                      )}
                    </Button>
                  </div>
                </>
              )}
            </form>
            {/*已有账号？前往登录*/}
            <div className="mt-8 text-center text-sm">
              <span className="text-gray-400">
                已有账号？
              </span>
              <button
                onClick={onBack}
                className="ml-2 text-[#00A8E1] hover:text-[#00A8E1]/80 transition-colors"
              >
                前往登录
              </button>
            </div>
          </div>

          {/* 底部提示 */}
          <div className="mt-6 text-center text-xs text-gray-500">
            <p>
              本站为私有PT站点，仅限注册注册用户访问。
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
