import { useState } from "react";
import { ChevronUp, ChevronDown } from "lucide-react";

interface TorrentMediaInfoProps {
  mediaInfo: string;
}

export function TorrentMediaInfo({ mediaInfo }: TorrentMediaInfoProps) {
  const [isMediaInfoExpanded, setIsMediaInfoExpanded] = useState(false);

  if (!mediaInfo) return null;

  return (
    <div className="overflow-hidden rounded-xl border border-neutral-700/50 bg-neutral-800/40">
      <div
        className="flex cursor-pointer items-center justify-between border-b border-neutral-700/50 px-5 py-4"
        onClick={() => setIsMediaInfoExpanded(!isMediaInfoExpanded)}
      >
        <h2 className="text-white">MediaInfo</h2>
        {isMediaInfoExpanded ? (
          <ChevronUp className="h-5 w-5 text-gray-400" />
        ) : (
          <ChevronDown className="h-5 w-5 text-gray-400" />
        )}
      </div>
      {isMediaInfoExpanded && (
        <div className="p-4">
          <pre className="overflow-x-auto rounded bg-gray-950 p-4 font-mono text-xs text-gray-300">
            {mediaInfo}
          </pre>
        </div>
      )}
    </div>
  );
}
