import { create } from 'zustand';
import { getUsersService } from '@/api/lazy';
import { useDictionaryLabels } from '@/hooks/useDictionary';

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
  film: CategoryItem[];
  playlist: CategoryItem[];

  // 加载状态
  isLoaded: boolean;
  isLoading: boolean;

  // Actions
  fetchCategories: (dictMap?: Map<string, string>) => Promise<void>;
  setCategories: (data: {
    torrent?: CategoryItem[];
    film?: CategoryItem[];
    playlist?: CategoryItem[];
  }) => void;
  getVisibleTorrentKeys: () => string[];
  getVisibleFilmKeys: () => string[];
}

export const usePreferenceCategoriesStore = create<PreferenceCategoriesState>((set, get) => ({
  torrent: [],
  film: [],
  playlist: [],
  isLoaded: false,
  isLoading: false,

  /**
   * 从接口获取分类数据
   * @param dictMap 可选，用于填充 label 的字典映射
   */
  fetchCategories: async (dictMap?: Map<string, string>) => {
    const state = get();
    if (state.isLoading) return;

    set({ isLoading: true });

    try {
      const UsersService = await getUsersService();
      const resp = await UsersService.usersPreferencesControllerListCategories({});
      const data = resp?.data as any;

      // 处理种子分类
      const torrentItems = Array.isArray(data?.torrent) ? data.torrent : [];
      const torrent: CategoryItem[] = torrentItems
        .map((c: any) => ({
          key: String(c?.key ?? ''),
          label: String(c?.label ?? dictMap?.get(c?.key) ?? c?.key ?? ''),
          show: Boolean(c?.show),
        }))
        .filter((c: CategoryItem) => c.key && c.label);

      // 处理影片分类
      const filmItems = Array.isArray(data?.film) ? data.film : [];
      const film: CategoryItem[] = filmItems
        .map((c: any) => ({
          key: String(c?.key ?? c?.id ?? ''),
          label: String(c?.label ?? c?.name ?? dictMap?.get(c?.key) ?? c?.key ?? ''),
          show: Boolean(c?.show),
        }))
        .filter((c: CategoryItem) => c.key && c.label);

      // 处理播放列表分类
      const playlistItems = Array.isArray(data?.playlist) ? data.playlist : [];
      const playlist: CategoryItem[] = playlistItems
        .map((c: any) => ({
          key: String(c?.key ?? ''),
          label: String(c?.label ?? dictMap?.get(c?.key) ?? c?.key ?? ''),
          show: Boolean(c?.show),
        }))
        .filter((c: CategoryItem) => c.key && c.label);

      set({ torrent, film, playlist, isLoaded: true, isLoading: false });
    } catch (error) {
      console.error('获取分类数据失败:', error);
      set({ isLoading: false });
    }
  },

  /**
   * 手动设置分类数据（用于保存偏好后更新）
   */
  setCategories: (data) => {
    set((state) => ({
      torrent: data.torrent ?? state.torrent,
      film: data.film ?? state.film,
      playlist: data.playlist ?? state.playlist,
    }));
  },

  /**
   * 获取可展示的种子分类 keys（show=true）
   */
  getVisibleTorrentKeys: () => {
    return get().torrent.filter((c) => c.show).map((c) => c.key);
  },

  /**
   * 获取可展示的影片分类 keys（show=true）
   */
  getVisibleFilmKeys: () => {
    return get().film.filter((c) => c.show).map((c) => c.key);
  },
}));
