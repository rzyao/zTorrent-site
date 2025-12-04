import { useState } from 'react';
import { isValidPassword, passwordErrorMessage } from '@/utils/validation';

// 密码表单状态与校验逻辑 Hook
// 职责：管理当前/新/确认密码与错误信息，提供可更新与提交方法

export function usePasswordForm() {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [passwordErrors, setPasswordErrors] = useState<{ current?: string; new?: string; confirm?: string }>({});

  const canUpdatePassword = () => {
    if (!currentPassword) return false;
    if (!isValidPassword(newPassword)) return false;
    if (confirmNewPassword !== newPassword) return false;
    return true;
  };

  const handleUpdatePassword = () => {
    const errs: { current?: string; new?: string; confirm?: string } = {};
    if (!currentPassword) errs.current = '请输入当前密码';
    if (!isValidPassword(newPassword)) errs.new = passwordErrorMessage();
    if (confirmNewPassword !== newPassword) errs.confirm = '两次输入的密码不一致';
    setPasswordErrors(errs);
    if (Object.keys(errs).length > 0) return;
    // TODO: 这里可接入后端密码更新接口
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
    canUpdatePassword,
    handleUpdatePassword,
  };
}
