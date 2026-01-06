/** 种子状态类型 */
export type TorrentStatus = 'uploaded' | 'seeding' | 'downloading' | 'completed' | 'incomplete' | 'active';

/** 种子数据接口 */
export interface Torrent {
  id: number;
  title: string;
  subTitle: string;
  name: string;
  category: string;
  size: string;
  uploaded: string; // 上传量（字节数格式化）
  downloaded: string; // 下载量（字节数格式化），与“总下载数”区分：此为流量
  ratio: number;
  seeders: number; // 做种人数（来自接口）
  leechers: number; // 下载人数（来自接口）
  totalDownloads: number; // 总下载次数（来自接口，如 downloads/download_count/totalDownloads）
  progress: number;
  uploadDate: string;
  completeDate?: string;
  status: TorrentStatus;
}

export interface TorrentStats {
  uploaded: number;
  seeding: number;
  downloading: number;
  completed: number;
  incomplete: number;
}
