import { create } from "zustand";
import { getUsersService } from "@/api/lazy";
import { useDictionaryStore } from "@/stores/dictionaryStore";

/**
 * 分类项数据结构
 */
export interface CategoryItem {
  key: string;
  label: string;
  show: boolean;
}

/**
 * 分类数据全局状态
 * 存储用户偏好的分类显示配置
 */
interface PreferenceCategoriesState {
  // 分类数据
  torrent: CategoryItem[];
  movie: CategoryItem[]; // 电影分类（替换原 film）
  series: CategoryItem[]; // 剧集分类（新增）
  playlist: CategoryItem[];
  // 向后兼容：别名属性
  film: CategoryItem[]; // @deprecated 使用 movie 替代

  // 加载状态
  isLoaded: boolean;
  isLoading: boolean;

  // Actions
  fetchCategories: () => Promise<void>;
  setCategories: (data: {
    torrent?: CategoryItem[];
    movie?: CategoryItem[];
    series?: CategoryItem[];
    playlist?: CategoryItem[];
  }) => void;
  getVisibleTorrentKeys: () => string[];
  getVisibleMovieKeys: () => string[];
  getVisibleSeriesKeys: () => string[];
}

export const usePreferenceCategoriesStore = create<PreferenceCategoriesState>((set, get) => ({
  torrent: [],
  movie: [],
  series: [],
  playlist: [],
  // 向后兼容别名
  get film() {
    return this.movie;
  },
  isLoaded: false,
  isLoading: false,

  /**
   * 从接口获取分类数据
   * 自动从 dictionaryStore 获取字典映射用于填充 label
   */
  fetchCategories: async () => {
    const state = get();
    if (state.isLoading) return;

    set({ isLoading: true });

    try {
      // 从 dictionaryStore 获取字典数据构建映射
      const dictStore = useDictionaryStore.getState();
      const dictCategories = dictStore.dictionaries?.categories || [];
      const dictMap = new Map<string, string>();
      dictCategories.forEach((c) => dictMap.set(c.key, c.label));

      const UsersService = await getUsersService();
      const resp = await UsersService.usersPreferencesControllerListCategories({});
      const data = resp?.data || {};

      // 处理种子分类
      const torrentItems = data.torrent || [];
      const torrent: CategoryItem[] = torrentItems
        .map((c) => ({
          key: String(c?.key ?? ""),
          // label 优先级: 字典映射 > 接口返回的 label > key本身
          label: String(dictMap.get(c?.key) ?? c?.label ?? c?.key ?? ""),
          show: Boolean(c?.show),
        }))
        .filter((c: CategoryItem) => c.key && c.label);

      // 处理电影分类（movie，兼容旧的 film 字段）
      // 优先使用 movie，如果不存在则回退到 film (兼容旧接口)
      const movieItems = data.movie || data.film || [];
      const movie: CategoryItem[] = movieItems
        .map((c) => ({
          key: String(c?.key ?? ""),
          label: String(dictMap.get(c?.key) ?? c?.label ?? c?.key ?? ""),
          show: Boolean(c?.show),
        }))
        .filter((c: CategoryItem) => c.key && c.label);

      // 处理剧集分类（series）
      const seriesItems = data.series || [];
      const series: CategoryItem[] = seriesItems
        .map((c) => ({
          key: String(c?.key ?? ""),
          label: String(dictMap.get(c?.key) ?? c?.label ?? c?.key ?? ""),
          show: Boolean(c?.show),
        }))
        .filter((c: CategoryItem) => c.key && c.label);

      // 处理播放列表分类
      const playlistItems = data.playlist || [];
      const playlist: CategoryItem[] = playlistItems
        .map((c) => ({
          key: String(c?.key ?? ""),
          label: String(dictMap.get(c?.key) ?? c?.label ?? c?.key ?? ""),
          show: Boolean(c?.show),
        }))
        .filter((c: CategoryItem) => c.key && c.label);

      set({ torrent, movie, series, playlist, isLoaded: true, isLoading: false });
    } catch (error) {
      console.warn("获取用户分类偏好失败或未登录，使用公共字典降级兜底:", error);

      // 401 或异常降级：从 dictionaryStore 获取全量分类，并将所有分类设为可见 (show: true)
      const dictStore = useDictionaryStore.getState();
      const dictCategories = dictStore.dictionaries?.categories || [];
      const fallbackCategories: CategoryItem[] = dictCategories.map((c) => ({
        key: String(c.key),
        label: String(c.label || c.key),
        show: true,
      }));

      set({
        torrent: fallbackCategories,
        movie: fallbackCategories,
        series: fallbackCategories,
        playlist: fallbackCategories,
        isLoaded: true,
        isLoading: false,
      });
    }
  },

  /**
   * 手动设置分类数据（用于保存偏好后更新）
   */
  setCategories: (data) => {
    set((state) => ({
      torrent: data.torrent ?? state.torrent,
      movie: data.movie ?? state.movie,
      series: data.series ?? state.series,
      playlist: data.playlist ?? state.playlist,
    }));
  },

  /**
   * 获取可展示的种子分类 keys（show=true）
   */
  getVisibleTorrentKeys: () => {
    return get()
      .torrent.filter((c) => c.show)
      .map((c) => c.key);
  },

  /**
   * 获取可展示的电影分类 keys（show=true）
   */
  getVisibleMovieKeys: () => {
    return get()
      .movie.filter((c) => c.show)
      .map((c) => c.key);
  },

  /**
   * 获取可展示的剧集分类 keys（show=true）
   */
  getVisibleSeriesKeys: () => {
    return get()
      .series.filter((c) => c.show)
      .map((c) => c.key);
  },

  /**
   * @deprecated 使用 getVisibleMovieKeys 替代
   */
  getVisibleFilmKeys: () => {
    return get()
      .movie.filter((c) => c.show)
      .map((c) => c.key);
  },
}));
