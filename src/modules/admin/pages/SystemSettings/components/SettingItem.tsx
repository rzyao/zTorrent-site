import React from "react";
import { Card, Tag, Button, Typography, InputNumber, Switch, Input, DatePicker } from "antd";
import { LockOutlined, UnlockOutlined } from "@ant-design/icons";
import { formatDate } from "@/modules/admin/utils/formatDate";
import { type SystemSetting } from "../types";

interface SettingItemProps {
  setting: SystemSetting;
  searchText: string;
  editedValue?: string;
  onValueChange: (key: string, value: string) => void;
  onEdit: (setting: SystemSetting) => void;
  groupName?: string;
}

export const SettingItem: React.FC<SettingItemProps> = ({
  setting,
  searchText,
  editedValue,
  onValueChange,
  onEdit,
  groupName,
}) => {
  const value = editedValue ?? setting.value;
  const disabled = !setting.mutable;

  const renderValueInput = () => {
    if (setting.type === "rate") {
      const defaults = {
        intervalSec: {
          type: "number",
          description: "同ip最短间隔（秒）",
          value: -1,
        },
        hourlyMax: {
          type: "number",
          description: "每小时最大请求次数",
          value: -1,
        },
        dailyMax: {
          type: "number",
          description: "每天最大请求次数",
          value: -1,
        },
        throwOnLimit: {
          type: "boolean",
          description: "超出限制是否抛出异常",
          value: false,
        },
        message: {
          type: "string",
          description: "超出限制时的提示消息",
          value: "",
        },
      } as Record<string, { type: string; description: string; value: any }>;
      let raw = defaults;
      try {
        const parsed = value ? JSON.parse(value) : null;
        if (parsed && typeof parsed === "object") raw = { ...defaults, ...parsed };
      } catch {}
      const cfg = {
        intervalSec: Number(raw.intervalSec?.value ?? -1),
        hourlyMax: Number(raw.hourlyMax?.value ?? -1),
        dailyMax: Number(raw.dailyMax?.value ?? -1),
        throwOnLimit: Boolean(raw.throwOnLimit?.value ?? false),
        message: String(raw.message?.value ?? ""),
      };

      const update = (patch: Partial<typeof cfg>) => {
        const nextRaw = { ...raw };
        for (const k of Object.keys(patch)) {
          const key = k as keyof typeof cfg;
          const current = raw[key as string] || {
            type: key === "message" ? "string" : key === "throwOnLimit" ? "boolean" : "number",
            description: defaults[key as string]?.description,
          };
          nextRaw[key as string] = {
            type: current.type,
            description: current.description,
            value: (patch as any)[key],
          };
        }
        onValueChange(setting.key, JSON.stringify(nextRaw));
      };

      return (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <div>
            <Typography.Text>
              {raw.intervalSec?.description || "同 IP 最短间隔（秒）"}
            </Typography.Text>
            <InputNumber
              value={Number(cfg.intervalSec)}
              onChange={(v) => update({ intervalSec: Number(v ?? -1) })}
              disabled={disabled}
              style={{ width: "100%" }}
            />
            <Typography.Text type="secondary" style={{ fontSize: 12 }}>
              填 -1 表示无限制
            </Typography.Text>
          </div>
          <div>
            <Typography.Text>{raw.hourlyMax?.description || "每小时最大请求次数"}</Typography.Text>
            <InputNumber
              value={Number(cfg.hourlyMax)}
              onChange={(v) => update({ hourlyMax: Number(v ?? -1) })}
              disabled={disabled}
              style={{ width: "100%" }}
            />
            <Typography.Text type="secondary" style={{ fontSize: 12 }}>
              填 -1 表示无限制
            </Typography.Text>
          </div>
          <div>
            <Typography.Text>{raw.dailyMax?.description || "每天最大请求次数"}</Typography.Text>
            <InputNumber
              value={Number(cfg.dailyMax)}
              onChange={(v) => update({ dailyMax: Number(v ?? -1) })}
              disabled={disabled}
              style={{ width: "100%" }}
            />
            <Typography.Text type="secondary" style={{ fontSize: 12 }}>
              填 -1 表示无限制
            </Typography.Text>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <Typography.Text>
              {raw.throwOnLimit?.description || "超出限制是否抛出异常"}
            </Typography.Text>
            <Switch
              checked={cfg.throwOnLimit === true}
              onChange={(checked) => update({ throwOnLimit: checked })}
              disabled={disabled}
            />
          </div>
          <div style={{ gridColumn: "1 / span 2" }}>
            <Typography.Text>{raw.message?.description || "超出限制时的提示消息"}</Typography.Text>
            <Input
              value={cfg.message}
              onChange={(e) => update({ message: e.target.value })}
              disabled={disabled}
            />
          </div>
        </div>
      );
    }
    if (setting.type === "password") {
      return (
        <Input.Password
          value={value}
          onChange={(e) => onValueChange(setting.key, e.target.value)}
          disabled={disabled}
        />
      );
    }
    if (setting.type === "datetime") {
      const placeholder = (() => {
        const d = new Date(value);
        return isNaN(d.getTime()) ? "请选择日期时间" : d.toLocaleString("zh-CN");
      })();
      return (
        <DatePicker
          showTime
          allowClear
          placeholder={placeholder}
          onChange={(v) => onValueChange(setting.key, v ? v.toISOString() : "")}
          disabled={disabled}
          style={{ width: "240px" }}
        />
      );
    }
    if (setting.type === "boolean") {
      return (
        <Switch
          checked={value === "true"}
          onChange={(checked) => onValueChange(setting.key, checked ? "true" : "false")}
          disabled={disabled}
        />
      );
    }
    if (setting.type === "number") {
      return (
        <InputNumber
          value={Number(value)}
          onChange={(v) => onValueChange(setting.key, String(v ?? 0))}
          disabled={disabled}
          style={{ width: "200px" }}
        />
      );
    }
    if (setting.type === "json") {
      return (
        <Input.TextArea
          value={value}
          onChange={(e) => onValueChange(setting.key, e.target.value)}
          disabled={disabled}
          rows={4}
          placeholder='{"key": "value"}'
        />
      );
    }
    return (
      <Input
        value={value}
        onChange={(e) => onValueChange(setting.key, e.target.value)}
        disabled={disabled}
      />
    );
  };

  return (
    <div
      style={{
        display: "flex",
        alignItems: "flex-start",
        width: "100%",
      }}
    >
      {setting.mutable ? (
        <UnlockOutlined style={{ color: "#52c41a" }} />
      ) : (
        <LockOutlined style={{ color: "#ff4d4f" }} />
      )}
      <div style={{ flex: 1, minWidth: 0 }}>
        <Card styles={{ body: { padding: 16 } }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 16,
              marginBottom: 8,
            }}
          >
            {setting.description && <Typography.Text strong>{setting.description}</Typography.Text>}
            <Typography.Text code>{setting.key}</Typography.Text>
            <Tag
              color={
                setting.type === "string"
                  ? "blue"
                  : setting.type === "number"
                    ? "green"
                    : setting.type === "boolean"
                      ? "purple"
                      : setting.type === "json"
                        ? "orange"
                        : setting.type === "datetime"
                          ? "gold"
                          : setting.type === "rate"
                            ? "cyan"
                            : "red"
              }
            >
              {setting.type}
            </Tag>
            {setting.group && searchText && groupName && <Tag>{groupName}</Tag>}
            <Button type="link" onClick={() => onEdit(setting)}>
              编辑
            </Button>
          </div>

          <div style={{ width: "100%" }}>{renderValueInput()}</div>
          {!setting.mutable && (
            <Typography.Text type="danger" style={{ display: "block", marginTop: 8 }}>
              此配置为系统核心参数，不允许运行时修改
            </Typography.Text>
          )}
          {setting.updated_at && (
            <Typography.Text
              type="secondary"
              style={{
                display: "block",
                marginTop: 8,
                fontSize: 12,
              }}
            >
              最后更新：{formatDate(setting.updated_at)}
              {setting.updated_by && ` by ${setting.updated_by}`}
              {` (v${setting.version})`}
            </Typography.Text>
          )}
        </Card>
      </div>
    </div>
  );
};
