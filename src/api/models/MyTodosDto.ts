/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type MyTodosDto = {
    page?: number;
    pageSize?: number;
    priority?: MyTodosDto.priority | null;
    category?: MyTodosDto.category | null;
};
export namespace MyTodosDto {
    export enum priority {
        LOW = 'low',
        NORMAL = 'normal',
        HIGH = 'high',
        URGENT = 'urgent',
    }
    export enum category {
        TECHNICAL = 'technical',
        ACCOUNT = 'account',
        RESOURCE = 'resource',
        REPORT = 'report',
        OTHER = 'other',
    }
}

