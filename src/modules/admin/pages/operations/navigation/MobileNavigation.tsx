/**
 * 手机导航设置页面
 * 管理 Mobile 平台的导航菜单配置
 */
import React from "react";
import { Card, Button, Tree, Space, Typography } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import type { NavigationItem } from "@/types/navigation";

// 页面模块
import { useNavigationSettings } from "./hooks/useNavigationSettings";
import { TreeNodeTitle } from "./components/TreeNodeTitle";
import { ItemFormModal } from "./components/ItemFormModal";

const { Title } = Typography;

/**
 * 手机导航设置页面组件
 */
const MobileNavigation: React.FC = () => {
  const {
    treeData,
    loading,
    saving,
    modalVisible,
    setModalVisible,
    modalType,
    currentItem,
    onDrop,
    handleEdit,
    handleCreate,
    handleDelete,
    handleSave,
    handleVisibilityChange,
    handleFormSubmit,
  } = useNavigationSettings("mobile");

  /**
   * 自定义树节点渲染
   */
  const titleRender = (nodeData: any) => {
    const item = nodeData as NavigationItem;
    return (
      <TreeNodeTitle
        item={item}
        onVisibilityChange={handleVisibilityChange}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    );
  };

  return (
    // 外层容器：flex 布局，占满父容器
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        overflow: "hidden",
      }}
    >
      <Card
        loading={loading}
        title={
          <Title level={5} style={{ margin: 0 }}>
            手机导航设置
          </Title>
        }
        extra={
          <Space>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={handleCreate}
            >
              New Item
            </Button>
            <Button loading={saving} onClick={handleSave}>
              Save Sort Order
            </Button>
          </Space>
        }
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          minHeight: 0, // 关键：允许 flex 子元素收缩
          border: "1px solid #e8e8e8",
          borderRadius: "8px",
        }}
        styles={{
          body: {
            flex: 1,
            overflow: "auto", // 内容区域滚动
            minHeight: 0,
          },
        }}
        className="scroll-area"
      >
        <Tree
          treeData={treeData as any[]}
          draggable
          blockNode
          onDrop={onDrop}
          titleRender={titleRender}
          fieldNames={{ title: "label", key: "id", children: "children" }}
          defaultExpandAll
        />
        {treeData.length === 0 && !loading && (
          <div style={{ textAlign: "center", color: "#999", padding: 20 }}>
            No navigation items
          </div>
        )}

        {/* 新建/编辑弹窗 */}
        <ItemFormModal
          open={modalVisible}
          onOpenChange={setModalVisible}
          onFinish={handleFormSubmit}
          modalType={modalType}
          currentItem={currentItem}
          treeData={treeData}
        />
      </Card>
    </div>
  );
};

export default MobileNavigation;
