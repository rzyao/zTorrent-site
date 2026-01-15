import { useState } from "react";
import { ChevronUp, ChevronDown } from "lucide-react";
import { processDescription } from "../utils/processDescription";

interface TorrentDescriptionProps {
  description: string;
}

export function TorrentDescription({ description }: TorrentDescriptionProps) {
  const [isDescExpanded, setIsDescExpanded] = useState(true);

  return (
    <div className="overflow-hidden rounded-xl border border-neutral-700/50 bg-neutral-800/40">
      <div
        className="flex cursor-pointer items-center justify-between border-b border-neutral-700/50 px-5 py-4"
        onClick={() => setIsDescExpanded(!isDescExpanded)}
      >
        <h2 className="text-white">简介</h2>
        {isDescExpanded ? (
          <ChevronUp className="h-5 w-5 text-gray-400" />
        ) : (
          <ChevronDown className="h-5 w-5 text-gray-400" />
        )}
      </div>
      {isDescExpanded && (
        <div className="p-6">
          {description ? (
            <div
              className="description-content space-y-4 leading-relaxed text-gray-300"
              dangerouslySetInnerHTML={{
                __html: processDescription(description),
              }}
            />
          ) : (
            <div className="space-y-4 leading-relaxed text-gray-300">
              <fieldset className="rounded border-2 border-amber-500/30 bg-amber-500/5 p-4">
                <legend className="px-2 text-amber-400">引用</legend>
                <div className="text-center text-amber-400">
                  <span className="text-xl">暂无简介信息</span>
                </div>
              </fieldset>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
