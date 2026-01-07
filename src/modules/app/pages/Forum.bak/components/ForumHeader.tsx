// @ts-nocheck
import { MessageSquare, Plus } from "lucide-react";

export function ForumHeader() {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-linear-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-lg shadow-amber-500/30">
            <MessageSquare className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-white text-2xl">论坛</h1>
            <p className="text-neutral-400 text-sm mt-1">
              交流经验，分享资源，共建和谐社区
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

