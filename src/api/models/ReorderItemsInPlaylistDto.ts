/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { PlaylistItemOrderInfo } from './PlaylistItemOrderInfo';
export type ReorderItemsInPlaylistDto = {
    /**
     * 片单ID
     */
    playlistId: string;
    /**
     * 排序列表（按顺序排列的内容项）
     */
    order: Array<PlaylistItemOrderInfo>;
};

