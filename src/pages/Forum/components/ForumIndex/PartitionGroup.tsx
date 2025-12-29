import { IForumCategory } from "../../types";
import { IForumPartition } from "../../constants";
import { BoardRow } from "./BoardRow";

interface PartitionGroupProps {
  partition: IForumPartition;
  categories: IForumCategory[];
  onBoardClick: (id: string) => void;
}

export function PartitionGroup({ partition, categories, onBoardClick }: PartitionGroupProps) {
  // 筛选属于当前分区的板块
  const partitionBoards = categories.filter((c) => partition.categoryIds.includes(c.id));

  if (partitionBoards.length === 0) return null;

  return (
    <div className="mb-8 overflow-hidden rounded-xl border border-white/10 bg-neutral-900/20 shadow-sm backdrop-blur-sm">
      {/* Partition Header */}
      <div className="flex items-center justify-between border-b border-white/5 bg-neutral-900/80 px-5 py-3">
        <h2 className="text-base font-semibold tracking-wide text-amber-500 uppercase">
          {partition.title}
        </h2>
        {partition.description && (
          <span className="hidden text-xs text-neutral-500 sm:inline-block">
            {partition.description}
          </span>
        )}
      </div>

      {/* Board Rows */}
      <div className="flex flex-col">
        {partitionBoards.map((category) => (
          <BoardRow
            key={category.id}
            category={category}
            onClick={() => onBoardClick(category.id)}
          />
        ))}
      </div>
    </div>
  );
}
