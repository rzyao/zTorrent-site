import React from "react";
import { Lock, Unlock, Edit2 } from "lucide-react";
import { Button } from "@/modules/admin/components/ui/button";
import { Input } from "@/modules/admin/components/ui/input";
import { Switch } from "@/modules/admin/components/ui/switch";
import { Textarea } from "@/modules/admin/components/ui/textarea";
import Tag from "@/modules/admin/components/ui/tag";
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

export const SettingItem = React.memo<SettingItemProps>(
  ({ setting, searchText, editedValue, onValueChange, onEdit, groupName }) => {
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
          <div className="grid grid-cols-2 gap-3">
            <div>
              <span className="block text-sm font-medium text-gray-700">
                {raw.intervalSec?.description || "同 IP 最短间隔（秒）"}
              </span>
              <Input
                type="number"
                value={cfg.intervalSec}
                onChange={(e) => update({ intervalSec: Number(e.target.value) })}
                disabled={disabled}
                className="w-full"
              />
              <span className="text-xs text-gray-500">填 -1 表示无限制</span>
            </div>
            <div>
              <span className="block text-sm font-medium text-gray-700">
                {raw.hourlyMax?.description || "每小时最大请求次数"}
              </span>
              <Input
                type="number"
                value={cfg.hourlyMax}
                onChange={(e) => update({ hourlyMax: Number(e.target.value) })}
                disabled={disabled}
                className="w-full"
              />
              <span className="text-xs text-gray-500">填 -1 表示无限制</span>
            </div>
            <div>
              <span className="block text-sm font-medium text-gray-700">
                {raw.dailyMax?.description || "每天最大请求次数"}
              </span>
              <Input
                type="number"
                value={cfg.dailyMax}
                onChange={(e) => update({ dailyMax: Number(e.target.value) })}
                disabled={disabled}
                className="w-full"
              />
              <span className="text-xs text-gray-500">填 -1 表示无限制</span>
            </div>
            <div className="flex items-center gap-2 pt-6">
              <Switch
                checked={cfg.throwOnLimit === true}
                onCheckedChange={(checked) => update({ throwOnLimit: checked })}
                disabled={disabled}
              />
              <span className="text-sm font-medium text-gray-700">
                {raw.throwOnLimit?.description || "超出限制是否抛出异常"}
              </span>
            </div>
            <div className="col-span-2">
              <span className="block text-sm font-medium text-gray-700">
                {raw.message?.description || "超出限制时的提示消息"}
              </span>
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
          <Input
            type="password"
            value={value}
            onChange={(e) => onValueChange(setting.key, e.target.value)}
            disabled={disabled}
          />
        );
      }
      if (setting.type === "datetime") {
        // Convert value (ISO string) to datetime-local format (YYYY-MM-DDThh:mm)
        const dateValue = value ? new Date(value) : new Date();
        const localIso = !isNaN(dateValue.getTime())
          ? new Date(dateValue.getTime() - dateValue.getTimezoneOffset() * 60000)
              .toISOString()
              .slice(0, 16)
          : "";

        return (
          <Input
            type="datetime-local"
            value={localIso}
            onChange={(e) => {
              const v = e.target.value;
              onValueChange(setting.key, v ? new Date(v).toISOString() : "");
            }}
            disabled={disabled}
            className="w-60"
          />
        );
      }
      if (setting.type === "boolean") {
        return (
          <Switch
            checked={value === "true"}
            onCheckedChange={(checked) => onValueChange(setting.key, checked ? "true" : "false")}
            disabled={disabled}
          />
        );
      }
      if (setting.type === "number") {
        return (
          <Input
            type="number"
            value={value}
            onChange={(e) => onValueChange(setting.key, e.target.value)}
            disabled={disabled}
            className="w-48"
          />
        );
      }
      if (setting.type === "json") {
        return (
          <Textarea
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
      <div className="flex w-full items-start gap-3">
        <div className="mt-4">
          {setting.mutable ? (
            <Unlock className="h-4 w-4 text-green-500" />
          ) : (
            <Lock className="h-4 w-4 text-red-500" />
          )}
        </div>
        <div className="min-w-0 flex-1 rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
          <div className="mb-3 flex flex-wrap items-center gap-3">
            {setting.description && (
              <span className="font-semibold text-gray-900">{setting.description}</span>
            )}
            <code className="rounded bg-gray-100 px-1 py-0.5 font-mono text-xs">{setting.key}</code>
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
            {setting.group && searchText && groupName && <Tag color="default">{groupName}</Tag>}
            <div className="ml-auto">
              <Button variant="link" onClick={() => onEdit(setting)}>
                编辑
              </Button>
            </div>
          </div>

          <div className="w-full">{renderValueInput()}</div>

          {!setting.mutable && (
            <span className="mt-2 block text-xs text-red-500">
              此配置为系统核心参数，不允许运行时修改
            </span>
          )}

          {setting.updated_at && (
            <span className="mt-2 block text-xs text-gray-400">
              最后更新：{formatDate(setting.updated_at)}
              {setting.updated_by && ` by ${setting.updated_by}`}
              {` (v${setting.version})`}
            </span>
          )}
        </div>
      </div>
    );
  },
);
