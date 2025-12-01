/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type ResendInviteDto = {
    /**
     * 邀请记录ID（Snowflake字符串）
     */
    recordId: string;
    /**
     * 覆盖目标邮箱（需谨慎）
     */
    email?: string;
};

