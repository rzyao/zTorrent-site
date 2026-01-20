import { useCallback } from "react";
import { ForumsTopicsService } from "@/api";
import { SetTopicBountyDto } from "@/api/models/SetTopicBountyDto";
import { CancelTopicBountyRequestDto } from "@/api/models/CancelTopicBountyRequestDto";
import { AwardTopicBountyDto } from "@/api/models/AwardTopicBountyDto";
import { IncreaseTopicBountyDto } from "@/api/models/IncreaseTopicBountyDto";
import { customToast } from "@/hooks/useToast";
import { FORUM_BOUNTY_NOT_ALLOWED } from "../../../constants/messages";

export function useBountyActions(
  topicId: string | undefined,
  opts?: { onUpdated?: () => void; categoryKey?: string },
) {
  const onUpdated = opts?.onUpdated;
  const categoryKey = opts?.categoryKey;

  const ensureAllowed = () => {
    if (categoryKey !== "bounty") {
      customToast.error(FORUM_BOUNTY_NOT_ALLOWED);
      throw new Error(FORUM_BOUNTY_NOT_ALLOWED);
    }
  };

  const setBounty = useCallback(
    async (payload: Omit<SetTopicBountyDto, "topicId"> & { topicId?: string }) => {
      ensureAllowed();
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
    [topicId, onUpdated, categoryKey],
  );

  const requestCancel = useCallback(
    async (reason?: string) => {
      ensureAllowed();
      const body: CancelTopicBountyRequestDto = {
        topicId: topicId!,
        reason,
      };
      const res = await ForumsTopicsService.topicsControllerRequestCancelBounty(body);
      customToast.success("取消申请已提交");
      onUpdated?.();
      return res.data;
    },
    [topicId, onUpdated, categoryKey],
  );

  const award = useCallback(
    async (postId: string) => {
      ensureAllowed();
      const body: AwardTopicBountyDto = {
        topicId: topicId!,
        postId,
      };
      const res = await ForumsTopicsService.topicsControllerAwardBounty(body);
      customToast.success("已采纳并发放悬赏");
      onUpdated?.();
      return res.data;
    },
    [topicId, onUpdated, categoryKey],
  );

  const increase = useCallback(
    async (amountDelta: string) => {
      ensureAllowed();
      const body: IncreaseTopicBountyDto = {
        topicId: topicId!,
        amountDelta,
      };
      const res = await ForumsTopicsService.topicsControllerIncreaseBounty(body);
      const data = res.data;
      customToast.success("已追加悬赏金额");
      onUpdated?.();
      return data;
    },
    [topicId, onUpdated, categoryKey],
  );

  return { setBounty, requestCancel, award, increase };
}
