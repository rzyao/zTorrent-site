import { useState, useMemo } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/modules/app/components/ui/popover";
import { cn } from "@/utils/cn";
import {
  Home,
  MessageSquare,
  Users,
  Settings,
  HelpCircle,
  BookOpen,
  Megaphone,
  Code,
  Gamepad2,
  Film,
  Music,
  Image,
  Palette,
  Briefcase,
  GraduationCap,
  Heart,
  Star,
  Zap,
  Globe,
  Shield,
  Lock,
  Bell,
  Calendar,
  Clock,
  Search,
  Bookmark,
  Tag,
  Folder,
  FileText,
  Download,
  Upload,
  Link,
  Share2,
  type LucideIcon,
} from "lucide-react";

// 常用图标列表
const ICON_LIST: { name: string; icon: LucideIcon }[] = [
  { name: "home", icon: Home },
  { name: "message-square", icon: MessageSquare },
  { name: "users", icon: Users },
  { name: "settings", icon: Settings },
  { name: "help-circle", icon: HelpCircle },
  { name: "book-open", icon: BookOpen },
  { name: "megaphone", icon: Megaphone },
  { name: "code", icon: Code },
  { name: "gamepad-2", icon: Gamepad2 },
  { name: "film", icon: Film },
  { name: "music", icon: Music },
  { name: "image", icon: Image },
  { name: "palette", icon: Palette },
  { name: "briefcase", icon: Briefcase },
  { name: "graduation-cap", icon: GraduationCap },
  { name: "heart", icon: Heart },
  { name: "star", icon: Star },
  { name: "zap", icon: Zap },
  { name: "globe", icon: Globe },
  { name: "shield", icon: Shield },
  { name: "lock", icon: Lock },
  { name: "bell", icon: Bell },
  { name: "calendar", icon: Calendar },
  { name: "clock", icon: Clock },
  { name: "search", icon: Search },
  { name: "bookmark", icon: Bookmark },
  { name: "tag", icon: Tag },
  { name: "folder", icon: Folder },
  { name: "file-text", icon: FileText },
  { name: "download", icon: Download },
  { name: "upload", icon: Upload },
  { name: "link", icon: Link },
  { name: "share-2", icon: Share2 },
];

// 根据名称获取图标组件
export function getIconByName(name: string): LucideIcon | null {
  const found = ICON_LIST.find((item) => item.name === name);
  return found?.icon || null;
}

interface IconPickerProps {
  value: string;
  onChange: (iconName: string) => void;
  className?: string;
}

/**
 * 图标选择器组件
 * 显示常用 Lucide 图标供选择
 */
export function IconPicker({ value, onChange, className }: IconPickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // 过滤图标
  const filteredIcons = useMemo(() => {
    if (!searchQuery.trim()) return ICON_LIST;
    const query = searchQuery.toLowerCase();
    return ICON_LIST.filter((item) => item.name.includes(query));
  }, [searchQuery]);

  // 当前选中的图标
  const SelectedIcon = getIconByName(value);

  const handleIconClick = (iconName: string) => {
    onChange(iconName);
    setIsOpen(false);
  };

  const handleClear = () => {
    onChange("");
    setIsOpen(false);
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          className={cn(
            "flex h-10 w-full items-center gap-3 rounded-lg border px-3 transition-colors",
            "border-neutral-700 bg-neutral-800 hover:border-neutral-600",
            "focus:ring-2 focus:ring-amber-500/50 focus:outline-none",
            className,
          )}
        >
          {/* 图标预览 */}
          <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded bg-neutral-700">
            {SelectedIcon ? (
              <SelectedIcon className="h-4 w-4 text-neutral-200" />
            ) : (
              <span className="text-xs text-neutral-500">--</span>
            )}
          </div>
          {/* 图标名称 */}
          <span className="text-sm text-neutral-300">{value || "选择图标..."}</span>
        </button>
      </PopoverTrigger>

      <PopoverContent className="w-72 border-neutral-700 bg-neutral-900 p-3" align="start">
        {/* 搜索框 */}
        <div className="mb-3">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="搜索图标..."
            className="h-9 w-full rounded-md border border-neutral-700 bg-neutral-800 px-3 text-sm text-neutral-200 placeholder-neutral-500 focus:border-amber-500 focus:outline-none"
          />
        </div>

        {/* 清除按钮 */}
        {value && (
          <button
            type="button"
            onClick={handleClear}
            className="mb-3 w-full rounded-md border border-neutral-700 bg-neutral-800 px-3 py-1.5 text-xs text-neutral-400 transition-colors hover:border-neutral-600 hover:text-neutral-200"
          >
            清除图标
          </button>
        )}

        {/* 图标网格 */}
        <div className="max-h-48 overflow-y-auto">
          <div className="grid grid-cols-6 gap-1.5">
            {filteredIcons.map(({ name, icon: Icon }) => (
              <button
                key={name}
                type="button"
                onClick={() => handleIconClick(name)}
                className={cn(
                  "flex h-9 w-9 items-center justify-center rounded-md transition-all hover:scale-105",
                  value === name
                    ? "bg-amber-500/20 text-amber-400 ring-1 ring-amber-500"
                    : "bg-neutral-800 text-neutral-400 hover:bg-neutral-700 hover:text-neutral-200",
                )}
                title={name}
              >
                <Icon className="h-4 w-4" />
              </button>
            ))}
          </div>

          {/* 无结果 */}
          {filteredIcons.length === 0 && (
            <div className="py-4 text-center text-sm text-neutral-500">未找到匹配的图标</div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
