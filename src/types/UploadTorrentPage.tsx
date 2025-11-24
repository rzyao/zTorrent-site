/**
 * 副分类（SubCategory）的接口定义
 */
interface SubCategory {
  /** 副分类的唯一标识符（通常是英文简写） */
  id: string;
  /** 副分类的中文名称 */
  name: string;
}

/**
 * 主分类（MainCategory）的接口定义
 */
interface MainCategory {
  /** 主分类的唯一标识符（数字字符串） */
  id: string;
  /** 主分类的中文名称 */
  name: string;
  /** 该主分类下的副分类列表 */
  subCategories: SubCategory[];
}

/**
 * 完整的分类树（CategoryTree）类型定义
 * 它是一个包含所有主分类对象的数组。
 */
export type CategoryTree = MainCategory[];

// 导出您提供的常量并为其应用类型
export const categoryTree: CategoryTree = [
  {
    id: 'Movie',
    name: '电影',
    subCategories: [
      { id: 'action', name: '动作' },
      { id: 'comedy', name: '喜剧' },
      { id: 'drama', name: '剧情' },
      { id: 'thriller', name: '惊悚' },
      { id: 'scifi', name: '科幻' },
      { id: 'romance', name: '爱情' },
      { id: 'horror', name: '恐怖' },
      { id: 'animation', name: '动画' },
      { id: 'adventure', name: '冒险' },
      { id: 'fantasy', name: '奇幻' },
    ],
  },
  {
    id: 'TV Series',
    name: '电视剧',
    subCategories: [
      { id: 'modern', name: '现代剧' },
      { id: 'costume', name: '古装剧' },
      { id: 'idol', name: '偶像剧' },
      { id: 'suspense', name: '悬疑剧' },
      { id: 'historical', name: '历史剧' },
      { id: 'military', name: '军旅剧' },
      { id: 'sitcom', name: '情景喜剧' },
    ],
  },
  {
    id: 'Anime',
    name: '动漫',
    subCategories: [
      { id: 'series', name: '番剧/连载' },
      { id: 'movie', name: '剧场版/电影' },
      { id: 'ova', name: 'OVA/特别篇' },
      { id: 'kids', name: '少儿/亲子' },
      { id: 'original', name: '原创' },
    ],
  },
  {
    id: 'Music',
    name: '音乐',
    subCategories: [
      { id: 'mandarin', name: '华语' },
      { id: 'western', name: '欧美' },
      { id: 'korean', name: '日韩' },
      { id: 'classical', name: '古典/纯音乐' },
      { id: 'electronic', name: '电子/舞曲' },
      { id: 'folk', name: '民谣' },
    ],
  },
  {
    id: 'TV Show',
    name: '综艺',
    subCategories: [
      { id: 'reality', name: '真人秀' },
      { id: 'talkshow', name: '脱口秀' },
      { id: 'music', name: '音乐选秀' },
      { id: 'travel', name: '旅行/美食' },
      { id: 'game', name: '游戏竞技' },
    ],
  },
  {
    id: 'Documentary',
    name: '纪录片',
    subCategories: [
      { id: 'nature', name: '自然/地理' },
      { id: 'history', name: '历史/人文' },
      { id: 'science', name: '科学/探索' },
      { id: 'social', name: '社会/时事' },
      { id: 'war', name: '战争/军事' },
    ],
  },
  {
    id: 'Sports',
    name: '体育',
    subCategories: [
      { id: 'football', name: '足球' },
      { id: 'basketball', name: '篮球' },
      { id: 'esports', name: '电子竞技' },
      { id: 'fight', name: '搏击/格斗' },
      { id: 'comprehensive', name: '综合体育' },
    ],
  },
  {
    id: 'Short TV Series',
    name: '短剧',
    subCategories: [
      { id: 'microdrama', name: '微短剧' },
      { id: 'vertical', name: '竖屏短剧' },
      { id: 'diy', name: '民间自制' },
    ],
  },
  {
    id: 'Other',
    name: '其他',
    subCategories: [
      { id: 'education', name: '教育/学习' },
      { id: 'game', name: '游戏解说' },
      { id: 'travel', name: '生活/Vlog' },
      { id: 'others', name: '未分类' },
    ],
  },
];

interface UploadData {
  id: string;
  name: string;
}

// --- 1. 类型定义 Interfaces ---

/** 通用轨道 (General Track) 信息 */
interface GeneralInfo {
  completeName: string;
  format: string;
  formatProfile: string;
  codecID: string;
  fileSize: string;
  duration: string;
  overallBitRateMode: string;
  overallBitRate: string;
  frameRate: string;
  recordedDate: string;
  writingApplication: string;
  [key: string]: string; // 允许其他未显式定义的键
}

/** 视频轨道 (Video Track) 信息 */
interface VideoInfo {
  videoId: string;
  format: string;
  formatInfo: string;
  formatProfile: string;
  codecID: string;
  codecIDInfo: string;
  duration: string;
  sourceDuration: string;
  bitRate: string;
  width: string;
  height: string;
  displayAspectRatio: string;
  frameRateMode: string;
  frameRate: string;
  minimumFrameRate: string;
  maximumFrameRate: string;
  colorSpace: string;
  chromaSubsampling: string;
  bitDepth: string;
  bitsPixelFrame: string;
  streamSize: string;
  sourceStreamSize: string;
  writingLibrary: string;
  colorRange: string;
  colorPrimaries: string;
  transferCharacteristics: string;
  matrixCoefficients: string;
  codecConfigurationBox: string;
  resolution?: string;
  [key: string]: string;
}



/** 音频轨道 (Audio Track) 信息 */
interface AudioInfo {
  audioId: string;
  format: string;
  formatInfo: string;
  codecID: string;
  duration: string;
  bitRateMode: string;
  bitRate: string;
  maximumBitRate: string;
  channelS: string;
  channelLayout: string;
  samplingRate: string;
  frameRate: string;
  compressionMode: string;
  streamSize: string;
  default: string;
  alternateGroup: string;
  stereoMode: string;
  [key: string]: string;
}

/** 最终解析结果对象 */
export interface MediaInfoResult {
  General?: GeneralInfo;
  Video?: VideoInfo;
  Audio?: AudioInfo;
  [key: string]: any; // 允许其他轨道，如 Text, Image 等
}

// --- 辅助函数：根据尺寸和扫描类型判断清晰度标准 ---

// --- 更新后的判断函数 ---
function getResolutionStandard(width: string, height: string, scanType: string | undefined) {
  const w = parseInt(width, 10);
  const h = parseInt(height, 10);
  const scan = scanType ? scanType.toLowerCase() : '';

  // 1. 4K UHD (3840x2160 或更高)
  if (h >= 2160) {
    return '4K UHD';
  }

  // 2. QHD/1440p (2560x1440 或类似)
  // 通常高度在 1440 附近
  if (h >= 1440) {
    return 'QHD 1440p';
  }

  // 3. DCI 2K (2048x1080)
  // 尽管高度是 1080，但宽度更宽（2048），所以优先级高于 FHD
  if (w >= 2000 && h >= 1080) {
    return '2K/DCI (2048)';
  }

  // 4. Full HD 1080 (1920x1080)
  if (h >= 1080) {
    if (scan.includes('progressive')) {
      return 'Full HD 1080p';
    } else if (scan.includes('interlaced')) {
      return 'Full HD 1080i';
    }
    return 'Full HD 1080';
  }

  // 5. HD 720 (1280x720)
  else if (h >= 720) {
    if (scan.includes('progressive')) {
      return 'HD 720p';
    } else if (scan.includes('interlaced')) {
      return 'HD 720i';
    }
    return 'HD 720';
  }

  // 6. SD
  else if (h >= 480) {
    return 'SD 480p';
  }

  // 7. Unknown
  else {
    return '';
  }
}


// --- 解析函数 Function ---

/**
 * 将 MediaInfo 文本输出解析为结构化的 TypeScript 对象，并计算分辨率。
 * @param mediaInfoText MediaInfo 的原始文本输出。
 * @returns 包含 General, Video, Audio 信息的对象。
 */
export function parseMediaInfo(mediaInfoText: string): MediaInfoResult {
  const result: MediaInfoResult = {};
  const lines = mediaInfoText.trim().split('\n');
  let currentSection: keyof MediaInfoResult | null = null;

  const sectionHeaderRegex = /^\s*([A-Za-z]+)\s*$/;
  const keyValueRegex = /^\s*([^:]+?)\s*:\s*(.*)$/;

  // 第一步：初次解析所有键值对
  lines.forEach(line => {
    const trimmedLine = line.trim();

    const sectionMatch = trimmedLine.match(sectionHeaderRegex);
    if (sectionMatch) {
      const sectionName = sectionMatch[1];
      const normalizedSection = (sectionName.charAt(0).toUpperCase() + sectionName.slice(1).toLowerCase()) as keyof MediaInfoResult;

      if (['General', 'Video', 'Audio'].includes(normalizedSection as string)) {
        currentSection = normalizedSection;
        result[currentSection] = {};
      } else {
        currentSection = normalizedSection;
        result[currentSection] = {};
      }
      return;
    }

    const keyValueMatch = trimmedLine.match(keyValueRegex);
    if (currentSection && result[currentSection] && keyValueMatch) {
      let key = keyValueMatch[1].trim();
      let value = keyValueMatch[2].trim();

      key = key.toLowerCase().replace(/[^a-z0-9]+(.)/g, (m, chr) => chr.toUpperCase());

      if (key === 'id') {
        key = (currentSection as string).toLowerCase() + 'Id';
      }

      // 使用 any 绕过 TypeScript 对动态键值的严格检查
      (result[currentSection] as any)[key] = value;
    }
  });

  // 第二步：后处理 - 计算并添加 resolution 属性
  if (result.Video) {
    const videoInfo = result.Video as VideoInfo; // 明确类型，以便访问 width/height

    // 提取并清理 width 和 height 值（去除 " pixels" 和逗号/空格）
    const rawWidth = videoInfo.width ? videoInfo.width.replace(' pixels', '').replace(/[\s,]/g, '') : null;
    const rawHeight = videoInfo.height ? videoInfo.height.replace(' pixels', '').replace(/[\s,]/g, '') : null;

    // 检查是否成功提取了数字值
    if (rawWidth && rawHeight) {
      videoInfo.resolution = `${rawWidth}x${rawHeight}`;
      // 2. 计算 Standard
      videoInfo.standard = getResolutionStandard(rawWidth, rawHeight, videoInfo.scanType);
    } else {
      videoInfo.resolution = undefined; // 如果无法计算，则设置为 undefined
    }
  }

  return result;
}
