import { Button } from "@/modules/app/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { useNavigationState } from "@/hooks/useNavigationState";

export default function GoBack() {
  const { canGoBack, goBack } = useNavigationState();

  return (
    <div className="group relative h-full w-full" onClick={goBack}>
      <div className="h-1/3"></div>
      {/* 后退按钮 */}
      <Button
        variant="outline"
        disabled={!canGoBack}
        className="ml-3 border border-gray-700/50 bg-black/20 px-3 py-2 text-gray-300 backdrop-blur-sm group-hover:border-amber-400/70 group-hover:text-amber-400 disabled:cursor-not-allowed disabled:opacity-40 disabled:group-hover:border-gray-700/50 disabled:group-hover:text-gray-300"
        title="后退"
      >
        <ChevronLeft className="h-5 w-5" />
      </Button>
    </div>
  );
}
