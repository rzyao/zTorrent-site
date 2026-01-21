import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useParams } from "react-router-dom";
import { TorrentsRecordService } from "@/api/services/TorrentsRecordService";
import { RecordItem, DownloadTab } from "../../RecordsShared/types";

export const useTorrentRecordsLogic = () => {
  const params = useParams();
  const [torrentId, setTorrentId] = useState<string>(String(params.id || ""));
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState<RecordItem[]>([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [tab, setTab] = useState<DownloadTab>("completed");

  const load = async () => {
    if (!torrentId) {
      setItems([]);
      setTotal(0);
      return;
    }
    setLoading(true);
    try {
      let resp: any;
      if (tab === "published")
        resp = await TorrentsRecordService.torrentRecordControllerPublishedToorrent({
          torrentId,
          limit: pageSize,
          page,
        });
      else if (tab === "seeding")
        resp = await TorrentsRecordService.torrentRecordControllerSeedingToorrent({
          torrentId,
          limit: pageSize,
          page,
        });
      else if (tab === "downloading")
        resp = await TorrentsRecordService.torrentRecordControllerDownloadingToorrent({
          torrentId,
          limit: pageSize,
          page,
        });
      else if (tab === "completed")
        resp = await TorrentsRecordService.torrentRecordControllerCompletedToorrent({
          torrentId,
          limit: pageSize,
          page,
        });
      else
        resp = await TorrentsRecordService.torrentRecordControllerIncompleteToorrent({
          torrentId,
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
      toast.error(e?.message || "加载下载记录失败");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [torrentId, tab, page, pageSize]);

  return {
    torrentId,
    setTorrentId,
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
