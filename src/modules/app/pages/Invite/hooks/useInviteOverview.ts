import { useEffect, useState } from "react";
import { Service } from "@/api/services/Service";
import { getBonusOverview } from "@/api/custom/bonus";
import { extractData } from ".@/utils/cn";

export interface InviteOverview {
  totalInvites: number;
  usedInvites: number;
  remainingInvites: number;
  invitedUsers: number;
  magicPoints: number;
}

export function useInviteOverview(enabled: boolean = true) {
  const [overview, setOverview] = useState<InviteOverview>({
    totalInvites: 0,
    usedInvites: 0,
    remainingInvites: 0,
    invitedUsers: 0,
    magicPoints: 0,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchOverview = async () => {
    setLoading(true);
    setError(null);
    try {
      const resp = await Service.inviteStatsControllerOverview({});
      const data = extractData(resp);
      const bonus = await getBonusOverview();
      const mp =
        typeof (bonus as any)?.balance === "string"
          ? parseFloat((bonus as any).balance)
          : Number((bonus as any)?.balance || 0);
      setOverview({
        totalInvites: Number(data?.totalInvites || 0),
        usedInvites: Number(data?.usedInvites || 0),
        remainingInvites: Number(data?.remainingInvites || 0),
        invitedUsers: Number(data?.invitedUsers || 0),
        magicPoints: mp,
      });
    } catch (e: any) {
      setError(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!enabled) return;
    fetchOverview();
  }, [enabled]);

  return { overview, loading, error, refetch: fetchOverview };
}
