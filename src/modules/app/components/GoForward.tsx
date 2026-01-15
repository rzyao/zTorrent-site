import { Button } from "@/modules/app/components/ui/button";
import { ChevronRight } from "lucide-react";
import { useNavigationState } from "@/hooks/useNavigationState";

export default function GoForward() {
  const { canGoForward, goForward } = useNavigationState();

  return (
    <div className="group relative flex h-full w-full flex-col items-end" onClick={goForward}>
      <div className="h-1/3"></div>
      {/* 前进按钮 */}
      <Button
        variant="outline"
        disabled={!canGoForward}
        className="mr-3 border border-gray-700/50 bg-black/20 px-3 py-2 text-gray-300 backdrop-blur-sm group-hover:border-amber-400/70 group-hover:text-amber-400 disabled:cursor-not-allowed disabled:opacity-40 disabled:group-hover:border-gray-700/50 disabled:group-hover:text-gray-300"
        title="前进"
      >
        <ChevronRight className="h-5 w-5" />
      </Button>
    </div>
  );
}
