import { Clock, Shield } from "lucide-react";

export function ReviewHeader({
  reviewSwitches,
}: {
  reviewSwitches: {
    movie?: boolean;
    series?: boolean;
    playlist?: boolean;
    torrent?: boolean;
  };
}) {
  return (
    <div className="mb-8">
      <h1 className="mb-2 bg-linear-to-r from-amber-400 to-orange-500 bg-clip-text text-3xl text-transparent">
        审核中心
      </h1>
      <div className="flex items-center gap-3 text-xs">
        <span className="text-neutral-400">审核开关：</span>
        <span
          className={`rounded px-2 py-1 ${reviewSwitches.torrent ? "bg-green-500/20 text-green-400" : "bg-neutral-700/50 text-neutral-300"}`}
        >
          种子 {reviewSwitches.torrent ? "开启" : "关闭"}
        </span>
        <span
          className={`rounded px-2 py-1 ${reviewSwitches.movie ? "bg-green-500/20 text-green-400" : "bg-neutral-700/50 text-neutral-300"}`}
        >
          电影 {reviewSwitches.movie ? "开启" : "关闭"}
        </span>
        <span
          className={`rounded px-2 py-1 ${reviewSwitches.series ? "bg-green-500/20 text-green-400" : "bg-neutral-700/50 text-neutral-300"}`}
        >
          剧集 {reviewSwitches.series ? "开启" : "关闭"}
        </span>
        <span
          className={`rounded px-2 py-1 ${reviewSwitches.playlist ? "bg-green-500/20 text-green-400" : "bg-neutral-700/50 text-neutral-300"}`}
        >
          片单 {reviewSwitches.playlist ? "开启" : "关闭"}
        </span>
      </div>
      <p className="mt-2 text-neutral-400">集中管理影片、片单和种子的审核工作流</p>
      <div className="sr-only">
        <Shield className="h-0 w-0" />
        <Clock className="h-0 w-0" />
      </div>
    </div>
  );
}
