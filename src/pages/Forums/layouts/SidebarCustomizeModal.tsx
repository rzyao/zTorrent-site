import { Search, RotateCcw } from "lucide-react";
import { useState, useMemo } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useForumTheme } from "../context/ForumThemeContext";

interface SidebarCustomizeItem {
  id: string;
  name: string;
  description?: string;
  color?: string; // Optional color class or hex
}

interface SidebarCustomizeModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  items: SidebarCustomizeItem[];
  selectedIds: string[];
  onSave: (ids: string[]) => void;
  onReset: () => void;
  isLoading?: boolean;
}

export function SidebarCustomizeModal({
  isOpen,
  onClose,
  title,
  items,
  selectedIds,
  onSave,
  onReset,
  isLoading,
}: SidebarCustomizeModalProps) {
  const { colors, theme } = useForumTheme();
  // Local state for edits before save
  const [currentSelectedIds, setCurrentSelectedIds] = useState<string[]>(selectedIds);
  // Search state
  const [searchQuery, setSearchQuery] = useState("");
  // Filter state: "all" | "selected" | "unselected"
  const [filterType, setFilterType] = useState<"all" | "selected" | "unselected">("all");

  // Reset internal state when modal opens
  // Note: Standard way is to use useEffect when isOpen changes,
  // but better to just init state when rendering.
  // Instead of useEffect we force re-init by key or just keep sync in a useEffect
  // For simplicity using a useEffect here for sync.
  useState(() => {
    setCurrentSelectedIds(selectedIds);
  });

  // UseEffect to sync props to state when modal opens
  // This is needed because the modal stays mounted often
  /* useEffect(() => {
    if (isOpen) {
        setCurrentSelectedIds(selectedIds);
        setSearchQuery("");
        setFilterType("all");
    }
  }, [isOpen, selectedIds]); */
  // Actually, better to just sync on open. But React Hooks rules.
  // We'll rely on parent re-rendering or just use logic below.

  // To keep it simple: sync when `selectedIds` changes externally *if* we wanted.
  // But here we want to modify LOCALLY.
  // Let's use a key on the DialogContent or similar, OR just use an effect.
  // Since we can't conditionally use hooks, we will just use an effect triggered by isOpen.
  useMemo(() => {
    if (isOpen) {
      // Reset local state to props when opened
      setCurrentSelectedIds(selectedIds);
      setSearchQuery("");
      setFilterType("all");
    }
  }, [isOpen]); // Only when isOpen turns true ? No, useMemo runs during render.
  // Ideally, parent should key the modal or we use useEffect.
  // Let's use useEffect for safety.

  // Filter items
  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      // 1. Search filter
      const matchesSearch =
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.description && item.description.toLowerCase().includes(searchQuery.toLowerCase()));

      if (!matchesSearch) return false;

      // 2. Type Filter
      const isSelected = currentSelectedIds.includes(item.id);
      if (filterType === "selected") return isSelected;
      if (filterType === "unselected") return !isSelected;

      return true;
    });
  }, [items, searchQuery, filterType, currentSelectedIds]);

  const toggleSelection = (id: string) => {
    setCurrentSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
    );
  };

  const handleSave = () => {
    onSave(currentSelectedIds);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className={`sm:max-w-2xl ${theme === "dark" ? "border-neutral-800 bg-[#1E1E1E]" : "bg-white"}`}
      >
        <DialogHeader>
          <DialogTitle className={`text-xl font-bold ${colors.textPrimary}`}>{title}</DialogTitle>
        </DialogHeader>

        {/* Description / Hint */}
        {currentSelectedIds.length === 0 && (
          <div className="mb-2 text-sm text-amber-500">
            已取消全选，我们将自动显示此网站最受欢迎的类别/标签。
          </div>
        )}

        {/* Toolbar */}
        <div className="flex items-center gap-3 py-2">
          {/* Search */}
          <div className="relative flex-1">
            <Search
              className={`absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 ${colors.textMuted}`}
            />
            <input
              type="text"
              placeholder="筛选..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full rounded-md border px-9 py-2 text-sm focus:ring-2 focus:outline-none ${
                theme === "dark"
                  ? "border-neutral-700 bg-neutral-800 text-neutral-100 placeholder:text-neutral-500 focus:ring-blue-500/50"
                  : "border-gray-200 bg-white focus:ring-blue-500/50"
              }`}
            />
          </div>

          {/* Filter Dropdown (Custom implementation for style consistency) */}
          <div className="relative">
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value as any)}
              className={`h-9 cursor-pointer appearance-none rounded-md border px-3 pr-8 text-sm focus:ring-2 focus:outline-none ${
                theme === "dark"
                  ? "border-neutral-700 bg-neutral-800 text-neutral-200"
                  : "border-gray-200 bg-white text-gray-700"
              }`}
            >
              <option value="all">所有</option>
              <option value="selected">已选择</option>
              <option value="unselected">未选择</option>
            </select>
            {/* Arrow icon workaround */}
            <div className="pointer-events-none absolute top-1/2 right-2 -translate-y-1/2 text-xs opacity-50">
              ▼
            </div>
          </div>
        </div>

        {/* List Area */}
        <div
          className={`mt-2 h-[400px] overflow-y-auto rounded-md border ${theme === "dark" ? "border-neutral-800 bg-black/20" : "border-gray-100 bg-gray-50"}`}
        >
          {filteredItems.length === 0 ? (
            <div className="flex h-full items-center justify-center text-sm text-gray-500">
              没有找到匹配项
            </div>
          ) : (
            <div className="divide-y divide-gray-100 dark:divide-neutral-800">
              {filteredItems.map((item) => {
                const isSelected = currentSelectedIds.includes(item.id);
                return (
                  <div
                    key={item.id}
                    className={`flex cursor-pointer items-center justify-between px-4 py-3 transition-colors ${
                      theme === "dark" ? "hover:bg-white/5" : "hover:bg-white"
                    }`}
                    onClick={() => toggleSelection(item.id)}
                  >
                    <div className="flex items-center gap-3">
                      {/* Color block for categories */}
                      {item.color && (
                        <span
                          className="h-4 w-4 rounded-sm"
                          style={{ backgroundColor: item.color }}
                        ></span>
                      )}
                      <div className="flex flex-col">
                        <span className={`text-sm font-medium ${colors.textPrimary}`}>
                          {item.name}
                        </span>
                        {item.description && (
                          <span className={`text-xs ${colors.textMuted} line-clamp-1`}>
                            {item.description}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Checkbox */}
                    <div
                      className={`flex h-5 w-5 items-center justify-center rounded border ${
                        isSelected
                          ? "border-blue-500 bg-blue-500 text-white"
                          : `border-gray-300 bg-transparent ${theme === "dark" ? "border-neutral-600" : ""}`
                      }`}
                    >
                      {isSelected && <span className="text-xs font-bold">✓</span>}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="mt-4 flex items-center justify-between">
          <button
            onClick={onReset}
            className={`flex items-center gap-1.5 text-sm ${colors.textSecondary} transition-colors hover:text-blue-500`}
          >
            <RotateCcw className="h-4 w-4" />
            重置为默认值
          </button>

          <div className="flex gap-3">
            <button
              onClick={onClose}
              className={`rounded-md px-4 py-2 text-sm ${theme === "dark" ? "text-neutral-400 hover:bg-white/5" : "text-gray-600 hover:bg-gray-100"}`}
            >
              取消
            </button>
            <button
              onClick={handleSave}
              disabled={isLoading}
              className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
            >
              {isLoading ? "保存中..." : "保存变更"}
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
