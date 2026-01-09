import { Button } from "@/modules/app/components/ui/button";
import { ChevronRight } from "lucide-react";
import { useNavigationState } from "@/hooks/useNavigationState";

export default function GoForward() {
  const { canGoForward, goForward } = useNavigationState();

  return (
    <div
      className="group fixed top-16 right-0 bottom-0 z-50"
      onClick={goForward}
    >
      <div className="h-1/3"></div>
      {/* 前进按钮 */}
      <Button
        disabled={!canGoForward}
        className="px-3 py-2 mr-3 border border-gray-700/50 text-gray-300 group-hover:text-amber-400 group-hover:border-amber-400/70 disabled:opacity-40 disabled:cursor-not-allowed disabled:group-hover:text-gray-300 disabled:group-hover:border-gray-700/50"
        title="前进"
      >
        <ChevronRight className="w-5 h-5" />
      </Button>
    </div>
  );
}
