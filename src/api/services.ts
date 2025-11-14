import { 
  postApiAuthLogin,
  postApiAuthRegister,
  postApiAuthSendVerificationCode,
  getApiTorrents,
  getApiTorrentsById,
  type PostApiAuthLoginData,
  type PostApiAuthLoginResponses,
  type PostApiAuthRegisterData,
  type PostApiAuthRegisterResponses,
  type PostApiAuthSendVerificationCodeData,
  type PostApiAuthSendVerificationCodeResponses,
  type GetApiTorrentsData,
  type GetApiTorrentsResponses,
  type GetApiTorrentsByIdData,
  type GetApiTorrentsByIdResponses
} from './sdk.gen';
import { client } from './client.gen';
import { AutoLogoutManager } from '../utils/autoLogout';

// 设置认证token的函数
function setAuthToken(token: string) {
  client.setConfig({
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
}

// 移除认证token的函数
function removeAuthToken() {
  client.setConfig({
    headers: {}
  });
}

// API错误处理
function handleApiError(error: any) {
  if (error.response) {
    // 服务器响应错误
    console.error('API Error:', error.response.status, error.response.data);
    throw new Error(error.response.data?.message || '服务器错误');
  } else if (error.request) {
    // 请求发送失败
    console.error('Network Error:', error.request);
    throw new Error('网络连接失败');
  } else {
    // 其他错误
    console.error('Error:', error.message);
    throw new Error(error.message || '未知错误');
  }
}

// 认证服务
export class AuthService {
  static async login(username: string, password: string, autoLogout: boolean = false): Promise<PostApiAuthLoginResponses> {
    try {
      const data: PostApiAuthLoginData = { username, password, autoLogout } as any;
      const response = await postApiAuthLogin({ body: data, client });
      
      if (response.data?.token) {
        localStorage.setItem('auth_token', response.data.token);
        localStorage.setItem('user_info', JSON.stringify(response.data.user));
        localStorage.setItem('auto_logout', autoLogout.toString());
        setAuthToken(response.data.token);
        if (autoLogout) {
          AutoLogoutManager.start();
        }
      }
      
      return response.data;
    } catch (error) {
      handleApiError(error);
      throw error;
    }
  }

  static async register(email: string, username: string, password: string, verificationCode: string): Promise<PostApiAuthRegisterResponses> {
    try {
      const data: PostApiAuthRegisterData = { email, username, password, verificationCode };
      const response = await postApiAuthRegister({ body: data, client });
      
      if (response.data?.token) {
        localStorage.setItem('auth_token', response.data.token);
        localStorage.setItem('user_info', JSON.stringify(response.data.user));
        setAuthToken(response.data.token);
      }
      
      return response.data;
    } catch (error) {
      handleApiError(error);
      throw error;
    }
  }

  static async sendVerificationCode(email: string): Promise<PostApiAuthSendVerificationCodeResponses> {
    try {
      const data: PostApiAuthSendVerificationCodeData = { email };
      const response = await postApiAuthSendVerificationCode({ body: data, client });
      return response.data;
    } catch (error) {
      handleApiError(error);
      throw error;
    }
  }

  static logout(): void {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_info');
    removeAuthToken();
  }

  static getToken(): string | null {
    return localStorage.getItem('auth_token');
  }

  static getUserInfo(): any | null {
    const userInfo = localStorage.getItem('user_info');
    return userInfo ? JSON.parse(userInfo) : null;
  }

  static isAuthenticated(): boolean {
    return !!this.getToken();
  }
}

// 种子服务
export class TorrentService {
  static async getTorrents(category?: string, page: number = 1, limit: number = 20): Promise<GetApiTorrentsResponses> {
    try {
      const response = await getApiTorrents({
        query: { category, page, limit },
        client
      });
      return response.data;
    } catch (error) {
      handleApiError(error);
      throw error;
    }
  }

  static async getTorrentById(id: number): Promise<GetApiTorrentsByIdResponses> {
    try {
      const response = await getApiTorrentsById({ path: { id }, client });
      return response.data;
    } catch (error) {
      handleApiError(error);
      throw error;
    }
  }
}

// 初始化token
const token = AuthService.getToken();
if (token) {
  setAuthToken(token);
}
