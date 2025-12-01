import { useTorrentDownload } from './useTorrentDownload';

class MockTorrentsService {
  static async torrentsControllerCreateDownloadUrl(_: { torrentId: string }) {
    return { data: { url: 'https://api.example.com/download/abc123' } } as any;
  }
  static async torrentsControllerRecordDownload(_: { torrentId: string }) {
    return { data: { ok: true } } as any;
  }
}

class MockDownloadsService {
  static async downloadsControllerDownload(_: string) {
    return new Blob(['mock'], { type: 'application/x-bittorrent' });
  }
}

export async function runUseTorrentDownloadTests() {
  // 简单替换全局服务（仅在本测试文件作用域）
  const originalTorrents = (globalThis as any).TorrentsService;
  const originalDownloads = (globalThis as any).DownloadsService;
  (globalThis as any).TorrentsService = MockTorrentsService;
  (globalThis as any).DownloadsService = MockDownloadsService;

  const logs: string[] = [];
  const { downloadByTorrentId } = useTorrentDownload({
    onInfo: (m) => logs.push(`info:${m}`),
    onError: (m) => logs.push(`error:${m}`),
  } as any);

  await downloadByTorrentId('id-1', 'name-1');
  console.assert(!logs.some((l) => l.startsWith('error:')), '下载不应报错');

  // 连续调用测试节流：第二次应提示节流
  await downloadByTorrentId('id-1', 'name-1');
  console.assert(logs.some((l) => l.includes('操作过于频繁')), '应触发前端节流提示');

  // 还原
  (globalThis as any).TorrentsService = originalTorrents;
  (globalThis as any).DownloadsService = originalDownloads;
}

// 开发环境手动验证：取消注释
// runUseTorrentDownloadTests();

