/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type SearchFilmsForPlaylistDto = {
    /**
     * 搜索字符串（支持ID精确与标题/原标题模糊）
     */
    search: string;
    /**
     * 片单ID（用于排除该片单已关联的影片）
     */
    playlistId: string;
    /**
     * 返回数量上限（默认50）
     */
    limit?: number;
};

