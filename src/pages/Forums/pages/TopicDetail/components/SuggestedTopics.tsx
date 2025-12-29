import { categoryColors, suggestedTopics } from "../constants";

interface SuggestedTopicsProps {
  theme: string;
}

export const SuggestedTopics = ({ theme }: SuggestedTopicsProps) => {
  return (
    <div className="mt-10">
      <h3 className={`mb-3 text-[19px] font-bold text-[#DDDDDD] dark:text-neutral-100`}>
        Suggested Topics
      </h3>
      <div className="overflow-hidden">
        <div
          className={`grid grid-cols-[auto_1fr_auto_auto_auto] gap-x-4 py-2 text-[15px] font-medium text-[#919191] dark:border-neutral-700`}
        >
          <div className="w-8"></div> {/* Avatar Spacer */}
          <div className="pl-2">Topic</div>
          <div className="w-16 text-center">Replies</div>
          <div className="w-16 text-center">Views</div>
          <div className="w-16 text-center">Activity</div>
        </div>
        {suggestedTopics.map((topic, index) => (
          <div
            key={index}
            className={`grid grid-cols-[auto_1fr_auto_auto_auto] items-center gap-x-4 border-b border-[#e9e9e9] py-3 text-sm transition-colors dark:border-neutral-700 ${theme === "dark" ? "hover:bg-white/5" : "hover:bg-[#f9f9f9]"} cursor-pointer`}
          >
            {/* Posters Column */}
            <div className="flex w-8 justify-center">
              {topic.posters && topic.posters[0] && (
                <img src={topic.posters[0]} alt="poster" className="h-6 w-6 rounded-full" />
              )}
            </div>
            <div className="min-w-0 pl-2">
              <div
                className={`truncate font-medium text-[#222] hover:underline dark:text-neutral-200`}
              >
                {topic.title}
              </div>
              <div className="mt-1 flex items-center gap-1">
                {/* Replaced Badge Style */}
                <span className="flex items-center gap-1">
                  <span
                    className="h-[9px] w-[9px]"
                    style={{ backgroundColor: categoryColors[topic.category] || "#999" }}
                  ></span>
                  <span className="text-[13px] font-bold text-[#919191]">{topic.category}</span>
                </span>
                {topic.tags &&
                  topic.tags.map((t) => (
                    <span key={t} className="ml-1 flex items-center text-[11px] text-[#919191]">
                      <span className="mr-0.5 inline-block h-1 w-1 rounded-full bg-[#919191]"></span>
                      {t}
                    </span>
                  ))}
              </div>
            </div>
            <div className={`w-16 text-center text-[#919191]`}>{topic.replies}</div>
            <div className={`w-16 text-center text-[#919191]`}>{topic.views}</div>
            <div className={`w-16 text-center text-[#919191]`}>{topic.activity}</div>
          </div>
        ))}
      </div>
    </div>
  );
};
