import { Search, RotateCcw, GripVertical } from "lucide-react";
import { useState, useMemo } from "react";
import { useLanguage } from "@/hooks/useLanguage";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/modules/forum/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/modules/forum/components/ui/tabs";
import { useForumTheme } from "../context/ForumThemeContext";
import { Button } from "../components/ui/button";
import { cn } from "@/utils/cn";

interface SortableItemProps {
  id: string;
  className?: string;
  children: (dragHandleProps: any, isDragging: boolean) => React.ReactNode;
}

function SortableItem({ id, className, children }: SortableItemProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : "auto",
    position: "relative" as const,
  };

  return (
    <div ref={setNodeRef} style={style} className={className}>
      {children({ ...attributes, ...listeners }, isDragging)}
    </div>
  );
}

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
  const { t } = useLanguage();
  // Local state for edits before save
  const [currentSelectedIds, setCurrentSelectedIds] = useState<string[]>(selectedIds);
  // Search state
  const [searchQuery, setSearchQuery] = useState("");

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

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
      setCurrentSelectedIds(selectedIds);
      setSearchQuery("");
    }
  }, [isOpen]); // Only when isOpen turns true ? No, useMemo runs during render.
  // Ideally, parent should key the modal or we use useEffect.
  // Let's use useEffect for safety.

  // 1. Items for "Select" tab (Searchable, All items)
  const filteredAllItems = useMemo(() => {
    return items.filter((item) => {
      if (!searchQuery) return true;
      return (
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.description && item.description.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    });
  }, [items, searchQuery]);

  // 2. Items for "Sort" tab (Selected only, Ordered)
  const sortedSelectedItems = useMemo(() => {
    return currentSelectedIds
      .map((id) => items.find((item) => item.id === id))
      .filter((item): item is SidebarCustomizeItem => !!item);
  }, [currentSelectedIds, items]);

  const toggleSelection = (id: string) => {
    setCurrentSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
    );
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setCurrentSelectedIds((items) => {
        const oldIndex = items.indexOf(active.id as string);
        const newIndex = items.indexOf(over.id as string);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const handleSave = () => {
    onSave(currentSelectedIds);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className={`bg-white sm:max-w-2xl dark:border-neutral-800 dark:bg-[#1E1E1E]`}>
        <DialogHeader>
          <DialogTitle className={`text-xl font-bold ${colors.textPrimary}`}>{title}</DialogTitle>
        </DialogHeader>

        {/* Description / Hint */}
        {currentSelectedIds.length === 0 && (
          <div className="mb-2 text-sm text-amber-500">
            {t('forum.sidebar.emptySelectionHint')}
          </div>
        )}

        <Tabs defaultValue="select" className="w-full">
          <div className="flex items-center justify-between py-2">
            <TabsList className="bg-transparent p-0">
              <TabsTrigger
                value="select"
                className="rounded-none border-b-2 border-transparent bg-transparent px-4 pb-2 text-gray-500 shadow-none hover:text-gray-700 data-[state=active]:border-blue-500 data-[state=active]:bg-transparent data-[state=active]:text-blue-600 data-[state=active]:shadow-none dark:text-gray-400 dark:hover:text-gray-200 dark:data-[state=active]:border-blue-400 dark:data-[state=active]:text-blue-400"
              >
                {t('forum.sidebar.select')}
              </TabsTrigger>
              <TabsTrigger
                value="sort"
                className="rounded-none border-b-2 border-transparent bg-transparent px-4 pb-2 text-gray-500 shadow-none hover:text-gray-700 data-[state=active]:border-blue-500 data-[state=active]:bg-transparent data-[state=active]:text-blue-600 data-[state=active]:shadow-none dark:text-gray-400 dark:hover:text-gray-200 dark:data-[state=active]:border-blue-400 dark:data-[state=active]:text-blue-400"
              >
                {t('forum.sidebar.sort')} ({currentSelectedIds.length})
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="select" className="mt-0">
            {/* Search Bar for Selection */}
            <div className="relative mb-2">
              <Search
                className={`absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 ${colors.textMuted}`}
              />
              <input
                type="text"
                placeholder={t('forum.sidebar.searchPlaceholder')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`w-full rounded-md border border-gray-200 bg-white px-9 py-2 text-sm focus:ring-2 focus:ring-blue-500/50 focus:outline-none dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100 dark:placeholder:text-neutral-500 dark:focus:ring-blue-500/50`}
              />
            </div>

            {/* List Area for Selection */}
            <div
              className={`h-[350px] overflow-y-auto rounded-md border border-gray-100 bg-gray-50 dark:border-neutral-800 dark:bg-black/20`}
            >
              {filteredAllItems.length === 0 ? (
                <div className="flex h-full items-center justify-center text-sm text-gray-500">
                  {t('forum.sidebar.noMatch')}
                </div>
              ) : (
                <div className="divide-y divide-gray-100 dark:divide-neutral-800">
                  {filteredAllItems.map((item) => {
                    const isSelected = currentSelectedIds.includes(item.id);
                    return (
                      <div
                        key={item.id}
                        className={`flex cursor-pointer items-center justify-between px-4 py-3 transition-colors hover:bg-white dark:hover:bg-white/5`}
                        onClick={() => toggleSelection(item.id)}
                      >
                        <div className="flex items-center gap-3">
                          {/* Color block */}
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
                              : `border-gray-300 bg-transparent dark:border-neutral-600`
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
          </TabsContent>

          <TabsContent value="sort" className="mt-0">
            <div className="mb-2 text-xs text-gray-500 dark:text-gray-400">
              {t('forum.sidebar.dragHint')}
            </div>
            {/* List Area for Sorting */}
            <div
              className={`h-[350px] overflow-y-auto rounded-md border border-gray-100 bg-gray-50 dark:border-neutral-800 dark:bg-black/20`}
            >
              {sortedSelectedItems.length === 0 ? (
                <div className="flex h-full items-center justify-center text-sm text-gray-500">
                  {t('forum.sidebar.noSelection')}
                </div>
              ) : (
                <div className="divide-y divide-gray-100 dark:divide-neutral-800">
                  <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragEnd={handleDragEnd}
                  >
                    <SortableContext
                      items={sortedSelectedItems.map((i) => i.id)}
                      strategy={verticalListSortingStrategy}
                    >
                      {sortedSelectedItems.map((item) => (
                        <SortableItem
                          key={item.id}
                          id={item.id}
                          className={`flex items-center justify-between bg-white px-4 py-3 hover:bg-gray-50 dark:bg-transparent dark:hover:bg-white/5`}
                        >
                          {(dragHandleProps, isDragging) => (
                            <div className="flex w-full items-center gap-3">
                              {/* Drag Handle */}
                              <div
                                {...dragHandleProps}
                                className="cursor-grab text-gray-400 hover:text-gray-600 active:cursor-grabbing"
                              >
                                <GripVertical className="h-4 w-4" />
                              </div>

                              {/* Color block */}
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
                          )}
                        </SortableItem>
                      ))}
                    </SortableContext>
                  </DndContext>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>

        {/* Footer */}
        <div className="mt-4 flex items-center justify-between">
          <Button
            variant="none"
            size="none"
            onClick={onReset}
            className={cn(
              "flex items-center gap-1.5 text-sm transition-colors hover:text-blue-500",
              colors.textSecondary,
            )}
          >
            <RotateCcw className="h-4 w-4" />
            {t('forum.sidebar.resetDefault')}
          </Button>

          <div className="flex gap-3">
            <Button variant="cancel" size="sm" onClick={onClose}>
              {t('app.cancel')}
            </Button>
            <Button variant="primary" size="sm" onClick={handleSave} loading={isLoading}>
              {t('forum.sidebar.saveChanges')}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
