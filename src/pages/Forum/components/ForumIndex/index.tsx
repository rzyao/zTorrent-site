import { IForumCategory } from "../../types";
import { FORUM_PARTITIONS } from "../../constants";
import { PartitionGroup } from "./PartitionGroup";
import { BoardRow } from "./BoardRow";

interface ForumIndexProps {
  categories: IForumCategory[];
  onBoardClick: (id: string) => void;
}

export function ForumIndex({ categories, onBoardClick }: ForumIndexProps) {
  // 找出所有已在配置中定义了的板块 ID
  const configuredIds = new Set(FORUM_PARTITIONS.flatMap((p) => p.categoryIds));

  // 找出未分类的板块
  const uncategorized = categories.filter((c) => !configuredIds.has(c.id) && c.id !== "all");

  return (
    <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
      {FORUM_PARTITIONS.map((partition) => (
        <PartitionGroup
          key={partition.id}
          partition={partition}
          categories={categories}
          onBoardClick={onBoardClick}
        />
      ))}

      {/* 处理未分类板块 - 作为一个名为“其他”的分区展示 */}
      {uncategorized.length > 0 && (
        <div className="mb-8 overflow-hidden rounded-xl border border-white/10 bg-neutral-900/20 shadow-sm backdrop-blur-sm">
          <div className="flex items-center justify-between border-b border-white/5 bg-neutral-900/80 px-5 py-3">
            <h2 className="text-base font-semibold tracking-wide text-neutral-400 uppercase">
              其他版块
            </h2>
          </div>
          <div className="flex flex-col">
            {uncategorized.map((category) => (
              <BoardRow
                key={category.id}
                category={category}
                onClick={() => onBoardClick(category.id)}
              />
            ))}
          </div>
        </div>
      )}

      {categories.length === 0 && (
        <div className="py-20 text-center text-neutral-500">暂无板块</div>
      )}
    </div>
  );
}
