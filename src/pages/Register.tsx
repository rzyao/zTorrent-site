import { useState, useEffect } from "react";
import { useDynamicTitle } from "@/hooks/useDynamicTitle";
import { Mail, Lock, UserPlus, ArrowLeft, User, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "../components/ui/input";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { useAuth } from "../hooks/useApi";
import { isValidPassword, passwordErrorMessage } from "../utils/validation";
import { toast } from "sonner";
import { getAuthService } from "../api/lazy";

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

export default function Register({ onBack, onRegisterSuccess, inviteCode }: RegisterProps) {
  useDynamicTitle("注册");
  const { register, sendVerificationCode, isLoading: hookLoading, error: hookError } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSendingCode, setIsSendingCode] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [codeSent, setCodeSent] = useState(false);
  // 已移除对秒级有效期的维护，统一使用分钟数
  // 新增：直接保存有效期分钟数，底部展示优先使用该值，减少换算
  const [expiryMinutes, setExpiryMinutes] = useState<number | null>(null);
  const [formData, setFormData] = useState<FormData>({
    username: "",
    email: "",
    emailCode: "",
    password: "",
  });
  const [errors, setErrors] = useState<Partial<FormData>>({});
  const [isVerifyingCode, setIsVerifyingCode] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [gateMode, setGateMode] = useState<"normal" | "invite_only" | "invalid_code">("normal");
  const [inviteCodeFromUrl, setInviteCodeFromUrl] = useState<string | undefined>(undefined);

  const handleFieldChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleRequestEmailCode = async () => {
    if (!formData.email) {
      setErrors((prev) => ({ ...prev, email: "请输入邮箱地址" }));
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setErrors((prev) => ({ ...prev, email: "请输入有效的邮箱地址" }));
      return;
    }
    setIsSendingCode(true);
    try {
      const resp: any = await sendVerificationCode(formData.email);
      setCodeSent(true);
      // 解析有效期：优先使用后端新增的 expiresMinutes，其次回退到 expiresSeconds/旧字段 expiry
      // 仅使用后端返回的分钟字段，不再维护秒级有效期或旧字段兼容
      let minutes: number | null = null;
      if (resp && typeof resp.expiresMinutes === "number") {
        minutes = resp.expiresMinutes;
      }
      if (minutes !== null) {
        // 保存分钟数供底部展示使用
        setExpiryMinutes(minutes);
      }
      setCountdown(60);
      toast.success(`验证码已发送到您的邮箱，请查收（有效期${minutes ?? 10}分钟）`);
    } catch (error: any) {
      toast.error(error.message || "发送验证码失败，请重试");
    } finally {
      setIsSendingCode(false);
    }
  };

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get("inviteCode") || inviteCode;
    const emailParam = params.get("email") || undefined;
    const usernameParam = params.get("username") || undefined;
    if (code) setInviteCodeFromUrl(code);
    if (emailParam && !formData.email) {
      setFormData((prev) => ({ ...prev, email: emailParam }));
    }
    if (usernameParam && !formData.username) {
      setFormData((prev) => ({ ...prev, username: usernameParam }));
    }
    (async () => {
      try {
        const AuthService = await getAuthService();
        if (code) {
          const res: any = await AuthService.authRegistrationControllerVerifyInviteCode({
            inviteCode: code!,
            email: emailParam || "",
          });
          const valid = res?.data?.valid === true;
          setGateMode(valid ? "normal" : "invalid_code");
        } else {
          const status: any = await AuthService.authRegistrationControllerRegistrationEnabled();
          const open = status?.data?.registrationEnabled === true;
          setGateMode(open ? "normal" : "invite_only");
        }
      } catch {
        setGateMode("invite_only");
      } finally {
        setInitialLoading(false);
      }
    })();
  }, [inviteCode]);

  const validateStep1 = (): boolean => {
    const newErrors: Partial<FormData> = {};
    if (!formData.email) {
      newErrors.email = "请输入邮箱地址";
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        newErrors.email = "请输入有效的邮箱地址";
      }
    }
    if (!formData.emailCode) {
      newErrors.emailCode = "请输入邮箱验证码";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  const validateStep2 = (): boolean => {
    const newErrors: Partial<FormData> = {};
    if (!formData.username) {
      newErrors.username = "请输入用户名";
    }
    if (!formData.password) {
      newErrors.password = "请输入密码";
    } else if (!isValidPassword(formData.password)) {
      newErrors.password = passwordErrorMessage();
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  const handleNextStep = async () => {
    if (!validateStep1()) return;
    setIsVerifyingCode(true);
    try {
      // 修复：此处此前直接调用未定义的 AuthService，导致 TS 报错
      // 通过统一的懒加载入口获取服务实例，避免未定义并保持与上文一致的调用方式
      const AuthService = await getAuthService();
      const res: any = await AuthService.authRegistrationControllerVerifyRegisterEmailCode({
        email: formData.email,
        code: formData.emailCode,
      });
      const ok = res?.code === 1000;
      if (!ok) {
        const msg = res?.message || "验证码错误或已过期";
        toast.error(msg);
        setErrors((prev) => ({ ...prev, emailCode: msg }));
        return;
      }
      setCurrentStep(2);
    } catch (err: any) {
      const msg =
        (err && (err as any).body && (err as any).body.message) ||
        (err && (err as any).data && (err as any).data.message) ||
        (err &&
          (err as any).response &&
          (err as any).response.data &&
          (err as any).response.data.message) ||
        err?.message ||
        "验证码错误或已过期";
      toast.error(msg);
      setErrors((prev) => ({ ...prev, emailCode: msg }));
    } finally {
      setIsVerifyingCode(false);
    }
  };
  const handlePrevStep = () => {
    setCurrentStep(1);
    setErrors({ ...errors, username: undefined, password: undefined });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep2()) return;
    setIsSubmitting(true);
    try {
      await register(formData.email, formData.username, formData.password);
      window.location.replace("/");
    } catch (error: any) {
      const msg =
        (error && (error as any).body && (error as any).body.message) ||
        (error && (error as any).data && (error as any).data.message) ||
        (error &&
          (error as any).response &&
          (error as any).response.data &&
          (error as any).response.data.message) ||
        error?.message ||
        "注册失败，请重试";
      toast.error(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (initialLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0F171E]">
        <div className="flex flex-col items-center gap-3 text-white">
          <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-white"></div>
          <span className="text-sm text-gray-300">正在检查注册状态...</span>
        </div>
      </div>
    );
  }

  if (gateMode === "invite_only") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0F171E] px-4">
        <div className="w-full max-w-md rounded-md border border-gray-800 bg-black/60 p-6 text-center">
          <h1 className="mb-2 text-2xl text-white">目前仅支持邀请注册</h1>
          <p className="text-sm text-gray-400">请使用邀请链接或邀请码访问该页面。</p>
          <Button onClick={onBack} className="mt-6 text-sm text-[#00A8E1] hover:text-[#00A8E1]/80">
            返回登录
          </Button>
        </div>
      </div>
    );
  }

  if (gateMode === "invalid_code") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0F171E] px-4">
        <div className="w-full max-w-md rounded-md border border-gray-800 bg-black/60 p-6 text-center">
          <h1 className="mb-2 text-2xl text-white">邀请码错误</h1>
          <p className="text-sm text-gray-400">请确认链接或邀请码是否正确与未过期。</p>
          <Button onClick={onBack} className="mt-6 text-sm text-[#00A8E1] hover:text-[#00A8E1]/80">
            返回登录
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#0F171E]">
      {/* 背景图片 */}
      <div className="absolute inset-0">
        <ImageWithFallback
          src="https://images.unsplash.com/photo-1739433437912-cca661ba902f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1920"
          alt="Background"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-linear-to-b from-[#0F171E]/95 via-[#0F171E]/85 to-[#0F171E]/95" />
        <div className="absolute inset-0 bg-linear-to-r from-[#0F171E] via-transparent to-[#0F171E]" />
      </div>
      {/* 顶部logo */}
      <div className="relative z-10 px-4 py-6 md:px-8">
        <div className="flex items-center justify-between">
          <a href="#" className="flex items-center gap-1">
            <span className="text-3xl text-white">PT</span>
            <span className="text-3xl text-[#00A8E1]">Tracker</span>
          </a>
        </div>
      </div>
      {/* 注册表单 */}
      <div className="relative z-10 flex items-center justify-center px-4 py-12 md:py-16">
        <div className="w-full max-w-md">
          <div className="rounded-lg border border-gray-800 bg-black/60 p-8 md:p-10">
            {/* 标题 */}
            <div className="mb-8 text-center">
              <h1 className="mb-2 text-3xl text-white">注册</h1>
              <p className="text-sm text-gray-400">加入最优质的PT资源分享社区</p>
            </div>
            {hookError && (
              <div className="mb-4 rounded-md border border-red-800 bg-red-900/20 p-3">
                <div className="flex items-center gap-2 text-red-400">
                  <AlertCircle className="h-4 w-4" />
                  <span className="text-xs">{hookError}</span>
                </div>
              </div>
            )}
            {/* 步骤导航 */}
            <div className="mb-8 flex items-center justify-between gap-4">
              <div className="flex flex-col items-center gap-2">
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-full text-sm ${currentStep === 1 ? "bg-[#00A8E1] text-white" : "bg-green-500 text-white"}`}
                >
                  1
                </div>
                <span
                  className={`text-xs ${currentStep === 1 ? "text-[#00A8E1]" : "text-green-500"}`}
                >
                  邮箱验证
                </span>
              </div>
              <div
                className={`h-0.5 flex-1 ${currentStep === 2 ? "bg-green-500" : "bg-gray-700"}`}
              />
              <div className="flex flex-col items-center gap-2">
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-full text-sm ${currentStep === 2 ? "bg-[#00A8E1] text-white" : "bg-gray-700 text-gray-400"}`}
                >
                  2
                </div>
                <span
                  className={`text-xs ${currentStep === 2 ? "text-[#00A8E1]" : "text-gray-400"}`}
                >
                  设置账号
                </span>
              </div>
            </div>
            {/* 表单 */}
            <form className="space-y-5" onSubmit={handleSubmit}>
              {currentStep === 1 && (
                <>
                  {/* 邮箱地址 */}
                  <div className="space-y-2">
                    <label className="text-sm text-white">邮箱地址</label>
                    <div className="relative">
                      <Mail className="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 text-gray-400" />
                      <Input
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleFieldChange("email", e.target.value)}
                        placeholder="输入您的邮箱地址"
                        className={`w-full rounded-md border-gray-700 bg-gray-900/50 py-6 pr-4 pl-11 text-white placeholder:text-gray-500 focus:border-[#00A8E1] focus:ring-[#00A8E1] ${errors.email ? "border-red-500" : ""}`}
                        required
                      />
                    </div>
                    {errors.email && <p className="text-xs text-red-400">{errors.email}</p>}
                  </div>
                  {/* 邮箱验证码 */}
                  <div className="space-y-2">
                    <label className="text-sm text-white">邮箱验证码</label>
                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <Mail className="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 text-gray-400" />
                        <Input
                          type="text"
                          value={formData.emailCode}
                          onChange={(e) => handleFieldChange("emailCode", e.target.value)}
                          placeholder="输入验证码"
                          className={`w-full rounded-md border-gray-700 bg-gray-900/50 py-6 pr-4 pl-11 text-white placeholder:text-gray-500 focus:border-[#00A8E1] focus:ring-[#00A8E1] ${errors.emailCode ? "border-red-500" : ""}`}
                          required
                        />
                      </div>
                      <Button
                        type="button"
                        onClick={handleRequestEmailCode}
                        disabled={isSendingCode || countdown > 0}
                        className="rounded-md bg-gray-700 px-4 py-6 whitespace-nowrap text-white transition-colors hover:bg-gray-600 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {isSendingCode
                          ? "发送中..."
                          : countdown > 0
                            ? countdown + "s"
                            : "发送验证码"}
                      </Button>
                    </div>
                    {errors.emailCode && <p className="text-xs text-red-400">{errors.emailCode}</p>}
                  </div>
                  {/* 下一步按钮 */}
                  <Button
                    type="button"
                    onClick={handleNextStep}
                    disabled={isVerifyingCode}
                    className="w-full rounded-md bg-[#00A8E1] py-6 text-lg text-white transition-colors hover:bg-[#00A8E1]/90 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {isVerifyingCode ? "验证中..." : "下一步"}
                  </Button>
                </>
              )}

              {currentStep === 2 && (
                <>
                  {/* 用户名 */}
                  <div className="space-y-2">
                    <label className="text-sm text-white">用户名</label>
                    <div className="relative">
                      <User className="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 text-gray-400" />
                      <Input
                        type="text"
                        value={formData.username}
                        onChange={(e) => handleFieldChange("username", e.target.value)}
                        placeholder="选择一个用户名"
                        className={`w-full rounded-md border-gray-700 bg-gray-900/50 py-3 pr-4 pl-11 text-white placeholder:text-gray-500 focus:border-[#00A8E1] focus:ring-[#00A8E1] ${errors.username ? "border-red-500" : ""}`}
                        required
                      />
                    </div>
                    {errors.username && <p className="text-xs text-red-400">{errors.username}</p>}
                    <p className="text-xs text-gray-500">4-16个字符，支持字母、数字和下划线</p>
                  </div>
                  {/* 密码 */}
                  <div className="space-y-2">
                    <label className="text-sm text-white">密码</label>
                    <div className="relative">
                      <Lock className="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 text-gray-400" />
                      <Input
                        type="password"
                        value={formData.password}
                        onChange={(e) => handleFieldChange("password", e.target.value)}
                        placeholder="设置登录密码"
                        className={`w-full rounded-md border-gray-700 bg-gray-900/50 py-3 pr-4 pl-11 text-white placeholder:text-gray-500 focus:border-[#00A8E1] focus:ring-[#00A8E1] ${errors.password ? "border-red-500" : ""}`}
                        required
                      />
                    </div>
                    {errors.password && <p className="text-xs text-red-400">{errors.password}</p>}
                    <p className="text-xs text-gray-500">至少8个字符，包含字母和数字</p>
                  </div>
                  <div className="text-xs text-gray-400">
                    <label className="flex cursor-pointer items-start gap-2">
                      <input
                        type="checkbox"
                        className="mt-0.5 h-4 w-4 rounded border-gray-600 bg-gray-900/50 text-[#00A8E1] focus:ring-[#00A8E1]"
                        required
                      />
                      <span>
                        我已阅读并同意{" "}
                        <a href="#" className="text-[#00A8E1] hover:underline">
                          用户协议
                        </a>{" "}
                        和{" "}
                        <a href="#" className="text-[#00A8E1] hover:underline">
                          隐私政策
                        </a>
                      </span>
                    </label>
                  </div>
                  <div className="flex gap-3">
                    {/* 上一步按钮 */}
                    <Button
                      type="button"
                      onClick={handlePrevStep}
                      className="flex-1 rounded-md bg-gray-700 py-3 text-white transition-colors hover:bg-gray-600"
                    >
                      <ArrowLeft className="mr-2 inline h-4 w-4" />
                      上一步
                    </Button>
                    {/* 注册按钮 */}
                    <Button
                      type="submit"
                      disabled={isSubmitting || hookLoading}
                      className="flex-1 rounded-md bg-[#00A8E1] py-3 text-lg text-white transition-colors hover:bg-[#00A8E1]/90 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {isSubmitting || hookLoading ? (
                        <>
                          <div className="mr-2 h-5 w-5 animate-spin rounded-full border-b-2 border-white"></div>
                          注册中...
                        </>
                      ) : (
                        <>
                          <UserPlus className="mr-2 h-5 w-5" />
                          创建账号
                        </>
                      )}
                    </Button>
                  </div>
                </>
              )}
            </form>
            {/* 登录提示 */}
            <div className="mt-8 text-center text-sm">
              <span className="text-gray-400">已有账号？</span>
              <Button
                onClick={onBack}
                className="ml-2 text-[#00A8E1] transition-colors hover:text-[#00A8E1]/80"
              >
                前往登录
              </Button>
            </div>
          </div>
          <div className="mt-6 text-center text-xs text-gray-500">
            <p>
              本站为私有PT站点，仅限注册用户访问。
              <br />
              未经许可禁止分享账号或邀请码。
            </p>
          </div>
        </div>
      </div>
      {/* 底部渐变 */}
      <div className="absolute right-0 bottom-0 left-0 z-0 h-32 bg-linear-to-t from-[#0F171E] to-transparent" />
    </div>
  );
}
