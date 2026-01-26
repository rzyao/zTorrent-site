import { useState } from "react";
import { useDynamicTitle } from "@/hooks/useDynamicTitle";
import { useLanguage } from "@/hooks/useLanguage";
import { isValidPassword, passwordErrorMessage } from "@/utils/validation";
import { Mail, Lock, ArrowLeft, Clock, CheckCircle } from "lucide-react";
import { Button } from "@/modules/app/components/ui/button";
import { Input } from "@/modules/app/components/ui/input";
import { ImageWithFallback } from "@/modules/app/components/figma/ImageWithFallback";

interface ForgotPasswordPageProps {
  onBack: () => void;
}

export default function ForgotPasswordPage({ onBack }: ForgotPasswordPageProps) {
  const { t } = useLanguage();
  useDynamicTitle(t("auth.resetPassword"));
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
      errs.confirmPassword = t("auth.passwordMismatch");
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
                variant="ghost"
                onClick={onBack}
                className="mb-6 h-auto p-0 text-gray-400 hover:bg-transparent hover:text-white sm:h-9 sm:px-4 sm:py-2 sm:hover:bg-white/10"
              >
                <ArrowLeft className="h-4 w-4" />
                {t("auth.backToLogin")}
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
                  <h1 className="mb-2 text-3xl text-white">{t("auth.resetPassword")}</h1>
                  <p className="text-sm text-gray-400">{t("auth.resetByEmail")}</p>
                </div>
                <form onSubmit={handleSendCode} className="space-y-5">
                  <div className="space-y-2">
                    <label className="text-sm text-white">{t("auth.registeredEmail")}</label>
                    <div className="relative">
                      <Mail className="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 text-gray-400" />
                      <Input
                        type="email"
                        placeholder={t("auth.inputRegisteredEmail")}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="w-full rounded-md border-gray-700 bg-gray-900/50 py-6 pr-4 pl-11 text-white placeholder:text-gray-500 focus:border-[#00A8E1] focus:ring-1 focus:ring-[#00A8E1]"
                      />
                    </div>
                    <p className="text-xs text-gray-500">{t("auth.inputRegisteredEmailHint")}</p>
                  </div>
                  <Button
                    type="submit"
                    className="w-full rounded-md bg-[#00A8E1] py-6 text-lg text-white transition-colors hover:bg-[#00A8E1]/90"
                  >
                    {t("auth.sendCode")}
                  </Button>
                </form>
              </>
            )}

            {step === "verify" && (
              <>
                <div className="mb-8 text-center">
                  <h1 className="mb-2 text-3xl text-white">{t("auth.verifyIdentity")}</h1>
                  <p className="text-sm text-gray-400">{t("auth.codeSentTo")}</p>
                  <p className="mt-1 text-sm text-[#00A8E1]">{email}</p>
                </div>
                <form onSubmit={handleVerifyCode} className="space-y-5">
                  <div className="space-y-2">
                    <label className="text-sm text-white">{t("auth.verificationCode")}</label>
                    <div className="flex gap-2">
                      <Input
                        type="text"
                        placeholder={t("auth.input6DigitCode")}
                        maxLength={6}
                        required
                        className="flex-1 rounded-md border-gray-700 bg-gray-900/50 px-4 py-6 text-center text-2xl tracking-widest text-white placeholder:text-base placeholder:tracking-normal placeholder:text-gray-500 focus:border-[#00A8E1] focus:ring-1 focus:ring-[#00A8E1]"
                      />
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2 text-gray-400">
                      <Clock className="h-4 w-4" />
                      <span>
                        {countdown > 0
                          ? t("auth.canResendIn", { seconds: countdown })
                          : t("auth.codeExpired")}
                      </span>
                    </div>
                    <Button
                      type="button"
                      onClick={handleResendCode}
                      disabled={countdown > 0}
                      className={`${countdown > 0 ? "cursor-not-allowed text-gray-600" : "text-[#00A8E1] hover:text-[#00A8E1]/80"} transition-colors`}
                    >
                      {t("auth.resend")}
                    </Button>
                  </div>
                  <Button
                    type="submit"
                    className="w-full rounded-md bg-[#00A8E1] py-6 text-lg text-white transition-colors hover:bg-[#00A8E1]/90"
                  >
                    {t("auth.verifyAndContinue")}
                  </Button>
                </form>
              </>
            )}

            {step === "reset" && (
              <>
                <div className="mb-8 text-center">
                  <h1 className="mb-2 text-3xl text-white">{t("auth.setNewPassword")}</h1>
                  <p className="text-sm text-gray-400">{t("auth.setSecurePassword")}</p>
                </div>
                <form onSubmit={handleResetPassword} className="space-y-5">
                  <div className="space-y-2">
                    <label className="text-sm text-white">{t("auth.newPassword")}</label>
                    <div className="relative">
                      <Lock className="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 text-gray-400" />
                      <Input
                        type="password"
                        placeholder={t("auth.inputNewPassword")}
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        required
                        className="w-full rounded-md border-gray-700 bg-gray-900/50 py-6 pr-4 pl-11 text-white placeholder:text-gray-500 focus:border-[#00A8E1] focus:ring-1 focus:ring-[#00A8E1]"
                      />
                    </div>
                    {errors.newPassword && (
                      <p className="text-xs text-red-400">{errors.newPassword}</p>
                    )}
                    <p className="text-xs text-gray-500">{t("auth.passwordHint")}</p>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm text-white">{t("auth.confirmNewPassword")}</label>
                    <div className="relative">
                      <Lock className="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 text-gray-400" />
                      <Input
                        type="password"
                        placeholder={t("auth.reInputNewPassword")}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        className="w-full rounded-md border-gray-700 bg-gray-900/50 py-6 pr-4 pl-11 text-white placeholder:text-gray-500 focus:border-[#00A8E1] focus:ring-1 focus:ring-[#00A8E1]"
                      />
                    </div>
                    {errors.confirmPassword && (
                      <p className="text-xs text-red-400">{errors.confirmPassword}</p>
                    )}
                  </div>
                  <div className="rounded-md border border-blue-800/30 bg-blue-900/20 p-4">
                    <p className="text-xs text-blue-300">
                      <strong>{t("auth.passwordSecurityTip")}</strong>
                      <br />• {t("auth.passwordTip1")}
                      <br />• {t("auth.passwordTip2")}
                      <br />• {t("auth.passwordTip3")}
                    </p>
                  </div>
                  <Button
                    type="submit"
                    className="w-full rounded-md bg-[#00A8E1] py-6 text-lg text-white transition-colors hover:bg-[#00A8E1]/90"
                  >
                    {t("auth.resetPasswordBtn")}
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
                  <h1 className="mb-3 text-3xl text-white">{t("auth.passwordResetSuccess")}</h1>
                  <p className="mb-8 text-sm text-gray-400">
                    {t("auth.passwordResetSuccessDesc1")}
                    <br />
                    {t("auth.passwordResetSuccessDesc2")}
                  </p>
                  <Button
                    onClick={onBack}
                    className="w-full rounded-md bg-[#00A8E1] py-6 text-lg text-white transition-colors hover:bg-[#00A8E1]/90"
                  >
                    {t("auth.backToLogin")}
                  </Button>
                </div>
              </>
            )}
          </div>
          {step !== "success" && (
            <div className="mt-6 text-center text-xs text-gray-500">
              <p>
                {t("auth.securityNote1")}
                <br />
                {t("auth.securityNote2")}
              </p>
            </div>
          )}
        </div>
      </div>
      <div className="absolute right-0 bottom-0 left-0 z-0 h-32 bg-linear-to-t from-[#0F171E] to-transparent" />
    </div>
  );
}
