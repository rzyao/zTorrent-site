import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuTrigger,
} from "@/modules/app/components/ui/context-menu";
import { Download, Upload } from "lucide-react";
import { PageContainer } from "@/modules/app/components/PageContainer";
import { useTorrentDownload } from "@/modules/app/hooks/useTorrentDownload";
import { useDownloaders } from "@/modules/app/context/DownloadersContext";
import { useSourceTracker } from "@/modules/app/hooks/useSourceTracker";
import { customToast } from "@/hooks/useToast";
import { DownloadsService } from "@/api/services/DownloadsService";
import { DownloadersService } from "@/api/services/DownloadersService";
import { useDynamicTitle } from "@/hooks/useDynamicTitle";
import { useLanguage } from "@/hooks/useLanguage";
import { useTorrentDetailLogic } from "./hooks/useTorrentDetailLogic";
import { TorrentHeader } from "./components/TorrentHeader";
import { TorrentDescription } from "./components/TorrentDescription";
import { StillsGallery } from "@/modules/app/components/media/StillsGallery";
import { TorrentMediaInfo } from "./components/TorrentMediaInfo";
import { TorrentFileList } from "./components/TorrentFileList";
import { CommentsSection } from "@/modules/app/components/CommentsSection";
import { TorrentDetailPageProps, TorrentData } from "./types";

export default function TorrentDetailPage({ torrentId }: TorrentDetailPageProps) {
  const { data, isLoading, error, effectiveId, favorite } = useTorrentDetailLogic(torrentId);
  const { downloadByTorrentId } = useTorrentDownload();
  const { downloaders } = useDownloaders();
  const { sourcePayload } = useSourceTracker();
  const { t } = useLanguage();

  // 默认空数据结构以防 crash，等待 loading 结束
  const safeData: TorrentData =
    data?.torrentData ||
    ({
      id: 0,
      title: "",
      subTitle: "",
      category: "",
      videoCodec: "",
      standard: "",
      audioCodec: "",
      medium: "",
      productionTeam: "",
      size: "0",
      uploadDate: "",
      seeders: 0,
      leechers: 0,
      completed: 0,
      comments: 0,
      thanks: 0,
      rating: 0,
      imdb: "",
      douban: "",
      uploader: "",
      uploaderLevel: "",
      isFree: false,
      promotionEnd: "",
      views: 0,
      description: "",
      downloadUrl: "",
    } as TorrentData);

  useDynamicTitle(safeData.title || t("torrents.detailTitle"));

  // 发送到下载器逻辑
  const handleSendToDownloader = async (downloaderId: string, path?: string) => {
    if (!effectiveId) return;
    try {
      const source = sourcePayload ?? { filmId: "", playListId: "" };
      const resp = await DownloadsService.downloadsControllerCreateDownloadUrl({
        torrentId: String(effectiveId),
        source,
      });
      const body: any = (resp as any)?.code !== undefined ? resp : (resp as any)?.data;
      const resData = body?.data ?? body;
      const downloadTokenUrl = String(resData?.url ?? "");

      if (!downloadTokenUrl) {
        customToast.error(t("torrents.cannotGenerateLink"));
        return;
      }

      await DownloadersService.downloadersControllerDownload({
        id: downloaderId,
        url: downloadTokenUrl,
        path: path,
      });

      customToast.success(t("torrents.sentToDownloader"));
    } catch (e: any) {
      // Global interceptor handles API errors
    }
  };

  return (
    <ContextMenu>
      <ContextMenuTrigger className="block min-h-screen w-full">
        <PageContainer>
          <div className="mx-auto max-w-[1400px]">
            {/* Header Area */}
            <TorrentHeader
              data={safeData}
              loading={isLoading}
              error={error ? String(error) : null}
              favorite={favorite}
            />

            <div className="space-y-6">
              {/* Main Content Area */}
              <div className="space-y-6">
                {/* 1. Description */}
                <TorrentDescription description={safeData.description} />

                {/* 2. Stills */}
                {effectiveId && (
                  <StillsGallery attachableType="torrent" attachableId={String(effectiveId)} />
                )}

                {/* 3. MediaInfo */}
                <TorrentMediaInfo mediaInfo={data?.mediaInfo || ""} />

                {/* 4. File List */}
                <TorrentFileList fileList={data?.fileList || []} />

                {/* 5. Comments */}
                {effectiveId && (
                  <CommentsSection
                    entityType="torrent"
                    entityId={String(effectiveId)}
                    title={safeData.title}
                  />
                )}
              </div>
            </div>
          </div>
        </PageContainer>
      </ContextMenuTrigger>

      {/* Context Menu Content */}
      <ContextMenuContent className="w-48">
        <ContextMenuItem
          disabled={!safeData.id}
          onSelect={() => {
            if (safeData.id) {
              downloadByTorrentId(String(safeData.id), String(safeData.title || "download"));
            }
          }}
        >
          <Download className="mr-2 h-4 w-4" /> {t("torrents.downloadTorrent")}
        </ContextMenuItem>

        <ContextMenuSeparator />

        {/* 发送到下载器逻辑 */}
        {downloaders.length === 0 ? (
          <ContextMenuItem disabled>
            <Upload className="mr-2 h-4 w-4" /> {t("torrents.noDownloaders")}
          </ContextMenuItem>
        ) : downloaders.length === 1 ? (
          (() => {
            const downloader = downloaders[0];
            const paths = downloader.downloadPaths || [];
            if (paths.length > 0) {
              return (
                <ContextMenuSub>
                  <ContextMenuSubTrigger>
                    <Upload className="mr-2 h-4 w-4" /> {t("torrents.sendToDownloader")}
                  </ContextMenuSubTrigger>
                  <ContextMenuSubContent className="w-48">
                    {paths.map((p, idx) => (
                      <ContextMenuItem
                        key={idx}
                        onSelect={() => handleSendToDownloader(String(downloader.id), p.path)}
                      >
                        {p.name || p.path}
                      </ContextMenuItem>
                    ))}
                  </ContextMenuSubContent>
                </ContextMenuSub>
              );
            } else {
              return (
                <ContextMenuItem onSelect={() => handleSendToDownloader(String(downloader.id))}>
                  <Upload className="mr-2 h-4 w-4" />{" "}
                  {t("torrents.sendTo", { name: downloader.name })}
                </ContextMenuItem>
              );
            }
          })()
        ) : (
          <ContextMenuSub>
            <ContextMenuSubTrigger>
              <Upload className="mr-2 h-4 w-4" /> {t("torrents.sendToDownloader")}
            </ContextMenuSubTrigger>
            <ContextMenuSubContent className="w-48">
              {downloaders.map((d) => {
                const paths = d.downloadPaths || [];
                if (paths.length > 0) {
                  return (
                    <ContextMenuSub key={d.id}>
                      <ContextMenuSubTrigger>{d.name}</ContextMenuSubTrigger>
                      <ContextMenuSubContent className="w-48">
                        {paths.map((p, idx) => (
                          <ContextMenuItem
                            key={idx}
                            onSelect={() => handleSendToDownloader(String(d.id), p.path)}
                          >
                            {p.name || p.path}
                          </ContextMenuItem>
                        ))}
                      </ContextMenuSubContent>
                    </ContextMenuSub>
                  );
                } else {
                  return (
                    <ContextMenuItem
                      key={d.id}
                      onSelect={() => handleSendToDownloader(String(d.id))}
                    >
                      {d.name}
                    </ContextMenuItem>
                  );
                }
              })}
            </ContextMenuSubContent>
          </ContextMenuSub>
        )}
      </ContextMenuContent>
    </ContextMenu>
  );
}
