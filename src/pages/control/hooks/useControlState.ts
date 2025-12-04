import { useEffect, useState } from 'react';
import { useDynamicTitle } from '@/hooks/useDynamicTitle';
import { useDictionaryLabels } from '@/hooks/useDictionary';
import { UsersService } from '@/api/services/UsersService';
import { getProfile } from '@/api/custom/auth';
import { FilmsService } from '@/api/services/FilmsService';
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
  const [saveSuccess, setSaveSuccess] = useState(false);

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

  // 影片分类（Genre，多选）
  const [filmGenreOptions, setFilmGenreOptions] = useState<string[]>([]);
  const [selectedFilmGenres, setSelectedFilmGenres] = useState<string[]>([]);

  const [baselineAdultMode, setBaselineAdultMode] = useState<boolean>(false);
  const [baselinePreferences, setBaselinePreferences] = useState<PreferencesData>({ language: 'zh-CN', theme: 'dark', defaultView: 'grid' });
  const [baselineTorrentCategories, setBaselineTorrentCategories] = useState<string[]>([]);
  const [baselineFilmGenres, setBaselineFilmGenres] = useState<string[]>([]);

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

  // 隐私设置
  const [privacy, setPrivacy] = useState<PrivacyData>({
    showProfile: true,
    showStats: true,
    allowMessages: true,
    showOnlineStatus: true,
  });

  // 选项数据加载与回退（字典优先、接口回退、静态占位）
  const { getAllCategories, refreshDictionaries } = useDictionaryLabels();
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const resp = await UsersService.usersPreferencesControllerListGeneralTorrentRootCategories();
        const items = Array.isArray(resp?.data) ? resp.data : [];
        const mapped = items
          .map((c: any) => ({ key: String(c?.key ?? ''), label: String(c?.label ?? '') }))
          .filter((c) => c.key && c.label);
        if (mapped.length > 0) {
          setTorrentCategoryOptions(mapped);
        } else {
          const dictCats = getAllCategories();
          if (Array.isArray(dictCats) && dictCats.length > 0) {
            setTorrentCategoryOptions(dictCats.map((c) => ({ key: c.key, label: c.label })));
          } else {
            await refreshDictionaries();
            const nextCats = getAllCategories();
            if (Array.isArray(nextCats) && nextCats.length > 0) {
              setTorrentCategoryOptions(nextCats.map((c) => ({ key: c.key, label: c.label })));
            }
          }
        }
      } catch {
        const dictCats = getAllCategories();
        if (Array.isArray(dictCats) && dictCats.length > 0) {
          setTorrentCategoryOptions(dictCats.map((c) => ({ key: c.key, label: c.label })));
        }
      }
    };
    const loadGenres = async () => {
      try {
        const resp = await FilmsService.filmsControllerListGenres();
        const genres = resp?.data?.genres || [];
        const cleaned = Array.from(new Set(genres.filter((g: any) => g && String(g).trim() !== '')));
        if (cleaned.length > 0) {
          setFilmGenreOptions(cleaned);
          return;
        }
      } catch {}
      setFilmGenreOptions(['科幻', '剧情', '动作', '犯罪', '冒险', '动画', '奇幻', '悬疑', '惊悚', '历史', '战争']);
    };
    loadCategories();
    loadGenres();
  }, []);

  useEffect(() => {
    const loadDefaultCategoryKeys = async () => {
      try {
        const prof = await getProfile();
        const id = String(prof?.user?.id ?? prof?.user?._id ?? prof?.sub ?? '');
        if (!id) return;
        const resp = await UsersService.usersPreferencesControllerGetDefaultTorrentCategoryKeys({ id });
        const keys = Array.isArray(resp?.data) ? resp.data : [];
        setSelectedTorrentCategories(keys);
        setBaselineTorrentCategories(keys);
      } catch {}
    };
    loadDefaultCategoryKeys();
  }, []);

  // 初始化服务端偏好
  useEffect(() => {
    const loadPreferences = async () => {
      try {
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
          setSelectedFilmGenres(Array.isArray(data.defaultFilmGenres) ? data.defaultFilmGenres : []);
          setBaselinePreferences({
            language: (data.language as PreferencesData['language']) ?? 'zh-CN',
            theme: (data.theme as PreferencesData['theme']) ?? 'dark',
            defaultView: (data.defaultView as PreferencesData['defaultView']) ?? 'grid',
          });
          setBaselineAdultMode(Boolean(data.showAdult));
          setBaselineTorrentCategories(Array.isArray(data.defaultTorrentCategories) ? data.defaultTorrentCategories : []);
          setBaselineFilmGenres(Array.isArray(data.defaultFilmGenres) ? data.defaultFilmGenres : []);
        }
      } catch {}
    };
    loadPreferences();
  }, []);

  // 保存偏好
  const handleSave = async () => {
    try {
      const validCategories = selectedTorrentCategories.filter((k) => torrentCategoryOptions.some((c) => c.key === k));
      const validGenres = selectedFilmGenres.filter((g) => filmGenreOptions.includes(g));
      const body = {
        showAdult: adultMode,
        defaultTorrentCategories: validCategories,
        defaultFilmGenres: validGenres,
        language: preferences.language,
        theme: preferences.theme,
        defaultView: preferences.defaultView,
      };
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
        setSelectedFilmGenres(Array.isArray(data.defaultFilmGenres) ? data.defaultFilmGenres : []);
        setBaselinePreferences({
          language: (data.language as PreferencesData['language']) ?? preferences.language,
          theme: (data.theme as PreferencesData['theme']) ?? preferences.theme,
          defaultView: (data.defaultView as PreferencesData['defaultView']) ?? preferences.defaultView,
        });
        setBaselineAdultMode(Boolean(data.showAdult));
        setBaselineTorrentCategories(Array.isArray(data.defaultTorrentCategories) ? data.defaultTorrentCategories : []);
        setBaselineFilmGenres(Array.isArray(data.defaultFilmGenres) ? data.defaultFilmGenres : []);
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
      }
    } catch {
      setSaveSuccess(false);
    }
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
    if (!eqSet(selectedFilmGenres, baselineFilmGenres)) return true;
    return false;
  })();

  return {
    // 顶层
    activeTab,
    setActiveTab,
    saveSuccess,
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
    filmGenreOptions,
    selectedFilmGenres,
    setSelectedFilmGenres,
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
