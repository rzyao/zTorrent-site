import { useEffect, useState } from "react";
import { App } from "antd";
import { TorrentsRecordService } from "@/api/services/TorrentsRecordService";
import { RecordItem, DownloadTab } from "../../RecordsShared/types";

export const useDownloadRecordsLogic = () => {
  const { message } = App.useApp();
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState<RecordItem[]>([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [tab, setTab] = useState<DownloadTab>("published");
  const [torrentId, setTorrentId] = useState("");
  const [userId, setUserId] = useState("");

  const load = async () => {
    setLoading(true);
    try {
      const q = {
        limit: pageSize,
        page,
        torrentId: torrentId || undefined,
        userId: userId || undefined,
      } as any;

      let resp: any;
      if (tab === "published") {
        resp = await TorrentsRecordService.torrentRecordControllerFindPublished(q);
      } else if (tab === "seeding") {
        resp = await TorrentsRecordService.torrentRecordControllerFindSeeding(q);
      } else if (tab === "downloading") {
        resp = await TorrentsRecordService.torrentRecordControllerFindDownloading(q);
      } else if (tab === "completed") {
        resp = await TorrentsRecordService.torrentRecordControllerFindCompleted(q);
      } else {
        resp = await TorrentsRecordService.torrentRecordControllerFindIncomplete(q);
      }

      const data = resp?.data ?? resp;
      const list = Array.isArray(data?.items)
        ? data.items
        : Array.isArray(data)
          ? data
          : Array.isArray(resp?.items)
            ? resp.items
            : [];
      setItems(list);
      setTotal(Number(resp?.data?.total ?? resp?.total ?? list.length));
    } catch (e: any) {
      message.error(e?.message || "加载记录失败");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [tab, page, pageSize]);

  return {
    loading,
    items,
    page,
    setPage,
    pageSize,
    setPageSize,
    total,
    tab,
    setTab,
    torrentId,
    setTorrentId,
    userId,
    setUserId,
    load,
  };
};
