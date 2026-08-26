import { createContext, useContext, useEffect, useState } from "react";
import { DownloadersService } from "@/api/services/DownloadersService";
import { useAccess } from "@/context/AccessContext";

type Downloader = {
  id?: string;
  name?: string;
  type?: string;
  downloadPaths?: Array<{
    name?: string;
    path?: string;
    freeSpace?: number;
  }>;
};

type DownloadersState = {
  downloaders: Downloader[];
  loading: boolean;
  refresh: () => Promise<void>;
};

const DownloadersContext = createContext<DownloadersState>({
  downloaders: [],
  loading: false,
  refresh: async () => {},
});

export function DownloadersProvider({ children }: { children: React.ReactNode }) {
  const [downloaders, setDownloaders] = useState<Downloader[]>([]);
  const [loading, setLoading] = useState(false);
  // Need to know if user is logged in before fetching, usually AccessContext handles this,
  // but for simplicity we rely on the API call failing or returning empty if not auth.
  // Actually, let's use useAccess to trigger fetch on auth change.
  const { access } = useAccess();

  const refresh = async () => {
    // 凭证由 HttpOnly Cookie 携带；未登录时接口 401 由下方 catch 处理
    setLoading(true);
    try {
      const resp = await DownloadersService.downloadersControllerList();
      const body: any = (resp as any)?.code !== undefined ? resp : (resp as any)?.data;
      const data = Array.isArray(body?.data) ? body.data : [];
      setDownloaders(data);
    } catch (e) {
      console.error("Failed to fetch downloaders", e);
      // Optional: don't clear downloaders on error to keep stale data?
      // Or clear? Let's keep stale if we had some.
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refresh();
  }, [access.username]); // Re-fetch when user changes

  return (
    <DownloadersContext.Provider value={{ downloaders, loading, refresh }}>
      {children}
    </DownloadersContext.Provider>
  );
}

export function useDownloaders() {
  return useContext(DownloadersContext);
}
