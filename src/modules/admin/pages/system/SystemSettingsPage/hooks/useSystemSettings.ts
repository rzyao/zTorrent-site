import { useState, useMemo, useCallback } from "react";
import { toast } from "sonner";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { SettingsService } from "@/api/services/SettingsService";
import { MailService } from "@/api/services/MailService";
import type { SystemSetting, SettingGroup, SettingType } from "../types";
import { GROUP_INFO } from "../constants";

// -- Helpers (Pure Functions) --

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

export function useSystemSettings() {
  const queryClient = useQueryClient();

  // -- UI State --
  const [selectedGroup, setSelectedGroup] = useState<SettingGroup>("site");
  const [searchText, setSearchText] = useState("");

  // -- Editing State --
  const [editedValues, setEditedValues] = useState<Record<string, string>>({});

  // -- Modals State --
  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [editingSetting, setEditingSetting] = useState<SystemSetting | null>(null);

  // -- Mail Tools State --
  const [mailConfigSnapshot, setMailConfigSnapshot] = useState<string | null>(null);
  const [mailVerifyReport, setMailVerifyReport] = useState<{
    ok?: boolean;
    error?: { name?: string; code?: string; message?: string } | null;
  } | null>(null);
  const [sendDiagOpen, setSendDiagOpen] = useState(false);
  const [sendDiagResult, setSendDiagResult] = useState<Record<string, any> | null>(null);

  // -- Query: Fetch Settings --
  const isSearchMode = !!searchText;

  const {
    data: rawSettings = [],
    isLoading,
    isFetching,
  } = useQuery({
    queryKey: ["admin", "system", "settings", isSearchMode ? "all" : { group: selectedGroup }],
    queryFn: async () => {
      let list: SystemSetting[] = [];
      if (isSearchMode) {
        const resp = await SettingsService.settingsControllerListDetailedSettingsLegacy();
        const items = resp.data ?? [];
        list = items.map((it: any) => {
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
      } else {
        const resp = await SettingsService.settingsControllerListSettingsByGroup({
          group: selectedGroup,
        });
        const items = resp.data ?? [];
        list = items.map((it: any) => ({
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
      }
      return list;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  // -- Computed: Filtered Settings --
  const settings = useMemo(() => {
    if (!isSearchMode) return rawSettings;
    const lowerSearch = searchText.toLowerCase();
    return rawSettings.filter(
      (s) =>
        s.key.toLowerCase().includes(lowerSearch) || s.value.toLowerCase().includes(lowerSearch),
    );
  }, [rawSettings, isSearchMode, searchText]);

  // -- Computed: Original Values & Changes --
  const originalValues = useMemo(() => {
    return Object.fromEntries(settings.map((s) => [s.key, s.value]));
  }, [settings]);

  const hasChanges = useMemo(() => {
    for (const k of Object.keys(editedValues)) {
      const current = settings.find((s) => s.key === k);
      const orig = originalValues[k] ?? "";
      if (!normalizeAndEqual(current, editedValues[k], orig)) return true;
    }
    return false;
  }, [editedValues, settings, originalValues]);

  // -- Computed: Group Info --
  const groupInfoByKey = useMemo(() => {
    const map: Record<string, any> = {};
    for (const g of GROUP_INFO) map[g.key] = g;
    return map;
  }, []);

  const selectedGroupInfo = groupInfoByKey[selectedGroup];

  // -- Computed: Mail Info (Live Preview) --
  const mailInfo = useMemo(() => {
    const getValue = (key: string) => editedValues[key] ?? originalValues[key];

    const enabled = getValue("mail.enabled") === "true";
    const host = getValue("mail.smtp.host") || "";
    const port = getValue("mail.smtp.port") || "";
    const secure = getValue("mail.smtp.secure") === "true";
    const fromEmail = getValue("mail.smtp.from.email") || "";
    const nickname = getValue("mail.smtp.nickname") || "";

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
  }, [editedValues, originalValues]);

  // -- Actions: Value Change --
  const handleValueChange = useCallback((key: string, value: string) => {
    setEditedValues((prev) => ({ ...prev, [key]: value }));
  }, []);

  const handleReset = useCallback(() => {
    setEditedValues({});
  }, []);

  // -- Mutation: Save Settings --
  const saveMutation = useMutation({
    mutationFn: async (items: { key: string; value: any }[]) => {
      return SettingsService.settingsControllerUpdateSettingsItems({ items });
    },
    onSuccess: () => {
      toast.success("保存成功");
      setEditedValues({});
      queryClient.invalidateQueries({
        queryKey: ["admin", "system", "settings"],
      });
    },
    onError: () => {
      toast.error("保存失败，请重试");
    },
  });

  // -- Mutation: Create Setting --
  const createMutation = useMutation({
    mutationFn: async (payload: any) => {
      return (SettingsService.settingsControllerCreate as any)(payload);
    },
    onSuccess: (_, variables) => {
      toast.success("创建成功");
      setCreateOpen(false);
      // 如果是在其他组创建，或者当前是所有搜索模式，刷新数据
      queryClient.invalidateQueries({
        queryKey: ["admin", "system", "settings"],
      });

      // 如果当前不是搜索模式，且创建的组不同，可能需要跳转
      if (!searchText && variables.group !== selectedGroup) {
        setSelectedGroup(variables.group as SettingGroup);
      }
    },
    onError: (error: any) => {
      if (error?.status === 409 || error?.response?.status === 409) {
        toast.error("该键已存在，请使用编辑保存");
      } else {
        toast.error("创建失败，请稍后重试");
      }
    },
  });

  // -- Mutation: Update Meta --
  const updateMetaMutation = useMutation({
    mutationFn: async (payload: any) => {
      return SettingsService.settingsControllerUpdateSettingMeta(payload);
    },
    onSuccess: (_, variables) => {
      toast.success(variables.newKey ? "重命名并更新元信息成功" : "元信息已更新");
      setEditOpen(false);
      setEditingSetting(null);
      queryClient.invalidateQueries({
        queryKey: ["admin", "system", "settings"],
      });

      if (!searchText && variables.group !== selectedGroup) {
        setSelectedGroup(variables.group as SettingGroup);
      }
    },
    onError: () => {
      toast.error("编辑保存失败，请稍后重试");
    },
  });

  // -- Mutation: Verify Mail --
  const verifyMailMutation = useMutation({
    mutationFn: async () => {
      return MailService.mailControllerVerifyReport({});
    },
    onSuccess: (resp) => {
      const report = resp.data ?? {};
      setMailVerifyReport(report as any);
      if (report?.ok) {
        toast.success("SMTP 连通性正常");
      } else {
        toast.error((report as any)?.error?.message || "SMTP 连通性失败");
      }
    },
    onError: () => {
      toast.error("SMTP 连通性检测失败，请稍后重试");
    },
  });

  // -- Mutation: View Mail Config --
  const viewMailConfigMutation = useMutation({
    mutationFn: async () => {
      return MailService.mailControllerConfig({});
    },
    onSuccess: (resp) => {
      const snapshot = (resp.data ?? {}) as Record<string, any>;
      const masked = maskSensitive(snapshot);
      const text = JSON.stringify(masked, null, 2);
      setMailConfigSnapshot(text);
    },
    onError: () => {
      toast.error("获取 SMTP 配置失败，请稍后重试");
    },
  });

  // -- Mutation: Send Diagnositc Mail --
  const sendDiagMutation = useMutation({
    mutationFn: async (values: any) => {
      return MailService.mailControllerSendReport(values);
    },
    onSuccess: (resp) => {
      setSendDiagResult((resp as any)?.data ?? {});
      toast.success("诊断邮件已发送，返回结果已展示");
    },
    onError: () => {
      toast.error("诊断邮件发送失败，请检查配置或收件人地址");
    },
  });

  // -- Handlers (Interfacing with UI) --

  const handleVerifyMail = useCallback(() => {
    setMailVerifyReport(null);
    verifyMailMutation.mutate();
  }, [verifyMailMutation]);

  const handleViewMailConfig = useCallback(() => {
    viewMailConfigMutation.mutate();
  }, [viewMailConfigMutation]);

  const handleSave = useCallback(async () => {
    const entries = Object.entries(editedValues);
    const changed = entries.filter(([key, raw]) => {
      const current = settings.find((s) => s.key === key);
      const orig = originalValues[key] ?? "";
      return !normalizeAndEqual(current, raw, orig);
    });

    if (changed.length === 0) {
      setEditedValues({});
      toast.info("无变更无需保存");
      return;
    }

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

    await saveMutation.mutateAsync(items);

    // Post-save action for Mail settings
    if (!searchText && selectedGroup === "mail") {
      toast.success("SMTP 配置已保存", {
        action: {
          label: "测试连通性",
          onClick: () => handleVerifyMail(),
        },
      });
    }
  }, [
    editedValues,
    settings,
    originalValues,
    searchText,
    selectedGroup,
    saveMutation,
    handleVerifyMail,
  ]);

  const submitCreate = useCallback(
    async (values: {
      group: SettingGroup;
      suffix: string;
      type: SettingType;
      description?: string;
      mutable?: boolean;
      sort?: number;
    }) => {
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
      await createMutation.mutateAsync(payloadAny);
    },
    [createMutation],
  );

  const submitEditMeta = useCallback(
    async (values: {
      group: SettingGroup;
      suffix: string;
      type: SettingType;
      description?: string;
      mutable?: boolean;
      sort?: number;
    }) => {
      if (!editingSetting) return;

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

      await updateMetaMutation.mutateAsync(payload);
    },
    [editingSetting, updateMetaMutation],
  );

  const submitSendDiag = useCallback(
    async (values: { to: string; subject?: string; text?: string; html?: string }) => {
      setSendDiagResult(null);
      await sendDiagMutation.mutateAsync({
        to: values.to,
        subject: values.subject || "SMTP 诊断测试",
        text: values.text,
        html: values.html,
      });
    },
    [sendDiagMutation],
  );

  return {
    // Data
    settings,
    loading: isLoading || isFetching,
    selectedGroup,
    searchText,
    editedValues,
    hasChanges,
    selectedGroupInfo,
    groupInfoByKey,
    mailInfo,

    // UI State
    createOpen,
    createSubmitting: createMutation.isPending,
    editOpen,
    editSubmitting: updateMetaMutation.isPending,
    editingSetting,

    mailConfigSnapshot,
    mailConfigLoading: viewMailConfigMutation.isPending,
    mailVerifyLoading: verifyMailMutation.isPending,
    mailVerifyReport,
    sendDiagOpen,
    sendDiagLoading: sendDiagMutation.isPending,
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
