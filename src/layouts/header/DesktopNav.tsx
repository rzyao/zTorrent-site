import { useNavigation } from "@/hooks/useNavigation";
import { DesktopNavItem } from "./components/DesktopNavItem";
import { useAccess } from "@/context/AccessContext";
import { canAccess } from "@/utils/access";

export function DesktopNav() {
  const { desktop, isLoading } = useNavigation();
  const { access, loading: accessLoading } = useAccess();

  // Combined loading state
  const loading = isLoading || accessLoading;

  // Filter items based on permissions
  // Note: Once backend is fully ready, the API should return only allowed items,
  // making this client-side filtering redundant but safe.
  const visibleItems = desktop.filter((item) => {
    if (!item.isVisible) return false;
    // If no roles required, always show
    if (!item.requiredRoles || item.requiredRoles.length === 0) return true;

    // If roles required but access is loading, hide (or could show skeleton placeholder logic specifically)
    if (accessLoading) return false;

    // Check permissions
    return canAccess(access, { requiredRoles: item.requiredRoles, combine: "OR" });
  });

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
