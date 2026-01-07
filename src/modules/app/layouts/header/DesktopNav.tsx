import { useRouteNavigation } from "@/hooks/useRouteNavigation";
import { DesktopNavItem } from "./components/DesktopNavItem";

export function DesktopNav() {
  const { desktop, isLoading } = useRouteNavigation();

  // 直接使用已过滤的导航项
  const visibleItems = desktop;

  return (
    <nav className="hidden items-center gap-6 md:flex">
      {visibleItems.map((item) => (
        <DesktopNavItem key={item.id} item={item} />
      ))}

      {/* Skeleton / Loading Indicator for protected items */}
      {isLoading && (
        <div className="flex items-center gap-6">
          <div className="h-5 w-16 animate-pulse rounded bg-white/10" />
          <div className="h-5 w-16 animate-pulse rounded bg-white/10" />
        </div>
      )}
    </nav>
  );
}
