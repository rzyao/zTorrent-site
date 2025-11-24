import { useState } from 'react';
import { ChevronDown, ChevronUp, Folder, File } from 'lucide-react';
import { FileItem } from '../types';

interface FileListItemProps {
  item: FileItem;
  depth?: number;
}

export const FileListItem = ({ item, depth = 0 }: FileListItemProps) => {
  const [isOpen, setIsOpen] = useState(false);

  if (item.type === 'folder') {
    return (
      <>
        <div
          className="flex items-center gap-2 py-2 px-3 hover:bg-gray-800 cursor-pointer"
          style={{ paddingLeft: `${depth * 20 + 12}px` }}
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <ChevronDown className="w-4 h-4 text-gray-400" /> : <ChevronUp className="w-4 h-4 text-gray-400" />}
          <Folder className="w-4 h-4 text-[#00A8E1]" />
          <span className="text-white">{item.name}</span>
        </div>
        {isOpen && item.children?.map((child: FileItem, index: number) => (
          <FileListItem key={index} item={child} depth={depth + 1} />
        ))}
      </>
    );
  }

  return (
    <div
      className="flex items-center justify-between py-2 px-3 hover:bg-gray-800"
      style={{ paddingLeft: `${depth * 20 + 12}px` }}
    >
      <div className="flex items-center gap-2">
        <File className="w-4 h-4 text-gray-400" />
        <span className="text-white">{item.name}</span>
      </div>
      <span className="text-gray-400 text-sm">{item.size}</span>
    </div>
  );
};