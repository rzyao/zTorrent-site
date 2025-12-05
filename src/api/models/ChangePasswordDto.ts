/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type ChangePasswordDto = {
    /**
     * 当前密码明文
     */
    currentPassword: string;
    /**
     * 新密码明文（至少8位，需包含字母和数字）
     */
    newPassword: string;
    /**
     * 确认新密码，需与 newPassword 一致
     */
    confirmNewPassword: string;
};

