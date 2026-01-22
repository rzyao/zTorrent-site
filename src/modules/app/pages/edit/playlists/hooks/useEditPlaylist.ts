import { useEffect, useRef, useState } from "react";
import { usePlaylists } from "@/modules/app/hooks/usePlaylists";
import { ImagesService } from "@/api/services/ImagesService";
import { customToast } from "@/hooks/useToast";
import type {
  Playlist,
  Movie,
  Visibility,
  PlaylistType,
} from "@/modules/app/pages/Edit/playlists/types";
import {
  mapBackendPlaylistToLocal,
  mapBackendPlaylistSummaryToLocal,
  mapFilmListItemToMovie,
} from "@/modules/app/pages/Edit/playlists/utils";

/**
 * useEditPlaylist
 * 将 EditPlaylistPage 中的业务状态、副作用和事件处理逻辑集中到自定义 Hook，
 * 让页面组件只负责结构与子组件组合，提升可读性与可测试性。
 *
 * 设计要点：
 * - 将所有与片单编辑相关的状态聚合：列表、选中项、表单、搜索、添加影片等；
 * - 封装对后端的调用与数据映射，UI 层仅通过暴露的回调与数据交互；
 * - 对上传、排序、增删影片等操作统一处理错误提示与刷新细节；
 */
export function useEditPlaylist() {
  // 对接后端服务的通用 Hook
  const {
    listPlaylists,
    getPlaylist,
    createPlaylist,
    updatePlaylist,
    deletePlaylist,
    addFilm,
    removeFilm,
    reorderFilm,
    listItems,
    searchAddableItems,
  } = usePlaylists();

  // 片单列表与筛选
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const filteredPlaylists = playlists.filter(
    (p) =>
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  // 当前选中片单与表单编辑状态
  const [selectedPlaylist, setSelectedPlaylist] = useState<Playlist | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  // 创建/编辑表单
  const [editForm, setEditForm] = useState<{
    title: string;
    description: string;
    cover: string;
    visibility: Visibility;
    type: PlaylistType | undefined;
    tags: string[];
    category: string | undefined;
  }>({
    title: "",
    description: "",
    cover: "",
    visibility: "public",
    type: undefined,
    tags: [],
    category: undefined,
  });

  // 上传封面需要的隐藏文件输入
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // 添加影片面板状态
  const [showAddMovie, setShowAddMovie] = useState(false);
  const [available, setAvailable] = useState<Movie[]>([]);
  const [addQuery, setAddQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<Movie[]>([]);

  // 初始化与搜索时加载片单列表 + 可选影片库
  useEffect(() => {
    (async () => {
      try {
        const list = await listPlaylists({
          listType: "mine",
          page: 1,
          limit: 50,
          keyword: searchQuery,
        });
        const mapped = (list?.items ?? []).map(mapBackendPlaylistSummaryToLocal);
        setPlaylists(mapped);
      } catch {
        /* 保持静默，列表失败不阻塞页面 */
      }

      // 加载初始可添加项（当有选中片单时）
      if (selectedPlaylist?.id) {
        try {
          const res = await searchAddableItems({
            playlistId: selectedPlaylist.id,
            page: 1,
            limit: 50,
          });
          const items = res?.items ?? [];
          const mapped = items.map((f: any) => ({
            id: String(f.id),
            title: f.title,
            originalTitle: f.originalTitle || "",
            year: String(f.year || ""),
            poster: f.posterUrl || "",
            category: "",
            rating: Number(f.rating || 0),
            torrentCount: 0,
            isInPlaylist: f.isInPlaylist,
          }));
          setAvailable(mapped);
        } catch {
          /* 保持静默 */
        }
      }
    })();
  }, [searchQuery, selectedPlaylist?.id, listPlaylists, searchAddableItems]);

  // 添加影片面板的搜索节流与结果填充
  useEffect(() => {
    if (!showAddMovie) return;
    const q = addQuery.trim();
    if (!q) {
      setSearchResults([]);
      return;
    }
    setIsSearching(true);
    const handler = setTimeout(async () => {
      if (!selectedPlaylist?.id) return;
      try {
        const res = await searchAddableItems({
          playlistId: selectedPlaylist.id,
          page: 1,
          limit: 50,
          keyword: q,
        });
        const items = res?.items ?? [];
        const mapped = items.map((f: any) => ({
          id: String(f.id),
          title: f.title,
          originalTitle: f.originalTitle || "",
          year: String(f.year || ""),
          poster: f.posterUrl || "",
          category: "",
          rating: Number(f.rating || 0),
          torrentCount: 0,
          isInPlaylist: f.isInPlaylist,
        }));
        setSearchResults(mapped);
      } catch (e: any) {
        // Global interceptor handles API errors
      } finally {
        setIsSearching(false);
      }
    }, 300);
    return () => clearTimeout(handler);
  }, [addQuery, showAddMovie]);

  // 在选择片单后刷新详情与关联影片（避免编辑/创建时重复请求）
  useEffect(() => {
    (async () => {
      if (!selectedPlaylist?.id || isCreating || isEditing) return;
      try {
        const detail = await getPlaylist(selectedPlaylist.id);
        const mapped = mapBackendPlaylistToLocal(detail);
        // 临时修复：后端 GET 响应缺失 category，从 playlists 数组或当前 selectedPlaylist 中回填
        if (!mapped.category) {
          const existing = playlists.find((p) => p.id === mapped.id);
          mapped.category = existing?.category || selectedPlaylist.category || "";
        }
        setSelectedPlaylist(mapped);
      } catch {
        /* 保持静默 */
      }
      try {
        const res = await listItems({ playlistId: selectedPlaylist.id, page: 1, limit: 100 });
        const items = res?.items ?? [];
        if (Array.isArray(items)) {
          const movies = items.map((f: any) => ({
            id: String(f?.itemId ?? ""),
            title: f?.title ?? "",
            originalTitle: "", // 详情接口目前暂无此字段
            year: String(f?.year ?? ""),
            poster: f?.posterUrl ?? "",
            category: "", // 详情接口目前暂无此字段
            rating: Number(f?.rating ?? 0),
            torrentCount: 0,
          }));
          setSelectedPlaylist((prev) => (prev ? { ...prev, movies } : prev));
        }
      } catch {
        /* 保持静默 */
      }
    })();
  }, [selectedPlaylist?.id, isCreating, isEditing]);

  /** 开始创建新片单 */
  const handleCreateNew = () => {
    setEditForm({
      title: "",
      description: "",
      cover: "",
      visibility: "public",
      type: undefined as any,
      tags: [],
      category: undefined,
    });
    setIsCreating(true);
    setIsEditing(false);
    setSelectedPlaylist(null);
  };

  /** 进入编辑模式 */
  const handleEdit = (playlist: Playlist) => {
    setEditForm({
      title: playlist.title,
      description: playlist.description,
      cover: playlist.cover,
      visibility: playlist.visibility,
      type: playlist.type || (undefined as any),
      tags: playlist.tags ?? [],
      category: playlist.category || undefined,
    });
    setSelectedPlaylist(playlist);
    setIsEditing(true);
    setIsCreating(false);
  };

  /** 保存片单：创建或更新 */
  const handleSave = async () => {
    const payload: any = {
      name: editForm.title,
      description: editForm.description,
      coverUrl: editForm.cover,
      visibility: editForm.visibility,
      type: editForm.type,
      tags: editForm.tags,
      category: editForm.category,
    };
    try {
      if (isCreating) {
        const res = await createPlaylist(payload);
        const newId = (res as any)?.id ?? res; // 兼容不同返回结构
        const detail = await getPlaylist(String(newId));
        const mapped = mapBackendPlaylistToLocal(detail);
        // 临时修复：后端 GET 响应缺失 category，手动回填
        if (!mapped.category && payload.category) mapped.category = payload.category;
        setPlaylists([mapped, ...playlists]);
        setSelectedPlaylist(mapped);
        setIsCreating(false);
      } else if (selectedPlaylist) {
        await updatePlaylist(selectedPlaylist.id, { ...payload, id: selectedPlaylist.id });
        const detail = await getPlaylist(selectedPlaylist.id);
        const mapped = mapBackendPlaylistToLocal(detail);
        // 临时修复：后端 GET 响应缺失 category，手动回填
        if (!mapped.category && payload.category) mapped.category = payload.category;
        setPlaylists(playlists.map((p) => (p.id === mapped.id ? mapped : p)));
        setSelectedPlaylist(mapped);
        setIsEditing(false);
      }
    } catch (e: any) {
      // Global interceptor handles API errors
    }
  };

  /** 删除片单 */
  const handleDelete = async (id: string) => {
    try {
      await deletePlaylist(id);
      setPlaylists(playlists.filter((p) => p.id !== id));
      if (selectedPlaylist?.id === id) {
        setSelectedPlaylist(null);
      }
      customToast.success("删除成功");
    } catch (e: any) {
      // Global interceptor handles API errors
    }
  };

  /** 封装：加载并合并片单最新详情与内容 */
  const refreshPlaylistContents = async (id: string) => {
    try {
      const [detail, itemsRes] = await Promise.all([
        getPlaylist(id),
        listItems({ playlistId: id, page: 1, limit: 100 }),
      ]);

      const mapped = mapBackendPlaylistToLocal(detail);
      const items = itemsRes?.items ?? [];
      const movies = items.map((f: any) => ({
        id: String(f?.itemId ?? ""),
        title: f?.title ?? "",
        originalTitle: "",
        year: String(f?.year ?? ""),
        poster: f?.posterUrl ?? "",
        category: "",
        rating: Number(f?.rating ?? 0),
        torrentCount: 0,
      }));

      const finalPlaylist = { ...mapped, movies };
      setSelectedPlaylist(finalPlaylist);
      setPlaylists((prev) => prev.map((p) => (p.id === id ? finalPlaylist : p)));
    } catch (e: any) {
      // Global interceptor handles API errors
    }
  };

  /** 添加影片到片单后刷新详情 */
  const handleAddMovie = async (movie: Movie) => {
    if (!selectedPlaylist) return;
    try {
      await addFilm(selectedPlaylist.id, movie.id);
      await refreshPlaylistContents(selectedPlaylist.id);
    } catch (e: any) {
      // Global interceptor handles API errors
    }
  };

  /** 从片单移除影片后刷新详情 */
  const handleRemoveMovie = async (movieId: string) => {
    if (!selectedPlaylist) return;
    try {
      await removeFilm(selectedPlaylist.id, movieId);
      await refreshPlaylistContents(selectedPlaylist.id);
    } catch (e: any) {
      // Global interceptor handles API errors
    }
  };

  /** 上/下移动影片并提交后端排序 */
  const handleMoveMovie = async (index: number, direction: "up" | "down") => {
    if (!selectedPlaylist) return;
    const len = selectedPlaylist.movies.length;
    const target = direction === "up" ? index - 1 : index + 1;
    if (target < 0 || target >= len) return;
    const nextMovies = [...selectedPlaylist.movies];
    const [m] = nextMovies.splice(index, 1);
    nextMovies.splice(target, 0, m);
    const order = nextMovies.map((x) => x.id);
    try {
      await reorderFilm(selectedPlaylist.id, order);
      await refreshPlaylistContents(selectedPlaylist.id);
    } catch (e: any) {
      // Global interceptor handles API errors
    }
  };

  /** 触发隐藏的文件输入进行封面上传 */
  const handleUploadCoverClick = () => {
    fileInputRef.current?.click();
  };

  /** 选择文件并上传封面到后端，成功后回写到表单 */
  const handleUploadCoverFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const reader = new FileReader();
      const asDataUrl: string = await new Promise((resolve, reject) => {
        reader.onload = () => resolve(String(reader.result));
        reader.onerror = () => reject(new Error("读取文件失败"));
        reader.readAsDataURL(file);
      });
      const base64 = asDataUrl.split(",")[1] || "";
      const resp = await ImagesService.imagesControllerUpload({
        content: base64,
        filename: file.name,
        mimeType: file.type,
      });
      const url = (resp?.data?.url ?? (resp as any)?.data?.url ?? "") as string;
      if (!url) throw new Error("上传失败");
      setEditForm((prev) => ({ ...prev, cover: url }));
    } catch (err: any) {
      // Global interceptor handles API errors
    }
  };

  return {
    // 数据与状态
    playlists,
    filteredPlaylists,
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
    // 事件回调
    handleCreateNew,
    handleEdit,
    handleSave,
    handleDelete,
    handleAddMovie,
    handleRemoveMovie,
    handleMoveMovie,
    handleUploadCoverClick,
    handleUploadCoverFile,
  } as const;
}
