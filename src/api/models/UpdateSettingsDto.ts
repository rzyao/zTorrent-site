/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type UpdateSettingsDto = {
    /**
     * 站点标题
     */
    siteTitle?: string;
    /**
     * 站点 URL
     */
    siteUrl?: string;
    /**
     * 是否允许用户注册
     */
    registrationEnabled?: boolean;
    /**
     * 注册是否需要邀请码
     */
    inviteCodeRequired?: boolean;
    /**
     * 是否允许发送邀请
     */
    inviteEnabled?: boolean;
    /**
     * 发件邮箱（覆盖默认 MAIL_FROM）
     */
    mailFrom?: string;
};

