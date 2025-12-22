/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type UnifiedResponseDto = {
    /**
     * 业务状态码。1000 表示成功，其它为失败。
     */
    code: number;
    /**
     * 提示信息。成功固定为 ok，失败为友好错误提示。
     */
    message: string;
    /**
     * 业务数据。失败时通常为包含 description 的对象或 null。
     */
    data: Record<string, any>;
    /**
     * 请求路径。
     */
    path: string;
    /**
     * ISO 8601 时间戳。
     */
    timestamp: string;
};

