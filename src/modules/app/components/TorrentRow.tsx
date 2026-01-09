import { TorrentCard } from "@/modules/app/pages/TorrentsList/components/TorrentCard";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRef, useState } from "react";
import { Button } from "@/modules/app/components/ui/button";

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

  const scroll = (direction: "left" | "right") => {
    if (rowRef.current) {
      const scrollAmount = rowRef.current.offsetWidth * 0.8;
      const newScrollPosition =
        direction === "left"
          ? rowRef.current.scrollLeft - scrollAmount
          : rowRef.current.scrollLeft + scrollAmount;

      rowRef.current.scrollTo({
        left: newScrollPosition,
        behavior: "smooth",
      });
    }
  };

  const handleScroll = () => {
    if (rowRef.current) {
      setShowLeftArrow(rowRef.current.scrollLeft > 0);
      setShowRightArrow(
        rowRef.current.scrollLeft < rowRef.current.scrollWidth - rowRef.current.offsetWidth - 10,
      );
    }
  };

  return (
    <div className="group/row relative mb-10 px-4 md:px-8">
      <h2 className="mb-4 text-xl text-white md:text-2xl">{title}</h2>

      <div className="relative">
        {showLeftArrow && (
          <Button
            onClick={() => scroll("left")}
            className="absolute top-0 bottom-0 left-0 z-20 flex w-14 items-center justify-center bg-linear-to-r from-[#0F171E] to-transparent opacity-0 transition-opacity group-hover/row:opacity-100 hover:from-black/80"
          >
            <ChevronLeft className="h-8 w-8 text-white" />
          </Button>
        )}

        <div
          ref={rowRef}
          onScroll={handleScroll}
          className="scrollbar-hide flex gap-4 overflow-x-scroll scroll-smooth"
        >
          {torrents.map((torrent) => (
            <div
              key={torrent.id}
              className="w-[40%] flex-none sm:w-[28%] md:w-[20%] lg:w-[16%] xl:w-[13%]"
            >
              <TorrentCard {...torrent} />
            </div>
          ))}
        </div>

        {showRightArrow && (
          <Button
            onClick={() => scroll("right")}
            className="absolute top-0 right-0 bottom-0 z-20 flex w-14 items-center justify-center bg-linear-to-l from-[#0F171E] to-transparent opacity-0 transition-opacity group-hover/row:opacity-100 hover:from-black/80"
          >
            <ChevronRight className="h-8 w-8 text-white" />
          </Button>
        )}
      </div>
    </div>
  );
}
