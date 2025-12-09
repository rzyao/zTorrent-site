// 断种页面类型定义，集中管理业务相关的 TypeScript 类型，便于复用与维护
// 说明：
// - TabType：页面的三类视图标签
// - DeadTorrent：断种条目基础数据结构

export type TabType = 'hall' | 'myPublished' | 'myDownloaded';

export interface DeadTorrent {
  // 唯一标识
  id: string;
  // 标题（影片+版本信息）
  title: string;
  // 文件大小（字符串展示）
  size: string;
  // 已上传体积（字符串展示）
  uploaded: string;
  // 已下载体积（字符串展示）
  downloaded: string;
  // 分享率
  ratio: number;
  // 断种时长（字符串展示）
  deadTime: string;
  // 可能损失的奖励（金币）
  potentialBonus: number;
  // 最后一次做种时间（字符串展示）
  lastSeedTime: string;
  // 做种人数
  seeders: number;
  // 海报图片地址
  poster: string;
  // 分类（如 电影、剧集）
  category: string;
  // 断种原因
  reason: string;
  // 发布者用户名
  publisher: string;
  // 悬赏总额（金币）
  bounty: number;
  // 悬赏人数
  bountyCount: number;
}

export interface TabStats {
  // 当前列表条目数
  total: number;
  // 当前列表悬赏总额
  totalBounty: number;
  // 平均悬赏金额
  avgBounty: number;
}

