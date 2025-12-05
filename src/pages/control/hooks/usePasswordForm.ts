import { useState } from 'react';
import { isValidPassword, passwordErrorMessage } from '@/utils/validation';
import { AuthService, ApiError } from '@/api';
import { customToast } from '@/hooks/useToast';

// 密码表单状态与校验逻辑 Hook
// 职责：管理当前/新/确认密码与错误信息，提供可更新与提交方法

export function usePasswordForm() {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [passwordErrors, setPasswordErrors] = useState<{ current?: string; new?: string; confirm?: string }>({});
  const [updating, setUpdating] = useState(false);

  const canUpdatePassword = () => {
    if (!currentPassword) return false;
    if (!isValidPassword(newPassword)) return false;
    if (confirmNewPassword !== newPassword) return false;
    return true;
  };

  const handleUpdatePassword = async () => {
    const errs: { current?: string; new?: string; confirm?: string } = {};
    if (!currentPassword) errs.current = '请输入当前密码';
    if (!isValidPassword(newPassword)) errs.new = passwordErrorMessage();
    if (confirmNewPassword !== newPassword) errs.confirm = '两次输入的密码不一致';
    setPasswordErrors(errs);
    if (Object.keys(errs).length > 0) return;

    if (updating) return;
    setUpdating(true);
    try {
      const res = await AuthService.authControllerChangePassword({
        currentPassword,
        newPassword,
        confirmNewPassword,
      });
      if (res?.code === 0 || res?.data?.ok) {
        customToast.success('密码修改成功');
        setCurrentPassword('');
        setNewPassword('');
        setConfirmNewPassword('');
        setPasswordErrors({});
      } else {
        const msg = res?.message || '密码修改失败';
        customToast.error(msg);
      }
    } catch (err: any) {
      if (err instanceof ApiError) {
        const body = err.body || {};
        const msg: string = body?.message || '请求失败';
        const code = body?.code;
        const serverErrs: { current?: string; new?: string; confirm?: string } = {};
        if (code === 40001 || /不一致|确认/.test(msg)) serverErrs.confirm = msg;
        if (code === 40002 || /复杂度|至少|弱|强/.test(msg)) serverErrs.new = msg;
        if (code === 40003 || /当前密码|错误/.test(msg)) serverErrs.current = msg;
        setPasswordErrors(serverErrs);
        if (!serverErrs.current && !serverErrs.new && !serverErrs.confirm) customToast.error(msg);
      } else {
        customToast.error('网络或未知错误');
      }
    } finally {
      setUpdating(false);
    }
  };

  return {
    currentPassword,
    setCurrentPassword,
    newPassword,
    setNewPassword,
    confirmNewPassword,
    setConfirmNewPassword,
    passwordErrors,
    setPasswordErrors,
    updating,
    canUpdatePassword,
    handleUpdatePassword,
  };
}
