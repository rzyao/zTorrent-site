/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type UpdateTorrentDto = {
    /**
     * 种子ID
     */
    id: string;
    /**
     * 种子名称
     */
    name?: string;
    /**
     * 描述
     */
    description?: string;
    /**
     * 分类
     */
    category?: string;
    title?: string;
    subTitle?: string;
    year?: number;
    standard?: string;
    videoCodec?: string;
    audioCodec?: string;
    productionTeam?: string;
    region?: string;
    imdbUrl?: string;
    doubanUrl?: string;
    subtitleType?: string;
    /**
     * 语言类型
     */
    language?: string;
    mediaInfo?: string;
    /**
     * 是否匿名
     */
    isAnonymous?: boolean;
    /**
     * 剧照链接数组
     */
    stills?: Array<string>;
    /**
     * 剧照缩略图数组
     */
    stillsThumbs?: Array<string>;
    /**
     * 是否启用
     */
    isEnabled?: boolean;
    /**
     * 是否可见
     */
    visible?: boolean;
    /**
     * 是否被封禁
     */
    isBanned?: boolean;
    /**
     * 是否 H&R
     */
    isHr?: boolean;
    approvalStatus?: string;
    /**
     * 审批时间
     */
    approvedAt?: string;
    /**
     * 价格
     */
    price?: number;
    source?: string;
    /**
     * 标签数组
     */
    tags?: Array<string>;
    /**
     * 徽章数组：热门、典藏、推荐
     */
    badges?: Array<string>;
    /**
     * 多文件列表
     */
    multiFileList?: Array<string>;
    nfoPath?: string;
    /**
     * IMDb评分 0-10，保留1位小数
     */
    imdbRating?: number;
    /**
     * 豆瓣评分 0-10，保留1位小数
     */
    doubanRating?: number;
};

