import { useCallback } from "react";
import { ForumsTopicsService } from "@/api";
import { SetTopicBountyDto } from "@/api/models/SetTopicBountyDto";
import { CancelTopicBountyRequestDto } from "@/api/models/CancelTopicBountyRequestDto";
import { AwardTopicBountyDto } from "@/api/models/AwardTopicBountyDto";
import { customToast } from "@/hooks/useToast";
import axios from "axios";

export function useBountyActions(topicId: string | undefined, opts?: { onUpdated?: () => void }) {
  const onUpdated = opts?.onUpdated;

  const setBounty = useCallback(
    async (payload: Omit<SetTopicBountyDto, "topicId"> & { topicId?: string }) => {
      const body: SetTopicBountyDto = {
        topicId: payload.topicId || topicId!,
        amount: payload.amount,
        expiresAt: payload.expiresAt,
        durationDays: payload.durationDays,
      };
      const res = await ForumsTopicsService.topicsControllerSetBounty(body);
      customToast.success("悬赏设置成功");
      onUpdated?.();
      return res.data;
    },
    [topicId, onUpdated],
  );

  const requestCancel = useCallback(
    async (reason?: string) => {
      const body: CancelTopicBountyRequestDto = {
        topicId: topicId!,
        reason,
      };
      const res = await ForumsTopicsService.topicsControllerRequestCancelBounty(body);
      customToast.success("取消申请已提交");
      onUpdated?.();
      return res.data;
    },
    [topicId, onUpdated],
  );

  const award = useCallback(
    async (postId: string) => {
      const body: AwardTopicBountyDto = {
        topicId: topicId!,
        postId,
      };
      const res = await ForumsTopicsService.topicsControllerAwardBounty(body);
      customToast.success("已采纳并发放悬赏");
      onUpdated?.();
      return res.data;
    },
    [topicId, onUpdated],
  );

  const increase = useCallback(
    async (amountDelta: string) => {
      const res = await axios.post("/forums/topics/bounty/increase", {
        topicId: topicId!,
        amountDelta,
      });
      const data = (res.data as any)?.data;
      customToast.success("已追加悬赏金额");
      onUpdated?.();
      return data;
    },
    [topicId, onUpdated],
  );

  return { setBounty, requestCancel, award, increase };
}
