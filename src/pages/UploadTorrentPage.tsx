import { useRef, useState, useEffect } from 'react';
import { useDynamicTitle } from '@/hooks/useDynamicTitle';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Upload,
  Info,
  Plus,
  X,
  Image as ImageIcon,
  FileText,
  Link2,
  Film,
  Download,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Label } from "@/components/ui/label"
import { Switch } from '@/components/ui/switch';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ImageWithFallback } from '@/components/figma/ImageWithFallback';
import { ImagesService, PtGenService, TorrentsService } from '@/api';
import { customToast } from '@/hooks/useToast';
import { categoryTree } from '@/types/UploadTorrentPage';
import { parseMediaInfo, MediaInfoResult } from '@/types/UploadTorrentPage';
import { useUploadStore } from '@/stores/uploadStore';

export function UploadTorrentPage() {
  useDynamicTitle('上传');
  const navigate = useNavigate();
  const { selectedCategory, setSelectedCategory, selectedSubCategories, setSelectedSubCategories, toggleSubCategory } = useUploadStore();
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([]);
  const [selectedSubtitles, setSelectedSubtitles] = useState<string[]>([]);
  const [uploadedPoster, setUploadedPoster] = useState('');
  const [screenshots, setScreenshots] = useState<string[]>([]);
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [posterUploading, setPosterUploading] = useState(false);
  const [shotsUploading, setShotsUploading] = useState(false);
  const posterInputRef = useRef<HTMLInputElement>(null);
  const shotsInputRef = useRef<HTMLInputElement>(null);
  const [ptGenUrl, setPtGenUrl] = useState('');
  const [ptGenLoading, setPtGenLoading] = useState(false);
  const [ptGenError, setPtGenError] = useState<string | null>(null);
  const [description, setDescription] = useState('');
  const [title, setTitle] = useState('');
  const [subTitle, setSubTitle] = useState('');
  const [productionTeam, setProductionTeam] = useState('');
  const [region, setRegion] = useState('');
  const [imdbUrl, setImdbUrl] = useState('');
  const [doubanUrl, setDoubanUrl] = useState('');
  const [torrentFile, setTorrentFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const location = useLocation();

  useEffect(() => {
    if (location.hash && location.hash.includes('#separator#')) {
      try {
        const hashContent = location.hash.split('#separator#')[1];
        if (!hashContent) return;

        // Base64 decode
        const decodedBase64 = atob(hashContent);
        // URL decode
        const decodedString = decodeURIComponent(decodedBase64);

        // Split by #linkstr#
        const parts = decodedString.split('#linkstr#');
        const data: Record<string, string> = {};

        for (let i = 0; i < parts.length; i += 2) {
          const key = parts[i];
          const value = parts[i + 1];
          // We check value !== undefined because if the string ends with key, value is undefined
          if (key) {
            data[key] = value || '';
          }
        }

        // Map fields
        if (data.name) setTitle(data.name);
        if (data.small_descr) setSubTitle(data.small_descr);
        if (data.url) setImdbUrl(data.url);
        if (data.dburl) setDoubanUrl(data.dburl);
        if (data.descr) {
          setDescription(data.descr);
          // Extract first image from description as poster
          const imgMatch = data.descr.match(/\[img\](.*?)\[\/img\]/);
          if (imgMatch && imgMatch[1]) {
            setUploadedPoster(imgMatch[1]);
          }
        }

        // Map Category (type -> category name)
        if (data.type) {
          const cat = categoryTree.find((c) => c.name === data.type);
          if (cat) {
            setSelectedCategory(cat.id);
            // If we want to be safe, clear subcategories when changing main category
            setSelectedSubCategories([]);
          }
        }

        // Map Region
        if (data.source_sel) {
          const regionMap: Record<string, string> = {
            '大陆': '中国大陆',
            '香港': '中国香港',
            '台湾': '中国台湾',
          };
          setRegion(regionMap[data.source_sel] || data.source_sel);
        }

        // Map Resolution
        if (data.standard_sel) {
          const std = data.standard_sel.toLowerCase();
          if (std.includes('1080p')) setVideoStandard('Full HD 1080p');
          else if (std.includes('1080i')) setVideoStandard('Full HD 1080i');
          else if (std.includes('720p')) setVideoStandard('HD 720p');
          else if (std.includes('2160') || std.includes('4k')) setVideoStandard('4K UHD');
          else setVideoStandard(data.standard_sel);
        }

        // Map Video Codec
        if (data.codec_sel) {
          const v = data.codec_sel.toUpperCase();
          if (v.includes('H265') || v.includes('HEVC')) setVideoFormat('H.265/HEVC');
          else if (v.includes('H264') || v.includes('AVC')) setVideoFormat('H.264/AVC');
          else setVideoFormat(data.codec_sel);
        }

        // Map Audio Codec
        if (data.audiocodec_sel) {
          setAudioFormat(data.audiocodec_sel);
        }

      } catch (e) {
        console.error('Autofill error:', e);
        customToast.error('自动填充解析失败');
      }
    }
  }, [location.hash, categoryTree]);

  // 主/副分类基于 categoryTree 渲染
  const mainCategories = categoryTree;
  const subCategories = categoryTree.find((c) => c.id === selectedCategory)?.subCategories ?? [];

  // 分辨率选项
  const resolutionOptions = ['SD 480p',
    'HD 720', 'HD 720i', 'HD 720p', 'Full HD 1080', 'Full HD 1080i',
    'Full HD 1080p', 'QHD 1440p', '2K/DCI (2048)', '4K UHD'];
  /**
   * 视频清晰度标准集合（Standard Union Type）。
   * 基于分辨率和扫描类型判断的常见视频标准名称。
   */

  // 视频编码选项
  const videoCodecOptions = ['H.264/AVC', 'H.265/HEVC', 'AV1', 'VC-1', 'MPEG-2', 'MPEG-4/XviD', 'Other'];

  // 音频编码选项
  const audioCodecOptions = ['AAC', 'AC-3', 'DTS', 'DTS-HD MA', 'Dolby Atmos', 'TrueHD', 'FLAC', 'APE', 'MP3', 'OGG', 'Other'];

  // 国家/地区选项
  const countryOptions = [
    '中国大陆', '中国香港', '中国台湾', '美国', '日本', '韩国', '英国', '法国', '德国', '意大利', '西班牙', '其他'
  ];

  // 语言选项
  const languageOptions = [
    '汉语普通话', '粤语', '英语', '日语', '韩语', '法语', '德语', '西班牙语', '意大利语', '俄语', '其他'
  ];

  // 字幕选项
  const subtitleOptions = [
    '简体中文', '繁体中文', '英文', '日文', '韩文', '法文', '德文', '西班牙文', '双语', '无字幕'
  ];

  // 视频分辨率
  const [videoResolution, setVideoResolution] = useState('');

  // 视频标准
  const [videoStandard, setVideoStandard] = useState('');

  // 音频编码
  const [audioFormat, setAudioFormat] = useState('');

  // 视频编码
  const [videoFormat, setVideoFormat] = useState('');

  const toggleSelection = (value: string, selected: string[], setter: (val: string[]) => void) => {
    if (selected.includes(value)) {
      setter(selected.filter(v => v !== value));
    } else {
      setter([...selected, value]);
    }
  };

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const result = reader.result as string;
        // Remove data:image/png;base64, prefix
        const base64 = result.split(',')[1];
        resolve(base64);
      };
      reader.onerror = (error) => reject(error);
    });
  };

  const onPosterInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setPosterUploading(true);
      const base64 = await fileToBase64(file);
      const res = await ImagesService.imagesControllerUpload({
        content: base64,
        filename: file.name,
        mimeType: file.type,
      });
      const url = res.data?.url;
      if (url) {
        setUploadedPoster(url);
      }
    } catch (err: any) {
      customToast.error(err?.message || '上传海报失败');
    } finally {
      setPosterUploading(false);
      e.target.value = '';
    }
  };

  const onShotsInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;
    try {
      setShotsUploading(true);
      const uploads = files.map(async (file) => {
        const base64 = await fileToBase64(file);
        return ImagesService.imagesControllerUpload({
          content: base64,
          filename: file.name,
          mimeType: file.type,
        });
      });
      const results = await Promise.all(uploads);
      const urls = results.map((r) => r.data?.url).filter((u): u is string => !!u);
      if (urls.length) {
        setScreenshots((prev) => [...prev, ...urls]);
      }
    } catch (err: any) {
      customToast.error(err?.message || '上传截图失败');
    } finally {
      setShotsUploading(false);
      e.target.value = '';
    }
  };

  const extractInfoBytes = (buffer: ArrayBuffer) => {
    const data = new Uint8Array(buffer);
    let i = 0;
    const char = (code: number) => String.fromCharCode(code);
    const readNumber = () => {
      let n = 0;
      while (i < data.length) {
        const c = char(data[i]);
        if (c < '0' || c > '9') break;
        n = n * 10 + (data[i] - 48);
        i++;
      }
      return n;
    };
    const parseIntVal = () => {
      i++;
      while (i < data.length && data[i] !== 101) i++;
      i++;
    };
    const parseString = () => {
      const len = readNumber();
      i++;
      i += len;
    };
    const parseList = () => {
      i++;
      while (i < data.length && data[i] !== 101) parseAny();
      i++;
    };
    const parseDict = (captureInfo: boolean) => {
      i++;
      while (i < data.length && data[i] !== 101) {
        const keyStart = i;
        const keyLen = readNumber();
        i++;
        const keyBytes = data.subarray(i, i + keyLen);
        i += keyLen;
        const key = new TextDecoder().decode(keyBytes);
        if (key === 'info' && captureInfo) {
          const start = i;
          parseAny();
          const end = i;
          const slice = data.subarray(start, end);
          return { done: true as const, value: slice };
        } else {
          parseAny();
        }
      }
      i++;
      return { done: false as const };
    };
    const parseAny = () => {
      const c = char(data[i]);
      if (c === 'i') return parseIntVal();
      if (c === 'l') return parseList();
      if (c === 'd') {
        parseDict(false);
        return;
      }
      return parseString();
    };
    const r = parseDict(true);
    if (r.done) return r.value;
    throw new Error('未找到info字典');
  };

  const onTorrentInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setTorrentFile(file);
      const buffer = await file.arrayBuffer();
      const infoBytes = extractInfoBytes(buffer);
      const digest = await crypto.subtle.digest('SHA-1', infoBytes);
      const infoHash = Array.from(new Uint8Array(digest)).map((b) => b.toString(16).padStart(2, '0')).join('');
      const resp = await TorrentsService.torrentsControllerExistsByInfoHash({ infoHash });
      const body: any = (resp as any)?.code !== undefined ? resp : (resp as any)?.data;
      const exists = Boolean(body?.data?.exists ?? body?.exists);
      if (exists) {
        customToast.error('该种子在网站上已经存在');
      }
    } catch (err: any) {
      customToast.error(err?.message || '校验失败');
    }
  };
  const [mediaInfo, setMediaInfo] = useState<MediaInfoResult>({});
  const [mediaInfoText, setMediaInfoText] = useState('');
  const handleMediaInfoChange = async (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const mediaInfoText = e.target.value;
    setMediaInfoText(mediaInfoText);
    try {
      const mediaInfo = parseMediaInfo(mediaInfoText);
      setMediaInfo(mediaInfo);
      /* 解析成功后，更新视频分辨率 */
      if (mediaInfo.Video?.resolution) {
        setVideoResolution(mediaInfo.Video.resolution);
      }
      /* 解析成功后，更新视频标准 */
      if (mediaInfo.Video?.standard) {
        setVideoStandard(mediaInfo.Video.standard);
      }
      /* 解析成功后，更新音频编码 */
      if (mediaInfo.Audio?.format) {
        setAudioFormat(mediaInfo.Audio.format);
      }
      /* 解析成功后，更新视频编码 */
      if (mediaInfo.Video?.format) {
        setVideoFormat(mediaInfo.Video.format);
      }
    } catch (err: any) {
      customToast.error(err?.message || '解析 MediaInfo 失败');
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (submitting) return;
    const errors: string[] = [];
    if (!torrentFile) errors.push('请选择种子文件');
    if (!selectedCategory) errors.push('请选择主分类');
    if (!title.trim()) errors.push('请输入标题');
    if (!subTitle.trim()) errors.push('请输入副标题');
    if (!description.trim()) errors.push('请输入简介');
    if (!uploadedPoster.trim()) errors.push('请上传或填写海报');
    if (errors.length) {
      customToast.error(errors[0]);
      return;
    }
    try {
      setSubmitting(true);
      const name = (torrentFile?.name || title).replace(/\.torrent$/i, '');
      const formData: any = {
        file: torrentFile,
        name,
        category: selectedCategory,
        subCategories: selectedSubCategories.length ? selectedSubCategories : undefined,
        title: title.trim(),
        subTitle: subTitle.trim(),
        standard: videoStandard || undefined,
        videoCodec: videoFormat || undefined,
        audioCodec: audioFormat || undefined,
        productionTeam: productionTeam || undefined,
        region: region || undefined,
        language: selectedLanguages.length ? selectedLanguages.join(',') : undefined,
        subtitleType: selectedSubtitles.length ? selectedSubtitles.join(',') : undefined,
        imdbUrl: imdbUrl || undefined,
        doubanUrl: doubanUrl || undefined,
        description: description,
        cover: uploadedPoster,
        mediaInfo: mediaInfoText || undefined,
        isAnonymous: isAnonymous ? 'true' : 'false',
        stills: screenshots.length ? screenshots : undefined,
        tags: selectedSubCategories.length ? selectedSubCategories : undefined,
      };
      const resp = await TorrentsService.torrentsControllerUpload(formData as any);
      const body: any = (resp as any)?.code !== undefined ? resp : (resp as any)?.data;
      const msg = body?.message || '发布成功';
      customToast.success(msg);
      navigate('/torrents');
    } catch (err: any) {
      const msg = err?.message || '发布失败';
      customToast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const fetchPtGen = async () => {
    const url = ptGenUrl.trim();
    if (!url) {
      setPtGenError('请输入 PT-GEN 链接');
      return;
    }
    try {
      setPtGenLoading(true);
      setPtGenError(null);
      const resp = await PtGenService.ptGenControllerFetch({ url });
      const body: any = (resp as any)?.code !== undefined ? resp : (resp as any)?.data;
      const data: any = body?.data ?? body;
      let raw = '';
      if (typeof data === 'string') raw = data;
      else if (data?.raw) raw = String(data.raw);
      if (!raw) throw new Error(body?.message ?? '未获取到简介内容');
      setDescription(raw);
    } catch (e: any) {
      console.log(e);
      setPtGenError(String(e?.message ?? '获取失败'));
    } finally {
      setPtGenLoading(false);
    }
  };

  /* 上传表单 */


  return (
    <div className="min-h-screen bg-[#0F171E]">
      <div className="max-w-[1400px] mx-auto px-4 md:px-8 py-8">
        {/* 页面标题 */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-lg shadow-amber-500/30">
              <Upload className="w-5 h-5 text-white" />
            </div>
            <div className="flex flex-row items-center gap-3">
              <h1 className="text-white text-3xl">发布种子</h1>
              <p className="text-neutral-400 text-sm mt-1">
                <span className="text-red-400">*</span> 标记为必填项
              </p>
            </div>
          </div>
        </div>

        {/* 上传表单 */}
        <form className="space-y-6" onSubmit={handleSubmit}>
          {/* 基本信息 */}
          <div className="bg-neutral-800/40 backdrop-blur-sm rounded-2xl border border-neutral-700/50 shadow-2xl overflow-hidden">
            <div className="bg-gradient-to-r from-amber-500/20 to-orange-500/20 border-b border-neutral-700/50 px-6 py-3.5">
              <h2 className="text-white flex items-center gap-2">
                <FileText className="w-5 h-5 text-amber-400" />
                基本信息
              </h2>
            </div>

            <div className="px-6 py-3 space-y-3">
              {/* 选择种子 */}
              <div className="grid grid-cols-1 grid-cols-[160px_1fr] gap-2">
                <label className="text-neutral-300 text-sm flex items-center gap-1">
                  选择种子 <span className="text-red-400">*</span>
                </label>
                <div>
                  <input
                    type="file"
                    accept=".torrent"
                    className="w-full bg-neutral-900/60 border border-neutral-700/60 rounded-lg px-2 py-1.5 text-white text-sm file:mr-4 file:py-1.5 file:px-4 file:rounded-lg file:border-0 file:bg-gradient-to-r file:from-amber-500 file:to-orange-600 file:text-white file:text-sm hover:file:from-amber-600 hover:file:to-orange-700 cursor-pointer transition-all"
                    onChange={onTorrentInputChange}
                  />
                </div>
              </div>

              <Separator className="bg-neutral-700/40" />

              {/* 主分类 */}
              <div className="grid grid-cols-1 grid-cols-[160px_1fr] gap-2">
                <label className="text-neutral-300 text-sm flex items-center gap-1">
                  主分类 <span className="text-red-400 ">*</span>
                </label>
                <div>
                  <Select
                    value={selectedCategory}
                    onValueChange={(val) => {
                      setSelectedCategory(val);
                      setSelectedSubCategories([]);
                    }}
                  >
                    <SelectTrigger className="w-[160px] bg-neutral-900/60 border border-neutral-700/60 rounded-lg px-4 py-2 text-white text-sm focus:border-amber-500 focus:ring-2 focus:ring-amber-500/30 outline-none transition-all">
                      <SelectValue placeholder="请选择主分类" />
                    </SelectTrigger>
                    <SelectContent className="bg-neutral-800 border border-neutral-700 rounded-lg shadow-lg">
                      <SelectGroup>
                        {mainCategories.map((cat) => (
                          <SelectItem key={cat.id} value={cat.id} className="text-white hover:bg-neutral-700 focus:bg-neutral-700">
                            {cat.name}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Separator className="bg-neutral-700/40" />

              {/* 副分类 */}
              <div className="grid grid-cols-1 grid-cols-[160px_1fr] gap-2 py-1">
                <label className="text-neutral-300 text-sm space-y-6">副分类</label>
                <div className="space-y-6">
                  <div className="flex flex-wrap gap-2">
                    {subCategories.map((sub) => (
                      <label
                        key={sub.id}
                        className="flex items-center gap-2 cursor-pointer group min-w-[80px]"
                      >
                        <Checkbox
                          checked={selectedSubCategories.includes(sub.id)}
                          onCheckedChange={() => toggleSubCategory(sub.id)}
                          className="border-neutral-600 data-[state=checked]:bg-amber-500 data-[state=checked]:border-amber-500"
                        />
                        <span className="text-neutral-400 text-sm group-hover:text-white transition-colors">
                          {sub.name}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              <Separator className="bg-neutral-700/40" />

              {/* 标题 */}
              <div className="grid grid-cols-1 grid-cols-[160px_1fr] gap-2">
                <label className="text-neutral-300 text-sm flex items-center gap-1">
                  标题 <span className="text-red-400">*</span>
                </label>
                <div>
                  <input
                    type="text"
                    placeholder="例如: 星际穿越 Interstellar (2014)"
                    className="w-full bg-neutral-900/60 border border-neutral-700/60 rounded-lg px-4 py-2.5 text-white text-sm placeholder:text-neutral-500 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/30 outline-none transition-all"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </div>
              </div>

              <Separator className="bg-neutral-700/40" />

              {/* 副标题 */}
              <div className="grid grid-cols-1 grid-cols-[160px_1fr] gap-2">
                <label className="text-neutral-300 text-sm flex items-center gap-1">
                  副标题 <span className="text-red-400">*</span>
                </label>
                <div>
                  <input
                    type="text"
                    placeholder="例如: 4K HDR REMUX 国英双语 中英字幕 BluRay 杜比全景声"
                    className="w-full bg-neutral-900/60 border border-neutral-700/60 rounded-lg px-4 py-2.5 text-white text-sm placeholder:text-neutral-500 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/30 outline-none transition-all"
                    value={subTitle}
                    onChange={(e) => setSubTitle(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* 质量信息 */}
          <div className="bg-neutral-800/40 backdrop-blur-sm rounded-2xl border border-neutral-700/50 shadow-2xl overflow-hidden">
            <div className="bg-gradient-to-r from-orange-500/20 to-red-500/20 border-b border-neutral-700/50 px-6 py-3.5">
              <h2 className="text-white flex items-center gap-2">
                <Film className="w-5 h-5 text-orange-400" />
                质量信息
              </h2>
            </div>

            <div className="p-6 space-y-4">
              {/* 分辨率、视频编码、音频编码、制作组 合并为一行 */}
              <div className="grid grid-cols-1 grid-cols-[160px_1fr] gap-2">
                <label className="text-neutral-300 text-sm pt-2">质量参数</label>
                <div className="flex flex-wrap gap-10">
                  {/* 分辨率 */}
                  <div className="flex flex-row items-center gap-2">
                    <label className="text-neutral-400 text-sm flex items-center gap-1 whitespace-nowrap">分辨率 :</label>
                    <Select value={videoStandard || undefined} onValueChange={setVideoStandard}>
                      <SelectTrigger className="bg-neutral-900/60 border border-neutral-700/60 rounded-lg px-3 py-2 text-white text-sm focus:border-orange-500 focus:ring-2 focus:ring-orange-500/30 outline-none transition-all">
                        <SelectValue placeholder="请选择" />
                      </SelectTrigger>
                      <SelectContent className="bg-neutral-800 border border-neutral-700 rounded-lg shadow-lg">
                        <SelectGroup>
                          {resolutionOptions.map((opt) => (
                            <SelectItem key={opt} value={opt} className="text-white hover:bg-neutral-700 focus:bg-neutral-700">
                              {opt}
                            </SelectItem>
                          ))}
                          {videoStandard && !resolutionOptions.includes(videoStandard) && (
                            <SelectItem value={videoStandard} className="text-white hover:bg-neutral-700 focus:bg-neutral-700">
                              {videoStandard}
                            </SelectItem>
                          )}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* 视频编码 */}
                  <div className="flex flex-row items-center gap-2">
                    <label className="text-neutral-400 text-sm flex items-center gap-1 whitespace-nowrap">视频编码 :</label>
                    <Select value={videoFormat || undefined} onValueChange={setVideoFormat}>
                      <SelectTrigger className="bg-neutral-900/60 border border-neutral-700/60 rounded-lg px-3 py-2 text-white text-sm focus:border-orange-500 focus:ring-2 focus:ring-orange-500/30 outline-none transition-all">
                        <SelectValue placeholder="请选择" />
                      </SelectTrigger>
                      <SelectContent className="bg-neutral-800 border border-neutral-700 rounded-lg shadow-lg">
                        <SelectGroup>
                          {videoCodecOptions.map((opt) => (
                            <SelectItem key={opt} value={opt} className="text-white hover:bg-neutral-700 focus:bg-neutral-700">
                              {opt}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* 音频编码 */}
                  <div className="flex flex-row items-center gap-2">
                    <label className="text-neutral-400 text-sm flex items-center gap-1 whitespace-nowrap">音频编码 :</label>
                    <Select value={audioFormat || undefined} onValueChange={setAudioFormat}>
                      <SelectTrigger className="bg-neutral-900/60 border border-neutral-700/60 rounded-lg px-3 py-2 text-white text-sm focus:border-orange-500 focus:ring-2 focus:ring-orange-500/30 outline-none transition-all">
                        <SelectValue placeholder="请选择" />
                      </SelectTrigger>
                      <SelectContent className="bg-neutral-800 border border-neutral-700 rounded-lg shadow-lg">
                        <SelectGroup>
                          {audioCodecOptions.map((opt) => (
                            <SelectItem key={opt} value={opt} className="text-white hover:bg-neutral-700 focus:bg-neutral-700">
                              {opt}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* 制作组 */}
                  <div className="flex flex-row items-center gap-2">
                    <label className="text-neutral-400 text-sm flex items-center gap-1 whitespace-nowrap">制作组 :</label>
                    <input
                      type="text"
                      placeholder="例如: CSAUTO"
                      className="w-full bg-neutral-900/60 border border-neutral-700/60 rounded-lg px-3 py-2 text-white text-sm placeholder:text-neutral-500 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/30 outline-none transition-all"
                      value={productionTeam}
                      onChange={(e) => setProductionTeam(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <Separator className="bg-neutral-700/40" />

              {/* MediaInfo */}
              <div className="grid grid-cols-1 grid-cols-[160px_1fr] gap-2">
                <label className="text-neutral-300 text-sm pt-2">MediaInfo</label>
                <div className="col-span-1">
                  <textarea
                    rows={10}
                    placeholder="请粘贴 MediaInfo 或 BDInfo 信息..."
                    className="w-full bg-neutral-900/60 border border-neutral-700/60 rounded-lg px-4 py-3 text-white text-sm placeholder:text-neutral-500 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/30 outline-none resize-none font-mono transition-all scrollbar-themed"
                    onChange={handleMediaInfoChange}
                  />
                  <p className="text-neutral-500 text-xs mt-2 flex items-center gap-1">
                    <Info className="w-3 h-3" />
                    建议使用 MediaInfo 或 BDInfo 获取完整的技术信息
                  </p>
                  {/* 视频信息 */}
                  {mediaInfo.Video && (
                    <div className="mt-4 flex flex-wrap gap-10">
                      <p className="text-neutral-400 text-sm">视频时长: {mediaInfo.Video.duration}</p>
                      <p className="text-neutral-400 text-sm">视频分辨率: {mediaInfo.Video.resolution}</p>
                      <p className="text-neutral-400 text-sm">视频编码: {mediaInfo.Video.format}</p>
                      <p className="text-neutral-400 text-sm">视频码率: {mediaInfo.Video.bitRate}</p>
                      <p className="text-neutral-400 text-sm">视频帧率: {mediaInfo.Video.frameRate}</p>
                      <p className="text-neutral-400 text-sm">音频编码: {mediaInfo.Audio?.format}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* 扩展信息 */}
          <div className="bg-neutral-800/40 backdrop-blur-sm rounded-2xl border border-neutral-700/50 shadow-2xl overflow-hidden">
            <div className="bg-gradient-to-r from-yellow-600/20 to-amber-500/20 border-b border-neutral-700/50 px-6 py-3.5">
              <h2 className="text-white flex items-center gap-2">
                <Link2 className="w-5 h-5 text-yellow-400" />
                扩展信息
              </h2>
            </div>

            <div className="p-6 space-y-4">
              {/* 国家/地区 */}
              <div className="grid grid-cols-1 grid-cols-[160px_1fr] gap-2">
                <label className="text-neutral-300 text-sm flex items-center gap-1">国家/地区</label>
                <div className="col-span-1">
                  <Select value={region || undefined} onValueChange={setRegion}>
                    <SelectTrigger className="w-[200px] bg-neutral-900/60 border border-neutral-700/60 rounded-lg px-4 py-2.5 text-white text-sm focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/30 outline-none transition-all">
                      <SelectValue placeholder="请选择国家/地区" />
                    </SelectTrigger>
                    <SelectContent className="bg-neutral-800 border border-neutral-700 rounded-lg shadow-lg">
                      <SelectGroup>
                        {countryOptions.map((opt) => (
                          <SelectItem key={opt} value={opt} className="text-white hover:bg-neutral-700 focus:bg-neutral-700">
                            {opt}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Separator className="bg-neutral-700/40" />

              {/* IMDb链接 */}
              <div className="grid grid-cols-1 grid-cols-[160px_1fr] gap-2">
                <label className="text-neutral-300 text-sm flex items-center gap-1">IMDb 链接</label>
                <div className="col-span-1">
                  <input
                    type="text"
                    placeholder="例如: https://www.imdb.com/title/tt0816692/"
                    className="w-full bg-neutral-900/60 border border-neutral-700/60 rounded-lg px-4 py-2.5 text-white text-sm placeholder:text-neutral-500 focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/30 outline-none transition-all"
                    value={imdbUrl}
                    onChange={(e) => setImdbUrl(e.target.value)}
                  />
                </div>
              </div>

              <Separator className="bg-neutral-700/40" />

              {/* 豆瓣链接 */}
              <div className="grid grid-cols-1 grid-cols-[160px_1fr] gap-2">
                <label className="text-neutral-300 text-sm flex items-center gap-1">豆瓣链接</label>
                <div className="col-span-1">
                  <input
                    type="text"
                    placeholder="例如: https://movie.douban.com/subject/1292052/"
                    className="w-full bg-neutral-900/60 border border-neutral-700/60 rounded-lg px-4 py-2.5 text-white text-sm placeholder:text-neutral-500 focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/30 outline-none transition-all"
                    value={doubanUrl}
                    onChange={(e) => setDoubanUrl(e.target.value)}
                  />
                </div>
              </div>

              <Separator className="bg-neutral-700/40" />

              {/* PT-GEN */}
              <div className="grid grid-cols-1 grid-cols-[160px_1fr] gap-2">
                <label className="text-neutral-300 text-sm flex items-center gap-1">PT-GEN</label>
                <div className="col-span-1">
                  <div className="flex gap-2 items-center">
                    <input
                      type="text"
                      placeholder="输入 PT-Gen 链接或代码 , PT-GEN 可帮助自动生成种子简介"
                      className="flex-1 bg-neutral-900/60 border border-neutral-700/60 rounded-lg px-4 py-2.5 text-white text-sm placeholder:text-neutral-500 focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/30 outline-none transition-all"
                      value={ptGenUrl}
                      onChange={(e) => setPtGenUrl(e.target.value)}
                    />
                    <Button
                      type="button"
                      className="bg-gradient-to-r from-yellow-600 to-amber-600 hover:from-yellow-700 hover:to-amber-700 text-white whitespace-nowrap"
                      onClick={fetchPtGen}
                      disabled={ptGenLoading}
                    >
                      <Download className="w-4 h-4 mr-1.5" />
                      {ptGenLoading ? '获取中...' : '获取简介'}
                    </Button>
                  </div>
                  {ptGenError && (
                    <p className="text-red-500 text-xs mt-2">{ptGenError}</p>
                  )}
                </div>
              </div>

              <Separator className="bg-neutral-700/40" />

              {/* 语言 */}
              <div className="grid grid-cols-1 grid-cols-[160px_1fr] gap-2">
                <label className="text-neutral-300 text-sm">语言</label>
                <div className="col-span-1">
                  <div className="flex flex-wrap gap-8">
                    {languageOptions.map((lang) => (
                      <label
                        key={lang}
                        className="flex items-center gap-2 cursor-pointer group"
                      >
                        <Checkbox
                          checked={selectedLanguages.includes(lang)}
                          onCheckedChange={() => toggleSelection(lang, selectedLanguages, setSelectedLanguages)}
                          className="border-neutral-600 data-[state=checked]:bg-yellow-500 data-[state=checked]:border-yellow-500"
                        />
                        <span className="text-neutral-400 text-sm group-hover:text-white transition-colors">
                          {lang}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              <Separator className="bg-neutral-700/40" />

              {/* 字幕 */}
              <div className="grid grid-cols-1 grid-cols-[160px_1fr] gap-2">
                <label className="text-neutral-300 text-sm">字幕</label>
                <div className="col-span-1">
                  <div className="flex flex-wrap gap-8">
                    {subtitleOptions.map((sub) => (
                      <label
                        key={sub}
                        className="flex items-center gap-2 cursor-pointer group"
                      >
                        <Checkbox
                          checked={selectedSubtitles.includes(sub)}
                          onCheckedChange={() => toggleSelection(sub, selectedSubtitles, setSelectedSubtitles)}
                          className="border-neutral-600 data-[state=checked]:bg-yellow-500 data-[state=checked]:border-yellow-500"
                        />
                        <span className="text-neutral-400 text-sm group-hover:text-white transition-colors">
                          {sub}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 简介 */}
          <div className="bg-neutral-800/40 backdrop-blur-sm rounded-2xl border border-neutral-700/50 shadow-2xl overflow-hidden">
            <div className="bg-gradient-to-r from-red-500/20 to-orange-500/20 border-b border-neutral-700/50 px-6 py-3.5">
              <h2 className="text-white flex items-center gap-2">
                <FileText className="w-5 h-5 text-red-400" />
                简介 <span className="text-red-400 text-sm ml-1">*</span>
              </h2>
            </div>

            <div className="p-6">
              <textarea
                rows={15}
                placeholder="请输入资源简介，支持BBCode格式...&#10;&#10;例如：&#10;[b]粗体文字[/b]&#10;[i]斜体文字[/i]&#10;[img]图片链接[/img]&#10;[url]链接地址[/url]"
                className="w-full bg-neutral-900/60 border border-neutral-700/60 rounded-lg px-4 py-3 text-white text-sm placeholder:text-neutral-500 focus:border-red-500 focus:ring-2 focus:ring-red-500/30 outline-none resize-none transition-all"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
              <p className="text-neutral-500 text-xs mt-3">支持BBCode格式，如 [b]粗体[/b] [i]斜体[/i] [img]图片链接[/img]</p>
            </div>
          </div>

          {/* 图片上传 */}
          <div className="bg-neutral-800/40 backdrop-blur-sm rounded-2xl border border-neutral-700/50 shadow-2xl overflow-hidden">
            <div className="bg-gradient-to-r from-orange-500/20 to-amber-500/20 border-b border-neutral-700/50 px-6 py-3.5">
              <h2 className="text-white flex items-center gap-2">
                <ImageIcon className="w-5 h-5 text-orange-400" />
                图片
              </h2>
            </div>

            <div className="p-6 space-y-8">
              {/* 海报 */}
              <div>
                <label className="text-neutral-300 text-sm mb-4 block">海报</label>
                <div className="flex items-start gap-4">
                  {uploadedPoster ? (
                    <div className="relative w-48 rounded-xl overflow-hidden group border-2 border-neutral-700/50">
                      <ImageWithFallback
                        src={uploadedPoster}
                        alt="海报"
                        className="w-full aspect-[2/3] object-cover"
                      />
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <Button
                          size="icon"
                          variant="ghost"
                          className="text-white hover:bg-red-500/80 hover:text-white"
                          onClick={() => setUploadedPoster('')}
                        >
                          <X className="w-5 h-5" />
                        </Button>
                      </div>
                      {posterUploading && (
                        <div className="absolute inset-0 bg-black/50 text-white text-xs flex items-center justify-center">上传中...</div>
                      )}
                    </div>
                  ) : (
                    <div
                      className="border-2 border-dashed border-neutral-700/60 rounded-xl p-8 text-center hover:border-orange-500/50 hover:bg-orange-500/5 transition-all cursor-pointer w-48 group"
                      onClick={() => posterInputRef.current?.click()}
                    >
                      <ImageIcon className="w-12 h-12 text-neutral-500 group-hover:text-orange-400 mx-auto mb-3 transition-colors" />
                      <p className="text-neutral-400 group-hover:text-neutral-300 text-sm mb-1 transition-colors">点击上传海报</p>
                      <p className="text-neutral-600 text-xs">推荐 2:3 比例</p>
                    </div>
                  )}
                  <input
                    ref={posterInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={onPosterInputChange}
                  />
                  <div className="flex-1">
                    <p className="text-neutral-400 text-sm mb-2">上传指南：</p>
                    <ul className="text-neutral-500 text-xs space-y-1">
                      <li>• 支持 JPG、PNG 格式</li>
                      <li>• 推荐尺寸: 800x1200 像素</li>
                      <li>• 推荐比例: 2:3（竖版海报）</li>
                      <li>• 文件大小不超过 5MB</li>
                    </ul>
                  </div>
                </div>
                <div className="mt-4">
                  <label className="text-neutral-400 text-xs mb-1.5 block">或使用外部图片链接</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="https://example.com/screenshot.jpg"
                      className="flex-1 bg-neutral-900/60 border border-neutral-700/60 rounded-lg px-3 py-2 text-white text-sm placeholder:text-neutral-500 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/30 outline-none transition-all"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          const input = e.currentTarget;
                          if (input.value.trim()) {
                            setUploadedPoster(input.value.trim());
                            input.value = '';
                          }
                        }
                      }}
                    />
                    <Button
                      type="button"
                      size="sm"
                      className="bg-orange-600 hover:bg-orange-700 text-white"
                      onClick={(e) => {
                        const input = e.currentTarget.previousElementSibling as HTMLInputElement;
                        if (input?.value.trim()) {
                          setUploadedPoster(input.value.trim());
                          input.value = '';
                        }
                      }}
                    >
                      添加
                    </Button>
                  </div>
                </div>
              </div>

              <Separator className="bg-neutral-700/40" />

              {/* 剧照 */}
              <div>
                <label className="text-neutral-300 text-sm mb-4 block">剧照</label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {screenshots.map((screenshot, index) => (
                    <div key={index} className="relative aspect-video rounded-xl overflow-hidden group border-2 border-neutral-700/50">
                      <ImageWithFallback
                        src={screenshot}
                        alt={`剧照 ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <Button
                          size="icon"
                          variant="ghost"
                          className="text-white hover:bg-red-500/80 hover:text-white"
                          onClick={() => setScreenshots(screenshots.filter((_, i) => i !== index))}
                        >
                          <X className="w-5 h-5" />
                        </Button>
                      </div>
                    </div>
                  ))}
                  <div
                    className="aspect-video border-2 border-dashed border-neutral-700/60 rounded-xl flex items-center justify-center hover:border-orange-500/50 hover:bg-orange-500/5 transition-all cursor-pointer group"
                    onClick={() => shotsInputRef.current?.click()}
                  >
                    <div className="text-center">
                      <Plus className="w-10 h-10 text-neutral-500 group-hover:text-orange-400 mx-auto mb-2 transition-colors" />
                      <p className="text-neutral-500 group-hover:text-neutral-400 text-xs transition-colors">添加剧照</p>
                    </div>
                  </div>
                </div>
                <p className="text-neutral-500 text-xs mt-3">上传剧照可以帮助用户更好地了解资源，建议上传 4-8 张</p>
                <input
                  ref={shotsInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={onShotsInputChange}
                />
                <div className="mt-4">
                  <label className="text-neutral-400 text-xs mb-1.5 block">或使用外部图片链接</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="https://example.com/screenshot.jpg"
                      className="flex-1 bg-neutral-900/60 border border-neutral-700/60 rounded-lg px-3 py-2 text-white text-sm placeholder:text-neutral-500 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/30 outline-none transition-all"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          const input = e.currentTarget;
                          if (input.value.trim()) {
                            setScreenshots([...screenshots, input.value.trim()]);
                            input.value = '';
                          }
                        }
                      }}
                    />
                    <Button
                      type="button"
                      size="sm"
                      className="bg-orange-600 hover:bg-orange-700 text-white"
                      onClick={(e) => {
                        const input = e.currentTarget.previousElementSibling as HTMLInputElement;
                        if (input?.value.trim()) {
                          setScreenshots([...screenshots, input.value.trim()]);
                          input.value = '';
                        }
                      }}
                    >
                      添加
                    </Button>
                  </div>
                  {shotsUploading && (
                    <p className="text-neutral-400 text-xs mt-2">剧照上传中...</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* 发布选项 */}
          <div className="bg-neutral-800/40 backdrop-blur-sm rounded-2xl border border-neutral-700/50 shadow-2xl overflow-hidden">
            <div className="p-6">
              <div className="flex items-center space-x-2">
                <Label htmlFor="anonymous-switch">匿名发布</Label>
                <Switch
                  checked={isAnonymous}
                  onCheckedChange={setIsAnonymous}
                />
              </div>
            </div>
          </div>

          {/* 提交按钮 */}
          <div className="flex items-center justify-between pt-2">
            <div className="flex items-center gap-2 text-sm text-neutral-400">
              <Info className="w-4 h-4 text-amber-400" />
              <span>发布前请仔细检查信息，确保准确无误</span>
            </div>
            <div className="flex gap-3">
              <Button
                type="button"
                variant="outline"
                className="border-neutral-700 text-neutral-300 hover:bg-neutral-800 hover:text-white"
                onClick={() => navigate('/torrents')}
              >
                取消
              </Button>
              <Button
                type="submit"
                className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white px-8 shadow-lg shadow-amber-500/25"
                disabled={submitting}
              >
                <Upload className="w-4 h-4 mr-2" />
                {submitting ? '发布中...' : '发布种子'}
              </Button>
            </div>
          </div>
        </form>

        {/* 发布须知 */}
        <div className="mt-8 bg-neutral-800/30 backdrop-blur-sm rounded-2xl border border-neutral-700/50 p-6">
          <h3 className="text-white flex items-center gap-2 mb-4">
            <Info className="w-5 h-5 text-amber-400" />
            发布须知
          </h3>
          <ul className="space-y-2.5 text-neutral-400 text-sm">
            <li className="flex items-start gap-3">
              <span className="text-amber-400 mt-0.5">•</span>
              <span>请确保上传的种子文件来源合法，不包含违法违规内容</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-amber-400 mt-0.5">•</span>
              <span>种子标题应准确描述资源内容，包含必要的技术信息</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-amber-400 mt-0.5">•</span>
              <span>建议填写 MediaInfo 或 BDInfo 技术信息，便于用户了解资源质量</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-amber-400 mt-0.5">•</span>
              <span>请在发布后至少保持做种 7 天，确保其他用户能够下载</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-amber-400 mt-0.5">•</span>
              <span>违规发布内容可能导致账号被封禁，请遵守站点规则</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
