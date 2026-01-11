/**
 * 发送邀请表单数据
 */
export interface SendInviteFormData {
  email: string;
  username: string;
}

/**
 * 批量授予表单数据
 */
export interface BatchGrantFormData {
  levels?: string[];
  roles?: string[];
  logic: "OR" | "AND";
  permanent: number;
  temporaryCount: number;
  temporaryExpiresAt?: any; // Dayjs
}

/**
 * 选项类型
 */
export interface SelectOption {
  label: string;
  value: string;
}
