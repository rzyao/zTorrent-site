/**
 * 导航设置页面逻辑 Hook
 * 管理所有状态和业务逻辑
 */
import { useState, useEffect, useCallback } from "react";
import { App } from "antd";
import { AdminNavigationService } from "@/api/services/AdminNavigationService";
import { BatchUpdateNavigationDto } from "@/api/models/BatchUpdateNavigationDto";
import { CreateNavigationItemDto } from "@/api/models/CreateNavigationItemDto";
import type { NavigationItem } from "@/types/navigation";
import { mockNavigationData } from "@/modules/admin/mocks/navigationData";
import { buildTree, flattenTree, loopTree, updateTreeNode } from "../utils";
import type { PlatformType } from "../constants";
import type { ItemFormValues } from "../components/ItemFormModal";

/**
 * Hook 返回类型
 */
export interface UseNavigationSettingsReturn {
  // 状态
  platform: PlatformType;
  treeData: NavigationItem[];
  loading: boolean;
  saving: boolean;
  modalVisible: boolean;
  setModalVisible: (visible: boolean) => void;
  modalType: "create" | "edit";
  currentItem: NavigationItem | null;

  // 方法
  fetchData: () => Promise<void>;
  onDrop: (info: any) => void;
  handleEdit: (item: NavigationItem) => void;
  handleCreate: () => void;
  handleDelete: (id: string) => Promise<void>;
  handleSave: () => Promise<void>;
  handleVisibilityChange: (id: string, checked: boolean) => void;
  handleFormSubmit: (values: ItemFormValues) => Promise<boolean>;
}

/**
 * 导航设置页面逻辑 Hook
 * @param platform 平台类型 (desktop | mobile)
 */
export const useNavigationSettings = (platform: PlatformType): UseNavigationSettingsReturn => {
  const [treeData, setTreeData] = useState<NavigationItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalType, setModalType] = useState<"create" | "edit">("create");
  const [currentItem, setCurrentItem] = useState<NavigationItem | null>(null);
  const { message } = App.useApp();

  /**
   * 加载导航数据
   */
  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await AdminNavigationService.adminNavigationControllerGetAllNavigation();
      if (res.data) {
        const allItems = (res.data as unknown as NavigationItem[]).map((item) => ({
          ...item,
          permissions: item.permissions ?? [],
        }));

        const platformItems = allItems.filter((i) => i.platform === platform);
        const tree = buildTree(platformItems);
        setTreeData(tree);
      } else {
        // Mock fallback
        const platformItems = mockNavigationData.filter((i) => i.platform === platform);
        setTreeData(buildTree(platformItems));
      }
    } catch (error) {
      console.error(error);
      message.error("Failed to load navigation configuration");
      // Fallback
      const platformItems = mockNavigationData.filter((i) => i.platform === platform);
      setTreeData(buildTree(platformItems));
    } finally {
      setLoading(false);
    }
  }, [platform, message]);

  // 平台变化时加载数据
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  /**
   * 处理拖拽排序/移动
   */
  const onDrop = useCallback(
    (info: any) => {
      const dropKey = info.node.key;
      const dragKey = info.dragNode.key;
      const dropPos = info.node.pos.split("-");
      const dropPosition = info.dropPosition - Number(dropPos[dropPos.length - 1]);

      const data = [...treeData];

      // 找到并移除拖拽对象
      let dragObj: NavigationItem | undefined;
      loopTree(data, dragKey, (item, index, arr) => {
        arr.splice(index, 1);
        dragObj = item;
      });

      if (!dragObj) return;

      if (!info.dropToGap) {
        // 放到内容上（变成子节点）
        loopTree(data, dropKey, (item) => {
          item.children = item.children || [];
          item.children.push(dragObj!);
        });
      } else if (
        (info.node.children || []).length > 0 &&
        info.node.expanded &&
        dropPosition === 1
      ) {
        // 放到展开节点的底部间隙
        loopTree(data, dropKey, (item) => {
          item.children = item.children || [];
          item.children.unshift(dragObj!);
        });
      } else {
        // 放到节点的上方或下方
        let ar: NavigationItem[] = [];
        let i: number = 0;
        loopTree(data, dropKey, (_item, index, arr) => {
          ar = arr;
          i = index;
        });
        if (dropPosition === -1) {
          ar.splice(i, 0, dragObj!);
        } else {
          ar.splice(i + 1, 0, dragObj!);
        }
      }

      setTreeData(data);
    },
    [treeData],
  );

  /**
   * 打开编辑弹窗
   */
  const handleEdit = useCallback((item: NavigationItem) => {
    setCurrentItem(item);
    setModalType("edit");
    setModalVisible(true);
  }, []);

  /**
   * 打开新建弹窗
   */
  const handleCreate = useCallback(() => {
    setCurrentItem(null);
    setModalType("create");
    setModalVisible(true);
  }, []);

  /**
   * 删除导航项
   */
  const handleDelete = useCallback(
    async (id: string) => {
      try {
        await AdminNavigationService.adminNavigationControllerDeleteItem(id);
        message.success("Deleted successfully");
        fetchData();
      } catch (error) {
        console.error(error);
        message.error("Failed to delete");
      }
    },
    [fetchData, message],
  );

  /**
   * 保存排序结构
   */
  const handleSave = useCallback(async () => {
    setSaving(true);
    try {
      const flattenedItems = flattenTree(treeData);
      const itemsPayload = flattenedItems.map((item) => ({
        id: item.id,
        sortOrder: item.sortOrder,
        isVisible: item.isVisible,
        permissions: item.permissions,
        parentId: item.parentId,
      }));

      await AdminNavigationService.adminNavigationControllerBatchUpdate({
        platform:
          platform === "desktop"
            ? BatchUpdateNavigationDto.platform.DESKTOP
            : BatchUpdateNavigationDto.platform.MOBILE,
        items: itemsPayload as any,
      });
      message.success("Structure saved");
      fetchData();
    } catch (e) {
      console.error(e);
      message.error("Failed");
    }
    setSaving(false);
  }, [treeData, platform, fetchData, message]);

  /**
   * 更新节点可见状态
   */
  const handleVisibilityChange = useCallback(
    (id: string, checked: boolean) => {
      const newTree = [...treeData];
      updateTreeNode(newTree, id, { isVisible: checked });
      setTreeData(newTree);
    },
    [treeData],
  );

  /**
   * 处理表单提交（新建/编辑）
   */
  const handleFormSubmit = useCallback(
    async (values: ItemFormValues): Promise<boolean> => {
      if (modalType === "edit" && currentItem) {
        try {
          await AdminNavigationService.adminNavigationControllerUpdateItem(currentItem.id, {
            ...values,
            id: currentItem.id,
            sortOrder: currentItem.sortOrder,
          } as any);
          message.success("Updated");
          fetchData();
          return true;
        } catch {
          message.error("Failed");
          return false;
        }
      } else {
        try {
          const createPayload: CreateNavigationItemDto = {
            label: values.label,
            path: values.path,
            parentId: values.parentId,
            isVisible: values.isVisible,
            permissions: values.permissions,
            platform:
              platform === "desktop"
                ? CreateNavigationItemDto.platform.DESKTOP
                : CreateNavigationItemDto.platform.MOBILE,
            sortOrder: 99,
          };
          await AdminNavigationService.adminNavigationControllerCreateItem(createPayload);
          message.success("Created");
          fetchData();
          return true;
        } catch {
          message.error("Failed");
          return false;
        }
      }
    },
    [modalType, currentItem, platform, fetchData, message],
  );

  return {
    platform,
    treeData,
    loading,
    saving,
    modalVisible,
    setModalVisible,
    modalType,
    currentItem,
    fetchData,
    onDrop,
    handleEdit,
    handleCreate,
    handleDelete,
    handleSave,
    handleVisibilityChange,
    handleFormSubmit,
  };
};

export default useNavigationSettings;
