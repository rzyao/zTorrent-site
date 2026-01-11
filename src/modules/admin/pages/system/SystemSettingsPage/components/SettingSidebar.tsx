import React from "react";
import { GROUP_INFO } from "../constants";
import type { SettingGroup } from "../types";
import { cn } from "@/utils/cn";

interface SettingSidebarProps {
  selectedGroup: SettingGroup;
  onSelectGroup: (group: SettingGroup) => void;
  visible: boolean;
}

export const SettingSidebar = React.memo<SettingSidebarProps>(
  ({ selectedGroup, onSelectGroup, visible }) => {
    if (!visible) return null;

    return (
      <div className="flex h-full w-60 flex-col overflow-hidden rounded-lg bg-white shadow-sm">
        <div className="flex-1 overflow-y-auto p-2">
          <ul className="space-y-1">
            {GROUP_INFO.map((group) => (
              <li key={group.key}>
                <button
                  onClick={() => onSelectGroup(group.key)}
                  className={cn(
                    "flex w-full items-center justify-between rounded-md px-3 py-2 text-sm transition-colors",
                    selectedGroup === group.key
                      ? "bg-blue-50 text-blue-700"
                      : "text-gray-900 hover:bg-gray-100",
                  )}
                >
                  <span>{group.name}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    );
  },
);
