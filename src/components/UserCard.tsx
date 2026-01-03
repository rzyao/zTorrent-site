import { useState } from "react";
import * as Popover from "@radix-ui/react-popover";
import {
  MessageSquare,
  MessagesSquare,
  MapPin,
  Link as LinkIcon,
  ShieldCheck,
  User as UserIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/components/ui/utils";

export interface UserCardData {
  id: string | number;
  username: string;
  avatarUrl: string;
  bannerUrl?: string;
  name?: string;
  bio?: string;
  isAdmin?: boolean;
  isModerator?: boolean;
  location?: string;
  website?: string;
  joinedAt: string;
  lastSeenAt: string;
  readTime: string;
  postCount: number;
  badges?: Array<{
    id: string;
    label: string;
    icon?: React.ReactNode;
    color?: string;
  }>;
}

interface UserCardProps {
  user: UserCardData;
  trigger?: React.ReactNode;
  align?: "center" | "start" | "end";
  side?: "top" | "right" | "bottom" | "left";
  className?: string;
}

export function UserCard({
  user,
  trigger,
  align = "start",
  side = "bottom",
  className,
}: UserCardProps) {
  const [isOpen, setIsOpen] = useState(false);
  const defaultBanner = "";

  return (
    <Popover.Root open={isOpen} onOpenChange={setIsOpen}>
      <Popover.Trigger asChild>
        <div className={cn("cursor-pointer", className)}>
          {trigger || (
            <img
              src={user.avatarUrl}
              alt={user.username}
              className="h-10 w-10 rounded-full border border-gray-700/50 object-cover transition-opacity hover:opacity-90"
            />
          )}
        </div>
      </Popover.Trigger>

      <Popover.Portal>
        <Popover.Content
          className="animate-in fade-in zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out data-[state=closed]:zoom-out-95 z-50 w-[580px] rounded-lg border border-gray-200 bg-white shadow-xl shadow-black/20 dark:border-gray-800 dark:bg-[#1a1a1a] dark:shadow-black/50"
          side={side}
          align={align}
          sideOffset={5}
        >
          <div className="relative p-6 pt-2">
            {/* Avatar & Main Info Row */}
            <div className="flex items-start gap-4">
              {/* Left: Avatar (Pop out) */}
              <div className="relative -mt-15 shrink-0">
                <div className="relative inline-block">
                  <img
                    src={user.avatarUrl}
                    alt={user.username}
                    className="h-32 w-32 rounded-full border-[6px] border-white bg-white object-cover dark:border-[#1a1a1a] dark:bg-[#1a1a1a]"
                  />
                  <span className="absolute right-4 bottom-4 h-5 w-5 rounded-full border-[3px] border-white bg-green-500 dark:border-[#1a1a1a]" />
                </div>
              </div>

              {/* Right: Content Area */}
              <div className="flex min-w-0 flex-1 justify-between pt-1">
                {/* Username & Name */}
                <div>
                  <h2 className="flex items-center gap-2 text-3xl font-bold text-gray-900 dark:text-gray-100">
                    {user.username}
                    {(user.isAdmin || user.isModerator) && (
                      <ShieldCheck className="h-6 w-6 text-gray-900 dark:text-gray-100" />
                    )}
                  </h2>
                  {user.name && (
                    <p className="mt-1 text-lg font-medium text-gray-500 dark:text-gray-400">
                      {user.name}
                    </p>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col gap-2">
                  <Button
                    variant="default"
                    className="w-32 bg-sky-600 font-medium text-white shadow-sm transition-all hover:bg-sky-700 dark:bg-sky-600 dark:hover:bg-sky-700"
                    size="sm"
                  >
                    <MessageSquare className="mr-2 h-4 w-4 fill-current" />
                    私信
                  </Button>
                  <Button
                    variant="default"
                    className="w-32 bg-sky-600 font-medium text-white shadow-sm transition-all hover:bg-sky-700 dark:bg-sky-600 dark:hover:bg-sky-700"
                    size="sm"
                  >
                    <MessagesSquare className="mr-2 h-4 w-4" />
                    聊天
                  </Button>
                </div>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="mt-6">
              <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-gray-600 dark:text-gray-300">
                <div className="flex items-center gap-1">
                  <span className="text-gray-400 dark:text-gray-500">发布时间</span>
                  <span className="font-semibold text-gray-900 dark:text-gray-100">
                    {user.lastSeenAt}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-gray-400 dark:text-gray-500">加入日期</span>
                  <span className="font-semibold text-gray-900 dark:text-gray-100">
                    {user.joinedAt}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-gray-400 dark:text-gray-500">阅读</span>
                  <span className="font-semibold text-gray-900 dark:text-gray-100">
                    {user.readTime}
                  </span>
                </div>
              </div>

              {(user.location || user.website) && (
                <div className="mt-3 flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                  {user.location && (
                    <div className="flex items-center gap-1">
                      <MapPin className="h-3.5 w-3.5" />
                      {user.location}
                    </div>
                  )}
                  {user.website && (
                    <a
                      href={user.website}
                      target="_blank"
                      rel="noreferrer"
                      className="link-hover flex items-center gap-1 hover:text-sky-500"
                    >
                      <LinkIcon className="h-3.5 w-3.5" />
                      网页链接
                    </a>
                  )}
                </div>
              )}
            </div>

            {user.bio && (
              <div className="mt-4 max-w-[90%] text-sm leading-relaxed text-gray-700 dark:text-gray-300">
                {user.bio}
              </div>
            )}

            {user.badges && user.badges.length > 0 && (
              <div className="mt-6 flex flex-wrap gap-2">
                {user.badges.map((badge) => (
                  <div
                    key={badge.id}
                    className={cn(
                      "flex items-center gap-1.5 rounded border border-gray-200 bg-gray-100 px-3 py-1.5 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200 dark:border-gray-800 dark:bg-[#252525] dark:text-gray-300 dark:hover:bg-[#2f2f2f]",
                      badge.color === "bronze" &&
                        "border-amber-700/20 text-amber-700 dark:text-amber-500",
                      badge.color === "silver" &&
                        "border-slate-400/20 text-slate-600 dark:text-slate-400",
                      badge.color === "gold" &&
                        "border-yellow-500/20 text-yellow-600 dark:text-yellow-500",
                    )}
                  >
                    {badge.icon}
                    {badge.label}
                  </div>
                ))}
              </div>
            )}

            <Popover.Arrow className="fill-white dark:fill-[#1a1a1a]" />
          </div>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}
