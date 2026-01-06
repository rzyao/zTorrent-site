import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ImagesService } from '@/api/services/ImagesService';
import { PtGenService } from '@/api/services/PtGenService';
import { TorrentsUploadService } from '@/api/services/TorrentsUploadService';
import { customToast } from '@/hooks/useToast';
import { categoryTree, parseMediaInfo } from '@/types/UploadTorrentPage';
import { useUploadStore } from '@/stores/uploadStore';
import { extractDataFromHash, mapDataToForm } from '@/utils/hashParser';
import { extractErrorMessage } from '@/utils/errorMessage';
import { extractInfoBytes } from '@/utils/torrentParser';
import { usePreferenceCategoriesStore } from '@/stores/preferenceCategoriesStore';

/**
 * useUploadTorrent
 * 将 `UploadTorrentPage` 中所有业务逻辑、状态管理与副作用集中到自定义 Hook。
 * UI 层通过该 Hook 提供的状态与方法进行渲染与交互，确保组件无状态、纯展示。
 */
export function useUploadTorrent() {
  const navigate = useNavigate();
  const location = useLocation();

  // 从 Store 获取所有状态和 Action
  const store = useUploadStore();
  const prefStore = usePreferenceCategoriesStore();
  const {
    // 状态
    selectedCategory,
    selectedTags,
    selectedLanguages,
    selectedSubtitles,
    uploadedPoster,
    screenshots,
    isAnonymous,
    ptGenUrl,
    ptGenLoading,
    ptGenError,
    description,
    title,
    subTitle,
    productionTeam,
    region,
    imdbUrl,
    doubanUrl,
    torrentFile,
    submitting,
    videoResolution,
    videoStandard,
    audioFormat,
    videoFormat,
    mediaInfoText,
    mediaInfo,

    // Actions
    setSelectedCategory,
    setSelectedTags,
    setSelectedLanguages,
    setSelectedSubtitles,
    toggleTag,
    toggleLanguage,
    toggleSubtitle,
    setUploadedPoster,
    // clearUploadedPoster,
    addScreenshots,
    removeScreenshot,
    setIsAnonymous,
    setTitle,
    setSubTitle,
    setDescription,
    setProductionTeam,
    setRegion,
    setImdbUrl,
    setDoubanUrl,
    setPtGenUrl,
    setPtGenLoading,
    setPtGenError,
    setTorrentFile,
    setSubmitting,
    setVideoResolution,
    setVideoStandard,
    setAudioFormat,
    setVideoFormat,
    setMediaInfoText,
    setMediaInfo,
    setForm,
    reset,
  } = store;

  // 本地 UI 状态（非业务数据，不需要存 Store）
  const [posterUploading, setPosterUploading] = useState(false);
  const [shotsUploading, setShotsUploading] = useState(false);
  const posterInputRef = useRef<HTMLInputElement>(null);
  const shotsInputRef = useRef<HTMLInputElement>(null);

  // 选项常量（用 useMemo 保持稳定引用）
  const mainCategories = useMemo(() => {
    if (prefStore.torrent && prefStore.torrent.length > 0) {
      return prefStore.torrent.map((item) => {
        // 尝试从原始硬编码 tree 中匹配子分类，以保留标签定义
        const original = categoryTree.find((c) => c.id === item.key);
        return {
          id: item.key,
          name: item.label,
          subCategories: original?.subCategories ?? [],
        };
      });
    }
    return categoryTree;
  }, [prefStore.torrent]);
  const resolutionOptions = useMemo(
    () => [
      'SD 480p', 'HD 720', 'HD 720i', 'HD 720p',
      'Full HD 1080', 'Full HD 1080i', 'Full HD 1080p',
      'QHD 1440p', '2K/DCI (2048)', '4K UHD',
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
    () => ['中国大陆', '中国香港', '中国台湾', '美国', '日本', '韩国', '英国', '法国', '德国', '意大利', '西班牙', '其他'],
    []
  );
  const languageOptions = useMemo(
    () => ['汉语普通话', '粤语', '英语', '日语', '韩语', '法语', '德语', '西班牙语', '意大利语', '俄语', '其他'],
    []
  );
  const subtitleOptions = useMemo(
    () => ['简体中文', '繁体中文', '英文', '日文', '韩文', '法文', '德文', '西班牙文', '双语', '无字幕'],
    []
  );

  // 根据分类派生标签列表
  const subCategories = useMemo(
    () => mainCategories.find((c) => c.id === selectedCategory)?.subCategories ?? [],
    [selectedCategory, mainCategories]
  );

  // 初始化：解析 Hash 或重置表单
  useEffect(() => {
    if (location.hash && location.hash.includes('#separator#')) {
      reset(); // 先清除可能残留的数据
      const rawData = extractDataFromHash(location.hash);
      const mappedData = mapDataToForm(rawData);

      setForm({
        ...mappedData,
        mediaInfo: mappedData.mediaInfoText ? parseMediaInfo(mappedData.mediaInfoText) : {},
      });

      if (mappedData.mediaInfoText) {
        try {
          const parsed = parseMediaInfo(mappedData.mediaInfoText);
          const updates: any = {};
          if (!mappedData.videoResolution && parsed.Video?.resolution) updates.videoResolution = parsed.Video.resolution;
          if (!mappedData.videoStandard && (parsed.Video as any)?.standard) updates.videoStandard = (parsed.Video as any).standard;
          if (!mappedData.audioFormat && parsed.Audio?.format) updates.audioFormat = parsed.Audio.format;

          if (Object.keys(updates).length > 0) {
            setForm(updates);
          }
        } catch (e) {
          console.error('Re-parsing MediaInfo for state failed', e);
        }
      }
    } else {
      reset();
    }
  }, [location.hash, reset, setForm]);

  /** 将文件转为 base64（移除 data: 前缀，仅保留主体） */
  const fileToBase64 = useCallback((file: File): Promise<string> => {
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
  }, []);

  /** 海报文件选择与上传 */
  const onPosterInputChange = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
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
  }, [fileToBase64, setUploadedPoster]);

  /** 剧照文件选择与上传（支持多选） */
  const onShotsInputChange = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
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
      if (urls.length) addScreenshots(urls);
    } catch (err: any) {
      customToast.error(err?.message || '上传截图失败');
    } finally {
      setShotsUploading(false);
      e.target.value = '';
    }
  }, [fileToBase64, addScreenshots]);

  /** 选择种子文件并进行去重校验（根据 infoHash 查询是否已存在） */
  const onTorrentInputChange = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setTorrentFile(file);
      const buffer = await file.arrayBuffer();
      const infoBytes = extractInfoBytes(buffer);
      const digest = await crypto.subtle.digest('SHA-1', infoBytes);
      const infoHash = Array.from(new Uint8Array(digest)).map((b) => b.toString(16).padStart(2, '0')).join('');
      const resp = await TorrentsUploadService.torrentUploadControllerExistsByInfoHash({ infoHash });
      const body: any = (resp as any)?.code !== undefined ? resp : (resp as any)?.data;
      const exists = Boolean(body?.data?.exists ?? body?.exists);
      if (exists) customToast.error('该种子在网站上已经存在');
    } catch (err: any) {
      customToast.error(err?.message || '校验失败');
    }
  }, [setTorrentFile]);

  /** MediaInfo 文本变更 - 仅更新文本状态，解析逻辑防抖处理 */
  const handleMediaInfoChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMediaInfoText(e.target.value);
  }, [setMediaInfoText]);

  /**
   * 监听 mediaInfoText 变化，防抖解析并回填表单
   */
  useEffect(() => {
    // 如果为空，清空解析结果
    if (!mediaInfoText.trim()) {
      // 避免不必要的更新
      if (Object.keys(mediaInfo).length > 0) {
        setMediaInfo({});
      }
      return;
    }

    const timer = setTimeout(() => {
      try {
        const info = parseMediaInfo(mediaInfoText);
        setMediaInfo(info);

        // 自动回填解析出的字段
        const updates: any = {};
        if (info.Video?.resolution) updates.videoResolution = info.Video.resolution;
        if ((info.Video as any)?.standard) updates.videoStandard = (info.Video as any).standard;
        if (info.Audio?.format) updates.audioFormat = info.Audio.format;

        if (Object.keys(updates).length > 0) {
          setForm(updates);
        }
      } catch (err: any) {
        console.error('解析 MediaInfo 失败', err);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [mediaInfoText, setMediaInfo, setForm]);

  /** 表单提交：进行必要校验并调用上传服务 */
  const handleSubmit = useCallback(async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (submitting) return;
    const errors: string[] = [];
    if (!torrentFile) errors.push('请选择种子文件');
    if (!selectedCategory) errors.push('请选择分类');
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
        tags: selectedTags.length ? selectedTags : undefined,
      };
      const resp = await TorrentsUploadService.torrentUploadControllerUpload(formData as any);
      const body: any = (resp as any)?.code !== undefined ? resp : (resp as any)?.data;
      const data: any = body?.data ?? body;
      const msg = data?.message ?? '发布成功';
      customToast.success(msg);
      // 成功后重置表单并跳转
      reset();
      navigate('/torrents');
    } catch (err: any) {
      const msg = extractErrorMessage(err, '发布失败');
      customToast.error(msg);
    } finally {
      setSubmitting(false);
    }
  }, [
    submitting, torrentFile, selectedCategory, title, subTitle, description, uploadedPoster,
    selectedTags, videoStandard, videoFormat, audioFormat, productionTeam, region,
    selectedLanguages, selectedSubtitles, imdbUrl, doubanUrl, mediaInfoText, isAnonymous, screenshots,
    setSubmitting, reset, navigate
  ]);

  /** 通过 PT-GEN 获取简介并填充到描述文本 */
  const fetchPtGen = useCallback(async () => {
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
  }, [ptGenUrl, setPtGenError, setPtGenLoading, setDescription]);

  // Stable handlers for child components
  const handleClearTags = useCallback(() => setSelectedTags([]), [setSelectedTags]);
  const handleDescriptionChange = useCallback((v: string) => setDescription(v), [setDescription]);
  const handlePosterRemove = useCallback(() => setUploadedPoster(''), [setUploadedPoster]);
  const handleRemoveScreenshot = useCallback((index: number) => removeScreenshot(index), [removeScreenshot]);
  const handleAddScreenshotUrl = useCallback((url: string) => addScreenshots([url]), [addScreenshots]);
  const handlePosterUrlChange = useCallback((url: string) => setUploadedPoster(url), [setUploadedPoster]);
  const handleCancel = useCallback(() => navigate('/torrents'), [navigate]);

  return useMemo(() => ({
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
    selectedTags,
    setSelectedTags,
    toggleTag,
    tags: subCategories,
    handleClearTags,

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
    toggleLanguage,
    toggleSubtitle,

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
    handleRemoveScreenshot,
    handleAddScreenshotUrl,
    handlePosterRemove,
    handlePosterUrlChange,

    // 发布与提交
    isAnonymous,
    setIsAnonymous,
    description,
    setDescription,
    handleDescriptionChange,
    submitting,
    handleSubmit,
    handleCancel,
  }), [
    mainCategories, resolutionOptions, videoCodecOptions, audioCodecOptions, countryOptions, languageOptions, subtitleOptions,
    selectedCategory, setSelectedCategory, selectedTags, setSelectedTags, toggleTag, subCategories, handleClearTags,
    title, setTitle, subTitle, setSubTitle, torrentFile, onTorrentInputChange,
    videoResolution, setVideoResolution, videoStandard, setVideoStandard, audioFormat, setAudioFormat, videoFormat, setVideoFormat, productionTeam, setProductionTeam, mediaInfo, mediaInfoText, handleMediaInfoChange,
    region, setRegion, imdbUrl, setImdbUrl, doubanUrl, setDoubanUrl, ptGenUrl, setPtGenUrl, ptGenLoading, ptGenError, fetchPtGen,
    selectedLanguages, setSelectedLanguages, selectedSubtitles, setSelectedSubtitles, toggleLanguage, toggleSubtitle,
    uploadedPoster, setUploadedPoster, posterUploading, shotsUploading, posterInputRef, shotsInputRef, onPosterInputChange, onShotsInputChange, screenshots,
    handleRemoveScreenshot, handleAddScreenshotUrl, handlePosterRemove, handlePosterUrlChange,
    isAnonymous, setIsAnonymous, description, setDescription, handleDescriptionChange, submitting, handleSubmit, handleCancel
  ]);
}