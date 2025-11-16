/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type UserListTorrentsDto = {
    page?: number;
    limit?: number;
    /**
     * 用户可展示分类中进一步筛选的分类ID
     */
    category?: string;
    /**
     * 排序字段
     */
    orderBy?: UserListTorrentsDto.orderBy;
    /**
     * 排序方向
     */
    order?: UserListTorrentsDto.order;
};
export namespace UserListTorrentsDto {
    /**
     * 排序字段
     */
    export enum orderBy {
        UPLOADED_AT = 'uploadedAt',
        SIZE = 'size',
        SEEDERS = 'seeders',
        DOWNLOADING_COUNT = 'downloadingCount',
        COMPLETED_COUNT = 'completedCount',
    }
    /**
     * 排序方向
     */
    export enum order {
        ASC = 'ASC',
        DESC = 'DESC',
    }
}

