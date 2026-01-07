import { useState } from "react";
import { useDynamicTitle } from "@/hooks/useDynamicTitle";
import { isValidPassword, passwordErrorMessage } from "@/utils/validation";
import { Mail, Lock, ArrowLeft, Clock, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ImageWithFallback } from "@/components/figma/ImageWithFallback";

interface ForgotPasswordPageProps {
  onBack: () => void;
}

export default function ForgotPasswordPage({ onBack }: ForgotPasswordPageProps) {
  useDynamicTitle("找回密码");
  const [step, setStep] = useState<"email" | "verify" | "reset" | "success">("email");
  const [countdown, setCountdown] = useState(0);
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState<{ newPassword?: string; confirmPassword?: string }>({});

  const handleSendCode = (e: React.FormEvent) => {
    e.preventDefault();
    setStep("verify");
    setCountdown(60);
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleResendCode = () => {
    setCountdown(60);
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleVerifyCode = (e: React.FormEvent) => {
    e.preventDefault();
    setStep("reset");
  };
  const handleResetPassword = (e: React.FormEvent) => {
    e.preventDefault();
    const errs: { newPassword?: string; confirmPassword?: string } = {};
    if (!isValidPassword(newPassword)) {
      errs.newPassword = passwordErrorMessage();
    }
    if (confirmPassword !== newPassword) {
      errs.confirmPassword = "两次输入的密码不一致";
    }
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;
    setStep("success");
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
        <a href="#" className="flex items-center gap-1">
          <span className="text-3xl text-white">PT</span>
          <span className="text-3xl text-[#00A8E1]">Tracker</span>
        </a>
      </div>

      <div className="relative z-10 flex items-center justify-center px-4 py-12 md:py-16">
        <div className="w-full max-w-md">
          <div className="rounded-lg border border-gray-800 bg-black/60 p-8 backdrop-blur-md md:p-10">
            {step !== "success" && (
              <Button
                onClick={onBack}
                className="mb-6 flex items-center gap-2 text-gray-400 transition-colors hover:text-white"
              >
                <ArrowLeft className="h-4 w-4" />
                <span className="text-xs">返回登录</span>
              </Button>
            )}

            {step !== "success" && (
              <div className="mb-8 flex items-center justify-center gap-2">
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-full text-sm ${step === "email" ? "bg-[#00A8E1] text-white" : step === "verify" || step === "reset" ? "bg-green-500 text-white" : "bg-gray-700 text-gray-400"}`}
                >
                  1
                </div>
                <div
                  className={`h-0.5 w-12 ${step === "verify" || step === "reset" ? "bg-green-500" : "bg-gray-700"}`}
                />
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-full text-sm ${step === "verify" ? "bg-[#00A8E1] text-white" : step === "reset" ? "bg-green-500 text-white" : "bg-gray-700 text-gray-400"}`}
                >
                  2
                </div>
                <div
                  className={`h-0.5 w-12 ${step === "reset" ? "bg-green-500" : "bg-gray-700"}`}
                />
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-full text-sm ${step === "reset" ? "bg-[#00A8E1] text-white" : "bg-gray-700 text-gray-400"}`}
                >
                  3
                </div>
              </div>
            )}

            {step === "email" && (
              <>
                <div className="mb-8 text-center">
                  <h1 className="mb-2 text-3xl text-white">找回密码</h1>
                  <p className="text-sm text-gray-400">通过邮箱验证重置密码</p>
                </div>
                <form onSubmit={handleSendCode} className="space-y-5">
                  <div className="space-y-2">
                    <label className="text-sm text-white">注册邮箱</label>
                    <div className="relative">
                      <Mail className="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 text-gray-400" />
                      <Input
                        type="email"
                        placeholder="输入您的注册邮箱"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="w-full rounded-md border-gray-700 bg-gray-900/50 py-6 pr-4 pl-11 text-white placeholder:text-gray-500 focus:border-[#00A8E1] focus:ring-[#00A8E1]"
                      />
                    </div>
                    <p className="text-xs text-gray-500">请输入您注册时使用的邮箱地址</p>
                  </div>
                  <Button
                    type="submit"
                    className="w-full rounded-md bg-[#00A8E1] py-6 text-lg text-white transition-colors hover:bg-[#00A8E1]/90"
                  >
                    发送验证码
                  </Button>
                </form>
              </>
            )}

            {step === "verify" && (
              <>
                <div className="mb-8 text-center">
                  <h1 className="mb-2 text-3xl text-white">验证身份</h1>
                  <p className="text-sm text-gray-400">验证码已发送至</p>
                  <p className="mt-1 text-sm text-[#00A8E1]">{email}</p>
                </div>
                <form onSubmit={handleVerifyCode} className="space-y-5">
                  <div className="space-y-2">
                    <label className="text-sm text-white">验证码</label>
                    <div className="flex gap-2">
                      <Input
                        type="text"
                        placeholder="输入6位验证码"
                        maxLength={6}
                        required
                        className="flex-1 rounded-md border-gray-700 bg-gray-900/50 px-4 py-6 text-center text-2xl tracking-widest text-white placeholder:text-base placeholder:tracking-normal placeholder:text-gray-500 focus:border-[#00A8E1] focus:ring-[#00A8E1]"
                      />
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2 text-gray-400">
                      <Clock className="h-4 w-4" />
                      <span>{countdown > 0 ? `${countdown}秒后可重发` : "验证码已过期"}</span>
                    </div>
                    <Button
                      type="button"
                      onClick={handleResendCode}
                      disabled={countdown > 0}
                      className={`${countdown > 0 ? "cursor-not-allowed text-gray-600" : "text-[#00A8E1] hover:text-[#00A8E1]/80"} transition-colors`}
                    >
                      重新发送
                    </Button>
                  </div>
                  <Button
                    type="submit"
                    className="w-full rounded-md bg-[#00A8E1] py-6 text-lg text-white transition-colors hover:bg-[#00A8E1]/90"
                  >
                    验证并继续
                  </Button>
                </form>
              </>
            )}

            {step === "reset" && (
              <>
                <div className="mb-8 text-center">
                  <h1 className="mb-2 text-3xl text-white">设置新密码</h1>
                  <p className="text-sm text-gray-400">请设置一个安全的新密码</p>
                </div>
                <form onSubmit={handleResetPassword} className="space-y-5">
                  <div className="space-y-2">
                    <label className="text-sm text-white">新密码</label>
                    <div className="relative">
                      <Lock className="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 text-gray-400" />
                      <Input
                        type="password"
                        placeholder="输入新密码"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        required
                        className="w-full rounded-md border-gray-700 bg-gray-900/50 py-6 pr-4 pl-11 text-white placeholder:text-gray-500 focus:border-[#00A8E1] focus:ring-[#00A8E1]"
                      />
                    </div>
                    {errors.newPassword && (
                      <p className="text-xs text-red-400">{errors.newPassword}</p>
                    )}
                    <p className="text-xs text-gray-500">至少8个字符，包含字母和数字</p>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm text-white">确认新密码</label>
                    <div className="relative">
                      <Lock className="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 text-gray-400" />
                      <Input
                        type="password"
                        placeholder="再次输入新密码"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        className="w-full rounded-md border-gray-700 bg-gray-900/50 py-6 pr-4 pl-11 text-white placeholder:text-gray-500 focus:border-[#00A8E1] focus:ring-[#00A8E1]"
                      />
                    </div>
                    {errors.confirmPassword && (
                      <p className="text-xs text-red-400">{errors.confirmPassword}</p>
                    )}
                  </div>
                  <div className="rounded-md border border-blue-800/30 bg-blue-900/20 p-4">
                    <p className="text-xs text-blue-300">
                      <strong>密码安全提示：</strong>
                      <br />• 使用大小写字母、数字和特殊符号组合
                      <br />• 避免使用常见密码或个人信息
                      <br />• 定期更换密码以保障账号安全
                    </p>
                  </div>
                  <Button
                    type="submit"
                    className="w-full rounded-md bg-[#00A8E1] py-6 text-lg text-white transition-colors hover:bg-[#00A8E1]/90"
                  >
                    重置密码
                  </Button>
                </form>
              </>
            )}

            {step === "success" && (
              <>
                <div className="py-8 text-center">
                  <div className="mb-6 inline-flex h-20 w-20 items-center justify-center rounded-full bg-green-500/20">
                    <CheckCircle className="h-12 w-12 text-green-500" />
                  </div>
                  <h1 className="mb-3 text-3xl text-white">密码重置成功</h1>
                  <p className="mb-8 text-sm text-gray-400">
                    您的密码已成功重置
                    <br />
                    现在可以使用新密码登录了
                  </p>
                  <Button
                    onClick={onBack}
                    className="w-full rounded-md bg-[#00A8E1] py-6 text-lg text-white transition-colors hover:bg-[#00A8E1]/90"
                  >
                    返回登录
                  </Button>
                </div>
              </>
            )}
          </div>
          {step !== "success" && (
            <div className="mt-6 text-center text-xs text-gray-500">
              <p>
                出于安全考虑，找回密码需要邮箱验证
                <br />
                请确保您的邮箱地址准确无误
              </p>
            </div>
          )}
        </div>
      </div>
      <div className="absolute right-0 bottom-0 left-0 z-0 h-32 bg-linear-to-t from-[#0F171E] to-transparent" />
    </div>
  );
}
