/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type SendInviteDto = {
    email: string;
    /**
     * 被邀请者的用户名（用于重复校验）
     */
    username: string;
    /**
     * 预生成邀请码ID（可选）
     */
    codeId?: string;
};

