/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type ListInboxDto = {
    /**
     * 页码
     */
    page: number;
    /**
     * 每页条数
     */
    limit: number;
    /**
     * 仅未读
     */
    onlyUnread?: boolean;
    /**
     * 仅收藏
     */
    onlyFavorites?: boolean;
};

