import { useState, useMemo } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/modules/forum/components/ui/popover";
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
  // New Additions
  Terminal,
  Cpu,
  Database,
  Server,
  Cloud,
  Laptop,
  Smartphone,
  Tablet,
  Monitor,
  Wifi,
  Radio,
  Tv,
  Camera,
  Video,
  Mic,
  Speaker,
  Headphones,
  Battery,
  Plug,
  Sun,
  Moon,
  CloudRain,
  Snowflake,
  Flame,
  Droplets,
  Wind,
  Flower2,
  Leaf,
  Trees,
  Mountain,
  MapPin,
  Navigation,
  Compass,
  Rocket,
  Plane,
  Car,
  Bike,
  Train,
  Ship,
  Anchor,
  ShoppingBag,
  ShoppingCart,
  CreditCard,
  Banknote,
  Wallet,
  Coins,
  Receipt,
  Gift,
  Trophy,
  Medal,
  Crown,
  Flag,
  Target,
  Swords,
  ShieldAlert,
  ShieldCheck,
  Award,
  ThumbsUp,
  ThumbsDown,
  Smile,
  Frown,
  Meh,
  Ghost,
  Skull,
  Puzzle,
  Dice1, // Dice 1-6 are usually just Dice in libraries, let's check lucide. Lucide has Dices or Dice1-6. Sticky to generic names if possible. Use Dice5.
  Dice5,
  Joystick,
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
  // Tech & Dev
  { name: "terminal", icon: Terminal },
  { name: "cpu", icon: Cpu },
  { name: "database", icon: Database },
  { name: "server", icon: Server },
  { name: "cloud", icon: Cloud },
  { name: "laptop", icon: Laptop },
  { name: "smartphone", icon: Smartphone },
  { name: "tablet", icon: Tablet },
  { name: "monitor", icon: Monitor },
  { name: "wifi", icon: Wifi },
  // Media & Devices
  { name: "radio", icon: Radio },
  { name: "tv", icon: Tv },
  { name: "camera", icon: Camera },
  { name: "video", icon: Video },
  { name: "mic", icon: Mic },
  { name: "speaker", icon: Speaker },
  { name: "headphones", icon: Headphones },
  { name: "battery", icon: Battery },
  { name: "plug", icon: Plug },
  // Nature & Weather
  { name: "sun", icon: Sun },
  { name: "moon", icon: Moon },
  { name: "cloud-rain", icon: CloudRain },
  { name: "snowflake", icon: Snowflake },
  { name: "flame", icon: Flame },
  { name: "droplets", icon: Droplets },
  { name: "wind", icon: Wind },
  { name: "flower-2", icon: Flower2 },
  { name: "leaf", icon: Leaf },
  { name: "trees", icon: Trees },
  { name: "mountain", icon: Mountain },
  // Travel & Maps
  { name: "map-pin", icon: MapPin },
  { name: "navigation", icon: Navigation },
  { name: "compass", icon: Compass },
  { name: "rocket", icon: Rocket },
  { name: "plane", icon: Plane },
  { name: "car", icon: Car },
  { name: "bike", icon: Bike },
  { name: "train", icon: Train },
  { name: "ship", icon: Ship },
  { name: "anchor", icon: Anchor },
  // Commerce
  { name: "shopping-bag", icon: ShoppingBag },
  { name: "shopping-cart", icon: ShoppingCart },
  { name: "credit-card", icon: CreditCard },
  { name: "banknote", icon: Banknote },
  { name: "wallet", icon: Wallet },
  { name: "coins", icon: Coins },
  { name: "receipt", icon: Receipt },
  { name: "gift", icon: Gift },
  // Awards & Gaming
  { name: "trophy", icon: Trophy },
  { name: "medal", icon: Medal },
  { name: "crown", icon: Crown },
  { name: "flag", icon: Flag },
  { name: "target", icon: Target },
  { name: "swords", icon: Swords },
  { name: "shield-alert", icon: ShieldAlert },
  { name: "shield-check", icon: ShieldCheck },
  { name: "award", icon: Award },
  // Social & Mood
  { name: "thumbs-up", icon: ThumbsUp },
  { name: "thumbs-down", icon: ThumbsDown },
  { name: "smile", icon: Smile },
  { name: "frown", icon: Frown },
  { name: "meh", icon: Meh },
  { name: "ghost", icon: Ghost },
  { name: "skull", icon: Skull },
  { name: "puzzle", icon: Puzzle },
  { name: "dice-5", icon: Dice5 },
  { name: "joystick", icon: Joystick },
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
            "border-gray-300 bg-white hover:border-gray-400",
            "dark:border-neutral-700 dark:bg-neutral-800 dark:hover:border-neutral-600",
            "focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 focus:outline-none dark:focus:border-amber-500 dark:focus:ring-amber-500/50",
            className,
          )}
        >
          {/* 图标预览 */}
          <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded bg-gray-100 dark:bg-neutral-700">
            {SelectedIcon ? (
              <SelectedIcon className="h-4 w-4 text-gray-700 dark:text-neutral-200" />
            ) : (
              <span className="text-xs text-gray-400 dark:text-neutral-500">--</span>
            )}
          </div>
          {/* 图标名称 */}
          <span className="text-sm text-gray-700 dark:text-neutral-300">
            {value || "选择图标..."}
          </span>
        </button>
      </PopoverTrigger>

      <PopoverContent
        className="w-72 border-gray-200 bg-white p-3 shadow-lg dark:border-neutral-700 dark:bg-neutral-900"
        align="start"
      >
        {/* 搜索框 */}
        <div className="mb-3">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="搜索图标..."
            className="h-9 w-full rounded-md border border-gray-300 bg-white px-3 text-sm text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-200 dark:placeholder-neutral-500 dark:focus:border-amber-500"
          />
        </div>

        {/* 清除按钮 */}
        {value && (
          <button
            type="button"
            onClick={handleClear}
            className="mb-3 w-full rounded-md border border-gray-200 bg-gray-50 px-3 py-1.5 text-xs text-gray-500 transition-colors hover:border-gray-300 hover:text-gray-900 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-400 dark:hover:border-neutral-600 dark:hover:text-neutral-200"
          >
            清除图标
          </button>
        )}

        {/* 图标网格 */}
        <div className="max-h-48 overflow-x-hidden overflow-y-auto [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-gray-200 dark:[&::-webkit-scrollbar-thumb]:bg-neutral-700 [&::-webkit-scrollbar-track]:bg-transparent dark:[&::-webkit-scrollbar-track]:bg-transparent">
          <div className="grid grid-cols-6 gap-1.5 p-1">
            {filteredIcons.map(({ name, icon: Icon }) => (
              <button
                key={name}
                type="button"
                onClick={() => handleIconClick(name)}
                className={cn(
                  "flex h-9 w-9 items-center justify-center rounded-md transition-all hover:scale-105",
                  value === name
                    ? "bg-blue-100 text-blue-600 ring-1 ring-blue-500 dark:bg-amber-500/20 dark:text-amber-400 dark:ring-amber-500"
                    : "bg-gray-50 text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:bg-neutral-800 dark:text-neutral-400 dark:hover:bg-neutral-700 dark:hover:text-neutral-200",
                )}
                title={name}
              >
                <Icon className="h-4 w-4" />
              </button>
            ))}
          </div>

          {/* 无结果 */}
          {filteredIcons.length === 0 && (
            <div className="py-4 text-center text-sm text-gray-500 dark:text-neutral-500">
              未找到匹配的图标
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
