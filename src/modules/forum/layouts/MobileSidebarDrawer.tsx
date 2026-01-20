import { X } from "lucide-react";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useForumTheme } from "../context/ForumThemeContext";
import { Sidebar } from "./Sidebar";

interface MobileSidebarDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

/**
 * Discourse 风格的移动端侧边栏抽屉
 * 从左侧滑入，包含完整的导航菜单
 */
export function MobileSidebarDrawer({
  isOpen,
  onClose,
  selectedCategory,
  onCategoryChange,
}: MobileSidebarDrawerProps) {
  const { t } = useTranslation();
  const { colors } = useForumTheme();
  const scrollbarClass = "scrollbar-sidebar";

  // 锁定 body 滚动
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // ESC 键关闭
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [isOpen, onClose]);

  // 点击分类后关闭抽屉
  const handleCategoryChange = (category: string) => {
    onCategoryChange(category);
    onClose();
  };

  return (
    <>
      {/* 背景遮罩 */}
      <div
        className={`fixed inset-0 z-40 bg-black/60 backdrop-blur-sm transition-opacity duration-300 lg:hidden ${
          isOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* 抽屉面板 */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-80 max-w-[85vw] transform transition-transform duration-300 ease-out lg:hidden ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className={`flex h-full flex-col bg-white dark:bg-[#090909]`}>
          {/* 抽屉头部 */}
          <div
            className={`flex h-16 items-center justify-between border-b px-4 ${colors.borderColor}`}
          >
            <span className={`text-lg font-semibold ${colors.textPrimary}`}>{t('forum.sidebar.navigationMenu')}</span>
            <button
              onClick={onClose}
              className={`rounded-lg p-2 ${colors.buttonHover} transition-colors`}
              aria-label={t('forum.sidebar.closeMenu')}
            >
              <X className={`h-5 w-5 ${colors.textSecondary}`} />
            </button>
          </div>

          {/* 抽屉内容 - 复用原有 Sidebar */}
          <div className={`flex-1 overflow-y-auto p-4 ${scrollbarClass}`}>
            <Sidebar selectedCategory={selectedCategory} onCategoryChange={handleCategoryChange} />
          </div>
        </div>
      </div>
    </>
  );
}
