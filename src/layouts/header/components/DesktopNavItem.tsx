import { useRef, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { ChevronDown } from "lucide-react";
import { NavigationItem } from "@/types/navigation";

interface DesktopNavItemProps {
  item: NavigationItem;
}

export function DesktopNavItem({ item }: DesktopNavItemProps) {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const timeoutRef = useRef<number | null>(null);

  if (!item.isVisible) return null;

  const hasChildren = item.children && item.children.length > 0;

  // Check if current path matches item or any of its children
  const isActive =
    location.pathname === item.path ||
    (hasChildren && item.children?.some((child) => location.pathname === child.path));

  // Shared styles
  const linkClass = (active: boolean) =>
    active
      ? "text-amber-400 transition-colors flex items-center gap-1"
      : "text-white transition-colors hover:text-amber-400 flex items-center gap-1";

  // Simple Link
  if (!hasChildren) {
    return (
      <NavLink
        to={item.path}
        target={item.target}
        className={({ isActive: routeActive }) => linkClass(routeActive)}
      >
        {item.label}
      </NavLink>
    );
  }

  // Dropdown Menu Handlers
  const handleMouseEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setIsOpen(true);
  };

  const handleMouseLeave = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = window.setTimeout(() => {
      setIsOpen(false);
    }, 200);
  };

  return (
    <div
      className="group relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onFocus={handleMouseEnter}
      onBlur={handleMouseLeave}
    >
      <button type="button" className={linkClass(isActive || isOpen)}>
        {item.label}
        <ChevronDown
          className={`h-4 w-4 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      <div
        className={`min-w-8rem absolute top-full left-1/2 z-50 w-max -translate-x-1/2 transform-gpu rounded-xl border border-gray-800 bg-[#0F171E] py-2 shadow-lg transition-[opacity,transform] duration-150 ease-out ${
          isOpen
            ? "pointer-events-auto translate-y-0 opacity-100"
            : "pointer-events-none translate-y-1 opacity-0"
        }`}
        style={{ willChange: "opacity, transform", contain: "content" }}
      >
        {item.children!.map(
          (child) =>
            child.isVisible && (
              <NavLink
                key={child.id}
                to={child.path}
                target={child.target}
                className="block px-4 py-2 text-white transition-colors hover:bg-white/10 hover:text-amber-400"
              >
                {child.label}
              </NavLink>
            ),
        )}
      </div>
    </div>
  );
}
