import { Loader } from "lucide-react";

export function LoadingSpinner() {
  return (
    <div className="flex h-screen w-full items-center justify-center bg-transparent">
      <Loader className="h-8 w-8 animate-spin text-white" />
    </div>
  );
}
