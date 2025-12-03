import { useEffect, useState } from 'react';
import { useDynamicTitle } from '@/hooks/useDynamicTitle';
import {
  Film,
  Plus,
  Edit,
  Trash2,
  Save,
  X,
  Search,
  Image as ImageIcon,
  Star,
  Calendar,
  Clock,
  Award,
  Users,
  Video,
  FileText,
  Link,
  Download,
  Upload as UploadIcon,
  Eye,
  ChevronRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useFilms } from '@/hooks/useFilms';
import { TorrentsService } from '@/api/services/TorrentsService';
import { FilmsService } from '@/api/services/FilmsService';
import { PtGenService } from '@/api/services/PtGenService';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { formatSize } from '@/utils/format';

interface Torrent {
  id: string;
  title?: string;
  subTitle?: string;
  version: string; // 例如: "4K HDR REMUX", "1080p BluRay"
  size: string;
  quality: string;
  standard?: string;
  source: string; // BluRay, WEB-DL, HDTV
  codec: string; // H.264, H.265, AV1
  audio: string; // DTS-HD MA, Dolby Atmos
  seeders: number;
  leechers: number;
  uploadDate: string;
  isFree?: boolean;
  isVip?: boolean;
}

interface Movie {
  id: string;
  title: string;
  originalTitle: string;
  year: string;
  poster: string;
  backdrop: string;
  category: string; // 电影, 剧集, 纪录片, 动漫
  genres: string[]; // 科幻, 动作, 剧情
  rating: number;
  duration: string; // 169分钟 或 8集
  director: string;
  cast: string[];
  description: string;
  torrents: Torrent[];
  createdAt: string;
  updatedAt: string;
}

export function EditMoviePage() {
  useDynamicTitle('影片编辑');
  const { listFilms, getFilm, createFilm, updateFilm, deleteFilm, addTorrent, removeTorrent } = useFilms();
  const [movies, setMovies] = useState<Movie[]>([
    {
      id: '1',
      title: '星际穿越',
      originalTitle: 'Interstellar',
      year: '2014',
      poster: 'https://images.unsplash.com/photo-1592780828756-c418d71faa1f?w=400',
      backdrop: 'https://images.unsplash.com/photo-1592780828756-c418d71faa1f?w=1920',
      category: '电影',
      genres: ['科幻', '剧情', '冒险'],
      rating: 9.8,
      duration: '169分钟',
      director: '克里斯托弗·诺兰',
      cast: ['马修·麦康纳', '安妮·海瑟薇', '杰西卡·查斯坦'],
      description: '在地球即将毁灭之际，前宇航员库珀必须离开家人，带领一支探险队穿越虫洞，寻找人类的新家园。',
      torrents: [
        {
          id: 't1',
          version: '4K HDR REMUX 国英双语',
          size: '68.5 GB',
          quality: '2160p',
          standard: '2160p',
          source: 'BluRay',
          codec: 'H.265',
          audio: 'Dolby Atmos',
          seeders: 2847,
          leechers: 156,
          uploadDate: '2024-11-10',
          isFree: true,
        },
        {
          id: 't2',
          version: '1080p BluRay 国语',
          size: '18.2 GB',
          quality: '1080p',
          standard: '1080p',
          source: 'BluRay',
          codec: 'H.264',
          audio: 'DTS-HD MA',
          seeders: 1234,
          leechers: 89,
          uploadDate: '2024-10-15',
        },
        {
          id: 't3',
          version: '720p WEB-DL',
          size: '4.5 GB',
          quality: '720p',
          standard: '720p',
          source: 'WEB-DL',
          codec: 'H.264',
          audio: 'AAC',
          seeders: 567,
          leechers: 34,
          uploadDate: '2024-09-20',
        },
      ],
      createdAt: '2024-09-15',
      updatedAt: '2024-11-10',
    },
    {
      id: '2',
      title: '盗梦空间',
      originalTitle: 'Inception',
      year: '2010',
      poster: 'https://images.unsplash.com/photo-1592780828756-c418d71faa1f?w=400',
      backdrop: 'https://images.unsplash.com/photo-1592780828756-c418d71faa1f?w=1920',
      category: '电影',
      genres: ['科幻', '动作', '悬疑'],
      rating: 9.6,
      duration: '148分钟',
      director: '克里斯托弗·诺兰',
      cast: ['莱昂纳多·迪卡普里奥', '玛丽昂·歌迪亚', '汤姆·哈迪'],
      description: '一个专业的盗梦者进入他人梦境盗取机密，这次他要完成一个看似不可能的任务：在梦中植入想法。',
      torrents: [
        {
          id: 't4',
          version: '4K UHD BluRay',
          size: '76.3 GB',
          quality: '2160p',
          standard: '2160p',
          source: 'BluRay',
          codec: 'H.265',
          audio: 'DTS-HD MA',
          seeders: 1892,
          leechers: 345,
          uploadDate: '2024-11-05',
        },
      ],
      createdAt: '2024-10-01',
      updatedAt: '2024-11-05',
    },
    {
      id: '3',
      title: '权力的游戏',
      originalTitle: 'Game of Thrones',
      year: '2011-2019',
      poster: 'https://images.unsplash.com/photo-1560169897-fc0cdbdfa4d5?w=400',
      backdrop: 'https://images.unsplash.com/photo-1560169897-fc0cdbdfa4d5?w=1920',
      category: '剧集',
      genres: ['奇幻', '剧情', '冒险'],
      rating: 9.5,
      duration: '全8季73集',
      director: 'David Benioff / D.B. Weiss',
      cast: ['艾米莉亚·克拉克', '基特·哈灵顿', '彼特·丁拉基'],
      description: '七个王国为了争夺铁王座而展开的权力斗争，同时北方的异鬼威胁正在逼近。',
      torrents: [
        {
          id: 't5',
          version: '全八季 1080p BluRay 内封中字',
          size: '124.8 GB',
          quality: '1080p',
          standard: '1080p',
          source: 'BluRay',
          codec: 'H.264',
          audio: 'DTS-HD MA',
          seeders: 2156,
          leechers: 89,
          uploadDate: '2024-10-20',
          isFree: true,
        },
      ],
      createdAt: '2024-09-10',
      updatedAt: '2024-10-20',
    },
  ]);

  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  // 是否显示“选择已有种子”的搜索面板
  const [showTorrentSearch, setShowTorrentSearch] = useState(false);
  // 影片编辑表单错误
  const [errors, setErrors] = useState<Record<string, string>>({});
  // 种子搜索相关状态
  const [torrentSearchQuery, setTorrentSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [searchError, setSearchError] = useState<string | null>(null);

  // 影片编辑表单状态
  const [movieForm, setMovieForm] = useState({
    title: '',
    originalTitle: '',
    year: '',
    poster: '',
    backdrop: '',
    category: '电影',
    genres: [] as string[],
    rating: 0,
    duration: '',
    director: '',
    cast: [] as string[],
    description: '',
    // 新增字段：按需从 PT-Gen 映射填充
    awards: [] as string[],
    region: [] as string[],
    language: [] as string[],
    doubanLink: '',
    imdbLink: '',
    doubanRatingAverage: 0 as number,
    imdbRatingAverage: 0 as number,
  });

  // 旧的“上传并创建新种子”表单已移除，改为“搜索并绑定已有种子”

  const handleCreateNew = () => {
    setMovieForm({
      title: '',
      originalTitle: '',
      year: '',
      poster: '',
      backdrop: '',
      category: '电影',
      genres: [],
      rating: 0,
      duration: '',
      director: '',
      cast: [],
      description: '',
      awards: [],
      region: [],
      language: [],
      doubanLink: '',
      imdbLink: '',
      doubanRatingAverage: 0,
      imdbRatingAverage: 0,
    });
    setIsCreating(true);
    setIsEditing(false);
    setSelectedMovie(null);
  };

  const handleEdit = (movie: Movie) => {
    setMovieForm({
      title: movie.title,
      originalTitle: movie.originalTitle,
      year: movie.year,
      poster: movie.poster,
      backdrop: movie.backdrop,
      category: movie.category,
      genres: movie.genres,
      rating: movie.rating,
      duration: movie.duration,
      director: movie.director,
      cast: movie.cast,
      description: movie.description,
      // 新增字段在现有详情数据中不存在，编辑模式下置为空，避免未定义
      awards: [],
      region: [],
      language: [],
      doubanLink: '',
      imdbLink: '',
      doubanRatingAverage: 0,
      imdbRatingAverage: 0,
    });
    setSelectedMovie(movie);
    setIsEditing(true);
    setIsCreating(false);
  };

  const handleSaveMovie = async () => {
    const payload = {
      title: movieForm.title,
      description: movieForm.description,
      // 后端已移除 coverUrl 字段，避免 400 "property coverUrl should not exist"
      originalTitle: movieForm.originalTitle,
      year: movieForm.year,
      category: movieForm.category === '电影' ? 'film' : movieForm.category === '剧集' ? 'series' : movieForm.category === '纪录片' ? 'documentary' : 'anime',
      rating: movieForm.rating,
      duration: movieForm.duration,
      director: movieForm.director,
      posterUrl: movieForm.poster,
      backdropUrl: movieForm.backdrop,
      genres: movieForm.genres,
      cast: movieForm.cast,
      awards: movieForm.awards,
      region: movieForm.region,
      language: movieForm.language,
      doubanLink: movieForm.doubanLink,
      imdbLink: movieForm.imdbLink,
      doubanRatingAverage: movieForm.doubanRatingAverage,
      imdbRatingAverage: movieForm.imdbRatingAverage,
      enabled: true,
      sort: 0,
    } as any;

    const { valid, errs } = validateFilmForm(movieForm);
    if (!valid) {
      setErrors(errs);
      return alert('请先修正表单中的错误后再提交');
    }
    try {
      if (isCreating) {
        const res = await createFilm(payload);
        const newId = res?.id || res;
        const detail = await getFilm(String(newId));
        const mapped = mapBackendFilmToLocal(detail);
        setMovies([mapped, ...movies]);
        setSelectedMovie(mapped);
        setIsCreating(false);
      } else if (selectedMovie) {
        await updateFilm(selectedMovie.id, payload);
        const detail = await getFilm(selectedMovie.id);
        const mapped = mapBackendFilmToLocal(detail);
        setMovies(movies.map((m) => (m.id === selectedMovie.id ? mapped : m)));
        setSelectedMovie(mapped);
        setIsEditing(false);
      }
    } catch (e: any) {
      alert(e?.message || '保存失败');
    }
  };

  const handleDeleteMovie = async (id: string) => {
    if (confirm('确定要删除这部影片吗？所有关联的种子也会被删除。')) {
      try {
        await deleteFilm(id);
        setMovies(movies.filter((m) => m.id !== id));
        if (selectedMovie?.id === id) {
          setSelectedMovie(null);
        }
      } catch (e: any) {
        alert(e?.message || '删除失败');
      }
    }
  };

  // 绑定已有种子到当前影片
  const handleBindExistingTorrent = async (torrentId: string) => {
    if (!selectedMovie) return;
    try {
      await addTorrent(selectedMovie.id, String(torrentId));
      // 绑定成功后通过列表接口刷新已绑定种子
      const resp: any = await FilmsService.filmsControllerListTorrents({ filmId: selectedMovie.id, page: 1, limit: 100 });
      const body = resp?.code !== undefined ? resp : resp?.data ?? resp;
      const items = body?.data?.items ?? body?.items ?? [];
        const mappedTorrents = Array.isArray(items)
          ? items.map((t: any) => ({
              id: String(t?.id ?? t?.torrentId ?? ''),
              title: t?.title ?? '',
              subTitle: t?.subTitle ?? '',
              version: t?.version ?? t?.name ?? t?.quality ?? '',
              size: t?.size ?? '',
              quality: t?.quality ?? '',
              standard: t?.standard ?? '',
              source: t?.source ?? '',
              codec: t?.codec ?? t?.videoCodec ?? '',
              audio: t?.audio ?? t?.audioCodec ?? '',
              seeders: t?.seeders ?? 0,
              leechers: t?.leechers ?? 0,
              uploadDate: t?.uploadDate ?? '',
              isFree: t?.isFree ?? false,
              isVip: t?.isVip ?? false,
            }))
          : [];
      const next = { ...(selectedMovie as any), torrents: mappedTorrents } as Movie;
      setSelectedMovie(next);
      setMovies(movies.map((m) => (m.id === next.id ? next : m)));
      setShowTorrentSearch(false);
      setTorrentSearchQuery('');
      setSearchResults([]);
    } catch (e: any) {
      alert(e?.message || '绑定失败');
    }
  };

  const handleRemoveTorrent = async (torrentId: string) => {
    if (selectedMovie) {
      try {
        await removeTorrent(selectedMovie.id, torrentId);
        // 移除后通过列表接口刷新已绑定种子
        const resp: any = await FilmsService.filmsControllerListTorrents({ filmId: selectedMovie.id, page: 1, limit: 100 });
        const body = resp?.code !== undefined ? resp : resp?.data ?? resp;
        const items = body?.data?.items ?? body?.items ?? [];
        const mappedTorrents = Array.isArray(items)
          ? items.map((t: any) => ({
              id: String(t?.id ?? t?.torrentId ?? ''),
              title: t?.title ?? '',
              subTitle: t?.subTitle ?? '',
              version: t?.version ?? t?.name ?? t?.quality ?? '',
              size: t?.size ?? '',
              quality: t?.quality ?? '',
              standard: t?.standard ?? '',
              source: t?.source ?? '',
              codec: t?.codec ?? t?.videoCodec ?? '',
              audio: t?.audio ?? t?.audioCodec ?? '',
              seeders: t?.seeders ?? 0,
              leechers: t?.leechers ?? 0,
              uploadDate: t?.uploadDate ?? '',
              isFree: t?.isFree ?? false,
              isVip: t?.isVip ?? false,
            }))
          : [];
        const next = { ...(selectedMovie as any), torrents: mappedTorrents } as Movie;
        setSelectedMovie(next);
        setMovies(movies.map((m) => (m.id === next.id ? next : m)));
      } catch (e: any) {
        alert(e?.message || '移除失败');
      }
    }
  };

  const filteredMovies = movies.filter(
    (m) =>
      m.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.originalTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.director.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    (async () => {
      try {
        const list = await listFilms({ page: 1, limit: 50, keyword: searchQuery });
        const mapped = (list?.items ?? []).map(mapBackendFilmToLocal);
        setMovies(mapped);
      } catch (e) {
        // ignore
      }
    })();
  }, [searchQuery]);

  // 选中影片时，通过列表接口刷新该影片的已绑定种子
  useEffect(() => {
    (async () => {
      if (!selectedMovie) return;
      try {
        const resp: any = await FilmsService.filmsControllerListTorrents({ filmId: selectedMovie.id, page: 1, limit: 100 });
        const body = resp?.code !== undefined ? resp : resp?.data ?? resp;
        const items = body?.data?.items ?? body?.items ?? [];
        const mappedTorrents = Array.isArray(items)
          ? items.map((t: any) => ({
              id: String(t?.id ?? t?.torrentId ?? ''),
              title: t?.title ?? '',
              subTitle: t?.subTitle ?? '',
              version: t?.version ?? t?.name ?? t?.quality ?? '',
              size: t?.size ?? '',
              quality: t?.quality ?? '',
              standard: t?.standard ?? '',
              source: t?.source ?? '',
              codec: t?.codec ?? t?.videoCodec ?? '',
              audio: t?.audio ?? t?.audioCodec ?? '',
              seeders: t?.seeders ?? 0,
              leechers: t?.leechers ?? 0,
              uploadDate: t?.uploadDate ?? '',
              isFree: t?.isFree ?? false,
              isVip: t?.isVip ?? false,
            }))
          : [];
        const next = { ...(selectedMovie as any), torrents: mappedTorrents } as Movie;
        setSelectedMovie(next);
        setMovies(movies.map((m) => (m.id === next.id ? next : m)));
      } catch (e) {
        // ignore
      }
    })();
  }, [selectedMovie?.id]);

  // 防抖搜索已有种子（排除已绑定当前影片）
  useEffect(() => {
    if (!showTorrentSearch || !selectedMovie) return;
    const q = torrentSearchQuery.trim();
    if (q.length < 2) {
      // 少于2字符不发起搜索，避免空查询带来的不确定结果
      setSearchResults([]);
      setSearchError(null);
      return;
    }
    setIsSearching(true);
    setSearchError(null);
    const timer = setTimeout(async () => {
      try {
        const resp: any = await TorrentsService.torrentsControllerSearch({ q, filmId: selectedMovie.id });
        const body = resp?.code !== undefined ? resp : resp?.data ?? resp;
        const items = body?.data?.items ?? body?.items ?? [];
        setSearchResults(Array.isArray(items) ? items : []);
      } catch (e: any) {
        const msg = e?.body?.data?.message || e?.body?.message || e?.message || '搜索失败';
        setSearchError(msg);
      } finally {
        setIsSearching(false);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [torrentSearchQuery, showTorrentSearch, selectedMovie]);

  function isValidUrl(url: string) {
    if (!url) return true;
    try {
      const u = new URL(url);
      return u.protocol === 'http:' || u.protocol === 'https:';
    } catch {
      return false;
    }
  }

  function isValidYear(year: string) {
    if (!year) return false;
    return /^\d{4}(-\d{4})?$/.test(year);
  }

  function isValidRating(r: number) {
    return r >= 0 && r <= 10;
  }

  // 新增：基础清洗与解析工具
  function stripBackticksAndTrim(s: any) {
    const raw = String(s ?? '').trim();
    if (!raw) return '';
    return raw.replace(/^`+|`+$/g, '').trim();
  }

  function parseDurationToMinutes(text: string) {
    const t = String(text || '').trim();
    const m = t.match(/(\d+)(?=\s*分钟)/);
    return m ? m[1] : t;
  }

  // 新增：PT-Gen 工具栏状态
  const [ptGenUrl, setPtGenUrl] = useState('');
  const [ptGenLoading, setPtGenLoading] = useState(false);
  const [ptGenError, setPtGenError] = useState('');

  // 新增：应用 PT-Gen 返回数据到表单
  function applyPtGenToForm(data: any) {
    const cleanedPoster = stripBackticksAndTrim(data?.poster);
    const cleanedDouban = stripBackticksAndTrim(data?.doubanLink);
    const cleanedImdb = stripBackticksAndTrim(data?.imdbLink);
    const avgDouban = Number(data?.doubanRatingAverage ?? 0);
    const avgImdb = Number(data?.imdbRatingAverage ?? 0);
    const genres = Array.isArray(data?.genre) ? data.genre.filter(Boolean) : [];
    const region = Array.isArray(data?.region) ? data.region.filter(Boolean) : [];
    const language = Array.isArray(data?.language) ? data.language.filter(Boolean) : [];
    const directors = Array.isArray(data?.director) ? data.director.map((d: any) => d?.name).filter(Boolean).join(' / ') : (data?.director ?? '');
    const casts = Array.isArray(data?.cast) ? data.cast.map((c: any) => c?.name).filter(Boolean) : [];
    const awards = Array.isArray(data?.awards) ? data.awards.filter(Boolean) : [];

    setMovieForm((prev) => ({
      ...prev,
      title: data?.chineseTitle ?? prev.title,
      originalTitle: data?.foreignTitle ?? prev.originalTitle,
      year: String(data?.year ?? prev.year ?? ''),
      poster: cleanedPoster || prev.poster,
      genres: genres.length ? genres : prev.genres,
      duration: parseDurationToMinutes(data?.duration ?? prev.duration ?? ''),
      director: directors || prev.director,
      cast: casts.length ? casts : prev.cast,
      description: data?.introduction ?? prev.description,
      // 新增字段
      awards: awards.length ? awards : prev.awards,
      region: region.length ? region : prev.region,
      language: language.length ? language : prev.language,
      doubanLink: cleanedDouban || prev.doubanLink,
      imdbLink: cleanedImdb || prev.imdbLink,
      doubanRatingAverage: isNaN(avgDouban) ? prev.doubanRatingAverage : avgDouban,
      imdbRatingAverage: isNaN(avgImdb) ? prev.imdbRatingAverage : avgImdb,
      // 评分：保留原有 rating 但若为空则用豆瓣/IMDb 平均分
      rating: prev.rating || (!isNaN(avgDouban) && avgDouban ? avgDouban : (!isNaN(avgImdb) && avgImdb ? avgImdb : prev.rating)),
    }));
  }

  // 新增：触发 PT-Gen 获取并填充
  async function fetchPtGenAndFill() {
    setPtGenError('');
    if (!ptGenUrl.trim()) {
      setPtGenError('请输入有效的影片页面链接');
      return;
    }
    try {
      setPtGenLoading(true);
      const res: any = await PtGenService.ptGenControllerFetch({ url: ptGenUrl.trim() });
      const body = res?.code !== undefined ? res : res?.data ?? res;
      const data = body?.data?.raw ? body?.data : body?.data ?? body;
      if (!data) throw new Error('未获取到有效数据');
      applyPtGenToForm(data);
    } catch (e: any) {
      setPtGenError(e?.message || '获取失败');
    } finally {
      setPtGenLoading(false);
    }
  }

  function validateFilmForm(form: any) {
    const errs: Record<string, string> = {};
    if (!form.title?.trim()) errs.title = '标题为必填项';
    if (!isValidYear(String(form.year || ''))) errs.year = '年份格式必须为YYYY或YYYY-YYYY';
    if (!['电影', '剧集', '纪录片', '动漫'].includes(form.category)) errs.category = '类别必须为有效枚举';
    if (!isValidRating(Number(form.rating ?? 0))) errs.rating = '评分需在0到10之间';
    if (!isValidUrl(String(form.poster || ''))) errs.poster = '海报URL必须以http/https开头';
    if (!isValidUrl(String(form.backdrop || ''))) errs.backdrop = '背景URL必须以http/https开头';
    // 新增字段的基础校验
    if (form.doubanLink && !isValidUrl(String(form.doubanLink))) errs.doubanLink = '豆瓣链接必须为有效URL';
    if (form.imdbLink && !isValidUrl(String(form.imdbLink))) errs.imdbLink = 'IMDb链接必须为有效URL';
    if (!isValidRating(Number(form.doubanRatingAverage ?? 0))) errs.doubanRatingAverage = '豆瓣平均分需在0到10之间';
    if (!isValidRating(Number(form.imdbRatingAverage ?? 0))) errs.imdbRatingAverage = 'IMDb平均分需在0到10之间';
    return { valid: Object.keys(errs).length === 0, errs };
  }

  function mapBackendFilmToLocal(detail: any): Movie {
    const genres = Array.isArray(detail?.genre)
      ? detail.genre.filter(Boolean)
      : Array.isArray(detail?.genres)
        ? detail.genres.map((g: any) => (typeof g === 'string' ? g : g?.name)).filter(Boolean)
        : [];
  const torrents = Array.isArray(detail?.torrents)
    ? detail.torrents.map((t: any) => ({
      id: String(t?.id ?? t?.torrentId ?? ''),
      title: t?.title ?? '',
      subTitle: t?.subTitle ?? '',
      version: t?.version ?? t?.name ?? t?.quality ?? '',
      size: t?.size ?? '',
      quality: t?.quality ?? '',
      standard: t?.standard ?? '',
      source: t?.source ?? '',
      codec: t?.codec ?? t?.videoCodec ?? '',
      audio: t?.audio ?? t?.audioCodec ?? '',
      seeders: t?.seeders ?? 0,
      leechers: t?.leechers ?? 0,
      uploadDate: t?.uploadDate ?? '',
      isFree: t?.isFree ?? false,
      isVip: t?.isVip ?? false,
    }))
    : [];
    return {
      id: String(detail?.id ?? ''),
      title: detail?.title ?? '',
      originalTitle: detail?.originalTitle ?? '',
      year: String(detail?.year ?? ''),
      poster: detail?.poster ?? detail?.posterUrl ?? detail?.coverUrl ?? '',
      backdrop: detail?.backdrop ?? detail?.backdropUrl ?? '',
      category: detail?.category === 'series' ? '剧集' : detail?.category === 'documentary' ? '纪录片' : detail?.category === 'anime' ? '动漫' : '电影',
      genres,
      rating: Number(detail?.rating ?? 0),
      duration: typeof detail?.duration === 'number' ? `${detail.duration}分钟` : (detail?.duration ?? ''),
      director: detail?.director ?? '',
      cast: Array.isArray(detail?.cast) ? detail.cast : [],
      description: detail?.description ?? '',
      torrents,
      createdAt: String(detail?.createdAt ?? ''),
      updatedAt: String(detail?.updatedAt ?? ''),
    };
  }

  return (
    <div className="max-w-[1600px] mx-auto px-4 md:px-6 py-6">
      {/* 页面标题 */}
      <div className="mb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-lg shadow-amber-500/30">
              <Film className="w-5 h-5 text-white" />
            </div>
            <div className='flex items-end gap-1'>
              <h1 className="text-white text-3xl">影片编辑</h1>
              <p className="text-neutral-400 text-sm mt-1">
                管理影片信息和关联的种子版本
              </p>
            </div>
          </div>
          <Button
            onClick={handleCreateNew}
            className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white shadow-lg shadow-amber-500/25"
          >
            <Plus className="w-4 h-4 mr-2" />
            添加影片
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 左侧影片列表 */}
        <div className="lg:col-span-1">
          <div className="bg-gradient-to-br from-neutral-800/40 to-stone-900/40 backdrop-blur-sm rounded-2xl border border-neutral-700/50 overflow-hidden">
            <div className="p-4 border-b border-neutral-700/50">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="搜索影片..."
                  className="w-full bg-neutral-900/50 border border-neutral-700 rounded-lg pl-10 pr-4 py-2.5 text-white placeholder-neutral-500 focus:outline-none focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/20"
                />
              </div>
            </div>

            <div className="p-4 space-y-2 max-h-[calc(100vh-300px)] overflow-y-auto">
              {filteredMovies.length === 0 ? (
                <div className="text-center py-12">
                  <Film className="w-12 h-12 text-neutral-600 mx-auto mb-3" />
                  <p className="text-neutral-500 text-sm">暂无影片</p>
                </div>
              ) : (
                filteredMovies.map((movie) => (
                  <div
                    key={movie.id}
                    onClick={() => {
                      setSelectedMovie(movie);
                      setIsEditing(false);
                      setIsCreating(false);
                      setShowTorrentSearch(false);
                    }}
                    className={`p-4 rounded-xl cursor-pointer transition-all ${selectedMovie?.id === movie.id
                      ? 'bg-gradient-to-r from-amber-500/20 to-orange-600/20 border border-amber-500/30'
                      : 'bg-neutral-900/30 border border-neutral-700/50 hover:border-neutral-600'
                      }`}
                  >
                    <div className="flex gap-3">
                      <img
                        src={movie.poster || undefined}
                        alt={movie.title}
                        className="w-16 h-24 rounded-lg object-cover"
                      />
                      <div className="flex-1 min-w-0">
                        <h3 className="text-white text-sm mb-1 truncate">
                          {movie.title}
                        </h3>
                        <p className="text-neutral-400 text-xs mb-2 truncate">
                          {movie.originalTitle}
                        </p>
                        <div className="flex items-center gap-2 mb-2">
                          <Badge className="bg-amber-500/20 text-amber-400 text-xs">
                            {movie.category}
                          </Badge>
                          <span className="text-neutral-500 text-xs">{movie.year}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-amber-400 text-xs flex items-center gap-1">
                            <Star className="w-3 h-3 fill-amber-400" />
                            {movie.rating}
                          </span>
                          <span className="text-neutral-500 text-xs">
                            {movie.torrents.length} 个版本
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* 统计信息 */}
          <div className="mt-6 bg-gradient-to-br from-neutral-800/40 to-stone-900/40 backdrop-blur-sm rounded-2xl border border-neutral-700/50 p-5">
            <h3 className="text-neutral-400 text-xs uppercase tracking-wide mb-4">
              统计信息
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-neutral-400 text-sm">总影片数</span>
                <span className="text-white">{movies.length}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-neutral-400 text-sm">电影</span>
                <span className="text-amber-400">
                  {movies.filter((m) => m.category === '电影').length}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-neutral-400 text-sm">剧集</span>
                <span className="text-amber-400">
                  {movies.filter((m) => m.category === '剧集').length}
                </span>
              </div>
              <Separator className="bg-neutral-700/50" />
              <div className="flex items-center justify-between">
                <span className="text-neutral-400 text-sm">总种子数</span>
                <span className="text-green-400">
                  {movies.reduce((sum, m) => sum + m.torrents.length, 0)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* 右侧详情/编辑区 */}
        <div className="lg:col-span-2">
          <div className="bg-gradient-to-br from-neutral-800/40 to-stone-900/40 backdrop-blur-sm rounded-2xl border border-neutral-700/50 p-6 md:p-8">
            {/* 创建/编辑影片表单 */}
            {(isCreating || isEditing) && (
              <div className="space-y-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
                      <Edit className="w-4 h-4 text-white" />
                    </div>
                    <h2 className="text-white text-xl">
                      {isCreating ? '添加影片' : '编辑影片'}
                    </h2>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      setIsCreating(false);
                      setIsEditing(false);
                    }}
                    className="text-neutral-400 hover:text-white"
                  >
                    <X className="w-5 h-5" />
                  </Button>
                </div>

                {/* PT-Gen 工具栏：仅在添加影片时展示 */}
                {isCreating && (
                  <div className="p-4 rounded-xl bg-neutral-900/30 border border-amber-500/30">
                    <div className="flex items-center gap-3">
                      <input
                        type="text"
                        value={ptGenUrl}
                        onChange={(e) => setPtGenUrl(e.target.value)}
                        placeholder="输入 Douban/IMDb 页面链接，例：https://movie.douban.com/subject/4092781/"
                        className="flex-1 bg-neutral-900/50 border border-neutral-700 rounded-lg px-4 py-2.5 text-white placeholder-neutral-500 focus:outline-none focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/20"
                      />
                      <Button
                        onClick={fetchPtGenAndFill}
                        disabled={ptGenLoading}
                        className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white"
                      >
                        {ptGenLoading ? '获取中...' : '获取并填充'}
                      </Button>
                    </div>
                    {ptGenError && (
                      <p className="text-red-500 text-xs mt-2">{ptGenError}</p>
                    )}
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* 中文标题 */}
                  <div className="space-y-2">
                    <label className="text-neutral-300 text-sm">中文标题 <span className="text-red-500">*</span></label>
                    <input
                      type="text"
                      value={movieForm.title}
                      onChange={(e) =>
                        setMovieForm({ ...movieForm, title: e.target.value })
                      }
                      placeholder="例如: 星际穿越"
                      aria-invalid={Boolean(errors.title)}
                      className={`w-full bg-neutral-900/50 rounded-lg px-4 py-2.5 text-white placeholder-neutral-500 focus:outline-none focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/20 border ${errors.title ? 'border-red-500' : 'border-neutral-700'}`}
                    />
                    {errors.title && <p className="text-red-500 text-xs">{errors.title}</p>}
                  </div>

                  {/* 原始标题 */}
                  <div className="space-y-2">
                    <label className="text-neutral-300 text-sm">原始标题</label>
                    <input
                      type="text"
                      value={movieForm.originalTitle}
                      onChange={(e) =>
                        setMovieForm({ ...movieForm, originalTitle: e.target.value })
                      }
                      placeholder="例如: Interstellar"
                      className="w-full bg-neutral-900/50 border border-neutral-700 rounded-lg px-4 py-2.5 text-white placeholder-neutral-500 focus:outline-none focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/20"
                    />
                  </div>

                  {/* 年份 */}
                  <div className="space-y-2">
                    <label className="text-neutral-300 text-sm">年份 <span className="text-red-500">*</span></label>
                    <input
                      type="text"
                      value={movieForm.year}
                      onChange={(e) =>
                        setMovieForm({ ...movieForm, year: e.target.value })
                      }
                      placeholder="例如: 2014"
                      aria-invalid={Boolean(errors.year)}
                      className={`w-full bg-neutral-900/50 rounded-lg px-4 py-2.5 text-white placeholder-neutral-500 focus:outline-none focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/20 border ${errors.year ? 'border-red-500' : 'border-neutral-700'}`}
                    />
                    {errors.year && <p className="text-red-500 text-xs">{errors.year}</p>}
                  </div>

                  {/* 类别：使用自定义 Select 保持校验与样式统一 */}
                  <div className="space-y-2">
                    <label className="text-neutral-300 text-sm">类别 <span className="text-red-500">*</span></label>
                    <Select
                      value={movieForm.category}
                      onValueChange={(v) => setMovieForm({ ...movieForm, category: v })}
                    >
                      <SelectTrigger aria-invalid={Boolean(errors.category)}>
                        <SelectValue placeholder="选择类别" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="电影">电影</SelectItem>
                        <SelectItem value="剧集">剧集</SelectItem>
                        <SelectItem value="纪录片">纪录片</SelectItem>
                        <SelectItem value="动漫">动漫</SelectItem>
                        <SelectItem value="综艺">综艺</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.category && <p className="text-red-500 text-xs">{errors.category}</p>}
                  </div>

                  {/* 评分 */}
                  <div className="space-y-2">
                    <label className="text-neutral-300 text-sm">评分</label>
                    <input
                      type="number"
                      step="0.1"
                      min="0"
                      max="10"
                      value={movieForm.rating}
                      onChange={(e) =>
                        setMovieForm({
                          ...movieForm,
                          rating: parseFloat(e.target.value),
                        })
                      }
                      placeholder="例如: 9.8"
                      aria-invalid={Boolean(errors.rating)}
                      className={`w-full bg-neutral-900/50 rounded-lg px-4 py-2.5 text-white placeholder-neutral-500 focus:outline-none focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/20 border ${errors.rating ? 'border-red-500' : 'border-neutral-700'}`}
                    />
                    {errors.rating && <p className="text-red-500 text-xs">{errors.rating}</p>}
                  </div>

                  {/* 时长 */}
                  <div className="space-y-2">
                    <label className="text-neutral-300 text-sm">时长/集数</label>
                    <input
                      type="text"
                      value={movieForm.duration}
                      onChange={(e) =>
                        setMovieForm({ ...movieForm, duration: e.target.value })
                      }
                      placeholder="例如: 169分钟 或 全8季"
                      className={`w-full bg-neutral-900/50 rounded-lg px-4 py-2.5 text-white placeholder-neutral-500 focus:outline-none focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/20 border border-neutral-700`}
                    />
                  </div>
                </div>

                {/* 导演 */}
                <div className="space-y-2">
                  <label className="text-neutral-300 text-sm">导演</label>
                  <input
                    type="text"
                    value={movieForm.director}
                    onChange={(e) =>
                      setMovieForm({ ...movieForm, director: e.target.value })
                    }
                    placeholder="例如: 克里斯托弗·诺兰"
                    className="w-full bg-neutral-900/50 border border-neutral-700 rounded-lg px-4 py-2.5 text-white placeholder-neutral-500 focus:outline-none focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/20"
                  />
                </div>

                {/* 演员 */}
                <div className="space-y-2">
                  <label className="text-neutral-300 text-sm">
                    主演（用逗号分隔）
                  </label>
                  <input
                    type="text"
                    value={movieForm.cast.join(', ')}
                    onChange={(e) =>
                      setMovieForm({
                        ...movieForm,
                        cast: e.target.value.split(',').map((s) => s.trim()),
                      })
                    }
                    placeholder="例如: 马修·麦康纳, 安妮·海瑟薇"
                    className="w-full bg-neutral-900/50 border border-neutral-700 rounded-lg px-4 py-2.5 text-white placeholder-neutral-500 focus:outline-none focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/20"
                  />
                </div>

                {/* 类型标签 */}
                <div className="space-y-2">
                  <label className="text-neutral-300 text-sm">
                    类型标签（用逗号分隔）
                  </label>
                  <input
                    type="text"
                    value={movieForm.genres.join(', ')}
                    onChange={(e) =>
                      setMovieForm({
                        ...movieForm,
                        genres: e.target.value.split(',').map((s) => s.trim()),
                      })
                    }
                    placeholder="例如: 科幻, 剧情, 冒险"
                    className="w-full bg-neutral-900/50 border border-neutral-700 rounded-lg px-4 py-2.5 text-white placeholder-neutral-500 focus:outline-none focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/20"
                  />
                </div>

                {/* 新增：扩展信息（PT-Gen填充） */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* 语言（用逗号分隔） */}
                  <div className="space-y-2">
                    <label className="text-neutral-300 text-sm">语言（用逗号分隔）</label>
                    <input
                      type="text"
                      value={movieForm.language.join(', ')}
                      onChange={(e) =>
                        setMovieForm({
                          ...movieForm,
                          language: e.target.value.split(',').map((s) => s.trim()).filter(Boolean),
                        })
                      }
                      placeholder="例如: 韩语, 英语"
                      className="w-full bg-neutral-900/50 border border-neutral-700 rounded-lg px-4 py-2.5 text-white placeholder-neutral-500 focus:outline-none focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/20"
                    />
                  </div>

                  {/* 地区（用逗号分隔） */}
                  <div className="space-y-2">
                    <label className="text-neutral-300 text-sm">地区（用逗号分隔）</label>
                    <input
                      type="text"
                      value={movieForm.region.join(', ')}
                      onChange={(e) =>
                        setMovieForm({
                          ...movieForm,
                          region: e.target.value.split(',').map((s) => s.trim()).filter(Boolean),
                        })
                      }
                      placeholder="例如: 韩国"
                      className="w-full bg-neutral-900/50 border border-neutral-700 rounded-lg px-4 py-2.5 text-white placeholder-neutral-500 focus:outline-none focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/20"
                    />
                  </div>

                  {/* 豆瓣链接 */}
                  <div className="space-y-2">
                    <label className="text-neutral-300 text-sm">豆瓣链接</label>
                    <input
                      type="text"
                      value={movieForm.doubanLink}
                      onChange={(e) => setMovieForm({ ...movieForm, doubanLink: e.target.value })}
                      placeholder="例如: https://movie.douban.com/subject/4092781/"
                      aria-invalid={Boolean(movieForm.doubanLink && !isValidUrl(movieForm.doubanLink))}
                      className={`w-full bg-neutral-900/50 rounded-lg px-4 py-2.5 text-white placeholder-neutral-500 focus:outline-none focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/20 border ${movieForm.doubanLink && !isValidUrl(movieForm.doubanLink) ? 'border-red-500' : 'border-neutral-700'}`}
                    />
                    {errors.doubanLink && <p className="text-red-500 text-xs">{errors.doubanLink}</p>}
                  </div>

                  {/* IMDb 链接 */}
                  <div className="space-y-2">
                    <label className="text-neutral-300 text-sm">IMDb 链接</label>
                    <input
                      type="text"
                      value={movieForm.imdbLink}
                      onChange={(e) => setMovieForm({ ...movieForm, imdbLink: e.target.value })}
                      placeholder="例如: https://www.imdb.com/title/tt1527793/"
                      aria-invalid={Boolean(movieForm.imdbLink && !isValidUrl(movieForm.imdbLink))}
                      className={`w-full bg-neutral-900/50 rounded-lg px-4 py-2.5 text-white placeholder-neutral-500 focus:outline-none focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/20 border ${movieForm.imdbLink && !isValidUrl(movieForm.imdbLink) ? 'border-red-500' : 'border-neutral-700'}`}
                    />
                    {errors.imdbLink && <p className="text-red-500 text-xs">{errors.imdbLink}</p>}
                  </div>

                  {/* 豆瓣评分平均 */}
                  <div className="space-y-2">
                    <label className="text-neutral-300 text-sm">豆瓣评分（平均）</label>
                    <input
                      type="number"
                      step="0.1"
                      min="0"
                      max="10"
                      value={movieForm.doubanRatingAverage}
                      onChange={(e) => setMovieForm({ ...movieForm, doubanRatingAverage: parseFloat(e.target.value) })}
                      placeholder="例如: 7.3"
                      className={`w-full bg-neutral-900/50 rounded-lg px-4 py-2.5 text-white placeholder-neutral-500 focus:outline-none focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/20 border ${!isValidRating(Number(movieForm.doubanRatingAverage ?? 0)) ? 'border-red-500' : 'border-neutral-700'}`}
                    />
                    {errors.doubanRatingAverage && <p className="text-red-500 text-xs">{errors.doubanRatingAverage}</p>}
                  </div>

                  {/* IMDb 评分平均 */}
                  <div className="space-y-2">
                    <label className="text-neutral-300 text-sm">IMDb 评分（平均）</label>
                    <input
                      type="number"
                      step="0.1"
                      min="0"
                      max="10"
                      value={movieForm.imdbRatingAverage}
                      onChange={(e) => setMovieForm({ ...movieForm, imdbRatingAverage: parseFloat(e.target.value) })}
                      placeholder="例如: 7.6"
                      className={`w-full bg-neutral-900/50 rounded-lg px-4 py-2.5 text-white placeholder-neutral-500 focus:outline-none focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/20 border ${!isValidRating(Number(movieForm.imdbRatingAverage ?? 0)) ? 'border-red-500' : 'border-neutral-700'}`}
                    />
                    {errors.imdbRatingAverage && <p className="text-red-500 text-xs">{errors.imdbRatingAverage}</p>}
                  </div>
                </div>

                {/* 获奖情况（多行） */}
                <div className="space-y-2">
                  <label className="text-neutral-300 text-sm">获奖情况（每行一条）</label>
                  <textarea
                    value={movieForm.awards.join('\n')}
                    onChange={(e) => setMovieForm({ ...movieForm, awards: e.target.value.split('\n').map((s) => s.trim()).filter(Boolean) })}
                    rows={4}
                    placeholder="例如: 第82届威尼斯电影节 主竞赛单元 金狮奖(提名)"
                    className="w-full bg-neutral-900/50 border border-neutral-700 rounded-lg px-4 py-2.5 text-white placeholder-neutral-500 focus:outline-none focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/20 resize-none"
                  />
                </div>

                {/* 简介 */}
                <div className="space-y-2">
                  <label className="text-neutral-300 text-sm">简介</label>
                  <textarea
                    value={movieForm.description}
                    onChange={(e) =>
                      setMovieForm({ ...movieForm, description: e.target.value })
                    }
                    rows={4}
                    placeholder="输入影片简介..."
                    className="w-full bg-neutral-900/50 border border-neutral-700 rounded-lg px-4 py-2.5 text-white placeholder-neutral-500 focus:outline-none focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/20 resize-none"
                  />
                </div>

                {/* 海报 */}
                <div className="space-y-2">
                  <label className="text-neutral-300 text-sm">海报图片</label>
                  <div className="flex gap-3">
                    <input
                      type="text"
                      value={movieForm.poster}
                      onChange={(e) =>
                        setMovieForm({ ...movieForm, poster: e.target.value })
                      }
                      placeholder="输入图片URL..."
                      className="flex-1 bg-neutral-900/50 border border-neutral-700 rounded-lg px-4 py-2.5 text-white placeholder-neutral-500 focus:outline-none focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/20"
                    />
                    <Button
                      variant="outline"
                      className="border-amber-500/30 text-amber-400 hover:bg-amber-500/10"
                    >
                      <ImageIcon className="w-4 h-4 mr-2" />
                      上传
                    </Button>
                  </div>
                </div>

                {/* 背景图 */}
                <div className="space-y-2">
                  <label className="text-neutral-300 text-sm">背景图片</label>
                  <input
                    type="text"
                    value={movieForm.backdrop}
                    onChange={(e) =>
                      setMovieForm({ ...movieForm, backdrop: e.target.value })
                    }
                    placeholder="输入图片URL..."
                    className="w-full bg-neutral-900/50 border border-neutral-700 rounded-lg px-4 py-2.5 text-white placeholder-neutral-500 focus:outline-none focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/20"
                  />
                </div>

                {/* 操作按钮 */}
                <div className="flex gap-3 pt-4">
                  <Button
                    onClick={handleSaveMovie}
                    disabled={!movieForm.title || Object.keys(errors).length > 0}
                    className="flex-1 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white shadow-lg shadow-amber-500/25"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    保存影片
                  </Button>
                  <Button
                    onClick={() => {
                      setIsCreating(false);
                      setIsEditing(false);
                    }}
                    variant="outline"
                    className="border-neutral-700 text-neutral-400 hover:text-white hover:bg-neutral-700/30"
                  >
                    取消
                  </Button>
                </div>
              </div>
            )}

            {/* 影片详情展示 */}
            {!isCreating && !isEditing && selectedMovie && (
              <div className="space-y-6">
                {/* 影片头部 */}
                <div className="flex items-start gap-4">
                  <img
                    src={selectedMovie.poster || undefined}
                    alt={selectedMovie.title}
                    className="w-32 h-48 rounded-xl object-cover"
                  />
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h2 className="text-white text-2xl mb-1">
                          {selectedMovie.title}
                        </h2>
                        <p className="text-neutral-400 text-sm mb-3">
                          {selectedMovie.originalTitle} ({selectedMovie.year})
                        </p>
                        <div className="flex items-center gap-2 mb-3">
                          <Badge className="bg-amber-500/20 text-amber-400">
                            {selectedMovie.category}
                          </Badge>
                          {selectedMovie.genres.map((genre) => (
                            <Badge
                              key={genre}
                              className="bg-neutral-700/50 text-neutral-300"
                            >
                              {genre}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={() => handleEdit(selectedMovie)}
                          className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white"
                        >
                          <Edit className="w-4 h-4 mr-2" />
                          编辑
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDeleteMovie(selectedMovie.id)}
                          className="border-red-500/30 text-red-400 hover:bg-red-500/10"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-3">
                      <div className="flex items-center gap-2 text-sm">
                        <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                        <span className="text-white">{selectedMovie.rating}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-neutral-400">
                        <Clock className="w-4 h-4" />
                        {selectedMovie.duration}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-neutral-400">
                        <Users className="w-4 h-4" />
                        {selectedMovie.director}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-neutral-400">
                        <Video className="w-4 h-4" />
                        {selectedMovie.torrents.length} 个版本
                      </div>
                    </div>

                    <p className="text-neutral-400 text-sm">
                      {selectedMovie.description}
                    </p>
                  </div>
                </div>

                <Separator className="bg-neutral-700/50" />

                {/* 种子列表 */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-white flex items-center gap-2">
                      <Download className="w-5 h-5" />
                      种子版本
                    </h3>
                    <Button
                      size="sm"
                      onClick={() => setShowTorrentSearch(true)}
                      className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      添加种子
                    </Button>
                  </div>

                  {/* 选择已有种子面板：搜索并绑定 */}
                  {showTorrentSearch && (
                    <div className="mb-6 p-6 rounded-xl bg-neutral-900/30 border border-amber-500/30 space-y-4">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="text-white">选择已有种子</h4>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => { setShowTorrentSearch(false); setTorrentSearchQuery(''); setSearchResults([]); }}
                          className="text-neutral-400 hover:text-white"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>

                      {/* 搜索输入框 */}
                      <div>
                        <label className="text-neutral-300 text-sm">搜索种子（ID或关键词）</label>
                        <input
                          type="text"
                          value={torrentSearchQuery}
                          onChange={(e) => setTorrentSearchQuery(e.target.value)}
                          placeholder="例如：4K / BluRay / 种子ID"
                          className="w-full bg-neutral-900/50 border border-neutral-700 rounded-lg px-4 py-2.5 text-white placeholder-neutral-500 focus:outline-none focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/20 mt-2"
                        />
                        <p className="text-xs text-neutral-500 mt-1">输入≥2个字符后开始搜索，已绑定到当前影片的种子会被排除</p>
                      </div>

                      {/* 搜索状态与错误提示 */}
                      {isSearching && (
                        <p className="text-sm text-neutral-400">正在搜索...</p>
                      )}
                      {searchError && (
                        <p className="text-sm text-red-400">{searchError}</p>
                      )}

                      {/* 结果列表 */}
                      <div className="space-y-3">
                        {searchResults.length === 0 && !isSearching ? (
                          <div className="text-center py-8 border border-dashed border-neutral-700 rounded-xl">
                            <Video className="w-10 h-10 text-neutral-600 mx-auto mb-3" />
                            <p className="text-neutral-500 text-sm">暂无结果，请输入更具体的关键词</p>
                          </div>
                        ) : (
                          searchResults.map((item: any) => {
                            const id = String(item?.id ?? item?.torrentId ?? '');
                            const title = item?.title ?? '';
                            const subTitle = item?.subTitle ?? '';
                          const version = item?.version ?? item?.quality ?? '';
                          const size = item?.size ?? '';
                          const standard = item?.standard ?? '';
                          const source = item?.source ?? '';
                          const codec = item?.codec ?? item?.videoCodec ?? '';
                          const audio = item?.audio ?? item?.audioCodec ?? '';
                            const seeders = item?.seeders ?? 0;
                            const leechers = item?.leechers ?? 0;
                            return (
                              <div key={id} className="p-4 rounded-xl bg-neutral-900/30 border border-neutral-700/50 hover:border-neutral-600 transition-all">
                                <div className="flex items-start justify-between">
                                  <div className="flex-1">
                                    <div className="mb-1">
                                      <h4 className="text-white">{title || version || '未命名种子'}</h4>
                                      {subTitle && (
                                        <p className="text-xs text-neutral-400 mt-0.5">{subTitle}</p>
                                      )}
                                    </div>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs text-neutral-400">
                                      <div><span className="text-neutral-500">大小:</span> {formatSize(size)}</div>
                                      <div><span className="text-neutral-500">分辨率:</span> {standard}</div>
                                      <div><span className="text-neutral-500">来源:</span> {source}</div>
                                      <div><span className="text-neutral-500">编码:</span> {codec}</div>
                                      <div><span className="text-neutral-500">音频:</span> {audio}</div>
                                      <div className="flex items-center gap-1">
                                        <UploadIcon className="w-3 h-3 text-green-400" />
                                        <span className="text-green-400">{seeders}</span>
                                      </div>
                                      <div className="flex items-center gap-1">
                                        <Download className="w-3 h-3 text-red-400" />
                                        <span className="text-red-400">{leechers}</span>
                                      </div>
                                    </div>
                                  </div>
                                  <Button
                                    size="sm"
                                    onClick={() => handleBindExistingTorrent(id)}
                                    className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white"
                                  >
                                    绑定到当前影片
                                  </Button>
                                </div>
                              </div>
                            );
                          })
                        )}
                      </div>
                    </div>
                  )}

                  {/* 种子列表 */}
                  {selectedMovie.torrents.length === 0 ? (
                    <div className="text-center py-12 border border-dashed border-neutral-700 rounded-xl">
                      <Video className="w-12 h-12 text-neutral-600 mx-auto mb-3" />
                      <p className="text-neutral-500 text-sm mb-3">
                        还没有添加种子版本
                      </p>
                      <Button
                        size="sm"
                        onClick={() => setShowTorrentSearch(true)}
                        className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        添加第一个种子
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {selectedMovie.torrents.map((torrent) => (
                        <div
                          key={torrent.id}
                          className="p-4 rounded-xl bg-neutral-900/30 border border-neutral-700/50 hover:border-neutral-600 transition-all group"
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="mb-2">
                                <h4 className="text-white">{torrent.title || torrent.version}</h4>
                                {torrent.subTitle && (
                                  <p className="text-xs text-neutral-400 mt-0.5">{torrent.subTitle}</p>
                                )}
                                <div className="flex items-center gap-2 mt-1">
                                  {torrent.isFree && (
                                    <Badge className="bg-green-500/20 text-green-400 text-xs">
                                      FREE
                                    </Badge>
                                  )}
                                  {torrent.isVip && (
                                    <Badge className="bg-purple-500/20 text-purple-400 text-xs">
                                      VIP
                                    </Badge>
                                  )}
                                </div>
                              </div>
                              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs text-neutral-400">
                                <div>
                                  <span className="text-neutral-500">大小:</span>{' '}
                                  {formatSize(torrent.size)}
                                </div>
                                <div>
                                  <span className="text-neutral-500">分辨率:</span>{' '}
                                  {torrent.standard}
                                </div>
                                <div>
                                  <span className="text-neutral-500">来源:</span>{' '}
                                  {torrent.source}
                                </div>
                                <div>
                                  <span className="text-neutral-500">编码:</span>{' '}
                                  {torrent.codec}
                                </div>
                                <div>
                                  <span className="text-neutral-500">音频:</span>{' '}
                                  {torrent.audio}
                                </div>
                                <div className="flex items-center gap-1">
                                  <UploadIcon className="w-3 h-3 text-green-400" />
                                  <span className="text-green-400">
                                    {torrent.seeders}
                                  </span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <Download className="w-3 h-3 text-red-400" />
                                  <span className="text-red-400">
                                    {torrent.leechers}
                                  </span>
                                </div>
                                <div>
                                  <span className="text-neutral-500">上传:</span>{' '}
                                  {torrent.uploadDate}
                                </div>
                              </div>
                            </div>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleRemoveTorrent(torrent.id)}
                              className="opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-300 hover:bg-red-500/10"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* 空状态 */}
            {!isCreating && !isEditing && !selectedMovie && (
              <div className="text-center py-20">
                <Film className="w-16 h-16 text-neutral-600 mx-auto mb-4" />
                <h3 className="text-white text-lg mb-2">选择一部影片</h3>
                <p className="text-neutral-400 text-sm mb-6">
                  从左侧列表选择影片进行编辑，或添加新影片
                </p>
                <Button
                  onClick={handleCreateNew}
                  className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white shadow-lg shadow-amber-500/25"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  添加新影片
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
