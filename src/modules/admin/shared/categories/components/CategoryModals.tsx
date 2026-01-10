import { Modal, Form, Row, Col, Input, InputNumber, Switch, Select } from "antd";
import { UpdateCategoryDto } from "@/api/models/UpdateCategoryDto";
import type { CategoryItem } from "../types";

interface CategoryModalsProps {
  // Create
  createOpen: boolean;
  createForm: any;
  createInitial?: any;
  createKeyPrefix?: string;
  onCancelCreate: () => void;
  onSubmitCreate: () => void;
  // Edit
  editOpen: boolean;
  editForm: any;
  editInitial?: any;
  editing: CategoryItem | null;
  onCancelEdit: () => void;
  onSubmitEdit: () => void;
}

export function CategoryModals({
  createOpen,
  createForm,
  createInitial,
  createKeyPrefix,
  onCancelCreate,
  onSubmitCreate,
  editOpen,
  editForm,
  editInitial,
  editing,
  onCancelEdit,
  onSubmitEdit,
}: CategoryModalsProps) {
  return (
    <>
      {/* 新增分类弹窗 */}
      <Modal
        title="新增分类"
        open={createOpen}
        onCancel={onCancelCreate}
        onOk={onSubmitCreate}
        okText="保存"
        destroyOnHidden
        afterOpenChange={(open) => {
          if (open) {
            createForm.resetFields();
            if (createInitial) createForm.setFieldsValue(createInitial);
          }
        }}
      >
        <Form form={createForm} layout="vertical">
          <Row gutter={12}>
            {createKeyPrefix ? (
              <Col span={24}>
                <Form.Item
                  name="keySuffix"
                  label="键后缀 (父类: ${createKeyPrefix})"
                  rules={[{ required: true }]}
                >
                  <Input placeholder="�?action �?classic" />
                </Form.Item>
              </Col>
            ) : (
              <Col span={24}>
                <Form.Item name="key" label="唯一�? rules={[{ required: true }]}>
                  <Input placeholder="�?movies" />
                </Form.Item>
              </Col>
            )}
            <Col span={24}>
              <Form.Item name="label" label="名称" rules={[{ required: true }]}>
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="sort" label="排序">
                <InputNumber min={0} className="w-full" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="enabled" label="启用" valuePropName="checked">
                <Switch />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item name="genre" label="分区" rules={[{ required: true }]}>
                <Select
                  options={[
                    { label: "普�?, value: UpdateCategoryDto.genre.GENERAL },
                    { label: "成人", value: UpdateCategoryDto.genre.ADULT },
                  ]}
                />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item name="description" label="描述">
                <Input.TextArea rows={3} />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item name="parentId" hidden>
            <Input />
          </Form.Item>
        </Form>
      </Modal>

      {/* 编辑分类弹窗 */}
      <Modal
        title="编辑分类"
        open={editOpen}
        onCancel={onCancelEdit}
        onOk={onSubmitEdit}
        okText="保存"
        destroyOnHidden
        afterOpenChange={(open) => {
          if (open) {
            editForm.resetFields();
            if (editInitial) editForm.setFieldsValue(editInitial);
          }
        }}
      >
        <Form form={editForm} layout="vertical">
          <Row gutter={12}>
            <Col span={24}>
              <Form.Item label="唯一�?>
                <Input value={editing?.key} disabled />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item name="label" label="名称" rules={[{ required: true }]}>
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="sort" label="排序">
                <InputNumber min={0} className="w-full" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="enabled" label="启用" valuePropName="checked">
                <Switch />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item name="genre" label="分区">
                <Select
                  options={[
                    { label: "普�?, value: UpdateCategoryDto.genre.GENERAL },
                    { label: "成人", value: UpdateCategoryDto.genre.ADULT },
                  ]}
                />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item name="description" label="描述">
                <Input.TextArea rows={3} />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </>
  );
}
