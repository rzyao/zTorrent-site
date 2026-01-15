import { useState, useRef, useEffect } from "react";
import { X } from "lucide-react";
import { ImageWithFallback } from "@/modules/app/components/figma/ImageWithFallback";

interface TorrentStillsProps {
  stills: string[];
}

export function TorrentStills({ stills }: TorrentStillsProps) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const preloadRefs = useRef<HTMLImageElement[]>([]);
  const imgRefs = useRef<(HTMLImageElement | null)[]>([]);

  useEffect(() => {
    if (!Array.isArray(stills) || stills.length === 0) return;
    const arr: HTMLImageElement[] = [];
    for (const url of stills) {
      const img = new Image();
      (img as any).referrerPolicy = "no-referrer";
      img.src = url;
      if (typeof (img as any).decode === "function") {
        (img as any).decode().catch(() => {});
      }
      arr.push(img);
    }
    preloadRefs.current = arr;
  }, [stills]);

  if (!Array.isArray(stills) || stills.length === 0) return null;

  return (
    <>
      <div className="overflow-hidden rounded-xl border border-neutral-700/50 bg-neutral-800/40">
        <div className="border-b border-neutral-700/50 px-5 py-4">
          <h2 className="text-white">剧照</h2>
        </div>
        <div className="p-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {stills.map((url, index) => {
              const isActive = lightboxOpen && lightboxIndex === index;
              return (
                <div
                  key={index}
                  className={
                    isActive
                      ? "fixed top-1/2 left-1/2 z-1000 h-full w-full -translate-x-1/2 -translate-y-1/2"
                      : "group relative aspect-video cursor-pointer overflow-hidden rounded-lg"
                  }
                  onClick={() => {
                    const i = preloadRefs.current[index];
                    if (i && typeof (i as any).decode === "function") {
                      (i as any).decode().catch(() => {});
                    }
                    setLightboxIndex(index);
                    setLightboxOpen(true);
                  }}
                >
                  <ImageWithFallback
                    src={url}
                    alt={`剧照 ${index + 1}`}
                    ref={(el) => {
                      imgRefs.current[index] = el;
                    }}
                    className={
                      isActive
                        ? "h-full w-full object-contain"
                        : "h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                    }
                  />
                  {isActive && (
                    <button
                      className="absolute top-4 right-4 flex h-6 w-6 items-center justify-center rounded-md border border-gray-600 bg-gray-900/70 text-white hover:bg-gray-800"
                      onClick={(e) => {
                        e.stopPropagation();
                        setLightboxOpen(false);
                      }}
                    >
                      <X className="h-5 w-5" />
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
      {lightboxOpen && (
        <div className="fixed inset-0 z-900 bg-black/95" onClick={() => setLightboxOpen(false)} />
      )}
    </>
  );
}
