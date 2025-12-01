/**
 * 解析 Content-Disposition 响应头中的文件名，支持 RFC 5987（filename*）与传统 filename。
 * 示例：
 *  - attachment; filename="demo.torrent"
 *  - attachment; filename*=UTF-8''%E4%B8%AD%E6%96%87.torrent
 */
export function parseFilenameFromContentDisposition(header?: string): string | undefined {
  if (!header) return undefined;
  try {
    const parts = header.split(';').map((p) => p.trim());
    // 优先解析 filename*
    const star = parts.find((p) => p.toLowerCase().startsWith('filename*='));
    if (star) {
      const value = star.split('=')[1] ?? '';
      // 形如 UTF-8''%E4%B8%AD%E6%96%87.torrent 或 utf-8''demo.torrent
      const twoQuotesIdx = value.indexOf("''");
      if (twoQuotesIdx >= 0) {
        const encoded = value.substring(twoQuotesIdx + 2);
        const decoded = decodeURIComponent(encoded.replace(/\"/g, ''));
        if (decoded) return decoded;
      } else {
        const cleaned = value.replace(/^"|"$/g, '');
        if (cleaned) return cleaned;
      }
    }
    // 退化解析 filename
    const plain = parts.find((p) => p.toLowerCase().startsWith('filename='));
    if (plain) {
      let value = plain.split('=')[1] ?? '';
      value = value.replace(/^"|"$/g, '');
      if (value) return value;
    }
  } catch {
    // 忽略解析错误，走回退逻辑
  }
  return undefined;
}

/**
 * 将 Blob 保存为文件，通过创建临时的 ObjectURL 并触发隐藏的 a 标签下载。
 * filename 允许包含路径分隔符，会被浏览器忽略，仅保留文件名。
 */
export function saveBlobAsFile(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename || 'download.torrent';
  // 某些浏览器需要元素在文档中
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

