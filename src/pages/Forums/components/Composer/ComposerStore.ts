import { create } from "zustand";
import { persist } from "zustand/middleware";

export type ComposerMode = "CREATE_TOPIC" | "REPLY" | "EDIT";
export type ComposerViewState = "NORMAL" | "MINIMIZED" | "FULLSCREEN";

export interface ComposerDraft {
  title: string;
  categoryId: string;
  tags: string[];
  body: string;
  replyToPostId?: string;
  replyToTopicId?: string;
  replyToTitle?: string;
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
}

const DEFAULT_DRAFT: ComposerDraft = {
  title: "",
  categoryId: "",
  tags: [],
  body: "",
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
      isRichText: false, // 默认 Markdown 模式

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
