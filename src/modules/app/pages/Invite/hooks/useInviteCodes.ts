import { useEffect, useState } from "react";
import { Service } from "@/api/services/Service";
import { extractData, formatDate } from "../utils";
import type { InviteCode } from "../types";

export function useInviteCodes(enabled: boolean = false) {
  const [codes, setCodes] = useState<InviteCode[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchCodes = async () => {
    setLoading(true);
    setError(null);
    try {
      const resp = await Service.inviteQuotaControllerListCodes({
        page: 1,
        limit: 50,
        status: "unused" as any,
      });
      const data = extractData(resp);
      const items = (data?.items || []).map((it: any) => ({
        id: String(it.id),
        code: String(it.code),
        status: String(it.status) as InviteCode["status"],
        createdAt: formatDate(it.createdAt),
        usedAt: it.usedAt ? formatDate(it.usedAt) : undefined,
        usedBy: it.usedBy ? String(it.usedBy) : undefined,
        expiresAt: formatDate(it.expiresAt),
      }));
      setCodes(items);
    } catch (e: any) {
      setError(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!enabled) return;
    fetchCodes();
  }, [enabled]);

  return { codes, loading, error, refetch: fetchCodes };
}
