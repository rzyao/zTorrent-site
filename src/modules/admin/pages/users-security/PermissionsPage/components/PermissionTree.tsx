import { useState, useCallback } from "react";
import { ChevronRight, ChevronDown } from "lucide-react";
import { Checkbox } from "@/modules/admin/components/ui/checkbox"; // Ensure this component exists and handles indeterminate state if possible, or simple checked
import { Tag } from "@/modules/admin/components/ui/tag";
import { cn } from "@/utils/cn";
import { getTypeTagColor, getTypeLabel } from "../constants";
import type { Permission } from "../types";

interface PermissionTreeProps {
  permissions: Permission[];
  selectedIds: string[];
  onChange: (selectedIds: string[]) => void;
}

// Helper to get all descendant IDs
const getDescendantIds = (node: Permission): string[] => {
  let ids: string[] = [node.id];
  if (node.children) {
    node.children.forEach((child) => {
      ids = ids.concat(getDescendantIds(child));
    });
  }
  return ids;
};

const PermissionNode = ({
  node,
  selectedIds,
  onToggle,
  level = 0,
}: {
  node: Permission;
  selectedIds: string[];
  onToggle: (ids: string[], checked: boolean) => void;
  level?: number;
}) => {
  const [expanded, setExpanded] = useState(true);

  // Check status
  // 1. Is self selected?
  const isSelected = selectedIds.includes(node.id);

  // 2. Are all descendants selected?
  // const descendants = getDescendantIds(node);
  // const allDescendantsSelected = descendants.every(id => selectedIds.includes(id));

  // For simplicity, we stick to "Is Self Selected" driving the checkbox for now.
  // Implementing indeterminate state requires checking children status.

  const hasChildren = node.children && node.children.length > 0;

  const handleCheck = (checked: boolean) => {
    const idsToToggle = getDescendantIds(node);
    onToggle(idsToToggle, checked);
  };

  return (
    <div className="select-none">
      <div
        className={cn(
          "flex items-center gap-2 rounded-sm py-1.5 hover:bg-slate-50 dark:hover:bg-slate-800/50",
          level > 0 && "ml-6",
        )}
      >
        {/* Expand Toggle */}
        <div
          className="text-muted-foreground hover:text-foreground flex h-6 w-6 cursor-pointer items-center justify-center"
          onClick={(e) => {
            e.stopPropagation();
            setExpanded(!expanded);
          }}
        >
          {hasChildren ? (
            expanded ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )
          ) : (
            <span className="w-4" /> // Spacer
          )}
        </div>

        {/* Checkbox */}
        <Checkbox checked={isSelected} onCheckedChange={(v) => handleCheck(!!v)} />

        {/* Content */}
        <div
          className="flex flex-1 cursor-pointer items-center gap-2"
          onClick={() => handleCheck(!isSelected)}
        >
          <span className="text-sm font-medium">{node.name}</span>
          <Tag color={getTypeTagColor(node.type)} className="h-5 px-1 text-[10px]">
            {getTypeLabel(node.type)}
          </Tag>
          <span className="text-muted-foreground rounded bg-slate-100 px-1 font-mono text-xs dark:bg-slate-800">
            {node.key}
          </span>
        </div>
      </div>

      {/* Children */}
      {hasChildren && expanded && (
        <div className="border-border/50 ml-3 border-l">
          {node.children!.map((child) => (
            <PermissionNode
              key={child.id}
              node={child}
              selectedIds={selectedIds}
              onToggle={onToggle}
              level={level + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default function PermissionTree({
  permissions,
  selectedIds,
  onChange,
}: PermissionTreeProps) {
  const handleNodeToggle = useCallback(
    (targetIds: string[], checked: boolean) => {
      let nextIds = [...selectedIds];
      if (checked) {
        // Add all target IDs that are not present
        targetIds.forEach((id) => {
          if (!nextIds.includes(id)) nextIds.push(id);
        });
      } else {
        // Remove all target IDs
        nextIds = nextIds.filter((id) => !targetIds.includes(id));
      }
      onChange(nextIds);
    },
    [selectedIds, onChange],
  );

  if (!permissions || permissions.length === 0) {
    return <div className="p-4 text-sm text-neutral-400">暂无权限数据</div>;
  }

  return (
    <div className="space-y-0.5">
      {permissions.map((node) => (
        <PermissionNode
          key={node.id}
          node={node}
          selectedIds={selectedIds}
          onToggle={handleNodeToggle}
        />
      ))}
    </div>
  );
}
