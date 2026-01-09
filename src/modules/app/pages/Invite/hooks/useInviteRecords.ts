import { useEffect, useState } from "react";
import { Service } from "@/api/services/Service";
import { extractData, formatDate } from ".@/utils/cn";
import type { SentInvite } from "../types";

export function useInviteRecords(enabled: boolean = false) {
  const [records, setRecords] = useState<SentInvite[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchRecords = async () => {
    setLoading(true);
    setError(null);
    try {
      const resp = await Service.inviteRecordControllerListRecords({ page: 1, limit: 50 });
      const data = extractData(resp);
      const items = (data?.items || []).map((it: any) => ({
        id: String(it.id),
        code: String(it.code),
        recipientName: String(it.recipientName || ""),
        recipientEmail: String(it.recipientEmail || ""),
        status: String(it.status) as SentInvite["status"],
        sentAt: formatDate(it.sentAt),
        registeredAt: it.registeredAt ? formatDate(it.registeredAt) : undefined,
        expiresAt: formatDate(it.expiresAt),
      }));
      setRecords(items);
    } catch (e: any) {
      setError(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!enabled) return;
    fetchRecords();
  }, [enabled]);

  return { records, loading, error, refetch: fetchRecords };
}
