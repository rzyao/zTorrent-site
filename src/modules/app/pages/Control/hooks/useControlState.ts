import { useEffect, useState } from 'react';
import { useDynamicTitle } from '@/hooks/useDynamicTitle';
import { useDictionaryLabels } from '@/hooks/useDictionary';
import { getProfile } from '@/api/custom/auth';
import { getUsersService, getOpenAPI } from '@/api/lazy';
import { usePreferenceCategoriesStore } from '@/stores/preferenceCategoriesStore';
import { useAsyncAction } from '@/modules/app/hooks/useAsyncAction';
import type { UpdateUserPreferencesDto } from '@/api/models/UpdateUserPreferencesDto';
import type { UpdateUserPrivacyDto } from '@/api/models/UpdateUserPrivacyDto';
import type {
  TabType,
  ProfileData,
  PreferencesData,
  SecurityData,
  NotificationsData,
  PrivacyData,
  KeyLabelOption,
} from '../types';

// 控制台页面聚合状态与业务逻辑 Hook
// 职责：
// 1) 管理页面标题、当前 Tab、保存提示；
// 2) 管理所有板块的状态数据；
// 3) 初始化分类与影片类型（字典优先、接口回退、静态占位）；
// 4) 读写本地偏好；
// 5) 向页面暴露必要的状态与操作方法。

export function useControlState() {
  // 页面标题
  useDynamicTitle('控制台');

  // 顶层页面状态
  const [activeTab, setActiveTab] = useState<TabType>('profile');

  // 个人信息
  const [profileData, setProfileData] = useState<ProfileData>({
    username: 'MovieLover2024',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=MovieLover2024',
    signature: '热爱分享，热爱电影',
    location: '中国',
    bio: '资深PT玩家，专注高质量蓝光原盘分享',
  });

  // 网站偏好
  const [preferences, setPreferences] = useState<PreferencesData>({
    language: 'zh-CN',
    theme: 'dark',
    defaultView: 'grid',
  });

  // 成人模式（本地偏好：是否显示成人内容）
  const [adultMode, setAdultMode] = useState<boolean>(false);

  // 种子分类（多选）
  const [torrentCategoryOptions, setTorrentCategoryOptions] = useState<KeyLabelOption[]>([]);
  const [selectedTorrentCategories, setSelectedTorrentCategories] = useState<string[]>([]);

  // 电影分类（多选）
  const [movieGenreOptions, setMovieGenreOptions] = useState<KeyLabelOption[]>([]);
  const [selectedMovieGenres, setSelectedMovieGenres] = useState<string[]>([]);
  
  // 剧集分类（多选）
  const [seriesGenreOptions, setSeriesGenreOptions] = useState<KeyLabelOption[]>([]);
  const [selectedSeriesGenres, setSelectedSeriesGenres] = useState<string[]>([]);
  
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  const [baselineAdultMode, setBaselineAdultMode] = useState<boolean>(false);
  const [baselinePreferences, setBaselinePreferences] = useState<PreferencesData>({ language: 'zh-CN', theme: 'dark', defaultView: 'grid' });
  const [baselineTorrentCategories, setBaselineTorrentCategories] = useState<string[]>([]);
  const [baselineMovieGenres, setBaselineMovieGenres] = useState<string[]>([]);
  const [baselineSeriesGenres, setBaselineSeriesGenres] = useState<string[]>([]);

  // 安全设置
  const [security, setSecurity] = useState<SecurityData>({
    twoFactorEnabled: false,
    loginNotifications: true,
    trustedDevices: 3,
  });

  // 通知设置
  const [notifications, setNotifications] = useState<NotificationsData>({
    emailNotifications: true,
    torrentComments: true,
    privateMessages: true,
    systemAnnouncements: true,
    downloadComplete: false,
    ratioWarnings: true,
  });
  const [baselineNotifications, setBaselineNotifications] = useState<NotificationsData>({
    emailNotifications: true,
    torrentComments: true,
    privateMessages: true,
    systemAnnouncements: true,
    downloadComplete: false,
    ratioWarnings: true,
  });

  // 隐私设置
  const [privacy, setPrivacy] = useState<PrivacyData>({
    showProfile: true,
    showStats: true,
    allowMessages: true,
    showOnlineStatus: true,
  });
  // 隐私设置基线（用于增量保存与变更检测）
  const [baselinePrivacy, setBaselinePrivacy] = useState<PrivacyData>({
    showProfile: true,
    showStats: true,
    allowMessages: true,
    showOnlineStatus: true,
  });

  // 加载隐私设置（进入隐私 Tab 时）
  useEffect(() => {
    if (activeTab !== 'privacy') return;
    (async () => {
      try {
        const UsersService = await getUsersService();
        const resp = await UsersService.usersPrivacyControllerGet();
        const data = resp?.data as any;
        if (data) {
          const next: PrivacyData = {
            showProfile: Boolean(data.showProfile),
            showStats: Boolean(data.showStats),
            allowMessages: Boolean(data.allowMessages),
            showOnlineStatus: Boolean(data.showOnlineStatus),
          };
          setPrivacy(next);
          setBaselinePrivacy(next);
        }
      } catch {
        // 保持默认值，不影响页面展示
      }
    })();
  }, [activeTab]);

  // 选项数据加载与回退（使用聚合接口一次获取所有分类列表及已选状态）
  const { getAllCategories, refreshDictionaries } = useDictionaryLabels();
  useEffect(() => {
    if (activeTab !== 'preferences') return;

    const loadAllCategories = async () => {
      try {
        // 获取字典数据用于填充 label
        let dictCats = getAllCategories();
        if (!Array.isArray(dictCats) || dictCats.length === 0) {
          await refreshDictionaries();
          dictCats = getAllCategories();
        }
        const dictMap = new Map<string, string>();
        if (Array.isArray(dictCats)) {
          dictCats.forEach((c) => dictMap.set(c.key, c.label));
        }

        const UsersService = await getUsersService();
        // 一次请求获取所有分类数据，无需传递 type 参数
        const resp = await UsersService.usersPreferencesControllerListCategories({});
        const data = resp?.data as any;

        // 处理种子分类 (torrent)
        const torrentItems = Array.isArray(data?.torrent) ? data.torrent : [];
        const torrentMapped = torrentItems
          .map((c: any) => ({
            key: String(c?.key ?? ''),
            label: String(c?.label ?? dictMap.get(c?.key) ?? c?.key ?? ''),
            show: Boolean(c?.show),
          }))
          .filter((c: any) => c.key && c.label);
        if (torrentMapped.length > 0) {
          setTorrentCategoryOptions(torrentMapped.map((c: any) => ({ key: c.key, label: c.label })));
          const selectedKeys = torrentMapped.filter((c: any) => c.show).map((c: any) => c.key);
          setSelectedTorrentCategories(selectedKeys);
          setBaselineTorrentCategories(selectedKeys);
        } else if (Array.isArray(dictCats) && dictCats.length > 0) {
          setTorrentCategoryOptions(dictCats.map((c) => ({ key: c.key, label: c.label })));
        }

        // 处理电影分类 (movie)
        const movieItems = Array.isArray(data?.movie) ? data.movie : [];
        const movieMapped = movieItems
          .map((c: any) => ({
            key: String(c?.key ?? ''),
            label: String(c?.label ?? dictMap.get(c?.key) ?? c?.key ?? ''),
            show: Boolean(c?.show),
          }))
          .filter((c: any) => c.key && c.label);
        if (movieMapped.length > 0) {
          setMovieGenreOptions(movieMapped.map((c: any) => ({ key: c.key, label: c.label })));
          const selectedKeys = movieMapped.filter((c: any) => c.show).map((c: any) => c.key);
          setSelectedMovieGenres(selectedKeys);
          setBaselineMovieGenres(selectedKeys);
        } else {
          setMovieGenreOptions([]);
        }

        // 处理剧集分类 (series)
        const seriesItems = Array.isArray(data?.series) ? data.series : [];
        const seriesMapped = seriesItems
          .map((c: any) => ({
            key: String(c?.key ?? ''),
            label: String(c?.label ?? dictMap.get(c?.key) ?? c?.key ?? ''),
            show: Boolean(c?.show),
          }))
          .filter((c: any) => c.key && c.label);
        if (seriesMapped.length > 0) {
          setSeriesGenreOptions(seriesMapped.map((c: any) => ({ key: c.key, label: c.label })));
          const selectedKeys = seriesMapped.filter((c: any) => c.show).map((c: any) => c.key);
          setSelectedSeriesGenres(selectedKeys);
          setBaselineSeriesGenres(selectedKeys);
        } else {
          setSeriesGenreOptions([]);
        }

        // 同步更新全局 store，让其他页面可以获取最新数据
        usePreferenceCategoriesStore.getState().setCategories({
          torrent: torrentMapped,
          movie: movieMapped,
          series: seriesMapped,
        });
      } catch {
        // 出错时回退到字典数据
        const dictCats = getAllCategories();
        if (Array.isArray(dictCats) && dictCats.length > 0) {
          setTorrentCategoryOptions(dictCats.map((c) => ({ key: c.key, label: c.label })));
        }
        setMovieGenreOptions([]);
        setSeriesGenreOptions([]);
      }
    };

    loadAllCategories();
  }, [activeTab]);

  useEffect(() => {
    if (activeTab !== 'notifications') return;
    (async () => {
      try {
        const UsersService = await getUsersService();
        const resp = await UsersService.usersNotificationsControllerGet();
        const data = resp?.data as any;
        if (data) {
          const next: NotificationsData = {
            emailNotifications: Boolean(data.emailNotifications),
            torrentComments: Boolean(data.torrentComments),
            privateMessages: Boolean(data.privateMessages),
            systemAnnouncements: Boolean(data.systemAnnouncements),
            downloadComplete: Boolean(data.downloadComplete),
            ratioWarnings: Boolean(data.ratioWarnings),
          };
          setNotifications(next);
          setBaselineNotifications(next);
        }
      } catch { }
    })();
  }, [activeTab]);

  useEffect(() => {
    if (activeTab !== 'preferences' || currentUserId) return;
    (async () => {
      try {
        const prof = await getProfile();
        const id = String(prof?.user?.id ?? prof?.user?._id ?? prof?.sub ?? '');
        if (id) setCurrentUserId(id);
      } catch { }
    })();
  }, [activeTab, currentUserId]);

  // 已选分类状态现在从 list-categories 接口的 show 字段获取，无需单独请求

  // 初始化服务端偏好
  useEffect(() => {
    if (activeTab !== 'profile') return;
    (async () => {
      try {
        const prof = await getProfile();
        const user = (prof as any)?.user ?? {};
        const rawAvatar = String((prof as any)?.avatar ?? profileData.avatar ?? '');
        const absoluteAvatar = (async () => {
          if (/^https?:\/\//i.test(rawAvatar)) return rawAvatar;
          if (/^data:/i.test(rawAvatar)) return rawAvatar;
          const OpenAPIObj = await getOpenAPI();
          const base = String((OpenAPIObj as any).BASE || (typeof window !== 'undefined' ? window.location.origin : '') || '').replace(/\/$/, '');
          const path = rawAvatar ? (rawAvatar.startsWith('/') ? rawAvatar : `/${rawAvatar}`) : '';
          return path ? `${base}${path}` : rawAvatar;
        })();
        const next: ProfileData = {
          username: String(user?.username ?? profileData.username ?? ''),
          avatar: await absoluteAvatar,
          signature: String((prof as any)?.signature ?? profileData.signature ?? ''),
          location: String((prof as any)?.location ?? profileData.location ?? ''),
          bio: String((prof as any)?.bio ?? profileData.bio ?? ''),
        };
        setProfileData(next);
      } catch { }
    })();
  }, [activeTab]);

  useEffect(() => {
    if (activeTab !== 'preferences') return;
    const loadPreferences = async () => {
      try {
        const UsersService = await getUsersService();
        const resp = await UsersService.usersPreferencesControllerGet();
        const data = resp?.data;
        if (data) {
          setPreferences({
            language: (data.language as PreferencesData['language']) ?? 'zh-CN',
            theme: (data.theme as PreferencesData['theme']) ?? 'dark',
            defaultView: (data.defaultView as PreferencesData['defaultView']) ?? 'grid',
          });
          setAdultMode(Boolean(data.showAdult));
          setSelectedTorrentCategories(Array.isArray(data.defaultTorrentCategories) ? data.defaultTorrentCategories : []);
          setBaselinePreferences({
            language: (data.language as PreferencesData['language']) ?? 'zh-CN',
            theme: (data.theme as PreferencesData['theme']) ?? 'dark',
            defaultView: (data.defaultView as PreferencesData['defaultView']) ?? 'grid',
          });
          setBaselineAdultMode(Boolean(data.showAdult));
          setBaselineTorrentCategories(Array.isArray(data.defaultTorrentCategories) ? data.defaultTorrentCategories : []);
        }
      } catch { }
    };
    loadPreferences();
  }, [activeTab]);

  // 使用 useAsyncAction 处理保存操作
  const savePreferencesAction = useAsyncAction({
    successMessage: '偏好设置已保存',
    loadingMessage: '正在保存偏好设置...',
    onSuccess: async () => {
      // 保存成功后重新获取分类，更新全局状态
      await usePreferenceCategoriesStore.getState().fetchCategories();
    },
  });

  const saveNotificationsAction = useAsyncAction({
    successMessage: '通知设置已保存',
    loadingMessage: '正在保存通知设置...',
  });

  const savePrivacyAction = useAsyncAction({
    successMessage: '隐私设置已保存',
    loadingMessage: '正在保存隐私设置...',
  });

  // 保存偏好
  const handleSave = async () => {
    if (activeTab === 'notifications') {
      await saveNotificationsAction.execute(async () => {
        const body: any = {};
        if (notifications.emailNotifications !== baselineNotifications.emailNotifications) body.emailNotifications = notifications.emailNotifications;
        if (notifications.torrentComments !== baselineNotifications.torrentComments) body.torrentComments = notifications.torrentComments;
        if (notifications.privateMessages !== baselineNotifications.privateMessages) body.privateMessages = notifications.privateMessages;
        if (notifications.systemAnnouncements !== baselineNotifications.systemAnnouncements) body.systemAnnouncements = notifications.systemAnnouncements;
        if (notifications.downloadComplete !== baselineNotifications.downloadComplete) body.downloadComplete = notifications.downloadComplete;
        if (notifications.ratioWarnings !== baselineNotifications.ratioWarnings) body.ratioWarnings = notifications.ratioWarnings;
        
        const hasChanges = Object.keys(body).length > 0;
        if (!hasChanges) {
          throw new Error('没有需要保存的更改');
        }
        
        const UsersService = await getUsersService();
        const resp = await UsersService.usersNotificationsControllerSave(body);
        const data = resp?.data as any;
        
        if (data) {
          const next: NotificationsData = {
            emailNotifications: Boolean(data.emailNotifications),
            torrentComments: Boolean(data.torrentComments),
            privateMessages: Boolean(data.privateMessages),
            systemAnnouncements: Boolean(data.systemAnnouncements),
            downloadComplete: Boolean(data.downloadComplete),
            ratioWarnings: Boolean(data.ratioWarnings),
          };
          setNotifications(next);
          setBaselineNotifications(next);
        }
      });
      return;
    }
    
    if (activeTab === 'privacy') {
      await savePrivacyAction.execute(async () => {
        const body: Partial<UpdateUserPrivacyDto> = {};
        if (privacy.showProfile !== baselinePrivacy.showProfile) body.showProfile = privacy.showProfile;
        if (privacy.showStats !== baselinePrivacy.showStats) body.showStats = privacy.showStats;
        if (privacy.allowMessages !== baselinePrivacy.allowMessages) body.allowMessages = privacy.allowMessages;
        if (privacy.showOnlineStatus !== baselinePrivacy.showOnlineStatus) body.showOnlineStatus = privacy.showOnlineStatus;
        
        const hasChanges = Object.keys(body).length > 0;
        if (!hasChanges) {
          throw new Error('没有需要保存的更改');
        }
        
        const UsersService = await getUsersService();
        const resp = await UsersService.usersPrivacyControllerSave(body as UpdateUserPrivacyDto);
        const data = resp?.data as any;
        
        if (data) {
          const next: PrivacyData = {
            showProfile: Boolean(data.showProfile),
            showStats: Boolean(data.showStats),
            allowMessages: Boolean(data.allowMessages),
            showOnlineStatus: Boolean(data.showOnlineStatus),
          };
          setPrivacy(next);
          setBaselinePrivacy(next);
        }
      });
      return;
    }
    
    // 保存偏好设置
    await savePreferencesAction.execute(async () => {
      const validCategories = selectedTorrentCategories.filter((k) => torrentCategoryOptions.some((c) => c.key === k));
      const validMovieGenres = selectedMovieGenres.filter((g) => movieGenreOptions.some((opt) => opt.key === g));
      const validSeriesGenres = selectedSeriesGenres.filter((g) => seriesGenreOptions.some((opt) => opt.key === g));
      
      const body: any = {
        showAdult: adultMode,
        defaultTorrentCategories: validCategories,
        defaultMovieCategories: validMovieGenres,
        defaultSeriesCategories: validSeriesGenres,
        language: preferences.language as UpdateUserPreferencesDto.language,
        theme: preferences.theme as UpdateUserPreferencesDto.theme,
        defaultView: preferences.defaultView as UpdateUserPreferencesDto.defaultView,
      };
      
      const UsersService = await getUsersService();
      const resp = await UsersService.usersPreferencesControllerSave(body);
      const data = resp?.data;
      
      if (data) {
        setPreferences({
          language: (data.language as PreferencesData['language']) ?? preferences.language,
          theme: (data.theme as PreferencesData['theme']) ?? preferences.theme,
          defaultView: (data.defaultView as PreferencesData['defaultView']) ?? preferences.defaultView,
        });
        setAdultMode(Boolean(data.showAdult));
        setSelectedTorrentCategories(Array.isArray(data.defaultTorrentCategories) ? data.defaultTorrentCategories : []);
        setSelectedMovieGenres(Array.isArray((data as any)?.defaultMovieCategories) ? (data as any).defaultMovieCategories : validMovieGenres);
        setSelectedSeriesGenres(Array.isArray((data as any)?.defaultSeriesCategories) ? (data as any).defaultSeriesCategories : validSeriesGenres);
        setBaselinePreferences({
          language: (data.language as PreferencesData['language']) ?? preferences.language,
          theme: (data.theme as PreferencesData['theme']) ?? preferences.theme,
          defaultView: (data.defaultView as PreferencesData['defaultView']) ?? preferences.defaultView,
        });
        setBaselineAdultMode(Boolean(data.showAdult));
        setBaselineTorrentCategories(Array.isArray(data.defaultTorrentCategories) ? data.defaultTorrentCategories : []);
        setBaselineMovieGenres(Array.isArray((data as any)?.defaultMovieCategories) ? (data as any).defaultMovieCategories : validMovieGenres);
        setBaselineSeriesGenres(Array.isArray((data as any)?.defaultSeriesCategories) ? (data as any).defaultSeriesCategories : validSeriesGenres);
      }
    });
  };

  const hasUnsavedChanges = (() => {
    const eqSet = (a: string[], b: string[]) => {
      if (a.length !== b.length) return false;
      const sa = new Set(a);
      for (const x of b) if (!sa.has(x)) return false;
      return true;
    };
    if (adultMode !== baselineAdultMode) return true;
    if (preferences.language !== baselinePreferences.language) return true;
    if (preferences.theme !== baselinePreferences.theme) return true;
    if (preferences.defaultView !== baselinePreferences.defaultView) return true;
    if (!eqSet(selectedTorrentCategories, baselineTorrentCategories)) return true;
    if (!eqSet(selectedMovieGenres, baselineMovieGenres)) return true;
    if (!eqSet(selectedSeriesGenres, baselineSeriesGenres)) return true;
    if (notifications.emailNotifications !== baselineNotifications.emailNotifications) return true;
    if (notifications.torrentComments !== baselineNotifications.torrentComments) return true;
    if (notifications.privateMessages !== baselineNotifications.privateMessages) return true;
    if (notifications.systemAnnouncements !== baselineNotifications.systemAnnouncements) return true;
    if (notifications.downloadComplete !== baselineNotifications.downloadComplete) return true;
    if (notifications.ratioWarnings !== baselineNotifications.ratioWarnings) return true;
    if (privacy.showProfile !== baselinePrivacy.showProfile) return true;
    if (privacy.showStats !== baselinePrivacy.showStats) return true;
    if (privacy.allowMessages !== baselinePrivacy.allowMessages) return true;
    if (privacy.showOnlineStatus !== baselinePrivacy.showOnlineStatus) return true;
    return false;
  })();

  return {
    // 顶层
    activeTab,
    setActiveTab,
    // 个人信息
    profileData,
    setProfileData,
    // 偏好
    preferences,
    setPreferences,
    adultMode,
    setAdultMode,
    // 分类多选
    torrentCategoryOptions,
    selectedTorrentCategories,
    setSelectedTorrentCategories,
    movieGenreOptions,
    selectedMovieGenres,
    setSelectedMovieGenres,
    seriesGenreOptions,
    selectedSeriesGenres,
    setSelectedSeriesGenres,
    // 安全、通知、隐私
    security,
    setSecurity,
    notifications,
    setNotifications,
    privacy,
    setPrivacy,
    // 操作
    handleSave,
    hasUnsavedChanges,
  };
}
