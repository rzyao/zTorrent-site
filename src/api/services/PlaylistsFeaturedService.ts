import type { CancelablePromise } from "../core/CancelablePromise";
import { OpenAPI } from "../core/OpenAPI";
import { request as __request } from "../core/request";
import type { FeaturedPlaylistsDto } from "../models/FeaturedPlaylistsDto";
import type { FeaturedPlaylist } from "../models/FeaturedPlaylist";

export class PlaylistsFeaturedService {
  public static playlistFeaturedControllerList(
    requestBody: FeaturedPlaylistsDto,
  ): CancelablePromise<{
    code?: number;
    message?: string;
    data?: Array<FeaturedPlaylist>;
    path?: string;
    timestamp?: string;
  }> {
    return __request(OpenAPI, {
      method: "POST",
      url: "/playlists/featured/list",
      body: requestBody,
      mediaType: "application/json",
      errors: {
        400: "参数错误",
        401: "未认证",
        403: "禁止访问或账号禁用",
        404: "资源不存在",
        500: "服务器错误",
      },
    });
  }
}

