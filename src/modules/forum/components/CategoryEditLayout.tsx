import { useEffect, useMemo, useState, useCallback } from "react";
import { cn } from "@/utils/cn";
import { useForumTheme } from "@/modules/forum/context/ForumThemeContext";

interface NavItem {
  id: string;
  label: string;
}

interface CategoryEditLayoutProps {
  navItems: NavItem[];
  activeId: string;
  onSelect: (id: string) => void;
  header?: React.ReactNode;
  children: React.ReactNode;
}

export function CategoryEditLayout({ navItems, activeId, onSelect, header, children }: CategoryEditLayoutProps) {
  const { colors } = useForumTheme();

  const handleNavClick = (id: string) => {
    onSelect(id);
  };

  const desktopNav = useMemo(
    () => (
      <nav className="sticky top-20">
        <ul className="space-y-1">
          {navItems.map((item) => (
            <li key={item.id}>
              <button
                onClick={() => handleNavClick(item.id)}
                className={cn(
                  "flex w-full items-center rounded-md px-3 py-2 text-sm transition-colors",
                  colors.textSecondary,
                  activeId === item.id
                    ? "bg-gray-100 font-medium dark:bg-neutral-800"
                    : "hover:bg-gray-50 dark:hover:bg-neutral-800/60",
                )}
                aria-current={activeId === item.id ? "true" : undefined}
              >
                {item.label}
              </button>
            </li>
          ))}
        </ul>
      </nav>
    ),
    [navItems, activeId, colors],
  );

  return (
    <div className={cn("mx-auto max-w-6xl px-4 py-4 sm:px-6")}>
      {header && (
        <section className="mb-4">
          {header}
          <div className="mt-3 h-px w-full bg-gray-200 dark:bg-neutral-700" />
        </section>
      )}
      <div className="flex gap-6">
        <aside className="w-fit min-w-[160px] max-w-[240px] shrink-0">{desktopNav}</aside>
        <div className="w-px self-stretch bg-gray-200 dark:bg-neutral-700" aria-hidden />
        <section id="category-edit-scroll" className="min-h-[60vh] flex-1 pl-4">
          {children}
        </section>
      </div>
    </div>
  );
}
