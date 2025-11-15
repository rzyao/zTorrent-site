/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type ResetPasswordDto = {
    /**
     * 重置令牌（邮箱链接中的 token）
     */
    token: string;
    /**
     * 新密码（至少6位）
     */
    newPassword: string;
};

