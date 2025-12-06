/**
 * 全局字典状态（Zustand Store）
 * 作用：
 * - 从后端拉取并维护分类（categories）、用户排序选项（userOrderBy）、后台排序选项（adminSortBy）、查询操作符（queryOps）等字典数据
 * - 为组件提供按类别与 key 查询对应 label 的能力
 * 生命周期与初始化：
 * - 在应用启动时由 `src/App.tsx` 的 `useEffect` 调用 `fetchDictionaries()` 完成首次加载
 * 状态约定：
 * - `isLoading` 表示拉取过程中的加载态
 * - `error` 存储最近一次拉取的错误信息，UI 可据此提示
 */
import { create } from 'zustand';
import { DictionaryService } from '@/api/services/DictionaryService';

/**
 * 单个字典项
 * - `key`：字典项的唯一标识（后端提供）
 * - `label`：用于展示的文本；当后端缺失 `label` 时，前端会回退使用 `key`
 */
interface DictionaryItem {
  key: string;
  label: string;
  sort?: number;
}

/**
 * 后端返回并在前端维护的字典集合
 * - 各字段均为可选（后端可能缺省），前端在使用时需做好空数组回退
 */
interface DictionaryData {
  categories?: DictionaryItem[];
  userOrderBy?: DictionaryItem[];
  adminSortBy?: DictionaryItem[];
  queryOps?: DictionaryItem[];
}

/**
 * Store 状态与方法定义
 * - `dictionaries`：标准化后的字典数据；未加载前为 `null`
 * - `isLoading`：拉取中标记
 * - `error`：最近一次错误信息（人类可读）
 * - `fetchDictionaries`：从后端拉取并写入 `dictionaries`
 * - `getLabelByKey`：按类别与 key 查询对应的 label
 */
interface DictionaryState {
  dictionaries: DictionaryData | null;
  isLoading: boolean;
  error: string | null;
  fetchDictionaries: () => Promise<void>;
  getLabelByKey: (category: keyof DictionaryData, key: string) => string | undefined;
}

export const useDictionaryStore = create<DictionaryState>((set, get) => ({
  dictionaries: null,
  isLoading: false,
  error: null,

  fetchDictionaries: async () => {
    // 进入加载态，并清空上一轮错误信息
    set({ isLoading: true, error: null });
    try {
      // 调用后端接口获取字典数据
      const response = await DictionaryService.dictionaryControllerDictionaries();

      /**
       * 兼容后端统一响应包装：
       * - 情况 A：返回形如 { code, message, data } 的封装对象（OpenAPI 常见）
       * - 情况 B：直接返回数据对象，无外层包装
       * 处理策略：先判断存在 `code` 字段，则认为是封装对象；否则尝试从 `response.data` 取数据
       * 最终 `raw` 取 `body.data ?? body`，确保拿到纯数据体用于后续规范化
       */
      const body: any = (response as any)?.code !== undefined ? response : (response as any)?.data;
      const raw: any = body?.data ?? body;

      /**
       * 规范化后端字典项为前端可用结构：
       * - 输入：后端的数组项可能缺少 `key` 或 `label`
       * - 过滤：仅保留有有效字符串 `key` 的项
       * - 映射：`label` 缺失则回退使用 `key`，确保 UI 始终有展示文本
       * - 返回：`DictionaryItem[]`
       */
      const normalize = (arr?: Array<{ key?: string; label?: string; sort?: number }>): DictionaryItem[] => {
        if (!Array.isArray(arr)) return [];
        return arr
          .filter((it) => typeof it?.key === 'string' && it.key!.length > 0)
          .map((it) => ({ key: String(it.key), label: String(it.label ?? it.key), sort: typeof it.sort === 'number' ? it.sort : undefined }));
      };

      // 将各可选字段进行逐类规范化，统一为前端 `DictionaryData` 结构
      const dictionaries: DictionaryData = {
        categories: normalize(raw?.categories),
        userOrderBy: normalize(raw?.userOrderBy),
        adminSortBy: normalize(raw?.adminSortBy),
        queryOps: normalize(raw?.queryOps),
      };

      // 写入 store：保存最新字典并结束加载态
      set({ dictionaries, isLoading: false });
    }
    catch (error) {
      // 失败处理：记录人类可读错误信息，并结束加载态
      set({
        error: error instanceof Error ? error.message : 'Failed to fetch dictionaries',
        isLoading: false
      });
    }
  },

  getLabelByKey: (category, key) => {
    // 从当前字典集合中按类别读取，并查找匹配 key 的项
    const { dictionaries } = get();
    if (!dictionaries || !dictionaries[category]) return undefined;

    const items = dictionaries[category] as DictionaryItem[];
    const item = items.find(item => item.key === key);
    return item?.label;
  }
}));
