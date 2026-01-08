import { useState, useEffect, useMemo, useCallback } from "react";
import { App } from "antd";
import { SettingsService } from "@/api/services/SettingsService";
import { MailService } from "@/api/services/MailService";
import type { SystemSetting, SettingGroup, SettingType } from "../types";
import { GROUP_INFO } from "../constants";

export function useSystemSettings() {
  const { message, modal } = App.useApp();

  // -- State: Settings Data --
  const [settings, setSettings] = useState<SystemSetting[]>([]);
  const [selectedGroup, setSelectedGroup] = useState<SettingGroup>("site");
  const [searchText, setSearchText] = useState("");
  const [loading, setLoading] = useState(false);

  // -- State: Editing Values --
  const [editedValues, setEditedValues] = useState<Record<string, string>>({});
  const [hasChanges, setHasChanges] = useState(false);
  const [originalValues, setOriginalValues] = useState<Record<string, string>>({});

  // -- State: Mail Tools --
  const [mailVerifyLoading, setMailVerifyLoading] = useState(false);
  const [mailVerifyReport, setMailVerifyReport] = useState<{
    ok?: boolean;
    error?: { name?: string; code?: string; message?: string } | null;
  } | null>(null);

  const [mailConfigLoading, setMailConfigLoading] = useState(false);
  const [mailConfigSnapshot, setMailConfigSnapshot] = useState<string | null>(null);

  const [sendDiagOpen, setSendDiagOpen] = useState(false);
  const [sendDiagLoading, setSendDiagLoading] = useState(false);
  const [sendDiagResult, setSendDiagResult] = useState<Record<string, any> | null>(null);

  // -- State: Create/Edit Modals --
  const [createOpen, setCreateOpen] = useState(false);
  const [createSubmitting, setCreateSubmitting] = useState(false);

  const [editOpen, setEditOpen] = useState(false);
  const [editSubmitting, setEditSubmitting] = useState(false);
  const [editingSetting, setEditingSetting] = useState<SystemSetting | null>(null);

  // -- Computed --
  const groupInfoByKey = useMemo(() => {
    const map: Record<string, any> = {};
    for (const g of GROUP_INFO) map[g.key] = g;
    return map;
  }, []);

  const selectedGroupInfo = groupInfoByKey[selectedGroup];

  const settingValueByKey = useMemo(() => {
    const map = new Map<string, string>();
    for (const s of settings) {
      map.set(s.key, editedValues[s.key] ?? s.value);
    }
    return map;
  }, [editedValues, settings]);

  const mailInfo = useMemo(() => {
    const enabled = settingValueByKey.get("mail.enabled") === "true";
    const host = settingValueByKey.get("mail.smtp.host") || "";
    const port = settingValueByKey.get("mail.smtp.port") || "";
    const secure = settingValueByKey.get("mail.smtp.secure") === "true";
    const fromEmail = settingValueByKey.get("mail.smtp.from.email") || "";
    const nickname = settingValueByKey.get("mail.smtp.nickname") || "";
    const fromPreview = nickname && fromEmail ? `${nickname} <${fromEmail}>` : fromEmail || "-";
    const smtpPreview = host ? `${host}:${port || "-"}` + (secure ? " (SSL/TLS)" : "") : "-";
    return {
      enabled,
      fromPreview,
      smtpPreview,
      missing: {
        host: !host,
        port: !port,
        email: !fromEmail,
      },
    };
  }, [settingValueByKey]);

  // -- Helpers --
  const deepEqual = (a: any, b: any): boolean => {
    if (a === b) return true;
    if (typeof a !== typeof b) return false;
    if (a && b && typeof a === "object") {
      if (Array.isArray(a) !== Array.isArray(b)) return false;
      if (Array.isArray(a)) {
        if (a.length !== b.length) return false;
        for (let i = 0; i < a.length; i++) if (!deepEqual(a[i], b[i])) return false;
        return true;
      }
      const ak = Object.keys(a);
      const bk = Object.keys(b);
      if (ak.length !== bk.length) return false;
      for (const k of ak) if (!deepEqual(a[k], b[k])) return false;
      return true;
    }
    return false;
  };

  const normalizeAndEqual = (setting: SystemSetting | undefined, a: string, b: string): boolean => {
    const t = setting?.type;
    if (t === "number") {
      const na = Number(a),
        nb = Number(b);
      if (!Number.isNaN(na) && !Number.isNaN(nb)) return na === nb;
      return a === b;
    }
    if (t === "boolean") {
      const ba = a === "true",
        bb = b === "true";
      return ba === bb;
    }
    if (t === "json" || t === "rate") {
      try {
        const pa = a ? JSON.parse(a) : null;
        const pb = b ? JSON.parse(b) : null;
        return deepEqual(pa, pb);
      } catch {
        return a === b;
      }
    }
    if (t === "datetime") {
      const ta = new Date(a).getTime();
      const tb = new Date(b).getTime();
      if (!Number.isNaN(ta) && !Number.isNaN(tb)) return ta === tb;
      return a === b;
    }
    return a === b;
  };

  const computeHasChanges = (ev: Record<string, string>): boolean => {
    for (const k of Object.keys(ev)) {
      const current = settings.find((s) => s.key === k);
      const orig = originalValues[k] ?? "";
      if (!normalizeAndEqual(current, ev[k], orig)) return true;
    }
    return false;
  };

  const maskSensitive = (obj: Record<string, any>) => {
    const clone: Record<string, any> = {};
    const maskKeys = ["pass", "password", "secret", "token"];
    Object.keys(obj || {}).forEach((k) => {
      const v = obj[k];
      if (typeof v === "object" && v !== null) {
        clone[k] = maskSensitive(v as Record<string, any>);
      } else {
        if (maskKeys.some((m) => k.toLowerCase().includes(m))) clone[k] = "***";
        else clone[k] = v;
      }
    });
    return clone;
  };

  // -- Actions --
  const loadSettings = useCallback(async () => {
    setLoading(true);
    try {
      if (searchText) {
        const resp = await SettingsService.settingsControllerListDetailedSettingsLegacy();
        const items = resp.data ?? [];
        const list: SystemSetting[] = items.map((it: any) => {
          const k = String(it.key ?? "");
          return {
            id: String(it.id ?? k),
            key: k,
            value: String(it.value ?? ""),
            type: it.type as SettingType,
            group: (it.group as SettingGroup) || (k.split(".")[0] as SettingGroup) || "site",
            description: it.description ?? it.comment ?? undefined,
            mutable: (it.mutable ?? 1) !== 0,
            sort: typeof it.sort === "number" ? it.sort : undefined,
            json_schema: it.jsonSchema ?? undefined,
            updated_by: it.updatedBy ?? undefined,
            version: Number(it.version ?? 1),
            created_at: it.createdAt ?? undefined,
            updated_at: it.updatedAt ?? undefined,
          };
        });
        const search = searchText.toLowerCase();
        const filtered = list.filter(
          (s) => s.key.toLowerCase().includes(search) || s.value.toLowerCase().includes(search),
        );
        setSettings(filtered);
        setOriginalValues(Object.fromEntries(filtered.map((s) => [s.key, s.value])));
      } else {
        const resp = await SettingsService.settingsControllerListSettingsByGroup({
          group: selectedGroup,
        });
        const items = resp.data ?? [];
        const list: SystemSetting[] = items.map((it: any) => ({
          id: String(it.id ?? it.key),
          key: String(it.key ?? ""),
          value: String(it.value ?? ""),
          type: it.type as SettingType,
          group: String(it.group ?? selectedGroup) as SettingGroup,
          description: it.description ?? it.comment ?? undefined,
          mutable: (it.mutable ?? 1) !== 0,
          sort: typeof it.sort === "number" ? it.sort : undefined,
          json_schema: it.jsonSchema ?? undefined,
          updated_by: it.updatedBy ?? undefined,
          version: Number(it.version ?? 1),
          created_at: it.createdAt ?? undefined,
          updated_at: it.updatedAt ?? undefined,
        }));
        setSettings(list);
        setOriginalValues(Object.fromEntries(list.map((s) => [s.key, s.value])));
      }
      setEditedValues({});
      setHasChanges(false);
    } catch (error) {
      console.error("加载配置失败:", error);
    } finally {
      setLoading(false);
    }
  }, [searchText, selectedGroup]);

  // Initial Load
  useEffect(() => {
    loadSettings();
  }, [loadSettings]);

  const handleValueChange = (key: string, value: string) => {
    setEditedValues((prev) => {
      const next = { ...prev, [key]: value };
      setHasChanges(computeHasChanges(next));
      return next;
    });
  };

  const handleVerifyMail = async () => {
    setMailVerifyLoading(true);
    setMailVerifyReport(null);
    try {
      const resp = await MailService.mailControllerVerifyReport({});
      const report = resp.data ?? {};
      setMailVerifyReport(report as any);
      if (report?.ok) {
        message.success("SMTP 连通性正常");
      } else {
        message.error((report as any)?.error?.message || "SMTP 连通性失败");
      }
    } catch (error) {
      message.error("SMTP 连通性检测失败，请稍后重试");
    } finally {
      setMailVerifyLoading(false);
    }
  };

  const handleSave = async () => {
    const entries = Object.entries(editedValues);
    const changed = entries.filter(([key, raw]) => {
      const current = settings.find((s) => s.key === key);
      const orig = originalValues[key] ?? "";
      return !normalizeAndEqual(current, raw, orig);
    });
    if (changed.length === 0) {
      setHasChanges(false);
      message.info("无变更无需保存");
      return;
    }

    setLoading(true);
    try {
      const items = changed.map(([key, raw]) => {
        let parsed: any = raw;
        try {
          const current = settings.find((s) => s.key === key);
          if (current?.type === "number") parsed = Number(raw);
          else if (current?.type === "boolean") parsed = raw === "true";
          else if (current?.type === "json" || current?.type === "rate")
            parsed = raw ? JSON.parse(raw) : null;
        } catch {}
        return { key, value: parsed as any };
      });
      await SettingsService.settingsControllerUpdateSettingsItems({ items });
      await loadSettings();
      message.success("保存成功");
      if (!searchText && selectedGroup === "mail") {
        modal.confirm({
          title: "SMTP 配置已保存",
          content: "是否立即进行连通性测试？",
          okText: "测试连通性",
          cancelText: "稍后",
          onOk: () => handleVerifyMail(),
        });
      }
    } catch (error) {
      console.error("保存失败:", error);
      message.error("保存失败，请重试");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setEditedValues({});
    setHasChanges(false);
  };

  const handleViewMailConfig = async () => {
    setMailConfigLoading(true);
    try {
      const resp = await MailService.mailControllerConfig({});
      const snapshot = (resp.data ?? {}) as Record<string, any>;
      const masked = maskSensitive(snapshot);
      const text = JSON.stringify(masked, null, 2);
      setMailConfigSnapshot(text);
    } catch (error) {
      message.error("获取 SMTP 配置失败，请稍后重试");
    } finally {
      setMailConfigLoading(false);
    }
  };

  const submitCreate = async (values: {
    group: SettingGroup;
    suffix: string;
    type: SettingType;
    description?: string;
    mutable?: boolean;
    sort?: number;
  }) => {
    setCreateSubmitting(true);
    try {
      const group = String(values.group);
      const suffix = String(values.suffix).trim();
      const key = `${group}.${suffix}`;

      const payloadAny: any = {
        key,
        group,
        type: values.type,
        description: values.description,
        mutable: values.mutable === true,
        sort: Number(values.sort ?? 0),
      };
      await (SettingsService.settingsControllerCreate as any)(payloadAny);
      message.success("创建成功");
      setCreateOpen(false);

      if (!searchText) {
        if (selectedGroup !== values.group) setSelectedGroup(values.group);
        else await loadSettings();
      } else {
        await loadSettings();
      }
    } catch (error: any) {
      if (error?.status === 409 || error?.response?.status === 409) {
        message.error("该键已存在，请使用编辑保存");
      } else {
        message.error("创建失败，请稍后重试");
      }
      console.error("创建配置项失败:", error);
    } finally {
      setCreateSubmitting(false);
    }
  };

  const submitEditMeta = async (values: {
    group: SettingGroup;
    suffix: string;
    type: SettingType;
    description?: string;
    mutable?: boolean;
    sort?: number;
  }) => {
    if (!editingSetting) return;
    setEditSubmitting(true);
    try {
      const oldKey = editingSetting.key;
      const attemptedNewKey = `${values.group}.${String(values.suffix).trim()}`;
      const payload: any = {
        key: oldKey,
        newKey: attemptedNewKey !== oldKey ? attemptedNewKey : undefined,
        description: values.description,
        type: values.type,
        group: String(values.group),
        mutable: values.mutable === true,
        sort: Number(values.sort ?? 0),
      };
      await SettingsService.settingsControllerUpdateSettingMeta(payload);
      message.success(payload.newKey ? "重命名并更新元信息成功" : "元信息已更新");
      setEditOpen(false);
      setEditingSetting(null);
      if (!searchText) {
        if (selectedGroup !== values.group) setSelectedGroup(values.group);
        else await loadSettings();
      } else {
        await loadSettings();
      }
    } catch (error: any) {
      message.error("编辑保存失败，请稍后重试");
      console.error("编辑配置项失败:", error);
    } finally {
      setEditSubmitting(false);
    }
  };

  const submitSendDiag = async (values: {
    to: string;
    subject?: string;
    text?: string;
    html?: string;
  }) => {
    setSendDiagLoading(true);
    setSendDiagResult(null);
    try {
      const resp = await MailService.mailControllerSendReport({
        to: values.to,
        subject: values.subject || "SMTP 诊断测试",
        text: values.text,
        html: values.html,
      } as any);
      setSendDiagResult((resp as any)?.data ?? {});
      message.success("诊断邮件已发送，返回结果已展示");
    } catch (error) {
      message.error("诊断邮件发送失败，请检查配置或收件人地址");
    } finally {
      setSendDiagLoading(false);
    }
  };

  return {
    // Data
    settings,
    loading,
    selectedGroup,
    searchText,
    editedValues,
    hasChanges,
    selectedGroupInfo,
    groupInfoByKey,
    mailInfo,

    // UI State
    createOpen,
    createSubmitting,
    editOpen,
    editSubmitting,
    editingSetting,

    mailConfigSnapshot,
    mailConfigLoading,
    mailVerifyLoading,
    mailVerifyReport,
    sendDiagOpen,
    sendDiagLoading,
    sendDiagResult,

    // Setters
    setSelectedGroup,
    setSearchText,
    setCreateOpen,
    setEditOpen,
    setEditingSetting,
    setMailConfigSnapshot,
    setMailVerifyReport,
    setSendDiagOpen,

    // Actions
    handleValueChange,
    handleSave,
    handleReset,
    handleVerifyMail,
    handleViewMailConfig,
    submitCreate,
    submitEditMeta,
    submitSendDiag,
  };
}
