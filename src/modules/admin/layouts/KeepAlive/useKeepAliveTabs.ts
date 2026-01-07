import { useState, useEffect, useRef } from "react";
import { useLocation, useOutlet, useNavigate } from "react-router-dom";

export interface TabItem {
  key: string;
  label: string;
  children: React.ReactNode;
  closable?: boolean;
}

export const useKeepAliveTabs = (menuItems?: any[]) => {
  const location = useLocation();
  const outlet = useOutlet();
  const navigate = useNavigate();
  const [items, setItems] = useState<TabItem[]>([]);
  const [activeKey, setActiveKey] = useState("");

  const pathNameMap = useRef<Record<string, string>>({});

  const extractLabelText = (label: any): string => {
    if (typeof label === "string") return label;
    if (label && typeof label === "object" && label.props) {
      const children = label.props.children;
      if (typeof children === "string") return children;
    }
    return "";
  };

  const extractLinkPath = (label: any): string | null => {
    if (label && typeof label === "object" && label.props?.to) {
      return label.props.to;
    }
    return null;
  };

  useEffect(() => {
    if (!menuItems) return;
    const traverse = (items: any[]) => {
      items.forEach((item) => {
        const linkPath = extractLinkPath(item.label);
        const labelText = extractLabelText(item.label);

        if (linkPath && labelText) {
          pathNameMap.current[linkPath] = labelText;
        } else if (item.key && labelText) {
          pathNameMap.current[item.key] = labelText;
        }

        if (item.children) traverse(item.children);
      });
    };
    traverse(menuItems);
  }, [menuItems]);

  const getPageTitle = (pathname: string) => {
    if (pathNameMap.current[pathname]) return pathNameMap.current[pathname];
    const parts = pathname.split("/").filter(Boolean);
    return parts.length > 0 ? parts[parts.length - 1] : "首页";
  };

  useEffect(() => {
    const path = location.pathname;
    setActiveKey(path);

    setItems((prev) => {
      const existing = prev.find((item) => item.key === path);
      if (existing) {
        return prev;
      }

      return [
        ...prev,
        {
          key: path,
          label: getPageTitle(path),
          children: outlet,
          closable: path !== "/",
        },
      ];
    });
  }, [location.pathname]);

  // Update titles when menuItems load
  useEffect(() => {
    if (!menuItems || menuItems.length === 0) return;
    setItems((prev) =>
      prev.map((item) => ({
        ...item,
        label: getPageTitle(item.key),
      }))
    );
  }, [menuItems]);

  const removeTab = (targetKey: string) => {
    let newActiveKey = activeKey;
    let lastIndex = -1;

    items.forEach((item, i) => {
      if (item.key === targetKey) {
        lastIndex = i - 1;
      }
    });

    const newItems = items.filter((item) => item.key !== targetKey);

    if (newItems.length && newActiveKey === targetKey) {
      if (lastIndex >= 0) {
        newActiveKey = newItems[lastIndex].key;
      } else {
        newActiveKey = newItems[0].key;
      }
      navigate(newActiveKey);
    } else if (newItems.length === 0) {
      navigate("/");
    }

    setItems(newItems);
  };

  const onEdit = (
    targetKey: React.MouseEvent | React.KeyboardEvent | string,
    action: "add" | "remove"
  ) => {
    if (action === "remove") {
      removeTab(targetKey as string);
    }
  };

  const handleTabClick = (key: string) => {
    navigate(key);
  };

  return {
    items,
    activeKey,
    onEdit,
    handleTabClick,
  };
};
