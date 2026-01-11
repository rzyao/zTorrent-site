import { Form, DatePicker } from "antd";
import { Search } from "lucide-react";
import { useEffect } from "react";
import { Input } from "@/modules/admin/components/ui/input";
import { Button } from "@/modules/admin/components/ui/button";

const { RangePicker } = DatePicker;

interface LedgerFilterProps {
  onSearch: (values: any) => void;
  initUserId?: string;
}

export function LedgerFilter({ onSearch, initUserId }: LedgerFilterProps) {
  const [form] = Form.useForm();

  useEffect(() => {
    if (initUserId) {
      form.setFieldsValue({ userId: initUserId });
    }
  }, [initUserId, form]);

  return (
    <Form form={form} layout="inline" onFinish={onSearch} className="gap-y-2">
      <Form.Item name="userId" className="mr-2!">
        <Input placeholder="用户ID" className="w-[120px]" />
      </Form.Item>
      <Form.Item name="type" className="mr-2!">
        <Input placeholder="类型 (ADMIN_ADJUST...)" className="w-[160px]" />
      </Form.Item>
      <Form.Item name="reason" className="mr-2!">
        <Input placeholder="原因" className="w-[140px]" />
      </Form.Item>
      <Form.Item name="externalRef" className="mr-2!">
        <Input placeholder="幂等键" className="w-[160px]" />
      </Form.Item>
      <Form.Item name="correlationId" className="mr-2!">
        <Input placeholder="关联ID" className="w-[160px]" />
      </Form.Item>
      <Form.Item name="range" className="mr-2!">
        <RangePicker showTime className="w-[340px]" />
      </Form.Item>
      <div className="flex -space-x-px">
        <Button type="submit" className="rounded-r-none" variant="primary">
          <Search className="mr-2 h-4 w-4" />
          查询
        </Button>
        <Button
          variant="default"
          type="button"
          className="rounded-l-none"
          onClick={() => {
            form.resetFields();
            onSearch({});
          }}
        >
          重置
        </Button>
      </div>
    </Form>
  );
}
