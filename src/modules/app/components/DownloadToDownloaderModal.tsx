import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { Upload, X, Download } from "lucide-react";
import { useDownloaders } from "@/modules/app/context/DownloadersContext";
import { useSendToDownloader } from "@/modules/app/hooks/useSendToDownloader";
import { useTorrentDownload } from "@/modules/app/hooks/useTorrentDownload";
import { Button } from "@/modules/app/components/ui/button";
import { NativeSelect } from "@/modules/app/components/ui/native-select";
import { useDownloadStatusStore } from "@/modules/app/stores/downloadStatusStore";

interface Props {
  open: boolean;
  onClose: () => void;
  torrentId: string;
  torrentTitle?: string;
  source?: {
    filmId?: string;
    playListId?: string;
  };
}

export function DownloadToDownloaderModal({
  open,
  onClose,
  torrentId,
  torrentTitle,
  source,
}: Props) {
  const { downloaders } = useDownloaders();
  const { sendToDownloader, sending } = useSendToDownloader();
  const { downloadByTorrentId } = useTorrentDownload();
  const setDownloadStatus = useDownloadStatusStore((state) => state.setStatus);

  const [selectedDownloaderId, setSelectedDownloaderId] = useState<string>("");
  const [selectedPath, setSelectedPath] = useState<string>("");
  const [pathOptions, setPathOptions] = useState<
    Array<{ name?: string; path?: string; freeSpace?: number }>
  >([]);

  // 弹窗打开时初始化选中状态
  useEffect(() => {
    if (open && downloaders.length > 0) {
      const firstDownloader = downloaders[0];
      setSelectedDownloaderId(firstDownloader.id || "");
      const paths = firstDownloader.downloadPaths || [];
      setPathOptions(paths);
      setSelectedPath(paths.length > 0 ? paths[0].path || "" : "");
    }
  }, [open, downloaders]);

  // 用户切换下载器时更新路径选项
  const handleDownloaderChange = (newId: string) => {
    setSelectedDownloaderId(newId);
    const downloader = downloaders.find((d) => d.id === newId);
    const paths = downloader?.downloadPaths || [];
    setPathOptions(paths);
    setSelectedPath(paths.length > 0 ? paths[0].path || "" : "");
  };

  const handleSubmit = async () => {
    setDownloadStatus(torrentId, "loading");
    try {
      const success = await sendToDownloader({
        torrentId,
        source,
        downloaderId: selectedDownloaderId,
        path: selectedPath || undefined,
      });
      if (success) {
        setDownloadStatus(torrentId, "success");
        onClose();
      } else {
        setDownloadStatus(torrentId, "idle");
      }
    } catch {
      setDownloadStatus(torrentId, "idle");
    }
  };

  const handleLocalDownload = async () => {
    setDownloadStatus(torrentId, "loading");
    try {
      await downloadByTorrentId(torrentId, torrentTitle || "download");
      setDownloadStatus(torrentId, "success");
    } catch {
      setDownloadStatus(torrentId, "idle");
    }
    onClose();
  };

  if (!open) return null;

  return createPortal(
    <div className="modal-overlay fixed inset-0 z-50 flex items-center justify-center bg-black/70">
      <div className="m-4 flex w-full max-w-md flex-col rounded-2xl border border-neutral-700 bg-neutral-900 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-neutral-800 p-6 pb-4">
          <h3 className="flex items-center gap-2 text-lg font-medium text-white">
            <Upload className="h-5 w-5 text-amber-500" />
            发送到下载器
          </h3>
          <button onClick={onClose} className="text-neutral-400 transition-colors hover:text-white">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Body */}
        <div className="space-y-6 p-6">
          {/* 本地下载选项 */}
          <div className="flex items-center justify-between rounded-xl border border-neutral-700/50 bg-neutral-800/50 p-3">
            <span className="pl-1 text-sm text-neutral-400">不推送到下载器</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLocalDownload}
              className="h-8 text-amber-500 hover:bg-amber-500/10 hover:text-amber-400"
            >
              <Download className="mr-2 h-4 w-4" />
              下载到本地
            </Button>
          </div>

          <div className="h-px w-full bg-neutral-800"></div>

          {downloaders.length === 0 ? (
            <div className="py-2 text-center">
              <p className="mb-4 text-neutral-400">未找到可用的下载器，请先要在控制台添加。</p>
              <Button onClick={onClose} variant="outline" className="border-neutral-700 text-white">
                关闭
              </Button>
            </div>
          ) : (
            <>
              <div className="space-y-3">
                <label className="block text-sm text-neutral-400">选择下载器</label>
                <NativeSelect
                  value={selectedDownloaderId}
                  onChange={handleDownloaderChange}
                  options={downloaders.map((d) => ({
                    value: d.id || "",
                    label: d.name || "未命名",
                  }))}
                  placeholder="选择下载器"
                />
              </div>

              {pathOptions.length > 0 && (
                <div className="space-y-3">
                  <label className="block text-sm text-neutral-400">选择下载路径</label>
                  <NativeSelect
                    value={selectedPath}
                    onChange={setSelectedPath}
                    options={pathOptions.map((p) => ({
                      value: p.path || "",
                      label: p.name || p.path || "默认路径",
                    }))}
                    placeholder="选择路径"
                  />
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        {downloaders.length > 0 && (
          <div className="flex gap-3 p-6 pt-0">
            <Button
              className="h-11 flex-1 rounded-xl bg-neutral-800 text-white hover:bg-neutral-700"
              onClick={onClose}
            >
              取消
            </Button>
            <Button
              variant="outline"
              className="h-11 flex-1 rounded-xl border-[#92702a] bg-transparent text-[#d4a733] hover:border-[#d4a733] hover:bg-[#d4a733]/10 hover:text-[#e8bc4a]"
              onClick={handleSubmit}
              disabled={sending || !selectedDownloaderId}
            >
              {sending ? "发送中..." : "确定发送"}
            </Button>
          </div>
        )}
      </div>
    </div>,
    document.body,
  );
}
