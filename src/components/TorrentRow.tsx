import { TorrentCard } from './TorrentCard';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useRef, useState } from 'react';

interface Torrent {
  id: number;
  thumbnail: string;
  title: string;
  category: string;
  size: string;
  seeders: number;
  leechers: number;
  isFree?: boolean;
  isVip?: boolean;
  isHot?: boolean;
  rating?: number;
  comments?: number;
}

interface TorrentRowProps {
  title: string;
  torrents: Torrent[];
}

export function TorrentRow({ title, torrents }: TorrentRowProps) {
  const rowRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);

  const scroll = (direction: 'left' | 'right') => {
    if (rowRef.current) {
      const scrollAmount = rowRef.current.offsetWidth * 0.8;
      const newScrollPosition =
        direction === 'left'
          ? rowRef.current.scrollLeft - scrollAmount
          : rowRef.current.scrollLeft + scrollAmount;

      rowRef.current.scrollTo({
        left: newScrollPosition,
        behavior: 'smooth',
      });
    }
  };

  const handleScroll = () => {
    if (rowRef.current) {
      setShowLeftArrow(rowRef.current.scrollLeft > 0);
      setShowRightArrow(
        rowRef.current.scrollLeft <
          rowRef.current.scrollWidth - rowRef.current.offsetWidth - 10
      );
    }
  };

  return (
    <div className="group/row relative px-4 md:px-8 mb-10">
      <h2 className="text-white text-xl md:text-2xl mb-4">{title}</h2>
      
      <div className="relative">
        {showLeftArrow && (
          <button
            onClick={() => scroll('left')}
            className="absolute left-0 top-0 bottom-0 z-20 w-14 bg-gradient-to-r from-[#0F171E] to-transparent hover:from-black/80 flex items-center justify-center opacity-0 group-hover/row:opacity-100 transition-opacity"
          >
            <ChevronLeft className="w-8 h-8 text-white" />
          </button>
        )}

        <div
          ref={rowRef}
          onScroll={handleScroll}
          className="flex gap-4 overflow-x-scroll scrollbar-hide scroll-smooth"
        >
          {torrents.map((torrent) => (
            <div key={torrent.id} className="flex-none w-[40%] sm:w-[28%] md:w-[20%] lg:w-[16%] xl:w-[13%]">
              <TorrentCard {...torrent} />
            </div>
          ))}
        </div>

        {showRightArrow && (
          <button
            onClick={() => scroll('right')}
            className="absolute right-0 top-0 bottom-0 z-20 w-14 bg-gradient-to-l from-[#0F171E] to-transparent hover:from-black/80 flex items-center justify-center opacity-0 group-hover/row:opacity-100 transition-opacity"
          >
            <ChevronRight className="w-8 h-8 text-white" />
          </button>
        )}
      </div>
    </div>
  );
}
