/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type UnifiedResponseDto = {
    /**
     * 业务状态码。0 表示成功，非 0 表示错误。
     */
    code: number;
    /**
     * 统一成功消息，错误时为约定字符串。
     */
    message: string;
    /**
     * 实际业务数据。错误时通常为 null 或包含详细错误信息。
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

