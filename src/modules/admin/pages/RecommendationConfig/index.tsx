import {
  ProTable,
  ModalForm,
  ProFormText,
  ProFormSelect,
  ProFormDigit,
  ProFormSwitch,
} from "@ant-design/pro-components";
import type { ProColumns } from "@ant-design/pro-components";
import { Button, Popconfirm, Tag, Switch, Space } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import type { RecommendationConfigDto } from "@/api/models/RecommendationConfigDto";
import type { RecommendationTabDto } from "@/api/models/RecommendationTabDto";
import { formatDate } from "@/modules/admin/utils/formatDate";
import { useRecommendationConfig } from "./hooks/useRecommendationConfig";
import { STRATEGY_TYPE_ENUM, STRATEGY_TYPE_OPTIONS, DISPLAY_STYLE_OPTIONS } from "./constants";

/**
 * 推荐配置管理页面
 */
export default function RecommendationConfigPage() {
  const {
    actionRef,
    fetchConfigs,
    form,
    modalVisible,
    setModalVisible,
    isEdit,
    tabOptions,
    handleCreate,
    handleEdit,
    handleDelete,
    handleToggleEnabled,
    handleSubmit,
  } = useRecommendationConfig();

  // 表格列定义
  const columns: ProColumns<RecommendationConfigDto>[] = [
    {
      title: "标题",
      dataIndex: "title",
      copyable: true,
      ellipsis: true,
      width: 150,
    },
    {
      title: "关联 Tab",
      dataIndex: "tabs",
      width: 200,
      render: (_, record) => {
        const tabs = (record as any).tabs ?? [];
        if (tabs.length === 0) return <Tag>未关联</Tag>;
        return (
          <Space size={4} wrap>
            {tabs.map((t: RecommendationTabDto) => (
              <Tag key={t.id} color="blue">
                {t.label}
              </Tag>
            ))}
          </Space>
        );
      },
    },
    {
      title: "策略",
      dataIndex: "type",
      valueType: "select",
      valueEnum: STRATEGY_TYPE_ENUM,
      width: 100,
    },
    {
      title: "时间范围",
      dataIndex: "timeRange",
      render: (v) => (v === 0 ? "不限" : `${v}天`),
      width: 80,
      search: false,
    },
    {
      title: "数量",
      dataIndex: "limit",
      search: false,
      width: 60,
    },
    {
      title: "排序",
      dataIndex: "sort",
      search: false,
      sorter: (a, b) => a.sort - b.sort,
      width: 60,
    },
    {
      title: "状态",
      dataIndex: "enabled",
      width: 80,
      render: (_, record) => (
        <Switch
          checked={record.enabled}
          onChange={(checked) => handleToggleEnabled(record.id, checked)}
        />
      ),
    },
    {
      title: "创建时间",
      dataIndex: "createdAt",
      valueType: "dateTime",
      search: false,
      render: (_, r) => formatDate(r.createdAt),
      width: 140,
    },
    {
      title: "操作",
      valueType: "option",
      width: 100,
      fixed: "right",
      render: (_, record) => [
        <a key="edit" onClick={() => handleEdit(record)}>
          编辑
        </a>,
        <Popconfirm
          key="delete"
          title="确认删除该配置？"
          description="删除后前端将不再显示该板块"
          onConfirm={() => handleDelete(record.id)}
        >
          <a style={{ color: "red" }}>删除</a>
        </Popconfirm>,
      ],
    },
  ];

  return (
    <>
      {/* 数据表格 - 使用 CSS flex 布局自适应高度 */}
      <div className="flex-table-container">
        <ProTable<RecommendationConfigDto>
          headerTitle="首页推荐配置"
          actionRef={actionRef}
          rowKey="id"
          search={false}
          options={{
            density: true,
            fullScreen: true,
            reload: true,
            setting: true,
          }}
          // 通过 cardProps 控制内部卡片样式，防止 ProCard 动态修改导致的跳动
          cardProps={{
            bodyStyle: {
              display: "flex",
              flexDirection: "column",
              flex: 1,
              minHeight: 0,
              padding: 16, // 固定 padding，阻止 ProCard 动态修改
            },
          }}
          toolBarRender={() => [
            <Button key="create" icon={<PlusOutlined />} type="primary" onClick={handleCreate}>
              新建配置
            </Button>,
          ]}
          request={fetchConfigs}
          columns={columns}
          scroll={{ x: 1000, y: 9999 }} // y 设置大值启用滚动，实际高度由 CSS flex 控制
          pagination={{ pageSize: 20 }}
        />
      </div>

      {/* 新建/编辑弹窗 */}
      <ModalForm
        title={isEdit ? "编辑推荐配置" : "新建推荐配置"}
        open={modalVisible}
        onOpenChange={setModalVisible}
        form={form}
        autoFocusFirstInput
        modalProps={{
          destroyOnClose: true,
          maskClosable: false,
        }}
        onFinish={handleSubmit}
        width={560}
        layout="horizontal"
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 16 }}
      >
        <ProFormText
          name="title"
          label="板块标题"
          placeholder="例如：本周最热"
          rules={[{ required: true, message: "请输入显示标题" }]}
        />

        <ProFormSelect
          name="tabIds"
          label="关联 Tab"
          placeholder="选择要展示此板块的 Tab"
          mode="multiple"
          options={tabOptions}
          rules={[{ required: true, message: "请至少选择一个 Tab" }]}
          tooltip="此板块将展示在选中的所有 Tab 下"
        />

        <ProFormSelect
          name="type"
          label="推荐策略"
          placeholder="请选择推荐逻辑"
          rules={[{ required: true, message: "请选择推荐策略" }]}
          options={STRATEGY_TYPE_OPTIONS}
        />

        <ProFormDigit
          name="timeRange"
          label="时间范围(天)"
          tooltip="0 表示不限制时间范围"
          min={0}
          fieldProps={{ precision: 0 }}
        />

        <ProFormSelect
          name="style"
          label="展示样式"
          placeholder="选择前端展示样式"
          allowClear
          options={DISPLAY_STYLE_OPTIONS}
        />

        <ProFormDigit
          name="limit"
          label="展示数量"
          min={1}
          max={100}
          fieldProps={{ precision: 0 }}
          rules={[{ required: true, message: "请输入展示数量" }]}
        />

        <ProFormDigit
          name="sort"
          label="排序权重"
          tooltip="数字越大越靠前"
          fieldProps={{ precision: 0 }}
        />

        <ProFormSwitch
          name="enabled"
          label="启用状态"
          checkedChildren="启用"
          unCheckedChildren="禁用"
        />
      </ModalForm>
    </>
  );
}
