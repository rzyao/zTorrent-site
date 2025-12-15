import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useCategories } from "@/hooks/useCategories";
import { Skeleton } from "@/components/ui/skeleton";

interface CategoryNavProps {
  active?: string; // Legacy: match by label
  activeKey?: string; // New: match by slug/key
  onSelect?: (category: string) => void;
  inline?: boolean;
  items?: Array<{ label: string; slug: string; sort?: number }>;
}

export function CategoryNav({
  active,
  activeKey,
  onSelect,
  inline = false,
  items,
}: CategoryNavProps) {
  const navigate = useNavigate();
  const { categories, isLoading } = useCategories();

  // 优先使用传入的 items，否则使用 hook 数据
  const list = Array.isArray(items) && items.length > 0 ? items : categories;

  const handleSelect = (c: any) => {
    if (onSelect) {
      onSelect(c.label);
    } else {
      // 默认路由跳转行为
      if (c.slug === "home" || !c.slug) navigate("/home");
      else navigate(`/home/${c.slug}`);
    }
  };

  const isActive = (c: any) => {
    if (activeKey) return c.slug === activeKey || c.key === activeKey;
    return c.label === active;
  };

  if (isLoading && !list.length) {
    return (
      <div
        className={`${
          inline
            ? ""
            : "sticky top-0 bg-[#0F171E] py-4 px-4 md:px-8 z-40 border-b border-gray-800"
        }`}
      >
        <div className="flex gap-4 overflow-x-auto scrollbar-hide">
          {[1, 2, 3, 4, 5].map((i) => (
            <Skeleton key={i} className="h-10 w-20 rounded-full bg-gray-800" />
          ))}
        </div>
      </div>
    );
  }

  const content = (
    <div className="flex gap-4 overflow-x-auto scrollbar-hide">
      {list.map((c) => (
        <Button
          key={c.label}
          className={`px-4 py-2 rounded-full whitespace-nowrap transition-colors ${
            isActive(c)
              ? "bg-white text-black"
              : "bg-gray-800 text-white hover:bg-gray-700"
          }`}
          onClick={() => handleSelect(c)}
        >
          {c.label}
        </Button>
      ))}
    </div>
  );

  if (inline) {
    return (
      <div className="flex items-center gap-4 overflow-x-auto scrollbar-hide">
        {content}
      </div>
    );
  }

  return (
    <div className="sticky top-0 bg-[#0F171E] py-4 px-4 md:px-8 z-40 border-b border-gray-800">
      {content}
    </div>
  );
}
