/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type ListPlaylistsDto = {
    /**
     * 列表类型：public=公开片单, mine=我的片单, following=关注的片单
     */
    listType: ListPlaylistsDto.listType;
    page?: number;
    limit?: number;
    keyword?: string;
    visibility?: ListPlaylistsDto.visibility;
    /**
     * 片单类型筛选
     */
    type?: ListPlaylistsDto.type;
};
export namespace ListPlaylistsDto {
    /**
     * 列表类型：public=公开片单, mine=我的片单, following=关注的片单
     */
    export enum listType {
        PUBLIC = 'public',
        MINE = 'mine',
        FOLLOWING = 'following',
    }
    export enum visibility {
        PUBLIC = 'public',
        PRIVATE = 'private',
    }
    /**
     * 片单类型筛选
     */
    export enum type {
        MOVIE = 'movie',
        SERIES = 'series',
        ADULT = 'adult',
        MUSIC = 'music',
    }
}

