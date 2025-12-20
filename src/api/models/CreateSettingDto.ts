/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type CreateSettingDto = {
    /**
     * 设置键
     */
    key: string;
    /**
     * 人类可读描述（可选）
     */
    description?: string;
    /**
     * 值类型（可选）
     */
    type?: CreateSettingDto.type;
    /**
     * 设置分组（可选）
     */
    group?: string;
    /**
     * 是否允许运行时修改（可选）
     */
    mutable?: boolean;
    /**
     * 分组内排序值（越小越靠前，可选）
     */
    sort?: number;
};
export namespace CreateSettingDto {
    /**
     * 值类型（可选）
     */
    export enum type {
        STRING = 'string',
        NUMBER = 'number',
        BOOLEAN = 'boolean',
        JSON = 'json',
        TIMESTAMP = 'timestamp',
        RATE = 'rate',
        PASSWORD = 'password',
    }
}

