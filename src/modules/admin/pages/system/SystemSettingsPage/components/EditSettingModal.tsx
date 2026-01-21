import React, { useEffect, useState } from "react";
import { Modal } from "@/modules/admin/components/ui/modal";
import { Input } from "@/modules/admin/components/ui/input";
import { StandardSelect } from "@/modules/admin/components/ui/select";
import { Switch } from "@/modules/admin/components/ui/switch";
import { Textarea } from "@/modules/admin/components/ui/textarea";
import { Label } from "@/modules/admin/components/ui/label";
import { GROUP_INFO, SETTING_TYPES } from "../constants";
import type { SettingGroup, SettingType, SystemSetting } from "../types";

interface EditSettingModalProps {
  open: boolean;
  onCancel: () => void;
  onSubmit: (values: {
    group: SettingGroup;
    suffix: string;
    type: SettingType;
    description?: string;
    mutable?: boolean;
    sort?: number;
  }) => Promise<void>;
  confirmLoading: boolean;
  setting: SystemSetting | null;
}

export const EditSettingModal: React.FC<EditSettingModalProps> = ({
  open,
  onCancel,
  onSubmit,
  confirmLoading,
  setting,
}) => {
  const [group, setGroup] = useState<SettingGroup>("site");
  const [suffix, setSuffix] = useState("");
  const [type, setType] = useState<SettingType>("string");
  const [description, setDescription] = useState("");
  const [mutable, setMutable] = useState(true);
  const [sort, setSort] = useState(0);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (open && setting) {
      const g = setting.group || "site";
      const s = String(setting.key).split(".").slice(1).join(".") || "";
      setGroup(g);
      setSuffix(s);
      setType(setting.type);
      setDescription(setting.description || "");
      setMutable(!!setting.mutable);
      setSort(typeof setting.sort === "number" ? setting.sort : 0);
      setErrors({});
    }
  }, [open, setting]);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!group) newErrors.group = "请选择分组";
    if (!suffix) {
      newErrors.suffix = "请输入键名后缀";
    } else if (!/^[A-Za-z][\w\-.]*$/.test(suffix)) {
      newErrors.suffix = "后缀需以字母开头，仅包含字母/数字/下划线/点/连字符";
    }
    if (!type) newErrors.type = "请选择类型";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    try {
      await onSubmit({
        group,
        suffix,
        type,
        description,
        mutable,
        sort,
      });
      onCancel();
    } catch (e) {
      // Parent handles notification
    }
  };

  const previewKey = group && suffix ? `${group}.${suffix}` : "分组.后缀";

  return (
    <Modal
      open={open}
      onCancel={onCancel}
      onOk={handleSubmit}
      confirmLoading={confirmLoading}
      title="编辑配置项"
      okText="保存"
      width={600}
    >
      <div className="space-y-4">
        <div className="grid gap-2">
          <Label htmlFor="group-edit" className="required">
            分组
          </Label>
          <StandardSelect
            value={group}
            onValueChange={(val) => setGroup(val as SettingGroup)}
            options={GROUP_INFO.map((g) => ({ label: g.name, value: g.key }))}
            placeholder="选择分组"
            className={errors.group ? "border-red-500" : ""}
          />
          {errors.group && <span className="text-xs text-red-500">{errors.group}</span>}
        </div>

        <div className="grid gap-2">
          <Label htmlFor="suffix-edit" className="required">
            键名后缀
          </Label>
          <Input
            id="suffix-edit"
            value={suffix}
            onChange={(e) => setSuffix(e.target.value)}
            className={errors.suffix ? "border-red-500" : ""}
          />
          {errors.suffix && <span className="text-xs text-red-500">{errors.suffix}</span>}
          <div className="text-xs text-gray-500">
            完整键预览：<code className="bg-gray-100 px-1">{previewKey}</code>
          </div>
        </div>

        <div className="grid gap-2">
          <Label htmlFor="type-edit" className="required">
            类型
          </Label>
          <StandardSelect
            value={type}
            onValueChange={(val) => setType(val as SettingType)}
            options={SETTING_TYPES.map((t) => ({ label: t, value: t }))}
            placeholder="选择类型"
            className={errors.type ? "border-red-500" : ""}
          />
          {errors.type && <span className="text-xs text-red-500">{errors.type}</span>}
        </div>

        <div className="grid gap-2">
          <Label htmlFor="description-edit">描述</Label>
          <Textarea
            id="description-edit"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
          />
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Switch id="mutable-edit" checked={mutable} onCheckedChange={setMutable} />
            <Label htmlFor="mutable-edit" className="cursor-pointer">
              可运行时修改
            </Label>
          </div>
        </div>

        <div className="grid gap-2">
          <Label htmlFor="sort-edit">排序值</Label>
          <Input
            id="sort-edit"
            type="number"
            value={sort}
            onChange={(e) => setSort(Number(e.target.value))}
            className="w-32"
          />
        </div>
      </div>
    </Modal>
  );
};
