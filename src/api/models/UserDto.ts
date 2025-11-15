/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type UserDto = {
    /**
     * 用户ID
     */
    id: string;
    /**
     * 用户名
     */
    username: string;
    /**
     * 邮箱
     */
    email: string;
    /**
     * 用户状态
     */
    status: UserDto.status;
    /**
     * 角色列表
     */
    roles: Array<string>;
    /**
     * 权限列表
     */
    permissions: Array<string>;
    /**
     * 用户等级
     */
    level: UserDto.level;
    /**
     * 是否为VIP
     */
    isVip: boolean;
    /**
     * VIP等级
     */
    vipLevel: UserDto.vipLevel;
    /**
     * 是否有下载权限
     */
    hasDownloadPermission: boolean;
    /**
     * 最后访问时间
     */
    lastVisitAt: Record<string, any> | null;
    /**
     * 最后登录时间
     */
    lastLoginAt: Record<string, any> | null;
    /**
     * 最后登录IP
     */
    lastLoginIp: Record<string, any> | null;
    /**
     * 下载 passkey（敏感信息）
     */
    passkey: string;
    /**
     * 创建时间
     */
    createdAt: string;
    /**
     * 更新时间
     */
    updatedAt: string;
};
export namespace UserDto {
    /**
     * 用户状态
     */
    export enum status {
        PENDING = 'pending',
        ACTIVE = 'active',
        BANNED = 'banned',
    }
    /**
     * 用户等级
     */
    export enum level {
        P1 = 'P1',
        P2 = 'P2',
        P3 = 'P3',
        P4 = 'P4',
        P5 = 'P5',
        P6 = 'P6',
        P7 = 'P7',
        P8 = 'P8',
        P9 = 'P9',
        P10 = 'P10',
    }
    /**
     * VIP等级
     */
    export enum vipLevel {
        V0 = 'V0',
        V1 = 'V1',
        V2 = 'V2',
        V3 = 'V3',
        V4 = 'V4',
        V5 = 'V5',
    }
}

