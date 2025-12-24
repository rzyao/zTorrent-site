import React from "react";
import { useDynamicTitle } from "@/hooks/useDynamicTitle";
import { useNavigate } from "react-router-dom";
import { Upload, Info } from "lucide-react";
import { BasicInfo } from "@/pages/UploadTorrent/components/BasicInfo";
import { QualityInfo } from "@/pages/UploadTorrent/components/QualityInfo";
import { ExtendedInfo } from "@/pages/UploadTorrent/components/ExtendedInfo";
import { Images } from "@/pages/UploadTorrent/components/Images";
import { PublishOptions } from "@/pages/UploadTorrent/components/PublishOptions";
import { SubmitBar } from "@/pages/UploadTorrent/components/SubmitBar";
import { useUploadTorrent } from "@/pages/UploadTorrent/hooks/useUploadTorrent";

/**
 * UploadTorrentPage
 * 容器组件：
 * - 设置页面标题；
 * - 组合各无状态子组件；
 * - 不直接包含业务逻辑，所有状态与方法来源于 `useUploadTorrent`。
 */
export default function UploadTorrentPage() {
  useDynamicTitle("上传");
  const navigate = useNavigate();
  const U = useUploadTorrent();

  return (
    <div className="min-h-screen bg-[#0F171E]">
      <div className="max-w-[1400px] mx-auto px-4 md:px-8 py-8">
        {/* 页面标题 */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-linear-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-lg shadow-amber-500/30">
              <Upload className="w-5 h-5 text-white" />
            </div>
            <div className="flex flex-row items-center gap-3">
              <h1 className="text-white text-3xl">发布种子</h1>
              <p className="text-neutral-400 text-sm mt-1">
                <span className="text-red-400">*</span> 标记为必填项
              </p>
            </div>
          </div>
        </div>

        {/* 上传表单：以无状态组件组合形式呈现 */}
        <form className="space-y-6" onSubmit={U.handleSubmit}>
          {/* 基本信息 */}
          <BasicInfo
            mainCategories={U.mainCategories}
            selectedCategory={U.selectedCategory}
            selectedTags={U.selectedTags}
            tags={U.tags}
            onChangeCategory={U.setSelectedCategory}
            onClearTags={U.handleClearTags}
            onToggleTag={U.toggleTag}
            onTorrentInputChange={U.onTorrentInputChange}
            title={U.title}
            onTitleChange={U.setTitle}
            subTitle={U.subTitle}
            onSubTitleChange={U.setSubTitle}
          />

          {/* 质量信息 */}
          <QualityInfo
            resolutionOptions={U.resolutionOptions}
            videoStandard={U.videoStandard}
            onVideoStandardChange={U.setVideoStandard}
            videoCodecOptions={U.videoCodecOptions}
            videoFormat={U.videoFormat}
            onVideoFormatChange={U.setVideoFormat}
            audioCodecOptions={U.audioCodecOptions}
            audioFormat={U.audioFormat}
            onAudioFormatChange={U.setAudioFormat}
            productionTeam={U.productionTeam}
            onProductionTeamChange={U.setProductionTeam}
            mediaInfoText={U.mediaInfoText}
            onMediaInfoChange={U.handleMediaInfoChange}
            mediaInfo={U.mediaInfo}
          />

          {/* 扩展信息 */}
          <ExtendedInfo
            countryOptions={U.countryOptions}
            region={U.region}
            onRegionChange={U.setRegion}
            imdbUrl={U.imdbUrl}
            onImdbUrlChange={U.setImdbUrl}
            doubanUrl={U.doubanUrl}
            onDoubanUrlChange={U.setDoubanUrl}
            ptGenUrl={U.ptGenUrl}
            onPtGenUrlChange={U.setPtGenUrl}
            onFetchPtGen={U.fetchPtGen}
            ptGenLoading={U.ptGenLoading}
            ptGenError={U.ptGenError}
            languageOptions={U.languageOptions}
            selectedLanguages={U.selectedLanguages}
            onToggleLanguage={U.toggleLanguage}
            subtitleOptions={U.subtitleOptions}
            selectedSubtitles={U.selectedSubtitles}
            onToggleSubtitle={U.toggleSubtitle}
          />

          {/* 简介 */}
          <div className="bg-neutral-800/40 backdrop-blur-sm rounded-2xl border border-neutral-700/50 shadow-2xl overflow-hidden">
            <div className="bg-linear-to-r from-red-500/20 to-orange-500/20 border-b border-neutral-700/50 px-6 py-3.5">
              <h2 className="text-white flex items-center gap-2">
                简介 <span className="text-red-400 text-sm ml-1">*</span>
              </h2>
            </div>
            <div className="p-6">
              <textarea
                rows={15}
                placeholder="请输入资源简介，支持BBCode格式...&#10;&#10;例如：&#10;[b]粗体文字[/b]&#10;[i]斜体文字[/i]&#10;[img]图片链接[/img]&#10;[url]链接地址[/url]"
                className="w-full bg-neutral-900/60 border border-neutral-700/60 rounded-lg px-4 py-3 text-white text-sm placeholder:text-neutral-500 focus:border-red-500 focus:ring-2 focus:ring-red-500/30 outline-none resize-none transition-all scrollbar-themed"
                value={U.description}
                onChange={(e) => U.handleDescriptionChange(e.target.value)}
              />
              <p className="text-neutral-500 text-xs mt-3">
                支持BBCode格式，如 [b]粗体[/b] [i]斜体[/i] [img]图片链接[/img]
              </p>
            </div>
          </div>

          {/* 图片上传 */}
          <Images
            uploadedPoster={U.uploadedPoster}
            onPosterRemove={U.handlePosterRemove}
            posterUploading={U.posterUploading}
            posterInputRef={U.posterInputRef}
            onPosterInputChange={U.onPosterInputChange}
            onSetPosterUrl={U.handlePosterUrlChange}
            screenshots={U.screenshots}
            onRemoveScreenshot={U.handleRemoveScreenshot}
            shotsUploading={U.shotsUploading}
            shotsInputRef={U.shotsInputRef}
            onShotsInputChange={U.onShotsInputChange}
            onAddScreenshotUrl={U.handleAddScreenshotUrl}
          />

          {/* 发布选项 */}
          <PublishOptions
            isAnonymous={U.isAnonymous}
            onAnonymousChange={U.setIsAnonymous}
          />

          {/* 提交按钮 */}
          <SubmitBar submitting={U.submitting} onCancel={U.handleCancel} />
        </form>

        {/* 发布须知 */}
        <div className="mt-8 bg-neutral-800/30 backdrop-blur-sm rounded-2xl border border-neutral-700/50 p-6">
          <h3 className="text-white flex items-center gap-2 mb-4">
            <Info className="w-5 h-5 text-amber-400" />
            发布须知
          </h3>
          <ul className="space-y-2.5 text-neutral-400 text-sm">
            <li className="flex items-start gap-3">
              <span className="text-amber-400 mt-0.5">•</span>
              <span>请确保上传的种子文件来源合法，不包含违法违规内容</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-amber-400 mt-0.5">•</span>
              <span>种子标题应准确描述资源内容，包含必要的技术信息</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-amber-400 mt-0.5">•</span>
              <span>
                建议填写 MediaInfo 或 BDInfo 技术信息，便于用户了解资源质量
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-amber-400 mt-0.5">•</span>
              <span>请在发布后至少保持做种 7 天，确保其他用户能够下载</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-amber-400 mt-0.5">•</span>
              <span>违规发布内容可能导致账号被封禁，请遵守站点规则</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
