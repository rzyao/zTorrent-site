import { useState, useCallback } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { getAuthService, getUsersService, getImagesService } from "@/api/lazy";
import { TorrentsSearchService } from "@/api/services/TorrentsSearchService";
import type { UpdateUserProfileDto } from "@/api/models/UpdateUserProfileDto";
import { extractErrorMessage } from "../utils/errorMessage";

// OpenAPI.BASE 的设置已在全局布局 AppLayout 中统一处理，避免重复配置导致环境切换不一致

// 认证Hook
export function useAuth() {
  const queryClient = useQueryClient();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(
    Boolean(localStorage.getItem("accessToken")),
  );

  const login = useCallback(
    async (username: string, password: string, autoLogout: boolean = false) => {
      setIsLoading(true);
      setError(null);

      try {
        const AuthService = await getAuthService();
        const response = await AuthService.authControllerLogin({
          username,
          password,
          idleLogout30m: autoLogout,
        });
        const body =
          (response as any)?.code !== undefined
            ? response
            : ((response as any)?.data ?? (response as any));
        const token =
          body?.data?.accessToken ??
          body?.accessToken ??
          body?.data?.access_token ??
          body?.access_token;
        if (!token) {
          throw new Error(body?.message || "登录失败：未返回令牌");
        }
        localStorage.setItem("accessToken", token);
        setIsAuthenticated(true);

        // 触发认证事件，通知路由守卫更新状态
        window.dispatchEvent(new Event("authChange"));

        // 登录成功后刷新导航菜单
        queryClient.invalidateQueries({ queryKey: ["navigation"] });

        return response;
      } catch (err: any) {
        const msg = extractErrorMessage(err, "登录失败");
        setError(msg);
        throw new Error(msg);
      } finally {
        setIsLoading(false);
      }
    },
    [queryClient],
  );

  const register = useCallback(async (email: string, username: string, password: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams(window.location.search);
      const inviteCodeParam = params.get("inviteCode") || "";
      const type = inviteCodeParam ? "invite" : "open";
      const AuthService = await getAuthService();
      const response = await AuthService.authControllerRegister({
        email,
        username,
        password,
        type,
        inviteCode: inviteCodeParam,
      });
      const body =
        (response as any)?.code !== undefined
          ? response
          : ((response as any)?.data ?? (response as any));
      const token =
        body?.data?.accessToken ??
        body?.accessToken ??
        body?.data?.access_token ??
        body?.access_token;
      if (!token) {
        throw new Error(body?.message || "注册失败：未返回令牌");
      }
      localStorage.setItem("accessToken", token);
      setIsAuthenticated(true);
      return response;
    } catch (err: any) {
      const msg = extractErrorMessage(err, "注册失败");
      setError(msg);
      throw new Error(msg);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const sendVerificationCode = useCallback(async (email: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const AuthService = await getAuthService();
      const response = await AuthService.authControllerRequestEmailCode({ email });
      const body = (response as any)?.code !== undefined ? response : (response as any)?.data;
      return body?.data ?? body;
    } catch (err: any) {
      setError(err.message || "发送验证码失败");
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("accessToken");
    setIsAuthenticated(false);

    // 登出后刷新导航菜单
    queryClient.invalidateQueries({ queryKey: ["navigation"] });
  }, [queryClient]);

  return {
    login,
    register,
    sendVerificationCode,
    logout,
    isLoading,
    error,
    isAuthenticated,
  };
}

// 种子Hook
export function useTorrents() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [torrents, setTorrents] = useState<any | null>(null);

  const fetchTorrents = useCallback(
    async (category?: string, page: number = 1, limit: number = 20) => {
      setIsLoading(true);
      setError(null);

      try {
        // 接口重命名适配：旧方法名 torrentsControllerList → 新方法名 torrentsControllerListTorrentsForUser
        // 原因：后端 OpenAPI operationId 统一为“用户可展示的种子列表”
        // 同时参数名 pageSize → limit（参考 UserListTorrentsDto），其余参数保持一致
        const response = await TorrentsSearchService.torrentSearchControllerList({
          category,
          page,
          limit,
        });
        const body = (response as any)?.code !== undefined ? response : (response as any)?.data;
        setTorrents(body?.data ?? body);
        return body?.data ?? body;
      } catch (err: any) {
        setError(err.message || "获取种子列表失败");
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [],
  );

  const getTorrentById = useCallback(async (id: number) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await TorrentsSearchService.torrentSearchControllerDetail({
        id: String(id),
      });
      const body = (response as any)?.code !== undefined ? response : (response as any)?.data;
      return body?.data ?? body;
    } catch (err: any) {
      setError(err.message || "获取种子详情失败");
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    fetchTorrents,
    getTorrentById,
    torrents,
    isLoading,
    error,
  };
}

export function useUserProfile() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const toAbsoluteUrl = useCallback((u: string) => {
    if (/^https?:\/\//i.test(u)) return u;
    if (/^data:/i.test(u)) return u;
    const base = String(
      (typeof window !== "undefined" ? window.location.origin : "") || "",
    ).replace(/\/$/, "");
    const path = u.startsWith("/") ? u : `/${u}`;
    return `${base}${path}`;
  }, []);

  const updateProfile = useCallback(async (payload: Partial<UpdateUserProfileDto>) => {
    setIsLoading(true);
    setError(null);
    try {
      const UsersService = await getUsersService();
      const response = await UsersService.usersProfileControllerUpdate(payload as any);
      const body =
        (response as any)?.code !== undefined
          ? response
          : ((response as any)?.data ?? (response as any));
      return body?.data ?? body;
    } catch (err: any) {
      const msg = extractErrorMessage(err, "更新资料失败");
      setError(msg);
      throw new Error(msg);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const setAvatar = useCallback(async (url: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const UsersService = await getUsersService();
      const response = await UsersService.usersProfileControllerSetAvatar({
        url: toAbsoluteUrl(url),
      });
      const body =
        (response as any)?.code !== undefined
          ? response
          : ((response as any)?.data ?? (response as any));
      return body?.data ?? body;
    } catch (err: any) {
      const msg = extractErrorMessage(err, "设置头像失败");
      setError(msg);
      throw new Error(msg);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const uploadAvatar = useCallback(async (file: File) => {
    setIsLoading(true);
    setError(null);
    try {
      const type = file.type;
      const size = file.size;
      if (!["image/png", "image/jpeg"].includes(type)) {
        throw new Error("仅支持 JPG/PNG 格式");
      }
      if (size > 2 * 1024 * 1024) {
        throw new Error("图片大小不能超过 2MB");
      }
      const dataUrl: string = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(String(reader.result));
        reader.onerror = () => reject(new Error("读取文件失败"));
        reader.readAsDataURL(file);
      });
      const ImagesService = await getImagesService();
      const response = await ImagesService.imagesControllerUpload({
        content: dataUrl,
        filename: file.name,
        mimeType: type,
      });
      const body =
        (response as any)?.code !== undefined
          ? response
          : ((response as any)?.data ?? (response as any));
      const url = body?.data?.url ?? body?.url ?? undefined;
      if (!url) {
        throw new Error("上传失败");
      }
      return toAbsoluteUrl(String(url));
    } catch (err: any) {
      const msg = extractErrorMessage(err, "上传头像失败");
      setError(msg);
      throw new Error(msg);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    updateProfile,
    setAvatar,
    uploadAvatar,
    isLoading,
    error,
  };
}
