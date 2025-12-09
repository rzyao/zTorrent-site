import { useEffect, useMemo, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ImagesService } from '@/api/services/ImagesService';
import { PtGenService } from '@/api/services/PtGenService';
import { TorrentsService } from '@/api/services/TorrentsService';
import { customToast } from '@/hooks/useToast';
import { categoryTree, parseMediaInfo, MediaInfoResult } from '@/types/UploadTorrentPage';
import { useUploadStore } from '@/stores/uploadStore';
import { extractDataFromHash, mapDataToForm } from '@/utils/hashParser';
import { extractErrorMessage } from '@/utils/errorMessage';
import { extractInfoBytes } from '@/utils/torrentParser';

/**
 * useUploadTorrent
 * 将 `UploadTorrentPage` 中所有业务逻辑、状态管理与副作用集中到自定义 Hook。
 * UI 层通过该 Hook 提供的状态与方法进行渲染与交互，确保组件无状态、纯展示。
 */
export function useUploadTorrent() {
  const navigate = useNavigate();
  const location = useLocation();

  // 分类状态（来自全局 store）
  const {
    selectedCategory,
    setSelectedCategory,
    selectedSubCategories,
    setSelectedSubCategories,
    toggleSubCategory,
  } = useUploadStore();

  // 基础信息与扩展信息状态
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

  // 质量相关状态
  const [videoResolution, setVideoResolution] = useState('');
  const [videoStandard, setVideoStandard] = useState('');
  const [audioFormat, setAudioFormat] = useState('');
  const [videoFormat, setVideoFormat] = useState('');

  // MediaInfo
  const [mediaInfo, setMediaInfo] = useState<MediaInfoResult>({});
  const [mediaInfoText, setMediaInfoText] = useState('');

  // 选项常量（用 useMemo 保持稳定引用，减少不必要渲染）
  const mainCategories = useMemo(() => categoryTree, []);
  const resolutionOptions = useMemo(
    () => [
      'SD 480p',
      'HD 720',
      'HD 720i',
      'HD 720p',
      'Full HD 1080',
      'Full HD 1080i',
      'Full HD 1080p',
      'QHD 1440p',
      '2K/DCI (2048)',
      '4K UHD',
    ],
    []
  );
  const videoCodecOptions = useMemo(
    () => ['H.264/AVC', 'H.265/HEVC', 'AV1', 'VC-1', 'MPEG-2', 'MPEG-4/XviD', 'Other'],
    []
  );
  const audioCodecOptions = useMemo(
    () => ['AAC', 'AC-3', 'DTS', 'DTS-HD MA', 'Dolby Atmos', 'TrueHD', 'FLAC', 'APE', 'MP3', 'OGG', 'Other'],
    []
  );
  const countryOptions = useMemo(
    () => [
      '中国大陆',
      '中国香港',
      '中国台湾',
      '美国',
      '日本',
      '韩国',
      '英国',
      '法国',
      '德国',
      '意大利',
      '西班牙',
      '其他',
    ],
    []
  );
  const languageOptions = useMemo(
    () => [
      '汉语普通话',
      '粤语',
      '英语',
      '日语',
      '韩语',
      '法语',
      '德语',
      '西班牙语',
      '意大利语',
      '俄语',
      '其他',
    ],
    []
  );
  const subtitleOptions = useMemo(
    () => [
      '简体中文',
      '繁体中文',
      '英文',
      '日文',
      '韩文',
      '法文',
      '德文',
      '西班牙文',
      '双语',
      '无字幕',
    ],
    []
  );

  // 根据主分类派生副分类列表
  const subCategories = useMemo(
    () => categoryTree.find((c) => c.id === selectedCategory)?.subCategories ?? [],
    [selectedCategory]
  );

  // 从 URL hash 回填表单（无需兼容旧代码，直接按现有逻辑解析并覆盖对应字段）
  useEffect(() => {
    if (location.hash && location.hash.includes('#separator#')) {
      const rawData = extractDataFromHash(location.hash);
      const mappedData = mapDataToForm(rawData);

      if (mappedData.title) setTitle(mappedData.title);
      if (mappedData.subTitle) setSubTitle(mappedData.subTitle);
      if (mappedData.imdbUrl) setImdbUrl(mappedData.imdbUrl);
      if (mappedData.doubanUrl) setDoubanUrl(mappedData.doubanUrl);
      if (mappedData.description) setDescription(mappedData.description);
      if (mappedData.uploadedPoster && !uploadedPoster) setUploadedPoster(mappedData.uploadedPoster);
      if (mappedData.selectedCategory) setSelectedCategory(mappedData.selectedCategory);
      if (mappedData.selectedSubCategories !== undefined)
        setSelectedSubCategories(mappedData.selectedSubCategories);
      if (mappedData.region) setRegion(mappedData.region);
      if (mappedData.videoStandard) setVideoStandard(mappedData.videoStandard);
      if (mappedData.videoFormat) setVideoFormat(mappedData.videoFormat);
      if (mappedData.audioFormat) setAudioFormat(mappedData.audioFormat);
      if (mappedData.videoResolution) setVideoResolution(mappedData.videoResolution);
      if (mappedData.mediaInfoText) {
        setMediaInfoText(mappedData.mediaInfoText);
        try {
          const parsed = parseMediaInfo(mappedData.mediaInfoText);
          setMediaInfo(parsed);
          if (!videoResolution && parsed.Video?.resolution) setVideoResolution(parsed.Video.resolution);
          if (!videoStandard && (parsed.Video as any)?.standard) setVideoStandard((parsed.Video as any).standard);
          if (!audioFormat && parsed.Audio?.format) setAudioFormat(parsed.Audio.format);
        } catch (e) {
          console.error('Re-parsing MediaInfo for state failed', e);
        }
      }
    }
  }, [location.hash]);

  /**
   * 在多选集合中切换某个值的选中状态。
   * 说明：
   * - 若存在则移除；若不存在则添加。
   * - 保持不可变数据更新以触发渲染。
   */
  const toggleSelection = (value: string, selected: string[], setter: (val: string[]) => void) => {
    if (selected.includes(value)) setter(selected.filter((v) => v !== value));
    else setter([...selected, value]);
  };

  /** 将文件转为 base64（移除 data: 前缀，仅保留主体） */
  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const result = reader.result as string;
        const base64 = result.split(',')[1];
        resolve(base64);
      };
      reader.onerror = (error) => reject(error);
    });
  };

  /** 海报文件选择与上传 */
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
      if (url) setUploadedPoster(url);
    } catch (err: any) {
      customToast.error(err?.message || '上传海报失败');
    } finally {
      setPosterUploading(false);
      e.target.value = '';
    }
  };

  /** 剧照文件选择与上传（支持多选） */
  const onShotsInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;
    try {
      setShotsUploading(true);
      const uploads = files.map(async (file) => {
        const base64 = await fileToBase64(file);
        return ImagesService.imagesControllerUpload({ content: base64, filename: file.name, mimeType: file.type });
      });
      const results = await Promise.all(uploads);
      const urls = results.map((r) => r.data?.url).filter((u): u is string => !!u);
      if (urls.length) setScreenshots((prev) => [...prev, ...urls]);
    } catch (err: any) {
      customToast.error(err?.message || '上传截图失败');
    } finally {
      setShotsUploading(false);
      e.target.value = '';
    }
  };

  /** 选择种子文件并进行去重校验（根据 infoHash 查询是否已存在） */
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
      if (exists) customToast.error('该种子在网站上已经存在');
    } catch (err: any) {
      customToast.error(err?.message || '校验失败');
    }
  };

  /** MediaInfo 文本变更解析并回填质量相关字段 */
  const handleMediaInfoChange = async (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value;
    setMediaInfoText(text);
    try {
      const info = parseMediaInfo(text);
      setMediaInfo(info);
      if (info.Video?.resolution) setVideoResolution(info.Video.resolution);
      if ((info.Video as any)?.standard) setVideoStandard((info.Video as any).standard);
      if (info.Audio?.format) setAudioFormat(info.Audio.format);
      // 如需未来支持：若解析到视频编码可直接回填
      // if (info.Video?.format) setVideoFormat(info.Video.format);
    } catch (err: any) {
      customToast.error(err?.message || '解析 MediaInfo 失败');
    }
  };

  /** 表单提交：进行必要校验并调用上传服务 */
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
      const data: any = body?.data ?? body;
      const msg = data?.message ?? '发布成功';
      customToast.success(msg);
      navigate('/torrents');
    } catch (err: any) {
      const msg = extractErrorMessage(err, '发布失败');
      customToast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  /** 通过 PT-GEN 获取简介并填充到描述文本 */
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
      console.error(e);
      setPtGenError(String(e?.message ?? '获取失败'));
    } finally {
      setPtGenLoading(false);
    }
  };

  return {
    // 分类与选项
    mainCategories,
    resolutionOptions,
    videoCodecOptions,
    audioCodecOptions,
    countryOptions,
    languageOptions,
    subtitleOptions,
    selectedCategory,
    setSelectedCategory,
    selectedSubCategories,
    setSelectedSubCategories,
    toggleSubCategory,
    subCategories,

    // 基本信息
    title,
    setTitle,
    subTitle,
    setSubTitle,
    torrentFile,
    onTorrentInputChange,

    // 质量信息
    videoResolution,
    setVideoResolution,
    videoStandard,
    setVideoStandard,
    audioFormat,
    setAudioFormat,
    videoFormat,
    setVideoFormat,
    productionTeam,
    setProductionTeam,
    mediaInfo,
    mediaInfoText,
    handleMediaInfoChange,

    // 扩展信息
    region,
    setRegion,
    imdbUrl,
    setImdbUrl,
    doubanUrl,
    setDoubanUrl,
    ptGenUrl,
    setPtGenUrl,
    ptGenLoading,
    ptGenError,
    fetchPtGen,
    selectedLanguages,
    setSelectedLanguages,
    selectedSubtitles,
    setSelectedSubtitles,
    toggleSelection,

    // 图片
    uploadedPoster,
    setUploadedPoster,
    posterUploading,
    shotsUploading,
    posterInputRef,
    shotsInputRef,
    onPosterInputChange,
    onShotsInputChange,
    screenshots,
    setScreenshots,

    // 发布与提交
    isAnonymous,
    setIsAnonymous,
    description,
    setDescription,
    submitting,
    handleSubmit,
  };
}

