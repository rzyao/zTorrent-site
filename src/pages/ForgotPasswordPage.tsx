import { useState } from 'react';
import { useDynamicTitle } from '@/hooks/useDynamicTitle';
import { isValidPassword, passwordErrorMessage } from '../utils/validation';
import { Mail, Lock, ArrowLeft, Clock, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '../components/ui/input';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';

interface ForgotPasswordPageProps { onBack: () => void; }

export function ForgotPasswordPage({ onBack }: ForgotPasswordPageProps) {
  useDynamicTitle('找回密码');
  const [step, setStep] = useState<'email' | 'verify' | 'reset' | 'success'>('email');
  const [countdown, setCountdown] = useState(0);
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState<{ newPassword?: string; confirmPassword?: string }>({});

  const handleSendCode = (e: React.FormEvent) => {
    e.preventDefault();
    setStep('verify');
    setCountdown(60);
    const timer = setInterval(() => { setCountdown((prev) => { if (prev <= 1) { clearInterval(timer); return 0; } return prev - 1; }); }, 1000);
  };

  const handleResendCode = () => {
    setCountdown(60);
    const timer = setInterval(() => { setCountdown((prev) => { if (prev <= 1) { clearInterval(timer); return 0; } return prev - 1; }); }, 1000);
  };

  const handleVerifyCode = (e: React.FormEvent) => { e.preventDefault(); setStep('reset'); };
  const handleResetPassword = (e: React.FormEvent) => {
    e.preventDefault();
    const errs: { newPassword?: string; confirmPassword?: string } = {};
    if (!isValidPassword(newPassword)) {
      errs.newPassword = passwordErrorMessage();
    }
    if (confirmPassword !== newPassword) {
      errs.confirmPassword = '两次输入的密码不一致';
    }
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;
    setStep('success');
  };

  return (
    <div className="min-h-screen bg-[#0F171E] relative overflow-hidden">
      <div className="absolute inset-0">
        <ImageWithFallback src="https://images.unsplash.com/photo-1739433437912-cca661ba902f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1920" alt="Background" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0F171E]/95 via-[#0F171E]/85 to-[#0F171E]/95" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0F171E] via-transparent to-[#0F171E]" />
      </div>

      <div className="relative z-10 px-4 md:px-8 py-6">
        <a href="#" className="flex items-center gap-1"><span className="text-white text-3xl">PT</span><span className="text-[#00A8E1] text-3xl">Tracker</span></a>
      </div>

      <div className="relative z-10 flex items-center justify-center px-4 py-12 md:py-16">
        <div className="w-full max-w-md">
          <div className="bg-black/60 backdrop-blur-md rounded-lg p-8 md:p-10 border border-gray-800">
            {step !== 'success' && (
              <Button onClick={onBack} className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-6"><ArrowLeft className="w-4 h-4" /><span className="text-xs">返回登录</span></Button>
            )}

            {step !== 'success' && (
              <div className="flex items-center justify-center gap-2 mb-8">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${step === 'email' ? 'bg-[#00A8E1] text-white' : step === 'verify' || step === 'reset' ? 'bg-green-500 text-white' : 'bg-gray-700 text-gray-400'}`}>1</div>
                <div className={`w-12 h-0.5 ${step === 'verify' || step === 'reset' ? 'bg-green-500' : 'bg-gray-700'}`} />
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${step === 'verify' ? 'bg-[#00A8E1] text-white' : step === 'reset' ? 'bg-green-500 text-white' : 'bg-gray-700 text-gray-400'}`}>2</div>
                <div className={`w-12 h-0.5 ${step === 'reset' ? 'bg-green-500' : 'bg-gray-700'}`} />
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${step === 'reset' ? 'bg-[#00A8E1] text-white' : 'bg-gray-700 text-gray-400'}`}>3</div>
              </div>
            )}

            {step === 'email' && (<>
              <div className="text-center mb-8"><h1 className="text-white text-3xl mb-2">找回密码</h1><p className="text-gray-400 text-sm">通过邮箱验证重置密码</p></div>
              <form onSubmit={handleSendCode} className="space-y-5">
                <div className="space-y-2"><label className="text-white text-sm">注册邮箱</label><div className="relative"><Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" /><Input type="email" placeholder="输入您的注册邮箱" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full bg-gray-900/50 border-gray-700 text-white pl-11 pr-4 py-6 rounded-md focus:border-[#00A8E1] focus:ring-[#00A8E1] placeholder:text-gray-500" /></div><p className="text-xs text-gray-500">请输入您注册时使用的邮箱地址</p></div>
                <Button type="submit" className="w-full bg-[#00A8E1] hover:bg-[#00A8E1]/90 text-white py-6 text-lg rounded-md transition-colors">发送验证码</Button>
              </form>
            </>)}

            {step === 'verify' && (<>
              <div className="text-center mb-8"><h1 className="text-white text-3xl mb-2">验证身份</h1><p className="text-gray-400 text-sm">验证码已发送至</p><p className="text-[#00A8E1] text-sm mt-1">{email}</p></div>
              <form onSubmit={handleVerifyCode} className="space-y-5">
                <div className="space-y-2"><label className="text-white text-sm">验证码</label><div className="flex gap-2"><Input type="text" placeholder="输入6位验证码" maxLength={6} required className="flex-1 bg-gray-900/50 border-gray-700 text-white text-center text-2xl tracking-widest px-4 py-6 rounded-md focus:border-[#00A8E1] focus:ring-[#00A8E1] placeholder:text-gray-500 placeholder:text-base placeholder:tracking-normal" /></div></div>
                <div className="flex items-center justify-between text-sm"><div className="flex items-center gap-2 text-gray-400"><Clock className="w-4 h-4" /><span>{countdown > 0 ? `${countdown}秒后可重发` : '验证码已过期'}</span></div><Button type="button" onClick={handleResendCode} disabled={countdown > 0} className={`${countdown > 0 ? 'text-gray-600 cursor-not-allowed' : 'text-[#00A8E1] hover:text-[#00A8E1]/80'} transition-colors`}>重新发送</Button></div>
                <Button type="submit" className="w-full bg-[#00A8E1] hover:bg-[#00A8E1]/90 text-white py-6 text-lg rounded-md transition-colors">验证并继续</Button>
              </form>
            </>)}

            {step === 'reset' && (<>
              <div className="text-center mb-8"><h1 className="text-white text-3xl mb-2">设置新密码</h1><p className="text-gray-400 text-sm">请设置一个安全的新密码</p></div>
              <form onSubmit={handleResetPassword} className="space-y-5">
                <div className="space-y-2"><label className="text-white text-sm">新密码</label><div className="relative"><Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" /><Input type="password" placeholder="输入新密码" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required className="w-full bg-gray-900/50 border-gray-700 text-white pl-11 pr-4 py-6 rounded-md focus:border-[#00A8E1] focus:ring-[#00A8E1] placeholder:text-gray-500" /></div>{errors.newPassword && <p className="text-xs text-red-400">{errors.newPassword}</p>}<p className="text-xs text-gray-500">至少8个字符，包含字母和数字</p></div>
                <div className="space-y-2"><label className="text-white text-sm">确认新密码</label><div className="relative"><Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" /><Input type="password" placeholder="再次输入新密码" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required className="w-full bg-gray-900/50 border-gray-700 text-white pl-11 pr-4 py-6 rounded-md focus:border-[#00A8E1] focus:ring-[#00A8E1] placeholder:text-gray-500" /></div>{errors.confirmPassword && <p className="text-xs text-red-400">{errors.confirmPassword}</p>}</div>
                <div className="bg-blue-900/20 border border-blue-800/30 rounded-md p-4"><p className="text-xs text-blue-300"><strong>密码安全提示：</strong><br />• 使用大小写字母、数字和特殊符号组合<br />• 避免使用常见密码或个人信息<br />• 定期更换密码以保障账号安全</p></div>
                <Button type="submit" className="w-full bg-[#00A8E1] hover:bg-[#00A8E1]/90 text-white py-6 text-lg rounded-md transition-colors">重置密码</Button>
              </form>
            </>)}

            {step === 'success' && (<><div className="text-center py-8"><div className="inline-flex items-center justify-center w-20 h-20 bg-green-500/20 rounded-full mb-6"><CheckCircle className="w-12 h-12 text-green-500" /></div><h1 className="text-white text-3xl mb-3">密码重置成功</h1><p className="text-gray-400 text-sm mb-8">您的密码已成功重置<br />现在可以使用新密码登录了</p><Button onClick={onBack} className="w-full bg-[#00A8E1] hover:bg-[#00A8E1]/90 text-white py-6 text-lg rounded-md transition-colors">返回登录</Button></div></>)}
          </div>
          {step !== 'success' && (<div className="mt-6 text-center text-xs text-gray-500"><p>出于安全考虑，找回密码需要邮箱验证<br />请确保您的邮箱地址准确无误</p></div>)}
        </div>
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#0F171E] to-transparent z-0" />
    </div>
  );
}
