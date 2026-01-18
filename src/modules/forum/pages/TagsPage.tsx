import { useState } from "react";
import { Plus, Search, Hash, Layers, Pencil } from "lucide-react";
import { useForumsTagsQuery } from "../hooks/useForumsTagsQuery";
import { CreateTagModal } from "../components/CreateTagModal";
import { EditTagModal } from "../components/EditTagModal";
import { Input } from "@/modules/forum/components/ui/input";
import { Button } from "@/modules/forum/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useForumTheme } from "../context/ForumThemeContext";

export function TagsPage() {
  const navigate = useNavigate();
  const { colors } = useForumTheme();
  // 使用 as any 规避类型定义缺失问题 (ExtendedForumTag)
  const { data: tags, isLoading } = useForumsTagsQuery();
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editTagId, setEditTagId] = useState<string | null>(null);

  const filteredTags = Array.isArray(tags)
    ? tags.filter((tag: any) => tag.name.toLowerCase().includes(searchQuery.toLowerCase()))
    : [];

  if (isLoading) {
    return <div className="p-8 text-center text-gray-500">加载中...</div>;
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className={`text-2xl font-bold ${colors.titleColor}`}>所有标签</h1>
        <div className="flex items-center gap-2">
          <Button onClick={() => navigate("/forum/admin/tag-groups")} variant="default">
            <Layers className="h-4 w-4" />
            标签组管理
          </Button>
          <Button variant="primary" onClick={() => setIsCreateModalOpen(true)}>
            <Plus className="h-4 w-4" />
            创建标签
          </Button>
        </div>
      </div>

      <div className="relative">
        <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-500" />
        <Input
          placeholder="搜索标签..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className={`max-w-md pl-10 ${colors.inputBg} ${colors.inputBorder} ${colors.textPrimary}`}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {filteredTags.map((tag: any) => (
          <div
            key={tag.id || tag.name}
            className={`flex items-center justify-between rounded-xl border p-4 transition-all ${colors.cardBg} ${colors.cardBorder} ${colors.cardHover}`}
          >
            <button
              onClick={() => navigate(`/forum/tag/${tag.id || tag.name}`)}
              className="flex items-center gap-3 text-left"
            >
              <div
                className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-800"
                style={{ color: tag.color || "inherit" }}
              >
                <Hash className="h-5 w-5" />
              </div>
              <div>
                <div className={`font-medium ${colors.textPrimary}`}>{tag.name}</div>
                <div className={`text-xs ${colors.textMuted}`}>{tag.usageCount || 0} 个话题</div>
              </div>
            </button>
            <Button
              variant="none"
              size="icon"
              onClick={() => setEditTagId(String(tag.id || tag.name))}
              className="text-neutral-400 hover:text-[#0088CC] dark:text-neutral-500 dark:hover:text-[#0088CC]"
            >
              <Pencil className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>

      {filteredTags.length === 0 && (
        <div className={`py-12 text-center ${colors.textMuted}`}>没有找到匹配的标签</div>
      )}

      <CreateTagModal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} />
      {editTagId && (
        <EditTagModal isOpen={!!editTagId} onClose={() => setEditTagId(null)} tagId={editTagId} />
      )}
    </div>
  );
}
