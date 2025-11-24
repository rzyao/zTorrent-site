const processDescription = (description: string) => {
  if (!description) return '';

  // 配置br标签的高度参数
  const brHeight = '2px';  // 可以调整这个值
  const brMargin = '2px 0'; // 上下边距

  // 处理图片标签 {{{img1}}}, {{{img2}}}, 等，使用实际的stills数据
  let processed = description.replace(/\{\{\{img(\d+)\}\}\}/g, (match, num) => {
    const index = parseInt(num) - 1; // 转换为0-based索引
    const imageUrl = stills[index] || `https://via.placeholder.com/600x400?text=Image+${num}`;
    return `<div style="margin: 1rem 0;"><img src="${imageUrl}" alt="剧照${num}" style="max-width: 100%; border-radius: 0.5rem; cursor: pointer; transition: opacity 0.2s;" onmouseover="this.style.opacity='0.9'" onmouseout="this.style.opacity='1'" /></div>`;
  });

  // 处理链接
  processed = processed.replace(
    /<a class=\"faqlink\" href=\"([^\"]+)\"[^>]*>([^<]+)<\/a>/g,
    '<a href="$1" target="_blank" rel="noopener noreferrer" style="color: #00A8E1; text-decoration: underline;">$2</a>'
  );

  // 处理span标签的颜色样式
  processed = processed.replace(
    /<span style="color: Blue;[^"]*">\s*<font size="5">\s*([^<]+)\s*<\/font>\s*<\/span>/g,
    '<span style="color: #60a5fa; word-break: break-word;"><font size="5">$1</font></span>'
  );

  // 处理通用的span颜色样式
  processed = processed.replace(
    /<span style="color: ([^;"]+);([^"]*)"([^>]*)>/g,
    (match, color, otherStyles, otherAttrs) => {
      // 将蓝色映射为浅蓝色，其他颜色保持不变
      const newColor = color.toLowerCase() === 'blue' ? '#60a5fa' : color;
      return `<span style="color: ${newColor};${otherStyles}"${otherAttrs}>`;
    }
  );

  // 处理fieldset和legend
  processed = processed.replace(
    /<fieldset><legend>\s*([^<]+)\s*<\/legend>/g,
    '<fieldset style="border: 2px solid rgba(59, 130, 246, 0.3); border-radius: 0.5rem; padding: 1rem; background-color: rgba(59, 130, 246, 0.05); margin: 1rem 0; color: #d1d5db;"><legend style="color: #60a5fa; padding: 0 0.5rem;">$1</legend>'
  );

  // 处理段落
  processed = processed.replace(
    /<p>([^<]+)<\/p>/g,
    '<p style="margin: 0.5rem 0; line-height: 1.6;">$1</p>'
  );

  // 处理br标签 - 设置高度和间距，添加自定义类名
  processed = processed.replace(/<br\s*\/?>/g, `<div class="custom-br" style="height: ${brHeight}; margin: ${brMargin};"></div>`);

  return processed;
};

const processDescriptionWithObjectSupport = (description: string) => {
  if (!description) return '';
  const brHeight = '2px';
  const brMargin = '2px 0';

  const applyHtmlTweaks = (html: string) => {
    let processed = html.replace(/\{\{\{img(\d+)\}\}\}/g, (match, num) => {
      const index = parseInt(num) - 1;
      const imageUrl = stills[index] || `https://via.placeholder.com/600x400?text=Image+${num}`;
      return `<div style="margin: 1rem 0;"><img src="${imageUrl}" alt="剧照${num}" style="max-width: 100%; border-radius: 0.5rem; cursor: pointer; transition: opacity 0.2s;" onmouseover="this.style.opacity='0.9'" onmouseout="this.style.opacity='1'" /></div>`;
    });
    processed = processed.replace(
      /<a class=\"faqlink\" href=\"([^\"]+)\"[^>]*>([^<]+)<\/a>/g,
      '<a href="$1" target="_blank" rel="noopener noreferrer" style="color: #00A8E1; text-decoration: underline;">$2</a>'
    );
    processed = processed.replace(
      /<span style="color: Blue;[^"]*">\s*<font size="5">\s*([^<]+)\s*<\/font>\s*<\/span>/g,
      '<span style="color: #60a5fa; word-break: break-word;"><font size="5">$1</font></span>'
    );
    processed = processed.replace(
      /<span style="color: ([^;"]+);([^"]*)"([^>]*)>/g,
      (match, color, otherStyles, otherAttrs) => {
        const newColor = color.toLowerCase() === 'blue' ? '#60a5fa' : color;
        return `<span style="color: ${newColor};${otherStyles}"${otherAttrs}>`;
      }
    );
    processed = processed.replace(
      /<fieldset><legend>\s*([^<]+)\s*<\/legend>/g,
      '<fieldset style="border: 2px solid rgba(59, 130, 246, 0.3); border-radius: 0.5rem; padding: 1rem; background-color: rgba(59, 130, 246, 0.05); margin: 1rem 0; color: #d1d5db;"><legend style="color: #60a5fa; padding: 0 0.5rem;">$1</legend>'
    );
    processed = processed.replace(/<br\s*\/?>/g, `<div class="custom-br" style="height: ${brHeight}; margin: ${brMargin};"></div>`);
    return processed;
  };

  const parseObjectString = (str: string): any | null => {
    try {
      return JSON.parse(str);
    } catch { }
    try {
      const normalized = str
        .replace(/'([^']*)'\s*:/g, '"$1":')
        .replace(/:\s*'([^']*)'/g, ': "$1"')
        .replace(/\[\s*'([^']*)'\s*(,|])/g, (m) => m.replace(/'([^']*)'/g, '"$1"'))
        .replace(/'\s*,\s*'/g, '", "')
        .replace(/'\s*\]/g, '" ]');
      return JSON.parse(normalized);
    } catch { }
    try {
      const fallback = str.replace(/'/g, '"');
      return JSON.parse(fallback);
    } catch { }
    return null;
  };

  const renderObjectDescription = (obj: any) => {
    const parts: string[] = [];
    const fieldsetStart = (title: string) => `<fieldset style="border: 2px solid rgba(59, 130, 246, 0.3); border-radius: 0.5rem; padding: 1rem; background-color: rgba(59, 130, 246, 0.05); margin: 1rem 0; color: #d1d5db;"><legend style="color: #60a5fa; padding: 0 0.5rem;">${title}</legend>`;
    const fieldsetEnd = '</fieldset>';
    const normalizeValue = (v: any): string => {
      if (Array.isArray(v)) return v.map((x) => String(x)).join('<br/>');
      return String(v ?? '');
    };
    const linkify = (html: string) => {
      return html.replace(/`\s*(https?:\/\/[^\s`]+)\s*`/g, '<a href="$1" target="_blank" rel="noopener noreferrer" style="color: #00A8E1; text-decoration: underline;">$1</a>');
    };
    if (obj && obj['引用信息']) {
      const arr = Array.isArray(obj['引用信息']) ? obj['引用信息'] : [obj['引用信息']];
      const content = arr.map((s: any) => applyHtmlTweaks(String(s))).join('');
      parts.push(fieldsetStart('引用信息') + content + fieldsetEnd);
    }
    if (obj && obj['影片信息']) {
      const info = obj['影片信息'];
      const keys = Object.keys(info);
      const items = keys.map((k) => {
        const raw = normalizeValue((info as any)[k]);
        const withLinks = linkify(raw);
        const replacedBr = withLinks.replace(/<br\s*>/g, '<br/>');
        const tweaked = applyHtmlTweaks(replacedBr);
        return `<p style="margin: 0.5rem 0; line-height: 1.6;"><span style="color: #60a5fa; word-break: break-word;">${k}：</span> ${tweaked}</p>`;
      }).join('');
      parts.push(items);
    }
    return parts.join('');
  };

  const looksLikeObject = /^\s*\{[\s\S]*\}\s*$/.test(description) && description.includes("':");
  if (looksLikeObject) {
    const obj = parseObjectString(description);
    if (obj && typeof obj === 'object') return renderObjectDescription(obj);
  }
  return processDescription(description);
};