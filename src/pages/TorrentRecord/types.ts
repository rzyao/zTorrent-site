/** 种子状态类型 */
export type TorrentStatus = 'uploaded' | 'seeding' | 'downloading' | 'completed' | 'incomplete';

/** 种子数据接口 */
export interface Torrent {
  id: number;
  name: string;
  category: string;
  size: string;
  uploaded: string;
  downloaded: string;
  ratio: number;
  seeders: number;
  leechers: number;
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
