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
  draft: ComposerDraft;
  isRichText: boolean; // 编辑器模式: false = Markdown, true = 富文本

  // Actions
  open: (mode: ComposerMode, initialData?: Partial<ComposerDraft>) => void;
  close: () => void;
  minimize: () => void;
  maximize: () => void; // Toggle Fullscreen
  restore: () => void; // Restore to Previous State

  setHeight: (height: number) => void;
  updateDraft: (data: Partial<ComposerDraft>) => void;
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

export const useComposerStore = create<ComposerState>()(
  persist(
    (set, get) => ({
      isOpen: false,
      mode: "CREATE_TOPIC",
      viewState: "NORMAL",
      previousViewState: "NORMAL",
      composerHeight: 400, // Default height in px
      draft: DEFAULT_DRAFT,
      isRichText: true, // 默认 富文本 模式

      open: (mode, initialData) => {
        set({
          isOpen: true,
          mode,
          viewState: "NORMAL",
          previousViewState: "NORMAL",
          draft: { ...DEFAULT_DRAFT, ...initialData },
        });
      },

      close: () => set({ isOpen: false }),

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
        set((state) => ({
          draft: { ...state.draft, ...data },
        })),

      reset: () => set({ draft: DEFAULT_DRAFT, isOpen: false }),

      toggleEditorMode: () => set((state) => ({ isRichText: !state.isRichText })),
      appendContent: (content) =>
        set((state) => ({
          draft: {
            ...state.draft,
            body: state.draft.body ? `${state.draft.body}\n${content}` : content,
          },
        })),
      addQuote: (quote) =>
        set((state) => {
          // 检查是否已存在相同的引用
          const exists = state.draft.quotes.some((q) => q.postId === quote.postId);
          if (exists) return state;

          const newQuotes = [...state.draft.quotes, quote];
          return {
            draft: {
              ...state.draft,
              quotes: newQuotes,
              // 自动选中最新添加的引用作为回复目标
              selectedQuoteIndex: newQuotes.length - 1,
              replyToPostId: quote.postId,
            },
          };
        }),
      selectQuote: (index) =>
        set((state) => {
          const quote = state.draft.quotes[index];
          return {
            draft: {
              ...state.draft,
              selectedQuoteIndex: index,
              replyToPostId: quote?.postId,
            },
          };
        }),
    }),
    {
      name: "forum-composer-storage", // unique name for localStorage
      partialize: (state) => ({
        // Persist all relevant state to restore session
        draft: state.draft,
        composerHeight: state.composerHeight,
        isOpen: state.isOpen, // Restore open state
        mode: state.mode, // Restore mode
        viewState: state.viewState, // Restore minimized/fullscreen
        isRichText: state.isRichText, // Restore editor mode
      }),
    },
  ),
);
