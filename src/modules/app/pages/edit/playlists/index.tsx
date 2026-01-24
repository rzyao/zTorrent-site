import { useEffect, useState } from "react";
import { useDynamicTitle } from "@/hooks/useDynamicTitle";
import { useLanguage } from "@/hooks/useLanguage";
import {
  ListVideo,
  Plus,
  Edit,
  Trash2,
  Save,
  X,
  Search,
  Lock,
  Globe,
  Users,
  GripVertical,
  Star,
  Calendar,
  Eye,
  Film,
} from "lucide-react";
import { Badge } from "@/modules/app/components/ui/badge";
import { Button } from "@/modules/app/components/ui/button";
import { useEditPlaylist } from "@/modules/app/pages/Edit/playlists/hooks/useEditPlaylist";

// 新增：拆分后的无状态子组件与自定义 Hook（本次页面仅先接入组件，Hook 后续步骤可接入）
import { PlaylistList } from "@/modules/app/pages/Edit/playlists/components/PlaylistList";
import { StatsPanel } from "@/modules/app/pages/Edit/playlists/components/StatsPanel";
import { PlaylistForm } from "@/modules/app/pages/Edit/playlists/components/PlaylistForm";
import { PlaylistDetails } from "@/modules/app/pages/Edit/playlists/components/PlaylistDetails";

export default function EditPlaylistPage() {
  const { t } = useLanguage();
  useDynamicTitle(t("edit.playlistTitle"));
  // 接入拆分后的业务逻辑 Hook
  const {
    playlists,
    searchQuery,
    setSearchQuery,
    selectedPlaylist,
    setSelectedPlaylist,
    isEditing,
    setIsEditing,
    isCreating,
    setIsCreating,
    editForm,
    setEditForm,
    showAddMovie,
    setShowAddMovie,
    available,
    addQuery,
    setAddQuery,
    isSearching,
    searchResults,
    handleCreateNew,
    handleEdit,
    handleSave,
    handleDelete,
    handleAddMovie,
    handleRemoveMovie,
    handleMoveMovie,
  } = useEditPlaylist();

  // 可见性展示逻辑已在子组件内部处理

  // 列表过滤交由 PlaylistList 组件内部完成

  // 所有副作用与后端调用已由 useEditPlaylist 管理

  // 映射函数已抽离至 '@/features/playlists/utils'

  return (
    <div className="mx-auto max-w-[1600px] px-4 py-6 md:px-6">
      {/* 页面标题 */}
      <div className="mb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-linear-to-br from-amber-500 to-orange-700 shadow-lg shadow-amber-500/30">
              <ListVideo className="h-5 w-5 text-white" />
            </div>
            <div className="flex items-end gap-1">
              <h1 className="text-3xl text-white">{t("editPlaylist.pageTitle")}</h1>
              <p className="mt-1 text-sm text-neutral-400">{t("editPlaylist.pageDesc")}</p>
            </div>
          </div>
          <Button
            onClick={handleCreateNew}
            className="bg-linear-to-r from-amber-500 to-orange-600 text-white shadow-lg shadow-amber-500/25 hover:from-amber-600 hover:to-orange-700"
          >
            <Plus className="mr-2 h-4 w-4" />
            {t("editPlaylist.createPlaylist")}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* 左侧片单列表 */}
        <div className="lg:col-span-1">
          {/* 使用无状态列表组件替换内联 JSX */}
          <PlaylistList
            playlists={playlists}
            selectedId={selectedPlaylist?.id ?? null}
            searchQuery={searchQuery}
            onSearchChange={(v) => setSearchQuery(v)}
            onSelect={(playlist) => {
              setSelectedPlaylist(playlist);
              setIsEditing(false);
              setIsCreating(false);
              setShowAddMovie(false);
            }}
          />
          {/* 统计信息组件 */}
          <StatsPanel playlists={playlists} />
        </div>

        {/* 右侧详情/编辑区 */}
        <div className="lg:col-span-2">
          <div className="rounded-2xl border border-neutral-700/50 bg-linear-to-br from-neutral-800/40 to-stone-900/40 p-6 backdrop-blur-sm md:p-8">
            {/* 新增：无状态表单组件，替代内联表单（旧表单将被禁用显示） */}
            <PlaylistForm
              isCreating={isCreating}
              isEditing={isEditing}
              editForm={editForm}
              onChange={setEditForm}
              onSave={handleSave}
              onCancel={() => {
                setIsCreating(false);
                setIsEditing(false);
              }}
            />
            {/* 创建/编辑表单 */}

            {/* 新增：无状态详情组件，替代内联详情（旧详情将被禁用显示） */}
            {false && (
              <PlaylistDetails
                playlist={selectedPlaylist}
                onEdit={handleEdit}
                onDelete={handleDelete}
                showAddMovie={showAddMovie}
                onToggleAddMovie={() => setShowAddMovie(!showAddMovie)}
                onAddMovie={handleAddMovie}
                onRemoveMovie={handleRemoveMovie}
                onMoveMovie={handleMoveMovie}
                available={available}
                addQuery={addQuery}
                onAddQueryChange={setAddQuery}
                isSearching={isSearching}
                searchResults={searchResults}
              />
            )}
            {/* 片单详情展示：使用拆分后的组件 */}
            {!isCreating && !isEditing && selectedPlaylist && (
              <PlaylistDetails
                playlist={selectedPlaylist}
                onEdit={handleEdit}
                onDelete={handleDelete}
                showAddMovie={showAddMovie}
                onToggleAddMovie={() => setShowAddMovie(!showAddMovie)}
                onAddMovie={handleAddMovie}
                onRemoveMovie={handleRemoveMovie}
                onMoveMovie={handleMoveMovie}
                available={available}
                addQuery={addQuery}
                onAddQueryChange={setAddQuery}
                isSearching={isSearching}
                searchResults={searchResults}
              />
            )}
            {/* 片单详情展示（旧内联块，已禁用） */}
            {false && !isCreating && !isEditing && selectedPlaylist && (
              <div className="space-y-6">
                {/* 片单头部 */}
                <div className="flex items-start gap-4">
                  <img
                    src={selectedPlaylist.cover}
                    alt={selectedPlaylist.title}
                    className="h-32 w-32 rounded-xl object-cover"
                  />
                  <div className="flex-1">
                    <div className="mb-2 flex items-start justify-between">
                      <div>
                        <h2 className="mb-2 text-2xl text-white">{selectedPlaylist.title}</h2>
                        <div className="mb-3 flex items-center gap-3" />
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={() => handleEdit(selectedPlaylist)}
                          className="bg-linear-to-r from-amber-500 to-orange-600 text-white hover:from-amber-600 hover:to-orange-700"
                        >
                          <Edit className="mr-2 h-4 w-4" />
                          编辑
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDelete(selectedPlaylist.id)}
                          className="border-red-500/30 text-red-400 hover:bg-red-500/10"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <p className="mb-3 text-sm text-neutral-400">{selectedPlaylist.description}</p>
                    <div className="flex items-center gap-4 text-xs text-neutral-500">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        创建于 {selectedPlaylist.createdAt}
                      </span>
                      <span className="flex items-center gap-1">
                        <Eye className="h-3 w-3" />
                        {selectedPlaylist.views} 次观看
                      </span>
                      <span className="flex items-center gap-1">
                        <Star className="h-3 w-3" />
                        {selectedPlaylist.likes} 个点赞
                      </span>
                    </div>
                  </div>
                </div>

                {/* 已改用 PlaylistDetails 组件的分隔与布局 */}

                {/* 影片列表 */}
                <div>
                  <div className="mb-4 flex items-center justify-between">
                    <h3 className="text-white">片单影片</h3>
                    <Button
                      size="sm"
                      onClick={() => setShowAddMovie(!showAddMovie)}
                      className="bg-linear-to-r from-amber-500 to-orange-600 text-white hover:from-amber-600 hover:to-orange-700"
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      添加影片
                    </Button>
                  </div>

                  {/* 添加影片面板 */}
                  {showAddMovie && (
                    <div className="mb-6 rounded-xl border border-amber-500/30 bg-neutral-900/30 p-6">
                      <h4 className="mb-4 text-white">从影片库选择</h4>
                      <div className="relative mb-4">
                        <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-neutral-500" />
                        <input
                          type="text"
                          value={addQuery}
                          onChange={(e) => setAddQuery(e.target.value)}
                          placeholder="搜索影片标题或原名..."
                          className="w-full rounded-lg border border-neutral-700 bg-neutral-900/50 py-2.5 pr-4 pl-10 text-white placeholder-neutral-500 focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/20 focus:outline-none"
                        />
                      </div>
                      {isSearching && <p className="mb-3 text-sm text-neutral-500">正在搜索...</p>}
                      {addQuery.trim() && !isSearching && searchResults.length === 0 && (
                        <p className="mb-3 text-sm text-neutral-500">暂无匹配影片</p>
                      )}
                      <div className="scrollbar-themed grid max-h-64 grid-cols-1 gap-3 overflow-y-auto">
                        {(addQuery.trim() ? searchResults : available).map((movie) => (
                          <div
                            key={movie.id}
                            className="flex items-center gap-3 rounded-lg border border-neutral-700/50 bg-neutral-800/50 p-3 transition-all hover:border-amber-500/30"
                          >
                            <img
                              src={movie.poster}
                              alt={movie.title}
                              className="h-16 w-12 rounded object-cover"
                            />
                            <div className="min-w-0 flex-1">
                              <h5 className="truncate text-sm text-white">{movie.title}</h5>
                              <p className="truncate text-xs text-neutral-400">
                                {movie.originalTitle} ({movie.year})
                              </p>
                              <div className="mt-1 flex items-center gap-2">
                                <span className="flex items-center gap-1 text-xs text-amber-400">
                                  <Star className="h-3 w-3 fill-amber-400" />
                                  {movie.rating}
                                </span>
                                <span className="text-xs text-neutral-500">
                                  {movie.torrentCount} 个版本
                                </span>
                              </div>
                            </div>
                            <Button
                              size="sm"
                              onClick={() => handleAddMovie(movie)}
                              className="bg-linear-to-r from-amber-500 to-orange-600 text-white hover:from-amber-600 hover:to-orange-700"
                            >
                              添加
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {selectedPlaylist.movies.length === 0 ? (
                    <div className="rounded-xl border border-dashed border-neutral-700 py-12 text-center">
                      <Film className="mx-auto mb-3 h-12 w-12 text-neutral-600" />
                      <p className="mb-3 text-sm text-neutral-500">片单中还没有影片</p>
                      <Button
                        size="sm"
                        onClick={() => setShowAddMovie(true)}
                        className="bg-linear-to-r from-amber-500 to-orange-600 text-white hover:from-amber-600 hover:to-orange-700"
                      >
                        <Plus className="mr-2 h-4 w-4" />
                        添加第一部影片
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {selectedPlaylist.movies.map((movie, index) => (
                        <div
                          key={movie.id}
                          className="group flex items-center gap-4 rounded-xl border border-neutral-700/50 bg-neutral-900/30 p-4 transition-all hover:border-neutral-600"
                        >
                          <div className="cursor-move text-neutral-600 group-hover:text-neutral-400">
                            <GripVertical className="h-5 w-5" />
                          </div>
                          <span className="w-6 text-sm text-neutral-500">{index + 1}</span>
                          <img
                            src={movie.poster}
                            alt={movie.title}
                            className="h-16 w-12 rounded-lg object-cover"
                          />
                          <div className="min-w-0 flex-1">
                            <h4 className="mb-1 truncate text-sm text-white">{movie.title}</h4>
                            <p className="mb-2 truncate text-xs text-neutral-400">
                              {movie.originalTitle}
                            </p>
                            <div className="flex items-center gap-3 text-xs text-neutral-400">
                              <Badge className="bg-neutral-800 text-neutral-300">
                                {movie.category}
                              </Badge>
                              <span>{movie.year}</span>
                              <span className="flex items-center gap-1">
                                <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                                {movie.rating}
                              </span>
                              <span>{movie.torrentCount} 个版本</span>
                            </div>
                          </div>
                          {/* 排序操作：上移/下移 */}
                          <div className="flex items-center gap-2">
                            <Button
                              size="sm"
                              variant="ghost"
                              className="text-neutral-400 hover:text-white"
                              onClick={() => handleMoveMovie(index, "up")}
                            >
                              上移
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="text-neutral-400 hover:text-white"
                              onClick={() => handleMoveMovie(index, "down")}
                            >
                              下移
                            </Button>
                          </div>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleRemoveMovie(movie.id)}
                            className="text-red-400 opacity-0 group-hover:opacity-100 hover:bg-red-500/10 hover:text-red-300"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* 空状态 */}
            {!isCreating && !isEditing && !selectedPlaylist && (
              <div className="py-20 text-center">
                <ListVideo className="mx-auto mb-4 h-16 w-16 text-neutral-600" />
                <h3 className="mb-2 text-lg text-white">{t("editPlaylist.selectPlaylist")}</h3>
                <p className="mb-6 text-sm text-neutral-400">
                  {t("editPlaylist.selectPlaylistHint")}
                </p>
                <Button
                  onClick={handleCreateNew}
                  className="bg-linear-to-r from-amber-500 to-orange-600 text-white shadow-lg shadow-amber-500/25 hover:from-amber-600 hover:to-orange-700"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  {t("editPlaylist.createNewPlaylist")}
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
