import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { Upload, X, Download } from "lucide-react";
import { useDownloaders } from "@/context/DownloadersContext";
import { useSendToDownloader } from "@/hooks/useSendToDownloader";
import { useTorrentDownload } from "@/utils/useTorrentDownload";
import { Button } from "@/components/ui/button";
import { NativeSelect } from "@/components/ui/native-select";

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
    const success = await sendToDownloader({
      torrentId,
      source,
      downloaderId: selectedDownloaderId,
      path: selectedPath || undefined,
    });
    if (success) {
      onClose();
    }
  };

  const handleLocalDownload = () => {
    downloadByTorrentId(torrentId, torrentTitle || "download");
    onClose();
  };

  if (!open) return null;

  return createPortal(
    <div className="modal-overlay fixed inset-0 bg-black/70 z-50 flex items-center justify-center">
      <div className="bg-neutral-900 rounded-2xl border border-neutral-700 w-full max-w-md m-4 flex flex-col shadow-2xl">
        {/* Header */}
        <div className="p-6 pb-4 border-b border-neutral-800 flex items-center justify-between">
          <h3 className="text-white text-lg font-medium flex items-center gap-2">
            <Upload className="w-5 h-5 text-amber-500" />
            发送到下载器
          </h3>
          <button
            onClick={onClose}
            className="text-neutral-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6">
          {/* 本地下载选项 */}
          <div className="flex items-center justify-between bg-neutral-800/50 p-3 rounded-xl border border-neutral-700/50">
            <span className="text-sm text-neutral-400 pl-1">
              不推送到下载器
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLocalDownload}
              className="text-amber-500 hover:text-amber-400 hover:bg-amber-500/10 h-8"
            >
              <Download className="w-4 h-4 mr-2" />
              下载到本地
            </Button>
          </div>

          <div className="w-full h-px bg-neutral-800"></div>

          {downloaders.length === 0 ? (
            <div className="text-center py-2">
              <p className="text-neutral-400 mb-4">
                未找到可用的下载器，请先要在控制台添加。
              </p>
              <Button
                onClick={onClose}
                variant="outline"
                className="border-neutral-700 text-white"
              >
                关闭
              </Button>
            </div>
          ) : (
            <>
              <div className="space-y-3">
                <label className="text-sm text-neutral-400 block">
                  选择下载器
                </label>
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
                  <label className="text-sm text-neutral-400 block">
                    选择下载路径
                  </label>
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
          <div className="p-6 pt-0 flex gap-3">
            <Button
              className="flex-1 bg-neutral-800 hover:bg-neutral-700 text-white h-11 rounded-xl"
              onClick={onClose}
            >
              取消
            </Button>
            <Button
              className="flex-1 general-button h-11 rounded-xl"
              onClick={handleSubmit}
              disabled={sending || !selectedDownloaderId}
            >
              {sending ? "发送中..." : "确定发送"}
            </Button>
          </div>
        )}
      </div>
    </div>,
    document.body
  );
}
