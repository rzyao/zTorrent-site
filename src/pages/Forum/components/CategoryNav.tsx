import { MessageSquare, Search, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CategoryNavProps {
  categories: Array<{ id: string; name: string }>;
  activeCategoryId: string;
  onCategoryChange: (id: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onNewPost: () => void;
}

export function CategoryNav({
  categories,
  activeCategoryId,
  onCategoryChange,
  searchQuery,
  onSearchChange,
  onNewPost,
}: CategoryNavProps) {
  return (
    <div className="bg-neutral-800/40 backdrop-blur-sm rounded-2xl border border-neutral-700/50 shadow-2xl overflow-hidden mb-6">
      <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-700/50">
        <div className="flex items-center gap-2 flex-wrap">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => onCategoryChange(category.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg transition-all ${
                activeCategoryId === category.id
                  ? "bg-linear-to-r from-amber-500/20 to-orange-500/20 text-white"
                  : "text-neutral-400 hover:bg-neutral-700/30 hover:text-white"
              }`}
            >
              <MessageSquare className="w-4 h-4" />
              <span>{category.name}</span>
            </button>
          ))}
        </div>

        {/* 搜索框 */}
        <div className="flex gap-4">
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="搜索帖子..."
              className="w-full bg-neutral-900/60 border border-neutral-700/60 rounded-lg pl-10 pr-4 py-2 text-white text-sm placeholder:text-neutral-500 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/30 outline-none transition-all"
            />
          </div>
          <Button
            onClick={onNewPost}
            className="bg-linear-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white shadow-lg shadow-amber-500/25"
          >
            <Plus className="w-4 h-4 mr-2" />
            发布帖子
          </Button>
        </div>
      </div>
    </div>
  );
}
