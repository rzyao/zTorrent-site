export const processDescription = (description: string) => {
  if (!description) return '';

  // 配置br标签的高度参数
  const brHeight = '2px';  // 可以调整这个值
  const brMargin = '2px 0'; // 上下边距

  // 处理图片标签 { { { img1 } } }, { { { img2 } } }, 等，使用实际的stills数据
  // let processed = description.replace(/\{\{\{img(\d+)\}\}\}/g, (match, num) => {
  //   const index = parseInt(num) - 1; // 转换为0-based索引
  //   const imageUrl = stills[index] || `https://via.placeholder.com/600x400?text=Image+${num}`;
  //   return `<div style="margin: 1rem 0;"><img src="${imageUrl}" alt="剧照${num}" style="max-width: 100%; border-radius: 0.5rem; cursor: pointer; transition: opacity 0.2s;" onmouseover="this.style.opacity='0.9'" onmouseout="this.style.opacity='1'" /></div>`;
  // });

  let processed = description

  // 处理链接（暖色调：链接采用 amber-400，增强可读性且更具亲和感）
  processed = processed.replace(
    /<a class=\"faqlink\" href=\"([^\"]+)\"[^>]*>([^<]+)<\/a>/g,
    '<a href="$1" target="_blank" rel="noopener noreferrer" style="color: #fbbf24; text-decoration: underline;">$2</a>'
  );

  // 处理span标签的颜色样式（暖色调映射）
  processed = processed.replace(
    /<span style="color: Blue;[^"]*">\s*<font size="5">\s*([^<]+)\s*<\/font>\s*<\/span>/g,
    '<span style="color: #fbbf24; word-break: break-word;"><font size="5">$1</font></span>'
  );

  // 处理通用的span颜色样式（将 Blue 映射为 amber-400）
  processed = processed.replace(
    /<span style="color: ([^;"]+);([^"]*)"([^>]*)>/g,
    (match, color, otherStyles, otherAttrs) => {
      // 将蓝色映射为暖色 amber，其他颜色保持不变
      const newColor = color.toLowerCase() === 'blue' ? '#fbbf24' : color;
      return `<span style="color: ${newColor};${otherStyles}"${otherAttrs}>`;
    }
  );

  // 处理fieldset和legend（暖色调：边框/背景/标题采用 amber 系）
  processed = processed.replace(
    /<fieldset><legend>\s*([^<]+)\s*<\/legend>/g,
    '<fieldset style="border: 2px solid rgba(245, 158, 11, 0.3); border-radius: 0.5rem; padding: 1rem; background-color: rgba(245, 158, 11, 0.05); margin: 1rem 0; color: #d1d5db;"><legend style="color: #fbbf24; padding: 0 0.5rem;">$1</legend>'
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
