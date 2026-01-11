import { useState, useMemo, useCallback } from "react";
import { App, Form } from "antd";
import { useMutation } from "@tanstack/react-query";
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

/**
 * 发送邀请页面逻辑 Hook
 * 使用 TanStack Query useMutation 管理请求状态
 */
export function useSendInviteLogic() {
  const { message } = App.useApp();
  const [form] = Form.useForm();
  const [batchOpen, setBatchOpen] = useState(false);
  const [batchForm] = Form.useForm();
  const [rolesOptions, setRolesOptions] = useState<SelectOption[]>([]);
  const [levelsOptions, setLevelsOptions] = useState<SelectOption[]>([]);
  const [previewCount, setPreviewCount] = useState(0);

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
      const ok = (resp as any)?.code === 1000 || !!(resp as any)?.data?.recordId;
      if (ok) {
        const rid = (resp as any)?.data?.recordId;
        message.success(`邀请已发送，记录ID：${rid}`);
        form.resetFields();
      } else {
        message.error((resp as any)?.message || "发送失败");
      }
    },
    onError: (e: any) => {
      message.error(e?.response?.data?.message || e?.message || "发送失败");
    },
  });

  // 处理提交
  const handleSubmit = useCallback(async () => {
    try {
      const v = (await form.validateFields()) as SendInviteDto;
      sendInviteMutation.mutate(v);
    } catch (e: any) {
      if (e?.errorFields) return;
      message.error(e?.response?.data?.message || e?.message || "发送失败");
    }
  }, [form, sendInviteMutation, message]);

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
  const buildUserListRequest = useCallback((values: BatchGrantFormData): ListUsersDto => {
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
    mutationFn: async (values: BatchGrantFormData) => {
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
      message.success(`匹配用户数：${total}`);
    },
    onError: (e: any) => {
      message.error(e?.response?.data?.message || e?.message || "预览失败");
    },
  });

  // 预览匹配处理
  const previewMatching = useCallback(async () => {
    try {
      const v = (await batchForm.validateFields()) as BatchGrantFormData;
      previewMutation.mutate(v);
    } catch (e: any) {
      if (e?.errorFields) return;
    }
  }, [batchForm, previewMutation]);

  // 批量授予 Mutation
  const batchGrantMutation = useMutation({
    mutationFn: async (values: BatchGrantFormData) => {
      const req = buildUserListRequest(values);
      let page = 1,
        success = 0,
        fail = 0;
      const { permanent = 0, temporaryCount = 0, temporaryExpiresAt } = values;
      const exp = temporaryExpiresAt?.toISOString?.();

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
              temporaryExpiresAt: exp,
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
      message.success(`批量授予完成：成功 ${success}，失败 ${fail}`);
      setBatchOpen(false);
    },
    onError: (e: any) => {
      message.error(e?.response?.data?.message || e?.message || "批量授予失败");
    },
  });

  // 执行批量授予
  const executeBatchGrant = useCallback(async () => {
    try {
      const v = (await batchForm.validateFields()) as BatchGrantFormData;
      batchGrantMutation.mutate(v);
    } catch (e: any) {
      if (e?.errorFields) return;
    }
  }, [batchForm, batchGrantMutation]);

  // 打开批量授予弹窗
  const openBatchModal = useCallback(() => {
    setBatchOpen(true);
    loadOptions();
  }, [loadOptions]);

  // 关闭批量授予弹窗
  const closeBatchModal = useCallback(() => {
    setBatchOpen(false);
  }, []);

  // 计算加载状态
  const batchLoading = previewMutation.isPending || batchGrantMutation.isPending;
  const submitLoading = sendInviteMutation.isPending;

  return {
    form,
    batchOpen,
    batchForm,
    batchLoading,
    submitLoading,
    rolesOptions,
    levelsOptions,
    previewCount,
    canOfficial,
    canManageInvites,
    handleSubmit,
    openBatchModal,
    closeBatchModal,
    previewMatching,
    executeBatchGrant,
  };
}
