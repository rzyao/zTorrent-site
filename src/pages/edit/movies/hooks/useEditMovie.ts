import { useEffect, useState } from 'react';
import { useFilms } from '@/hooks/useFilms';
import { TorrentsSearchService } from '@/api/services/TorrentsSearchService';
import { MoviesService } from '@/api/services/MoviesService';
import { MoviesTorrentsService } from '@/api/services/MoviesTorrentsService';
import { PtGenService } from '@/api/services/PtGenService';
import { ListTorrentsDto } from '@/api/models/ListTorrentsDto';
import { stripBackticksAndTrim, parseDurationToMinutes, validateFilmForm, mapBackendFilmToLocal, isValidRating, mapBackendTorrentToLocal } from '@/pages/Edit/movies/utils';
import type { Movie, MovieFormState } from '@/pages/Edit/movies/types';
import { usePreferenceCategoriesStore } from '@/stores/preferenceCategoriesStore';

export function useEditMovie() {
  const { listFilms, getFilm, createFilm, updateFilm, deleteFilm, addTorrent, removeTorrent } = useFilms();

  const [movies, setMovies] = useState<Movie[]>([]);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const [errors, setErrors] = useState<Record<string, string>>({});

  const [showTorrentSearch, setShowTorrentSearch] = useState(false);
  const [torrentSearchQuery, setTorrentSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [searchError, setSearchError] = useState<string | null>(null);

  const [movieForm, setMovieForm] = useState<MovieFormState>({
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
    awards: [],
    region: [],
    language: [],
    doubanLink: '',
    imdbLink: '',
    doubanRatingAverage: 0,
    imdbRatingAverage: 0,
  });

  const [ptGenUrl, setPtGenUrl] = useState('');
  const [ptGenLoading, setPtGenLoading] = useState(false);
  const [ptGenError, setPtGenError] = useState('');

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
      } catch {}
    })();
  }, [searchQuery]);

  async function fetchMovieTorrents(filmId: string) {
    if (!filmId) return;
    try {
      const resp: any = await MoviesTorrentsService.movieTorrentsControllerListTorrents({ id: filmId });
      const body = resp?.code !== undefined ? resp : (resp?.data ?? resp);
      const items = body?.data ?? body?.items ?? [];
      const mappedTorrents = Array.isArray(items) ? items.map(mapBackendTorrentToLocal) : [];
      
      setSelectedMovie(prev => {
        if (!prev || prev.id !== filmId) return prev;
        return { ...prev, torrents: mappedTorrents };
      });
      
      setMovies(prev => prev.map(m => m.id === filmId ? { ...m, torrents: mappedTorrents } : m));
    } catch (e) {
      console.error('Failed to fetch movie torrents:', e);
    }
  }

  useEffect(() => {
    if (selectedMovie?.id) {
      fetchMovieTorrents(selectedMovie.id);
    }
  }, [selectedMovie?.id]);

  useEffect(() => {
    if (!showTorrentSearch || !selectedMovie) return;
    const q = torrentSearchQuery.trim();
    if (q.length < 2) {
      setSearchResults([]);
      setSearchError(null);
      return;
    }
    setIsSearching(true);
    setSearchError(null);
    const timer = setTimeout(async () => {
      try {
        const resp: any = await TorrentsSearchService.torrentSearchControllerPicker({ 
          keyword: q, 
          bindMediaId: selectedMovie.id,
          bindMediaType: ListTorrentsDto.bindMediaType.MOVIE,
          page: 1,
          pageSize: 50
        });
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

  // 获取全局分类数据，用于模糊匹配
  const filmCategories = usePreferenceCategoriesStore((state) => state.film);

  /**
   * 根据 genres 模糊匹配 categories
   * 匹配规则：如果 genre 中包含 category label 或反之，则匹配
   */
  function matchCategoriesByGenres(genres: string[]): string[] {
    if (!genres.length || !filmCategories.length) return [];
    const matched = new Set<string>();
    for (const genre of genres) {
      const genreLower = genre.toLowerCase();
      for (const cat of filmCategories) {
        const labelLower = cat.label.toLowerCase();
        // 模糊匹配：任一方包含另一方即匹配
        if (genreLower.includes(labelLower) || labelLower.includes(genreLower)) {
          matched.add(cat.label);
        }
      }
    }
    return Array.from(matched);
  }

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

    // 根据 genres 自动匹配 categories
    const matchedCategories = matchCategoriesByGenres(genres);

    setMovieForm((prev) => ({
      ...prev,
      title: data?.chineseTitle ?? prev.title,
      originalTitle: data?.foreignTitle ?? prev.originalTitle,
      year: String(data?.year ?? prev.year ?? ''),
      poster: cleanedPoster || prev.poster,
      genres: genres.length ? genres : prev.genres,
      // 如果匹配到了分类则使用，否则保留原值
      categories: matchedCategories.length ? matchedCategories : prev.categories,
      duration: parseDurationToMinutes(data?.duration ?? prev.duration ?? ''),
      director: directors || prev.director,
      cast: casts.length ? casts : prev.cast,
      description: data?.introduction ?? prev.description,
      awards: awards.length ? awards : prev.awards,
      region: region.length ? region : prev.region,
      language: language.length ? language : prev.language,
      doubanLink: cleanedDouban || prev.doubanLink,
      imdbLink: cleanedImdb || prev.imdbLink,
      doubanRatingAverage: isNaN(avgDouban) ? prev.doubanRatingAverage : avgDouban,
      imdbRatingAverage: isNaN(avgImdb) ? prev.imdbRatingAverage : avgImdb,
      rating: prev.rating || (!isNaN(avgDouban) && avgDouban ? avgDouban : (!isNaN(avgImdb) && avgImdb ? avgImdb : prev.rating)),
    }));
  }

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

  const handleCreateNew = () => {
    setMovieForm({
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
      categories: movie.categories,
      genres: movie.genres,
      rating: movie.rating,
      duration: movie.duration,
      director: movie.director,
      cast: movie.cast,
      description: movie.description,
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
    const payload: any = {
      title: movieForm.title,
      description: movieForm.description,
      originalTitle: movieForm.originalTitle,
      year: movieForm.year,
      categories: movieForm.categories,
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
    };

    const { valid, errs } = validateFilmForm(movieForm);
    if (!valid) {
      setErrors(errs);
      alert('请先修正表单中的错误后再提交');
      return;
    }
    try {
      if (isCreating) {
        const res = await createFilm(payload);
        const newId = (res as any)?.id ?? res;
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

  const handleBindExistingTorrent = async (torrentId: string) => {
    if (!selectedMovie) return;
    try {
      await addTorrent(selectedMovie.id, String(torrentId));
      await fetchMovieTorrents(selectedMovie.id);
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
        await fetchMovieTorrents(selectedMovie.id);
      } catch (e: any) {
        alert(e?.message || '移除失败');
      }
    }
  };

  return {
    movies,
    filteredMovies,
    searchQuery,
    setSearchQuery,
    selectedMovie,
    setSelectedMovie,
    isEditing,
    setIsEditing,
    isCreating,
    setIsCreating,
    movieForm,
    setMovieForm,
    errors,
    setErrors,
    showTorrentSearch,
    setShowTorrentSearch,
    torrentSearchQuery,
    setTorrentSearchQuery,
    isSearching,
    searchResults,
    searchError,
    ptGenUrl,
    setPtGenUrl,
    ptGenLoading,
    ptGenError,
    handleCreateNew,
    handleEdit,
    handleSaveMovie,
    handleDeleteMovie,
    handleBindExistingTorrent,
    handleRemoveTorrent,
    fetchPtGenAndFill,
  } as const;
}
