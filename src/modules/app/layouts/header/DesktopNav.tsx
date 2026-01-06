import { useNavigation } from "@/hooks/useNavigation";
import { DesktopNavItem } from "./components/DesktopNavItem";
import { useAccess } from "@/context/AccessContext";
import { filterNavigationTree } from "@/utils/navigation";

export function DesktopNav() {
  const { desktop, isLoading } = useNavigation();
  const { access, loading: accessLoading } = useAccess();

  // Combined loading state
  const loading = isLoading || accessLoading;

  // Filter items using recursive utility
  const visibleItems = filterNavigationTree(desktop, access, loading);

  return (
    <nav className="hidden items-center gap-6 md:flex">
      {visibleItems.map((item) => (
        <DesktopNavItem key={item.id} item={item} />
      ))}

      {/* Skeleton / Loading Indicator for protected items */}
      {loading && (
        <div className="flex items-center gap-6">
          <div className="h-5 w-16 animate-pulse rounded bg-white/10" />
          <div className="h-5 w-16 animate-pulse rounded bg-white/10" />
        </div>
      )}
    </nav>
  );
}
