import { TopicData } from "../types";

interface TopicHeaderProps {
  theme: string;
  topicData?: TopicData;
}

export const TopicHeader = ({ theme, topicData }: TopicHeaderProps) => {
  // 如果没有传入 topicData，显示占位符
  if (!topicData) {
    return (
      <div className="pb-6">
        <div className="mb-3 h-8 w-3/4 animate-pulse rounded bg-neutral-200 dark:bg-neutral-700"></div>
        <div className="flex items-center gap-2">
          <div className="h-4 w-20 animate-pulse rounded bg-neutral-200 dark:bg-neutral-700"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="pb-6">
      <h1
        className={`mb-3 text-[24px] leading-tight font-bold ${theme === "dark" ? "text-[#E9E9E9]" : "text-[#222]"}`}
      >
        {topicData.title}
      </h1>
      <div className="flex flex-wrap items-center gap-2">
        <a href="#" className="group flex items-center gap-1">
          <span className="h-2.5 w-2.5 bg-[#8C837C]"></span>
          <span className="text-sm font-bold text-[#8C837C] uppercase transition-colors group-hover:text-[#222] dark:group-hover:text-[#dadada]">
            {topicData.category}
          </span>
        </a>
        {topicData.tags.map((tag) => (
          <a
            href="#"
            key={tag}
            className="ml-1 text-sm text-[#919191] transition-colors hover:text-[#222] dark:hover:text-[#dadada]"
          >
            {tag}
          </a>
        ))}
      </div>
    </div>
  );
};
