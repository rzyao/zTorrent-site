import { useEffect, useMemo, useState } from "react";
import { ForumsTagsService } from "@/api";
import { cn } from "@/utils/cn";
import { useForumTheme } from "@/modules/forum/context/ForumThemeContext";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/modules/forum/components/ui/dialog";
import { Input } from "@/modules/forum/components/ui/input";
import { Button } from "@/modules/forum/components/ui/button";
import { Loader2, Plus } from "lucide-react";
import { toast } from "sonner";

interface ManageGroupTagsDialogProps {
  groupId: string;
  groupName: string;
  open: boolean;
  onClose: () => void;
  onSaved?: () => void;
}

/**
 * 管理当前标签组的成员标签（添加为主）
 * - 支持搜索现有标签并多选添加到该组
 * - 支持创建新标签并直接归入当前组
 * - 保存时逐条更新标签的 groupIds，确保不覆盖其原有所属组
 */
export function ManageGroupTagsDialog({
  groupId,
  groupName,
  open,
  onClose,
  onSaved,
}: ManageGroupTagsDialogProps) {
  const { colors } = useForumTheme();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [searching, setSearching] = useState(false);
  const [tags, setTags] = useState<Array<any>>([]);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState("");
  const [newTagName, setNewTagName] = useState("");

  // 初始化加载：获取前 200 条标签
  useEffect(() => {
    const fetchInitial = async () => {
      if (!open) return;
      setLoading(true);
      try {
        const res = await ForumsTagsService.tagsControllerFindAll({ page: 1, limit: 200 });
        const items = (res.data as any)?.items ?? [];
        setTags(items);
        // 初始不预勾选（避免覆盖其他组），仅提供“添加”操作
        setSelectedIds(new Set());
      } finally {
        setLoading(false);
      }
    };
    fetchInitial();
  }, [open]);

  // 服务端搜索
  const handleSearch = async () => {
    setSearching(true);
    try {
      const res = await ForumsTagsService.tagsControllerSearch({ q: searchQuery, limit: 50 });
      const items = (res.data as any) ?? [];
      setTags(items);
    } finally {
      setSearching(false);
    }
  };

  const filteredTags = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return tags;
    // 本地过滤作为补充
    return tags.filter((t: any) =>
      String(t.name || "")
        .toLowerCase()
        .includes(q),
    );
  }, [tags, searchQuery]);

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const createTagForGroup = async () => {
    const name = newTagName.trim();
    if (!name) return;
    setSaving(true);
    try {
      const res = await ForumsTagsService.tagsControllerCreate({
        name,
      });
      const created = (res.data as any) ?? null;
      if (created) {
        if (created.id) {
          try {
            await ForumsTagsService.tagsControllerUpdate({
              id: created.id,
              name: created.name,
              groupIds: [groupId],
            });
          } catch {
            toast.error("标签已创建，但加入标签组失败，请联系管理员修复映射主键生成。");
          }
        }
        setTags((prev) => [created, ...prev]);
        if (created.id) {
          setSelectedIds((prev) => new Set(prev.add(created.id)));
        }
      }
      setNewTagName("");
    } finally {
      setSaving(false);
    }
  };

  const handleSave = async () => {
    if (selectedIds.size === 0) {
      onClose();
      return;
    }
    setSaving(true);
    try {
      const failed: string[] = [];
      for (const tagId of Array.from(selectedIds)) {
        try {
          const detail = await ForumsTagsService.tagsControllerFindOne({ id: tagId });
          const tag = (detail.data as any) ?? {};
          const currentGroupIds: string[] = Array.isArray(tag.groupIds) ? tag.groupIds : [];
          const nextGroupIds = Array.from(new Set([...currentGroupIds, groupId]));
          await ForumsTagsService.tagsControllerUpdate({
            id: tagId,
            name: tag.name,
            groupIds: nextGroupIds,
          });
        } catch {
          failed.push(tagId);
        }
      }
      if (failed.length > 0) {
        toast.error(`部分标签加入失败（${failed.length}）。可能是后端映射表主键未正确生成。`);
      } else {
        toast.success("已将选中标签加入该标签组");
      }
      onClose();
      onSaved?.();
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(opened) => !opened && onClose()}>
      <DialogContent className={cn(colors.cardBg, colors.textPrimary, "max-w-3xl")}>
        <DialogHeader>
          <DialogTitle className={colors.titleColor}>为标签组添加标签</DialogTitle>
          <DialogDescription className={colors.textSecondary}>
            目标标签组：{groupName}（ID: {groupId}）。支持搜索选择现有标签或新建标签并加入该组。
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* 搜索区 */}
          <div className="flex items-center gap-2">
            <Input
              placeholder="输入关键字，按 Enter 或点击搜索"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              className={cn(colors.inputBg, colors.inputBorder)}
            />
            <Button onClick={handleSearch} disabled={searching} variant="default">
              {searching && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              搜索
            </Button>
          </div>

          {/* 新建标签并加入当前组 */}
          <div className="flex items-center gap-2">
            <Input
              placeholder="新建标签名称"
              value={newTagName}
              onChange={(e) => setNewTagName(e.target.value)}
              className={cn(colors.inputBg, colors.inputBorder)}
            />
            <Button onClick={createTagForGroup} disabled={saving} className="gap-1">
              <Plus className="h-4 w-4" />
              新建并加入该组
            </Button>
          </div>

          {/* 标签选择列表 */}
          <div className={cn("rounded-md border p-2", colors.cardBorder)}>
            {loading ? (
              <div className="flex items-center justify-center gap-2 py-8">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span className={colors.textMuted}>加载标签列表...</span>
              </div>
            ) : filteredTags.length === 0 ? (
              <div className={cn("py-8 text-center text-sm", colors.textMuted)}>暂无标签</div>
            ) : (
              <ul className="max-h-[340px] overflow-auto">
                {filteredTags.map((tag: any) => {
                  const id = String(tag.id ?? tag._id ?? "");
                  const checked = selectedIds.has(id);
                  return (
                    <li
                      key={id}
                      className={cn(
                        "flex items-center justify-between border-b px-2 py-2 last:border-b-0",
                        colors.dividerColor,
                      )}
                    >
                      <label className="flex cursor-pointer items-center gap-3">
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => toggleSelect(id)}
                          className="h-4 w-4"
                        />
                        <span className={colors.textPrimary}>{tag.name}</span>
                      </label>
                      <span className={cn("text-xs", colors.textMuted)}>
                        {tag.usageCount ?? 0} 个话题
                      </span>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button variant="default" onClick={onClose} className={cn(colors.buttonSecondary)}>
            取消
          </Button>
          <Button onClick={handleSave} disabled={saving} className={cn(colors.buttonPrimary)}>
            {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            保存
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
