import { NavLink } from "react-router-dom";
import { useNavigation } from "@/hooks/useNavigation";
import { useAccess } from "@/context/AccessContext";
import { canAccess } from "@/utils/access";

interface MobileNavProps {
  onClose: () => void;
}

export function MobileNav({ onClose }: MobileNavProps) {
  const { mobile, isLoading } = useNavigation();
  const { access, loading: accessLoading } = useAccess();

  // Filter items based on permissions
  const visibleItems = mobile.filter((item) => {
    if (!item.isVisible) return false;

    // If no roles required, always show
    if (!item.requiredRoles || item.requiredRoles.length === 0) return true;

    // If roles required but access is loading, hide
    if (accessLoading) return false;

    // Check permissions
    return canAccess(access, { requiredRoles: item.requiredRoles, combine: "OR" });
  });

  if (isLoading) {
    return (
      <div className="flex flex-col space-y-4 px-4 py-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-10 w-full animate-pulse rounded-lg bg-white/5" />
        ))}
      </div>
    );
  }

  return (
    <nav className="flex max-h-[calc(80vh-32px)] flex-col space-y-1 overflow-y-auto px-4 py-4">
      {visibleItems.map((item) => (
        <NavLink
          key={item.id}
          to={item.path}
          target={item.target}
          className="rounded-lg px-4 py-3 text-white transition-colors hover:bg-white/10"
          onClick={onClose}
        >
          {item.label}
        </NavLink>
      ))}
    </nav>
  );
}
