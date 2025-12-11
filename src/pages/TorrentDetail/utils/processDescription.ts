export const processDescription = (description: string) => {
  if (!description) return '';

  let processed = description;

  // 1. 预处理文本：替换 HTML 实体
  processed = processed
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

  // 2. BBCode 解析 (基于常见的 NexusPHP/PT 站点 BBCode 规则)

  // [quote]Quote[/quote] -> fieldset or remove if mediainfo
  processed = processed.replace(
    /\[quote\]([\s\S]*?)\[\/quote\]/gi,
    (match, content) => {
      // Check if content looks like mediainfo (contains "General", "Video", "Audio" sections)
      // or specifically the "General" section which usually starts mediainfo
      if (content.includes('General') && content.includes('Unique ID') && content.includes('Video') && content.includes('Audio')) {
        return ''; // Hide mediainfo
      }
      // Simpler check: often starts with "General"
      if (/^\s*General\s*Unique ID/.test(content) || /General[\s\S]*Video[\s\S]*Audio/.test(content)) {
        return '';
      }

      return `<fieldset style="border: 1px solid #4B5563; border-radius: 0.375rem; padding: 1rem; background-color: rgba(31, 41, 55, 0.5); margin: 1rem 0;"><legend style="color: #9CA3AF; padding: 0 0.5rem; font-size: 0.875rem;">引用</legend><div style="color: #D1D5DB; font-style: italic;">${content}</div></fieldset>`;
    }
  );

  // [url=link]text[/url] -> <a href="link">text</a>
  // 注意：需要处理可能的嵌套，这里使用非贪婪匹配
  processed = processed.replace(
    /\[url=(.*?)\](.*?)\[\/url\]/gi,
    '<a href="$1" target="_blank" rel="noopener noreferrer" style="color: #FBBF24; text-decoration: underline; transition: color 0.2s;" onmouseover="this.style.color=\'#F59E0B\'" onmouseout="this.style.color=\'#FBBF24\'">$2</a>'
  );
  // [url]link[/url] -> <a href="link">link</a>
  processed = processed.replace(
    /\[url\](.*?)\[\/url\]/gi,
    '<a href="$1" target="_blank" rel="noopener noreferrer" style="color: #FBBF24; text-decoration: underline; transition: color 0.2s;" onmouseover="this.style.color=\'#F59E0B\'" onmouseout="this.style.color=\'#FBBF24\'">$1</a>'
  );

  // [img]url[/img] -> <img src="url" />
  processed = processed.replace(
    /\[img\](.*?)\[\/img\]/gi,
    '<img src="$1" alt="Image" style="max-width: 100%; height: auto; border-radius: 0.5rem; margin: 0.5rem 0;" loading="lazy" />'
  );

  // [color=red]text[/color] -> <span style="color: red">text</span>
  processed = processed.replace(
    /\[color=(.*?)\]([\s\S]*?)\[\/color\]/gi,
    (match, color, content) => {
      // 安全检查：防止 color 注入恶意样式，虽然 react dangerouslySetInnerHTML 不会执行 script，但防个万一
      // 简单只允许 字母/数字/#
      const safeColor = /^[a-zA-Z0-9#]+$/.test(color) ? color : 'inherit';
      return `<span style="color: ${safeColor};">${content}</span>`;
    }
  );

  // [size=4]text[/size] -> <span style="font-size: 1.25em">text</span>
  // 简单映射：1->0.75em, 2->1em, 3->1.25em, 4->1.5em, 5->2em ... 或者直接用 em
  processed = processed.replace(
    /\[size=(.*?)\]([\s\S]*?)\[\/size\]/gi,
    (match, size, content) => {
      const sizeNum = parseInt(size);
      let fontSize = '1em';
      if (!isNaN(sizeNum)) {
        // 简单的比例转换，可视情况调整
        // NexusPHP size 通常 1-7, 默认可能 2 或 3
        // 假设基准是 3=1rem (16px)
        const scale = 0.5 + (sizeNum * 0.25);
        if (scale > 4) fontSize = '4em'; // max limit
        else fontSize = `${scale}em`;
      }
      return `<span style="font-size: ${fontSize};">${content}</span>`;
    }
  );

  // [b]text[/b]
  processed = processed.replace(
    /\[b\]([\s\S]*?)\[\/b\]/gi,
    '<strong style="font-weight: bold; color: #E5E7EB;">$1</strong>'
  );

  // [i]text[/i]
  processed = processed.replace(
    /\[i\]([\s\S]*?)\[\/i\]/gi,
    '<em style="font-style: italic;">$1</em>'
  );

  // [u]text[/u]
  processed = processed.replace(
    /\[u\]([\s\S]*?)\[\/u\]/gi,
    '<u style="text-decoration: underline;">$1</u>'
  );

  // 处理换行 \r\n, \n -> <br>
  // 但要注意不要在已经闭合的 block tags 后多加 br（简单处理暂不考虑太复杂）
  processed = processed.replace(/\r\n/g, '<br/>').replace(/\n/g, '<br/>');

  // ◎ 作为一个特征符号，通常用于 key-value，可以高亮 key
  // e.g. ◎译　　名 -> <span class="highlight">◎译　　名</span>
  processed = processed.replace(
    /^(◎.*?)([\s　]+)/gm,
    '<span style="color: #F59E0B; font-weight: bold;">$1</span>$2'
  );


  // 恢复之前可能被转义的 HTML 标签（如果 description 本身可能混合了 HTML 和 BBCode，这步很危险）
  // 假设输入主要是 BBCode。如果输入混合了，上述转义逻辑可能需要调整。
  // 鉴于用户提供的 description 例子是纯文本 + BBCode，转义 < > 是对的。
  // 但是我们上面生成的 html 标签也包含 < >，在第一步转义后，现在我们生成的标签是直接字符串拼接的，
  // 所以返回的 result string 里既有 &lt; (原始内容) 也有 < (我们生成的)。
  // dangerouslySetInnerHTML 会解析 < 为标签，显示 &lt; 为字符。这是正确的。

  return processed;
};
