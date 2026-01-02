import { create } from "zustand";
import { persist } from "zustand/middleware";

export type ComposerMode = "CREATE_TOPIC" | "REPLY" | "EDIT";
export type ComposerViewState = "NORMAL" | "MINIMIZED" | "FULLSCREEN";

export interface QuoteInfo {
  postId: string;
  username: string;
  floor: number;
  content: string;
}

export interface ComposerDraft {
  title: string;
  categoryId: string;
  tags: string[];
  body: string;
  replyToPostId?: string;
  replyToTopicId?: string;
  replyToTitle?: string;
  quotes: QuoteInfo[]; // 所有引用的帖子
  selectedQuoteIndex: number; // 当前选中的回复目标索引 (-1 表示回复整个话题)
}

interface ComposerState {
  isOpen: boolean;
  mode: ComposerMode;
  viewState: ComposerViewState;
  previousViewState: ComposerViewState; // 保存最小化之前的状态
  composerHeight: number;

  // 当前正在编辑的草稿（用于 UI 绑定）
  draft: ComposerDraft;
  // 持久化的草稿字典: key -> draft
  drafts: Record<string, ComposerDraft>;
  // 当前使用的 draft key
  currentDraftKey: string | null;

  isRichText: boolean; // 编辑器模式: false = Markdown, true = 富文本

  // Actions
  open: (mode: ComposerMode, initialData?: Partial<ComposerDraft>) => void;
  close: () => void;
  minimize: () => void;
  maximize: () => void; // Toggle Fullscreen
  restore: () => void; // Restore to Previous State

  setHeight: (height: number) => void;
  updateDraft: (data: Partial<ComposerDraft>) => void;
  // 舍弃当前草稿（对应"舍弃"按钮）
  discardDraft: () => void;
  // 发布成功后的重置（对应"提交成功"）
  reset: () => void;

  toggleEditorMode: () => void; // 切换编辑器模式
  appendContent: (content: string) => void;
  addQuote: (quote: QuoteInfo) => void; // 添加引用
  selectQuote: (index: number) => void; // 选择回复目标
}

const DEFAULT_DRAFT: ComposerDraft = {
  title: "",
  categoryId: "",
  tags: [],
  body: "",
  quotes: [],
  selectedQuoteIndex: -1,
};

// 辅助函数：生成草稿 Key
const getDraftKey = (mode: ComposerMode, topicId?: string) => {
  if (mode === "CREATE_TOPIC") return "create_topic";
  // 注意：编辑模式通常针对某个帖子，但 PRD 决定与回复共享话题草稿或简化处理
  // 这里按照 PRD 要求：reply_topic_{topicId}
  if (topicId) return `reply_topic_${topicId}`;
  return "create_topic"; // Fallback
};

export const useComposerStore = create<ComposerState>()(
  persist(
    (set, get) => ({
      isOpen: false,
      mode: "CREATE_TOPIC",
      viewState: "NORMAL",
      previousViewState: "NORMAL",
      composerHeight: 400, // Default height in px
      draft: DEFAULT_DRAFT,
      drafts: {},
      currentDraftKey: null,
      isRichText: true, // 默认 富文本 模式

      open: (mode, initialData) => {
        const state = get();

        // 1. 计算 Draft Key
        // initialData?.replyToTopicId 对于回复模式是必须的
        const key = getDraftKey(mode, initialData?.replyToTopicId);

        // 2. 尝试从 drafts 中恢复
        const savedDraft = state.drafts[key];

        // 3. 合并数据：优先使用保存的草稿，其次是 initialData，最后是 default
        // 注意：如果存在 savedDraft，我们通常忽略 initialData（除非 initialData 包含更强制的信息，但这里遵循恢复优先）
        // 不过，initialData 中的 replyToTopicId 等上下文信息可能需要更新

        let newDraft: ComposerDraft;

        if (savedDraft) {
          // 恢复草稿，但保留传入的上下文 ID (防止 ID 变化导致的不一致，虽然理论上 Key 相同 ID 应该相同)
          newDraft = {
            ...savedDraft,
            // 确保上下文 ID 正确
            replyToTopicId: initialData?.replyToTopicId || savedDraft.replyToTopicId,
            replyToPostId: initialData?.replyToPostId || savedDraft.replyToPostId,
            replyToTitle: initialData?.replyToTitle || savedDraft.replyToTitle,
          };
        } else {
          // 创建新草稿
          newDraft = { ...DEFAULT_DRAFT, ...initialData };
        }

        set({
          isOpen: true,
          mode,
          viewState: "NORMAL",
          previousViewState: "NORMAL",
          currentDraftKey: key,
          draft: newDraft,
        });
      },

      close: () => {
        // 关闭时只改变 UI 状态，草稿已经在 updateDraft 中实时保存到 drafts
        set({ isOpen: false });
      },

      discardDraft: () => {
        const { currentDraftKey, drafts } = get();
        if (currentDraftKey) {
          const newDrafts = { ...drafts };
          delete newDrafts[currentDraftKey];
          set({
            isOpen: false,
            drafts: newDrafts,
            draft: DEFAULT_DRAFT,
            currentDraftKey: null,
          });
        } else {
          set({ isOpen: false, draft: DEFAULT_DRAFT });
        }
      },

      reset: () => {
        // 发布成功后：清除当前草稿并关闭
        const { currentDraftKey, drafts } = get();
        if (currentDraftKey) {
          const newDrafts = { ...drafts };
          delete newDrafts[currentDraftKey];
          set({
            isOpen: false,
            drafts: newDrafts,
            draft: DEFAULT_DRAFT,
            currentDraftKey: null,
          });
        } else {
          set({ isOpen: false, draft: DEFAULT_DRAFT });
        }
      },

      minimize: () =>
        set((state) => ({
          viewState: "MINIMIZED",
          // 如果当前已经是最小化，保持之前的 previousViewState；否则保存现在的 viewState
          previousViewState:
            state.viewState === "MINIMIZED" ? state.previousViewState : state.viewState,
        })),

      maximize: () => {
        const current = get().viewState;
        set({ viewState: current === "FULLSCREEN" ? "NORMAL" : "FULLSCREEN" });
      },

      restore: () =>
        set((state) => ({
          // 恢复到之前的状态，如果之前的状态依然是 minimized (理论上不应发生)，则回退到 NORMAL
          viewState: state.previousViewState === "MINIMIZED" ? "NORMAL" : state.previousViewState,
        })),

      setHeight: (height) => set({ composerHeight: height }),

      updateDraft: (data) =>
        set((state) => {
          const newDraft = { ...state.draft, ...data };

          // 实时同步到 drafts 字典
          const newDrafts = state.currentDraftKey
            ? { ...state.drafts, [state.currentDraftKey]: newDraft }
            : state.drafts;

          return {
            draft: newDraft,
            drafts: newDrafts,
          };
        }),

      toggleEditorMode: () => set((state) => ({ isRichText: !state.isRichText })),

      appendContent: (content) =>
        set((state) => {
          const newBody = state.draft.body ? `${state.draft.body}\n${content}` : content;
          const newDraft = { ...state.draft, body: newBody };

          const newDrafts = state.currentDraftKey
            ? { ...state.drafts, [state.currentDraftKey]: newDraft }
            : state.drafts;

          return {
            draft: newDraft,
            drafts: newDrafts,
          };
        }),

      addQuote: (quote) =>
        set((state) => {
          // 检查是否已存在相同的引用
          const exists = state.draft.quotes.some((q) => q.postId === quote.postId);
          if (exists) return state;

          const newQuotes = [...state.draft.quotes, quote];
          const newDraft = {
            ...state.draft,
            quotes: newQuotes,
            // 自动选中最新添加的引用作为回复目标
            selectedQuoteIndex: newQuotes.length - 1,
            replyToPostId: quote.postId,
          };

          const newDrafts = state.currentDraftKey
            ? { ...state.drafts, [state.currentDraftKey]: newDraft }
            : state.drafts;

          return {
            draft: newDraft,
            drafts: newDrafts,
          };
        }),

      selectQuote: (index) =>
        set((state) => {
          const quote = state.draft.quotes[index];
          const newDraft = {
            ...state.draft,
            selectedQuoteIndex: index,
            replyToPostId: quote?.postId,
          };

          const newDrafts = state.currentDraftKey
            ? { ...state.drafts, [state.currentDraftKey]: newDraft }
            : state.drafts;

          return {
            draft: newDraft,
            drafts: newDrafts,
          };
        }),
    }),
    {
      name: "forum-composer-storage", // unique name for localStorage
      partialize: (state) => ({
        // Persist all relevant state to restore session
        drafts: state.drafts, // 核心：持久化草稿字典

        // 我们也持久化当前状态，以便刷新页面后恢复编辑器打开状态
        isOpen: state.isOpen,
        mode: state.mode,
        currentDraftKey: state.currentDraftKey,
        draft: state.draft, // 当前正在编辑的草稿也要保存，用于直接恢复

        composerHeight: state.composerHeight,
        viewState: state.viewState,
        isRichText: state.isRichText,
      }),
    },
  ),
);
