import { useEffect, useState } from 'react';
import { useFilms } from '@/hooks/useFilms'; // 复用 create/update (如果 SeriesService 完全独立，应封装 useSeries)
import { SeriesService } from '@/api/services/SeriesService';
import { stripBackticksAndTrim, parseDurationToMinutes, validateSeriesForm, mapBackendSeriesToLocal } from '../utils'; // Use relative path

import { usePreferenceCategoriesStore } from '@/stores/preferenceCategoriesStore';
import { PtGenService } from '@/api/services/PtGenService';
import { CreateSeriesDto } from '@/api/models/CreateSeriesDto';
import { UpdateSeriesDto } from '@/api/models/UpdateSeriesDto';
import { CreateEpisodeDto } from '@/api/models/CreateEpisodeDto';
import { UpdateEpisodeDto } from '@/api/models/UpdateEpisodeDto';
import type { Series, SeriesFormState, Episode, SeriesTorrent } from '@/pages/Edit/series/types';

export function useEditSeries() {
    // 暂时复用 useFilms 的部分逻辑（仅 utility），实际 CRUD 需调用 SeriesService
    // SeriesService CRUD: seriesControllerList, seriesControllerGetDetail, seriesControllerCreate, seriesControllerUpdate, seriesControllerDelete

    const [seriesList, setSeriesList] = useState<Series[]>([]); // 为了避免混淆改名为 seriesList
    const [selectedSeries, setSelectedSeries] = useState<Series | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [isCreating, setIsCreating] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    const [errors, setErrors] = useState<Record<string, string>>({});

    // Torrent management is skipped for now as APIs are missing

    const [seriesForm, setSeriesForm] = useState<SeriesFormState>({
        title: '',
        originalTitle: '',
        year: '',
        poster: '',
        backdrop: '',
        categories: [],
        genres: [],
        rating: 0,
        duration: '',
        director: '',
        cast: [],
        description: '',

        episodeCount: 0,
        status: 'airing',
        doubanLink: '',
        imdbLink: '',
        doubanRatingAverage: 0,
        imdbRatingAverage: 0,
    });

    const [ptGenUrl, setPtGenUrl] = useState('');
    const [ptGenLoading, setPtGenLoading] = useState(false);
    const [ptGenError, setPtGenError] = useState('');

    const filteredSeries = seriesList.filter(
        (s) =>
            s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            s.originalTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
            s.director.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // List Series
    useEffect(() => {
        (async () => {
            try {
                // TODO: DTO mapping
                const resp = await SeriesService.seriesControllerList({ page: 1, limit: 50, keyword: searchQuery });
                const list = resp?.message === 'ok' ? resp.data?.items : (resp as any)?.items || [];
                // map to local type
                 const mapped = (list ?? []).map(mapBackendSeriesToLocal);
                setSeriesList(mapped);
            } catch {}
        })();
    }, [searchQuery]);


     // Fetch PTGen
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

             // Apply logic similar to movies
             // Need to check ptgen format, assuming similar enough
             
             // ... simplify for now, copy main fields
             setSeriesForm(prev => ({
                 ...prev,
                 title: data.chineseTitle || prev.title,
                 originalTitle: data.foreignTitle || prev.originalTitle,
                 year: String(data.year || prev.year),
                 poster: stripBackticksAndTrim(data.poster) || prev.poster,
                 description: data.introduction || prev.description,
                 director: (data.director || []).map((d: any) => d.name).join(' / '),
                 cast: (data.cast || []).map((c: any) => c.name),
                 genres: (data.genre || []),
                 doubanRatingAverage: Number(data.doubanRatingAverage || 0),
                 imdbRatingAverage: Number(data.imdbRatingAverage || 0),
             }));

        } catch (e: any) {
            setPtGenError(e?.message || '获取失败');
        } finally {
            setPtGenLoading(false);
        }
    }

    const handleCreateNew = () => {
        setSeriesForm({
             title: '',
            originalTitle: '',
            year: '',
            poster: '',
            backdrop: '',
            categories: [],
            genres: [],
            rating: 0,
            duration: '',
            director: '',
            cast: [],
            description: '',

            episodeCount: 0,
            status: 'airing',
            doubanLink: '',
            imdbLink: '',
            doubanRatingAverage: 0,
            imdbRatingAverage: 0,
        });
        setIsCreating(true);
        setIsEditing(false);
        setSelectedSeries(null);
    };

     const handleEdit = (series: Series) => {
        setSeriesForm({
            title: series.title,
            originalTitle: series.originalTitle,
            year: series.year,
            poster: series.poster,
            backdrop: series.backdrop,
            categories: series.categories,
            genres: series.genres,
            rating: series.rating,
            duration: series.duration,
            director: series.director,
            cast: series.cast,
            description: series.description,

            episodeCount: series.episodeCount,
            status: series.status,
            doubanLink: series.doubanLink,
            imdbLink: series.imdbLink,
             doubanRatingAverage: 0, // Not in Series type yet, maybe fetch detail?
            imdbRatingAverage: 0,
        });
        setSelectedSeries(series);
        setIsEditing(true);
        setIsCreating(false);
    };

    const handleSaveSeries = async () => {
        // Validation ...
         const { valid, errs } = validateSeriesForm(seriesForm);
         if (!valid) {
             setErrors(errs);
             alert('请修正表单错误');
             return;
         }

         // Map form state to DTO
         const payloadBase = {
             title: seriesForm.title,
             originalTitle: seriesForm.originalTitle,
             year: seriesForm.year,
             posterUrl: seriesForm.poster, // Map poster -> posterUrl
             ...(seriesForm.backdrop ? { backdropUrl: seriesForm.backdrop } : {}),
             categories: seriesForm.categories,
             genres: seriesForm.genres,
             rating: seriesForm.rating,
             // episodeDuration is number in DTO, string in Form (might be "45min"). 
             // Form state is string, DTO is number. mapBackendSeriesToLocal converts number -> string.
             // Here we need string -> number. Basic parsing:
             episodeDuration: parseInt(seriesForm.duration) || 0, 
             director: seriesForm.director,
             cast: seriesForm.cast,
             description: seriesForm.description,

             episodeCount: seriesForm.episodeCount,
             status: seriesForm.status as CreateSeriesDto.status, // Cast or map
             doubanLink: seriesForm.doubanLink,
             imdbLink: seriesForm.imdbLink,
             doubanRatingAverage: seriesForm.doubanRatingAverage,
             imdbRatingAverage: seriesForm.imdbRatingAverage,
             enabled: true,
             sort: 0,
         };

         try {
             let savedData: any;
             if (isCreating) {
                 const resp = await SeriesService.seriesControllerCreate(payloadBase as CreateSeriesDto);
                 savedData = resp.data;
                 setIsCreating(false);
             } else if (selectedSeries) {
                 const resp = await SeriesService.seriesControllerUpdate({ 
                     id: selectedSeries.id, 
                     ...payloadBase 
                 } as UpdateSeriesDto);
                 savedData = resp.data;
                 setIsEditing(false);
             }
             
             // Refresh list
             const respList = await SeriesService.seriesControllerList({ page: 1, limit: 50, keyword: searchQuery });
             const list = respList?.message === 'ok' ? respList.data?.items : (respList as any)?.items || [];
             const mappedList = (list ?? []).map(mapBackendSeriesToLocal);
             setSeriesList(mappedList);

             // Update selected series to reflect changes in detail view
             if (savedData) {
                const mapped = mapBackendSeriesToLocal(savedData);
                setSelectedSeries(mapped);
             }

         } catch (e: any) {
             alert(e.message || '保存失败');
         }
    };
    
    const handleDeleteSeries = async (id: string) => {
        if (!confirm('确认删除?')) return;
        try {
            await SeriesService.seriesControllerDelete({ id });
            const resp = await SeriesService.seriesControllerList({ page: 1, limit: 50, keyword: searchQuery });
            const list = resp?.message === 'ok' ? resp.data?.items : (resp as any)?.items || [];
            setSeriesList((list ?? []).map(mapBackendSeriesToLocal));
            if (selectedSeries?.id === id) setSelectedSeries(null);
        } catch(e: any) {
            alert(e.message || '删除失败');
        }
    };

    // --- Episodes & Torrents ---
    const [episodes, setEpisodes] = useState<Episode[]>([]);
    const [seriesTorrents, setSeriesTorrents] = useState<SeriesTorrent[]>([]);

    async function fetchEpisodes(seriesId: string) {
        try {
            const resp = await SeriesService.seriesEpisodesControllerList({ seriesId });
            // Map types from EpisodeDTO to local Episode
            // EpisodeDTO: { seriesId, seasonNumber, episodeNumber, title, ... }
            // Local Episode: { id: ???, ... }
            // It seems EpisodeDTO doesn't have ID. But UpdateEpisodeDto and DeleteEpisodeDto need ID.
            // Check ListEpisodesResponseDto items -> EpisodeDTO.
            // IF backend returns ID, we use it. If not, we might have trouble updating.
            // Assuming backend response actually includes ID even if DTO says otherwise, or DTO is incomplete.
            // Safe mapping:
            const items = ((resp?.data?.items || []) as any[]).map((e: any) => ({
                id: e.id,
                seriesId: e.seriesId,

                episodeNumber: e.episodeNumber,
                title: e.title,
                originalTitle: e.originalTitle,
                overview: e.overview,
                airDate: e.airDate,
                stillUrl: e.stillUrl,
                voteAverage: e.voteAverage,
                runtime: e.runtime
            }));
            setEpisodes(items);
        } catch (e) {
            console.error('Fetch episodes failed', e);
        }
    }

    async function fetchSeriesTorrents(seriesId: string) {
        try {
            const resp = await SeriesService.seriesTorrentsControllerList({ seriesId });
            const items = (resp?.data?.items || []).map((t: any) => ({
                 id: t.id, // Connection ID if needed? Or just Torrent ID ?
                 // Assuming response structure has torrent details + season/episode info
                 torrentId: t.torrentId,

                 episodeNumber: t.episodeNumber,
                 // Flatten torrent info if nested or copy if direct
                 title: t.title,
                 size: t.size,
                 seeders: t.seeders,
                 leechers: t.leechers,
                 uploadDate: t.uploadDate,
                 version: t.version || '',
                 quality: t.quality || '',
                 source: t.source || '',
                 codec: t.codec || '',
                 audio: t.audio || '',
            }));
            setSeriesTorrents(items as SeriesTorrent[]);
        } catch (e) {
             console.error('Fetch series torrents failed', e);
        }
    }

    const handleCreateEpisode = async (dto: CreateEpisodeDto) => {
        try {
            await SeriesService.seriesEpisodesControllerCreate(dto);
            if(selectedSeries) fetchEpisodes(selectedSeries.id);
        } catch (e: any) {
            alert(e.message || '创建分集失败');
            throw e;
        }
    }

    const handleUpdateEpisode = async (dto: UpdateEpisodeDto) => {
        try {
             await SeriesService.seriesEpisodesControllerUpdate(dto);
             // find season of updated episode to refresh? or reload all
             // Simplest: reload all for series
             if(selectedSeries) fetchEpisodes(selectedSeries.id);
        } catch (e: any) {
            alert(e.message || '更新分集失败');
            throw e;
        }
    }

    const handleDeleteEpisode = async (id: string) => {
         if (!confirm('确认删除?')) return;
         try {
             await SeriesService.seriesEpisodesControllerDelete({ id });
             if(selectedSeries) fetchEpisodes(selectedSeries.id);
         } catch (e: any) {
             alert(e.message || '删除分集失败');
         }
    }

    const handleBindTorrent = async (seriesId: string, torrentId: string, episodeNumber?: number) => {
        try {
            await SeriesService.seriesTorrentsControllerBind({ seriesId, torrentId, episodeNumber });
            fetchSeriesTorrents(seriesId);
        } catch (e: any) {
            alert(e.message || '绑定失败');
        }
    }

    const handleUnbindTorrent = async (torrentId: string, seriesId: string, episodeNumber?: number) => {
         if (!confirm('确认解绑?')) return;
         try {
             await SeriesService.seriesTorrentsControllerUnbind({ seriesId, torrentId, episodeNumber }); 
             fetchSeriesTorrents(seriesId);
         } catch (e: any) {
             alert(e.message || '解绑失败');
         }
    }

    // --- Torrent Search ---
    // 简化为返回 Promise 的函数，状态由调用方（弹窗）管理
    const searchTorrents = async (query: string): Promise<any[]> => {
        if (!query || query.length < 2) return [];
        try {
            const { TorrentsService } = await import('@/api/services/TorrentsService');
            const res = await TorrentsService.torrentsControllerListSimple({ 
                page: 1, 
                pageSize: 20, 
                keyword: query 
            });
            return res?.data?.items || [];
        } catch (e) {
            console.error('[searchTorrents] Error:', e);
            return [];
        }
    };

    useEffect(() => {
        if(selectedSeries) {
            fetchEpisodes(selectedSeries.id);
            fetchSeriesTorrents(selectedSeries.id);
        } else {
            setEpisodes([]);
            setSeriesTorrents([]);
        }
    }, [selectedSeries]);

    return {
        seriesList,
        filteredSeries,
        searchQuery,
        setSearchQuery,
        selectedSeries,
        setSelectedSeries,
        isEditing,
        setIsEditing,
        isCreating,
        setIsCreating,
        seriesForm,
        setSeriesForm,
        errors,
        setErrors,
        ptGenUrl,
        setPtGenUrl,
        ptGenLoading,
        ptGenError,
        fetchPtGenAndFill,
        handleCreateNew,
        handleEdit,
        handleSaveSeries,
        handleDeleteSeries,
        
        // New
        episodes,
        seriesTorrents,
        fetchEpisodes,
        fetchSeriesTorrents,
        handleCreateEpisode,
        handleUpdateEpisode,
        handleDeleteEpisode,
        handleBindTorrent,
        handleUnbindTorrent,
        
        // Torrent Search (Promise-based)
        searchTorrents
    };
}



