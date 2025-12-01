import { parseFilenameFromContentDisposition } from './saveBlobAsFile';

export function runSaveBlobAsFileTests() {
  const cases: Array<{ header?: string; expect?: string }> = [
    { header: 'attachment; filename="demo.torrent"', expect: 'demo.torrent' },
    { header: "attachment; filename*=UTF-8''%E4%B8%AD%E6%96%87.torrent", expect: '中文.torrent' },
    { header: 'inline', expect: undefined },
    { header: undefined, expect: undefined },
  ];
  for (const c of cases) {
    const got = parseFilenameFromContentDisposition(c.header);
    console.assert(got === c.expect, `expect ${c.expect}, got ${got}`);
  }
}

// 如需在开发环境验证，取消下行注释：
// runSaveBlobAsFileTests();

