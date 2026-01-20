import { useEffect, useState, useRef } from "react";
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
  Image as ImageIcon,
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
  useDynamicTitle(t('edit.playlistTitle'));
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
    fileInputRef,
    handleCreateNew,
    handleEdit,
    handleSave,
    handleDelete,
    handleAddMovie,
    handleRemoveMovie,
    handleMoveMovie,
    handleUploadCoverClick,
    handleUploadCoverFile,
  } = useEditPlaylist();

  // 可见性展示逻辑已在子组件内部处理

  // 列表过滤交由 PlaylistList 组件内部完成

  // 所有副作用与后端调用已由 useEditPlaylist 管理

  // 映射函数已抽离至 '@/features/playlists/utils'

  return (
    <div className="max-w-[1600px] mx-auto px-4 md:px-6 py-6">
      {/* 页面标题 */}
      <div className="mb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-linear-to-br from-amber-500 to-orange-700 flex items-center justify-center shadow-lg shadow-amber-500/30">
              <ListVideo className="w-5 h-5 text-white" />
            </div>
            <div className="flex items-end gap-1">
              <h1 className="text-white text-3xl">{t('editPlaylist.pageTitle')}</h1>
              <p className="text-neutral-400 text-sm mt-1">
                {t('editPlaylist.pageDesc')}
              </p>
            </div>
          </div>
          <Button
            onClick={handleCreateNew}
            className="bg-linear-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white shadow-lg shadow-amber-500/25"
          >
            <Plus className="w-4 h-4 mr-2" />
            {t('editPlaylist.createPlaylist')}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
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
          <div className="bg-linear-to-br from-neutral-800/40 to-stone-900/40 backdrop-blur-sm rounded-2xl border border-neutral-700/50 p-6 md:p-8">
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
              fileInputRef={fileInputRef}
              onUploadClick={handleUploadCoverClick}
              onUploadFile={handleUploadCoverFile}
            />
            {/* 创建/编辑表单 */}
            {false && (
              <div className="space-y-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-linear-to-br from-amber-500 to-orange-600 flex items-center justify-center">
                      <Edit className="w-4 h-4 text-white" />
                    </div>
                    <h2 className="text-white text-xl">
                      {isCreating ? "创建片单" : "编辑片单"}
                    </h2>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      setIsCreating(false);
                      setIsEditing(false);
                    }}
                    className="text-neutral-400 hover:text-white"
                  >
                    <X className="w-5 h-5" />
                  </Button>
                </div>

                {/* 片单标题 */}
                <div className="space-y-2">
                  <label className="text-neutral-300 text-sm">片单标题</label>
                  <input
                    type="text"
                    value={editForm.title}
                    onChange={(e) =>
                      setEditForm({ ...editForm, title: e.target.value })
                    }
                    placeholder="输入片单标题..."
                    className="w-full bg-neutral-900/50 border border-neutral-700 rounded-lg px-4 py-2.5 text-white placeholder-neutral-500 focus:outline-none focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/20"
                  />
                </div>

                {/* 片单描述 */}
                <div className="space-y-2">
                  <label className="text-neutral-300 text-sm">片单描述</label>
                  <textarea
                    value={editForm.description}
                    onChange={(e) =>
                      setEditForm({ ...editForm, description: e.target.value })
                    }
                    rows={4}
                    placeholder="描述一下这个片单..."
                    className="w-full bg-neutral-900/50 border border-neutral-700 rounded-lg px-4 py-2.5 text-white placeholder-neutral-500 focus:outline-none focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/20 resize-none"
                  />
                </div>

                {/* 封面图片 */}
                <div className="space-y-2">
                  <label className="text-neutral-300 text-sm">封面图片</label>
                  <div className="flex gap-3">
                    <input
                      type="text"
                      value={editForm.cover}
                      onChange={(e) =>
                        setEditForm({ ...editForm, cover: e.target.value })
                      }
                      placeholder="输入图片URL..."
                      className="flex-1 bg-neutral-900/50 border border-neutral-700 rounded-lg px-4 py-2.5 text-white placeholder-neutral-500 focus:outline-none focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/20"
                    />
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleUploadCoverFile}
                    />
                    <Button
                      variant="outline"
                      onClick={handleUploadCoverClick}
                      className="border-amber-500/30 text-amber-400 hover:bg-amber-500/10"
                    >
                      <ImageIcon className="w-4 h-4 mr-2" />
                      上传
                    </Button>
                  </div>
                  {editForm.cover && (
                    <img
                      src={editForm.cover}
                      alt="预览"
                      className="w-full h-48 object-cover rounded-lg mt-2"
                    />
                  )}
                </div>

                {/* 可见性 */}
                <div className="space-y-2">
                  <label className="text-neutral-300 text-sm">可见性</label>
                  <div className="grid grid-cols-3 gap-3">
                    <button
                      onClick={() =>
                        setEditForm({ ...editForm, visibility: "public" })
                      }
                      className={`p-4 rounded-xl border transition-all ${editForm.visibility === "public"
                          ? "bg-green-500/20 border-green-500/50 text-green-400"
                          : "bg-neutral-900/30 border-neutral-700 text-neutral-400 hover:border-neutral-600"
                        }`}
                    >
                      <Globe className="w-5 h-5 mx-auto mb-2" />
                      <p className="text-sm">公开</p>
                    </button>
                    <button
                      onClick={() =>
                        setEditForm({ ...editForm, visibility: "friends" })
                      }
                      className={`p-4 rounded-xl border transition-all ${editForm.visibility === "friends"
                          ? "bg-blue-500/20 border-blue-500/50 text-blue-400"
                          : "bg-neutral-900/30 border-neutral-700 text-neutral-400 hover:border-neutral-600"
                        }`}
                    >
                      <Users className="w-5 h-5 mx-auto mb-2" />
                      <p className="text-sm">好友可见</p>
                    </button>
                    <button
                      onClick={() =>
                        setEditForm({ ...editForm, visibility: "private" })
                      }
                      className={`p-4 rounded-xl border transition-all ${editForm.visibility === "private"
                          ? "bg-red-500/20 border-red-500/50 text-red-400"
                          : "bg-neutral-900/30 border-neutral-700 text-neutral-400 hover:border-neutral-600"
                        }`}
                    >
                      <Lock className="w-5 h-5 mx-auto mb-2" />
                      <p className="text-sm">私密</p>
                    </button>
                  </div>
                </div>

                {/* 操作按钮 */}
                <div className="flex gap-3 pt-4">
                  <Button
                    onClick={handleSave}
                    disabled={!editForm.title}
                    className="flex-1 bg-linear-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white shadow-lg shadow-amber-500/25"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    保存片单
                  </Button>
                  <Button
                    onClick={() => {
                      setIsCreating(false);
                      setIsEditing(false);
                    }}
                    variant="outline"
                    className="border-neutral-700 text-neutral-400 hover:text-white hover:bg-neutral-700/30"
                  >
                    取消
                  </Button>
                </div>
              </div>
            )}

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
                    className="w-32 h-32 rounded-xl object-cover"
                  />
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h2 className="text-white text-2xl mb-2">
                          {selectedPlaylist.title}
                        </h2>
                        <div className="flex items-center gap-3 mb-3" />
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={() => handleEdit(selectedPlaylist)}
                          className="bg-linear-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white"
                        >
                          <Edit className="w-4 h-4 mr-2" />
                          编辑
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDelete(selectedPlaylist.id)}
                          className="border-red-500/30 text-red-400 hover:bg-red-500/10"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                    <p className="text-neutral-400 text-sm mb-3">
                      {selectedPlaylist.description}
                    </p>
                    <div className="flex items-center gap-4 text-xs text-neutral-500">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        创建于 {selectedPlaylist.createdAt}
                      </span>
                      <span className="flex items-center gap-1">
                        <Eye className="w-3 h-3" />
                        {selectedPlaylist.views} 次观看
                      </span>
                      <span className="flex items-center gap-1">
                        <Star className="w-3 h-3" />
                        {selectedPlaylist.likes} 个点赞
                      </span>
                    </div>
                  </div>
                </div>

                {/* 已改用 PlaylistDetails 组件的分隔与布局 */}

                {/* 影片列表 */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-white">片单影片</h3>
                    <Button
                      size="sm"
                      onClick={() => setShowAddMovie(!showAddMovie)}
                      className="bg-linear-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      添加影片
                    </Button>
                  </div>

                  {/* 添加影片面板 */}
                  {showAddMovie && (
                    <div className="mb-6 p-6 rounded-xl bg-neutral-900/30 border border-amber-500/30">
                      <h4 className="text-white mb-4">从影片库选择</h4>
                      <div className="relative mb-4">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
                        <input
                          type="text"
                          value={addQuery}
                          onChange={(e) => setAddQuery(e.target.value)}
                          placeholder="搜索影片标题或原名..."
                          className="w-full bg-neutral-900/50 border border-neutral-700 rounded-lg pl-10 pr-4 py-2.5 text-white placeholder-neutral-500 focus:outline-none focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/20"
                        />
                      </div>
                      {isSearching && (
                        <p className="text-neutral-500 text-sm mb-3">
                          正在搜索...
                        </p>
                      )}
                      {addQuery.trim() &&
                        !isSearching &&
                        searchResults.length === 0 && (
                          <p className="text-neutral-500 text-sm mb-3">
                            暂无匹配影片
                          </p>
                        )}
                      <div className="grid grid-cols-1 gap-3 max-h-64 overflow-y-auto scrollbar-themed">
                        {(addQuery.trim() ? searchResults : available).map(
                          (movie) => (
                            <div
                              key={movie.id}
                              className="flex items-center gap-3 p-3 rounded-lg bg-neutral-800/50 border border-neutral-700/50 hover:border-amber-500/30 transition-all"
                            >
                              <img
                                src={movie.poster}
                                alt={movie.title}
                                className="w-12 h-16 rounded object-cover"
                              />
                              <div className="flex-1 min-w-0">
                                <h5 className="text-white text-sm truncate">
                                  {movie.title}
                                </h5>
                                <p className="text-neutral-400 text-xs truncate">
                                  {movie.originalTitle} ({movie.year})
                                </p>
                                <div className="flex items-center gap-2 mt-1">
                                  <span className="text-amber-400 text-xs flex items-center gap-1">
                                    <Star className="w-3 h-3 fill-amber-400" />
                                    {movie.rating}
                                  </span>
                                  <span className="text-neutral-500 text-xs">
                                    {movie.torrentCount} 个版本
                                  </span>
                                </div>
                              </div>
                              <Button
                                size="sm"
                                onClick={() => handleAddMovie(movie)}
                                className="bg-linear-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white"
                              >
                                添加
                              </Button>
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  )}

                  {selectedPlaylist.movies.length === 0 ? (
                    <div className="text-center py-12 border border-dashed border-neutral-700 rounded-xl">
                      <Film className="w-12 h-12 text-neutral-600 mx-auto mb-3" />
                      <p className="text-neutral-500 text-sm mb-3">
                        片单中还没有影片
                      </p>
                      <Button
                        size="sm"
                        onClick={() => setShowAddMovie(true)}
                        className="bg-linear-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        添加第一部影片
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {selectedPlaylist.movies.map((movie, index) => (
                        <div
                          key={movie.id}
                          className="flex items-center gap-4 p-4 rounded-xl bg-neutral-900/30 border border-neutral-700/50 hover:border-neutral-600 transition-all group"
                        >
                          <div className="cursor-move text-neutral-600 group-hover:text-neutral-400">
                            <GripVertical className="w-5 h-5" />
                          </div>
                          <span className="text-neutral-500 text-sm w-6">
                            {index + 1}
                          </span>
                          <img
                            src={movie.poster}
                            alt={movie.title}
                            className="w-12 h-16 rounded-lg object-cover"
                          />
                          <div className="flex-1 min-w-0">
                            <h4 className="text-white text-sm mb-1 truncate">
                              {movie.title}
                            </h4>
                            <p className="text-neutral-400 text-xs mb-2 truncate">
                              {movie.originalTitle}
                            </p>
                            <div className="flex items-center gap-3 text-xs text-neutral-400">
                              <Badge className="bg-neutral-800 text-neutral-300">
                                {movie.category}
                              </Badge>
                              <span>{movie.year}</span>
                              <span className="flex items-center gap-1">
                                <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
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
                            className="opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-300 hover:bg-red-500/10"
                          >
                            <Trash2 className="w-4 h-4" />
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
              <div className="text-center py-20">
                <ListVideo className="w-16 h-16 text-neutral-600 mx-auto mb-4" />
                <h3 className="text-white text-lg mb-2">{t('editPlaylist.selectPlaylist')}</h3>
                <p className="text-neutral-400 text-sm mb-6">
                  {t('editPlaylist.selectPlaylistHint')}
                </p>
                <Button
                  onClick={handleCreateNew}
                  className="bg-linear-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white shadow-lg shadow-amber-500/25"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  {t('editPlaylist.createNewPlaylist')}
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
