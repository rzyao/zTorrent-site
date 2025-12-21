import {
  Settings,
  User,
  Shield,
  Bell,
  Eye,
  Save,
  Download,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { SidebarNav } from "./components/SidebarNav";
import { UserStatsCard } from "./components/UserStatsCard";
import { ProfileTab } from "./components/tabs/ProfileTab";
import { PreferencesTab } from "./components/tabs/PreferencesTab";
import { SecurityTab } from "./components/tabs/SecurityTab";
import { NotificationsTab } from "./components/tabs/NotificationsTab";
import { PrivacyTab } from "./components/tabs/PrivacyTab";
import { DownloaderTab } from "./components/tabs/DownloaderTab";
import { useControlState } from "./hooks/useControlState";
import { usePasswordForm } from "./hooks/usePasswordForm";
import type { TabType } from "./types";

// 控制台页面入口
// 职责：拼装左右布局、Tab 切换与保存区，承载公共状态 Hook 并向各 Tab 下发
export function ControlPage() {
  const state = useControlState();
  const passwordForm = usePasswordForm();

  const tabs = [
    { id: "profile" as TabType, label: "个人信息", icon: User },
    { id: "preferences" as TabType, label: "网站偏好", icon: Settings },
    { id: "security" as TabType, label: "安全设置", icon: Shield },
    { id: "notifications" as TabType, label: "通知设置", icon: Bell },
    { id: "privacy" as TabType, label: "隐私设置", icon: Eye },
    { id: "downloader" as TabType, label: "下载器", icon: Download },
  ];

  return (
    <div className="min-h-screen bg-[#0F171E]">
      <div className="max-w-[1600px] mx-auto px-4 md:px-8 py-8">
        {/* 页面标题 */}
        <div className="mb-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-linear-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-lg shadow-amber-500/30">
              <Settings className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-white text-3xl">控制面板</h1>
              <p className="text-neutral-400 text-sm mt-1">
                管理您的账户设置和个人偏好
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* 左侧导航 */}
          <div className="lg:col-span-1">
            <SidebarNav
              tabs={tabs}
              activeTab={state.activeTab}
              onChange={state.setActiveTab}
            />
            {/* <div className="mt-6">
              <UserStatsCard avatar={state.profileData.avatar} username={state.profileData.username} />
            </div> */}
          </div>

          {/* 右侧内容区 */}
          <div className="lg:col-span-3">
            <div className="bg-linear-to-br from-neutral-800/40 to-stone-900/40 backdrop-blur-sm rounded-2xl border border-neutral-700/50 p-6 md:p-8">
              {/* 个人信息 */}
              {state.activeTab === "profile" && (
                <div className="space-y-6">
                  <ProfileTab
                    profileData={state.profileData}
                    setProfileData={state.setProfileData}
                  />
                </div>
              )}

              {/* 网站偏好 */}
              {state.activeTab === "preferences" && (
                <PreferencesTab
                  adultMode={state.adultMode}
                  setAdultMode={state.setAdultMode}
                  preferences={state.preferences}
                  setPreferences={state.setPreferences}
                  torrentCategoryOptions={state.torrentCategoryOptions}
                  selectedTorrentCategories={state.selectedTorrentCategories}
                  setSelectedTorrentCategories={
                    state.setSelectedTorrentCategories
                  }
                  movieGenreOptions={state.movieGenreOptions}
                  selectedMovieGenres={state.selectedMovieGenres}
                  setSelectedMovieGenres={state.setSelectedMovieGenres}
                  seriesGenreOptions={state.seriesGenreOptions}
                  selectedSeriesGenres={state.selectedSeriesGenres}
                  setSelectedSeriesGenres={state.setSelectedSeriesGenres}
                />
              )}

              {/* 安全设置 */}
              {state.activeTab === "security" && (
                <SecurityTab
                  security={state.security}
                  setSecurity={state.setSecurity}
                  currentPassword={passwordForm.currentPassword}
                  setCurrentPassword={passwordForm.setCurrentPassword}
                  newPassword={passwordForm.newPassword}
                  setNewPassword={passwordForm.setNewPassword}
                  confirmNewPassword={passwordForm.confirmNewPassword}
                  setConfirmNewPassword={passwordForm.setConfirmNewPassword}
                  passwordErrors={passwordForm.passwordErrors}
                  canUpdatePassword={passwordForm.canUpdatePassword}
                  handleUpdatePassword={passwordForm.handleUpdatePassword}
                />
              )}

              {/* 通知设置 */}
              {state.activeTab === "notifications" && (
                <NotificationsTab
                  notifications={state.notifications}
                  setNotifications={state.setNotifications}
                />
              )}

              {/* 隐私设置 */}
              {state.activeTab === "privacy" && (
                <PrivacyTab
                  privacy={state.privacy}
                  setPrivacy={state.setPrivacy}
                />
              )}

              {/* 下载器设置 */}
              {state.activeTab === "downloader" && <DownloaderTab />}

              {state.activeTab !== "profile" &&
                state.activeTab !== "downloader" && (
                  <div className="flex items-center justify-end mt-8 pt-6 border-t border-neutral-700/50">
                    <div className="flex gap-3">
                      <Button
                        onClick={state.handleSave}
                        className={
                          state.hasUnsavedChanges
                            ? "bg-linear-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white shadow-lg shadow-amber-500/25"
                            : "bg-neutral-700 text-neutral-300 hover:bg-neutral-600"
                        }
                      >
                        <Save className="w-4 h-4 mr-2" /> 保存设置
                      </Button>
                    </div>
                  </div>
                )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ControlPage;
