import { useState, useCallback } from 'react';
import { getTicketsService } from '@/api/lazy';
import { extractErrorMessage } from '@/utils/errorMessage';

export function useTickets() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [list, setList] = useState<any | null>(null);
  const [adminList, setAdminList] = useState<any | null>(null);
  const [detail, setDetail] = useState<any | null>(null);
  const [stats, setStats] = useState<any | null>(null);
  const [todos, setTodos] = useState<any | null>(null);

  const listTickets = useCallback(async (params: { page?: number; pageSize?: number; status?: string | null; category?: string | null; keyword?: string }) => {
    setIsLoading(true);
    setError(null);
    try {
      const Service = await getTicketsService();
      const response = await Service.ticketsControllerList({
        page: params.page ?? 1,
        pageSize: params.pageSize ?? 20,
        status: params.status ?? undefined,
        category: params.category ?? undefined,
        keyword: params.keyword ?? '',
      });
      const body = (response as any)?.code !== undefined ? response : (response as any)?.data ?? (response as any);
      const data = body?.data ?? body;
      setList(data);
      return data;
    } catch (err: any) {
      const msg = extractErrorMessage(err, '获取工单列表失败');
      setError(msg);
      throw new Error(msg);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const adminListTickets = useCallback(async (params: { page?: number; pageSize?: number; status?: string | null; category?: string | null; keyword?: string; assignedTo?: any }) => {
    setIsLoading(true);
    setError(null);
    try {
      const Service = await getTicketsService();
      const response = await Service.ticketsControllerAdminList({
        page: params.page ?? 1,
        pageSize: params.pageSize ?? 20,
        status: params.status ?? undefined,
        category: params.category ?? undefined,
        keyword: params.keyword ?? '',
        assignedTo: params.assignedTo ?? null,
      } as any);
      const body = (response as any)?.code !== undefined ? response : (response as any)?.data ?? (response as any);
      const data = body?.data ?? body;
      setAdminList(data);
      return data;
    } catch (err: any) {
      const msg = extractErrorMessage(err, '获取管理员工单列表失败');
      setError(msg);
      throw new Error(msg);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getDetail = useCallback(async (ticketId: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const Service = await getTicketsService();
      const response = await Service.ticketsControllerDetail({ ticketId });
      const body = (response as any)?.code !== undefined ? response : (response as any)?.data ?? (response as any);
      const data = body?.data ?? body;
      setDetail(data);
      return data;
    } catch (err: any) {
      const msg = extractErrorMessage(err, '获取工单详情失败');
      setError(msg);
      throw new Error(msg);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getStats = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const Service = await getTicketsService();
      const response = await Service.ticketsControllerStats();
      const body = (response as any)?.code !== undefined ? response : (response as any)?.data ?? (response as any);
      const data = body?.data ?? body;
      setStats(data);
      return data;
    } catch (err: any) {
      const msg = extractErrorMessage(err, '获取工单统计失败');
      setError(msg);
      throw new Error(msg);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const listTodos = useCallback(async (params: { page?: number; pageSize?: number; priority?: string | null; category?: string | null }) => {
    setIsLoading(true);
    setError(null);
    try {
      const Service = await getTicketsService();
      const response = await Service.ticketsControllerTodos({
        page: params.page ?? 1,
        pageSize: params.pageSize ?? 20,
        priority: params.priority ?? undefined,
        category: params.category ?? undefined,
      } as any);
      const body = (response as any)?.code !== undefined ? response : (response as any)?.data ?? (response as any);
      const data = body?.data ?? body;
      setTodos(data);
      return data;
    } catch (err: any) {
      const msg = extractErrorMessage(err, '获取我的待办失败');
      setError(msg);
      throw new Error(msg);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createTicket = useCallback(async (payload: { title: string; category: string; priority: string; content: string; attachments?: Array<{ attachmentId: string; url: string; name: string; size: number }>; clientRequestId?: string }) => {
    setIsLoading(true);
    setError(null);
    try {
      const Service = await getTicketsService();
      const response = await Service.ticketsControllerCreate(payload as any);
      const body = (response as any)?.code !== undefined ? response : (response as any)?.data ?? (response as any);
      const data = body?.data ?? body;
      return data;
    } catch (err: any) {
      const msg = extractErrorMessage(err, '创建工单失败');
      setError(msg);
      throw new Error(msg);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const uploadAttachment = useCallback(async (params: { ticketId?: string; purpose: 'create' | 'reply'; file: File }) => {
    setIsLoading(true);
    setError(null);
    try {
      const Service = await getTicketsService();
      const form: any = new FormData();
      if (params.ticketId) form.append('ticketId', params.ticketId);
      form.append('purpose', params.purpose);
      form.append('file', params.file);
      const response = await Service.ticketsControllerUpload(form);
      const body = (response as any)?.code !== undefined ? response : (response as any)?.data ?? (response as any);
      const data = body?.data ?? body;
      return data;
    } catch (err: any) {
      const msg = extractErrorMessage(err, '上传附件失败');
      setError(msg);
      throw new Error(msg);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const replyTicket = useCallback(async (payload: { ticketId: string; content: string; attachments?: Array<{ attachmentId: string; url: string; name: string; size: number }>; clientRequestId?: string }) => {
    setIsLoading(true);
    setError(null);
    try {
      const Service = await getTicketsService();
      const response = await Service.ticketsControllerReply(payload as any);
      const body = (response as any)?.code !== undefined ? response : (response as any)?.data ?? (response as any);
      const data = body?.data ?? body;
      return data;
    } catch (err: any) {
      const msg = extractErrorMessage(err, '回复工单失败');
      setError(msg);
      throw new Error(msg);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const closeTicket = useCallback(async (payload: { ticketId: string; reason: string }) => {
    setIsLoading(true);
    setError(null);
    try {
      const Service = await getTicketsService();
      const response = await Service.ticketsControllerClose(payload as any);
      const body = (response as any)?.code !== undefined ? response : (response as any)?.data ?? (response as any);
      const data = body?.data ?? body;
      return data;
    } catch (err: any) {
      const msg = extractErrorMessage(err, '关闭工单失败');
      setError(msg);
      throw new Error(msg);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const assignTicket = useCallback(async (payload: { ticketId: string; assignee: string | null }) => {
    setIsLoading(true);
    setError(null);
    try {
      const Service = await getTicketsService();
      const response = await Service.ticketsControllerAssign(payload as any);
      const body = (response as any)?.code !== undefined ? response : (response as any)?.data ?? (response as any);
      const data = body?.data ?? body;
      return data;
    } catch (err: any) {
      const msg = extractErrorMessage(err, '分配工单失败');
      setError(msg);
      throw new Error(msg);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const markResolved = useCallback(async (payload: { ticketId: string }) => {
    setIsLoading(true);
    setError(null);
    try {
      const Service = await getTicketsService();
      const response = await Service.ticketsControllerMarkResolved(payload as any);
      const body = (response as any)?.code !== undefined ? response : (response as any)?.data ?? (response as any);
      const data = body?.data ?? body;
      return data;
    } catch (err: any) {
      const msg = extractErrorMessage(err, '标记已解决失败');
      setError(msg);
      throw new Error(msg);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const confirmResolved = useCallback(async (payload: { ticketId: string }) => {
    setIsLoading(true);
    setError(null);
    try {
      const Service = await getTicketsService();
      const response = await Service.ticketsControllerConfirmResolved(payload as any);
      const body = (response as any)?.code !== undefined ? response : (response as any)?.data ?? (response as any);
      const data = body?.data ?? body;
      return data;
    } catch (err: any) {
      const msg = extractErrorMessage(err, '确认已解决失败');
      setError(msg);
      throw new Error(msg);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    listTickets,
    adminListTickets,
    getDetail,
    getStats,
    listTodos,
    createTicket,
    uploadAttachment,
    replyTicket,
    closeTicket,
    assignTicket,
    markResolved,
    confirmResolved,
    list,
    adminList,
    detail,
    stats,
    todos,
    isLoading,
    error,
  };
}

