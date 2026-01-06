// 求种相关动作 Hook：统一封装所有动作接口的调用与状态管理
// 覆盖：认领/放弃/提交/重提/验收通过/拒绝/追加悬赏/发布/取消/重新发布/保存草稿/更新
// 成功后统一失效列表与个人视图缓存

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { RequestsService } from '@/api/services/RequestsService';
import { extractErrorMessage } from '@/utils/errorMessage';

import { unwrap } from '@/modules/app/pages/Requests/utils/unwrap';

export function useRequestActions() {
  const qc = useQueryClient();

  const invalidateAll = () => {
    qc.invalidateQueries({ queryKey: ['requests-list'] });
    qc.invalidateQueries({ queryKey: ['my-requests'] });
    qc.invalidateQueries({ queryKey: ['my-responses'] });
    qc.invalidateQueries({ queryKey: ['disputes-list'] });
  };

  const claim = useMutation({
    mutationFn: async (payload: { id: string }) => {
      try {
        const resp = await RequestsService.requestsControllerClaim(payload as any);
        return unwrap<{ claimId: string }>(resp);
      } catch (err: any) {
        throw new Error(extractErrorMessage(err, '认领失败'));
      }
    },
    onSuccess: invalidateAll,
  });

  const abandon = useMutation({
    mutationFn: async (payload: { claimId: string; reason?: string }) => {
      try {
        const resp = await RequestsService.requestsControllerAbandon(payload as any);
        return unwrap(resp);
      } catch (err: any) {
        throw new Error(extractErrorMessage(err, '放弃任务失败'));
      }
    },
    onSuccess: invalidateAll,
  });

  const submit = useMutation({
    mutationFn: async (payload: { claimId: string; resource: any; note?: string }) => {
      try {
        const resp = await RequestsService.requestsControllerSubmit(payload as any);
        return unwrap<{ submissionId: string }>(resp);
      } catch (err: any) {
        throw new Error(extractErrorMessage(err, '提交资源失败'));
      }
    },
    onSuccess: invalidateAll,
  });

  const resubmit = useMutation({
    mutationFn: async (payload: { submissionId: string; resource: any; note?: string }) => {
      try {
        const resp = await RequestsService.requestsControllerResubmit(payload as any);
        return unwrap(resp);
      } catch (err: any) {
        throw new Error(extractErrorMessage(err, '重新提交失败'));
      }
    },
    onSuccess: invalidateAll,
  });

  const approveSubmission = useMutation({
    mutationFn: async (payload: { submissionId: string }) => {
      try {
        const resp = await RequestsService.requestsControllerApproveSubmission(payload as any);
        return unwrap<{ paid: boolean }>(resp);
      } catch (err: any) {
        throw new Error(extractErrorMessage(err, '验收通过失败'));
      }
    },
    onSuccess: invalidateAll,
  });

  const rejectSubmission = useMutation({
    mutationFn: async (payload: { submissionId: string; reason: string }) => {
      try {
        const resp = await RequestsService.requestsControllerRejectSubmission(payload as any);
        return unwrap(resp);
      } catch (err: any) {
        throw new Error(extractErrorMessage(err, '拒绝验收失败'));
      }
    },
    onSuccess: invalidateAll,
  });

  const addBounty = useMutation({
    mutationFn: async (payload: { id: string; amount: number }) => {
      try {
        const resp = await RequestsService.requestsControllerAddBounty(payload as any);
        return unwrap<{ totalBounty: number; additionalBounty: number }>(resp);
      } catch (err: any) {
        throw new Error(extractErrorMessage(err, '追加悬赏失败'));
      }
    },
    onSuccess: invalidateAll,
  });

  const publish = useMutation({
    mutationFn: async (payload: { id: string }) => {
      try {
        const resp = await RequestsService.requestsControllerPublish(payload as any);
        return unwrap(resp);
      } catch (err: any) {
        throw new Error(extractErrorMessage(err, '发布失败'));
      }
    },
    onSuccess: invalidateAll,
  });

  const create = useMutation({
    mutationFn: async (payload: { title: string; category: string; description: string; bounty: number; deadlineDays: number; attachments?: string[] }) => {
      try {
        const resp = await RequestsService.requestsControllerCreate(payload as any);
        return unwrap<{ id: string }>(resp);
      } catch (err: any) {
        throw new Error(extractErrorMessage(err, '创建求种失败'));
      }
    },
    onSuccess: invalidateAll,
  });

  const cancel = useMutation({
    mutationFn: async (payload: { id: string; reason?: string }) => {
      try {
        const resp = await RequestsService.requestsControllerCancel(payload as any);
        return unwrap(resp);
      } catch (err: any) {
        throw new Error(extractErrorMessage(err, '取消求种失败'));
      }
    },
    onSuccess: invalidateAll,
  });

  const republish = useMutation({
    mutationFn: async (payload: { id: string; deadlineDays?: number }) => {
      try {
        const resp = await RequestsService.requestsControllerRepublish(payload as any);
        return unwrap<{ newId?: string }>(resp);
      } catch (err: any) {
        throw new Error(extractErrorMessage(err, '重新发布失败'));
      }
    },
    onSuccess: invalidateAll,
  });

  const saveDraft = useMutation({
    mutationFn: async (payload: any) => {
      try {
        const resp = await RequestsService.requestsControllerSaveDraft(payload as any);
        return unwrap<{ id: string }>(resp);
      } catch (err: any) {
        throw new Error(extractErrorMessage(err, '保存草稿失败'));
      }
    },
    onSuccess: invalidateAll,
  });

  const update = useMutation({
    mutationFn: async (payload: any) => {
      try {
        const resp = await RequestsService.requestsControllerUpdate(payload as any);
        return unwrap(resp);
      } catch (err: any) {
        throw new Error(extractErrorMessage(err, '更新求种失败'));
      }
    },
    onSuccess: invalidateAll,
  });

  return {
    claim,
    abandon,
    submit,
    resubmit,
    approveSubmission,
    rejectSubmission,
    addBounty,
    create,
    publish,
    cancel,
    republish,
    saveDraft,
    update,
  };
}
