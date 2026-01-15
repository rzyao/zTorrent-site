import { useState } from "react";
import { ChevronUp, ChevronDown } from "lucide-react";
import { FileItem } from "../types";
import { FileListItem } from "./FileListItem";

interface TorrentFileListProps {
  fileList: FileItem[];
}

export function TorrentFileList({ fileList }: TorrentFileListProps) {
  const [isFilesExpanded, setIsFilesExpanded] = useState(false);

  if (!fileList || fileList.length === 0) return null;

  return (
    <div className="overflow-hidden rounded-xl border border-neutral-700/50 bg-neutral-800/40">
      <div
        className="flex cursor-pointer items-center justify-between border-b border-neutral-700/50 px-5 py-4"
        onClick={() => setIsFilesExpanded(!isFilesExpanded)}
      >
        <h2 className="text-white">文件列表</h2>
        {isFilesExpanded ? (
          <ChevronUp className="h-5 w-5 text-gray-400" />
        ) : (
          <ChevronDown className="h-5 w-5 text-gray-400" />
        )}
      </div>
      {isFilesExpanded && (
        <div className="max-h-[500px] divide-y divide-gray-800 overflow-y-auto">
          {fileList.map((item, index) => (
            <FileListItem key={index} item={item} />
          ))}
        </div>
      )}
    </div>
  );
}
