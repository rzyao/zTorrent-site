import { useEffect, useState } from "react";
import { App } from "antd";
import { useParams } from "react-router-dom";
import { TorrentsRecordService } from "@/api/services/TorrentsRecordService";
import { RecordItem, DownloadTab } from "../../RecordsShared/types";

export const useUserRecordsLogic = () => {
  const { message } = App.useApp();
  const params = useParams();
  const [userId, setUserId] = useState<string>(String(params.id || ""));
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState<RecordItem[]>([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [tab, setTab] = useState<DownloadTab>("completed");

  const load = async () => {
    if (!userId) return;
    setLoading(true);
    try {
      let resp: any;
      if (tab === "published")
        resp = await TorrentsRecordService.torrentRecordControllerFindPublished({
          userId,
          limit: pageSize,
          page,
        });
      else if (tab === "seeding")
        resp = await TorrentsRecordService.torrentRecordControllerFindSeeding({
          userId,
          limit: pageSize,
          page,
        });
      else if (tab === "downloading")
        resp = await TorrentsRecordService.torrentRecordControllerFindDownloading({
          userId,
          limit: pageSize,
          page,
        });
      else if (tab === "completed")
        resp = await TorrentsRecordService.torrentRecordControllerFindCompleted({
          userId,
          limit: pageSize,
          page,
        });
      else
        resp = await TorrentsRecordService.torrentRecordControllerFindIncomplete({
          userId,
          limit: pageSize,
          page,
        });
      const data = resp?.data ?? resp;
      const list = Array.isArray(data?.items)
        ? data.items
        : Array.isArray(data)
          ? data
          : Array.isArray(resp?.items)
            ? resp.items
            : [];
      setItems(list);
      setTotal(Number(resp?.data?.total ?? list.length));
    } catch (e: any) {
      message.error(e?.message || "加载下载记录失败");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [userId, tab, page, pageSize]);

  return {
    userId,
    setUserId,
    loading,
    items,
    page,
    setPage,
    pageSize,
    setPageSize,
    total,
    tab,
    setTab,
    load,
  };
};
