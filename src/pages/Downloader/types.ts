// 下载器页面 - 类型定义
// 说明：将原组件中的接口与类型集中到单独的 types 文件，便于共享与复用，提升类型可维护性。

// 支持的下载器类型枚举（联合类型）
export type DownloaderType = 'qBittorrent' | 'Transmission' | 'Deluge' | 'rTorrent';

// 下载路径信息（用于详情弹窗中的路径列表展示）
export interface DownloadPath {
  name: string; // 路径的别名，便于识别
  path: string; // 实际文件系统路径
  freeSpace: number; // 剩余空间（字节数），用于可视化空间进度条
}

// 单个下载器的核心结构
export interface Downloader {
  id: string; // 唯一标识，便于列表渲染与增删改查
  name: string; // 显示名称
  type: DownloaderType; // 下载器类型（用于展示图标与不同的颜色）
  host: string; // 主机地址
  port: number; // 端口
  username: string; // 登录用户名
  password: string; // 登录密码（仅前端表单展示，不做存储）
  ssl: boolean; // 是否启用 SSL/TLS 加密
  status: 'connected' | 'disconnected' | 'error'; // 连接状态
  version?: string; // 版本信息（可选）
  uploadSpeed?: number; // 当前上传速度（B/s）
  downloadSpeed?: number; // 当前下载速度（B/s）
  activeTorrents?: number; // 活跃种子数
  totalTorrents?: number; // 总种子数
  freeSpace?: number; // 可用空间（字节）
  tags?: string[]; // 远程下载器返回的标签列表（详情弹窗）
  downloadPaths?: DownloadPath[]; // 远程下载器返回的下载路径列表（详情弹窗）
}

// 新增：表单专用类型，明确前端收集与提交的数据结构，避免直接复用完整 Downloader 类型
export interface DownloaderForm {
  name: string;
  type: DownloaderType;
  host: string;
  port: number;
  username: string;
  password: string;
  ssl: boolean;
}

