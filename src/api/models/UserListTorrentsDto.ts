/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type UserListTorrentsDto = {
    /**
     * 页码
     */
    page?: number;
    /**
     * 每页数量
     */
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
    /**
     * 搜索关键词（模糊匹配标题和副标题）
     */
    keyword?: string;
};
export namespace UserListTorrentsDto {
    /**
     * 排序字段
     */
    export enum orderBy {
        UPLOADED_AT = 'uploadedAt',
        SIZE = 'size',
        SEEDERS = 'seeders',
        DOWNLOADS = 'downloads',
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

