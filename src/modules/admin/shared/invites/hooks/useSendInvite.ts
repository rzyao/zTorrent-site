import { useState, useMemo } from "react";
import { App, Form } from "antd";
import { Service as InvitesService } from "@/api/services/Service";
import { UsersService } from "@/api/services/UsersService";
import { RolesService } from "@/api/services/RolesService";
import { LevelsService } from "@/api/services/LevelsService";
import type { ListUsersDto } from "@/api/models/ListUsersDto";
import { ListUsersDto as ListUsersDtoEnum } from "@/api/models/ListUsersDto";
import type { AdvancedRuleDto } from "@/api/models/AdvancedRuleDto";
import type { RoleDto } from "@/api/models/RoleDto";
import type { SendInviteDto } from "@/api/models/SendInviteDto";

export function useSendInvite() {
  const { message } = App.useApp();
  const [form] = Form.useForm();
  const [batchOpen, setBatchOpen] = useState(false);
  const [batchForm] = Form.useForm();
  const [batchLoading, setBatchLoading] = useState(false);
  const [rolesOptions, setRolesOptions] = useState<{ label: string; value: string }[]>([]);
  const [levelsOptions, setLevelsOptions] = useState<{ label: string; value: string }[]>([]);
  const [previewCount, setPreviewCount] = useState(0);

  const perms = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem("permissions") || "[]") as string[];
    } catch {
      return [];
    }
  }, []);

  const isSuperAdmin = (localStorage.getItem("username") || "") === "admin";
  const hasPerm = (key: string) => isSuperAdmin || perms.includes(key);
  const canOfficial = hasPerm("send-official-invite");
  const canManageInvites = hasPerm("manage-invites");

  const handleSubmit = async () => {
    try {
      const v = (await form.validateFields()) as SendInviteDto;
      const resp = await InvitesService.inviteCoreControllerSendOfficial(v);
      const ok = (resp as any)?.code === 1000 || !!(resp as any)?.data?.recordId;
      if (ok) {
        const rid = (resp as any)?.data?.recordId;
        message.success(`邀请已发送，记录ID：${rid}`);
        form.resetFields();
      } else {
        message.error((resp as any)?.message || "发送失败");
      }
    } catch (e: any) {
      if (e?.errorFields) return;
      message.error(e?.response?.data?.message || e?.message || "发送失败");
    }
  };

  const loadOptions = async () => {
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
    } catch (e) {
      // ignore
    }
  };

  const buildUserListRequest = (values: any): ListUsersDto => {
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
  };

  const previewMatching = async () => {
    setBatchLoading(true);
    try {
      const v = await batchForm.validateFields();
      const req = buildUserListRequest(v);
      let total = 0,
        page = 1;
      while (true) {
        const resp: any = await UsersService.usersControllerListUsers({ ...req, page });
        const items = resp?.data?.items || [];
        total += items.length;
        if (!items.length || items.length < 100 || page > 100) break;
        page++;
      }
      setPreviewCount(total);
      message.success(`匹配用户数：${total}`);
    } catch (e: any) {
      if (e?.errorFields) return;
      message.error(e?.response?.data?.message || e?.message || "预览失败");
    } finally {
      setBatchLoading(false);
    }
  };

  const executeBatchGrant = async () => {
    setBatchLoading(true);
    try {
      const v = await batchForm.validateFields();
      const req = buildUserListRequest(v);
      let page = 1,
        success = 0,
        fail = 0;
      const { permanent = 0, temporaryCount = 0, temporaryExpiresAt } = v;
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
      message.success(`批量授予完成：成功 ${success}，失败 ${fail}`);
      setBatchOpen(false);
    } catch (e: any) {
      if (e?.errorFields) return;
      message.error(e?.response?.data?.message || e?.message || "批量授予失败");
    } finally {
      setBatchLoading(false);
    }
  };

  return {
    form,
    batchOpen,
    setBatchOpen,
    batchForm,
    batchLoading,
    rolesOptions,
    levelsOptions,
    previewCount,
    setPreviewCount,
    canOfficial,
    canManageInvites,
    handleSubmit,
    loadOptions,
    previewMatching,
    executeBatchGrant,
  };
}
