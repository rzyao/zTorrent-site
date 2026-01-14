import { useState, useMemo, useCallback } from "react";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Service as InvitesService } from "@/api/services/Service";
import { UsersService } from "@/api/services/UsersService";
import { RolesService } from "@/api/services/RolesService";
import { LevelsService } from "@/api/services/LevelsService";
import type { ListUsersDto } from "@/api/models/ListUsersDto";
import { ListUsersDto as ListUsersDtoEnum } from "@/api/models/ListUsersDto";
import type { AdvancedRuleDto } from "@/api/models/AdvancedRuleDto";
import type { RoleDto } from "@/api/models/RoleDto";
import type { SendInviteDto } from "@/api/models/SendInviteDto";
import type { SelectOption, BatchGrantFormData } from "./types";

const sendInviteSchema = z.object({
  userId: z.string().min(1, "请输入用户ID"),
  count: z.number().min(1, "数量必须大于0").default(1),
  reason: z.string().min(1, "请输入原因"),
});

const batchGrantSchema = z.object({
  logic: z.enum(["AND", "OR"]).default("AND"),
  levels: z.array(z.string()).optional().default([]),
  roles: z.array(z.string()).optional().default([]),
  permanent: z.number().min(0).default(0),
  temporaryCount: z.number().min(0).default(0),
  temporaryExpiresAt: z.string().optional(),
});

type SendInviteFormValues = z.infer<typeof sendInviteSchema>;
type BatchGrantFormValues = z.infer<typeof batchGrantSchema>;

export function useSendInviteLogic() {
  const [batchOpen, setBatchOpen] = useState(false);
  const [rolesOptions, setRolesOptions] = useState<SelectOption[]>([]);
  const [levelsOptions, setLevelsOptions] = useState<SelectOption[]>([]);
  const [previewCount, setPreviewCount] = useState<number | null>(null);

  // Main Form
  const mainForm = useForm<SendInviteFormValues>({
    resolver: zodResolver(sendInviteSchema),
    defaultValues: {
      userId: "",
      count: 1,
      reason: "",
    },
  });

  // Batch Form
  const batchForm = useForm<BatchGrantFormValues>({
    resolver: zodResolver(batchGrantSchema),
    defaultValues: {
      logic: "AND",
      levels: [],
      roles: [],
      permanent: 0,
      temporaryCount: 0,
    },
  });

  // 权限检查
  const perms = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem("permissions") || "[]") as string[];
    } catch {
      return [];
    }
  }, []);

  const isSuperAdmin = (localStorage.getItem("username") || "") === "admin";
  const hasPerm = useCallback(
    (key: string) => isSuperAdmin || perms.includes(key),
    [isSuperAdmin, perms],
  );
  const canOfficial = hasPerm("send-official-invite");
  const canManageInvites = hasPerm("manage-invites");

  // 发送邀请 Mutation
  const sendInviteMutation = useMutation({
    mutationFn: async (data: SendInviteDto) => {
      return InvitesService.inviteCoreControllerSendOfficial(data);
    },
    onSuccess: (resp) => {
      // 成功且无业务错误时
      const rid = (resp as any)?.data?.recordId;
      toast.success(`邀请已发送，记录ID：${rid}`);
      mainForm.reset();
    },
    onError: (e: any) => {
      console.error(e?.message || "发送失败");
    },
  });

  // 处理提交
  const handleMainSubmit = mainForm.handleSubmit((values) => {
    sendInviteMutation.mutate(values as any);
  });

  // 加载选项
  const loadOptions = useCallback(async () => {
    try {
      const [rolesResp, levelsResp] = await Promise.all([
        (RolesService as any).rolesControllerListRoles({ page: 1, limit: 100 }),
        (LevelsService as any).levelsCoreControllerList({ page: 1, limit: 100 }),
      ]);

      const roles: RoleDto[] = ((rolesResp as any)?.data?.items || []) as RoleDto[];
      setRolesOptions(roles.map((r) => ({ label: String(r.name || r.key), value: String(r.key) })));

      const levels: any[] = (levelsResp as any)?.data?.items || [];
      setLevelsOptions(
        levels.map((x) => ({ label: String(x.label || x.key || ""), value: String(x.key || "") })),
      );
    } catch {
      // ignore
    }
  }, []);

  // 构建用户列表请求
  const buildUserListRequest = useCallback((values: BatchGrantFormValues): ListUsersDto => {
    const rules: AdvancedRuleDto[] = [];
    const lvls: string[] = Array.isArray(values.levels) ? values.levels : [];
    const roles: string[] = Array.isArray(values.roles) ? values.roles : [];
    if (lvls.length) rules.push({ field: "level", op: "In" as any, value: lvls as any });
    if (roles.length) rules.push({ field: "roles", op: "In" as any, value: roles as any });
    return {
      page: 1,
      limit: 100,
      rules,
      logic: values.logic === "AND" ? ListUsersDtoEnum.logic.AND : ListUsersDtoEnum.logic.OR,
    };
  }, []);

  // 预览匹配 Mutation
  const previewMutation = useMutation({
    mutationFn: async (values: BatchGrantFormValues) => {
      const req = buildUserListRequest(values);
      let total = 0,
        page = 1;
      while (true) {
        const resp: any = await UsersService.usersControllerListUsers({ ...req, page });
        const items = resp?.data?.items || [];
        total += items.length;
        if (!items.length || items.length < 100 || page > 100) break;
        page++;
      }
      return total;
    },
    onSuccess: (total) => {
      setPreviewCount(total);
      toast.success(`匹配用户数：${total}`);
    },
    onError: (e: any) => {
      console.error(e?.message || "预览失败");
    },
  });

  // 预览匹配处理
  const handlePreview = batchForm.handleSubmit((values) => {
    previewMutation.mutate(values);
  });

  // 批量授予 Mutation
  const batchGrantMutation = useMutation({
    mutationFn: async (values: BatchGrantFormValues) => {
      const req = buildUserListRequest(values);
      let page = 1,
        success = 0,
        fail = 0;
      const { permanent = 0, temporaryCount = 0, temporaryExpiresAt } = values;

      while (true) {
        const usersResp: any = await UsersService.usersControllerListUsers({ ...req, page });
        const items = usersResp?.data?.items || [];
        if (!items.length) break;
        for (const u of items) {
          try {
            await InvitesService.inviteQuotaControllerGrantQuota({
              userId: String(u.id),
              permanent,
              temporaryCount,
              temporaryExpiresAt,
            });
            success++;
          } catch {
            fail++;
          }
        }
        if (items.length < 100 || page > 100) break;
        page++;
      }
      return { success, fail };
    },
    onSuccess: ({ success, fail }) => {
      toast.success(`批量授予完成：成功 ${success}，失败 ${fail}`);
      setBatchOpen(false);
      batchForm.reset();
      setPreviewCount(null);
    },
    onError: (e: any) => {
      console.error(e?.message || "批量授予失败");
    },
  });

  // 执行批量授予
  const handleBatchSubmit = batchForm.handleSubmit((values) => {
    batchGrantMutation.mutate(values);
  });

  // 打开批量授予弹窗
  const openBatchModal = useCallback(() => {
    setBatchOpen(true);
    loadOptions();
  }, [loadOptions]);

  // 关闭批量授予弹窗
  const closeBatchModal = useCallback(() => {
    setBatchOpen(false);
    batchForm.reset();
    setPreviewCount(null);
  }, [batchForm]);

  // 计算加载状态
  const batchLoading = previewMutation.isPending || batchGrantMutation.isPending;
  const submitLoading = sendInviteMutation.isPending;

  return {
    mainForm,
    batchOpen,
    batchForm,
    batchLoading,
    submitLoading,
    rolesOptions,
    levelsOptions,
    previewCount,
    canOfficial,
    canManageInvites,
    handleMainSubmit,
    openBatchModal,
    closeBatchModal,
    handlePreview,
    handleBatchSubmit,
  };
}
