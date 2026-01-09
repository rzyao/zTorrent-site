
import { categoryTree } from '@/modules/app/types/UploadTorrentPage';
import { parseMediaInfo } from '@/modules/app/types/UploadTorrentPage';

export interface ParsedHashData {
    [key: string]: string;
}

export interface MappedFormData {
    title?: string;
    subTitle?: string;
    imdbUrl?: string;
    doubanUrl?: string;
    description?: string;
    uploadedPoster?: string;
    selectedCategory?: string;
    selectedTags?: string[];
    region?: string;
    videoStandard?: string;
    videoFormat?: string;
    audioFormat?: string;
    videoResolution?: string;
    mediaInfoText?: string;
}

/**
 * 负责解析 URL hash 字符串，提取原始数据
 */
export const extractDataFromHash = (hash: string): ParsedHashData => {
    if (!hash || !hash.includes('#separator#')) {
        return {};
    }

    try {
        const hashContent = hash.split('#separator#')[1];
        if (!hashContent) return {};

        // Base64 decode
        const decodedBase64 = atob(hashContent);
        // URL decode
        const decodedString = decodeURIComponent(decodedBase64);

        // Split by #linkstr#
        const parts = decodedString.split('#linkstr#');
        const data: ParsedHashData = {};

        for (let i = 0; i < parts.length; i += 2) {
            const key = parts[i];
            const value = parts[i + 1];
            if (key) {
                data[key] = value || '';
            }
        }

        return data;
    } catch (e) {
        console.error('Error parsing hash string:', e);
        return {};
    }
};

/**
 * 负责将提取的原始数据映射为表单所需的格式
 */
export const mapDataToForm = (data: ParsedHashData): MappedFormData => {
    const result: MappedFormData = {};
    const stripWrap = (s: string) => {
        const t = s.trim();
        if (
            (t.startsWith('`') && t.endsWith('`')) ||
            (t.startsWith('"') && t.endsWith('"')) ||
            (t.startsWith('“') && t.endsWith('”'))
        ) {
            return t.slice(1, -1).trim();
        }
        return t;
    };

    if (data.title) result.title = stripWrap(data.title);
    if (data.subTitle) result.subTitle = stripWrap(data.subTitle);
    if (data.imdbUrl) result.imdbUrl = stripWrap(data.imdbUrl);
    if (data.doubanUrl) result.doubanUrl = stripWrap(data.doubanUrl);
    if (data.description) result.description = data.description;

    if (!result.title && data.name) result.title = data.name;
    if (!result.subTitle && data.small_descr) result.subTitle = data.small_descr;
    if (!result.imdbUrl && data.url) result.imdbUrl = data.url;
    if (!result.doubanUrl && data.dburl) result.doubanUrl = data.dburl;
    if (!result.description && data.descr) result.description = data.descr;

    if (!result.uploadedPoster) {
        const text = result.description || data.descr || '';
        const imgMatch = text.match(/\[img\](.*?)\[\/img\]/);
        if (imgMatch && imgMatch[1]) {
            result.uploadedPoster = stripWrap(imgMatch[1]);
        }
    }

    if (data.selectedCategory) {
        const val = data.selectedCategory;
        const cat = categoryTree.find(c => c.id === val || c.name === val);
        if (cat) result.selectedCategory = cat.id;
        if (data.selectedSubCategories) {
            const inputSubs = Array.isArray(data.selectedSubCategories)
                ? (data.selectedSubCategories as unknown as string[])
                : [String(data.selectedSubCategories)];
            const resolved: string[] = [];
            if (cat) {
                for (const it of inputSubs) {
                    const sub = cat.subCategories.find(s => s.id === it || s.name === it);
                    if (sub) resolved.push(sub.id);
                }
            } else {
                for (const it of inputSubs) {
                    for (const main of categoryTree) {
                        const sub = main.subCategories.find(s => s.id === it || s.name === it);
                        if (sub) {
                            result.selectedCategory = main.id;
                            resolved.push(sub.id);
                            break;
                        }
                    }
                }
            }
            result.selectedTags = resolved;
        }
    }
    if (!result.selectedCategory) {
        if (data.type) {
            let type = data.type;
            if (type === '动画') type = '动漫';
            let cat = categoryTree.find((c) => c.name === type || c.id === type);
            let subCatId: string | undefined;
            if (!cat) {
                for (const main of categoryTree) {
                    const sub = main.subCategories.find(s => s.name === type || s.id === type);
                    if (sub) { cat = main; subCatId = sub.id; break; }
                }
            }
            if (cat) {
                result.selectedCategory = cat.id;
                if (subCatId) result.selectedTags = [subCatId];
                else if (cat.name === type || cat.id === type) result.selectedTags = [];
            }
        }
    }

    if (data.region) {
        result.region = data.region;
    } else if (data.source_sel) {
        const regionMap: Record<string, string> = {
            '大陆': '中国大陆',
            '香港': '中国香港',
            '台湾': '中国台湾',
        };
        result.region = regionMap[data.source_sel] || data.source_sel;
    }

    if (data.videoStandard) {
        result.videoStandard = data.videoStandard;
    } else if (data.standard_sel) {
        const std = data.standard_sel.toLowerCase();
        let matchedStandard = '';
        if (std.includes('1080p')) matchedStandard = 'Full HD 1080p';
        else if (std.includes('1080i')) matchedStandard = 'Full HD 1080i';
        else if (std.includes('720p')) matchedStandard = 'HD 720p';
        else if (std.includes('2160') || std.includes('4k')) matchedStandard = '4K UHD';
        else matchedStandard = data.standard_sel;
        result.videoStandard = matchedStandard;
    }

    if (data.videoFormat) {
        result.videoFormat = data.videoFormat;
    } else if (data.codec_sel) {
        const v = data.codec_sel.toUpperCase();
        let matchedCodec = '';
        if (v.includes('H265') || v.includes('HEVC')) matchedCodec = 'H.265/HEVC';
        else if (v.includes('H264') || v.includes('AVC')) matchedCodec = 'H.264/AVC';
        else matchedCodec = data.codec_sel;
        result.videoFormat = matchedCodec;
    }

    if (data.audioFormat) {
        result.audioFormat = data.audioFormat;
    } else if (data.audiocodec_sel) {
        result.audioFormat = data.audiocodec_sel;
    }

    if (data.videoResolution) {
        result.videoResolution = data.videoResolution;
    }

    let miText = '';
    if (data.mediaInfoText) {
        miText = data.mediaInfoText;
    } else if (data.full_mediainfo) {
        miText = data.full_mediainfo;
    } else if (data.descr) {
        const mediaInfoMatch = data.descr.match(/\[quote\]General\n([\s\S]*?)\[\/quote\]/);
        if (mediaInfoMatch) {
            miText = mediaInfoMatch[0].match(/\[quote\]([\s\S]*?)\[\/quote\]/)[1];
        }
    }

    if (miText) {
        miText = stripWrap(miText);
        result.mediaInfoText = miText;
        try {
            const parsedMi = parseMediaInfo(miText);
            if (!result.videoStandard && parsedMi.Video?.standard) result.videoStandard = parsedMi.Video.standard;
            if (!result.videoFormat && parsedMi.Video?.format) {
                let vFormat = parsedMi.Video.format;
                if (vFormat.includes('AVC')) vFormat = 'H.264/AVC';
                if (vFormat.includes('HEVC')) vFormat = 'H.265/HEVC';
                result.videoFormat = vFormat;
            }
            if (!result.audioFormat && parsedMi.Audio?.format) result.audioFormat = parsedMi.Audio.format;
            if (!result.videoResolution && parsedMi.Video?.resolution) result.videoResolution = parsedMi.Video.resolution;
        } catch (e) {
            console.error('Failed to parse autofilled MediaInfo inside mapper', e);
        }
    }

    return result;
};
