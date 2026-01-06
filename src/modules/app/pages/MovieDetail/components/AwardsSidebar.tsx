import { Badge } from "@/components/ui/badge";
import { Award, Star } from "lucide-react";
import type { AwardItem } from "../types";

/**
 * AwardsSidebar 组件
 * - 右侧获奖情况展示
 */
export function AwardsSidebar({ awards }: { awards: AwardItem[] }) {
  if (!awards || awards.length === 0) return null;
  return (
    <div className="lg:col-span-1">
      <h2 className="mb-4 flex items-center gap-2 text-2xl text-white">
        <Award className="h-6 w-6 text-amber-400" />
        获奖情况
      </h2>
      <div className="card rounded-lg p-2">
        <div className="space-y-4">
          {awards.map((award, index) => (
            <div
              key={index}
              className="flex items-start gap-3 border-b border-neutral-700/50 py-1 last:border-0"
            >
              <div
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${award.won ? "bg-amber-500/20" : "bg-neutral-800"}`}
              >
                {award.won ? (
                  <Award className="h-4 w-4 text-amber-400" />
                ) : (
                  <Star className="h-4 w-4 text-neutral-500" />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <div className="mb-1 flex flex-wrap items-center gap-2">
                  <h3 className="text-sm text-white">{award.name}</h3>
                  <Badge
                    className={
                      award.won
                        ? "bg-amber-500 text-xs text-white"
                        : "bg-neutral-700 text-xs text-neutral-300"
                    }
                  >
                    {award.won ? "获奖" : "提名"}
                  </Badge>
                  <span className="text-xs text-neutral-500">{award.year}</span>
                </div>
                <p className="mb-1 text-xs text-neutral-400">{award.category}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
