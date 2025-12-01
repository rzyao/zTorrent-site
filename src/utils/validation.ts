export function isValidPassword(pwd: string): boolean {
  if (typeof pwd !== 'string') return false;
  if (pwd.length < 8) return false;
  const hasLetter = /[A-Za-z]/.test(pwd);
  const hasDigit = /\d/.test(pwd);
  return hasLetter && hasDigit;
}

export function passwordErrorMessage(): string {
  return '密码至少8个字符，且需包含字母和数字';
}
