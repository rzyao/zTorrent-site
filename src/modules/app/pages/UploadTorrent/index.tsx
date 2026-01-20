import React from "react";
import { useDynamicTitle } from "@/hooks/useDynamicTitle";
import { useLanguage } from "@/hooks/useLanguage";
import { useNavigate } from "react-router-dom";
import { Upload, Info } from "lucide-react";
import { BasicInfo } from "@/modules/app/pages/UploadTorrent/components/BasicInfo";
import { QualityInfo } from "@/modules/app/pages/UploadTorrent/components/QualityInfo";
import { ExtendedInfo } from "@/modules/app/pages/UploadTorrent/components/ExtendedInfo";
import { Images } from "@/modules/app/pages/UploadTorrent/components/Images";
import { PublishOptions } from "@/modules/app/pages/UploadTorrent/components/PublishOptions";
import { SubmitBar } from "@/modules/app/pages/UploadTorrent/components/SubmitBar";
import { useUploadTorrent } from "@/modules/app/pages/UploadTorrent/hooks/useUploadTorrent";

/**
 * UploadTorrentPage
 * 容器组件：
 * - 设置页面标题；
 * - 组合各无状态子组件；
 * - 不直接包含业务逻辑，所有状态与方法来源于 `useUploadTorrent`。
 */
export default function UploadTorrentPage() {
  const { t } = useLanguage();
  useDynamicTitle(t('upload.title'));
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
              <h1 className="text-white text-3xl">{t('upload.title')}</h1>
              <p className="text-neutral-400 text-sm mt-1">
                <span className="text-red-400">*</span> {t('upload.requiredHint').replace('* ', '')}
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
                {t('upload.description')} <span className="text-red-400 text-sm ml-1">*</span>
              </h2>
            </div>
            <div className="p-6">
              <textarea
                rows={15}
                placeholder={t('upload.descriptionPlaceholder')}
                className="w-full bg-neutral-900/60 border border-neutral-700/60 rounded-lg px-4 py-3 text-white text-sm placeholder:text-neutral-500 focus:border-red-500 focus:ring-2 focus:ring-red-500/30 outline-none resize-none transition-all scrollbar-themed"
                value={U.description}
                onChange={(e) => U.handleDescriptionChange(e.target.value)}
              />
              <p className="text-neutral-500 text-xs mt-3">
                {t('upload.descriptionHelp')}
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
            {t('upload.notice')}
          </h3>
          <ul className="space-y-2.5 text-neutral-400 text-sm">
            <li className="flex items-start gap-3">
              <span className="text-amber-400 mt-0.5">•</span>
              <span>{t('upload.noticeList.item1')}</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-amber-400 mt-0.5">•</span>
              <span>{t('upload.noticeList.item2')}</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-amber-400 mt-0.5">•</span>
              <span>{t('upload.noticeList.item3')}</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-amber-400 mt-0.5">•</span>
              <span>{t('upload.noticeList.item4')}</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-amber-400 mt-0.5">•</span>
              <span>{t('upload.noticeList.item5')}</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
