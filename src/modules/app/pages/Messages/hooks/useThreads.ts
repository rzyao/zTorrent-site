import { useEffect, useState } from "react";
import { toast } from "sonner";
import { MessagesService } from "@/api/services/MessagesService";
import { unwrapResponse, extractErrorMessage } from "../utils/utils";
import type { IThreadSummary, IMessage } from "../types/types";

export function useThreads() {
  const [threadsPage, setThreadsPage] = useState(1);
  const [threadsLimit, setThreadsLimit] = useState(20);
  const [activePeerUserId, setActivePeerUserId] = useState<string | null>(null);
  const [timelinePage, setTimelinePage] = useState(1);
  const [timelineLimit, setTimelineLimit] = useState(50);
  const [threadSummaries, setThreadSummaries] = useState<IThreadSummary[]>([]);
  const [threadMessages, setThreadMessages] = useState<IMessage[]>([]);

  const loadThreads = async () => {
    try {
      const resp = await MessagesService.messagesControllerThreads({
        page: threadsPage,
        limit: threadsLimit,
      });
      const data = unwrapResponse<{
        items: IThreadSummary[];
        total: number;
        page: number;
        limit: number;
      }>(resp);
      setThreadSummaries(Array.isArray(data?.items) ? data.items : []);
    } catch (err: any) {
      toast.error(extractErrorMessage(err));
    }
  };

  const loadThreadMessages = async (peerUserId: string) => {
    try {
      const resp = await MessagesService.messagesControllerListMessages({
        peerUserId,
        page: timelinePage,
        limit: timelineLimit,
      });
      const data = unwrapResponse<{
        items: IMessage[];
        total: number;
        page: number;
        limit: number;
      }>(resp);
      setThreadMessages(Array.isArray(data?.items) ? data.items : []);
      await MessagesService.messagesControllerMarkRead({ peerUserId });
    } catch (err: any) {
      toast.error(extractErrorMessage(err));
    }
  };

  useEffect(() => {
    loadThreads();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [threadsPage, threadsLimit]);

  const clearThreadMessages = () => setThreadMessages([]);

  return {
    threadsPage,
    setThreadsPage,
    threadsLimit,
    setThreadsLimit,
    activePeerUserId,
    setActivePeerUserId,
    timelinePage,
    setTimelinePage,
    timelineLimit,
    setTimelineLimit,
    threadSummaries,
    threadMessages,
    loadThreads,
    loadThreadMessages,
    clearThreadMessages,
  } as const;
}
